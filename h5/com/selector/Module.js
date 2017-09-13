p2p$.ns("com.selector");
p2p$.com.selector.Module = {
	kBuildDate : "2017-03-31",
	kBuildTime : "2017-03-31 11:10:00",
	kVenderName : "",
	kBinName : "bin", // suffix .bin
	kConfigName : "config", // suffix .json
	kLogName : "log", // suffix .log
	kShareName : "share", // suffix .shm
	kWebName : "web", // suffix .web
	kDataName : "data", // suffix .*
	kP2pVersion : "1.3m3u8_12272000", // p2p version tag

	kH5MajorVersion : 0,
	kH5MinorVersion : 9,
	kH5BuildNumber : 65,
	domains:"http://js.letvcdn.com/",
	kernel:["js/lib.mp4.min.js","js/lib.ts.min.js","js/lib.js"],//,["lc05_iscms/201706/06/17/03/lib.mp4.min.js","lc07_iscms/201706/06/17/03/lib.ts.min.js","lc07_iscms/201706/06/17/03/lib.js"],//内核列表
	other:["js/tools.js"],//["lc05_iscms/201706/06/17/03/tools.js"],//其他模块

	getKp2pVersion_ : function() {
		return this.kP2pVersion;
	},

	getkH5FullVersion_ : function() {
		return this.kH5MajorVersion * 1000 + this.kH5MinorVersion * 100 + this.kH5BuildNumber;
	}
};
