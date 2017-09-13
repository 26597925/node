p2p$.ns('com.webp2p.core.player');
p2p$.com.webp2p.core.player.LivePlayer = p2p$.com.webp2p.core.player.BasePlayer.extend_({
	isFirstSegment_ : false,
	firstIndexUsed_ : false,
	playNextDelayTime_ : 0,
	suspendTimes_ : 0,

	init : function(wrapper) {
		this._super(wrapper);
		this.tag_="com::webp2p::core::player:LivePlayer";
		this.isFirstSegment_ = false;
		this.playNextDelayTime_ = 0;
		this.playerContext_.metaDataType_ = p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive;
		this.lastDiscontinuitySegment_ = 0;
		this.lastHandleSuspendTime_ = 0;
		if(p2p$.com.webp2p.segmentmp4 != undefined)
		{
			this.toMp4_ = new p2p$.com.webp2p.segmentmp4.ToMp4();
		}
	},
	play : function() {
		if (!this.video_) {
			return;
		}
		if (this.video_.paused) {
			this.video_.play();
		}
		this.canHandleSuspend_ = true;
	},
	getBlock_ : function(nextSegment) {
		if (!this.metaData_) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Meta data is null",this.tag_));
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
				P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::segment ({1}) not found,return default segment({2})",this.tag_,nextSegment,this.metaData_.segments_[0].id_));
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
				P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::refreshUrgentSegment1 requestSegment({1}),urgentSegment({2})",this.tag_,segmentId,this.urgentSegment_));
				return;
			}
		}
		this.urgentSegment_ = segmentId - 1;
		P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::refreshUrgentSegment2 requestSegment({1}),urgentSegment({2})",this.tag_,segmentId, this.urgentSegment_));
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
		this.calculateBufferLength_();
		if (!this.playerContext_.avccName_&&this.playerContext_.isEncode_) {
			return;
		}
		if (!this.mediaSource_) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Create media source ...",this.tag_));
			this.mediaSource_ = this.createMediaSource_();
			this.video_.src = window.URL.createObjectURL(this.mediaSource_);
		}
		//mediasource创建超时，5秒超时
		if (!this.sourceBuffer_) {
			if (!this.mediaOpened_) {
				this.delayTime_++;
				if (this.delayTime_ > 50) {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Play segment with delay count({1})",this.tag_,this.delayTime_));
				}
				return;
			}
			this.addMediaSourceHeader_();
			return;
		}
		if (this.sourceBuffer_.updating) {
			return;
		}
		if(this.blockList_.length==0)
		{
			return;
		}
		var streamInfo = this.blockList_[0];
		if (streamInfo.block.index_ == 0 && !this.firstIndexUsed_) {
			this.isFirstSegment_ = true;
			this.firstIndexUsed_ = true;
		}

		if (this.addedSegment_ && streamInfo.block.timestamp_ < this.addedSegment_.timestamp_) {
			if (!this.showDiscontinuity_) {
				if (streamInfo.block.discontinuity_) {
					this.showDiscontinuity_ = true;
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::discontinuity true, segment({1})",this.tag_, streamInfo.block.id_));
				} else {
					streamInfo.block.discontinuity_ = true;
					this.showDiscontinuity_ = true;
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::discontinuity false, segment({1})",this.tag_, streamInfo.block.id_));
				}
			}
		}

		if (streamInfo.block.discontinuity_ && !this.playNextVideo_ && this.lastDiscontinuitySegment_ != streamInfo.block.id_) {
			if (this.playerContext_.bufferLength_ < 0.1 || this.playNextDelayTime_ > 15) {
				var offsetTime = ((streamInfo.block.timestamp_ || 0)) / 1000;
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Start to play next video, buffer({1}), delay({2}), offset({3}), mime({4}, {5} => {6})",this.tag_,this.playerContext_.bufferLength_.toFixed(3), this.playNextDelayTime_, offsetTime, streamInfo.mime == this.sourceMime_ ? "same": "diff", this.sourceMime_, streamInfo.mime));
				// this.video_.pause();
				this.video_.currentTime = offsetTime;
				if (streamInfo.mime != this.sourceMime_) {
					// play next video
					this.clearMediaSource_();
					this.playNextVideo_ = true;
					this.isFirstSegment_ = true;
					this.playerContext_.bufferd_ = null;
					this.playerContext_.avccName_ = null;
					this.playerContext_.aacName_ = null;
					this.blockList_ = [];
				} else if (this.sourceBuffer_.buffered.length > 0) {
					this.sourceBuffer_.abort()
					this.sourceBuffer_.remove(0, this.sourceBuffer_.buffered.end(this.sourceBuffer_.buffered.length - 1));
				}
				this.preTime_ = 0;
				this.playNextDelayTime_ = 0;
				this.showDiscontinuity_ = false;
				this.addedSegment_ = null;
				this.playerContext_.bufferLength_ = 0;
				this.lastDiscontinuitySegment_ = streamInfo.block.id_;
			} else {
				if (this.playerContext_.bufferLength_ < 1) {
					this.playNextDelayTime_++;
				}
			}
//			this.nextSegmentId_ = streamInfo.block.id_;
			return null;
		}
//		this.handleSuspend_();
		if (this.blockList_.length <= 0 || this.playerContext_.bufferLength_ >= this.config_.bufferLength) {
			return;
		}
		this.blockList_.shift();
		if(this.firstAddDataTime_==-1)
		{
			this.firstAddDataTime_=this.global_.getMilliTime_();
		}
		this.sourceBuffer_.appendBuffer(streamInfo.data);
		this.addedSegment_ = streamInfo.block;
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add data success ,buffer length({1}),blockLength ({2}s), segmentId({3}), startTime({4}), timestamp({5}), discontinuity({6}), segment length ({7}), prev segment({8}), next segment({9})",this.tag_, this.playerContext_.bufferLength_.toFixed(2), streamInfo.block.duration_ / 1000,streamInfo.block.id_, this.global_.getCurentTime_(streamInfo.block.startTime_ / 1000), streamInfo.block.timestamp_,streamInfo.block.discontinuity_, streamInfo.data.length, this.preSegmentId_, this.nextSegmentId_));
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
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0} start ({1}),length ({2}),i ({3}),bufferIndex ({4})",this.tag_, start,this.playerContext_.bufferd_.length, i, bufferIndex));
					break;
				}
			}
			if (bufferIndex != -1) {
				var seekto = this.playerContext_.bufferd_.start(bufferIndex);
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0} replay suspend seekto ({1}) ...",this.tag_, seekto));
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
					P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} replay seek or remove error({1})",this.tag_, e));
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
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0} replay2 suspend seekto ({1}) ...",this.tag_, seekto));
				}
			}
		} else {
			this.suspendTimes_ = 0;
		}
		this.playerContext_.currentPlayTime_ = this.video_.currentTime;
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
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Player error {1} times...,return error",this.tag_,this.errorTimes_));
			return;
		}
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
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::replay find segment by ({1}),nextSegmentId({2}),errorReplayTime({3})",this.tag_,findFlag,this.nextSegmentId_, this.errorReplayTime_));
	},

	onVideoTimeUpdate_ : function() {
		this._super();
		// this.playerContext_.currentPlayTime_ = this.video_.currentTime;
	},
	seek_ : function(postion) {
		return;
	}
});
