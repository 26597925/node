p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.MetaSegment = JClass.extend_({
	id_ : 0,
	startTime_ : 0,
	startTimeActual_ : 0,
	duration_ : 0,
	urlOffset_ : 0,
	index_ : 0,
	pieceTnCount_ : 0,
	piecePnCount_ : 0,
	size_ : 0,
	beginOfMeta_ : false,
	directMode_ : false,
	discontinuity_ : false,
	p2pDisabled_ : false,
	timeGapChecked_ : false,
	advertMonitorReported_ : false,
	url_ : "",
	mediaUrl_ : "",
	playUrl_ : "",
	advertMonitorUrl_ : "",
	programId_ : "",
	pieces_ : null,
	moreMediaUrls_ : null,
	pictureWidth_ : 0,
	pictureHeight_ : 0,

	lastActiveTime_ : 0,
	completedPieceCount_ : 0,
	completedTime_ : 0,
	completedSize_ : 0,
	startReceiveTime_ : 0,
	lastReceiveTime_ : 0,
	lastPlayTime_ : 0,
	receiveSpeed_ : 0,
	m3u8LoadTime_ : 0,
	tag_:"com::relayCore::channels::meta::MetaSegement",

	init : function() {
		this.pieces_ = [];
		this.id_ = -1;
		this.startTime_ = 0;
		this.startTimeActual_ = 0;
		this.duration_ = 0;
		this.urlOffset_ = -1;
		this.index_ = 0;
		this.pieceTnCount_ = 0;
		this.piecePnCount_ = 0;
		this.size_ = 0;
		this.lastActiveTime_ = 0;
		this.completedPieceCount_ = 0;
		this.completedTime_ = 0;
		this.completedSize_ = 0;
		this.startReceiveTime_ = 0;
		this.lastReceiveTime_ = 0;
		this.lastPlayTime_ = 0;
		this.receiveSpeed_ = 0;
		this.beginOfMeta_ = false;
		this.directMode_ = false;
		this.discontinuity_ = false;
		this.p2pDisabled_ = false;
		this.timeGapChecked_ = false;
		this.advertMonitorReported_ = false;
		this.m3u8LoadTime_ = 0;
	},

	getPieceIndex_ : function(type, id) {
		for ( var n = 0; n < this.pieces_.length; n++) {
			var piece = this.pieces_[n];
			if (piece.type_ == type && piece.id_ == id) {
				return n;
			}
		}
		return -1;
	},

	checkPieceCompletion_ : function() {

		var nowTime = p2p$.com.common.Global.getMilliTime_();
		this.lastReceiveTime_ = nowTime;
		this.completedPieceCount_ = 0;
		this.completedSize_ = 0;
		for ( var n = 0; n < this.pieces_.length; n++) {
			var piece = this.pieces_[n];
			if (piece.writeTimes_ > 0) {
				this.completedPieceCount_++;
				if (piece.size_ >= 0) {
					this.completedSize_ += piece.size_;
				}
			}
		}
		if (this.completedPieceCount_ == this.pieces_.length) {
			this.completedTime_ = nowTime;
			P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::Segment({1}) download complete",this.tag_, this.id_, this.pieces_.length));
			if (this.completedSize_ <= 0) {
				this.completedSize_ = this.size_;
			}
		}
		if (this.startReceiveTime_ > 0 && nowTime > this.startReceiveTime_) {
			this.receiveSpeed_ = this.completedSize_ * 1000 / (nowTime - this.startReceiveTime_);
		}
	},

	resetPieceCompletion_ : function() {
		this.lastPlayTime_ = 0;
		this.completedTime_ = 0;
		this.completedPieceCount_ = 0;
		this.completedSize_ = 0;
		for ( var n = 0; n < this.pieces_.length; n++) {
			var piece = this.pieces_[n];
			piece.completedTime_ = 0;
			piece.writeTimes_ = 0;
			piece.playedTime_ = 0;
			piece.recvTimes_ = 0;
		}
	},

	formatPlayUrl_ : function(storageId) {
		return "/play/slices/" + this.id_ + ".ts?id=" + storageId + "&segment=" + this.id_;
	},
	getAllStatus_ : function(result) {
		result["id"] = this.id_;
		result["index"] = this.index_;
		result["duration"] = this.duration_;
		result["url"] = this.url_;
		result["pieceCount"] = this.pieces_.length;
		result["pieceTnCount"] = this.pieceTnCount_;
		result["piecePnCount"] = this.piecePnCount_;
		result["size"] = this.size_;
		result["startTime"] = this.startTime_;
		result["startTimeActual"] = this.startTimeActual_;
		result["lastActiveTime"] = this.lastActiveTime_;
		result["completedTime"] = this.completedTime_;
		result["completedPieceCount"] = this.completedPieceCount_;
		result["completedSize"] = this.completedSize_;
		result["startReceiveTime"] = this.startReceiveTime_;
		result["lastReceiveTime"] = this.lastReceiveTime_;
		result["receiveSpeed"] = this.receiveSpeed_;
		result["beginOfMeta"] = this.beginOfMeta_;
		result["discontinuity"] = this.discontinuity_;

		var pendingPieceCount = 0;
		var resultPieces = result["pieces"] = [];
		for ( var n = 0; n < this.pieces_.length; n++) {
			var piece = this.pieces_[n];
			if (piece.completedTime_ <= 0 && piece.receiveStartTime_ > 0) {
				pendingPieceCount++;
			}
			var resultPiecesStatus = resultPieces[n] = {};
			piece.getAllStatus_(resultPiecesStatus);
		}
		result["pendingPieceCount"] = pendingPieceCount;
	}
});
