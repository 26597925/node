p2p$.ns('com.webp2p.core.player.base');
p2p$.com.webp2p.core.player.base.Player = CdeBaseClass
		.extend_({
			kNoFirstSeek : -1,
			kFirstSeekInit : 0,
			kFirstSeekWaitDownLoadSegment : 1,
			kFirstSeekDownLoadSegmentOk : 2,
			kFirstSeekStatusDone : 3,
			videoStream_ : null,
			playUrl_ : "",
			mediaSource_ : null,
			fectchInterval_ : 0,
			channel_ : null,
			videoBox_ : null,
			blockList_ : null,
			sourceBuffer_ : null,
			video_ : null,
			fileMp4_ : null,
			initFnum_ : 0,
			video_ : null,
			fetchTimer_ : null,
			metaData_ : null,
			isFetchedMetaData_ : false,
			p2pGroupId_ : "",
			nextSegmentId_ : 0,
			playerContext_ : null,
			preTime_ : 0,
			preSegmentId_ : "",
			seekForSafariPlay_ : false,
			playerSeekable_ : true,
			seekingTimer_ : null,
			breakTimes_ : 0,
			videoDuration_ : 0,
			firstSeekStatus_ : -1,
			firstSeekPosition_ : 0,
			jump2SeekPostion_ : false,
			macSafariPattern_ : false,
			videoDuration_ : 0,
			isActive_ : false,
			init : function() {
				this.videoStream_ = null;
				this.playUrl_ = "";
				this.mediaSource_ = null;
				this.fectchInterval_ = 500;
				this.channel_ = null;
				this.videoBox_ = null;
				this.blockList_ = [];
				this.sourceBuffer_ = null;
				this.video_ = null;
				this.fileMp4_ = new p2p$.com.webp2p.tools.ts2mp4.FileHandler();

				this.initFnum_ = 0;
				this.fetchTimer_ = null;
				this.metaData_ = null;
				this.isFetchedMetaData_ = false;
				this.p2pGroupId_ = "";
				this.nextSegmentId_ = 0;
				this.playerContext_ = new p2p$.com.webp2p.core.player.base.Context();
				this.preTime_ = 0;
				this.preSegmentId_ = "-1";
				this.isWaitData_ = true;
				this.seekForSafariPlay_ = false;
				this.firstSeekStatus_ = -1;
				this.firstSeekPosition_ = 0;
				this.jump2SeekPostion_ = false;
				this.macSafariPattern_ = false;
				this.isActive_ = false;
				this.loop_ = 0;
			},

			stopFetchTimer_ : function() {
				if (this.fetchTimer_) {
					clearInterval(this.fetchTimer_);
					this.fetchTimer_ = null;
				}
			},

			initialize_ : function(playUrl, videoBox, videoStream, channel, playtype) {
				this.channel_ = channel;
				this.playURL_ = playUrl;
				this.videoStream_ = videoStream;
				this.videoBox_ = videoBox;
				this.isActive_ = true;
				var mediaType = p2p$.com.webp2p.core.supernode.Enviroment.getMediaType_();
				if (mediaType.mediasource) {
					this.playerContext_.playType_ = playtype;
					if (mediaType.ts) {
						// no decoder
						this.macSafariPattern_ = true;
					} else if (mediaType.mp4) {
						this.playerSeekable_ = true;
						this.playerContext_.isEncode_ = true;
					}
				}

				return true;
			},

			play : function() {
				if (this.video_) {
					if (this.video_.paused) {
						this.video_.play();
						return;
					}
				}
				this.onLoop_();
				var me = this;
				if (this.fetchTimer_) {
					clearInterval(this.fetchTimer_);
				}
				this.fetchTimer_ = setInterval(function() {
					me.onLoop_();
				}, this.fectchInterval_);
			},

			onLoop_ : function() {
				if (!this.isFetchedMetaData_) {
					this.getMetaData_();
				} else {
					if (this.isActive_) {
						this.getSegment_();
						this.playSegment_();
					}

				}
				// this.loop_++;
				// if (this.loop_ > 20) {
				// this.loop_ = 0;
				// this.onError_();
				// }
			},

			getMetaData_ : function() {
				this.metaData_ = this.channel_.metaData_;
				if (this.metaData_ && this.channel_.metaData_.p2pGroupId_) {
					this.isFetchedMetaData_ = true;
					this.pictureHeight_ = this.metaData_.pictureHeight_;
					this.pictureWidth_ = this.metaData_.pictureWidth_;
					this.p2pGroupId_ = this.channel_.metaData_.p2pGroupId_;
				}
			},

			getSegment_ : function() {
				if (this.blockList_.length < 1) {
					if (this.firstSeekStatus_ == this.kFirstSeekInit) {
						this.firstSeekStatus_ = this.kFirstSeekWaitDownLoadSegment;
						var seek2Segment = this.findSegment_(this.firstSeekPosition_);
						if (seek2Segment) {
							this.nextSegmentId_ = seek2Segment.id_;
							this.preSeekTime_ = this.firstSeekPosition_;
						} else {

						}
					}
					var tempBlock = this.getBlock_(this.nextSegmentId_);
					if (tempBlock) {
						var streamInfo = this.videoStream_.requestPlaySlice_(this.channel_.getId_(), tempBlock.id_);
						if (streamInfo == null || streamInfo.stream == null) {
							P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::vtime({0}) getSegment({1}) stream({2})",
									this.video_ ? this.video_.currentTime.toFixed(2) : 0, this.nextSegmentId_, (streamInfo.stream != null)));
							return null;
						}
						this.preSegmentId_ = tempBlock.id_;
						this.nextSegmentId_ = tempBlock.nextId_;
						var _stream = null;
						var startChangeTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
						P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player start change to mp4"));
						if (this.playerContext_.isEncode_) {
							_stream = this.fileMp4_.processFileSegment_(streamInfo.stream, {
								start : tempBlock.startTime_ / 1000,
								duration : tempBlock.duration_,
								type : this.playerContext_.playType_,
								width : this.pictureWidth_,
								height : this.pictureHeight_
							}, this.initFnum_, this.playerContext_.isEncode_);
							tempBlock.timestamp = this.fileMp4_.startTime_;
							this.playerContext_.avccName_ = this.fileMp4_.getMediaStreamAvccName_();
							this.playerContext_.aacName_ = this.fileMp4_.getMediaStreamAacName_();
							this.initFnum_++;
						} else {
							_stream = streamInfo.stream;
							var _offset = 188;
							var _pos = 0;
							// var _byte = 0;
							while (this.playerContext_.avccName_ == null) {
								// _byte = _stream.subarray(_pos, _offset);
								_pos += _offset;
								this.fileMp4_.processFileSegment_(streamInfo.stream, {
									duration : 0.1
								}, true);
								this.playerContext_.avccName_ = this.fileMp4_.getMediaStreamAvccName_();
								this.playerContext_.aacName_ = this.fileMp4_.getMediaStreamAacName_();
								if ((_stream.length - _pos) < _offset) {
									break;
								}
							}
						}
						var endChangeTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
						P2P_ULOG_INFO(P2P_ULOG_FMT(
								"core::player::base::Player turn to mp4, segmentid({0}), before({1}), after({2}),timeuse({3}),playtime({4})", tempBlock.id_,
								streamInfo.stream.length, _stream.length, ((endChangeTime - startChangeTime) / 1000).toFixed(1),
								this.video_ ? this.video_.currentTime.toFixed(2) : 0));
						this.blockList_.push({
							offsetTime : tempBlock.startTime_,
							data : _stream,
							block : tempBlock
						});
					}

				}
			},

			findSegment_ : function(vTime) {
				var segment = null;
				if (this.metaData_) {
					for ( var n = 0; n < this.metaData_.segments_.length; n++) {
						segment = this.metaData_.segments_[n];
						if (segment.startTime_ <= vTime * 1000 && vTime * 1000 < segment.startTime_ + segment.duration_) {
							return segment;
						}
					}
				}
				return null;
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
							this.addVideoEvent_(this.video_);
						} else {
							this.video_ = this.createNewVideo_();
							while (this.videoBox_.childNodes.length > 0) {
								this.videoBox_.removeChild(this.videoBox_.childNodes[0]);
							}
							this.videoBox_.appendChild(this.video_);
						}
					}
					this.video_.src = window.URL.createObjectURL(this.mediaSource_);
					if (this.firstSeekStatus_ != this.kFirstSeekWaitDownLoadSegment) {
						this.video_.play();
					}

				}
				if (!this.sourceBuffer_) {
					this.delayTime_++;
					if (this.delayTime_ > 500) {
						P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::Player::Play segment with delay count({0})", this.delayTime_));
						// this.config.delayTime = 0;//转换播放方式；
						// this.config.PLAY_TYPE = this.config.M3U8_TYPE;
					}
					return;
				}
				if (this.sourceBuffer_.updating)// 上一块数据还在等待中
				{
					return;
				}

				var currentTime = this.video_.currentTime.toFixed(1);
				var vRemaining = this.video_.duration - this.video_.currentTime;
				if (this.playerContext_.lastCurrentTime_ == currentTime && !this.video_.paused && !this.video_.ended && Math.abs(vRemaining) > 2) {
					this.breakTimes_++;
					if (this.breakTimes_ > 4) {
						if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.canplay
								|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeked
								|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.breakend) {
							if (this.cdeMediaPlayer_.onbufferstart) {
								P2P_ULOG_INFO(P2P_ULOG_FMT(
										"core::player::base::Player::videoStatusHandler onbreakstart onbufferend currentTime({0}) videoStatus({1})",
										this.video_.currentTime.toFixed(1), this.playerContext_.videoStatus_));
								this.cdeMediaPlayer_.onbufferstart();
							}
							this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.base.VIDEO_STATUS.breakstart;
						}
					}
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player break {0} times ...,current time {1},videoStatus({2})", this.breakTimes_,
							currentTime, this.playerContext_.videoStatus_));
					// if (this.breakTimes_ > 10) {
					// var seekToTime = this.video_.currentTime + 0.2;
					// if (seekToTime < this.video_.duration - 1) {
					// P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player
					// break {0} times ...,seek to {1}", this.breakTimes_,
					// seekToTime));
					// this.seek(seekToTime);
					// }
					// }

				}
				if (this.playerContext_.lastCurrentTime_ != currentTime && !this.video_.paused) {
					if (this.breakTimes_ > 4) {
						if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.breakstart) {
							if (this.cdeMediaPlayer_.onbufferend) {
								P2P_ULOG_INFO(P2P_ULOG_FMT(
										"core::player::base::Player::videoStatusHandler onbreakend onbufferend currentTime({0}) videoStatus({1})",
										this.video_.currentTime.toFixed(1), this.playerContext_.videoStatus_));
								this.cdeMediaPlayer_.onbufferend();
							}
							this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.base.VIDEO_STATUS.breakend;
						}
					}
					this.breakTimes_ = 0;
					this.playerContext_.lastCurrentTime_ = currentTime;
				}
				if (this.playerContext_.playState_ == p2p$.com.webp2p.core.player.base.PLAY_STATES.SEEKING && this.existTime_(this.preSeekTime_)) {
					this.playerContext_.playState_ = p2p$.com.webp2p.core.player.base.PLAY_STATES.SEEKED;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::playSegment existTime({0}) playState({1})", this.preSeekTime_,
							this.playerContext_.playState_));
				}
				if (this.playerContext_.playState_ == p2p$.com.webp2p.core.player.base.PLAY_STATES.SEEKED) {
					if (this.macSafariPattern_) {
						P2P_ULOG_TRACE(P2P_ULOG_FMT(
								"core::player::base::Player::playSegment firstSeekStatus={0} preSeekTime_({1})=firstSeekPosition_=({2})={3}",
								this.firstSeekStatus_, this.preSeekTime_, this.firstSeekPosition_, (this.preSeekTime_ == this.firstSeekPosition_)));
						do {
							if (this.firstSeekStatus_ == this.kFirstSeekStatusDone) {
								this.firstSeekStatus_ = this.kNoFirstSeek;
								if (this.preSeekTime_ == this.firstSeekPosition_) {
									break;
								}
							}
							this.jump2SeekPostion_ = true;
							this.video_.currentTime = this.preSeekTime_;
							P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player::playSegment this.video_.currentTime = this.preSeekTime_"));
						} while (0);
					}
					// if (!this.macSafariPattern_) {
					// this.video_.play();
					// }
					this.playerContext_.playState_ = p2p$.com.webp2p.core.player.base.PLAY_STATES.PLAY;
					P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player::playSegment existTime({0}) playState({1})", this.preSeekTime_,
							this.playerContext_.playState_));
				}
				this.calculateBufferLength_();

				if (this.blockList_.length > 0 && this.isWaitData_ && this.playerContext_.bufferLength_ < 3) {
					// add source
					var streamInfo = this.blockList_[0];
					this.blockList_.shift();

					// if (this.playerContext_.playState_ ==
					// p2p$.com.webp2p.core.player.base.PLAY_STATES.SEEKING &&
					// this.existTime_(this.preSeekTime_)) {
					//
					// } else {
					if (streamInfo.block.index_ == 0 && !this.seekForSafariPlay_) {
						this.isFirstSegment_ = true;
						this.seekForSafariPlay_ = true;
					}
					this.sourceBuffer_.appendBuffer(streamInfo.data);
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::Add data success ,bufferLegnth ({0}),"
							+ "blockLength ({1}s),segmentId ({2}),startTime ({3}),segmentLength ({4})", this.playerContext_.bufferLength_.toFixed(2),
							streamInfo.block.duration_ / 1000, streamInfo.block.id_, streamInfo.block.startTime_ / 1000, streamInfo.data.length));
					// }
					if (this.playerContext_.playState_ == p2p$.com.webp2p.core.player.base.PLAY_STATES.SEEKING) {
						// chrome don't need to pause
						if (this.macSafariPattern_) {
							this.video_.pause();
						}
					}

				}
			},

			calculateBufferLength_ : function() {
				if (this.playerContext_.playType_ == p2p$.com.webp2p.core.player.base.PLAY_TYPE.kPlayTypeBinary && this.video_) {
					var _st = 0;
					var _ed = 0;
					if (this.video_) {
						if (this.playState.status == this.playState.SEEKING) {
							this.preTime_ = this.preSeekTime_;
						} else {
							this.preTime_ = this.video.currentTime;
						}
					}

					if (this.playerContext_.bufferd_) {
						for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
							_st = this.playerContext_.bufferd_.start(i);
							if (_st < 1) {
								_st = 0;
							}
							_ed = this.playerContext_.bufferd_.end(i);
							P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player _st ({0}),_ed ({1}),length ({2}),i ({3})", _st, _ed,
									this.playerContext_.bufferd_.length, i));
						}
						for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
							_st = this.playerContext_.bufferd_.start(i);
							if (_st < 1) {
								_st = 0;
							}
							_ed = this.playerContext_.bufferd_.end(i);
							if (_st <= this.preTime_ && _ed >= this.preTime_) {
								this.playerContext_.bufferLength_ = (_ed - this.preTime_);
								break;
							}
						}
					}
				}
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player::Calculate buffer, current({0}), pre({1}), buffer({2}), pre({3}), next id({4})",
						this.video_.currentTime, this.preTime_, this.playerContext_.bufferLength_, this.preSegmentId_, this.nextSegmentId_));
			},

			existTime_ : function(value) {
				// console.log("++exit ID:",id);
				var b = false;
				for ( var i = 0; i < this.playerContext_.buffers_.length; i++) {
					var _start = this.playerContext_.buffers_[i][0];
					var _end = this.playerContext_.buffers_[i][1];
					//
					if (value >= _start && value <= _end) {
						b = true;
						break;
					}
				}
				return b;
			},

			createMediaSource_ : function() {
				var _media = null;
				try {
					_media = new MediaSource();

					this.onMediaSourceOpenBinded_ = this.onMediaSourceOpen_.bind(this);
					this.onMediaSourceEndedBinded_ = this.onMediaSourceEnded_.bind(this);
					this.onMediaSourceClosedBinded_ = this.onMediaSourceClosed_.bind(this);
					this.onMediaSourceErrorBinded_ = this.onMediaSourceError_.bind(this);

					_media.addEventListener('sourceopen', this.onMediaSourceOpenBinded_);
					_media.addEventListener('sourceended', this.onMediaSourceEndedBinded_);
					_media.addEventListener('sourceclose', this.onMediaSourceClosedBinded_);
					_media.addEventListener('error', this.onMediaSourceErrorBinded_);
				} catch (e) {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::Player::Add media source failed: {0}", (e || "").toString()));
				}
				return _media;
			},

			clearMediaSource_ : function() {
				if (!this.mediaSource_) {
					return;
				}

				try {
					var _me = this;
					if (this.sourceBuffer_) {
						this.mediaSource_.removeSourceBuffer(this.sourceBuffer_);
						this.removeSourceEvent_(this.sourceBuffer_);
						this.sourceBuffer_ = null;
					}
					this.mediaSource_.endOfStream();
					this.mediaSource_.removeEventListener('sourceopen', this.onMediaSourceOpenBinded_);
					this.mediaSource_.removeEventListener('sourceended', this.onMediaSourceEndedBinded_);
					this.mediaSource_.removeEventListener('sourceclose', this.onMediaSourceClosedBinded_);
					this.mediaSource_.removeEventListener('error', this.onMediaSourceErrorBinded_);
					this.mediaSource_ = null;
				} catch (e) {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::Player::Clear media source failed: {0}", (e || "").toString()));
				}
			},
			removeSourceBuffer_ : function() {
				if (!this.mediaSource_) {
					return;
				}

				try {
					if (this.sourceBuffer_) {
						this.mediaSource_.removeSourceBuffer(this.sourceBuffer_);
						this.removeSourceEvent_(this.sourceBuffer_);
						this.sourceBuffer_ = null;
					}
				} catch (e) {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::Player::Clear media source failed: {0}", (e || "").toString()));
				}
			},
			addMediaSourceHeader_ : function() {
				var _b = false;
				var typeName = 'video/mp2t; codecs="avc1.64001f"';
				if (this.playerContext_.metaDataType_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod) {
					this.playerContext_.aacName_ = 'mp4a.40.2';
				} else {
					if (this.channel_.metaData_.programId_ && this.channel_.metaData_.programId_.length != 32) {
						this.playerContext_.aacName_ = 'mp4a.40.5';
					} else {
						this.playerContext_.aacName_ = 'mp4a.40.2';
					}
				}

				if (this.playerContext_.avccName_) {
					if (this.playerContext_.isEncode_) {
						typeName = 'video/mp4; codecs="' + this.playerContext_.avccName_ + ', ' + this.playerContext_.aacName_ + '"';
					} else {
						typeName = 'video/mp2t; codecs="' + this.playerContext_.avccName_ + ', ' + this.playerContext_.aacName_ + '"';
					}
				}
				// var supported = MediaSource.isTypeSupported(typeName);
				if (this.mediaSource_ && !this.sourceBuffer_) {
					try {
						if (this.mediaSource_.sourceBuffers.length > 0) {
							return true;
						}

						P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player::Add media source header, type: {0}", typeName));
						this.sourceBuffer_ = this.mediaSource_.addSourceBuffer(typeName);
						this.addSourceEvent_(this.sourceBuffer_);
						_b = true;
					} catch (err) {
						P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player::Add media source header, type: {0} error: {1}", typeName, err.toString()));
						this.clearMediaSource_();
						_b = false;
					}

				}
				return _b;
			},

			onMediaSourceOpen_ : function(evt) {
				if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
					return;
				}

				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::onMediaSource open, {0} arguments", arguments.length));
				if (this.playerContext_.metaDataType_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod) {
					this.mediaSource_.duration = this.channel_.metaData_.totalDuration_ / 1000;
				}
				this.isActive_ = true;
				this.addMediaSourceHeader_();
				this.playSegment_();
			},

			onMediaSourceEnded_ : function(evt) {
				if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
					return;
				}
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::onMediaSource end, {0} arguments,({1}),({2})", arguments.length, arguments[1],
						arguments[2]));
			},
			onMediaSourceClosed_ : function(evt) {
				if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
					return;
				}
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::onMediaSource close, {0} arguments", arguments.length));
				this.isActive_ = false;
			},
			onMediaSourceError_ : function(evt) {
				if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
					return;
				}
				P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::Player::onMediaSource error, {0} arguments", arguments.length));
				this.isActive_ = false;
			},

			addSourceEvent_ : function(source) {
				try {

					this.onSourceUpdateEndBinded_ = this.onSourceUpdateEnd_.bind(this);
					this.onSourceUpdateBinded_ = this.onSourceUpdate_.bind(this);
					this.onSourceUpdateStartBinded_ = this.onSourceUpdateStart_.bind(this);
					this.onSourceUpdateErrorBinded_ = this.onSourceUpdateError_.bind(this);

					source.addEventListener('updateend', this.onSourceUpdateEndBinded_)
					source.addEventListener('update', this.onSourceUpdateBinded_);
					source.addEventListener('updatestart', this.onSourceUpdateStartBinded_);
					source.addEventListener('error', this.onSourceUpdateErrorBinded_);
				} catch (e) {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::Player::Add source event failed: {0}", (e || "").toString()));
				}
			},

			removeSourceEvent_ : function(source) {
				try {
					var me = this;
					source.removeEventListener('updateend', this.onSourceUpdateEndBinded_);
					source.removeEventListener('update', this.onSourceUpdateBinded_);
					source.removeEventListener('updatestart', this.onSourceUpdateStartBinded_);
					source.removeEventListener('error', this.onSourceUpdateErrorBinded_);
				} catch (e) {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::Player::Remove source event failed: {0}", (e || "").toString()));
				}
			},

			onSourceUpdateStart_ : function(evt) {
				if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
					return;
				}
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player::Source update start"));
				this.isWaitData_ = false;
			},

			onSourceUpdate_ : function(evt) {
				if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
					return;
				}
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player::Source updated"));
			},

			onSourceUpdateEnd_ : function(evt) {
				if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
					return;
				}
				this.isWaitData_ = true;
				if (this.firstSeekStatus_ == this.kFirstSeekWaitDownLoadSegment) {
					this.video_.currentTime = this.preSeekTime_;
					this.firstSeekStatus_ = this.kFirstSeekDownLoadSegmentOk;
				}
				try {
					this.playerContext_.bufferd_ = this.sourceBuffer_.buffered;
				} catch (err) {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::Player buffered error ({0})", err));
				}

				if (this.playerContext_.bufferd_ && this.playerContext_.bufferd_.length > 0) {
					for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::source update finished: start: {0}, end: {1}, length: {2}",
								this.playerContext_.bufferd_.start(i).toFixed(2), this.playerContext_.bufferd_.end(i).toFixed(2),
								this.playerContext_.bufferd_.length));
					}
				}
			},

			onSourceUpdateError_ : function(evt) {
				if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
					return;
				}
				P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::Player::Source update error:{0}", arguments.length));
			},

			createNewVideo_ : function() {
				var newVideo = document.createElement("video");
				this.addVideoEvent_(newVideo);
				newVideo.id = "player";
				newVideo.width = 400;
				newVideo.height = 300;
				newVideo.controls = "controls";
				newVideo.loop = "loop";
				return newVideo;
			},

			addVideoEvent_ : function(video) {
				var events = p2p$.com.webp2p.core.player.base.PLAY_STATES.VideoEvent;
				this.videoStatusHandlerBinded_ = this.videoStatusHandler_.bind(this);
				for ( var i = 0; i < events.length; i++) {
					try {
						video.addEventListener(events[i], this.videoStatusHandlerBinded_);
					} catch (e) {
						P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::Player::Add video event({0}) failed: {1}", _ve[i], (e || "").toString()));
					}
				}
			},

			removeVideoEvent_ : function(video) {
				var events = p2p$.com.webp2p.core.player.base.PLAY_STATES.VideoEvent;
				for ( var i = 0; i < events.length; i++) {
					try {
						video.removeEventListener(events[i], this.videoStatusHandlerBinded_);
					} catch (e) {
						P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::Player::Remove video event({0}) failed: {1}", _ve[i], (e || "").toString()));
					}
				}
			},

			videoStatusHandler_ : function(evt) {
				if (!this.video_ || this.video_ != evt.target) {
					return;
				}

				var vTime = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
				var type = evt.type;
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player::Video status handler, type({0}),vTime({1})", type, vTime));
				switch (type) {
				case "abort":
					break;
				case "canplay":
					this.onVideoCanPlay_();
					break;
				case "canplaythrough":
					this.onCanPlayThrough_();
					break;
				case "durationchange":
					break;
				case "emptied":
					break;
				case "ended":
					// this.onEnded_();
					break;
				case "error":
					this.onError_();
					break;
				case "loadeddata":
					this.onLoadedData_();
					break;
				case "loadedmetadata":
					this.onVideoLoadedMetaData_();
					break;
				case "loadstart":
					this.loadStart_();
					break;
				case "pause":
					break;
				case "play":
					this.onVideoPlay_();
					break;
				case "playing":
					this.onVideoPlaying_();
					break;
				case "progress":
					break;
				case "ratechange":
					break;
				case "seeked":
					this.onVideoSeeked_();
					break;
				case "seeking":
					this.onVideoSeeking_();
					break;
				case "stalled":
					break;
				case "suspend":
					break;
				case "timeupdate":
					this.onVideoTimeUpdate_();
					break;
				case "volumechange":
					break;
				case "waiting":
					this.onVideoWaiting_();
					break;
				}
			},

			loadStart_ : function() {
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::Video loaded start"));
				if (this.cdeMediaPlayer_.onbufferstart) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::Video event onloadStart bufferstart"));
					this.cdeMediaPlayer_.onbufferstart();
				}
				this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.base.VIDEO_STATUS.loadstart;
			},
			onLoadedData_ : function() {

			},

			onVideoLoadedMetaData_ : function() {
				this.videoDuration_ = this.video_.duration ? this.video_.duration.toFixed(1) : 0;
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player::Video loaded meta data, duration({0})", this.videoDuration_));
			},

			onVideoTimeUpdate_ : function() {
				var vTime = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
				this.playerContext_.currentPlayTime_ = vTime;
				var vRemaining = (this.videoDuration_ - vTime).toFixed(1);
				if (Math.abs(vRemaining) <= 0.5) {
					this.onEnded_();
				}
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player::Video time update, time({0}) remaining({1}) preSeekTime({2})", vTime, vRemaining,
						this.preSeekTime_));
			},

			onVideoSeeking_ : function() {

				var vTime = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
				if (this.macSafariPattern_) {
					if (this.jump2SeekPostion_) {
						P2P_ULOG_INFO(P2P_ULOG_FMT(
								"core::player::base::Player::onVideoSeeking innerSeek return vtime({0}) seekTo({1}) innerSeek({2}) videoStatus({3})", vTime,
								this.preSeekTime_, this.jump2SeekPostion_, this.playerContext_.videoStatus_));
						return;
					}
					if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeking) {
						P2P_ULOG_INFO(P2P_ULOG_FMT(
								"core::player::base::Player::onVideoSeeking autoBackSeek return vtime({0}) seekTo({1}) innerSeek({2}) videoStatus({3})", vTime,
								this.preSeekTime_, this.jump2SeekPostion_, this.playerContext_.videoStatus_));
						return;
					}

				}
				if (this.firstSeekStatus_ != this.kNoFirstSeek) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::onVideoSeeking firstSeek start"));
				}
				this.preSeekTime_ = vTime;
				if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.canplay
						|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeking
						|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeked
						|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.breakend) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::onVideoSeeking vtime({0}) seekTo({1}) status({2})", vTime, this.preSeekTime_,
							this.playerContext_.videoStatus_));
					if (this.cdeMediaPlayer_.onbufferstart) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::onVideoSeeking start seeking bufferstart"));
						this.cdeMediaPlayer_.onbufferstart();
					}
					this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeking;
				}
				// safari need pause the video first for seeking
				this.video_.pause();
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player::onVideoSeeking to({0}), paused({1})", vTime, this.video_.paused));
				this.seek2(vTime);
			},

			onVideoSeeked_ : function() {
				var vTime = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
				if (this.macSafariPattern_) {
					if (this.jump2SeekPostion_) {
						P2P_ULOG_INFO(P2P_ULOG_FMT(
								"core::player::base::Player::onVideoSeeked innerseek return vtime({0}) seekTo({1}) innerSeek({2}) videoStatus({3})", vTime,
								this.preSeekTime_, this.jump2SeekPostion_, this.playerContext_.videoStatus_));
						this.jump2SeekPostion_ = false;
						if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeking
								|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.loadstart) {
							P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::onVideoSeeked vtime({0}) status({1})", vTime,
									this.playerContext_.videoStatus_));
							this.video_.play();
							if (this.cdeMediaPlayer_.onbufferend) {
								P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::onVideoSeeked seeking bufferend"));
								this.cdeMediaPlayer_.onbufferend();
							}
							this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeked;
						}

						return;

					} else if (this.firstSeekStatus_ == this.kFirstSeekDownLoadSegmentOk) {
						this.firstSeekStatus_ = this.kFirstSeekStatusDone;
						this.video_.play();
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::onVideoSeeked firstSeek Done"));
					} else {
						P2P_ULOG_INFO(P2P_ULOG_FMT(
								"core::player::base::Player::onVideoSeeked autoBackSeek return vtime({0}) seekTo({1}) innerSeek({2}) videoStatus({3})", vTime,
								this.preSeekTime_, this.jump2SeekPostion_, this.playerContext_.videoStatus_));
					}
				} else {
					if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeking) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::onVideoSeeked vtime({0}) status({1})", vTime, this.playerContext_.videoStatus_));
						this.video_.play();
						if (this.cdeMediaPlayer_.onbufferend) {
							P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::onVideoSeeked end seeking bufferend"));
							this.cdeMediaPlayer_.onbufferend();
						}
						this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeked;
					} else if (this.firstSeekStatus_ == this.kFirstSeekDownLoadSegmentOk) {
						this.firstSeekStatus_ = this.kFirstSeekStatusDone;
						this.video_.play();
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::onVideoSeeked firstSeek Done"));
					}

					return;
				}

			},
			onVideoPlay_ : function() {
			},
			onVideoWaiting_ : function() {
			},

			onVideoCanPlay_ : function() {
				// onprepared onbufferend
				if (!this.macSafariPattern_) {
					this.onBufferEndAndOnPrepared_();
				}
			},
			onCanPlayThrough_ : function() {
				if (this.firstSeekStatus_ == this.kNoFirstSeek) {
					if (this.macSafariPattern_) {
						this.onBufferEndAndOnPrepared_();
					}
				}
			},

			onVideoPlaying_ : function() {
				if (this.firstSeekStatus_ != this.kNoFirstSeek) {
					if (this.macSafariPattern_) {
						this.onBufferEndAndOnPrepared_();
					}
				}

			},
			onBufferEndAndOnPrepared_ : function() {
				if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.loadstart) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::Video can play"));
					this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.base.VIDEO_STATUS.canplay;
					if (this.cdeMediaPlayer_.onbufferend) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::Video event onVideoCanPlay bufferend"));
						this.cdeMediaPlayer_.onbufferend();
					}
					if (this.cdeMediaPlayer_.onprepared) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::Video event onVideoCanPlay onprepared"));
						this.cdeMediaPlayer_.onprepared();
					}
				}
			},
			onEnded_ : function() {
				var vTime = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::Video ended, time({0})", vTime));
				if (this.cdeMediaPlayer_.oncomplete) {
					this.cdeMediaPlayer_.oncomplete();
				}
			},

			onError_ : function() {
				var vTime = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
				if (this.cdeMediaPlayer_.onerror) {
					var videoError = null;
					var errcode = -100;
					if (this.video_) {
						videoError = this.video_.error;
					}
					this.isActive_ = false;
					// MEDIA_ERR_ABORTED: 1
					// MEDIA_ERR_DECODE: 3
					// MEDIA_ERR_NETWORK: 2
					// MEDIA_ERR_SRC_NOT_SUPPORTED: 4
					if (videoError) {
						errcode = videoError.code;
					}
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::Error, play time({0}), time({1}), error code({2})",
							this.playerContext_.currentPlayTime_, vTime, errcode));
					this.cdeMediaPlayer_.onerror();
				}
			},

			stop : function() {
				this.isActive_ = false;
				this.stopFetchTimer_();
				this.clearMediaSource_();
				if (this.video_) {
					this.video_.pause();
					this.removeVideoEvent_(this.video_);
					this.video_ = null;
				}

				this.clear();
			},

			pause : function() {
				if (this.video_) {
					this.video_.pause();
				}
			},

			replay : function() {

			},

			seek : function(postion) {
				if (!this.mediaSource_) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::seek postion ({0}),mediaSource is null", postion));
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
				var vTime = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
				this.preSeekTime_ = Number(postion).toFixed(0);
				if (!this.macSafariPattern_) {
					this.video_.currentTime = postion;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::seek vtime({0}) seekTo({1})", vTime, this.preSeekTime_));
				} else {
					if (this.innerSeek_) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::seek innerseek return vtime({0}) seekTo({1})", vTime, this.preSeekTime_));
						return;
					}
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::seek videoStatus({0})", this.playerContext_.videoStatus_));
					if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.canplay
							|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeking
							|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeked
							|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.breakend) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::seek vtime({0}) status({1})", vTime, this.playerContext_.videoStatus_));
						if (this.cdeMediaPlayer_.onbufferstart) {
							P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::seek start seeking bufferstart  seekTo({0})", this.preSeekTime_));
							this.cdeMediaPlayer_.onbufferstart();
						}
						this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeking;
					}
					// this.video_.pause();
					P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player::seek vtime({0}) isPaused({1})", vTime, this.video_.paused));

					this.seek2(postion);
				}

			},

			seek2 : function(vTime) {
				var seek2Segment = this.findSegment_(vTime);
				if (seek2Segment) {
					this.playerContext_.playState_ = p2p$.com.webp2p.core.player.base.PLAY_STATES.SEEKING;
					this.nextSegmentId_ = seek2Segment.id_;
					try {
						this.sourceBuffer_.abort(); // mac
						// safari
						// play
					} catch (e) {
						P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::Player::seek2 abort error({0})", e));
					}
					if (this.macSafariPattern_ || !this.existTime_(this.preSeekTime_)) {
						if (this.firstSeekStatus_ != this.kFirstSeekDownLoadSegmentOk) {
							try {
								this.sourceBuffer_.remove(0, this.mediaSource_.duration);
								P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player::seek2 remove length {0}", this.sourceBuffer_.buffered.length));
								for ( var i = 0; i < this.sourceBuffer_.buffered.length; i++) {
									P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::base::Player::seek2 remove: start: {0}, end: {1}, length: {2}",
											this.sourceBuffer_.buffered.start(i), this.sourceBuffer_.buffered.end(i), this.sourceBuffer_.buffered.length));
								}

							} catch (e) {
								P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::Player::seek2 remove error({0})", e));
							}
						}

					}
					this.blockList_ = [];
					this.playerContext_.bufferLength_ = 0;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::seek2 seekTo:({0}),nextSegment:({1}),playState({2})", vTime, this.nextSegmentId_,
							this.playerContext_.playState_));
					this.onLoop_();
				} else {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::Player::seek2 find segment failed, seekTo({0}), nextSegment:({1})", vTime,
							this.nextSegmentId_));
				}
			},

			getCurrentPosition : function() {
				if (this.video_) {
					if (this.macSafariPattern_) {
						if (this.playerContext_.playState_ != p2p$.com.webp2p.core.player.base.PLAY_STATES.PLAY) {
							return this.preSeekTime_;
						}
					}
					return this.video_.currentTime;
				}
				return null;
			},

			getDuration : function() {
				if (this.video_) {
					return this.video_.duration.toFixed(1);
				}
				return null;
			},

			clear : function() {
				this.mediaSource_ = null;
				this.fectchInterval_ = 500;
				this.blockList_ = [];
				this.sourceBuffer_ = null;
				this.fileMp4_ = new p2p$.com.webp2p.tools.ts2mp4.FileHandler();
				this.initFnum_ = 0;
				this.fetchTimer_ = null;
				this.metaData_ = null;
				this.isFetchedMetaData_ = false;
				this.p2pGroupId_ = "";
				this.nextSegmentId_ = 0;
				this.preTime_ = 0;
				this.preSegmentId_ = "-1";
				this.playerContext_ = new p2p$.com.webp2p.core.player.base.Context();
				this.breakTimes_ = 0;
			}
		});