p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.NetworkType = {
	kNetworkTypeReserved : 0,
	kNetworkTypeEthernet : 1,
	kNetworkTypeMobile : 2,
	kNetworkTypeWifi : 3,
	kNetworkTypeMobile2G : 4,
	kNetworkTypeMobile3G : 5,
	kNetworkTypeMobile4G : 6,
	kNetworkTypeMobile5G : 7,
	kNetworkTypeMax : 8,
};

p2p$.com.webp2p.core.supernode.Enviroment = {

	// properties
	initialized_ : false,
	debug_ : false,
	p2pEnabled_ : false,
	p2pUploadEnabled_ : false,
	rtlStreamEnabled_ : false,
	liveStorageMemoryOnly_ : false,
	vodStorageMemoryOnly_ : false,
	networkType_ : 0,
	appId_ : 0,
	dataDirectory_ : "",
	externalAppId_ : "",
	externalAppVersion_ : "",
	externalAppChannel_ : "",
	externalAppPackageName_ : "",
	moduleVersion_ : "",
	moduleId_ : "",
	clientGeo_ : "",
	clientGeoName_ : "",
	clientIp_ : "",
	deviceType_ : "",
	osType_ : "",
	rootDomain_ : "",
	globalProxyUrl_ : "",
	defaultGslbTss_ : "",
	defaultGslbM3v_ : "",

	hlsServerPort_ : 0,
	livePlayOffset_ : 0, // seconds
	specialPlayerTimeOffset_ : 0, // seconds, default player offset
	specialPlayerTimeLimit_ : 0, // seconds, default player limit
	downloadSpeedRatio_ : 0, // download speed control rate, compare with bitrate

	// control params
	protocolCdnDisabled_ : false,
	protocolRtmfpDisabled_ : false,
	protocolWebsocketDisabled_ : false,
	protocolWebrtcDisabled_ : false,

	// custom params
	customContextParams_ : "",
	customMediaParams_ : "",
	customDomainMaps_ : null,

	paramWebrtcServer_ : "",
	paramTrackerServer_ : "",
	paramIsPlayWithlocalVideo_ : false,
	paramCloseWebrtc_ : false,
	paramCloseWebsocket_ : false,
	paramStunServer_ : "",

	initialize_ : function() {
		if (this.initialized_) {
			return;
		}

		this.initialized_ = true;
		this.customDomainMaps_ = new p2p$.com.webp2p.core.common.Map();
		this.debug_ = false;
		this.p2pEnabled_ = true;
		this.p2pUploadEnabled_ = true;
		this.rtlStreamEnabled_ = false;
		this.liveStorageMemoryOnly_ = false;
		this.vodStorageMemoryOnly_ = false;
		this.networkType_ = p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeEthernet;
		this.appId_ = 800;
		this.externalAppId_ = "800"; // H5
		this.moduleVersion_ = p2p$.com.webp2p.core.common.String.format("CDE-{0}.{1}.{2}", p2p$.com.webp2p.core.common.Module.kCdeMajorVersion,
				p2p$.com.webp2p.core.common.Module.kCdeMinorVersion, p2p$.com.webp2p.core.common.Module.kCdeBuildNumber);
		this.moduleId_ = p2p$.com.webp2p.core.common.String.format("{0}{1}{2}{3}", Math.floor(Math.random() * (1000 + 1)), Math.floor(Math.random()
				* (1000 + 1)), Math.floor(Math.random() * (1000 + 1)), p2p$.com.webp2p.core.common.Global.getMilliTime_());
		this.defaultGslbTss_ = "tvts";
		this.defaultGslbM3v_ = "1";
		this.hlsServerPort_ = 0;
		this.livePlayOffset_ = 120;
		this.specialPlayerTimeOffset_ = 0; // disabled
		this.specialPlayerTimeLimit_ = 0; // disabled
		this.downloadSpeedRatio_ = -1; // disabled
		this.customContextParams_ = "";
		this.customMediaParams_ = "";

		// control params
		this.protocolCdnDisabled_ = false;
		this.protocolRtmfpDisabled_ = false;
		this.protocolWebsocketDisabled_ = false;
		this.protocolWebrtcDisabled_ = false;

		this.deviceType_ = this.getDeviceType_();

		this.browserType_ = this.getBrowserType_();
		this.osType_ = this.getOSType_();
	},

	close : function() {
	},

	isMobileNetwork_ : function() {
		if (this.networkType_ == p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeWifi
				|| this.networkType_ == p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeEthernet) {
			return false;
		} else {
			return true;
		}

	},

	isSpecialAppId_ : function() {
	},

	setNetworkType_ : function(connectionType) {
		var networkType = 0;
		if (connectionType == "ethernet") {
			networkType = p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeEthernet;
		} else if (connectionType == "cellular" || connectionType == "mobile" || connectionType == "wimax") {
			networkType = p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeMobile;
		} else if (connectionType == "wifi") {
			networkType = p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeWifi;
		} else {
			networkType = p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeMobile;
			// networkType = p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeReserved;
		}
		this.networkType_ = networkType;
		this.p2pEnabled_ = !this.isMobileNetwork_();
	},
	setGlobalProxyUrl_ : function(url) {
	},

	setChannelParams_ : function(params) {
		if (!this.deviceType_) {
			var itr = params.get("hwtype");
			if (itr) {
				this.deviceType_ = itr;
			}
		}
		if (!this.osType_) {
			var itr = params.get("ostype");
			if (itr) {
				this.osType_ = itr;
			}
		}
	},

	attachContext_ : function(context) {

		if (context.geo_) {
			this.clientGeo_ = context.geo_;
		} else if (this.clientGeo_) {
			context.geo_ = this.clientGeo_;
		}

		if (context.geoName_) {
			this.clientGeoName_ = context.geoName_;
		} else if (this.clientGeoName_) {
			context.geoName_ = this.clientGeoName_;
		}

		if (context.clientIp_) {
			this.clientIp_ = context.clientIp_;
		} else if (this.clientIp_) {
			context.clientIp_ = this.clientIp_;
		}
	},

	getHostDomain_ : function(domain) {
		return domain;
	},

	getBackupHostIps_ : function(domain) {
		return "117.121.54.219";
	},

	getLocalMacAddresses_ : function() {
		return "FF-EE-DD-CC-BB-AA";
	},

	getBrowserType_ : function() {
		var sys = {};
		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf("eui") > -1) {
			return "eui";
		}
		var re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
		var m = ua.match(re) || [];
		sys.browser = (m[1] || "").replace(/version/, "'safari");
		sys.ver = (m[2] || "");
		return sys.browser || "unknown";
	},

	getDeviceType_ : function() {
		var sUserAgent = navigator.userAgent;
		var ua = sUserAgent.toLowerCase();
		if (ua.indexOf("x600") > -1) {
			return "Letv-x600";
		}
		if (ua.indexOf("x800") > -1) {
			return "Letv-x800";
		}
		if (ua.indexOf("x900") > -1) {
			return "Letv-x900";
		}
		if (String(navigator.platform).toLowerCase().indexOf("iphone") > -1 || ua.indexOf("iphone") > -1) {
			return "iPhone";
		}
		var split1 = ua.split(";");
		for ( var i = 0; i < split1.length; i++) {
			var pos = split1[i].indexOf("build");
			if (pos > -1) {
				var type = split1[i].substring(0, pos);
				return p2p$.com.webp2p.core.common.String.trim(type);
			}
		}
		return "Unkonwn";
	},

	getOSType_ : function() {
		var sUserAgent = navigator.userAgent;
		// alert(sUserAgent);
		// alert(navigator.platform);
		var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
		var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh")
				|| (navigator.platform == "MacIntel");
		if (isMac) {
			return "Mac";
		}
		if (String(navigator.platform).toLowerCase().indexOf("iphone") > -1 || sUserAgent.toLowerCase().indexOf("iphone") > -1) {
			return "iPhone";
		}
		if (String(navigator.platform).toLowerCase().indexOf("android") > -1 || sUserAgent.toLowerCase().indexOf("android") > -1) {
			return "Android";
		}
		var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
		if (isUnix) {
			return "Unix";
		}
		var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
		if (isLinux) {
			return "Linux";
		}

		if (isWin) {
			var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
			if (isWin2K) {
				return "Win2000";
			}
			var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
			if (isWinXP) {
				return "WinXP";
			}
			var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
			if (isWin2003) {
				return "Win2003";
			}
			var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
			if (isWinVista) {
				return "WinVista";
			}
			var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
			if (isWin7) {
				return "Win7";
			}
			return "Win";
		}
		return "other";
	},

	getMediaType_ : function() {
		var mediaType = {
			mediasource : false,
			webm : false,
			mp4 : false,
			ts : false
		};
		try {
			var TestMediaSource = window.MediaSource || window.WebKitMediaSource;
			if (!!!TestMediaSource) {
			} else {
				mediaType.mediasource = true;
				mediaType.webm = TestMediaSource.isTypeSupported('video/webm; codecs="vorbis,vp8"');
				mediaType.mp4 = TestMediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
				mediaType.ts = TestMediaSource.isTypeSupported('video/mp2t; codecs="avc1.42E01E,mp4a.40.2"');
			}
		} catch (e) {
		}
		return mediaType;
	}
};