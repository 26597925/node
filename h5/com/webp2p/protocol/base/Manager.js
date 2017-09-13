p2p$.ns('com.webp2p.protocol.base');
p2p$.com.webp2p.protocol.base.PROTOCOL_STATES = {
	kProtocolStateReady : 0,
	kProtocolStateConnecting : 1,
	kProtocolStateConnected : 2,
	kProtocolStateDisconnecting : 3,
	kProtocolStateDisconnected : 4
};

p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES = {
	kProtocolTypeReserved : 0,
	kProtocolTypeCdn : 1,
	kProtocolTypeRtmfp : 2,
	kProtocolTypeWebSocket : 3,
	kProtocolTypeWebrtc : 4,
	kProtocolTypeMax : 5
};

p2p$.com.webp2p.protocol.base.TERMINAL_TYPES = {
	kTerminalTypeReserved : 0,
	kTerminalTypePc : 1,
	kTerminalTypeTv : 2,
	kTerminalTypeBox : 3,
	kTerminalTypeMobile : 4,
	kTerminalTypeMax : 5
};

p2p$.com.webp2p.protocol.base.ManagerStatic = {
	getTerminalType_ : function(type) {
		var typeMark = null;
		var pos = type.indexOf('/');
		if (pos == -1) {
			typeMark = type;
		} else if (pos > 0) {
			typeMark = type.substr(0, pos);
		}
		var strings_ = p2p$.com.common.String;
		var lowerTypeMark = strings_.makeLower_(typeMark);
		if (strings_.startsWith_(lowerTypeMark, "un")) {
			return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypePc;
		} else if (strings_.startsWith_(lowerTypeMark, "pc")) {
			return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypePc;
		} else if (strings_.startsWith_(lowerTypeMark, "tv")) {
			return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeTv;
		} else if (strings_.startsWith_(lowerTypeMark, "box")) {
			return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeBox;
		} else if (strings_.startsWith_(lowerTypeMark, "mp")) {
			return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile;
		} else if (strings_.startsWith_(lowerTypeMark, "iphone")) {
			return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile;
		} else if (lowerTypeMark.length > 0) {
			switch (lowerTypeMark[0]) {
			case 'C':
			case 'c': // C1,C1S
			case 'T':
			case 't': // T1, T1S
				return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeBox;
				break;

			case 'X':
			case 'x': // X50 X60
			case 'S':
			case 's': // S40, S50, S70
				return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeTv;
				break;

			default:
				return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile;
				break;
			}
		} else {
			return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeReserved;
		}
	},
};

p2p$.com.webp2p.protocol.base.Manager = JClass.extend_({
	pool_ : null,//管理池
	eventListener_ : null,
	sessions_ : null,

	type_ : 0,
	protocolState_ : 0,
	maxActiveSession_ : 0,
	beginRegisterTime_:0,
	id_ : "",
	serverId_ : "",
	serverUrl_ : "",
	global_:null,
	strings_:null,
	config_:null,
	module_:null,
	tag_:"com::webp2p::protocol::base::Manager",
	
	init : function(pool, evt, type) {
		this.pool_ = pool;
		this.eventListener_ = evt;
		this.type_ = type;
		this.protocolState_ = p2p$.com.webp2p.protocol.base.PROTOCOL_STATES.kProtocolStateReady;
		this.maxActiveSession_ = 20;
		this.sessions_ = [];
		this.global_ = p2p$.com.common.Global;
		this.strings_ = p2p$.com.common.String;
		this.config_ = p2p$.com.selector.Config;
		this.module_ = p2p$.com.selector.Module;
	},

	getId_ : function() {
		return this.id_;
	},
	getType : function() {
		return this.type_;
	},
	getTypeNames_ : function(type) {
		switch (type) {
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeReserved:
			return "reserved";
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn:
			return "cdn";
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
			return "rtmfp";
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
			return "websocket";
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
			return "webrtc";
		default:
			return "unknown";
		}
	},
	getTypeName_ : function() {
		return this.getTypeNames_(this.type_);
	},

	// boost::asio::io_service &getService(){ return service_; }
	getPool_ : function() {
		return this.pool_;
	},

	getEventListener_ : function() {
		return this.eventListener_;
	},

	setTimeout_ : function(tag, timer, milliSeconds) {
		var me = this;
		timer = setTimeout(function() {
			me.onTimeout_(tag, timer);
		}, milliSeconds);
		return timer;
	},

	onTimeout_ : function(tag, timer, errorCode) {
	},

	setMaxActiveSession_ : function(count) {
		this.maxActiveSession_ = count;
	},

	isStable_ : function() {
		return p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn == this.type_;
	},

	open : function() {
	},
	close : function() {
	}
});
