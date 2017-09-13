p2p$.ns('com.webp2p.logic.live');

p2p$.com.webp2p.logic.live.ChannelStatic = {
	kTimerTagMetaUpdate : 0,
};

p2p$.com.webp2p.logic.live.Channel = p2p$.com.webp2p.logic.base.Channel.extend_({
	channelType_ : "liv",
	playLastSegmentCount_ : 0,
	lastFetchEndSegmentId_ : 0,
    liveFirstUrgentUpdated_ : false,
    liveSkipSegmentTime_ : 0,
	liveStreamId_ : "",
	backupMetaData_ : null,
	// boost::asio::deadline_timer liveTimer_;

	init : function(channelUrl, decodedUrl, mgr) {
		this._super(p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive, channelUrl, decodedUrl, mgr);
		this.tag_ = "com::webp2p::logic::live::Channel";
		this.context_.playType_ = "liv";
		this.maxSleepTime_ = 60 * 1000;
        this.lastFetchEndSegmentId_ = 0;
        this.liveFirstUrgentUpdated_ = false;
        this.liveSkipSegmentTime_ = 0;
	},

	getChannelType_ : function() {
		return this.channelType_;
	},

	open : function() {
		this._super();
		if (this.manager_.getEnviroment_().livePlayOffset_ > 0) {
			this.meta_.livePlayOffset_ = this.manager_.getEnviroment_().livePlayOffset_;
		}
		this.liveStreamId_ = this.url_.params_.get("stream_id");
		this.playerHistoryKey_ = "live:" + this.liveStreamId_;
		// this.updateUrlParams(false);
        this.gslb_.url_.params_.set("mslice", 5);
		var timeshift = this.gslb_.url_.params_.get("timeshift");
		if (timeshift != null) {
			this.meta_.livePlayerShift_ = this.strings_.parseNumber_(timeshift.value, 0);
			if (this.meta_.livePlayerShift_ == 0) {
                this.gslb_.url_.params_.erase(timeshift.key);
			}
		}
        this.gslb_.start_();
		return true;
	},
	close : function() {
		this._super();
		return true;
	},
	// override logic::base::Channel
	onOpened_ : function() {

		var minSegmentTime = -1;
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			this.meta_.liveMaxSegmentStartTime_ = Math.max(this.meta_.liveMaxSegmentStartTime_, segment.startTime_);
			if (minSegmentTime < 0 || minSegmentTime > segment.startTime_) {
				minSegmentTime = segment.startTime_;
			}
		}
		if (this.gslb_.gslbReloadTimes_ <= 0 && (minSegmentTime / 1000) > this.meta_.liveAbTimeShift_) {
			// fixed abtimeshift
            this.meta_.liveCurrentTime_ += (minSegmentTime / 1000 - this.meta_.liveAbTimeShift_);
		}

		var p2pGroupIdChanged = false;
		if (this.gslb_.gslbReloadTimes_ > 0) {
			var newSegment = {
				newSegmentCount_ : 0,
				newSegments_ : []
			};
			if (this.backupMetaData_ && this.backupMetaData_.p2pGroupId_ == this.metaData_.p2pGroupId_) {
				p2pGroupIdChanged = false;
				newSegment = this.metaData_.combineWith_(this.backupMetaData_, true, false);
			} else {
				p2pGroupIdChanged = true;
			}
			this.backupMetaData_.tidy();
            this.meta_.liveMaxSegmentStartTime_ = 0;
			for ( var k = 0; k < this.metaData_.segments_.length; k++) {
				var segment = this.metaData_.segments_[k];
                this.meta_.liveMaxSegmentStartTime_ = Math.max(this.meta_.liveMaxSegmentStartTime_, segment.startTime_);
			}

			P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::Add {1} backup meta segment(s) to reloaded channel({2}), total {3} segment(s) now",this.tag_,newSegment.newSegmentCount_, this.id_, this.metaData_.segments_.length));
		}

		this.stablePeers_ = [];
		this.otherPeers_ = [];
		if (this.protocolPool_ != null && !this.protocolPool_.initialize_()) {
			return false;
		}
		return true;
	},
    onGslbComplete_:function()
	{
        this.meta_.setLiveParams_();
		this._super();
	},

	removeExpiredSegments_ : function() {
		var validDuration = 0;
		var validSegmentCount = 0;
		var endIndex = this.metaData_.segments_.length;
		for (; endIndex != -1; endIndex--) {
			if (endIndex == this.metaData_.segments_.length) {
				continue;
			}

			var segment = this.metaData_.segments_[endIndex];
			validDuration += segment.duration_;
			validSegmentCount++;
			if (validDuration >= (this.livePlayMaxTimeLength_) * 1000) {
				break;
			}
		}
		if (endIndex > 0) {
			var expiredSegmentCount = this.metaData_.segments_.length - validSegmentCount;
			var expiredSegmentNames = "";
			var bucket = this.getStorageBucket_();
			for ( var n = 0; n < endIndex; n++) {
				var segment = this.metaData_.segments_[n];
				var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
				if (n == endIndex - 1) {
					expiredSegmentNames += segment.id_;
				} else {
					expiredSegmentNames += (segment.id_ + ",");
				}
				bucket.remove(objectId);
			}
			for ( var n = 0; n < endIndex; n++) {
				var segment = this.metaData_.segments_[n];
				this.metaData_.p2pPieceCount_ -= segment.pieces_.length;
			}
			this.metaData_.segments_.splice(0, endIndex);
			P2P_ULOG_TRACE(P2P_ULOG_FMT("{0} Remove {1} ({2}) expired meta segment(s) from channel({3}), total {4} segment(s) now",this.tag_,expiredSegmentCount, expiredSegmentNames, this.id_, this.metaData_.segments_.length));

			if (expiredSegmentCount > 0) {
				this.fillSelfPieceRanges_(this.selfRangesMessage_);
				this.metaData_.buildIndexes_();
			}
		}
	},

	onSchedule_ : function(shareMode) {
		var nowTime = this.global_.getMilliTime_();
		if (this.paused_) {
			return;
		}
		// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::live::Channel", "Schedule %s for channel(%s) ..."), shareMode ? "share only" : "multi mode", id_.c_str());
		this.lastScheduleTime_ = nowTime;
		this.updatePeersSpeed_(nowTime, this.stablePeers_);

		// check pieces to download
		var totalDuration = 0;
		var maxDuration = this.context_.p2pUrgentSize_ * 1000;
		this.urgentSegmentIndex_ = -1;
		for ( var n = 0; (this.urgentSegmentId_ >= 0) && (n < this.metaData_.segments_.length); n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.id_ == this.urgentSegmentId_) {
				// find urgent segment index
				this.urgentSegmentIndex_ = n;
				this.context_.playingPosition_ = segment.startTime_ / 1000;
			}
			if (n >= this.urgentSegmentIndex_) {
				if (totalDuration < maxDuration || this.urgentSegmentEndId_ <= this.urgentSegmentId_) {
					// urgent should has 2 segments at least if more segments eixst
					this.urgentSegmentEndId_ = segment.id_;
				}
				totalDuration += segment.duration_;
			}
		}

		if (this.urgentSegmentIndex_ < 0 && this.metaData_.segments_.length > 0) {
			this.urgentSegmentIndex_ = 0;
		}
		this.updateUrgentIncompleteCount_();
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
			// updateStatSyncSpeeds_();
		}

		this.metaData_.urgentSegmentId_ = this.urgentSegmentId_;
		if (this.urgentSegmentIndex_ < 0) {
			// all segments completed
			return;
		}

		// urgent area stable peers first
		var stableDispatchPiece = 0;
		if (!shareMode && this.stablePeers_.length > 0) {
			stableDispatchPiece = this.dispatchStablePeers_(this.urgentSegmentIndex_);
		}

		// p2p area try other peers, sort by last receive speed
		// if( manager_.getEnviroment_().p2pEnabled_ )
		// if( urgentIncompleteCount_ <= 0 )
		this.otherPeerRequestCount_ = this.dispatchOtherPeers_(this.urgentSegmentIndex_);

		// active cdn fetch area
		var fetchPieces = 0;
		if (!shareMode && (this.urgentSegmentIndex_ >= 0) && this.manager_.getEnviroment_().p2pEnabled_ && this.urgentIncompleteCount_ <= 0
				&& this.otherPeers_.length > 0) {
			fetchPieces = this.dispatchFetchRate_(this.urgentSegmentIndex_);
		}

		// updateStatDownloadedDuration();

		P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::Schedule {1} stable pieces ...",this.tag_,stableDispatchPiece));
	},
	dispatchFetchRate_ : function(startSegmentIndex) {
		if (this.stablePeers_.length == 0 || this.metaData_.segments_.length == 0) {
			return 0;
		}

		// active cdn fetch area
		var fetchPieceCount = 0;
		var idlePieceCount = 0;
		// var maxRatioFetchCount = 1;
		var maxFetchNumber = this.context_.p2pFetchRate_ * 100;
		var startFetchId = this.lastFetchEndSegmentId_;
		var nowTime = this.global_.getMilliTime_();
		var usedSegmentCount = 0;
		var usedOffsetBytes = 0;
		var maxOffsetBytes = (this.getStorageBucket_().getDataCapacity_()) * 2 / 3;

		var message = new p2p$.com.webp2p.protocol.base.Message();
		var peer = this.getNextIdleStablePeer_();
		for ( var n = startSegmentIndex; n < this.metaData_.segments_.length && peer; n++) {
			var segment = this.metaData_.segments_[n];
			if (this.urgentIncompleteCount_ > 0 && this.urgentSegmentEndId_ >= 0 && segment.id_ >= this.urgentSegmentEndId_) {
				// urgent incompleted
				break;
			}

			usedSegmentCount++;
			if (segment.size_ > 0) {
				// to avoid too many bytes
				usedOffsetBytes += segment.size_;
				if (usedOffsetBytes > maxOffsetBytes) {
					break;
				}
			} else if (usedSegmentCount > 10) {
				// to avoid too many segments
				break;
			}

			this.lastFetchEndSegmentId_ = segment.id_;
			if (segment.id_ <= startFetchId) {
				continue;
			} else if (segment.completedTime_ > 0) {
				continue;
			}

			var previousTn = false;
			var previousHit = false;
			for ( var k = 0; k < segment.pieces_.length && peer; k++) {
				var piece = segment.pieces_[k];
				if (piece.completedTime_ > 0 || piece.receiveStartTime_ > 0 || piece.shareInRanges_ > 0 || piece.size_ <= 0) {
					// completed or receiving or exits other peer
					previousHit = false;
					continue;
				}

				if (piece.randomNumber_ >= maxFetchNumber) {
					if (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) {
						if (k + 1 >= segment.pieces_.length) {
							continue;
						}
						var next = segment.pieces_[k + 1];
						if (next.completedTime_ > 0 || next.receiveStartTime_ > 0 || next.shareInRanges_ > 0) {
							continue;
						} else if (next.randomNumber_ >= maxFetchNumber) {
							continue;
						}
					} else if (!previousHit || !previousTn) {
						continue;
					}
				}

				var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
				requestItem.segmentId_ = segment.id_;
				requestItem.pieceType_ = piece.type_;
				requestItem.pieceId_ = piece.id_;
				requestItem.checksum_ = piece.checksum_;
				message.requests_.push(requestItem);
				piece.receiveByStable_ = true;
				piece.receiveStartTime_ = nowTime;
				piece.receiveSessionId_ = peer.sessionId_;
				if (segment.startReceiveTime_ <= 0) {
					segment.startReceiveTime_ = nowTime;
				}
				fetchPieceCount++;
				previousTn = (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn);
				previousHit = true;
			}
			if (message.requests_.length > 0) {
				if (peer.pendingRequestCount_ <= 0) {
					peer.lastSegmentId_ = segment.id_;
				}
				peer.pendingRequestCount_ += message.requests_.length;
				peer.statSendMessage_(message);
				peer.session_.send(message);
				message.requests_ = [];
				peer = this.getNextIdleStablePeer_();
			}
		}

		P2P_ULOG_TRACE(P2P_ULOG_FMT("{0} Random fetch, start index ({1}), total ({2}) idle pieces, fetched ({3}) fetch rate({4})",this.tag_,startFetchId, idlePieceCount, fetchPieceCount, this.context_.p2pFetchRate_ * 100));

		return fetchPieceCount;
	},
	dispatchStablePeers_ : function(startSegmentIndex) {
		if (this.stablePeers_.length == 0 || this.metaData_.segments_.length == 0) {
			return 0;
		}

		// urgent area stable peers first
		var totalDuration = 0;
		var stableDispatchPiece = 0;
		// var allPeersBusy = false;
		var busyPieceCount = 0;
		var appendDuration = 0;
		var nowTime = this.global_.getMilliTime_();
		var maxDuration = this.getUrgentMaxDuration_(this.manager_.getEnviroment_().isMobileNetwork_() ? 1000 : 1500); // 1.5 ratio for p2p
		var message = new p2p$.com.webp2p.protocol.base.Message();

		var peer = this.getNextIdleStablePeer_();
		for ( var n = startSegmentIndex;
		// n < endSegmentIndex && n < metaData_.segments_.size() && eachStablePiece > 0 && stableIterator != stablePeers_.end() && totalDuration <
		// maxDuration;
		n < this.metaData_.segments_.length && totalDuration < maxDuration; n++) {
			var segment = this.metaData_.segments_[n];
			this.lastFetchEndSegmentId_ = Math.max(this.lastFetchEndSegmentId_, segment.id_);
			totalDuration += segment.duration_;
			// if( segment.lastPlayTime_ > 0 ) continue;
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
				}

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

		return stableDispatchPiece;
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

		// forward offset
		if (startSegmentIndex >= 0) {
			// var startIndex = startSegmentIndex;
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
		if (offsetIndex < 0) {
			offsetIndex = this.metaData_.segments_.length - 1;
		}
		// backward check
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
		var nowTime = this.global_.getMilliTime_();
		for ( var k = 0; requestCount < maxCount && k < segment.pieces_.length; k++) {
			var piece = segment.pieces_[k];
			if (piece.completedTime_ > 0 || piece.size_ <= 0) {
				// completed
				continue;
			} else if (piece.receiveStartTime_ > 0)
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

	getAllStatus_2_ : function(params, result) {
		this._super(params, result);
		result["liveStreamId"] = this.liveStreamId_;
		// result["liveStartTime"] = this.liveStartTime_;
		// result["liveCurrentTime"] = this.liveCurrentTime_;
		// result["livePlayerShift"] = this.livePlayerShift_;
		// result["liveAbTimeShift"] = this.liveAbTimeShift_;
		// result["livePseudoPlayTime"] = this.getPseudoPlayTime_(nowTime);
		// result["liveNowPlayOffset"] = this.liveNowPlayOffset_;
		// result["livePlayOffset"] = this.livePlayOffset_;
		// result["livePlayMaxTimeLength"] = this.livePlayMaxTimeLength_;
		// result["liveMetaRefreshInterval"] = this.liveMetaRefreshInterval_;
		// result["liveSkipSegmentTime"] = this.liveSkipSegmentTime_;
	},

	getPseudoPlayTime_ : function(nowTime) {
		var liveSkipTime = Math.floor(this.liveSkipSegmentTime_ / 1000);
		this.liveSkipTime = Math.max(Math.min(liveSkipTime, 60), 0);
		var playFlushGap = 0;
		var pseudoTime = this.liveCurrentTime_ + (nowTime - this.liveMetaLoadTime_) / 1000;
		return pseudoTime - this.livePlayOffset_ + this.context_.specialPlayerTimeOffset_ + playFlushGap + liveSkipTime; // +
		// (time_t)(metaData_.totalGapDuration_ / 1000);
	},

	updateUrgentSegment_ : function(requireId) {
		this._super(requireId);
		if ( /* fromPlayer && */requireId >= 0 && !this.liveFirstUrgentUpdated_) {
			this.liveFirstUrgentUpdated_ = true;
			this.liveSkipSegmentTime_ = 0;
			for ( var n = 0; n < this.metaData_.segments_.length; n++) {
				var segment = this.metaData_.segments_[n];
				if (segment.id_ >= requireId) {
					break;
				}
				if (segment.duration_ > 0) {
					this.liveSkipSegmentTime_ += segment.duration_;
				}
			}
		}
	}
});
