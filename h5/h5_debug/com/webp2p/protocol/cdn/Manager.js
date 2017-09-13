p2p$.ns('com.webp2p.protocol.cdn');

p2p$.com.webp2p.protocol.cdn.Manager = p2p$.com.webp2p.protocol.base.Manager.extend_({
	kTimerTypeEncryptKey : 0,
	kTimerTypePieceTn : 1,

	opened_ : false,
	encryptTryTimes_ : 0,
	pieceTnTryTimes_ : 0,
	sn_ :-1,

	init : function(pool, evt) {
		this._super(pool, evt, p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn);
		this.tag_="com::webp2p::protocol::cdn::Manager";
		this.opened_ = false;
		this.encryptTryTimes_ = 0;
		this.pieceTnTryTimes_ = 0;
		this.sn_ = -1;
	},

	open : function() {
		this.close();
		this.opened_ = true;
		this.doOpen_();
	},

	doOpen_ : function() {
		if (!this.opened_ || !(this.sessions_.length == 0)) {
			return;
		}
		// add primary session
		var nodeIndex = 0;
		var gslbResponseData = this.pool_.getContext_().gslbData_;
		var nodeList = gslbResponseData["nodelist"];
		var item,name,locationUrl,session;
		for ( var n = 0; n < nodeList.length; n++) {
			item = nodeList[n];
			name = item["name"];
			locationUrl = item["location"];
			if (this.pool_.getContext_().cdnMultiRequest_ && this.sessions_.length < this.pool_.getContext_().cdnMultiMaxHost_) {
				session = new p2p$.com.webp2p.protocol.cdn.Session(this, locationUrl, nodeIndex++);
				session.setName(name);
				this.sessions_.push(session);
			}
		}
		//打开cdn下载
		for ( var n = 0; n < this.sessions_.length; n++) {
			var session = this.sessions_[n];
			session.open();
		}
		this.pool_.getContext_().cdnTotalNodeCount_ = this.sessions_.length;
		return true;
	},

	sleep : function(numberMillis) {
		var now = new Date();
		var exitTime = now.getTime() + numberMillis;
		while (true) {
			now = new Date();
			if (now.getTime() > exitTime) {
				return;
			}
		}
	},

	close : function() {
		this.opened_ = false;
		for ( var n = 0; n < this.sessions_.length; n++) {
			var session = this.sessions_[n];
			session.close();
		}
		this.sessions_ = [];
		return true;
	},

	checkGslbExpired_ : function() {
		var num = 0;
		for ( var n = 0; n < this.sessions_.length; n++) {
			var session = this.sessions_[n];
			if (session.gslbExpired_) {
				num++;
			}
		}
		if (num == this.sessions_.length) {
			// gslb timeout error
			this.getEventListener_().onGslbExpiredError_();
		}
	}
});
