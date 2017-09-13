p2p$.ns("com.webp2p.core.common");

p2p$.com.webp2p.core.common.META_DATA_TYPE = {
	kMetaDataTypeVod : 0,
	kMetaDataTypeLive : 1,
	kMetaDataTypeDownload : 2,
	kMetaDataTypeRtlStream : 3
};

p2p$.com.webp2p.core.common.META_PIECE_TYPE = {
	kMetaPieceTypeTn : 0,
	kMetaPieceTypePn : 1
};

p2p$.com.webp2p.core.common.ERROR_CODE = {
	kErrorSuccess : 0,
	kErrorAccessDenied : 1,
	kErrorInvalidParameters : 2,
	kErrorInternalError : 3,
	kErrorDestUnreachable : 4,
	kErrorServiceBusy : 5,
	kErrorNetworkUnreachable : 6,
	kErrorAlreadyExists : 7,
	kErrorNoSuchGroup : 8,
	kErrorNoSuchGroupItem : 9,
	kErrorNoSuchSession : 10,
	kErrorNoSuchItem : 11,
	kErrorNetworkFailed : 12,
	kErrorTimeout : 13,
	kErrorNotReady : 14,
	kErrorStreamIdIsEmpty : 15,
	kErrorCanceled : 16,
	kErrorAuthFailed : 17,
	kErrorNoPrivileges : 18,
	kErrorAlreadyLogin : 19,
	kErrorServiceOffline : 20,
	kErrorNotSupported : 21,
	kErrorPasswordExpired : 22,
	kErrorCodeMax : 23,
};

p2p$.com.webp2p.core.common.SERVER_TYPES = {
	kServerTypeReserved : 0,
	kServerTypeControl : 1,
	kServerTypeStorage : 2,
	kServerTypeRtmfp : 4,
	kServerTypeWebRTC : 8,
	kServerTypeHttpTracker : 16,
	kServerTypeReserved5 : 32,
	kServerTypeStunServer : 64,
	kServerTypeSelector : 128,
};

p2p$.com.webp2p.core.common.Enum = {
	getMetaTypeName_ : function(type) {
		switch (type) {
		case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod:
			return "vod";
		case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive:
			return "live";
		case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeDownload:
			return "download";
		case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeRtlStream:
			return "stream";
		default:
			return "unknown";
		}
	},

	getPieceTypeName_ : function(type) {
		switch (type) {
		case p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn:
			return "tn";
		case p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn:
			return "pn";
		default:
			return "unknown";
		}
	}
};
