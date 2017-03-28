p2p$.ns('com.webp2p.core.player2.live');
p2p$.com.webp2p.core.player2.live.Player = p2p$.com.webp2p.core.player.base.Player
		.extend_({
			isFirstSegment_ : false,
			cdeMediaPlayer_ : null,

			init : function(cdeMediaPlayer) {
				this._super();
				this.isFirstSegment_ = false;
				this.playerContext_.metaDataType_ = p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive;
				this.cdeMediaPlayer_ = cdeMediaPlayer;
				this.playNextDelayTime_ = 0;
				this.lastDiscontinuitySegment_ = "";
			},

			getBlock_ : function(nextSegment) {
				if (this.metaData_) {
					for ( var n = 0; n < this.metaData_.segments_.length - 1; n++) {
						var segment = this.metaData_.segments_[n];
						var segment2 = this.metaData_.segments_[n + 1];
						segment.nextId_ = segment2.id_;
						if (n == this.metaData_.segments_.length - 2) {
							segment2.nextId_ = segment2.id_;
						}
					}

					for ( var n = 0; n < this.metaData_.segments_.length; n++) {
						var segment = this.metaData_.segments_[n];
						if (nextSegment == segment.id_) {
							return segment;
						}
						if (n == this.metaData_.segments_.length - 1) {
							P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::live::Player::segment ({0}) not found,return default segment({1})", nextSegment,
									this.metaData_.segments_[0].id_));
						}
					}
					return this.metaData_.segments_[0];

				} else {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::live::Player::Meta data is null"));
					return null;
				}
			},
			playSegment_ : function() {
				if (!this.playerContext_.avccName_) {
					return;
				}
				if (!this.mediaSource_) {
					P2P_ULOG_TRACE(P2P_ULOG_FMT("Create MediaSource ..."));
					this.sourceBuffer_ = null;
					this.mediaSource_ = this.createMediaSource_();
					if (!this.video_) {

						if ((this.videoBox_.tagName + '').toLowerCase() == "video") {
							this.video_ = this.videoBox_;
							if (!this.videoEventAdded_) {
								this.addVideoEvent_(this.video_);
								this.videoEventAdded_ = true;
							}

						} else {
							this.video_ = this.createNewVideo_();
							while (this.videoBox_.childNodes.length > 0) {
								this.videoBox_.removeChild(this.videoBox_.childNodes[0]);
							}
							this.videoBox_.appendChild(this.video_);
						}
					}
					this.video_.src = window.URL.createObjectURL(this.mediaSource_);

				}
				if (!this.sourceBuffer_) {
					this.delayTime_++;
					if (this.delayTime_ > 500) {
						P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::Player::Play segment with delay count({0})", this.delayTime_));
					}
					return;
				}
				if (this.sourceBuffer_.updating) {
					return;
				}
				this.calculateBufferLength_();
				this.playerContext_.currentPlayTime_ = this.video_.currentTime;
				if (this.blockList_.length > 0 && this.isWaitData_ && this.playerContext_.bufferLength_ < 4) {
					// add source
					var streamInfo = this.blockList_[0];
					if (streamInfo.block.index_ == 0 && !this.seekForSafariPlay_) {
						this.isFirstSegment_ = true;
						this.seekForSafariPlay_ = true;
					}
					if (this.addedSegment_ && streamInfo.block.timestamp < this.addedSegment_.timestamp) {
						if (!this.showDiscontinuity_) {
							if (streamInfo.block.discontinuity_) {
								this.showDiscontinuity_ = true;
								P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::liv::Player::discontinuity true"));
							} else {
								streamInfo.block.discontinuity_ = true;
								this.showDiscontinuity_ = true;
								P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::liv::Player::discontinuity false"));
							}
						}
					}
					if (streamInfo.block.discontinuity_ && !this.playNextVideo_ && this.lastDiscontinuitySegment_ != streamInfo.block.id_) {
						if (this.video_) {
							if (this.playerContext_.bufferLength_ < 1 || this.playNextDelayTime_ >= 4) {
								P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::liv::Player::start to play next video,buffer length({0}),delay time({1})",
										this.playerContext_.bufferLength_, this.playNextDelayTime_));
								// play next video
								this.clearMediaSource_();
								this.playNextVideo_ = true;
								this.isFirstSegment_ = true;
								this.playerContext_.bufferd_ = null;
								this.playerContext_.avccName_ = null;
								this.playerContext_.aacName_ = null;
								this.blockList_ = [];
								this.video_.pause();
								this.video_ = null;
								this.playNextDelayTime_ = 0;
								this.showDiscontinuity_ = false;
								this.addedSegment_ = null;
								this.playerContext_.bufferLength_ = 0;
								this.lastDiscontinuitySegment_ = streamInfo.block.id_;
							}
							if (this.playerContext_.bufferLength_ < 3) {
								this.playNextDelayTime_++;
							}
							this.nextSegmentId_ = streamInfo.block.id_;
						}
						return null;
					}
					this.blockList_.shift();
					this.sourceBuffer_.appendBuffer(streamInfo.data);
					this.addedSegment_ = streamInfo.block;
					P2P_ULOG_INFO(P2P_ULOG_FMT(
							"core::player::liv::Player::Add data success ,bufferLegnth ({0}),"
									+ "blockLength ({1}s),segmentId ({2}),startTime ({3}),timestamp({4}),discontinuity({5}),segmentLength ({6}),preSegment ({7}),nextSegmentId ({8})",
							this.playerContext_.bufferLength_.toFixed(2), streamInfo.block.duration_ / 1000, streamInfo.block.id_,
							p2p$.com.webp2p.core.common.Global.getCurentTime_(streamInfo.block.startTime_ / 1000), streamInfo.block.timestamp,
							streamInfo.block.discontinuity_, streamInfo.data.length, this.preSegmentId_, this.nextSegmentId_));

				}
			},
			calculateBufferLength_ : function() {
				if (this.playerContext_.playType_ == p2p$.com.webp2p.core.player.base.PLAY_TYPE.kPlayTypeBinary && this.video_) {
					var _st = 0;
					var _ed = 0;
					if (this.video_) {
						this.preTime_ = this.video_.currentTime;
					}
					this.playerContext_.bufferLength_ = 0;
					if (this.playerContext_.bufferd_) {
						for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
							_st = this.playerContext_.bufferd_.start(i);
							if (_st < 1) {
								_st = 0;
							}
							_ed = this.playerContext_.bufferd_.end(i);
							P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::live::Player::Trace _st ({0}),_ed ({1}),length ({2})", _st, _ed,
									this.playerContext_.bufferd_.length));

							if (this.isFirstSegment_) {
								this.playerContext_.bufferLength_ = _ed - _st;
								this.isFirstSegment_ = false;
								if (this.onErrorReplay_) {
									this.onErrorReplay_ = false;
									P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::live::Player:: errorReplayTime({0})", this.errorReplayTime_));
									if (_st <= this.errorReplayTime_ && _ed >= this.errorReplayTime_) {
										this.video_.currentTime = this.errorReplayTime_;
									} else {
										this.video_.currentTime = _st;
									}
								} else {
									this.video_.currentTime = _st;
								}
								this.playNextVideo_ = null;

							} else {
								if (_st <= this.preTime_ && _ed >= this.preTime_) {
									this.playerContext_.bufferLength_ = (_ed - this.preTime_);
									break;
								}
							}

						}
					}
				}
				P2P_ULOG_TRACE(P2P_ULOG_FMT(
						"core::player::live::Player::Calculate buffer, currentTime ({0}),preTime_ ({1}),bufferLength_ ({2}),preSegment ({3}),nextSegmentId ({4})",
						this.video_.currentTime, this.preTime_, this.playerContext_.bufferLength_, this.preSegmentId_, this.nextSegmentId_));
			},
			onVideoSeeking_ : function() {

			},
			onVideoSeeked_ : function() {
				this.video_.play();
			},
			seek : function(postion) {
				return;
			},
			onError_ : function() {
				this._super();
				P2P_ULOG_INFO(P2P_ULOG_FMT("player error ... init a new one!"));
				this.clearMediaSource_();
				this.playNextVideo_ = true;
				this.isFirstSegment_ = true;
				this.playerContext_.bufferd_ = null;
				this.playerContext_.avccName_ = null;
				this.playerContext_.aacName_ = null;
				this.blockList_ = [];
				this.video_.pause();
				this.video_ = null;
				this.onErrorReplay_ = true;
				var timestamp = Date.parse(new Date());
				this.onErrorPlayTimestamp_ = (timestamp / 1000) - 20000;
				var seek2Segment = this.findSegment_(this.onErrorPlayTimestamp_);
				if (seek2Segment) {
					this.nextSegmentId_ = seek2Segment.id_;
				} else {
					this.nextSegmentId_ = this.addedSegment_.id_;
				}

				this.playerContext_.bufferLength_ = 0;
				this.isActive_ = true;
				this.playNextDelayTime_ = 0;
				this.showDiscontinuity_ = false;
				this.isWaitData_ = true;
				this.addedSegment_ = null;
				this.playerContext_.bufferLength_ = 0;
				this.errorReplayTime_ = this.playerContext_.currentPlayTime_;
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::live::Player::replay seek2Segment({0}),nextSegmentId2({0}),errorReplayTime({2})",
						(seek2Segment != null), this.nextSegmentId_, this.errorReplayTime_));
			},
			onVideoTimeUpdate_ : function() {
				this.playerContext_.currentPlayTime_ = this.video_.currentTime;
			},
		});