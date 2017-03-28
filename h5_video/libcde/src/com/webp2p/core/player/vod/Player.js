p2p$.ns('com.webp2p.core.player2.vod');
p2p$.com.webp2p.core.player2.vod.Player = p2p$.com.webp2p.core.player.base.Player
		.extend_({
			addNextSegmentId_ : false,
			cdeMediaPlayer_ : null,

			init : function(cdeMediaPlayer) {
				this._super();
				this.addNextSegmentId_ = false;
				this.playerContext_.metaDataType_ = p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod;
				this.cdeMediaPlayer_ = cdeMediaPlayer;
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
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::Player::metaData_ is null"));
					return null;
				}
			},

			calculateBufferLength_ : function() {
				if (this.playerContext_.playType_ == p2p$.com.webp2p.core.player.base.PLAY_TYPE.kPlayTypeBinary && this.video_) {
					var _st = 0;
					var _ed = 0;
					if (this.playerContext_.playState_ != p2p$.com.webp2p.core.player.base.PLAY_STATES.PLAY) {
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
							P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::vod::Player::Calculate buffer item({0}), _st ({1}),_ed ({2}),length ({3})", i, _st, _ed,
									this.playerContext_.bufferd_.length));

							if (this.video_.currentTime < 1 && this.isFirstSegment_) {
								this.playerContext_.bufferLength_ = 4;

								// if the device is the mobile phone or the safari om mac book
								if (this.macSafariPattern_) {
									this.jump2SeekPostion_ = true;
									this.seekForSafariPlay_ = true;
									this.video_.currentTime = 0.1;
									this.isFirstSegment_ = false;
									break;
								}
								// var platform = p2p$.com.webp2p.core.supernode.Enviroment.getOSType_();
								// var position = platform.indexOf("Win");
								// if (position == -1) {
								// // this.video_.currentTime = _st;
								// }

							} else {
								if (_st <= this.preTime_ && _ed >= this.preTime_) {
									this.playerContext_.bufferLength_ = (_ed - this.preTime_);
									break;
								} else {
									this.playerContext_.bufferLength_ = 0;
								}
							}

						}
					}
				}
				P2P_ULOG_TRACE(P2P_ULOG_FMT(
						"core::player::vod::Player::Calculate buffer, currentTime ({0}),preTime_ ({1}),bufferLength_ ({2}),preSegment ({3}),nextSegmentId ({4}),playState({5})",
						this.video_.currentTime, this.preTime_, this.playerContext_.bufferLength_, this.preSegmentId_, this.nextSegmentId_,
						this.playerContext_.playState_));
			}
		});