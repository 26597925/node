p2p$.ns('com.webp2p.core.player');
p2p$.com.webp2p.core.player.VodPlayer = p2p$.com.webp2p.core.player.BasePlayer.extend_({
			firstSeekStatus_ : -1,
			addNextSegmentId_ : false,
			addedSegment_ : null,
			resetSeekTo_ : 0,
			
			init : function(wrapper) {
				this._super(wrapper);
				this.tag_="com::webp2p::player::VodPlayer";
				this.firstSeekStatus_ = -1;
				this.firstSeekPosition_ = 0;
				this.resetSeekTo_ = 0;
				this.addNextSegmentId_ = false;
				this.playerContext_.metaDataType_ = p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod;
			},
			getBlock_ : function(nextSegment) {
				if (this.metaData_) {
					if (!this.addNextSegmentId_) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getBlock first to set MetaData nextId for segment!",this.tag_));
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
					P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Meta data is null",this.tag_));
					return null;
				}
			},

			playSegment_ : function() {
                if (!this.playerContext_.avccName_ && this.playerContext_.isEncode_) {
                    return;
                }

                if (!this.mediaSource_) {
                    P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::Create media source ...", this.tag_));
                    this.sourceBuffer_ = null;
                    this.mediaSource_ = this.createMediaSource_();
                    this.video_.src = window.URL.createObjectURL(this.mediaSource_);
                    if (!this.firstSetSrc_) {
                        P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onvideosrc ...", this.tag_));
                        this.firstSetSrc_ = true;
                    }
                }

                if (!this.sourceBuffer_) {
                    this.delayTime_++;
                    if (this.delayTime_ > 500) {
                        P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Play segment with delay count({1})", this.tag_, this.delayTime_));
                    }
                    return;
                }
                if (this.sourceBuffer_.updating) {
                    P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::sourceBuffer_.updating ({1})", this.tag_, this.sourceBuffer_.updating));
                    return;
                }
                //判断视频在缓冲中
                var currentTime = this.video_.currentTime.toFixed(1);
                var vRemaining = this.video_.duration - this.video_.currentTime;
                if (this.playerContext_.lastCurrentTime_ == currentTime && !this.video_.paused && !this.video_.ended){
                	if(this.playerContext_.bufferLength_ > 3)//存在缓冲，属于卡顿
					{
						this.breakTimes_++;//卡顿计数
						if(this.playerContext_.videoStatus_ != p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking&&this.breakTimes_>=5){
							this.resetSeekTo_ = this.resetSeekTo_ + this.fectchInterval_*this.breakTimes_;
                            P2P_ULOG_INFO(P2P_ULOG_FMT("{0} time({1}),seekTo({2}),resetSeekTo({3}), bufferLength({4})", this.tag_,currentTime, Number(currentTime)+this.resetSeekTo_/1000,this.resetSeekTo_, this.playerContext_.bufferLength_));
                            this.video_.currentTime = Number(currentTime)+this.resetSeekTo_/1000;
                            // this.video_.play();
                            this.breakTimes_=0;
						}
					}else if (Math.abs(vRemaining) > 5 ) {
                        this.bufferTimes_++;//加缓冲载数据计数
                        if (this.bufferTimes_ > 5) {
                            if (this.playerContext_.videoStatus_ == this.videoStatus_.canplay
                                || this.playerContext_.videoStatus_ == this.videoStatus_.seeked
                                || this.playerContext_.videoStatus_ == this.videoStatus_.seeking
								|| this.playerContext_.videoStatus_ == this.videoStatus_.breakend) {
                                this.sendStatus_({type:"VIDEO.BUFFER.START"});
                                this.playerContext_.videoStatus_ = this.videoStatus_.breakstart;
                            }
                        }
                    }
                }
                if (this.playerContext_.lastCurrentTime_ != currentTime) {
					if (this.playerContext_.videoStatus_ == this.videoStatus_.breakstart) {
						this.sendStatus_({type:"VIDEO.BUFFER.END"});
						this.playerContext_.videoStatus_ = this.videoStatus_.breakend;
                    }
                    this.resetSeekTo_=0;
                    this.breakTimes_ = 0;
                    this.bufferTimes_ = 0;
                    this.playerContext_.lastCurrentTime_ = currentTime;
                }
				//////
				this.calculateBufferLength_();
				if (this.blockList_.length <= 0 || this.playerContext_.bufferLength_ >= this.config_.bufferLength) {
					return;
				}
				var streamInfo = this.blockList_[0];
				this.blockList_.shift();
				if (streamInfo.block.index_ == 0 && this.playerContext_.videoStatus_ != this.videoStatus_.seeking) {
					this.isFirstSegment_ = true;
				}
				var existTime = streamInfo.block.startTime_ / 1000 + 2;
				this.addedSegment_ = streamInfo.block;
				if (this.existTime_(existTime) && !this.onErrorReplay_) {//判断buffer中是否存在该时刻的数据
					P2P_ULOG_WARNING(P2P_ULOG_FMT("{0} Add data exist,ignore! segmentId({1})",this.tag_,streamInfo.block.id_));
					return;
				}
				if(this.firstAddDataTime_==-1)//记录首次添加数据时间
				{
					this.firstAddDataTime_=this.global_.getMilliTime_();
				}
				this.sourceBuffer_.appendBuffer(streamInfo.data);
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add data success ,buffer({1}),block({2}s), segment({3}), start time ({4}),  timestamp({5}),segment length ({6})",this.tag_,this.playerContext_.bufferLength_.toFixed(2), streamInfo.block.duration_ / 1000, streamInfo.block.id_,streamInfo.block.startTime_ / 1000, streamInfo.block.timestamp_, streamInfo.data.length));
			},

			seek : function(postion) {
				if (!this.mediaSource_) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Seek postion ({1}),mediaSource is null",this.tag_,postion));
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
				this.video_.currentTime = postion;
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Seek vtime({1}) seekTo({2})",this.tag_,time, this.preSeekTime_));
			},

			seek2 : function(time) {
				var seek2Segment = this.findSegment_(time);
				if (seek2Segment) {
					this.nextSegmentId_ = seek2Segment.id_;
					try {
						this.sourceBuffer_.abort();
					} catch (e) {
						P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::seek2 abort error({1})",this.tag_,e));
					}
					this.blockList_ = [];
					this.playerContext_.bufferLength_ = 0;
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::seek2 seek to({1}), next segment({2}), state({3})",this.tag_,time, this.nextSegmentId_,this.playerContext_.playState_));
					this.onLoop_();
				} else {
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::seek2 find segment failed, seek to({1}), next segment({2})",this.tag_,time,this.nextSegmentId_));
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
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Video time update, time({1}) remain({2})",this.tag_,time, remain));
				}
				if (Math.abs(remain) <= 0.5 && !this.VideoEnd_) {
					this.VideoEnd_ = true;
					this.onEnded_(false);
				}
				if (this.VideoEnd_ && parseFloat(this.videoDuration_) - time > 0.5) {
					this.VideoEnd_ = null;
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
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Player error stop play ...",this.tag_));
					this.stop_();
					return false;
				}
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Player error {1} times... init a new one",this.tag_,this.errorTimes_));
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
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::replay segment({1}),nextSegmentId2({2}),errorReplayTime({3})",this.tag_,(seek2Segment != null), this.nextSegmentId_, this.errorReplayTime_));
			}
		});
