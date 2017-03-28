p2p$.ns('com.webp2p.core.player');
p2p$.com.webp2p.core.player.LivePlayer = p2p$.com.webp2p.core.player.BasePlayer.extend_({
	isFirstSegment_ : false,
	firstIndexUsed_ : false,
	playNextDelayTime_ : 0,
	suspendTimes_ : 0,

	init : function(wrapper) {
		this._super(wrapper);
		this.isFirstSegment_ = false;
		this.playNextDelayTime_ = 0;
		this.playerContext_.metaDataType_ = p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive;
		this.lastDiscontinuitySegment_ = 0;
		this.lastHandleSuspendTime_ = 0;
	},
	play : function() {
		if (!this.video_) {
			return;
		}
		if (this.video_.paused) {
			this.video_.play();
		}
		if (!this.safariFirstSeek_) {
			return;
		}
		this.video_.currentTime = this.safariFirstSeekPostion_;
		this.safariFirstSeek_ = false;
		this.canHandleSuspend_ = true;
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::play first segment seek to({0})", this.video_.currentTime.toFixed(1)));
		return;
	},
	getBlock_ : function(nextSegment) {
		if (!this.metaData_) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::LivePlayer::Meta data is null"));
			return null;
		}

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
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::LivePlayer::segment ({0}) not found,return default segment({1})", nextSegment,
						this.metaData_.segments_[0].id_));
			}
		}
		return this.metaData_.segments_[0];
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
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::BasePlayer::refreshUrgentSegment1 requestSegment({0}),urgentSegment({1})", segmentId,
						this.urgentSegment_));
				return;
			}
		}
		this.urgentSegment_ = segmentId - 1;
		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::BasePlayer::refreshUrgentSegment2 requestSegment({0}),urgentSegment({1})", segmentId, this.urgentSegment_));
	},

	getSegmentByVideoTime_ : function(time) {
		time = time * 1000;
		var temp = null;
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			// the current urgentSegment should be the latest urgentSegment_
			if (segment.timestamp_ <= time && time <= segment.timestamp_ + segment.duration_ && segment.id_ > this.lastDiscontinuitySegment_) {
				temp = segment;
			}
		}
		return temp;
	},

	playSegment_ : function() {
		if (!this.playerContext_.avccName_) {
			return;
		}
		if (!this.mediaSource_) {
			P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::LivePlayer::Create media source ..."));
			this.sourceBuffer_ = null;
			this.mediaSource_ = this.createMediaSource_();
			this.video_.src = window.URL.createObjectURL(this.mediaSource_);
		}
		// if (this.sourceBufferRemoved_ && !this.sourceBuffer_) {
		// this.sourceBufferRemoved_ = false;
		// P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::play next video , start add media source header..."));
		// this.actived_ = true;
		// this.addMediaSourceHeader_();
		// }
		if (!this.sourceBuffer_) {
			if (!this.mediaOpened_) {
				this.delayTime_++;
				if (this.delayTime_ > 500) {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::LivePlayer::Play segment with delay count({0})", this.delayTime_));
				}
				return;
			}
			this.addMediaSourceHeader_();
			if (!this.sourceBuffer_) {
				this.delayTime_++;
				if (this.delayTime_ > 500) {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::LivePlayer::Play segment with delay2 count({0})", this.delayTime_));
				}
				return;
			}
		}
		if (this.sourceBuffer_.updating) {
			return;
		}

		this.calculateBufferLength_();

		this.handleSuspend_();

		if (this.blockList_.length <= 0 || this.playerContext_.bufferLength_ >= 20) {
			return;
		}

		// add source
		var streamInfo = this.blockList_[0];
		// this.blockList_.shift();
		if (streamInfo.block.index_ == 0 && !this.firstIndexUsed_) {
			this.isFirstSegment_ = true;
			this.firstIndexUsed_ = true;
		}

		if (this.addedSegment_ && streamInfo.block.timestamp_ < this.addedSegment_.timestamp_) {
			if (!this.showDiscontinuity_) {
				if (streamInfo.block.discontinuity_) {
					this.showDiscontinuity_ = true;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::discontinuity true, segment({0})", streamInfo.block.id_));
				} else {
					streamInfo.block.discontinuity_ = true;
					this.showDiscontinuity_ = true;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::discontinuity false, segment({0})", streamInfo.block.id_));
				}
			}
		}

		if (streamInfo.block.discontinuity_ && !this.playNextVideo_ && this.lastDiscontinuitySegment_ != streamInfo.block.id_) {
			if (this.playerContext_.bufferLength_ < 0.2 || this.playNextDelayTime_ > 5) {

				var offsetTime = ((streamInfo.block.timestamp_ || 0)) / 1000;

				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::Start to play next video, buffer({0}), delay({1}), offset({2}), mime({3}, {4} => {5})",
						this.playerContext_.bufferLength_.toFixed(3), this.playNextDelayTime_, offsetTime, streamInfo.mime == this.sourceMime_ ? "same"
								: "diff", this.sourceMime_, streamInfo.mime));

				// this.video_.pause();
				this.video_.currentTime = offsetTime;

				if (streamInfo.mime != this.sourceMime_) {
					// play next video
					this.clearMediaSource_();
					// this.removeSourceBuffer_();
					this.playNextVideo_ = true;
					this.isFirstSegment_ = true;
					this.playerContext_.bufferd_ = null;
					this.playerContext_.avccName_ = null;
					this.playerContext_.aacName_ = null;
					this.blockList_ = [];
				} else if (this.sourceBuffer_.buffered.length > 0) {
					this.sourceBuffer_.remove(0, this.sourceBuffer_.buffered.end(this.sourceBuffer_.buffered.length - 1));
				}

				// this.removeVideoEvent_(this.video_);
				// this.video_ = null;

				this.preTime_ = 0;
				this.playNextDelayTime_ = 0;
				this.showDiscontinuity_ = false;
				this.addedSegment_ = null;
				this.playerContext_.bufferLength_ = 0;
				this.lastDiscontinuitySegment_ = streamInfo.block.id_;
			} else {
				if (this.playerContext_.bufferLength_ < 3) {
					this.playNextDelayTime_++;
				}
			}

			this.nextSegmentId_ = streamInfo.block.id_;
			return null;
		}

		this.blockList_.shift();

		// this.sourceBuffer_.timestampOffset = streamInfo.offsetTime / 1000;
		this.sourceBuffer_.appendBuffer(streamInfo.data);
		this.addedSegment_ = streamInfo.block;

		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::Add data success ,buffer length({0}),"
				+ "blockLength ({1}s), segmentId({2}), startTime({3}), timestamp({4}), discontinuity({5}), segment length ({6}), "
				+ "prev segment({7}), next segment({8})", this.playerContext_.bufferLength_.toFixed(2), streamInfo.block.duration_ / 1000,
				streamInfo.block.id_, p2p$.com.webp2p.core.common.Global.getCurentTime_(streamInfo.block.startTime_ / 1000), streamInfo.block.timestamp_,
				streamInfo.block.discontinuity_, streamInfo.data.length, this.preSegmentId_, this.nextSegmentId_));
	},

	handleSuspend_ : function() {
		if (!this.playerContext_.bufferd_ || !this.canHandleSuspend_) {
			return;
		}
		var nowTime = new Date().getTime();
		if (this.lastHandleSuspendTime_ + 500 > nowTime) {
			return;
		}
		this.lastHandleSuspendTime_ = nowTime;
		var temp = this.playerContext_.currentPlayTime_;
		var bufferIndex = -1;
		if (Math.abs(this.video_.currentTime - temp) < 0.1) {
			// break
			for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
				var start = this.playerContext_.bufferd_.start(i);
				if (start > temp) {
					bufferIndex = i;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer start ({0}),length ({1}),i ({2}),bufferIndex ({3})", start,
							this.playerContext_.bufferd_.length, i, bufferIndex));
					break;
				}
			}
			if (bufferIndex != -1) {
				var seekto = this.playerContext_.bufferd_.start(bufferIndex);
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer replay suspend seekto ({0}) ...", seekto));
				try {
					// this.video_.pause();
					this.video_.currentTime = seekto;
					this.video_.play();
					if (bufferIndex >= 2) {
						if (!this.macSafariPattern_) {
							this.sourceBuffer_.remove(0, this.playerContext_.bufferd_.end(bufferIndex - 2));
						}
						this.playerContext_.bufferd_ = this.sourceBuffer_.buffered;
					}
				} catch (e) {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::LivePlayer replay seek or remove error({0})", e));
				}
				this.suspendTimes_ = 0;
			} else {
				if (!this.suspendTimes_) {
					this.suspendTimes_ = 0;
				}
				this.suspendTimes_++;
				if (this.suspendTimes_ > 5) {
					var seekto = temp + 0.2;
					this.video_.currentTime = seekto;
					this.suspendTimes_ = 0;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer replay2 suspend seekto ({0}) ...", seekto));
				}
			}
		} else {
			this.suspendTimes_ = 0;
		}
		this.playerContext_.currentPlayTime_ = this.video_.currentTime;
	},

	calculateBufferLength_ : function() {
		if (!this.video_) {
			return;
		}

		var _st = 0;
		var _ed = 0;
		if (this.video_) {
			this.preTime_ = this.video_.currentTime;
		}

		this.playerContext_.bufferLength_ = 0;
		if (!this.playerContext_.bufferd_) {
			return;
		}

		for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
			_st = this.playerContext_.bufferd_.start(i);
			_ed = this.playerContext_.bufferd_.end(i);

			if (this.isFirstSegment_) {
				this.playerContext_.bufferLength_ = _ed - _st;
				this.isFirstSegment_ = false;
				if (this.onErrorReplay_) {
					this.onErrorReplay_ = false;
					if (_st <= this.errorReplayTime_ && this.errorReplayTime_ <= _ed) {
						this.video_.currentTime = this.errorReplayTime_;
					} else {
						this.video_.currentTime = this.macSafariPattern_ ? Math.max(_st, 0.1) : _st;
					}
					this.onBufferEndAndOnPrepared_();
					this.video_.play();
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::error play first segment seek to({0})", this.video_.currentTime.toFixed(1)));
				} else {
					this.safariFirstSeek_ = true;
					this.safariFirstSeekPostion_ = _st;
					if (!this.macSafariPattern_) {
						// for showing the first frame on chrome
						// safari don't need to do this step
						this.video_.currentTime = this.safariFirstSeekPostion_;
					}
					this.onBufferEndAndOnPrepared_();
					// wating for playing by external call 'play' method
				}
				this.playNextVideo_ = null;
			} else {
				if (_st > this.preTime_) {
					this.playerContext_.bufferLength_ += (_ed - _st);
				} else if (_st <= this.preTime_ && _ed >= this.preTime_) {
					this.playerContext_.bufferLength_ = (_ed - this.preTime_);
				}
			}
		}
		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::LivePlayer::Calculate buffer, current({0}), pre({1}), buffer({2}), pre segment({3}), next segment({4})",
				this.video_.currentTime, this.preTime_, this.playerContext_.bufferLength_, this.preSegmentId_, this.nextSegmentId_));
	},

	onVideoSeeking_ : function() {
	},

	onVideoSeeked_ : function() {
		// this.video_.play();
	},

	onError_ : function() {
		this.errorTimes_++;
		this._super();
		if (this.errorTimes_ > this.maxErrorTimes_) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::Player error {0} times...,return error", this.errorTimes_));
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::Player error {0} times... init a new one", this.errorTimes_));

		this.clearMediaSource_();
		// this.removeSourceBuffer_();
		this.playNextVideo_ = true;
		this.isFirstSegment_ = true;
		this.playerContext_.bufferd_ = null;
		this.playerContext_.avccName_ = null;
		this.playerContext_.aacName_ = null;
		this.blockList_ = [];
		this.video_.pause();
		this.onErrorReplay_ = true;
		var findFlag = 0;
		var segment = this.getSegmentByVideoTime_(this.playerContext_.currentPlayTime_);
		if (segment) {
			this.nextSegmentId_ = segment.id_;
			findFlag = 1;
		} else {
			var timestamp = Date.parse(new Date());
			var seek2Segment = this.findSegment_(timestamp / 1000);
			if (seek2Segment) {
				this.nextSegmentId_ = seek2Segment.id_;
				findFlag = 2;
			} else {
				this.nextSegmentId_ = this.addedSegment_ ? this.addedSegment_.id_ : 0;
				findFlag = 3;
			}
		}
		this.lastDiscontinuitySegment_ = 0;
		this.playerContext_.bufferLength_ = 0;
		this.actived_ = true;
		this.playNextDelayTime_ = 0;
		this.showDiscontinuity_ = false;
		this.addedSegment_ = null;
		this.playerContext_.bufferLength_ = 0;
		this.errorReplayTime_ = this.playerContext_.currentPlayTime_;
		this.playerContext_.currentPlayTime_ = 0;
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::replay find segment by ({0}),nextSegmentId({1}),errorReplayTime({2})", findFlag,
				this.nextSegmentId_, this.errorReplayTime_));
	},

	onVideoTimeUpdate_ : function() {
		this._super();
		// this.playerContext_.currentPlayTime_ = this.video_.currentTime;
	},
	// onVideoProgress_ : function() {
	// if (!this.firstProgress_) {
	// this.firstProgress_ = true;
	// this.onBufferEndAndOnPrepared_();
	// }
	// },
	onVideoCanPlay_ : function() {
		// onprepared onbufferend
		// this.onBufferEndAndOnPrepared_();
	},

	onCanPlayThrough_ : function() {
	},

	onVideoPlaying_ : function() {
	},

	seek : function(postion) {
		return;
	},

	getCurrentPosition : function() {
		return 0;
	},

	getDuration : function() {
		return Infinity;
	},
	getCurrentBuffered : function() {
		var buffer = -1;
		return buffer;
	},
});