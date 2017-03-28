p2p$.ns('com.webp2p.protocol.base');

p2p$.com.webp2p.protocol.base.Session = CdeBaseClass.extend_({
	manager_ : null,
	name_ : "",
	remoteId_ : "",
	remoteAddress_ : "",
	remoteType_ : "",
	opened_ : false,
	active_ : false,
	terminalType_ : 0,

	init : function(mgr, remoteId) {
		this.manager_ = mgr;
		this.remoteId_ = remoteId;
		this.opened_ = false;
		this.active_ = false;
		this.terminalType_ = p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeReserved;
	},

	setTimeout_ : function(tag, timer, milliSeconds) {
		var me = this;
		me.timer_ = setTimeout(function() {
			me.onTimeout_(tag, me.timer_);
		}, milliSeconds);
	},

	// onTimeout_:function( tag, timer, errorCode ) {
	//		
	// },

	open : function() {
		this.opened_ = true;
		return true;
	},

	close : function() {
		this.opened_ = false;
		return true;
	},

	send : function(message) {
		return false;
	},

	send : function(stream) {
		return false;
	},

	control : function(ctrl) {
		return false;
	},

	getLastReceiveSpeed_ : function() {
		return -1;
	},
	getUpdateReceiveSpeed_ : function(nowTime, waiting) {
		return -1;
	},
	isActive_ : function() {
		return this.active_;
	},
	isStable_ : function() {
		return this.manager_.isStable_();
	},

	getManager_ : function() {
		return this.manager_;
	},
	getName_ : function() {
		return this.name_;
	},
	getRemoteId_ : function() {
		return this.remoteId_;
	},
	getRemoteAddress_ : function() {
		return this.remoteAddress_;
	},
	getRemoteType_ : function() {
		return this.remoteType_;
	},
	getTerminalType_ : function() {
		return this.terminalType_;
	},
	getType : function() {
		return this.manager_.getType();
	},
	getTypeName_ : function() {
		return this.manager_.getTypeName_();
	},

	setName : function(name) {
		this.name_ = name;
	},
	setRemoteAddress_ : function(address) {
		this.remoteAddress_ = address;
	},
	setRemoteType_ : function(type) {
		this.remoteType_ = type;
	},
	setTerminalType_ : function(type) {
		this.terminalType_ = type;
	},
	updateTerminalType_ : function() {
		if (this.manager_.isStable_() || p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeReserved != this.terminalType_) {
			return;
		}
		this.terminalType_ = p2p$.com.webp2p.protocol.base.ManagerStatic.getTerminalType_(this.remoteType_ == "" ? this.name_ : this.remoteType_);
	}
});