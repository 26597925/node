CdeBaseClass.apply(p2p$.com.webp2p.core.supernode.Context, {
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

		var url = new p2p$.com.webp2p.core.supernode.Url();
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

p2p$.com.webp2p.core.supernode.Enviroment.getAllStatus_ = function(result) {
	result["debug"] = this.debug_;
	result["p2pEnabled"] = this.p2pEnabled_;
	result["p2pUploadEnabled"] = this.p2pUploadEnabled_;
	result["rtlStreamEnabled"] = this.rtlStreamEnabled_;
	result["liveStorageMemoryOnly"] = this.liveStorageMemoryOnly_;
	result["vodStorageMemoryOnly"] = this.vodStorageMemoryOnly_;
	result["networkType"] = this.networkType_;
	result["externalAppId"] = this.externalAppId_;
	result["externalAppVersion"] = this.externalAppVersion_;
	result["externalAppChannel"] = this.externalAppChannel_;
	result["externalAppPackageName"] = this.externalAppPackageName_;
	result["moduleVersion"] = this.moduleVersion_;
	result["moduleId"] = this.moduleId_;
	result["clientGeo"] = this.clientGeo_;
	result["clientGeoName"] = this.clientGeoName_;
	result["clientIp"] = this.clientIp_;
	result["deviceType"] = this.deviceType_;
	result["osType"] = this.osType_;
	result["rootDomain"] = this.rootDomain_;
	result["globalProxyUrl"] = this.globalProxyUrl_;
	result["defaultGslbTss"] = this.defaultGslbTss_;
	result["defaultGslbM3v"] = this.defaultGslbM3v_;
	result["hlsServerPort"] = this.hlsServerPort_;
	result["livePlayOffset"] = this.livePlayOffset_;
	result["specialPlayerTimeOffset"] = this.specialPlayerTimeOffset_;
	result["specialPlayerTimeLimit"] = this.specialPlayerTimeLimit_;
	result["downloadSpeedRatio"] = this.downloadSpeedRatio_;
	result["customContextParams"] = this.customContextParams_;
	result["customMediaParams"] = this.customMediaParams_;
	// result["keyDataCacheCount"] = (json::Int)keyDataCaches_.size();

	// control params
	result["protocolCdnDisabled"] = this.protocolCdnDisabled_;
	result["protocolRtmfpDisabled"] = this.protocolRtmfpDisabled_;
	result["protocolWebsocketDisabled"] = this.protocolWebsocketDisabled_;
	result["protocolWebrtcDisabled"] = this.protocolWebrtcDisabled_;
};

CdeBaseClass.apply(p2p$.com.webp2p.core.supernode.MetaData, {
	getAllStatus_ : function(startSegmentId, maxDuration, params, result) {
		var incompleleOnly = params["incompleteOnly"];
		result["updateTime"] = this.updateTime_;
		result["segmentCount"] = this.segments_.length;
		result["directCount"] = this.directCount_;
		result["pieceCount"] = this.tn2SegmentIndexMap_.length + this.pn2SegmentIndexMap_.length;
		result["tnPieceCount"] = this.tn2SegmentIndexMap_.length;
		result["pnPieceCount"] = this.pn2SegmentIndexMap_.length;
		result["p2pGroupId"] = this.p2pGroupId_;
		result["directDuration"] = this.directDuration_;
		result["targetDuration"] = this.targetDuration_;
		result["totalGapDuration"] = this.totalGapDuration_;
		result["segmentFirstId"] = (this.segments_.length > 0) ? this.segments_[0].id_ : 0;
		result["segmentLastId"] = (this.segments_.legnth > 0) ? this.segments_[this.segments_.length - 1].id_ : 0;
		result["rangeParamsSupported"] = this.rangeParamsSupported_;
		result["verifyMethod"] = this.verifyMethod_;

		var segmentDisplayCount = 0;
		var segmentDisplayDuration = 0;
		var segmentCompletedCount = 0;
		var segmentCompletingCount = 0;
		var resultSegments = result["segments"] = [];
		for ( var n = 0, j = 0; n < this.segments_.length; n++) {
			var segment = this.segments_[n];
			if (incompleleOnly && segment.completedTime_ > 0) {
				continue;
			}
			if (startSegmentId >= 0 && segment.id_ < startSegmentId) {
				continue;
			}
			if (maxDuration > 0 && segmentDisplayDuration >= maxDuration * 1000) {
				break;
			}
			var resultSegmentsStatus = resultSegments[j++] = {};
			segment.getAllStatus_(resultSegmentsStatus);

			segmentDisplayCount++;
			segmentDisplayDuration += segment.duration_;
			if (segment.completedTime_ > 0) {
				segmentCompletedCount++;
			} else if (segment.completedPieceCount_ > 0) {
				segmentCompletingCount++;
			}
		}
		result["segmentDisplayCount"] = segmentDisplayCount;
		result["segmentDisplayDuration"] = segmentDisplayDuration;
		result["segmentCompletedCount"] = segmentCompletedCount;
		result["segmentCompletingCount"] = segmentCompletingCount;
	}
});

CdeBaseClass.apply(p2p$.com.webp2p.core.supernode.MetaSegment, {
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

CdeBaseClass.apply(p2p$.com.webp2p.core.supernode.MetaPiece, {
	getAllStatus_ : function(result) {
		result["id"] = this.id_;
		result["index"] = this.index_;
		result["type"] = this.type_;
		result["offset"] = this.offset_;
		result["size"] = this.size_;
		result["wild"] = this.wild_;
		result["checksum"] = this.checksum_;
		result["transferDepth"] = this.transferDepth_;
		result["shareInRanges"] = this.shareInRanges_;
		result["receiveProtocol"] = this.receiveProtocol_;
		result["receiveByStable"] = this.receiveByStable_;
		result["receiveStartTime"] = this.receiveStartTime_;
		result["playedTime"] = this.playedTime_;
		result["completedTime"] = this.completedTime_;
	}
});

CdeBaseClass.apply(p2p$.com.webp2p.logic.base.Channel, {
	getAllStatus_ : function(params, result) {
		var simpleMode = params.get("simple");
		var needGslbData = params.get("gslb");
		var segmentStartWithPlayer = params.get("segmentStartWithPlayer") == "1";
		var maxDuration = params.get("maxDuration");
		if (segmentStartWithPlayer && maxDuration <= 0) {
			maxDuration = 300; // default
		}

		result["id"] = this.id_;
		result["type"] = this.getTypeName_();
		result["opened"] = this.opened_;
		result["paused"] = this.paused_;
		result["groupType"] = this.groupType_;
		result["redirectMode"] = this.redirectMode_;
		result["directMetaMode"] = this.directMetaMode_;
		result["playerHistoryKey"] = this.playerHistoryKey_;
		result["icpCode"] = this.icpCode_;
		result["channelUrl"] = this.metaData_.channelUrl_;
		result["channelPlayUrl"] = p2p$.com.webp2p.core.common.String.format("/play?debug={0}&mcdn={1}&enc=base64&ext=m3u8&url={2}", this.context_.debug_ ? 1
				: 0, this.context_.cdnMultiRequest_ ? 1 : 0, p2p$.com.webp2p.core.common.String.urlEncode_(p2p$.com.webp2p.core.common.String
				.base64Encode_(this.metaData_.channelUrl_)));
		result["gslbRequestUrl"] = this.gslbRequestUrl_;
		result["gslbEncryptUrl"] = this.gslbEncryptUrl_;
		result["createTime"] = this.createTime_;
		result["openTime"] = this.openTime_;
		result["activeTime"] = this.activeTime_;
		result["urlTagTime"] = this.urlTagTime_;
		result["gslbTryTimes"] = this.gslbTryTimes_;
		result["metaTryTimes"] = this.metaTryTimes_;
		result["gslbServerResponseCode"] = this.gslbServerResponseCode_;
		result["gslbServerErrorCode"] = this.gslbServerErrorCode_;
		result["gslbServerErrorDetails"] = this.gslbServerErrorDetails_;
		result["checksumServerResponseCode"] = this.checksumServerResponseCode_;
		result["metaServerResponseCode"] = this.metaServerResponseCode_;
		result["channelOpenedTime"] = this.channelOpenedTime_;
		result["maxSleepTime"] = this.maxSleepTime_;
		result["playerFlushTime"] = this.playerFlushTime_;
		result["playerFlushInterval"] = this.playerFlushInterval_;
		result["playerFlushMaxInterval"] = this.playerFlushMaxInterval_;
		result["playerInitialPosition"] = this.playerInitialPosition_;
		result["playerSkipPosition"] = this.playerSkipPosition_;
		result["playerSkipDuration"] = this.playerSkipDuration_;
		result["playerSkipBeginSegmentId"] = this.playerSkipBeginSegmentId_;
		result["playerSkipEndSegmentId"] = this.playerSkipEndSegmentId_;
		result["playerSegmentId"] = this.playerSegmentId_;
		result["urgentSegmentId"] = this.urgentSegmentId_;
		result["urgentSegmentEndId"] = this.urgentSegmentEndId_;
		result["urgentIncompleteCount"] = this.urgentIncompleteCount_;
		result["otherPeerRequestCount"] = this.otherPeerRequestCount_;
		result["completedSegmentId"] = this.completedSegmentId_;
		result["downloadedRate"] = this.statData_.urgentReceiveSpeed_;
		// result["downloadedDuration"] = getDownloadedDuration();
		result["downloadedDuration"] = this.statData_.downloadedDuration_;
		result["mediaStartTime"] = this.mediaStartTime_;
		result["metaResponseCode"] = this.metaResponseCode_;
		result["metaResponseDetails"] = this.metaResponseDetails_;
		result["metaResponseType"] = this.metaResponseType_;
		result["peerReceiveTimeout"] = this.peerReceiveTimeout_;
		result["gslbReloadInterval"] = this.gslbReloadInterval_ * 1000;
		result["gslbLoadTime"] = this.gslbLoadTime_;
		result["gslbReloadTimes"] = this.gslbReloadTimes_;
		result["gslbConsumedTime"] = this.gslbConsumedTime_;
		result["checksumLoadTime"] = this.checksumLoadTime_;
		result["metaLoadTime"] = this.metaLoadTime_;
		result["metaReloadTimes"] = this.gslbReloadTimes_;
		result["selfRanges"] = this.selfRanges_;
		if (needGslbData) {
			result["gslbData"] = this.context_.gslbData_;
		}

		if (simpleMode) {
			return;
		}
		var contextStatus = result["context"] = {};
		this.context_.getAllStatus_(contextStatus);

		var statDataStatus = result["statData"] = {};
		this.statData_.getAllStatus_(statDataStatus);

		var metaDataStatus = result["metaData"] = {};
		this.metaData_.getAllStatus_(segmentStartWithPlayer ? this.urgentSegmentId_ : -1, maxDuration, params, metaDataStatus);

		var reportTrafficStatus = result["reportTraffic"] = {};
		this.reportTraffic_.getAllStatus_(reportTrafficStatus);

		var resultStablePeers = result["stablePeers"] = [];
		for ( var n = 0; n < this.stablePeers_.length; n++) {
			var peer = this.stablePeers_[n];
			var stablePeersStatus = resultStablePeers[n] = {};
			peer.getAllStatus_(stablePeersStatus);
		}

		var resultOtherPeers = result["otherPeers"] = [];
		for ( var n = 0; n < this.otherPeers_.length; n++) {
			var peer = this.otherPeers_[n];
			var otherPeersStatus = resultOtherPeers[n] = {};
			peer.getAllStatus_(otherPeersStatus);
		}
	}
});

CdeBaseClass.apply(p2p$.com.webp2p.logic.base.Manager, {
	getAllStatus_ : function(params, result) {
		var jsonManager = result["manager"] = {};
		jsonManager["defaultMultiMode"] = this.defaultMultiMode_;
		jsonManager["channelCapacity"] = this.channelCapacity_;
		jsonManager["downloadCapacity"] = this.downloadCapacity_;
		jsonManager["downloadParallelCount"] = this.downloadParallelCount_;
		// jsonManager["authSynced"] = authorization_.synced();
		// jsonManager["authSyncedSuccess"] = authorization_.syncedSuccess();
		// jsonManager["authServerTimeNow"] = authorization_.serverTimeNow();
		// jsonManager["authRemoteServerTime"] = authorization_.remoteServerTime();
		// jsonManager["authAbsoluteCdeTime"] = authorization_.absoluteCdeTime();
		// jsonManager["authLocalCdeTime"] = authorization_.localCdeTime();
		// jsonManager["authTimeDiff"] = authorization_.timeDiff();
		// jsonManager["playedHistoryCount"] = playedHistoryKeys_.size();

		var jsonChannels = result["channels"] = [];

		for ( var n = 0; n < this.channels_.length; n++) {
			var channel = this.channels_.element(n).value;
			var channelTemp = jsonChannels[n] = {};
			channel.getAllStatus_(params, channelTemp);
		}
		// for( logic::base::ChannelPtrList::const_iterator itr = downloads_.begin(); itr != downloads_.end(); itr ++ )
		// {
		// const logic::base::ChannelPtr &channel = (*itr);
		// channel->getAllStatus_(params, jsonChannels[jsonChannels.size()]);
		// }
	}
});

CdeBaseClass.apply(p2p$.com.webp2p.logic.base.Peer, {
	getAllStatus_ : function(result) {
		result["name"] = this.session_.getName_();
		result["type"] = this.session_.getManager_().getTypeName_();
		result["remoteId"] = this.session_.getRemoteId_();
		result["remoteAddress"] = this.session_.getRemoteAddress_();
		result["remoteType"] = this.session_.getRemoteType_();
		result["lastReceiveSpeed"] = this.lastReceiveSpeed_;
		result["lastReceiveTime"] = this.lastReceiveTime_;
		result["lastSendTime"] = this.lastSendTime_;
		result["pendingRequestCount"] = this.pendingRequestCount_;
		result["totalReceiveBytes"] = this.totalReceiveBytes_;
		result["totalReceivePieces"] = this.totalReceivePieces_;
		result["totalSendBytes"] = this.totalSendBytes_;
		result["totalSendPieces"] = this.totalSendPieces_;
		result["totalChecksumErrors"] = this.totalChecksumErrors_;
		result["totalInvalidErrors"] = this.totalInvalidErrors_;
		result["totalSendRanges"] = this.totalSendRanges_;
		result["totalSendRequests"] = this.totalSendRequests_;
		result["totalSendResponses"] = this.totalSendResponses_;
		result["totalReceiveRanges"] = this.totalReceiveRanges_;
		result["totalReceiveRequests"] = this.totalReceiveRequests_;
		result["totalReceiveResponses"] = this.totalReceiveResponses_;
		result["selfRanges"] = this.selfRanges_;
	}
});

CdeBaseClass.apply(p2p$.com.webp2p.logic.base.StatData, {
	getAllStatus_ : function(result) {
		result["totalSendPieces"] = this.totalSendPieces_;
		result["totalSendBytes"] = this.totalSendBytes_;
		result["actualSendPieces"] = this.actualSendPieces_;
		result["actualSendBytes"] = this.actualSendBytes_;
		result["totalReceivePieces"] = this.totalReceivePieces_;
		result["totalReceiveBytes"] = this.totalReceiveBytes_;
		result["actualReceivePieces"] = this.actualReceivePieces_;
		result["actualReceiveBytes"] = this.actualReceiveBytes_;
		result["urgentReceiveBytes"] = this.urgentReceiveBytes_;
		result["lastReceiveBytes"] = this.lastReceiveBytes_;

		result["shareSendRatio"] = this.shareSendRatio_;
		result["shareReceiveRatio"] = this.shareReceiveRatio_;

		result["avgSendSpeed"] = this.avgSendSpeed_;
		result["avgReceiveSpeed"] = this.avgReceiveSpeed_;
		result["urgentReceiveSpeed"] = this.urgentReceiveSpeed_;
		result["lastReceiveSpeed"] = this.lastReceiveSpeed_;
		result["restrictedSendSpeed"] = this.restrictedSendSpeed_;

		result["totalReceiveDuration"] = this.totalReceiveDuration_;
		result["downloadedDuration"] = this.downloadedDuration_;
		result["totalPlayedBytes"] = this.totalPlayedBytes_;
		result["totalPlayedPieces"] = this.totalPlayedPieces_;
		result["totalPlayedDuration"] = this.totalPlayedDuration_;

		var protocolValues = result["protocols"] = [];
		var ptypes = p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES;
		for ( var type = ptypes.kProtocolTypeReserved + 1; type < ptypes.kProtocolTypeMax; type++) {
			var protocolItem = protocolValues[type] = {};
			protocolItem["totalSendPieces"] = this.protocolReceivePieces_[type];
			protocolItem["totalSendBytes"] = this.protocolSendBytes_[type];
			protocolItem["totalReceivePieces"] = this.protocolReceivePieces_[type];
			protocolItem["totalReceiveBytes"] = this.protocolReceiveBytes_[type];
			protocolItem["shareSendRatio"] = this.protocolReceiveBytes_[type] > 0 ? (this.protocolSendBytes_[type] / this.protocolReceiveBytes_[type]) : 0;
			protocolItem["shareReceiveRatio"] = this.totalReceiveBytes_ > 0 ? (this.protocolReceiveBytes_[type] / this.totalReceiveBytes_) : 0;
		}
	}
});

CdeBaseClass.apply(p2p$.com.webp2p.tools.collector.ClientTraffic, {
	getAllStatus_ : function(result) {
		result["playing"] = this.playing_;
		result["downloadSizeFromCdn"] = this.downloadSizeFromCdn_;
		result["downloadSizeByRtmfp"] = this.downloadSizeByRtmfp_;
		result["downloadSizeByRtmfpFromPc"] = this.downloadSizeByRtmfpFromPc_;
		result["downloadSizeByRtmfpFromTv"] = this.downloadSizeByRtmfpFromTv_;
		result["downloadSizeByRtmfpFromBox"] = this.downloadSizeByRtmfpFromBox_;
		result["downloadSizeByRtmfpFromMobile"] = this.downloadSizeByRtmfpFromMobile_;
		result["downloadSizeByWebsocket"] = this.downloadSizeByWebsocket_;
		result["downloadSizeByWebsocketFromPc"] = this.downloadSizeByWebsocketFromPc_;
		result["downloadSizeByWebsocketFromTv"] = this.downloadSizeByWebsocketFromTv_;
		result["downloadSizeByWebsocketFromBox"] = this.downloadSizeByWebsocketFromBox_;
		result["downloadSizeByWebsocketFromMobile"] = this.downloadSizeByWebsocketFromMobile_;
		result["downloadSizeByWebrtc"] = this.downloadSizeByWebsocket_;
		result["downloadSizeByWebrtcFromPc"] = this.downloadSizeByWebrtcFromPc_;
		result["downloadSizeByWebrtcFromTv"] = this.downloadSizeByWebrtcFromTv_;
		result["downloadSizeByWebrtcFromBox"] = this.downloadSizeByWebrtcFromBox_;
		result["downloadSizeByWebrtcFromMobile"] = this.downloadSizeByWebrtcFromMobile_;

		result["avgRtmfpNodes"] = this.avgRtmfpNodes_;
		result["avgRtmfpSessions"] = this.avgRtmfpSessions_;
		result["avgWebSocketNodes"] = this.avgWebSocketNodes_;
		result["avgWebSocketSessions"] = this.avgWebSocketSessions_;
		result["avgWebrtcNodes"] = this.avgWebrtcNodes_;
		result["avgWebrtcSessions"] = this.avgWebrtcSessions_;

		result["totalRtmfpNodes"] = this.totalRtmfpNodes_;
		result["totalRtmfpSessions"] = this.totalRtmfpSessions_;
		result["totalWebSocketNodes"] = this.totalWebSocketNodes_;
		result["totalWebSocketSessions"] = this.totalWebSocketSessions_;
		result["totalWebrtcNodes"] = this.totalWebrtcNodes_;
		result["totalWebrtcSessions"] = this.totalWebrtcSessions_;

		result["rtmfpNodeTimes"] = this.rtmfpNodeTimes_;
		result["rtmfpSessionTimes"] = this.rtmfpSessionTimes_;
		result["webSocketNodeTimes"] = this.webSocketNodeTimes_;
		result["webSocketSessionTimes"] = this.webSocketSessionTimes_;
		result["webrtcNodeTimes"] = this.webrtcNodeTimes_;
		result["webrtcSessionTimes"] = this.webrtcSessionTimes_;

		result["uploadSizeByRtmfp"] = this.uploadSizeByRtmfp_;
		result["uploadSizeByWebsocket"] = this.uploadSizeByWebsocket_;
		result["uploadSizeByWebrtc"] = this.uploadSizeByWebrtc_;

		result["checksumSuccessCount"] = this.checksumSuccessCount_;
		result["checksumErrorsByCdn"] = this.checksumErrorsByCdn_;
		result["checksumErrorsByRtmfp"] = this.checksumErrorsByRtmfp_;
		result["checksumErrorsByWebsocket"] = this.checksumErrorsByWebsocket_;
		result["checksumErrorsByWebrtc"] = this.checksumErrorsByWebrtc_;
		result["checksumErrorsByUnknown"] = this.checksumErrorsByUnknown_;

		result["updated"] = this.updated_;
		result["nodesReset"] = this.nodesReset_;
		result["updateTime"] = this.updateTime_;
		result["lastFlushTime"] = this.lastFlushTime_;
	}
});

if (p2p$.com.webp2p.tools.collector.SupportSession) {
	p2p$.com.webp2p.tools.collector.SupportSession.getAllStatus_ = function(result) {
		result["errorCode"] = this.serverErrorCode_;
		result["serviceNumber"] = this.serviceNumber_;
		result["sessionActiveTime"] = this.sessionActiveTime_;
		result["sessionServerTime"] = this.sessionServerTime_;
		result["sessionExpireTime"] = this.sessionExpireTime_;
		result["reportInterval"] = this.reportInterval_;
		result["lastPipeLogTime"] = this.lastPipeLogTime_;
		result["lastSubmitTime"] = this.lastSubmitTime_;
		result["totalSubmitTimes"] = this.totalSubmitTimes_;
	};
}
