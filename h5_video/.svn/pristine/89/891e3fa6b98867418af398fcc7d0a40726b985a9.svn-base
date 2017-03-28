p2p$.ns('com.webp2p.tools.collector');

p2p$.com.webp2p.tools.collector.ClientBase = CdeBaseClass.extend_({
	init : function() {
	},

	tidy : function() {
	},

	toUrl_ : function(client, url) {
		var env = client.getEnviroment_();
		var context = client.getContext_();
		var metaData = client.getMetaData_();

		url.params_.set("p2p", env.p2pEnabled_ ? "1" : "0");
		url.params_.set("gID", metaData.p2pGroupId_);
		url.params_.set("ver", p2p$.com.webp2p.core.common.String.format("cde.{0}.{1}.{2}", p2p$.com.webp2p.core.common.Module.kCdeMajorVersion,
				p2p$.com.webp2p.core.common.Module.kCdeMinorVersion, p2p$.com.webp2p.core.common.Module.kCdeBuildNumber));
		url.params_.set("type", context.playType_);
		url.params_.set("termid", p2p$.com.webp2p.core.common.String.fromNumber(context.terminalType_));
		url.params_.set("platid", context.platformId_);
		url.params_.set("splatid", context.subPlatformId_);
		url.params_.set("vtype", context.videoType_);
		url.params_.set("vformat", context.videoFormat_);
		url.params_.set("geo", context.geo_);
		if (metaData.type_ != p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive) {
			url.params_.set("gdur", p2p$.com.webp2p.core.common.String.fromNumber(metaData.totalDuration_ / 1000));
		}
		url.params_.set("appid", env.externalAppId_);
		url.params_.set("cdeid", env.moduleId_);
		url.params_.set("package", env.externalAppPackageName_);
		url.params_.set("streamid", context.streamId_);
		url.params_.set("p-rtmfp", context.protocolRtmfpDisabled_ ? "0" : "1");
		url.params_.set("p-cde", context.protocolWebsocketDisabled_ ? "0" : "1");
		url.params_.set("p-rtc", context.protocolWebrtcDisabled_ ? "0" : "1");
		url.params_.set("r", Math.floor(Math.random() * (1000000 + 1)));
		// addtional params
		if (context.addtionalParam1_ != "") {
			url.params_.set("p1", context.addtionalParam1_);
		}
		if (context.addtionalParam2_ != "") {
			url.params_.set("p2", context.addtionalParam2_);
		}
		if (context.addtionalParam3_ != "") {
			url.params_.set("p3", context.addtionalParam3_);
		}
		if (context.appUuid_ != "") {
			url.params_.set("uuid", context.appUuid_);
		}
		if (context.t3partyAppChannel_ != "") {
			url.params_.set("ch", context.t3partyAppChannel_);
		}
	}
});