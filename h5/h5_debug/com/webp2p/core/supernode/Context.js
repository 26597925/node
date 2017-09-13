p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.Context = JClass.extend_({
	url_ : null,
	gslbData_ : null,
	configData_ : null,
	strings_:null,

	// properties
	debug_ : false,
	drmEnabled_ : false,
	streamId_ : "",
	moduleVersion_ : "",
	deviceType_ : "",
	sosType_ : "",
	playType_ : "",
	platformId_ : "",
	subPlatformId_ : "",
	videoType_ : "",
	videoFormat_ : "",
	appUuid_ : "",
	uid_ :"",
    cid_ :"",
	vid_ :"",
	pid_ :"",
    custid_:"",
	lc_ :"",
	token_ : "",
	pay_ : "",
	termId_ : "",
	t3partyAppChannel_ : "",
	addtionalParam1_ : "",
	addtionalParam2_ : "",
	addtionalParam3_ : "",
	addtionalParams_ : 0,
	terminalType_ : 0,
	statReportInterval_ : 0, // seconds
	specialPlayerTimeOffset_ : 0, // seconds offset for special hardware players such as S50, S40
	specialPlayerTimeLimit_ : 0, // seconds limit for speical hardware player such as S240F, S250F
	liveStorageMemoryOnly_ : false,
	vodStorageMemoryOnly_ : 0,

	// geo
	isp_ : 0,
	country_ : 0,
	province_ : 0,
	city_ : 0,
	area_ : 0,
	countryCode_ : "",
	geo_ : "",
	geoName_ : "",
	clientIp_ : "",
	gslbServerIp_ : "",
	metaServerIp_ : "",

	// cdn/p2p params
	p2pServerVersion_ : 0,// p2p server protocol version, 1:1.0, 2: 2.0
	p2pFetchRate_ : null, // percent, 0~1
	p2pMaxPeers_ : 0, // count
	p2pUrgentSize_ : 0, // second(s)
	p2pUrgentLevel1_ : 0, // urgent size if playLevel == 1
	p2pSharePeers_ : false, // enable share p2p peers to others
	p2pUploadEnabled_ : false, // enable p2p upload
	p2pUploadLimit_ : false, // limit p2p upload speed
	p2pUploadThrottleInit_ : 0, // initial upload bandwidth for p2p upload throttle (byte/s)
	p2pUploadThrottleAverage_ : 0, // estimated average upload bandwidth for p2p upload throttle (byte/s)
	p2pUploadMaxReserved_ : 0, // max reserved upload bandwidth (byte/s)
	p2pUrgentUploadEnabled_ : false, // to upload if download enter urgent area
	p2pPeerId_ : "",// primary p2p peer id
	p2pRtmfpPeerId_ : "",// fro rtmfp
	p2pWebsocketPeerId_ : "", // for websocket
	p2pWebrtcPeerId_ : "", // for webrtc
	p2pMaxQPeers_ : 0, //
	p2pHeartbeatInterval_ : 0, // interval to gather,tracker (seconds)
	p2pShareRangeInterval_ : 0, // send range interval (seconds)
	p2pMaxParallelRequestPieces_ : 0, // max parallel request pieces for p2p peers
	p2pMaxUrgentRequestPieces_ : 0, // max parallel request pieces for p2p peers when urgent not fullfill
	cdnSlowThresholdRate_ : 0, // to decide whether cdn speed is too slow compare with media bitrate
	cdnDisabled_ : false, // disable download data from cdn
	cdnMultiRequest_ : false, // request from multi-cdn servers
	cdnMultiMaxHost_ : 0, // request maximum cdn servers
	cdnStartTime_ : 0, // for advertisment, second(s)
	playingPosition_ : 0, // the position now player used
	downloadSpeedRatio_ : 0, // download speed control rate, compare with bitrate

	// protocols
	protocolCdnDisabled_ : false,
	protocolRtmfpDisabled_ : false,
	protocolWebsocketDisabled_ : false,
	protocolWebrtcDisabled_ : false,

	// protocol status
	selectorServerHost_ : "",
	gatherServerHost_ : "",
	rtmfpServerHost_ : "",
	trackerServerHost_ : "",
	webrtcServerHost_ : "",
	stunServerHost_ : "",

	selectorConnectedTime_ : 0, // units: us
	rtmfpServerConnectedTime_ : 0, // units: us
	gatherServerConnectedTime_ : 0, // units: us
	trackerServerConnectedTime_ : 0, // units: us, cde tracker
	webrtcServerConnectedTime_ : 0,

	cdnTotalNodeCount_ : 0,
	rtmfpTotalNodeCount_ : 0,
	websocketTotalNodeCount_ : 0,
	webrtcTotalNodeCount_ : 0,

	upnpMapCompleteTime_ : 0,
	upnpMapSuccess_ : false,
	upnpMappedInPort_ : 0,
	upnpMappedOutPort_ : 0,
	upnpMappedAddress_ : "",

	hasDefaultTrackerServer_ : false,
	hasDefaultWebrtcServer_ : false,
	hasDefaultStunServer_ : false,
	init : function() {
		this.url_ = new p2p$.com.common.Url();
		this.strings_ = p2p$.com.common.String;
		this.debug_ = false;
		this.drmEnabled_ = false;
		this.terminalType_ = 1;
		this.statReportInterval_ = 60;
		this.specialPlayerTimeOffset_ = 0; // default disabled
		this.specialPlayerTimeLimit_ = 0; // default disabled
		this.liveStorageMemoryOnly_ = false;
		this.vodStorageMemoryOnly_ = false;
		this.videoFormat_ = "lm3u8";

		// geo
		this.isp_ = 0;
		this.country_ = 0;
		this.province_ = 0;
		this.city_ = 0;
		this.area_ = 0;

		// cdn/p2p params
		this.p2pServerVersion_ = 1; // 1.0
		this.p2pFetchRate_ = 0.1;
		this.p2pMaxPeers_ = 10;
		this.p2pUrgentSize_ = 10;
		this.p2pUrgentLevel1_ = 10;
		this.p2pSharePeers_ = true;
		this.p2pUploadEnabled_ = true;
		this.p2pUrgentUploadEnabled_ = false;
		this.p2pUploadLimit_ = false;
		this.p2pUploadThrottleInit_ = 50000; // 50kB/s
		this.p2pUploadThrottleAverage_ = 120000; // 100kB/s
		this.p2pUploadMaxReserved_ = 30000; // 30kB/s
		this.p2pMaxQPeers_ = 5;
		this.p2pHeartbeatInterval_ = 30; // second(s)
		this.p2pShareRangeInterval_ = 5; // second(s)
		this.p2pMaxParallelRequestPieces_ = 20;
		this.p2pMaxUrgentRequestPieces_ = 1;
		this.cdnSlowThresholdRate_ = 1.0;
		this.cdnDisabled_ = false;
		this.cdnMultiRequest_ = true; // false;
		this.cdnMultiMaxHost_ = 3;
		this.cdnStartTime_ = 0;
		this.playingPosition_ = 0;
		this.downloadSpeedRatio_ = -1.0;

		// protocol params
		this.protocolCdnDisabled_ = false;
		this.protocolRtmfpDisabled_ = false;
		this.protocolWebsocketDisabled_ = false;
		this.protocolWebrtcDisabled_ = false;

		// status
		// selectorServerPort_ = 0;
		// gatherServerPort_ = 0;
		// rtmfpServerPort_ = 0;
		// trackerServerPort_ = 0;
		this.selectorConnectedTime_ = 0;
		this.rtmfpServerConnectedTime_ = 0;
		this.gatherServerConnectedTime_ = 0;
		this.trackerServerConnectedTime_ = 0;
		this.webrtcServerConnectedTime_ = 0;

		this.cdnTotalNodeCount_ = 0;
		this.rtmfpTotalNodeCount_ = 0;
		this.websocketTotalNodeCount_ = 0;
		this.webrtcTotalNodeCount_ = 0;

		this.upnpMapCompleteTime_ = 0;
		this.upnpMapSuccess_ = false;
		this.upnpMappedInPort_ = 0;
		this.upnpMappedOutPort_ = 0;

		this.hasDefaultTrackerServer_ = false;
		this.hasDefaultWebrtcServer_ = false;
		this.hasDefaultStunServer_ = false;
	},
	initialize_ : function(url, env) {
		// properties
		this.url_ = url;
		this.moduleVersion_ = this.strings_.format("H5-{0}.{1}.{2}", p2p$.com.selector.Module.kH5MajorVersion,
				p2p$.com.selector.Module.kH5MinorVersion, p2p$.com.selector.Module.kH5BuildNumber);
		this.deviceType_ = this.strings_.toUpper_(this.url_.params_.get("hwtype"));
		this.osType_ = this.url_.params_.get("ostype");
		this.terminalType_ = this.strings_.parseNumber_(this.url_.params_.get("termid"), 1);
		this.platformId_ = this.url_.params_.get("platid");
		this.subPlatformId_ = this.url_.params_.get("splatid");
		this.videoType_ = this.url_.params_.get("vtype");
		this.streamId_ = this.url_.params_.has("stream_id") ? this.url_.params_.get("stream_id") : "";
		this.appUuid_ = this.url_.params_.has("uuid") ? this.url_.params_.get("uuid") : "";
		this.t3partyAppChannel_ = this.url_.params_.has("ch") ? this.url_.params_.get("ch") : "";
		this.token_ = this.url_.params_.has("token") ? this.url_.params_.get("token") : "";
        this.pay_ = this.url_.params_.has("payff") ? this.url_.params_.get("payff") : "";
        this.termId_ = this.url_.params_.has("termid") ? this.url_.params_.get("termid") : "";
        this.cid_ = this.url_.params_.has("cid") ? this.url_.params_.get("cid") : "";
        this.vid_ = this.url_.params_.has("vid") ? this.url_.params_.get("vid") : "";
        this.pid_ = this.url_.params_.has("pid") ? this.url_.params_.get("pid") : "";
        this.uid_ = this.url_.params_.has("uid") ? this.url_.params_.get("uid") : "";
        this.custid_ = this.url_.params_.has("custid") ? this.url_.params_.get("custid") : "";
        this.lc_ = this.url_.params_.has("lc") ? this.url_.params_.get("lc") : "";

		this.liveStorageMemoryOnly_ = env.liveStorageMemoryOnly_;
		this.vodStorageMemoryOnly_ = env.vodStorageMemoryOnly_;

		if (this.deviceType_ == "" || !env.deviceType_ == "") {
			this.deviceType_ = env.deviceType_;
		}
		if (this.osType_ == "" || !env.osType_ == "") {
			this.osType_ = env.osType_;
		}
		if (env.specialPlayerTimeOffset_ != 0) {
			this.specialPlayerTimeOffset_ = env.specialPlayerTimeOffset_;
		}
		if (env.specialPlayerTimeLimit_ != 0) {
			this.specialPlayerTimeLimit_ = env.specialPlayerTimeLimit_;
		}
		if (env.downloadSpeedRatio_ > 0) {
			this.downloadSpeedRatio_ = env.downloadSpeedRatio_;
		}

		if (env.paramWebrtcServer_) {
			this.hasDefaultWebrtcServer_ = true;
			this.webrtcServerHost_ = "ws://" + env.paramWebrtcServer_;
		}
		if (env.paramTrackerServer_) {
			this.hasDefaultTrackerServer_ = true;
			this.gatherServerHost_ = env.paramTrackerServer_;
		}
		if (env.paramStunServer_) {
			this.hasDefaultStunServer_ = true;
			this.stunServerHost_ = "stun:" + env.paramStunServer_;
		}
		if (env.paramCloseWebrtc_) {
			this.protocolWebrtcDisabled_ = env.paramCloseWebrtc_;
		}
		if (env.paramCloseWebsocket_) {
			this.protocolWebsocketDisabled_ = env.paramCloseWebsocket_;
		}

		// addtional params
		this.addtionalParams_ == "";
		this.addtionalParam1_ = this.url_.params_.has("p1") ? this.url_.params_.get("p1") : "";
		this.addtionalParam2_ = this.url_.params_.has("p2") ? this.url_.params_.get("p2") : "";
		this.addtionalParam3_ = this.url_.params_.has("p3") ? this.url_.params_.get("p3") : "";
		if (this.addtionalParam1_ != "" || this.addtionalParam2_ != "" || this.addtionalParam3_ != "") {
			this.addtionalParams_ = this.strings_.format("p1={0}&p2={1}&p3={2}", this.addtionalParam1_, this.addtionalParam2_,
					this.addtionalParam3_);
		}
	},

	loadParams_ : function(params, customParams) {
		if (customParams.hasOwnProperty("cdnMultiRequest")) {
			this.cdnMultiRequest_ = customParams["cdnMultiRequest"];
		}

		if (params.hasOwnProperty("debug")) {
			this.debug_ = params["debug"];
		}
		if (params.hasOwnProperty("mcdn")) {
			this.cdnMultiRequest_ = params["mcdn"];
		}
		if (params.hasOwnProperty("ccdn")) {
			this.cdnMultiMaxHost_ = params["ccdn"];
		}
		if (params.hasOwnProperty("dsratio")) {
			this.downloadSpeedRatio_ = params["dsratio"];
		}
	},

	loadData_ : function(data) {
		this.gslbData_ = data;
		this.geo_ = data["geo"];
		this.geoName_ = data["desc"];
		this.clientIp_ = data["remote"];
		var geoValues = this.geo_.split(".");
		if (geoValues.length > 0) {
			this.countryCode_ = this.strings_.trim(geoValues[0]);
			this.country_ = 0;
			for ( var n = 0; n < this.countryCode_.length && n < 2; n++) {
				this.country_ = this.country_ * 256 + (this.countryCode_[n]).charCodeAt();
			}
		}
		if (geoValues.length > 1) {
			this.province_ = this.strings_.parseNumber_(geoValues[1]);
		}
		if (geoValues.length > 2) {
			this.city_ = this.strings_.parseNumber_(geoValues[2]);
		}
		if (geoValues.length > 3) {
			this.isp_ = this.strings_.parseNumber_(geoValues[3]);
		}
	},

	detectSpecialPlayerTimeOffset_ : function() {
	},

	resetPeerState_ : function() {
	},
	getAllStatus_ : function(result) {
		result["drmEnabled"] = this.drmEnabled_;
		result["geo"] = this.geo_;
		result["geoName"] = this.geoName_;
		result["clientIp"] = this.clientIp_;
		result["gslbServerIp"] = this.gslbServerIp_;
		result["metaServerIp"] = this.metaServerIp_;
		result["deviceType"] = this.deviceType_;
		result["osType"] = this.osType_;
		result["statReportInterval"] = this.statReportInterval_;
		result["specialPlayerTimeOffset"] = this.specialPlayerTimeOffset_;
		result["specialPlayerTimeLimit"] = this.specialPlayerTimeLimit_;
		result["liveStorageMemoryOnly"] = this.liveStorageMemoryOnly_;
		result["vodStorageMemoryOnly"] = this.vodStorageMemoryOnly_;
		result["downloadSpeedRatio"] = this.downloadSpeedRatio_;

		result["p2pPeerId"] = this.p2pPeerId_;
		result["p2pRtmfpPeerId"] = this.p2pRtmfpPeerId_;
		result["p2pWebsocketPeerId"] = this.p2pWebsocketPeerId_;
		result["p2pWebrtcPeerId"] = this.p2pWebrtcPeerId_;
		result["p2pFetchRate"] = this.p2pFetchRate_;
		result["p2pMaxPeers"] = this.p2pMaxPeers_;
		result["p2pUrgentSize"] = this.p2pUrgentSize_;
		result["p2pUploadEnabled"] = this.p2pUploadEnabled_;
		result["p2pUploadLimit"] = this.p2pUploadLimit_;
		result["p2pUploadThrottleInit"] = this.p2pUploadThrottleInit_;
		result["p2pUploadThrottleAverage"] = this.p2pUploadThrottleAverage_;
		result["p2pUploadMaxReserved"] = this.p2pUploadMaxReserved_;
		result["p2pUrgentUploadEnabled"] = this.p2pUrgentUploadEnabled_;
		result["p2pShareRangeInterval"] = this.p2pShareRangeInterval_;
		result["p2pMaxParallelRequestPieces"] = this.p2pMaxParallelRequestPieces_;
		result["p2pMaxUrgentRequestPieces"] = this.p2pMaxUrgentRequestPieces_;

		result["cdnSlowThresholdRate"] = this.cdnSlowThresholdRate_;
		result["cdnDisabled"] = this.cdnDisabled_;
		result["cdnMultiRequest"] = this.cdnMultiRequest_;
		result["cdnMultiMaxHost"] = this.cdnMultiMaxHost_;
		result["cdnStartTime"] = this.cdnStartTime_;
		result["playingPosition"] = this.playingPosition_;

		result["selectorServerHost"] = this.selectorServerHost_;
		result["gatherServerHost"] = this.gatherServerHost_;
		result["rtmfpServerHost"] = this.rtmfpServerHost_;
		result["trackerServerHost"] = this.trackerServerHost_;

		var url = new p2p$.com.common.Url();
		url.fromString_(this.webrtcServerHost_);
		result["webrtcServerHost"] = url.host_ + ":" + url.port_;

		result["protocolCdnDisabled"] = this.protocolCdnDisabled_;
		result["protocolRtmfpDisabled"] = this.protocolRtmfpDisabled_;
		result["protocolWebsocketDisabled"] = this.protocolWebsocketDisabled_;
		result["protocolWebrtcDisabled"] = this.protocolWebrtcDisabled_;

		result["selectorConnectedTime"] = this.selectorConnectedTime_;
		result["rtmfpServerConnectedTime"] = this.rtmfpServerConnectedTime_;
		result["webrtcServerConnectedTime"] = this.webrtcServerConnectedTime_;
		result["gatherServerConnectedTime"] = this.gatherServerConnectedTime_;
		result["trackerServerConnectedTime"] = this.trackerServerConnectedTime_;

		result["cdnTotalNodeCount"] = this.cdnTotalNodeCount_;
		result["rtmfpTotalNodeCount"] = this.rtmfpTotalNodeCount_;
		result["webrtcTotalNodeCount"] = this.webrtcTotalNodeCount_;
		result["websocketTotalNodeCount"] = this.websocketTotalNodeCount_;

		result["upnpMapCompleteTime"] = this.upnpMapCompleteTime_;
		result["upnpMapSuccess"] = this.upnpMapSuccess_;
		result["upnpMappedInPort"] = this.upnpMappedInPort_;
		result["upnpMappedOutPort"] = this.upnpMappedOutPort_;
		result["upnpMappedAddress"] = this.upnpMappedAddress_;
	}
});
