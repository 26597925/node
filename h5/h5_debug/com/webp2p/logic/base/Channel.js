p2p$.ns('com.webp2p.logic.base');
p2p$.com.webp2p.logic.base.Channel = JClass.extend_({
	tag_:"com::webp2p::logic::base::Channel",
	channelType_ : "base",
	type_ : 0,
	groupType_ : 0,
	id_ : "",
	playerTaskId_ : "",
	playerHistoryKey_ : "",
	globalParams_ : "",
	context_ : null,//
	url_ : null,//
	player_:null,

	protocolPool_ : null,
	manager_ : null,

	stablePeers_ : null,
	otherPeers_ : null,
	statData_ : null,

	opened_ : false,
	paused_ : false,
	reopenMode_ : false,
	redirectMode_ : false,
	hlsMode_ : false,
	directMetaMode_ : false,
	icpCode_ : 0,
	createTime_ : 0,
	openTime_ : 0,
	activeTime_ : 0,
	closeTime_ : 0,
	urlTagTime_ : 0,
	maxSleepTime_ : 0,
	maxSilentTime_ : 0,
	channelOpenedTime_ : 0,
	mediaStartTime_ : 0,
	mediaActiveTime_ : 0,
	playerStartTime_ : 0,
	playerFlushTime_ : 0,
	playerFlushInterval_ : 0,
	playerFlushMaxInterval_ : 0,
	playerInitialPosition_ : 0,
	playerSkipPosition_ : 0,
	playerSkipDuration_ : 0,
	lastScheduleTime_ : 0,
	lastPeerSortTime_ : 0,
	lastPieceShareInUpdateTime_ : 0,
	lastMessageUpdateTime_ : 0,
	firstSegmentId_ : 0,
	playerSegmentId_ : 0,
	urgentSegmentId_ : 0,
	urgentSegmentEndId_ : 0,
	completedSegmentId_ : 0,
	urgentSegmentIndex_ : 0,
	urgentIncompleteCount_ : 0,
	otherPeerRequestCount_ : 0,
	checksumTryTimes_ : 0,

	gslb_:null,//调出
    meta_:null,//m3u8
    metaData_ : null,//切片数据
	/*meta信息*/
    metaResponseCode_ : 0,
    metaResponseDetails_ : "",
    metaResponseType_ : "",
    metaResponseBody_ : "",

	checksumServerResponseCode_ : 0,
	segmentNotFoundTimes_ : 0,
	checksumLoadTime_ : 0,
	checksumFileData_ : "",

	peerReceiveTimeout_ : 0,
	peerDeadTimeout_ : 0,
	selectorReported_ : false,

	rtmfpServerReported_ : false,
	rtmfpGatherReported_ : false,
	cdeTrackerReported_ : false,
	webrtcServerReported_ : false,

	firstReceivePieceReported_ : false,
	p2pFirstPieceReported_ : false,
	playerPositionSkipped_ : false,
	playerBufferingSkipped_ : false,
	selfRanges_ : "",
	firstSeekTime_ : 0,
	scheduleTimer_ : null,
	reportTimer_ : null,
	static_:null,//统计上报
	strings_:null,
	global_:null,
	config_:null,
	/**
	 * params
	 * type:播放类型
	 * channelUrl:下载地址
	 **/
	init : function(type, channelUrl, decodedUrl, mgr) {
		// console.debug("base.Channel init");
		this.strings_ = p2p$.com.common.String;
		this.global_ = p2p$.com.common.Global;
		this.config_ = p2p$.com.selector.Config;
        this.context_ = new p2p$.com.webp2p.core.supernode.Context();
        this.metaData_ = new p2p$.com.webp2p.core.supernode.MetaData();
        this.statData_ = new p2p$.com.webp2p.logic.base.StatData();
        this.gslb_ = new p2p$.com.webp2p.logic.base.Gslb(this,decodedUrl);
        this.meta_ = new p2p$.com.webp2p.logic.base.Meta(this,type);
        this.selfRangesMessage_ = new p2p$.com.webp2p.protocol.base.Message();
        this.stablePeers_ = [];
        this.otherPeers_ = [];
        this.id_ = p2p$.com.webp2p.core.common.Md5.hexString_(channelUrl).toLowerCase();
        this.metaData_.type_ = type;
        this.metaData_.channelUrl_ = channelUrl;
        this.metaData_.storageId_ = this.id_;
		this.manager_ = mgr;
		this.type_ = type;
		this.url_ = decodedUrl;

		this.groupType_ = 0;
		this.opened_ = false;//
		this.paused_ = false;//
		this.reopenMode_ = false;
		this.redirectMode_ = false;
		this.hlsMode_ = true;
		this.directMetaMode_ = false;
		this.icpCode_ = 0; // default icp
		this.closeTime_ = 0;
		this.urlTagTime_ = 0;
		this.maxSleepTime_ = 60 * 1000;
		this.maxSilentTime_ = 120 * 1000;
		this.channelOpenedTime_ = 0;
		this.mediaStartTime_ = 0;
		this.mediaActiveTime_ = 0;
		this.playerStartTime_ = 0;
		this.playerFlushTime_ = 0;
		this.playerFlushInterval_ = 0;
		this.playerFlushMaxInterval_ = 0;
		this.playerInitialPosition_ = -1;
		this.playerSkipPosition_ = -1;
		this.playerSkipDuration_ = 0;
		this.lastScheduleTime_ = 0;
		this.lastPeerSortTime_ = 0;
		this.lastPieceShareInUpdateTime_ = 0;
		this.lastMessageUpdateTime_ = 0;
		this.firstSegmentId_ = -1;
		this.playerSegmentId_ = -1;
		this.urgentSegmentId_ = -1;
		this.urgentSegmentEndId_ = -1;
		this.completedSegmentId_ = -1;
		this.urgentSegmentIndex_ = 0;
		this.urgentIncompleteCount_ = 0;
		this.otherPeerRequestCount_ = 0;

		this.selectorReported_ = false;
		this.rtmfpServerReported_ = false;
		this.rtmfpGatherReported_ = false;
		this.webrtcServerReported_ = false;
		this.cdeTrackerReported_ = false;
		this.firstReceivePieceReported_ = false;
		this.p2pFirstPieceReported_ = false;
		this.playerPositionSkipped_ = false;
		this.playerBufferingSkipped_ = false;

		this.checksumTryTimes_ = 0;
		this.checksumServerResponseCode_ = 0;
		this.segmentNotFoundTimes_ = 0;
		this.openTime_ = 0;
		this.createTime_ = this.activeTime_ = this.global_.getMilliTime_();

		// default config
		this.peerReceiveTimeout_ = 30 * 1000;
		this.peerDeadTimeout_ = 30 * 1000;

		// gslb reload
		this.checksumLoadTime_ = 0;
		this.selfRanges_ = "";
		this.scheduleTimer_ = null;
		this.reportTimer_ = null;
		this.player_ = null;
        if(p2p$.com.tools)
        {
            this.static_ = new p2p$.com.tools.collector.Statics(this);
        }
	},
	setPlayer_:function(player)
	{
		this.player_ = player;
	},
	loadParams_ : function(params, customParams) {
		this.globalParams_ = params;
		this.playerTaskId_ = params["taskid"];
		if (params.hasOwnProperty("icp")) {
			this.icpCode_ = params["icp"];
		}
		this.metaData_.taskId_ = this.playerTaskId_;
		this.metaData_.rangeParamsSupported_ = (this.icpCode_ == 0); // only default icp support range params
		this.context_.loadParams_(this.globalParams_, customParams);
	},

	updateActiveTime_ : function(activate) {
		this.activeTime_ = this.global_.getMilliTime_();
	},

	setUrlTagTime_ : function(tagTime) {
		this.urlTagTime_ = tagTime;
	},

	open : function() {

		this.checksumTryTimes_ = 0;
		this.checksumServerResponseCode_ = 0;
		this.segmentNotFoundTimes_ = 0;
		this.openTime_ = this.activeTime_ = this.global_.getMilliTime_();
		this.mediaActiveTime_ = 0;
		this.urgentSegmentId_ = 0;
		this.urgentIncompleteCount_ = 0;
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}:open channel",this.tag_));
		if (this.protocolPool_ != null) {
			this.protocolPool_.exit();
		}
		this.protocolPool_ = new p2p$.com.webp2p.protocol.base.Pool(this.manager_.getEnviroment_(), this.context_, this.metaData_, this);
		this.opened_ = true;
		var env = this.manager_.getEnviroment_();
		env.setChannelParams_(this.url_.params_);
		this.context_.initialize_(this.url_, env);
        this.sendStatus_({type:"VIDEO.INIT"});
		return true;
	},
	onOpened_:function() {},
	onTimeout_:function()
	{
		return true;
	},
	onSchedule_:function()
	{
		return true;
	},
	close_ : function() {
		this.opened_ = false;
		this.closeTime_ = this.global_.getMilliTime_();
		this.stablePeers_ = [];
		this.otherPeers_ = [];
		this.meta_.close_();
        if(this.static_){
            this.static_.close_();
            this.static_ = null;
        }
		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		if (this.scheduleTimer_) {
			clearTimeout(this.scheduleTimer_);
			this.scheduleTimer_ = null;
		}
		if (this.reportTimer_) {
			clearTimeout(this.reportTimer_);
			this.reportTimer_ = null;
		}
		if (this.protocolPool_ != null) {
			this.protocolPool_.exit();
			// if( responseSchedule_.get() ) responseSchedule_->close();
		}

		this.protocolPool_ = null;
		// responseSchedule_.reset();

		if (this.type_ != p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeDownload) {
			var bucket = this.getStorageBucket_();
			for ( var n = 0; n < this.metaData_.segments_.length; n++) {
				var segment = this.metaData_.segments_[n];
				var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
				bucket.remove(objectId);
			}
		}
		this.metaData_.segments_ = [];
		return true;
	},

	pause : function() {
	},

	setChecksumTimeout_ : function() {
	},
	setProtocolTimeout_ : function() {
	},
	flushMetaCache_ : function() {
	},

	isOpened_ : function() {
		return this.opened_;
	},

	isPaused_ : function() {
		return this.paused_;
	},
    onGslbComplete_:function()
	{
        if (!("" == this.metaData_.sourceUrl_)) {
        	var params={
        		utime:this.gslb_.gslbTotalUseTime_,
				err:200,
				sn:this.gslb_.sn_
			};
            this.sendStatus_({type:"VIDEO.GSLB.LOADED",params:params});
            if (this.hlsMode_) {
                this.downloadMeta_();
            }
        }
	},
	downloadMeta_ : function() {
		this.activeTime_ = this.global_.getMilliTime_();
        this.sendStatus_({type:"VIDEO.META.LOADING"});
		this.meta_.load_(this.context_.gslbData_["nodelist"]);
	},

	onMetaComplete_ : function(code, info, data) {
		this.metaResponseCode_ = code;
        this.metaResponseDetails_ = info;
		if (200 != code && 302 != code) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Meta complete, channel({1}) open failed, response code({2}),info({3}) to player",this.tag_,this.id_,code,info));
            var params={};
            params["err"] = code;
            switch(code){
				case 20500:
				case 20501:
                    params["utime"]=this.gslb_.gslbTotalUseTime_;
                    break;
				case 20601:
					params["utime"]=this.meta_.metaUseTime_;
					break;
			}
			this.sendStatus_({type:"VIDEO.PLAY.ERROR",code:code,info:info,params:params});
		} else {
            var params={
            	utime:this.meta_.metaUseTime_
			};
            this.sendStatus_({type:"VIDEO.META.LOADED",code:0,params:params});
            this.onOpened_();
            if (this.channelOpenedTime_ <= 0) {
                this.channelOpenedTime_ = this.global_.getMilliTime_();
            }
            if (this.firstSeekTime_ > 0) {

                if (this.metaData_) {
                    for ( var n = 0; n < this.metaData_.segments_.length; n++) {
                        var segment = this.metaData_.segments_[n];
                        if (segment.startTime_ <= this.firstSeekTime_ * 1000 && this.firstSeekTime_ * 1000 < segment.startTime_ + segment.duration_) {
							this.urgentSegmentId_ = segment.id_;
							break;
                        }
                    }
                }
            }
            if (this.firstSegmentId_ < 0 && this.metaData_.segments_.length > 0) {
                this.firstSegmentId_ = this.metaData_.segments_[0].id_;
            }
		}
	},

	setScheduleTimeout_ : function(tag, timeoutMs) {
		var me = this;
		this.scheduleTimer_ = setTimeout(function() {
			me.onTimeout_(tag);
		}, timeoutMs);
	},
	setReportTimeout_ : function(tag, timeoutMs) {
		var me = this;
		this.reportTimer_ = setTimeout(function() {
			me.onTimeout_(tag);
		}, timeoutMs);
	},
	onReport_ : function() {
		if (this.static_) {
			this.static_.sendTraffic_(4,false);
		}
	},
	/*自身piece信息*/
	fillSelfPieceRanges_ : function(message) {
		message.ranges_ = [];
		if (!this.context_.p2pUploadEnabled_ || !this.manager_.getEnviroment_().p2pUploadEnabled_) {
			var littleRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
			littleRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
			littleRange.start_ = 0;
			littleRange.count_ = 1;
			message.ranges_.push(littleRange);
			return;
		}

		var lastTnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
		var lastPnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();

		lastTnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
		lastTnRange.start_ = -1;
		lastTnRange.count_ = 0;
		lastPnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;
		lastPnRange.start_ = -1;
		lastPnRange.count_ = 0;
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.p2pDisabled_) {
				continue;
			}
			for ( var k = 0; k < segment.pieces_.length; k++) {
				var piece = segment.pieces_[k];
				var lastRange = (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? lastTnRange : lastPnRange;
				if (piece.completedTime_ <= 0) {
					// complete
					if (lastRange.start_ >= 0) {
						message.ranges_.push(lastRange);
						if (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) {
							lastTnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
							lastTnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
							lastTnRange.start_ = -1;
							lastTnRange.count_ = 0;
						} else {
							// lastPnRange
							lastPnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
							lastPnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;
							lastPnRange.start_ = -1;
							lastPnRange.count_ = 0;
						}
					}
					continue;
				}
				if (lastRange.start_ < 0) {
					lastRange.start_ = piece.id_;
				}
				lastRange.count_ = Math.max(0, piece.id_ - lastRange.start_) + 1;
			}
		}
		if (lastTnRange.start_ >= 0) {
			message.ranges_.push(lastTnRange);
		}
		if (lastPnRange.start_ >= 0) {
			message.ranges_.push(lastPnRange);
		}
		this.selfRanges_ = "";
		for ( var n = 0; n < message.ranges_.length; n++) {
			var range = message.ranges_[n];
			if (range.type_ == 0) {
				var end = range.start_ + range.count_ - 1;
				this.selfRanges_ += "type:" + range.type_ + ",start:" + range.start_ + ",end:" + end + ",count:" + range.count_ + "\n";
			}
		}
	},

	resetPeerMessage_ : function(nowTime, resetSpeed, peer) {
		// send clean message
		var message = new p2p$.com.webp2p.protocol.base.Message();
		var cleanRequest = new p2p$.com.webp2p.protocol.base.RequestDataItem();
		cleanRequest.pieceId_ = -1;
		message.requests_.push(cleanRequest);
		peer.lastSegmentId_ = -1;
		peer.pendingRequestCount_ = 0;
		if (resetSpeed) {
			peer.lastReceiveSpeed_ = 0;
		}
		peer.totalSendRequests_ = peer.totalReceiveResponses_;
		peer.lastTimeoutTime_ = peer.activeTime_ = nowTime;
		peer.session_.send(message);
	},

	checkTimeoutPeers_ : function(nowTime) {
		var expireTime = nowTime - this.peerReceiveTimeout_;
		if (this.metaData_.p2pGroupId_ == "") {
			expireTime += (this.peerReceiveTimeout_ / 2);
		}
		for ( var n = 0; n < this.stablePeers_.length; n++) {
			var item = this.stablePeers_[n];
			if (item.pendingRequestCount_ <= 0) {
				continue;
			}
			if ((item.activeTime_ >= expireTime) && (item.lastSegmentId_ < 0 || item.lastSegmentId_ >= this.urgentSegmentId_)) {
				// all pending downloads before urgent segment should be clear
				continue;
			}

			item.timeoutTimes_++;

			P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}]Peer stable blocked {2} times, peer id({3}), address({4}),lastSegment({5}),urgentSegment({6}),isTiemout({7})",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), item.timeoutTimes_, item.session_.getRemoteId_(), item.session_.getRemoteAddress_(), item.lastSegmentId_, this.urgentSegmentId_, (item.activeTime_ < expireTime ? "true" : "false")));

			this.resetPieceReceivingBySession_(item.sessionId_);
			this.resetPeerMessage_(nowTime, false, item);
		}

		for ( var n = 0; n < this.otherPeers_.length; n++) {
			var item = this.otherPeers_[n];
			if (item.receivePiece_.receiveStartTime_ <= 0) {
				continue;
			}

			if (item.receivePiece_.receiveStartTime_ + this.peerReceiveTimeout_ > nowTime) {
				continue;
			}

			// timeout
			item.lastReceiveSpeed_ = 0;
			item.timeoutTimes_++;
			item.lastTimeoutTime_ = nowTime;
			item.receivePiece_.receiveStartTime_ = 0;
			item.receivePiece_.receiveByOther_ = false;

			// release piece mark
			var segmentIndex = this.metaData_.getSegmentIndexByPieceId_(item.receivePiece_.type_, item.receivePiece_.id_);
			if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
				continue;
			}
			var segment = this.metaData_.segments_[segmentIndex];
			var pieceIndex = segment.getPieceIndex_(item.receivePiece_.type_, item.receivePiece_.id_);
			if (pieceIndex < 0 || pieceIndex >= segment.pieces_.length) {
				continue;
			}
			var piece = segment.pieces_[pieceIndex];
			piece.receiveStartTime_ = 0;
			piece.receiveSessionId_ = 0;
			piece.receiveByOther_ = false;

			P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}]Peer timeout {2} times, peer({3}://{4}), address({5}), segment id({6}), piece type({7}), id({8}), {9}/{10}",this.tag_, this.getTypeName_(), item.timeoutTimes_, item.session_.getTypeName_(), item.session_.getRemoteId_(), item.session_.getRemoteAddress_(),segment.id_, p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(item.receivePiece_.type_), item.receivePiece_.id_, (piece.index_ + 1),segment.pieces_.length));
		}
	},

	checkTimeoutPieces_ : function(nowTime) {
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.p2pDisabled_) {
				continue;
			}
			if (segment.id_ < this.urgentSegmentId_ || segment.completedTime_ > 0) {
				continue;
			}
			for ( var k = 0; k < segment.pieces_.length; k++) {
				var piece = segment.pieces_[k];
				if (piece.completedTime_ > 0 || // already complete
				!piece.receiveByStable_ || // not receving
				piece.receiveStartTime_ <= 0 || // not receving by stable
				(piece.receiveStartTime_ + this.peerReceiveTimeout_ > nowTime)) // not timeout yet
				{
					continue;
				}

				// timeout
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}]Piece stable timeout, channel://{2}/{3}/{4}/{5}, {6}/{7}, release",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), this.id_, segment.id_, piece.getTypeName_(), piece.id_,(piece.index_ + 1), segment.pieces_.legnth));
				piece.receiveByStable_ = false;
				piece.receiveStartTime_ = 0;
				piece.receiveSessionId_ = 0;
			}
		}
	},

	checkPeerPieceRanges_ : function(nowTime) {
		var minInterval = this.context_.p2pShareRangeInterval_ * 1000;
		for ( var n = 0; n < this.otherPeers_.length; n++) {
			var item = this.otherPeers_[n];
			if (item.lastRangeExchangeTime_ + minInterval > nowTime) {
				continue;
			}

			if (!this.selfRangesMessage_.ranges_.length == 0) {
				item.lastRangeExchangeTime_ = nowTime;
				item.statSendMessage_(this.selfRangesMessage_);
				item.session_.send(this.selfRangesMessage_);
			}
		}
	},

	resetPieceReceivingBySession_ : function(sessionId) {
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.completedTime_ > 0) {
				continue;
			}
			for ( var k = 0; k < segment.pieces_.length; k++) {
				var piece = segment.pieces_[k];
				if (piece.receiveSessionId_ == sessionId) {
					piece.receiveByStable_ = false;
					piece.receiveByOther_ = false;
					piece.receiveStartTime_ = 0;
					piece.receiveSessionId_ = 0;
				}
			}
		}
	},

	getStorageBucket_ : function() {
		return p2p$.com.webp2p.core.storage.Pool.getDefaultBucket_();
	},

	resetSegmentPieceCompletion_ : function(segmentId) {
		var segmentIndex = this.metaData_.getSegmentIndexById_(segmentId);
		if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Reset segment piece completion find segment({1}) failed",this.tag_, segmentId));
			return false;
		}
		var segment = this.metaData_.segments_[segmentIndex];
		segment.resetPieceCompletion_();
		P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::Reset segment piece completion reset segment({1}) success",this.tag_, segmentId));
		return true;
	},

	processMessageResponses_ : function(nowTime, peer, message) {
		var updatePieceCount = 0;
		var invalidPieces = 0;
		var bucket = this.getStorageBucket_();
		var session = peer.session_;
		// responses: update storage data
		for ( var n = 0; n < message.responses_.length; n++) {
			var item = message.responses_[n];
			if (item.pieceId_ < 0) {
				// empty response
				break;
			}
			var segmentIndex = -1;
			if (item.segmentId_ >= 0) {
				segmentIndex = this.metaData_.getSegmentIndexById_(item.segmentId_);
			} else {
				segmentIndex = this.metaData_.getSegmentIndexByPieceId_(item.pieceType_, item.pieceId_);
			}
			if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}]Response piece from session({2}://{3}) segment not found for channel({4}),segment idx({5}), piece type({6}), id({7}), drop it!",this.tag_, p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), session.getTypeName_(), session.getRemoteAddress_(), this.id_, segmentIndex, p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(item.pieceType_), item.pieceId_));
				invalidPieces++;
				peer.totalInvalidErrors_++;
                if(this.static_)
                {
                    this.static_.sendTraffic_(0,session.getType(),0,0,item.data_.length);
                }
				continue;
			}
			var segment = this.metaData_.segments_[segmentIndex];
			var pieceIndex = segment.getPieceIndex_(item.pieceType_, item.pieceId_);
			if (pieceIndex < 0 || pieceIndex >= segment.pieces_.length) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}]Response piece from session({2}://{3}) piece not found for channel({4}),segment idx({5}), piece type({6}), id({7}), idx({8}), drop it!",this.tag_, p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_),session.getTypeName_(), session.getRemoteAddress_(), this.id_, segmentIndex, p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(item.pieceType_), item.pieceId_, pieceIndex));
				invalidPieces++;
				peer.totalInvalidErrors_++;
                if(this.static_)
                {
                    this.static_.sendTraffic_(0,session.getType(),0,0,item.data_.length);
                }
				continue;
			}
			// verify checksum
			var piece = segment.pieces_[pieceIndex];
			piece.receiveByStable_ = false;
			piece.receiveStartTime_ = 0;
			if (item.data_.length == 0) {
				continue;
			}
			if ((piece.size_ > 0 && item.data_.length != piece.size_) || !this.metaData_.verifyPiece_(piece, item.data_, item.data_.length)) {
				// checksum check failed
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}]Verify piece size/checksum failed from session({2}://{3}), peer id({4}),segment({5}), piece type({6}), id({7}), size({8}/{9})",this.tag_, p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), session.getTypeName_(), session.getRemoteAddress_(), session.getRemoteId_(), segment.id_, p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(piece.type_), piece.id_, item.data_.length, piece.size_));
				peer.lastReceiveSpeed_ = 0; // reset speed
				peer.totalInvalidErrors_++;
				peer.setPieceInvalid_(piece.type_, piece.id_, true);
				invalidPieces++;
				if (!(piece.size_ > 0 && item.data_.length != piece.size_)) {
					peer.totalChecksumErrors_++;
				}
				if(this.static_)
				{
					this.static_.sendTraffic_(0,session.getType(), 0, 1,item.data_.length);
				}
				continue;
			}

			var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
			if (!bucket.exists(objectId)) {
				if (segment.completedPieceCount_ > 0) {
					updatePieceCount++;
					segment.resetPieceCompletion_();
				}
			}

			if (segment.size_ > 0) {
				bucket.reserve(objectId, segment.size_);
			} else if (segment.size_ == 0 && segment.pieces_.length == 1) {
				bucket.reserve(objectId, item.data_.length);
			}
			if (!bucket.write(objectId, piece.offset_, item.data_, item.data_.length)) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}]Write piece to storage({2}) failed from session({3}://{4}), peer id({5}),segment({6}), piece type({7}), id({8}), size({9}/{10})",this.tag_, p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), bucket.getName_(), session.getTypeName_(), session.getRemoteAddress_(), session.getRemoteId_(), segment.id_, p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(piece.type_), piece.id_, item.data_.length, piece.size_));
				bucket.remove(objectId);
				segment.resetPieceCompletion_();
                if(this.static_)
                {
                    this.static_.sendTraffic_(0,session.getType(), 0, 0,item.data_.length);
                }
                continue;
			}
			piece.writeTimes_ = this.global_.getMilliTime_();
			peer.lastSegmentId_ = peer.lastSegmentId_ > segment.id_ ? peer.lastSegmentId_ : segment.id_;
			if (this.mediaStartTime_ <= 0) {
				this.mediaStartTime_ = this.global_.getMilliTime_();
			}

			piece.receiveSessionId_ = 0;
			if (piece.recvTimes_++ < 1) {
				// stat, avoid duplicated data
				var isUrgent = (this.urgentSegmentId_ < 0 || this.urgentSegmentEndId_ < 0)
						|| (segment.id_ >= this.urgentSegmentId_ && segment.id_ <= this.urgentSegmentEndId_);
				updatePieceCount++;
				piece.completedTime_ = nowTime;
				piece.receiveProtocol_ = session.getType();
				peer.statReceiveData_(1, item.data_.length);
				this.statData_.addReceiveData_(isUrgent, session.getType(), 1, item.data_.length);
				if(this.static_)
				{
					this.static_.sendTraffic_(1,session.getType(), session.getTerminalType_(), item.data_.length);
				}
				if (this.statData_.firstPieceFetchTime_ <= 0) {
					this.statData_.firstPieceFetchTime_ = nowTime - this.createTime_;
				}

				if (!this.firstReceivePieceReported_) {
					this.firstReceivePieceReported_ = true;
					this.sendStatus_({type:"ACTION.FIRST.PIECE",code:p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess, host:session.getRemoteAddress_(), ut:nowTime - this.createTime_});
				}
				if (!this.p2pFirstPieceReported_ && !session.isStable_()) {
					this.p2pFirstPieceReported_ = true;
					this.sendStatus_({type:"ACTION.FIRST.P2P.PIECE",code:p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess, host:session.getRemoteAddress_(), ut:nowTime - this.createTime_});
				}
			}

			segment.lastActiveTime_ = nowTime;
			if (segment.size_ <= 0) {
				segment.size_ = item.data_.length;
			}
			segment.checkPieceCompletion_();
			if (segment.completedTime_ > 0) {
				this.completedSegmentId_ = this.completedSegmentId_ > segment.id_ ? this.completedSegmentId_ : segment.id_;
				this.statData_.totalReceiveDuration_ += segment.duration_;
				// asyncSchedule(true);
			}
		}

		if (message.responses_.length > 0) {
			peer.timeoutTimes_ = 0;
			var pendingRequestCount = peer.pendingRequestCount_ - message.responses_.length;
			peer.pendingRequestCount_ = 0 > pendingRequestCount ? 0 : pendingRequestCount;
			peer.receivePiece_.receiveStartTime_ = 0;
			peer.updateSpeed_(nowTime);
		}
		return updatePieceCount;
	},

	updatePeersSpeed_ : function(nowTime, peers) {
		for ( var n = 0; n < peers.length; n++) {
			var peer = peers[n];
			peer.updateSpeed_(nowTime);
		}
	},

	getNextIdleStablePeer_ : function() {
		var result = null;
		for ( var n = 0; n < this.stablePeers_.length; n++) {
			var item = this.stablePeers_[n];
			if (item.pendingRequestCount_ <= 0) {
				result = item;
				break;
			}
		}
		return result;
	},

	getUrgentMaxDuration_ : function(ratio) {
		var maxDuration = this.context_.p2pUrgentSize_ * ratio;
		if (this.urgentSegmentIndex_ >= 0 && this.urgentSegmentIndex_ < this.metaData_.segments_.length
				&& this.urgentSegmentIndex_ + 1 < this.metaData_.segments_.length) {
			// at least 2 segment(s)
			var segment1 = this.metaData_.segments_[this.urgentSegmentIndex_];
			var segment2 = this.metaData_.segments_[this.urgentSegmentIndex_ + 1];
			if (maxDuration <= segment1.duration_) {
				maxDuration = segment1.duration_ + segment2.duration_;
				// P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}+{1}={2}",segment1.duration_,segment2.duration_,maxDuration));
			}
		}
		return maxDuration;
	},

	requireSegmentData_ : function(requestSegmentId, urgentSegmentId) {
		var segmentId = requestSegmentId;
		this.updateActiveTime_(true);
		this.mediaActiveTime_ = this.global_.getMilliTime_();
		if (this.playerStartTime_ <= 0) {
			this.playerStartTime_ = this.mediaActiveTime_;
		}
		this.updateUrgentSegment_(urgentSegmentId);
		if (this.metaData_.segments_.length <= 0) {
			// not load yet
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}:requireSegmentData_ Segment({0}) not load yet", this.tag_,segmentId));
			return null;
		}
		var segment = this.metaData_.getSegmentById_(segmentId);
		if (segment == null) {
			this.segmentNotFoundTimes_++;
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}:requireSegmentData_ Segment({0}) Not Found",this.tag_, segmentId));
			return null;
		}
		var bucket = this.getStorageBucket_();
		var objectId = this.metaData_.getSegmentStorageId_(segmentId);
		var objectExists = bucket.exists(objectId);
		var retStream = null;
		if (segment.completedTime_ > 0 && objectExists) {
			retStream = bucket.read(objectId, 0);
			segment.lastPlayTime_ = this.activeTime_;
			this.statData_.totalPlayedDuration_ += segment.duration_;
			for ( var n = 0; n < segment.pieces_.length; n++) {
				var piece = segment.pieces_[n];
				piece.playedTime_ = this.activeTime_;
				this.statData_.totalPlayedPieces_++;
				this.statData_.totalPlayedBytes_ += piece.size_;
			}
		} else {
			if (segment.completedTime_ > 0 && !objectExists) {
				// has been clearExpiredBlock ，need resetPieceCompletion_
				segment.resetPieceCompletion_();
				this.fillSelfPieceRanges_(this.selfRangesMessage_);
			}
			// need re download
			this.onSchedule_(false);
		}
		return {
			segment : segment,
			stream : retStream
		};
	},
	setFirstSeekTime_ : function(firstseektime) {
		this.firstSeekTime_ = firstseektime;
	},
	updateUrgentSegment_ : function(requireId) {
//		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::updateUrgentSegment_ id({1})",this.tag_,requireId));
		this.urgentSegmentId_ = requireId;
	},

	onProtocolSelectorOpen_ : function(errorCode) {
		if (this.protocolPool_ == null || !this.protocolPool_.isValid_()) {
			// already closed
			return;
		}

		P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}]Protocol selector({2}) open, channel({3}), code({4}), {5}",this.tag_, p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), this.context_.selectorServerHost_, this.id_, errorCode,(this.opened_ && p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess != errorCode) ? "FAILED" : "OK"));

		if (p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess == errorCode) {
			// report only open successfully
			if (!this.selectorReported_ && this.context_.selectorConnectedTime_ > 0) {
				this.selectorReported_ = true;
				// update gather and websocket trakcer info
				if(this.static_)
				{
					var url = new p2p$.com.common.Url();
					url.fromString_(this.context_.trackerServerHost_);
					var params_={};
                    params_["trackerServerIp_"]=url.host_;
                    params_["trackerServerPort_"]=url.port_;
                    url.fromString_(this.context_.webrtcServerHost_);
                    params_["webrtcServerIp_"]=url.host_;
                    params_["webrtcServerPort_"]=url.port_;
                    url.fromString_(this.context_.stunServerHost_);
                    params_["stunServerIp_"]=url.host_;
                    params_["stunServerPort_"]=url.port_;
					this.static_.setTrafficParams_(params_);
                    this.sendStatus_({type:"ACTION.SELECTOR.CONNECTED", code:0,host:this.context_.selectorServerHost_, ut:this.context_.selectorConnectedTime_});
				}
			}
		}
	},

	onProtocolSessionOpen_ : function(session) {
		if (this.protocolPool_ == null) {
			return;
		}
		var peer = null;// = new p2p$.com.webp2p.logic.base.Peer();
		var peers = session.isStable_() ? this.stablePeers_ : this.otherPeers_;
		session.updateTerminalType_();

		// bool alreadyExists = false;
		var sameTypeCount = 0;
		for ( var n = 0; n < peers.length; n++) {
			var item = peers[n];
			if (item.session_ == session) {
				peer = item;
			}
			if (item.session_ && item.session_.getType() == session.getType()) {
				sameTypeCount++;
			}
		}
		//
		if (peer != null) {
			// reset peer timeout
			peer.timeoutTimes_ = 0;
		} else {
			sameTypeCount++;
			peer = new p2p$.com.webp2p.logic.base.Peer();
			peer.session_ = session;
			peers.push(peer);
		}
		peer.activeTime_ = this.global_.getMilliTime_();

		if (!session.isStable_()) {
			if(this.static_)
			{
				this.static_.sendTraffic_(2, session.getType(), sameTypeCount);
			}
		}

		// tell him my piece ranges
		if (!this.selfRangesMessage_.empty() && this.manager_.getEnviroment_().p2pEnabled_ && !session.isStable_()) {
			peer.statSendMessage_(this.selfRangesMessage_);
			session.send(this.selfRangesMessage_);
			this.lastPieceShareInUpdateTime_ = this.global_.getMilliTime_();
		}
		this.onSchedule_(!session.isStable_());
	},

	onProtocolSessionMessage_ : function(session, message) {
		if (this.protocolPool_ == null) {
			return;
		}
		if (session == null) {
			return;
		}
		// onProtocolSessionAccept(session);
		var updatePieceCount = 0;
		var nowTime = this.global_.getMilliTime_();
		var peer = null;
		var peers = session.isStable_() ? this.stablePeers_ : this.otherPeers_;
		for ( var n = 0; n < peers.length; n++) {
			var item = peers[n];
			if (item.session_ == session) {
				peer = item;
				break;
			}
		}
		if (peer == null) {
			return;
		}
		peer.activeTime_ = nowTime;
		peer.statReceiveMessage_(message);

		var rangeUpdateCount = 0;
		if (message.ranges_.length > 0) {
			// ranges: update bitmap
			rangeUpdateCount = this.processMessageRanges_(nowTime, peer, message);
		}
		//
		var uploadable = (this.urgentIncompleteCount_ <= 0 || this.context_.p2pUrgentUploadEnabled_);
		if (this.manager_.getEnviroment_().p2pEnabled_ && uploadable && !message.requests_.length == 0) {
			this.processMessageRequests_(nowTime, peer, message);
		}
		//
		if (message.responses_.length > 0) {
			updatePieceCount += this.processMessageResponses_(nowTime, peer, message);
		}
		//
		// if( updatePieceCount > 0 )
		// {
		this.fillSelfPieceRanges_(this.selfRangesMessage_);
		// }
		//
		if ((rangeUpdateCount > 0 && (this.lastMessageUpdateTime_ + 300 * this.global_.kMicroUnitsPerMilli < nowTime))
				|| message.responses_.length > 0) {
			lastMessageUpdateTime_ = nowTime;
			this.onSchedule_(!session.isStable_());
		}
	},

	processMessageRequests_ : function(nowTime, peer, message) {
		// requests: get piece
		var totalResponsedSize = 0;
		var responseMessage = new p2p$.com.webp2p.protocol.base.Message();
		var bucket = this.getStorageBucket_();
		var session = peer.session_;

		// responseMessage.responses_.resize(message.requests_.size());
		for ( var n = 0; n < message.requests_.length; n++) {
			var item = message.requests_[n];
			var responseItem = new p2p$.com.webp2p.protocol.base.ResponseDataItem();
			responseMessage.responses_.push(responseItem);
			responseItem.pieceId_ = item.pieceId_;
			responseItem.pieceType_ = item.pieceType_;

			do {
				var segmentIndex = -1;
				if (item.segmentId_ >= 0) {
					segmentIndex = this.metaData_.getSegmentIndexById_(item.segmentId_);
				} else {
					segmentIndex = this.metaData_.getSegmentIndexByPieceId_(item.pieceType_, item.pieceId_);
				}
				if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
					// __ULOG_TRACE(__ULOG_FMT("logic::base::Channel", "[%s]Request piece from session(%s://%s) segment not found for channel(%s), "
					// "segment idx(%d), piece type(%s), id(" _I64FMT_ "), ignore it!"),
					// core::common::getMetaTypeName_(type_),
					// session.getTypeName_(), session.getRemoteAddress_().c_str(), id_.c_str(),
					// (int)segmentIndex, core::common::getPieceTypeName_(item.pieceType_), item.pieceId_);
					break;
				}

				var segment = this.metaData_.segments_[segmentIndex];
				if (segment.p2pDisabled_) {
					// p2p disabled
					break;
				}

				var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
				var objectExists = bucket.exists(objectId);
				if (!objectExists) {
					if (segment.completedPieceCount_ > 0) {
						// expired, reset
						segment.resetPieceCompletion_();
						this.fillSelfPieceRanges_(this.selfRangesMessage_);
					}
					break;
				}

				var pieceIndex = segment.getPieceIndex_(item.pieceType_, item.pieceId_);
				if (pieceIndex < 0 || pieceIndex >= segment.pieces_.length) {
					// __ULOG_TRACE(__ULOG_FMT("logic::base::Channel", "[%s]Request piece from session(%s://%s) piece not found for channel(%s), "
					// "segment idx(%d), piece type(%s), id(" _I64FMT_ "), idx(%d), ignore it!"),
					// core::common::getMetaTypeName_(type_),
					// session.getTypeName_(), session.getRemoteAddress_().c_str(), id_.c_str(),
					// (int)segmentIndex, core::common::getPieceTypeName_(item.pieceType_), item.pieceId_, (int)pieceIndex);
					break;
				}

				// verify checksum
				var piece = segment.pieces_[pieceIndex];
				// if( (piece.size_ > 0 && item.checksum_ != (size_t)piece.checksum_) || piece.completedTime_ <= 0 )
				if (piece.completedTime_ <= 0) {
					// checksum check failed
					// __ULOG_TRACE(__ULOG_FMT("logic::base::Channel", "[%s]Request verify piece checksum/complete failed from session(%s://%s), peer
					// id(%s), "
					// "segment(" _I64FMT_ "), piece type(%s), id(" _I64FMT_ ")"),
					// core::common::getMetaTypeName_(type_),
					// session.getTypeName_(), session.getRemoteAddress_().c_str(), session.getRemoteId_().c_str(),
					// segment.id_, core::common::getPieceTypeName_(piece.type_), piece.id_);
					break;
				}

				responseItem.segmentId_ = segment.id_;
				responseItem.pieceKey_ = piece.key_;
				if (piece.size_ <= 0) {
					// bucket.read(objectId, 0, responseItem.data_);
					break;
				} else {
					responseItem.data_ = bucket.read(objectId, piece.offset_, piece.size_);
				}
				totalResponsedSize += responseItem.data_.length;
			} while (false);
		}

		// if( !context_.p2pUploadLimit_ || !responseSchedule_ || !responseSchedule_->scheduleRequest(nowTime, peer, std::move(responseMessage),
		// (int)totalResponsedSize))
		// {
		this.statData_.addSendData_(session.getType(), responseMessage.responses_.length, totalResponsedSize);
		if(this.static_){
			this.static_.sendTraffic_(3, session.getType(), session.getTerminalType_(), totalResponsedSize);
		}
		peer.statSendData_(responseMessage.responses_.length, totalResponsedSize);
		peer.statSendMessage_(responseMessage);
		session.send(responseMessage);
		// }

		return 0;
	},

	getOtherPeerRequestCount_ : function() {
		var requestCount = 0;
		for ( var n = 0; n < this.otherPeers_.length; n++) {
			var item = this.otherPeers_[n];
			if (item.receivePiece_.receiveStartTime_ <= 0) {
				continue;
			}
			requestCount++;
		}
		return requestCount;
	},

	getStablePeersSpeedTooSlow_ : function() {
		if (this.urgentSegmentIndex_ < 0 || this.urgentSegmentIndex_ >= this.metaData_.segments_.length) {
			return false;
		}

		var stableTooSlow = false;
		var firstSegment = this.metaData_.segments_[this.urgentSegmentIndex_];
		if (firstSegment.size_ > 0 && firstSegment.duration_ > 0) {
			var firstRate = firstSegment.size_ * 1000 / firstSegment.duration_;
			var thresoldRate = firstRate * this.context_.cdnSlowThresholdRate_;
			var fastStableSpeed = 0;
			for ( var n = 0; n < this.stablePeers_.length; n++) {
				var fastPeer = this.stablePeers_[n];
				if (fastPeer.pendingRequestCount_ > 0) {
					fastStableSpeed = fastPeer.lastReceiveSpeed_;
					break;
				}
			}
			if (fastStableSpeed >= 0 && fastStableSpeed < thresoldRate) {
				stableTooSlow = true;
			}
		}

		return stableTooSlow;
	},

	updateUrgentIncompleteCount_ : function() {
		this.urgentIncompleteCount_ = 0;
		if (this.urgentSegmentIndex_ < 0 || this.urgentSegmentIndex_ >= this.metaData_.segments_.length) {
			return;
		}

		var maxDuration = this.context_.p2pUrgentSize_ * 1000;
		var totalDuration = 0;
		var urgentCount = 0;
		for ( var n = this.urgentSegmentIndex_; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.completedTime_ <= 0) {
				this.urgentIncompleteCount_++;
			}
			totalDuration += segment.duration_;
			urgentCount++;
			if (urgentCount > 1 && totalDuration >= maxDuration) {
				// urgent should has 2 segments at least if more segments eixst
				break;
			}
		}
	},

	getNextIdleOtherPeer_ : function(pieceType, pieceId) {
		var result = null;
		for ( var n = 0; n < this.otherPeers_.length; n++) {
			var item = this.otherPeers_[n];
			if (item.timeoutTimes_ > 5) {
				continue;
			}

			if (item.receivePiece_.receiveStartTime_ <= 0 && item.hasPiece_(pieceType, pieceId)) {
				result = item;
				break;
			}
		}
		return result;
	},

	processMessageRanges_ : function(nowTime, peer, message) {
		var rangeUpdateCount = 0;
		var session = peer.session_;

		// clean old bitmap status
		peer.tnPieceMark_.clear(true);
		peer.pnPieceMark_.clear(true);
		peer.selfRanges_ = "";
		for ( var n = 0; n < message.ranges_.length; n++) {
			var range = message.ranges_[n];
			if (range.type_ == 0) {
				var end = range.start_ + range.count_ - 1;
				peer.selfRanges_ += "type:" + range.type_ + ",start:" + range.start_ + ",end:" + end + ",count:" + range.count_ + "\n";
			}

			var bitmap = (range.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? peer.tnPieceMark_ : peer.pnPieceMark_;
			var maxBits = p2p$.com.webp2p.core.supernode.BitmapStatic.kMaxBitCount;
			for ( var index = range.start_, count = 0; count < range.count_ && count <= maxBits; index++, count++) {
				var old = bitmap.setValue(index, true);
				if (!old) {
					rangeUpdateCount++;
				}
			}
		}
		if (this.manager_.getEnviroment_().p2pEnabled_ && message.ranges_.length != 0
				&& (peer.lastRangeExchangeTime_ + this.context_.p2pShareRangeInterval_ * 1000 < nowTime)) {
			if (!this.selfRangesMessage_.empty()) {
				peer.lastRangeExchangeTime_ = nowTime;
				peer.statSendMessage_(this.selfRangesMessage_);
				session.send(this.selfRangesMessage_);
			}
		}
		if (rangeUpdateCount > 0 && this.lastPieceShareInUpdateTime_ + 2000 < nowTime) {
			this.lastPieceShareInUpdateTime_ = nowTime;
			this.updateMetaPieceShareInRanges_(true);
		}

		return rangeUpdateCount;
	},

	updateMetaPieceShareInRanges_ : function(startFromUrgent) {
		var startIndex = startFromUrgent ? ((this.urgentSegmentIndex_ < 0) ? 0 : this.urgentSegmentIndex_) : 0;
		for ( var n = startIndex; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.p2pDisabled_) {
				continue;
			}
			for ( var k = 0; k < segment.pieces_.length; k++) {
				var piece = segment.pieces_[k];
				piece.shareInRanges_ = 0;
				for ( var j = 0; j < this.otherPeers_.length; j++) {
					var peer = this.otherPeers_[j];
					if (peer.hasPiece_(piece.type_, piece.id_)) {
						piece.shareInRanges_++;
					}
				}
			}
		}
	},

	getTypeName_ : function() {
		return p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_);
	},

	onProtocolManagerOpen_ : function(mgr, errorCode) {
		if (this.protocolPool_ == null || !this.protocolPool_.isValid_()) {
			// already closed
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::[{1}] Protocol manager({2}://{3}) open, channel({4}), code({5}), {6}",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), mgr.getTypeName_(), mgr.getId_(), this.id_, errorCode,(this.opened_ && p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess != errorCode) ? "try open after 10 seconds..." : "OK"));
		// report only open successfully
		if (p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess == errorCode) {
			var url = new p2p$.com.common.Url();
			var params={};
			params["err"]=0;
			if (!this.rtmfpServerReported_ && mgr.getType() == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp && this.context_.rtmfpServerConnectedTime_ > 0) {
				this.rtmfpServerReported_ = true;
                url.fromString_(this.context_.rtmfpServerHost_);
				params["rip"]=url.host_;
				params["rport"]=url.port_;
				params["utime"]=this.context_.rtmfpServerConnectedTime_;
				this.sendStatus_({type:"ACTION.RTMFP.CONNECTED", code:0,params:params});
			}
			if (!this.cdeTrackerReported_ && mgr.getType() == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket && this.context_.trackerServerConnectedTime_ > 0) {
				this.cdeTrackerReported_ = true;
                url.fromString_(this.context_.trackerServerHost_);
				params["gip"]=url.host_;
				params["gport"]=url.port_;
				params["utime"]=this.context_.trackerServerConnectedTime_;
				this.sendStatus_({type:"ACTION.SOCKET.CONNECTED", code:0,params:params});
			}
			if (!this.webrtcServerReported_ && mgr.getType() == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc && this.context_.webrtcServerConnectedTime_ > 0) {
				this.webrtcServerReported_ = true;
                url.fromString_(this.context_.webrtcServerHost_);
				params["wrip"]=url.host_;
				params["wrport"]=url.port_;
				params["utime"]=this.context_.webrtcServerConnectedTime_;
				this.sendStatus_({type:"ACTION.WEBRTC.CONNECTED", code:0, params:params});
			}
		}
	},

	onProtocolSessionClose_ : function(session) {
		if (this.protocolPool_ == null || session == null) {
			// already closed
			return;
		}

		var erased = false;
		var sameTypeCount = 0;
		var peers = session.isStable_() ? this.stablePeers_ : this.otherPeers_;
		for ( var n = 0; n < peers.length; n++) {
			var item = peers[n];
			if (item.session_ == session) {
				erased = true;
				this.resetPieceReceivingBySession_(item.sessionId_);
				peers.splice(n--, 1);
			} else {
				if (item.session_ && item.session_.getType() == session.getType()) {
					sameTypeCount++;
				}
			}
		}

		if (erased) {
			// this.updateMetaPieceShareInRanges_(true);
			if (!session.isStable_()) {
				if(this.static_){
					this.static_.sendTraffic_(2, session.getType(), sameTypeCount);
				}
			}
		}
	},

	getActiveTime_ : function() {
		return this.activeTime_;
	},//

	getMaxSleepTime_ : function() {
		return this.maxSleepTime_;
	},

	getChannelUrl_ : function() {
		return this.metaData_.channelUrl_;
	},

	getMaxSilentTime_ : function() {
		return this.maxSilentTime_;
	},

	p2pIsReady_ : function() {
		if (this.protocolPool_ != null) {
			return this.protocolPool_.p2pIsReady_();
		}
		return false;
	},

	p2pisActive_ : function() {
		if (this.protocolPool_ != null) {
			return this.protocolPool_.p2pisActive_();
		}
		return false;
	},

	p2pDeactive_ : function() {
		this.otherPeers_ = [];
		if (this.protocolPool_ != null) {
			return this.protocolPool_.p2pDeactive_();
		}
		return false;
	},

	p2pActivate_ : function() {
		if (this.protocolPool_ != null) {
			return this.protocolPool_.p2pActivate_();
		}
		return false;
	},
	//get set
	getId_ : function() {
		return this.id_;
	},
	getChannelType_ : function() {
		return this.channelType_;
	},

	setGroupType : function(type) {
		this.groupType_ = type;
	},

	setReopenMode : function(mode) {
		this.reopenMode_ = mode;
	},
	setListener_ : function(listener) {
		this.wrapper_ = listener;
	},
	onGslbExpiredError_ : function() {
		var code = 30404;
		var info = "GSLB has expired";
        this.sendStatus_({type:"VIDEO.PLAY.ERROR",code:code,info:info});
	},
	sendStatus_:function(params,type)
	{
		if(this.static_){
            this.static_.sendStatus_(params);
		}
		if(this.wrapper_&&!type){
            this.wrapper_.sendStatus_(params);
		}
	},

	getAllStatus_ : function(params, result) {
		var simpleMode = params.get("simple");
		var needGslbData = params.get("gslb");
		var segmentStartWithPlayer = params.get("segmentStartWithPlayer") == "1";
		var maxDuration = params.get("maxDuration");
		if (segmentStartWithPlayer && maxDuration <= 0) {
			maxDuration = 300; // default
		}

		result["id"] = this.id_;
		result["type"] = this.getTypeName_();
		result["opened"] = this.opened_;
		result["paused"] = this.paused_;
		result["groupType"] = this.groupType_;
		result["redirectMode"] = this.redirectMode_;
		result["directMetaMode"] = this.directMetaMode_;
		result["playerHistoryKey"] = this.playerHistoryKey_;
		result["icpCode"] = this.icpCode_;
		result["channelUrl"] = this.metaData_.channelUrl_;
		result["channelPlayUrl"] = p2p$.com.common.String.format("/play?debug={0}&mcdn={1}&enc=base64&ext=m3u8&url={2}", this.context_.debug_ ? 1
				: 0, this.context_.cdnMultiRequest_ ? 1 : 0, p2p$.com.common.String.urlEncode_(p2p$.com.common.String
				.base64Encode_(this.metaData_.channelUrl_)));
		result["gslbEncryptUrl"] = this.gslb_.gslbRequestUrl_;
		result["createTime"] = this.createTime_;
		result["openTime"] = this.openTime_;
		result["activeTime"] = this.activeTime_;
		result["urlTagTime"] = this.urlTagTime_;
		result["gslbTryTimes"] = this.gslb_.gslbTryTimes_;
		result["metaTryTimes"] = this.meta_.metaTryTimes_;
		result["gslbServerResponseCode"] = this.gslb_.gslbServerResponseCode_;
		result["gslbServerErrorCode"] = this.gslb_.gslbServerErrorCode_;
		result["gslbServerErrorDetails"] = this.gslb_.gslbServerErrorDetails_;
        result["metaServerResponseCode"] = this.meta_.metaServerResponseCode_;
        result["checksumServerResponseCode"] = this.checksumServerResponseCode_;
		result["channelOpenedTime"] = this.channelOpenedTime_;
		result["maxSleepTime"] = this.maxSleepTime_;
		result["playerFlushTime"] = this.playerFlushTime_;
		result["playerFlushInterval"] = this.playerFlushInterval_;
		result["playerFlushMaxInterval"] = this.playerFlushMaxInterval_;
		result["playerInitialPosition"] = this.playerInitialPosition_;
		result["playerSkipPosition"] = this.playerSkipPosition_;
		result["playerSkipDuration"] = this.playerSkipDuration_;
		result["playerSegmentId"] = this.playerSegmentId_;
		result["urgentSegmentId"] = this.urgentSegmentId_;
		result["urgentSegmentEndId"] = this.urgentSegmentEndId_;
		result["urgentIncompleteCount"] = this.urgentIncompleteCount_;
		result["otherPeerRequestCount"] = this.otherPeerRequestCount_;
		result["completedSegmentId"] = this.completedSegmentId_;
		result["downloadedRate"] = this.statData_.urgentReceiveSpeed_;
		// result["downloadedDuration"] = getDownloadedDuration();
		result["downloadedDuration"] = this.statData_.downloadedDuration_;
		result["mediaStartTime"] = this.mediaStartTime_;
		result["metaResponseCode"] = this.metaResponseCode_;
		result["metaResponseDetails"] = this.metaResponseDetails_;
		result["metaResponseType"] = this.metaResponseType_;
		result["peerReceiveTimeout"] = this.peerReceiveTimeout_;
		result["gslbReloadInterval"] = this.gslb_.gslbReloadInterval_ * 1000;
		result["gslbLoadTime"] = this.gslb_.gslbLoadTime_;
		result["gslbReloadTimes"] = this.gslb_.gslbReloadTimes_;
		result["gslbConsumedTime"] = this.gslb_.gslbConsumedTime_;
		result["gslbTotalUseTime"] = this.gslb_.gslbTotalUseTime_;
		result["checksumLoadTime"] = this.checksumLoadTime_;
		result["metaLoadTime"] = this.meta_.metaLoadTime_;
		result["metaReloadTimes"] = this.meta_.metaReloadTimes_;
		result["selfRanges"] = this.selfRanges_;
		if (needGslbData) {
			result["gslbData"] = this.context_.gslbData_;
		}

		if (simpleMode) {
			return;
		}
		var contextStatus = result["context"] = {};
		this.context_.getAllStatus_(contextStatus);

		var statDataStatus = result["statData"] = {};
		this.statData_.getAllStatus_(statDataStatus);

		var metaDataStatus = result["metaData"] = {};
		this.metaData_.getAllStatus_(segmentStartWithPlayer ? this.urgentSegmentId_ : -1, maxDuration, params, metaDataStatus);
		if(this.static_){
			var reportTrafficStatus = result["reportTraffic"] = {};
			this.static_.reportTraffic_.getAllStatus_(reportTrafficStatus);
		}

		var resultStablePeers = result["stablePeers"] = [];
		for ( var n = 0; n < this.stablePeers_.length; n++) {
			var peer = this.stablePeers_[n];
			var stablePeersStatus = resultStablePeers[n] = {};
			peer.getAllStatus_(stablePeersStatus);
		}

		var resultOtherPeers = result["otherPeers"] = [];
		for ( var n = 0; n < this.otherPeers_.length; n++) {
			var peer = this.otherPeers_[n];
			var otherPeersStatus = resultOtherPeers[n] = {};
			peer.getAllStatus_(otherPeersStatus);
		}
	}
});
