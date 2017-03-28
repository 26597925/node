p2p$.ns('com.webp2p.logic.base');

p2p$.com.webp2p.logic.base.StatData = CdeBaseClass.extend_({
	totalSendPieces_ : 0,
	totalSendBytes_ : 0,
	totalReceivePieces_ : 0,
	totalReceiveBytes_ : 0,
	actualSendPieces_ : 0,
	actualSendBytes_ : 0,
	actualReceivePieces_ : 0,
	actualReceiveBytes_ : 0,
	urgentReceiveBytes_ : 0,
	lastReceiveBytes_ : 0,

	firstSendTime_ : 0,
	firstReceiveTime_ : 0,
	urgentReceiveBeginTime_ : 0,
	lastReceiveBeginTime_ : 0,

	avgSendSpeed_ : 0,
	avgReceiveSpeed_ : 0,
	urgentReceiveSpeed_ : 0,
	lastReceiveSpeed_ : 0,
	restrictedSendSpeed_ : 0,

	protocolSendPieces_ : null,
	protocolSendBytes_ : null,
	protocolSendSpeeds_ : null,
	protocolReceivePieces_ : null,
	protocolReceiveBytes_ : null,
	protocolReceiveSpeeds_ : null,

	shareSendRatio_ : 0,
	shareReceiveRatio_ : 0,
	firstPieceFetchTime_ : 0,

	totalReceiveDuration_ : 0,
	downloadedDuration_ : 0,
	totalPlayedBytes_ : 0,
	totalPlayedPieces_ : 0,
	totalPlayedDuration_ : 0,

	init : function() {
		this.totalSendPieces_ = 0;
		this.totalSendBytes_ = 0;
		this.actualSendPieces_ = 0;
		this.actualSendBytes_ = 0;
		this.totalReceivePieces_ = 0;
		this.totalReceiveBytes_ = 0;
		this.actualReceivePieces_ = 0;
		this.actualReceiveBytes_ = 0;
		this.urgentReceiveBytes_ = 0;
		this.lastReceiveBytes_ = 0;

		this.firstSendTime_ = 0;
		this.firstReceiveTime_ = 0;
		this.urgentReceiveBeginTime_ = 0;
		this.lastReceiveBeginTime_ = 0;

		this.avgSendSpeed_ = 0;
		this.avgReceiveSpeed_ = 0;
		this.urgentReceiveSpeed_ = 0;
		this.lastReceiveSpeed_ = 0;
		this.restrictedSendSpeed_ = 0;

		this.protocolSendPieces_ = [];
		this.protocolSendBytes_ = [];
		this.protocolSendSpeeds_ = [];
		this.protocolReceivePieces_ = [];
		this.protocolReceiveBytes_ = [];
		this.protocolReceiveSpeeds_ = [];
		for ( var n = 0; n < p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeMax; n++) {
			this.protocolSendPieces_[n] = 0;
			this.protocolSendBytes_[n] = 0;
			this.protocolSendSpeeds_[n] = 0;
			this.protocolReceivePieces_[n] = 0;
			this.protocolReceiveBytes_[n] = 0;
			this.protocolReceiveSpeeds_[n] = 0;
		}
		this.shareSendRatio_ = 0;
		this.shareReceiveRatio_ = 0;
		this.firstPieceFetchTime_ = 0;

		this.totalReceiveDuration_ = 0;
		this.downloadedDuration_ = 0;
		this.totalPlayedBytes_ = 0;
		this.totalPlayedPieces_ = 0;
		this.totalPlayedDuration_ = 0;
	},

	addSendData_ : function(protocolType, pieces, bytes) {
		this.addSendData2_(protocolType, bytes, pieces);
		this.statSendData_();
	},

	addSendData2_ : function(protocolType, bytes, pieces) {
		if (protocolType < 0 || protocolType >= p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeMax) {
			return;
		}

		this.totalSendPieces_ += pieces;
		this.totalSendBytes_ += bytes;
		this.actualSendPieces_ += pieces;
		this.actualSendBytes_ += bytes;
		this.protocolSendPieces_[protocolType] += pieces;
		this.protocolSendBytes_[protocolType] += bytes;
	},

	statSendData_ : function() {
		if (this.totalReceiveBytes_ > 0) {
			this.shareSendRatio_ = this.totalSendBytes_ / this.totalReceiveBytes_;
		}

		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (this.firstSendTime_ > 0 && nowTime > this.firstSendTime_) {
			var timeEclipse = nowTime - this.firstSendTime_;
			this.avgSendSpeed_ = this.actualSendPieces_ * 1000 / timeEclipse;
		} else {
			this.firstSendTime_ = nowTime;
		}
	},

	addReceiveData_ : function(urgent, protocolType, pieces, bytes) {
		this.addReceiveData2_(protocolType, bytes, pieces);
		if (urgent) {
			this.urgentReceiveBytes_ += bytes;
		}

		this.statReceiveData_(urgent);
	},

	addReceiveData2_ : function(protocolType, bytes, pieces) {
		if (protocolType < 0 || protocolType >= p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeMax) {
			return;
		}

		this.totalReceivePieces_ += pieces;
		this.totalReceiveBytes_ += bytes;
		this.actualReceivePieces_ += bytes;
		this.actualReceiveBytes_ += bytes;
		this.protocolReceivePieces_[protocolType] += pieces;
		this.protocolReceiveBytes_[protocolType] += bytes;

		this.lastReceiveBytes_ += bytes;
	},

	statReceiveData_ : function(urgent) {
		if (this.totalReceiveBytes_ > 0) {
			var p2pReceiveBytes = this.totalReceiveBytes_ - this.protocolReceiveBytes_[p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn];
			this.shareSendRatio_ = this.totalSendBytes_ / this.totalReceiveBytes_;
			this.shareReceiveRatio_ = p2pReceiveBytes / this.totalReceiveBytes_;
		}

		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (this.firstReceiveTime_ > 0 && nowTime > this.firstReceiveTime_) {
			var timeEclipse = nowTime - this.firstReceiveTime_;
			this.avgReceiveSpeed_ = this.actualReceiveBytes_ * 1000 / timeEclipse;
		} else {
			this.firstReceiveTime_ = nowTime;
		}

		if (this.lastReceiveBeginTime_ > 0 && nowTime > this.lastReceiveBeginTime_) {
			var timeEclipse = nowTime - this.lastReceiveBeginTime_;
			this.lastReceiveSpeed_ = this.lastReceiveBytes_ * 1000 / timeEclipse;
			if (timeEclipse > 5 * 1000) {
				// reset
				this.lastReceiveBeginTime_ = nowTime;
				this.lastReceiveBytes_ = 0;
			}
		} else {
			this.lastReceiveBeginTime_ = nowTime;
		}

		if (urgent) {
			if (this.urgentReceiveBeginTime_ > 0 && nowTime > this.urgentReceiveBeginTime_) {
				var timeEclipse = nowTime - this.urgentReceiveBeginTime_;
				this.urgentReceiveSpeed_ = this.urgentReceiveBytes_ * 1000 / timeEclipse;
				if (timeEclipse > 5 * 1000) {
					// reset
					this.urgentReceiveBeginTime_ = nowTime;
					this.urgentReceiveBytes_ = 0;
				}
			} else {
				this.urgentReceiveBeginTime_ = nowTime;
			}
		}
	}
});
