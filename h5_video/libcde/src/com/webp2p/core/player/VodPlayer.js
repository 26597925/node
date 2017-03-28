p2p$.ns('com.webp2p.core.player');
p2p$.com.webp2p.core.player.VodPlayer = p2p$.com.webp2p.core.player.BasePlayer
		.extend_({

			kNoFirstSeek : -1,
			kFirstSeekInit : 0,
			kFirstSeekWaitDownLoadSegment : 1,
			kFirstSeekDownLoadSegmentOk : 2,
			kFirstSeekStatusDone : 3,

			seekForSafariPlay_ : false,
			firstSeekStatus_ : -1,
			firstSeekPosition_ : 0,
			jump2SeekPostion_ : false,
			addNextSegmentId_ : false,
			addedSegment_ : null,
			init : function(wrapper) {
				this._super(wrapper);
				this.seekForSafariPlay_ = false;
				this.firstSeekStatus_ = -1;
				this.firstSeekPosition_ = 0;
				this.jump2SeekPostion_ = false;
				this.addNextSegmentId_ = false;
				this.playerContext_.metaDataType_ = p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod;
			},
			play : function() {
				if (!this.video_) {
					return;
				}
				if (this.video_.paused) {
					this.video_.play();
				}
				if (!this.macSafariPattern_ || this.video_.currentTime > 0.1) {
					return;
				}
				this.jump2SeekPostion_ = true;
				this.video_.currentTime = 0.1;
				return;
			},
			getBlock_ : function(nextSegment) {
				if (this.metaData_) {
					if (!this.addNextSegmentId_) {
						for ( var n = 0; n < this.metaData_.segments_.length - 1; n++) {
							var segment = this.metaData_.segments_[n];
							var segment2 = this.metaData_.segments_[n + 1];
							segment.nextId_ = segment2.id_;
							if (n == this.metaData_.segments_.length - 2) {
								segment2.nextId_ = -1;
							}
							this.addNextSegmentId_ = true;
						}
					}

					for ( var n = 0; n < this.metaData_.segments_.length; n++) {
						var segment = this.metaData_.segments_[n];
						if (segment.id_ == nextSegment) {
							return segment;
						}
					}
				} else {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::VodPlayer::Meta data is null"));
					return null;
				}
			},
			refreshUrgentSegment_ : function(segmentId) {
				this.urgentSegment_ = segmentId;
			},
			playSegment_ : function() {
				if (!this.playerContext_.avccName_) {
					return;
				}

				if (!this.mediaSource_) {
					P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::Create media source ..."));
					this.sourceBuffer_ = null;
					this.mediaSource_ = this.createMediaSource_();
					this.video_.src = window.URL.createObjectURL(this.mediaSource_);
					if (this.wrapper_.onvideosrc) {
						this.wrapper_.onvideosrc();
					}
					if (this.firstSeekStatus_ != this.kFirstSeekWaitDownLoadSegment) {
						// this.video_.play();
					}
				}

				if (!this.sourceBuffer_) {
					this.delayTime_++;
					if (this.delayTime_ > 500) {
						P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::VodPlayer::Play segment with delay count({0})", this.delayTime_));
					}
					return;
				}
				if (this.sourceBuffer_.updating) {
					return;
				}

				var currentTime = this.video_.currentTime.toFixed(1);
				var vRemaining = this.video_.duration - this.video_.currentTime;
				if (this.playerContext_.lastCurrentTime_ == currentTime && !this.video_.paused && !this.video_.ended && Math.abs(vRemaining) > 5) {
					this.breakTimes_++;
					if (this.breakTimes_ > 4) {
						if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.canplay
								|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeked
								|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.breakend) {
							if (this.wrapper_.onbufferstart) {
								P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Breakstart onbufferend current({0}), status({1})", this.video_.currentTime
										.toFixed(1), this.playerContext_.videoStatus_));
								this.wrapper_.onbufferstart();
							}
							this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.breakstart;
						}
					}
					if (this.breakTimes_ % 5 == 1) {
						P2P_ULOG_INFO(P2P_ULOG_FMT(
								"core::player::VodPlayer break {0} times, current {1}, status({2}), blockLength({3}), sourceIdle({4}), bufferLength({5})...",
								this.breakTimes_, currentTime, this.playerContext_.videoStatus_, this.blockList_.length, this.sourceIdle_,
								this.playerContext_.bufferLength_));
					}

					// if (this.breakTimes_ > 10) {
					// var seekToTime = this.video_.currentTime + 0.2;
					// if (seekToTime < this.video_.duration - 1) {
					// P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer
					// break {0} times ...,seek to {1}", this.breakTimes_,
					// seekToTime));
					// this.seek(seekToTime);
					// }
					// }
				}

				if (this.playerContext_.lastCurrentTime_ != currentTime && !this.video_.paused) {
					if (this.breakTimes_ > 4) {
						if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.breakstart) {
							if (this.wrapper_.onbufferend) {
								P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Breakend onbufferend current({0}), status({1})", this.video_.currentTime
										.toFixed(1), this.playerContext_.videoStatus_));
								this.wrapper_.onbufferend();
							}
							this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.breakend;
						}
					}
					this.breakTimes_ = 0;
					this.playerContext_.lastCurrentTime_ = currentTime;
				}

				if (this.playerContext_.playState_ == p2p$.com.webp2p.core.player.PLAY_STATES.SEEKING && this.existTime_(this.preSeekTime_)) {
					this.playerContext_.playState_ = p2p$.com.webp2p.core.player.PLAY_STATES.SEEKED;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Play exist time({0}), state({1})", this.preSeekTime_, this.playerContext_.playState_));
				}

				if (this.playerContext_.playState_ == p2p$.com.webp2p.core.player.PLAY_STATES.SEEKED) {
					if (this.macSafariPattern_) {
						P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::Play segment firstSeekStatus={0} "
								+ "preSeekTime_({1})=firstSeekPosition_=({2})={3}", this.firstSeekStatus_, this.preSeekTime_, this.firstSeekPosition_,
								(this.preSeekTime_ == this.firstSeekPosition_)));
						do {
							if (this.firstSeekStatus_ == this.kFirstSeekStatusDone) {
								this.firstSeekStatus_ = this.kNoFirstSeek;
								if (this.preSeekTime_ == this.firstSeekPosition_) {
									break;
								}
							}
							this.jump2SeekPostion_ = true;
							this.video_.currentTime = this.preSeekTime_;
							P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::Play segment video current time == pre seek time"));
						} while (0);
					}
					// if (!this.macSafariPattern_) {
					// this.video_.play();
					// }
					this.playerContext_.playState_ = p2p$.com.webp2p.core.player.PLAY_STATES.PLAY;
					P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::playSegment existTime({0}) playState({1})", this.preSeekTime_,
							this.playerContext_.playState_));
				}
				this.calculateBufferLength_();

				if (this.blockList_.length > 0 && this.sourceIdle_ && this.playerContext_.bufferLength_ < 3) {
					// add source
					var streamInfo = this.blockList_[0];
					this.blockList_.shift();

					// if (this.playerContext_.playState_ ==
					// p2p$.com.webp2p.core.player.PLAY_STATES.SEEKING &&
					// this.existTime_(this.preSeekTime_)) {
					//
					// } else {
					if (streamInfo.block.index_ == 0 && !this.seekForSafariPlay_) {
						this.isFirstSegment_ = true;
						this.seekForSafariPlay_ = true;
					}
					this.sourceBuffer_.appendBuffer(streamInfo.data);
					this.addedSegment_ = streamInfo.block;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Add data success ,buffer({0}),"
							+ "block({1}s), segment({2}), start time ({3}),  timestamp({4}),segment length ({5})",
							this.playerContext_.bufferLength_.toFixed(2), streamInfo.block.duration_ / 1000, streamInfo.block.id_,
							streamInfo.block.startTime_ / 1000, streamInfo.block.timestamp_, streamInfo.data.length));
					// }
					if (this.playerContext_.playState_ == p2p$.com.webp2p.core.player.PLAY_STATES.SEEKING) {
						// chrome don't need to pause
						if (this.macSafariPattern_) {
							this.video_.pause();
						}
					}
				}
			},

			calculateBufferLength_ : function() {
				if (!this.video_) {
					return;
				}

				var _st = 0;
				var _ed = 0;
				if (this.playerContext_.playState_ != p2p$.com.webp2p.core.player.PLAY_STATES.PLAY) {
					this.preTime_ = this.preSeekTime_;
				} else {
					this.preTime_ = this.video_.currentTime;
				}
				this.playerContext_.bufferLength_ = 0;
				if (this.playerContext_.bufferd_) {

					this.playerContext_.buffers_ = [];
					for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
						var _start = this.playerContext_.bufferd_.start(i);
						var _end = this.playerContext_.bufferd_.end(i);
						this.playerContext_.buffers_.push([ _start, _end ]);
					}

					for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
						_st = this.playerContext_.bufferd_.start(i);
						_ed = this.playerContext_.bufferd_.end(i);

						if (this.video_.currentTime < 1 && this.isFirstSegment_) {
							this.playerContext_.bufferLength_ = 4;

							// if the device is the mobile phone or the safari om mac book
							if (this.macSafariPattern_) {
								this.seekForSafariPlay_ = true;
								this.isFirstSegment_ = false;
								// wating for playing by external call 'play' method
								break;
							}
							if (this.onErrorReplay_) {
								this.video_.currentTime = _st;
								// this.video_.play();
								this.onErrorReplay_ = null;
							}
							// var platform = p2p$.com.webp2p.core.supernode.Enviroment.getOSType_();
							// var position = platform.indexOf("Win");
							// if (position == -1) {
							// // this.video_.currentTime = _st;
							// }

						} else {
							if (_st > this.preTime_) {
								this.playerContext_.bufferLength_ += (_ed - _st);
							} else if (_st <= this.preTime_ && _ed >= this.preTime_) {
								this.playerContext_.bufferLength_ = (_ed - this.preTime_);
							}
						}

					}
				}
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::vod::Player::Calculate buffer, current({0}), pre({1}), buffer({2}), "
						+ "pre segment({3}), next segment({4}), play state({5})", this.video_.currentTime, this.preTime_, this.playerContext_.bufferLength_,
						this.preSegmentId_, this.nextSegmentId_, this.playerContext_.playState_));
			},

			seek : function(postion) {
				if (!this.mediaSource_) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Seek postion ({0}),mediaSource is null", postion));
					return;
				}
				if (isNaN(postion)) {
					return;
				}
				if (postion <= 1) {
					postion = 1;
				}
				if (postion >= this.mediaSource_.duration) {
					postion = this.mediaSource_.duration - 0.5;
				}
				var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
				this.preSeekTime_ = Number(postion).toFixed(0);
				if (!this.macSafariPattern_) {
					this.video_.currentTime = postion;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Seek vtime({0}) seekTo({1})", time, this.preSeekTime_));
				} else {
					if (this.innerSeek_) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Seek innerseek return vtime({0}) seekTo({1})", time, this.preSeekTime_));
						return;
					}
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::seek videoStatus({0})", this.playerContext_.videoStatus_));
					if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.canplay
							|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking
							|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeked
							|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.breakend) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::seek vtime({0}) status({1})", time, this.playerContext_.videoStatus_));
						if (this.wrapper_.onbufferstart) {
							P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Seek start seeking bufferstart  seekTo({0})", this.preSeekTime_));
							this.wrapper_.onbufferstart();
						}
						this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking;
					}
					// this.video_.pause();
					P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::seek time({0}) isPaused({1})", time, this.video_.paused));

					this.seek2(postion);
				}

			},

			seek2 : function(time) {
				var seek2Segment = this.findSegment_(time);
				if (seek2Segment) {
					this.playerContext_.playState_ = p2p$.com.webp2p.core.player.PLAY_STATES.SEEKING;
					this.nextSegmentId_ = seek2Segment.id_;
					try {
						this.sourceBuffer_.abort(); // mac
						// safari
						// play
					} catch (e) {
						P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::VodPlayer::seek2 abort error({0})", e));
					}
					if (this.macSafariPattern_ || !this.existTime_(this.preSeekTime_)) {
						if (this.firstSeekStatus_ != this.kFirstSeekDownLoadSegmentOk) {
							try {
								this.sourceBuffer_.remove(0, this.mediaSource_.duration);
								P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::seek2 remove length {0}", this.sourceBuffer_.buffered.length));
								for ( var i = 0; i < this.sourceBuffer_.buffered.length; i++) {
									P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::seek2 remove: start: {0}, end: {1}, length: {2}",
											this.sourceBuffer_.buffered.start(i), this.sourceBuffer_.buffered.end(i), this.sourceBuffer_.buffered.length));
								}
							} catch (e) {
								P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::VodPlayer::seek2 remove error({0})", e));
							}
						}

					}
					this.blockList_ = [];
					this.playerContext_.bufferLength_ = 0;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::seek2 seek to({0}), next segment({1}), state({2})", time, this.nextSegmentId_,
							this.playerContext_.playState_));
					this.onLoop_();
				} else {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::seek2 find segment failed, seek to({0}), next segment({1})", time, this.nextSegmentId_));
				}
			},

			onVideoTimeUpdate_ : function() {
				if (this.videoDuration_ < 1) {
					return;
				}
				this._super();
				var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
				this.playerContext_.currentPlayTime_ = time;
				var remain = (this.videoDuration_ - time).toFixed(1);
				if (Math.abs(remain) <= 0.5 && !this.VideoEnd_) {
					this.VideoEnd_ = true;
					this.onEnded_();
				}
				if (this.VideoEnd_ && this.videoDuration_ - time > 0.5) {
					this.VideoEnd_ = null;
				}
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::Video time update, time({0}) remain({1}), pre seek({2})", time, remain, this.preSeekTime_));
			},

			onVideoSeeking_ : function() {

				var time = this.video_.currentTime ? this.video_.currentTime : 0;
				if (this.macSafariPattern_) {
					if (this.jump2SeekPostion_) {
						P2P_ULOG_INFO(P2P_ULOG_FMT(
								"core::player::VodPlayer::onVideoSeeking innerSeek return vtime({0}) seekTo({1}) innerSeek({2}) videoStatus({3})", time,
								this.preSeekTime_, this.jump2SeekPostion_, this.playerContext_.videoStatus_));
						return;
					}
					if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking) {
						P2P_ULOG_INFO(P2P_ULOG_FMT(
								"core::player::VodPlayer::onVideoSeeking autoBackSeek return vtime({0}) seekTo({1}) innerSeek({2}) videoStatus({3})", time,
								this.preSeekTime_, this.jump2SeekPostion_, this.playerContext_.videoStatus_));
						return;
					}

				}
				if (this.firstSeekStatus_ != this.kNoFirstSeek) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeking firstSeek start"));
				}
				this.preSeekTime_ = time;
				if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.canplay
						|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.loadstart
						|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking
						|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeked
						|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.breakend) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeking vtime({0}) seekTo({1}) status({2})", time, this.preSeekTime_,
							this.playerContext_.videoStatus_));
					if (this.wrapper_.onbufferstart) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeking start seeking bufferstart"));
						this.wrapper_.onbufferstart();
					}
					this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking;
				}
				// safari need pause the video first for seeking
				if (this.macSafariPattern_) {
					this.video_.pause();
				}
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeking to({0}), paused({1})", time, this.video_.paused));
				this.seek2(time);
			},

			onVideoSeeked_ : function() {
				var time = this.video_.currentTime ? this.video_.currentTime : 0;
				if (this.macSafariPattern_) {
					if (this.jump2SeekPostion_) {
						this.jump2SeekPostion_ = false;
						P2P_ULOG_INFO(P2P_ULOG_FMT(
								"core::player::VodPlayer::onVideoSeeked innerseek return vtime({0}) seekTo({1}) innerSeek({2}) videoStatus({3})", time,
								this.preSeekTime_, this.jump2SeekPostion_, this.playerContext_.videoStatus_));

						if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking
								|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.loadstart) {
							P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeked vtime({0}) status({1})", time, this.playerContext_.videoStatus_));
							if (this.wrapper_.onbufferend) {
								P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeked seeking bufferend"));
								this.wrapper_.onbufferend();
							}
							this.video_.play();
							this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.seeked;
						}

						return;

					} else if (this.firstSeekStatus_ == this.kFirstSeekDownLoadSegmentOk) {
						this.firstSeekStatus_ = this.kFirstSeekStatusDone;
						this.video_.play();
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeked firstSeek Done"));
					} else {
						P2P_ULOG_INFO(P2P_ULOG_FMT(
								"core::player::VodPlayer::onVideoSeeked autoBackSeek return vtime({0}) seekTo({1}) innerSeek({2}) videoStatus({3})", time,
								this.preSeekTime_, this.jump2SeekPostion_, this.playerContext_.videoStatus_));
					}
				} else {
					if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeked vtime({0}) status({1})", time, this.playerContext_.videoStatus_));
						if (this.wrapper_.onbufferend) {
							P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeked end seeking bufferend"));
							this.wrapper_.onbufferend();
						}
						this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.seeked;
						if (!this.video_.paused) {
							this.onVideoPlay_();
						}
						this.video_.play();

					} else if (this.firstSeekStatus_ == this.kFirstSeekDownLoadSegmentOk) {
						this.firstSeekStatus_ = this.kFirstSeekStatusDone;
						this.video_.play();
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeked firstSeek Done"));
					}

					return;
				}
			},

			onVideoCanPlay_ : function() {
				// onprepared onbufferend
				if (!this.macSafariPattern_) {
					this.onBufferEndAndOnPrepared_();
				}
			},
			onVideoProgress_ : function() {
				if (this.macSafariPattern_ && !this.firstProgress_) {
					this.firstProgress_ = true;
					this.onBufferEndAndOnPrepared_();
				}
			},
			onCanPlayThrough_ : function() {
				if (this.firstSeekStatus_ != undefined && this.firstSeekStatus_ == this.kNoFirstSeek) {
					if (this.macSafariPattern_) {
						this.onBufferEndAndOnPrepared_();
					}
				}
			},

			onVideoPlaying_ : function() {
				if (this.firstSeekStatus_ != undefined && this.firstSeekStatus_ != this.kNoFirstSeek) {
					if (this.macSafariPattern_) {
						this.onBufferEndAndOnPrepared_();
					}
				}
			},
			findMaxBuffered_ : function(time) {
				var buffered = -1;
				var segment = null;
				if (!this.metaData_) {
					return;
				}
				for ( var n = 0; n < this.metaData_.segments_.length; n++) {
					segment = this.metaData_.segments_[n];
					if (segment.startTime_ + segment.duration_ <= time * 1000) {
						continue;
					}
					if (segment.completedTime_ > 0) {
						buffered = (segment.startTime_ + segment.duration_ - 0) / 1000;
					} else {
						break;
					}
				}
				return buffered;
			},
			getCurrentBuffered : function() {
				var buffer = -1;
				if (this.video_) {
					buffer = this.findMaxBuffered_(this.getCurrentPosition());
				}
				return buffer;
			},
			onError_ : function() {
				this._super();
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Player error {0} times... init a new one", this.errorTimes_));
				this.clearMediaSource_();
				this.isFirstSegment_ = true;
				this.onErrorReplay_ = true;
				this.playerContext_.bufferd_ = null;
				this.playerContext_.avccName_ = null;
				this.playerContext_.aacName_ = null;
				this.playerContext_.bufferLength_ = 0;
				this.firstProgress_ = null;
				this.blockList_ = [];
				this.actived_ = true;
				this.video_.pause();
				this.errorReplayTime_ = this.playerContext_.currentPlayTime_;
				var seek2Segment = this.findSegment_(this.errorReplayTime_);
				if (seek2Segment) {
					this.nextSegmentId_ = seek2Segment.id_ + 1;
				} else {
					this.nextSegmentId_ = this.addedSegment_ ? this.addedSegment_.id_ : 0;
				}

				this.addedSegment_ = null;
				this.playerContext_.currentPlayTime_ = 0;
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::replay segment({0}),nextSegmentId2({1}),errorReplayTime({2})", (seek2Segment != null),
						this.nextSegmentId_, this.errorReplayTime_));
			}
		});