p2p$.ns('com.webp2p.logic.vod');
p2p$.com.webp2p.logic.vod.ChannelStatic = {
	kTimerSchedule : 0,
	kTimerReport : 1,
};
p2p$.com.webp2p.logic.vod.Channel = p2p$.com.webp2p.logic.base.Channel.extend_({
	// 初始化参数
	channelType_ : "vod",
	downloader_ : null,

	lastUrgentStartAbsTime_ : 0,
	lastUrgentStartMetaTime_ : 0,
	lastRequireSegmentId_ : 0,

	init : function(channelUrl, decodedUrl, mgr) {
		this._super(p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod, channelUrl, decodedUrl, mgr);
		this.context_.playType_ = "vod";
		this.lastUrgentStartAbsTime_ = 0;
		this.lastUrgentStartMetaTime_ = 0;
		this.lastRequireSegmentId_ = 0;
	},

	getChannelType_ : function() {
		return this.channelType_;
	},

	open : function() {
		if (this._super()) {
			P2P_ULOG_TRACE(P2P_ULOG_FMT("vod.super return true"));
		}
		this.gslbRequestUrl_ = this.url_.toString();
		this.gslbEncryptUrl_ = this.gslbRequestUrl_;
		this.downloadGslb_();
		return true;
	},
	close : function() {
		this._super();
	},

	// override logic::base::Channel
	onOpened_ : function() {
		this.stablePeers = [];
		this.otherPeers_ = [];
		if (this.protocolPool_ != null && !this.protocolPool_.initialize_()) {
			return false;
		}
		this.setScheduleTimeout_(p2p$.com.webp2p.logic.vod.ChannelStatic.kTimerSchedule, 3 * 1000);
		this.setReportTimeout_(p2p$.com.webp2p.logic.vod.ChannelStatic.kTimerReport, this.context_.statReportInterval_ * 1000);
		return true;
	},

	detectAutoRedirectMode_ : function() {
	},

	dispatchStablePeers_ : function(startSegmentIndex) {
		if (this.stablePeers_.length == 0 || this.metaData_.segments_.length == 0) {
			return null;
		}

		// urgent area stable peers first
		var totalDuration = 0;
		var stableDispatchPiece = 0;
		// bool allPeersBusy = false;
		var busyPieceCount = 0;
		var appendDuration = 0;
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		var maxDuration = this.getUrgentMaxDuration_(this.manager_.getEnviroment_().isMobileNetwork_() ? 1000 : 1500); // 1.5 ratio for p2p
		var message = new p2p$.com.webp2p.protocol.base.Message();

		if (this.urgentSegmentIndex_ >= 0 && this.urgentSegmentIndex_ < this.metaData_.segments_.length
				&& this.metaData_.segments_[this.urgentSegmentIndex_].completedTime_ <= 0) {
			// cancel all far downloading stable peers when urgent segment is not completed
			for ( var n = 0; n < this.stablePeers_.length; n++) {
				var item = this.stablePeers_[n];
				if (item == null || item.pendingRequestCount_ <= 0 || item.lastSegmentId_ == this.urgentSegmentId_) {
					continue;
				}

				P2P_ULOG_INFO(P2P_ULOG_FMT("logic::vod::Channel [{0}]Cancel far downloading stable peer, segment({1}), pending({2}), id({3}), address({4})",
						p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), item.lastSegmentId_, item.pendingRequestCount_, item.session_
								.getRemoteId_(), item.session_.getRemoteAddress_()));

				this.resetPieceReceivingBySession_(item.sessionId_);
				this.resetPeerMessage_(nowTime, false, item);
			}
		}

		var peer = this.getNextIdleStablePeer_();
		var retPeer = peer;
		var retSegment = null;
		for ( var n = startSegmentIndex;
		// n < endSegmentIndex && n < metaData_.segments_.size() && eachStablePiece > 0 && stableIterator != stablePeers_.end() && totalDuration < maxDuration;
		n < this.metaData_.segments_.length && totalDuration < maxDuration; n++) {
			var segment = this.metaData_.segments_[n];
			totalDuration += segment.duration_;
			// if( segment.startReceiveTime_ > 0 ) continue;
			if (segment.completedTime_ > 0) {
				continue;
			}

			for ( var k = 0; k < segment.pieces_.length && peer != null && busyPieceCount <= 0; k++) {
				var piece = segment.pieces_[k];
				if (piece.completedTime_ > 0) {
					if (message.requests_.length > 0) {
						// if message.requests_.length > 0
						// Keep downloadrange Continuous
						// break
						break;
					} else {
						// already complete
						// continue;
						continue;
					}

				} else if (piece.receiveStartTime_ > 0) {
					// duplicate receiving
					var pieceTimeout = ((piece.size_ > 0) ? (this.context_.p2pUrgentSize_ / 2) : this.context_.p2pUrgentSize_) * 1000;
					if (piece.receiveByStable_ && (piece.receiveStartTime_ + pieceTimeout > nowTime)) {
						// receving by stable cdn peer
						busyPieceCount++;
						continue;
					}
					// busyPieceCount ++;
					// break;
				}
				retSegment = segment;
				if (segment.size_ > 0 && segment.duration_ > 0) {
					appendDuration += piece.size_ / segment.size_ * segment.duration_ * 1000.0;
				}

				var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
				requestItem.urgent_ = true;
				requestItem.segmentId_ = segment.id_;
				requestItem.pieceType_ = piece.type_;
				requestItem.pieceId_ = piece.id_;
				requestItem.checksum_ = piece.checksum_;
				message.requests_.push(requestItem);
				piece.receiveByStable_ = true;
				piece.receiveStartTime_ = nowTime + appendDuration;
				piece.receiveSessionId_ = peer.sessionId_;
				if (segment.startReceiveTime_ <= 0) {
					segment.startReceiveTime_ = nowTime;
				}

				stableDispatchPiece++;
				if (message.requests_.length >= 50) {
					if (peer.pendingRequestCount_ <= 0) {
						peer.lastSegmentId_ = segment.id_;
					}
					peer.activeTime_ = nowTime;
					peer.pendingRequestCount_ += message.requests_.length;
					peer.statSendMessage_(message);
					peer.session_.send(message);
					message.requests_ = [];
					appendDuration = 0;
					peer = null;
					break;
				}
			}
			if (message.requests_.length > 0 && peer != null) {
				if (peer.pendingRequestCount_ <= 0) {
					peer.lastSegmentId_ = segment.id_;
				}
				peer.activeTime_ = nowTime;
				peer.pendingRequestCount_ += message.requests_.length;
				peer.statSendMessage_(message);
				peer.session_.send(message);
				message.requests_ = [];
				appendDuration = 0;
				peer = null;
			}
		}

		return {
			"stableDispatchPiece" : stableDispatchPiece,
			"peerInfo" : retPeer,
			"segmentInfo" : retSegment
		};
	},

	// updateUrgentSegment_:function( fromPlayer) {
	//		
	// var completedNum = 0;
	// for( var n = 0; n < this.metaData_.segments_.length ; n ++ )
	// {
	// var segment = this.metaData_.segments_[n];
	// if( segment.completedTime_ > 0 )
	// {
	// completedNum ++;
	// continue;
	// }
	// }
	// if(completedNum >= 3)
	// {
	// this.urgentSegmentIndex_ = completedNum - 1;
	// P2P_ULOG_TRACE(P2P_ULOG_FMT("Current Urgent Segment is :{0}",this.urgentSegmentIndex_));
	// }
	// },
	// getStorageBucket_:function() {
	// },

	onSchedule_ : function(shareMode) {
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		// if( lastScheduleTime_ + 300 * core::common::kMicroUnitsPerMilli > nowTime )
		// {
		// return;
		// }
		if (this.paused_) {
			// skip schedule
			return;
		}

		// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::vod::Channel::Schedule {0} for channel({1}) ...", shareMode ? "share only" : "multi mode", this.id_));

		this.lastScheduleTime_ = nowTime;
		this.updatePeersSpeed_(nowTime, this.stablePeers_);
		// if( !shareMode ) this.updateUrgentSegment_();
		P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::vod::Channel::Schedule urgent segment index:{0}, id:{1}", this.urgentSegmentIndex_, this.urgentSegmentId_));
		if (this.playerSkipPosition_ > 0 && !this.playerPositionSkipped_) {
			// int mediaIndex = -1;
			// int64 skipDuration = playerSkipDuration_ > 0 ? playerSkipDuration_ : metaData_.directDuration_;
			// for( size_t n = 0; n < metaData_.segments_.size(); n ++ )
			// {
			// core::supernode::MetaSegment &segment = metaData_.segments_[n];
			// if( segment.completedTime_ <= 0 )
			// {
			// break;
			// }
			//				
			// if( segment.startTimeActual_ >= skipDuration )
			// {
			// // the first segment after advertisment
			// mediaIndex = (int)n;
			// break;
			// }
			// }
			//
			// if( mediaIndex >= 0 )
			// {
			// playerPositionSkipped_ = true;
			// for( size_t n = (size_t)mediaIndex; n < metaData_.segments_.size(); n ++ )
			// {
			// core::supernode::MetaSegment &segment = metaData_.segments_[n];
			// if( (segment.startTimeActual_ + segment.duration_) >= (skipDuration + playerSkipPosition_) )
			// {
			// // change urgent segment
			// urgentSegmentId_ = segment.id_;
			// break;
			// }
			// }
			// }
		}

		// check pieces to download
		var totalDuration = 0;
		var maxDuration = this.context_.p2pUrgentSize_ * 1000;
		this.urgentSegmentIndex_ = -1;
		for ( var n = 0; (this.urgentSegmentId_ >= 0) && (n < this.metaData_.segments_.length); n++) {
			var segment = this.metaData_.segments_[n];

			if (segment.id_ == this.urgentSegmentId_) {
				// find urgent segment index
				this.urgentSegmentIndex_ = n;
				this.context_.playingPosition_ = segment.startTimeActual_ / 1000;
			}

			if (this.urgentSegmentIndex_ >= 0 && n >= this.urgentSegmentIndex_) {
				if (totalDuration < maxDuration || this.urgentSegmentEndId_ <= this.urgentSegmentId_) {
					// urgent should has 2 segments at least if more segments eixst
					this.urgentSegmentEndId_ = segment.id_;
				}
				totalDuration += segment.duration_;
			}
		}

		if (!shareMode) {
			this.checkTimeoutPieces_(nowTime);
			this.checkTimeoutPeers_(nowTime);
			this.checkPeerPieceRanges_(nowTime);

			this.lastPeerSortTime_ = nowTime;
			this.stablePeers_.sort(function(item1, item2) {
				if (item1.lastReceiveSpeed_ == item2.lastReceiveSpeed_) {
					return item1.lastTimeoutTime_ - item2.lastTimeoutTime_;
				}
				return item2.lastReceiveSpeed_ - item1.lastReceiveSpeed_;
			});
			this.otherPeers_.sort(function(item1, item2) {
				if (item1.lastReceiveSpeed_ == item2.lastReceiveSpeed_) {
					return item1.lastTimeoutTime_ - item2.lastTimeoutTime_;
				}
				return item2.lastReceiveSpeed_ - item1.lastReceiveSpeed_;
			});
			this.statData_.addReceiveData_(true, p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn, 0, 0); // flush speed
		}
		//
		this.metaData_.urgentSegmentId_ = this.urgentSegmentId_;
		this.updateUrgentIncompleteCount_();

		// urgent area stable peers first
		var retVal = null;
		if (!shareMode && (this.urgentSegmentIndex_ >= 0) && this.stablePeers_.length > 0) {
			retVal = this.dispatchStablePeers_(this.urgentSegmentIndex_);
			if (retVal != null && retVal.segmentInfo != null) {
				P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::vod::Channel Schedule {0} piece request(s) to ({1}), channel({2}), "
						+ "urgentSegmentId({3}), segmentID({4}), segmentPieces({5})", retVal.stableDispatchPiece, retVal.peerInfo.session_.remoteAddress_,// this.stablePeers_.length,
				this.id_, this.urgentSegmentId_, retVal.segmentInfo.id_,
						((this.urgentSegmentIndex_ < this.metaData_.segments_.length) ? this.metaData_.segments_[retVal.segmentInfo.id_].pieces_.length : 0)));
			}
		}
		//
		// // p2p area try other peers, sort by last receive speed
		// //if( manager_.getEnviroment_().p2pEnabled_ )
		// //if( urgentIncompleteCount_ <= 0 )

		this.otherPeerRequestCount_ = this.dispatchOtherPeers_((this.urgentSegmentIndex_ >= 0) ? this.urgentSegmentIndex_ : 0);

	},

	dispatchOtherPeers_ : function(startSegmentIndex) {
		if (this.otherPeers_.length == 0 || this.metaData_.segments_.length == 0) {
			return 0;
		}

		// p2p area try other peers, sort by last receive speed
		var stableTooSlow = false;
		var requestCount = this.getOtherPeerRequestCount_();
		var maxCount = this.urgentIncompleteCount_ > 0 ? this.context_.p2pMaxUrgentRequestPieces_ : this.context_.p2pMaxParallelRequestPieces_;
		var bucket = this.getStorageBucket_();
		var offsetIndex = -1;
		var usedSegmentCount = 0;
		var usedOffsetBytes = 0;
		var maxOffsetBytes = bucket.getDataCapacity_() * 2 / 3;
		//
		// // forward offset
		if (startSegmentIndex >= 0) {
			// size_t startIndex = startSegmentIndex;
			var totalDuration = 0;
			var maxDuration = this.getUrgentMaxDuration_(this.manager_.getEnviroment_().isMobileNetwork_() ? 1500 : 2000); // 2 ratio of urgent size
			stableTooSlow = this.getStablePeersSpeedTooSlow_();
			for ( var n = startSegmentIndex; requestCount < maxCount && n < this.metaData_.segments_.length; n++) {
				var segment = this.metaData_.segments_[n];
				totalDuration += segment.duration_;
				usedSegmentCount++;
				if (segment.size_ > 0) {
					// to avoid too many bytes
					usedOffsetBytes += segment.size_;
					if (usedOffsetBytes > maxOffsetBytes || (usedSegmentCount + 5) > bucket.getMaxOpenBlocks_()) {
						break;
					}
				} else if (usedSegmentCount > 10) {
					// to avoid too many segments
					break;
				}

				if (segment.p2pDisabled_) {
					continue;
				}
				if (totalDuration <= maxDuration && !stableTooSlow && this.urgentSegmentIndex_ >= 0) {
					continue;
				}
				if (offsetIndex < 0) {
					offsetIndex = n;
				}
				requestCount = this.dispatchSegmentForOtherPeers_(stableTooSlow, requestCount, maxCount, segment);
				if (this.urgentIncompleteCount_ > 0 && this.urgentSegmentEndId_ >= 0 && segment.id_ >= this.urgentSegmentEndId_) {
					// urgent incompleted
					break;
				}
			}
		}
		//
		if (offsetIndex < 0) {
			return requestCount;
		}
		//
		// // backward check
		for ( var n = offsetIndex; requestCount < maxCount && n >= 0 && n >= startSegmentIndex; n--) {
			var segment = this.metaData_.segments_[n];
			if (segment.p2pDisabled_ || segment.completedTime_ > 0) {
				continue;
			}
			requestCount += this.dispatchSegmentForOtherPeers_(stableTooSlow, requestCount, maxCount, segment);
		}
		return requestCount;
	},

	dispatchSegmentForOtherPeers_ : function(stableTooSlow, requestCount, maxCount, segment) {
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		for ( var k = 0; requestCount < maxCount && k < segment.pieces_.length; k++) {
			var piece = segment.pieces_[k];
			if (piece.completedTime_ > 0 || piece.size_ <= 0) {
				// completed
				continue;
			} else if (piece.receiveStartTime_ > 0) // || k == 4 ) // test only
			{
				// duplicate receiving
				var pieceTimeout = ((piece.size_ > 0) ? (this.context_.p2pUrgentSize_ / 2) : this.context_.p2pUrgentSize_) * 1000;
				if (piece.receiveStartTime_ + pieceTimeout > nowTime) {
					if (!piece.receiveByStable_ || !stableTooSlow) {
						// not expired
						continue;
					}
				}
			}

			var peer = this.getNextIdleOtherPeer_(piece.type_, piece.id_);

			if (peer == null) {
				// no idle peer has this piece
				continue;
			}

			var message = new p2p$.com.webp2p.protocol.base.Message();
			var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
			requestItem.segmentId_ = segment.id_;
			requestItem.pieceType_ = piece.type_;
			requestItem.pieceId_ = piece.id_;
			requestItem.checksum_ = piece.checksum_;
			message.requests_.push(requestItem);
			piece.receiveByOther_ = true;
			piece.receiveSessionId_ = peer.sessionId_;
			piece.receiveStartTime_ = nowTime;
			peer.activeTime_ = nowTime;
			peer.lastSegmentId_ = segment.id_;
			peer.receivePiece_ = piece;
			peer.statSendMessage_(message);
			peer.statReceiveBegin_();
			peer.session_.send(message);
			requestCount++;

			// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::vod::Channel::dispatchSegmentForOtherPeer"));
		}

		return requestCount;
	},

	sortStablePeers_ : function() {
		// for ( var n = 0; n < this.stablePeers_.length; n++) {
		// var item = this.stablePeers_[n];
		// }
	},

	onTimeout_ : function(tag) {

		switch (tag) {
		case p2p$.com.webp2p.logic.vod.ChannelStatic.kTimerSchedule: {
			this.onSchedule_(false);
			this.setScheduleTimeout_(p2p$.com.webp2p.logic.vod.ChannelStatic.kTimerSchedule, 3 * 1000);
			break;
		}
		case p2p$.com.webp2p.logic.vod.ChannelStatic.kTimerReport: {
			this.onReport_();
			this.setReportTimeout_(p2p$.com.webp2p.logic.vod.ChannelStatic.kTimerReport, this.context_.statReportInterval_ * 1000);
			break;
		}
		default:
			break;
		}

	},

	// override protocol::base::EventListener
	onProtocolSessionMessage_ : function(session, message) {
		this._super(session, message);
	}
});