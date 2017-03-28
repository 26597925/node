p2p$.ns('com.webp2p.core.player');
p2p$.com.webp2p.core.player.ChromeVodPlayer = p2p$.com.webp2p.core.player.BasePlayer
		.extend_({

			kNoFirstSeek : -1,
			kFirstSeekInit : 0,
			kFirstSeekWaitDownLoadSegment : 1,
			kFirstSeekDownLoadSegmentOk : 2,
			kFirstSeekStatusDone : 3,

			firstSeekStatus_ : -1,
			firstSeekPosition_ : 0,
			jump2SeekPostion_ : false,
			addNextSegmentId_ : false,
			addedSegment_ : null,
			init : function(wrapper) {
				this._super(wrapper);
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
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Meta data is null"));
					return null;
				}
			},
			refreshUrgentSegment_ : function(segmentId) {
				if (!this.playerContext_.bufferd_) {
					return;
				}
				var vtime = this.video_.currentTime;
				if (vtime > 1) {
					var segment = this.getSegmentByVideoTime_(vtime);
					if (segment) {
						this.urgentSegment_ = segment.id_;
						P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::ChromeVodPlayer::refreshUrgentSegment1 requestSegment({0}),urgentSegment({1})", segmentId,
								this.urgentSegment_));
						return;
					}
				}
				this.urgentSegment_ = segmentId;
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::ChromeVodPlayer::refreshUrgentSegment2 requestSegment({0}),urgentSegment({1})", segmentId,
						this.urgentSegment_));
			},
			getSegmentByVideoTime_ : function(time) {
				time = time * 1000;
				var temp = null;
				for ( var n = 0; n < this.metaData_.segments_.length; n++) {
					var segment = this.metaData_.segments_[n];
					if (segment.timestamp_ <= time && time <= segment.timestamp_ + segment.duration_) {
						temp = segment;
					}
				}
				return temp;
			},
			getSegment_ : function() {
				if (this.blockList_.length >= 1) {
					return;
				}

				if (this.firstSeekStatus_ != undefined && this.firstSeekStatus_ == this.kFirstSeekInit) {
					this.firstSeekStatus_ = this.kFirstSeekWaitDownLoadSegment;
					var seek2Segment = this.findSegment_(this.firstSeekPosition_);
					if (seek2Segment) {
						this.nextSegmentId_ = seek2Segment.id_;
						this.preSeekTime_ = this.firstSeekPosition_;
					} else {
					}
				}

				var tempBlock = this.getBlock_(this.nextSegmentId_);
				if (!tempBlock) {
					if (this.nextSegmentId_ != -1) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::getSegment({0}) return({1})", this.nextSegmentId_, tempBlock));
					}
					return;
				}
				this.refreshUrgentSegment_(tempBlock.id_);

				var streamInfo = this.stream_.requestPlaySlice_(this.channel_.getId_(), tempBlock.id_, this.urgentSegment_);
				if (!streamInfo || !streamInfo.stream) {
					var nowTime = new Date().getTime();
					if (!this.lastSegmentFailedLogTime_ || (this.lastSegmentFailedLogTime_ + 10000) < nowTime) {
						this.lastSegmentFailedLogTime_ = nowTime;
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::vtime({0}) requestSegment({1}) stream({2}) urgentSegment({3})",
								this.video_ ? this.video_.currentTime.toFixed(2) : 0, tempBlock.id_, (streamInfo.stream != null), this.urgentSegment_));
					}
					return null;
				}
				this.preSegmentId_ = tempBlock.id_;
				this.nextSegmentId_ = tempBlock.nextId_;
				var startChangeTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();

				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Start change to mp4"));

				var stream = this.fileMp4_.processFileSegment_(streamInfo.stream, {
					start : tempBlock.startTime_ / 1000,
					duration : tempBlock.duration_,
					type : 0,
					width : tempBlock.pictureWidth_ || 960,
					height : tempBlock.pictureHeight_ || 400,
				}, this.initFnum_, this.playerContext_.isEncode_);
				tempBlock.timestamp_ = this.fileMp4_.startTime_;
				this.playerContext_.avccName_ = this.fileMp4_.getMediaStreamAvccName_();
				this.playerContext_.aacName_ = this.fileMp4_.getMediaStreamAacName_();
				this.initFnum_++;
				var endChangeTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
				P2P_ULOG_INFO(P2P_ULOG_FMT(
						"core::player::BasePlayer turn to mp4, segmentid({0}), before({1}), after({2}),timeuse({3}),playtime({4}),nextSegmentId({5})",
						tempBlock.id_, streamInfo.stream.length, stream.length, ((endChangeTime - startChangeTime) / 1000).toFixed(1),
						this.video_ ? this.video_.currentTime.toFixed(2) : 0, this.nextSegmentId_));
				this.blockList_.push({
					data : stream,
					block : tempBlock,
					mime : this.formatMimeTypeName_(this.playerContext_.avccName_, this.playerContext_.aacName_)
				});
			},
			playSegment_ : function() {
				if (!this.playerContext_.avccName_) {
					return;
				}

				if (!this.mediaSource_) {
					P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Create media source ..."));
					this.sourceBuffer_ = null;
					this.mediaSource_ = this.createMediaSource_();
					this.video_.src = window.URL.createObjectURL(this.mediaSource_);
					if (!this.firstSetSrc_ && this.wrapper_.onvideosrc) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::onvideosrc ..."));
						this.firstSetSrc_ = true;
						this.wrapper_.onvideosrc();
					}
					if (this.firstSeekStatus_ != this.kFirstSeekWaitDownLoadSegment) {
						// this.video_.play();
					}
				}

				if (!this.sourceBuffer_) {
					this.delayTime_++;
					if (this.delayTime_ > 500) {
						P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Play segment with delay count({0})", this.delayTime_));
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
								P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Breakstart onbufferstart current({0}), status({1})",
										this.video_.currentTime.toFixed(1), this.playerContext_.videoStatus_));
								this.wrapper_.onbufferstart();
							}
							this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.breakstart;
						}
					}
					// if (this.breakTimes_ > 10) {
					// var seekToTime = this.video_.currentTime + 0.2;
					// if (seekToTime < this.video_.duration - 1) {
					// P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer break {0} times ...,seek to {1}", this.breakTimes_, seekToTime));
					// this.seek(seekToTime);
					// }
					// }
					if (this.breakTimes_ < 5 || this.breakTimes_ % 5 == 1) {
						P2P_ULOG_INFO(P2P_ULOG_FMT(
								"core::player::ChromeVodPlayer break {0} times, current {1}, status({2}), blockLength({3}), sourceIdle({4}), bufferLength({5})...",
								this.breakTimes_, currentTime, this.playerContext_.videoStatus_, this.blockList_.length, this.sourceIdle_,
								this.playerContext_.bufferLength_));
					}
				}
				if (this.playerContext_.lastCurrentTime_ != currentTime && !this.video_.paused) {
					if (this.breakTimes_ > 4) {
						if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.breakstart) {
							if (this.wrapper_.onbufferend) {
								P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Breakend onbufferend current({0}), status({1})",
										this.video_.currentTime.toFixed(1), this.playerContext_.videoStatus_));
								this.wrapper_.onbufferend();
							}
							this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.breakend;
						}
					}
					this.breakTimes_ = 0;
					this.playerContext_.lastCurrentTime_ = currentTime;
				}
				this.calculateBufferLength_();
				var maxVideoBuffer = currentTime < 1 ? 10 : p2p$.com.webp2p.core.common.Number.maxUnsignedValue_();
				if (this.blockList_.length > 0 && this.sourceIdle_ && this.playerContext_.bufferLength_ < maxVideoBuffer) {
					// add source
					var streamInfo = this.blockList_[0];
					this.blockList_.shift();
					if (streamInfo.block.index_ == 0) {
						this.isFirstSegment_ = true;
					}
					var existTime = streamInfo.block.startTime_ / 1000 + 2;
					this.addedSegment_ = streamInfo.block;
					if (this.existTime_(existTime) && !this.onErrorReplay_) {
						return;
					}
					this.sourceBuffer_.appendBuffer(streamInfo.data);
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Add data success ,buffer({0}),"
							+ "block({1}s), segment({2}), start time ({3}),  timestamp({4}),segment length ({5})",
							this.playerContext_.bufferLength_.toFixed(2), streamInfo.block.duration_ / 1000, streamInfo.block.id_,
							streamInfo.block.startTime_ / 1000, streamInfo.block.timestamp_, streamInfo.data.length));
				}
			},

			calculateBufferLength_ : function() {
				if (!this.video_) {
					return;
				}

				var _st = 0;
				var _ed = 0;
				this.preTime_ = this.video_.currentTime;
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
							this.isFirstSegment_ = false;
							if (this.onErrorReplay_) {
								if (_st <= this.errorReplayTime_ && this.errorReplayTime_ <= _ed) {
									this.video_.currentTime = this.errorReplayTime_;
								} else {
									this.video_.currentTime = _st;
								}
								this.onErrorReplay_ = null;
							}

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
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Seek postion ({0}),mediaSource is null", postion));
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
				if (postion == 202.202) {
					this.onError_();
					return;
				}
				var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;

				// var seek2Segment = this.findSegment_(postion);
				// postion = seek2Segment.startTime_ / 1000;
				this.preSeekTime_ = Number(postion).toFixed(0);
				this.video_.currentTime = postion;
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Seek vtime({0}) seekTo({1})", time, this.preSeekTime_));
			},

			seek2 : function(time) {
				var seek2Segment = this.findSegment_(time);
				if (seek2Segment) {
					this.nextSegmentId_ = seek2Segment.id_;
					try {
						this.sourceBuffer_.abort();
					} catch (e) {
						P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::ChromeVodPlayer::seek2 abort error({0})", e));
					}
					this.blockList_ = [];
					this.playerContext_.bufferLength_ = 0;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::seek2 seek to({0}), next segment({1}), state({2})", time, this.nextSegmentId_,
							this.playerContext_.playState_));
					this.onLoop_();
				} else {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::seek2 find segment failed, seek to({0}), next segment({1})", time,
							this.nextSegmentId_));
				}
			},

			onVideoTimeUpdate_ : function() {
				if (parseFloat(this.videoDuration_) < 1) {
					return;
				}
				this._super();
				var time = parseFloat(this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0);
				this.playerContext_.currentPlayTime_ = time;
				var remain = parseFloat(this.videoDuration_) - time;

				// put a compulsory end event
				if (Math.abs(remain) < 5 && !this.endTimer_) {
					var me = this;
					this.endTimer_ = setTimeout(function() {
						me.endTimer_ = null;
						if (parseFloat(me.videoDuration_) - parseFloat(me.video_.currentTime) < 5) {
							if (!me.VideoEnd_) {
								me.VideoEnd_ = true;
								me.onEnded_(true);
							}
						}
					}, 5000);
				} else {
					if (this.endTimer_ && Math.abs(remain) > 5) {
						clearTimeout(this.endTimer_);
						this.endTimer_ = null;
					}
				}

				if (Math.abs(remain) <= 5) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Video time update, time({0}) remain({1}), pre seek({2})", time, remain,
							this.preSeekTime_));
				}
				if (Math.abs(remain) <= 0.5 && !this.VideoEnd_) {
					this.VideoEnd_ = true;
					this.onEnded_(false);
				}
				if (this.VideoEnd_ && parseFloat(this.videoDuration_) - time > 0.5) {
					this.VideoEnd_ = null;
				}
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Video time update, time({0}) remain({1}), pre seek({2})", time, remain,
						this.preSeekTime_));
			},

			onVideoSeeking_ : function() {
				var time = this.video_.currentTime ? this.video_.currentTime : 0;
				if (this.firstSeekStatus_ != this.kNoFirstSeek) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::onVideoSeeking firstSeek start"));
				}
				this.preSeekTime_ = time;
				// if (this.preSeekTime_ && this.existTime_(this.preSeekTime_)) {
				// P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::onVideoSeeking has buffer ({0}) ", this.preSeekTime_));
				// this.seek2(time);
				// return;
				// }
				if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.canplay
						|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.loadstart
						|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking
						|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeked
						|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.breakend) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::onVideoSeeking vtime({0}) seekTo({1}) status({2})", time, this.preSeekTime_,
							this.playerContext_.videoStatus_));
					if (this.wrapper_.onbufferstart) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Video event onVideoSeeking start seeking bufferstart"));
						this.wrapper_.onbufferstart();
					}
					this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking;
				}

				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::ChromeVodPlayer::onVideoSeeking to({0}), paused({1})", time, this.video_.paused));
				this.seek2(time);
			},

			onVideoSeeked_ : function() {
				var time = this.video_.currentTime ? this.video_.currentTime : 0;
				// if (this.preSeekTime_ && this.playerContext_.videoStatus_ != p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking
				// && this.existTime_(this.preSeekTime_)) {
				// P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::onVideoSeeked has buffer ({0}) ", this.preSeekTime_));
				// return;
				// }
				if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::onVideoSeeked vtime({0}) status({1})", time, this.playerContext_.videoStatus_));
					if (this.wrapper_.onbufferend) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Video event onVideoSeeked end seeking bufferend"));
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
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::onVideoSeeked firstSeek Done"));
				}
				return;
			},

			onVideoCanPlay_ : function() {
				// onprepared onbufferend
				if (!this.macSafariPattern_) {
					this.onBufferEndAndOnPrepared_();
				}
			},
			getCurrentBuffered : function() {
				var buffer = -1;
				if (this.video_) {
					var curTime = this.video_.currentTime ? this.video_.currentTime : 0;
					for ( var i = 0; i < this.video_.buffered.length; i++) {
						var start = this.video_.buffered.start(i);
						var end = this.video_.buffered.end(i);
						if (start <= curTime && curTime <= end) {
							buffer = end;
							break;
						}
					}
				}
				return buffer;
			},
			onError_ : function() {
				var isContinue = this._super();
				if (!isContinue) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Player error stop play ..."));
					this.stop();
					return false;
				}
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Player error {0} times... init a new one", this.errorTimes_));
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
				this.errorReplayTime_ = this.playerContext_.currentPlayTime_ + 1;
				var seek2Segment = this.findSegment_(this.errorReplayTime_);
				if (seek2Segment) {
					this.nextSegmentId_ = seek2Segment.id_;
				} else {
					this.nextSegmentId_ = this.addedSegment_ ? this.addedSegment_.id_ : 0;
				}

				this.addedSegment_ = null;
				this.playerContext_.currentPlayTime_ = 0;
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::replay segment({0}),nextSegmentId2({1}),errorReplayTime({2})",
						(seek2Segment != null), this.nextSegmentId_, this.errorReplayTime_));
			}
		});