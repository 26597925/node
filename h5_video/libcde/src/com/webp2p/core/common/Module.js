p2p$.ns("com.webp2p.core.common");

p2p$.com.webp2p.core.common.Module = {
	kBuildDate : "2015-07-02",
	kBuildTime : "2015-07-02 10:54:42",
	kVenderName : "",

	// folders
	kBinName : "bin", // suffix .bin
	kConfigName : "config", // suffix .json
	kLogName : "log", // suffix .log
	kShareName : "share", // suffix .shm
	kWebName : "web", // suffix .web
	kDataName : "data", // suffix .*
	kP2pVersion : "1.3m3u8_12272000", // p2p version tag

	kCdeMajorVersion : 0,
	kCdeMinorVersion : 9,
	kCdeBuildNumber : 65,
	// kCdeFullVersion:this.kCdeMajorVersion*1000 + this.kCdeMinorVersion*100 + this.kCdeBuildNumber,

	getKp2pVersion_ : function() {
		return this.kP2pVersion;
	},

	getkCdeFullVersion_ : function() {
		return this.kCdeMajorVersion * 1000 + this.kCdeMinorVersion * 100 + this.kCdeBuildNumber;
	}
};