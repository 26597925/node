p2p$.ns('com.webp2p.logic.base');
p2p$.com.webp2p.logic.base.PeerStatic = {
	nextSessionId_ : 0,
};
p2p$.com.webp2p.logic.base.Peer = CdeBaseClass.extend_({

	session_ : null,
	tnPieceMark_ : null,
	pnPieceMark_ : null,
	tnPieceInvalid_ : null,
	pnPieceInvalid_ : null,

	activeTime_ : 0,
	lastTimeoutTime_ : 0,
	totalSendBytes_ : 0,
	totalSendPieces_ : 0,
	totalReceiveBytes_ : 0,
	totalReceivePieces_ : 0,
	totalSendSpeed_ : 0,
	totalReceiveSpeed_ : 0,
	totalChecksumErrors_ : 0,
	totalInvalidErrors_ : 0,
	lastSendTime_ : 0,
	lastReceiveTime_ : 0,
	lastSendSpeed_ : 0,
	lastReceiveSpeed_ : 0,

	totalSendRanges_ : 0,
	totalSendRequests_ : 0,
	totalSendResponses_ : 0,
	totalReceiveRanges_ : 0,
	totalReceiveRequests_ : 0,
	totalReceiveResponses_ : 0,
	lastSendStartBytes_ : 0,
	lastReceiveStartBytes_ : 0,
	lastReceiveStartTime_ : 0,
	lastRangeExchangeTime_ : 0,

	sessionId_ : 0,
	lastSegmentId_ : 0,
	maxQuotaPieces_ : 0,
	timeoutTimes_ : 0,
	praisedTimes_ : 0,
	pendingRequestCount_ : 0,
	scheduleLocked_ : false,
	receivePiece_ : null,
	streamMark_ : 0,
	streamAvaiable_ : false,
	streamDetected_ : false,
	streamUploading_ : false,
	selfRanges_ : "",

	init : function() {
		this.sessionId_ = ++p2p$.com.webp2p.logic.base.PeerStatic.nextSessionId_;
		if (this.sessionId_ <= 0) {
			this.sessionId_ = p2p$.com.webp2p.logic.base.PeerStatic.nextSessionId_ = 1;
		}
		this.receivePiece_ = new p2p$.com.webp2p.core.supernode.MetaPiece();
		this.activeTime_ = 0;
		this.lastTimeoutTime_ = 0;
		this.totalSendBytes_ = 0;
		this.totalSendPieces_ = 0;
		this.totalReceiveBytes_ = 0;
		this.totalReceivePieces_ = 0;
		this.totalSendSpeed_ = 0;
		this.totalReceiveSpeed_ = 0;
		this.totalChecksumErrors_ = 0;
		this.totalInvalidErrors_ = 0;
		this.lastSendTime_ = 0;
		this.lastReceiveTime_ = 0;
		this.lastSendSpeed_ = 0;// used by peer upload schedule
		this.lastReceiveSpeed_ = -1;
		this.lastSegmentId_ = -1;
		this.maxQuotaPieces_ = 2;
		this.timeoutTimes_ = 0;
		this.praisedTimes_ = 0;
		this.pendingRequestCount_ = 0;

		this.totalSendRanges_ = 0;
		this.totalSendRequests_ = 0;
		this.totalSendResponses_ = 0;
		this.totalReceiveRanges_ = 0;
		this.totalReceiveRequests_ = 0;
		this.totalReceiveResponses_ = 0;

		this.lastSendStartBytes_ = 0;
		this.lastReceiveStartBytes_ = 0;
		this.lastReceiveStartTime_ = 0;
		this.lastRangeExchangeTime_ = 0;
		this.scheduleLocked_ = false;

		this.streamMark_ = -1;
		this.streamDetected_ = false;
		this.streamAvaiable_ = false;
		this.streamUploading_ = false;
		this.tnPieceMark_ = new p2p$.com.webp2p.core.supernode.Bitmap();
		this.pnPieceMark_ = new p2p$.com.webp2p.core.supernode.Bitmap();
		this.tnPieceInvalid_ = new p2p$.com.webp2p.core.supernode.Bitmap();
		this.pnPieceInvalid_ = new p2p$.com.webp2p.core.supernode.Bitmap();
		this.selfRanges_ = "";
	},

	hasPiece_ : function(type, id) {
		var bitmap = (type == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? this.tnPieceMark_ : this.pnPieceMark_;
		var invalid = (type == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? this.tnPieceInvalid_ : this.pnPieceInvalid_;

		if (invalid.getValue(id)) {
			// already invalid
			return false;
		}
		// if(bitmap.data_.length > Math.floor(id / 8))
		// {
		// P2P_ULOG_TRACE(P2P_ULOG_FMT("com.webp2p.logic.base.Peer::Ptype({0}),pip({1}),sessionId({2}),remoteId({3}),data.length({4}),index({5})",
		// type,id,this.sessionId_,this.session_.remoteId_,bitmap.data_.length,Math.floor(id / 8)));
		// }
		return bitmap.getValue(id);
	},

	setPieceMark_ : function(type, id, on) {
		var mark = (type == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? this.tnPieceMark_ : this.pnPieceMark_;
		mark.setValue(id, on);
	},

	setPieceInvalid_ : function(type, id, on) {
		var invalid = (type == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? this.tnPieceInvalid_ : this.pnPieceInvalid_;
		invalid.setValue(id, on);
	},

	updateSpeed_ : function(nowTime) {
		var speed = this.session_.getUpdateReceiveSpeed_(nowTime, this.pendingRequestCount_ > 0);
		if (speed >= 0) {
			this.lastReceiveSpeed_ = speed;
		}
	},

	statSendMessage_ : function(message) {
		this.totalSendRanges_ += (message.ranges_.length == 0 ? 0 : 1);
		this.totalSendRequests_ += message.requests_.length;
		this.totalSendResponses_ += message.responses_.length;
	},

	statSendData_ : function(pieces, bytes) {
		this.lastSendStartBytes_ = this.totalSendBytes_;
		this.totalSendBytes_ += bytes;
		this.totalSendPieces_ += pieces;
		this.lastSendTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
	},

	// statSendData_:function( bytes ) {
	//		
	// },

	statReceiveBegin_ : function() {
		this.lastReceiveStartBytes_ = this.totalReceiveBytes_;
		this.lastReceiveStartTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
	},

	statReceiveEnd_ : function() {
		this.lastReceiveStartTime_ = 0;
	},

	statReceiveMessage_ : function(message) {
		this.totalReceiveRanges_ += message.ranges_.length;
		this.totalReceiveRequests_ += message.requests_.length;
		this.totalReceiveResponses_ += message.responses_.length;
	},

	statReceiveData_ : function(pieces, bytes) {
		this.totalReceivePieces_ += pieces;
		this.statReceiveData2_(bytes);
	},

	statReceiveData2_ : function(bytes) {
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		this.totalReceiveBytes_ += bytes;
		this.lastReceiveTime_ = nowTime;
		if (this.lastReceiveStartTime_ > 0 && nowTime > this.lastReceiveStartTime_) {
			var sizeDiff = this.totalReceiveBytes_ - this.lastReceiveStartBytes_;
			this.lastReceiveSpeed_ = sizeDiff * 1000 / (nowTime - this.lastReceiveStartTime_);
		}
	}
});