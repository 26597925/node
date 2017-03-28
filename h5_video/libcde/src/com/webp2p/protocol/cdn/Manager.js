p2p$.ns('com.webp2p.protocol.cdn');

p2p$.com.webp2p.protocol.cdn.Manager = p2p$.com.webp2p.protocol.base.Manager.extend_({
	kTimerTypeEncryptKey : 0,
	kTimerTypePieceTn : 1,

	opened_ : false,
	encryptTryTimes_ : 0,
	pieceTnTryTimes_ : 0,
	drmPieceSegmentId_ : 0,
	drmTimer_ : null,
	// core::supernode::MetaPiece drmPieceTn_;
	// core::supernode::HttpDownloaderPtr drmDownloader_;
	drmDrypto_ : null,

	init : function(pool, evt) {
		this._super(pool, evt, p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn);
		this.opened_ = false;
		this.encryptTryTimes_ = 0;
		this.pieceTnTryTimes_ = 0;
		this.drmPieceSegmentId_ = 0;
		this.drmDrypto_ = new p2p$.com.webp2p.protocol.cdn.DrmCrypto();

	},

	open : function() {
		this.close();

		// active
		this.opened_ = true;

		// check if drm is enabled
		var metaUrl = new p2p$.com.webp2p.core.supernode.Url();
		metaUrl.fromString_(this.pool_.getMetaData_().sourceUrl_);
		var encryptName = "_s.m3u8";
		var drmEnabled = (p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive != this.pool_.getMetaData_().type_
				&& metaUrl.file_.length > encryptName.length && metaUrl.file_.substr(metaUrl.file_.length - encryptName.length) == encryptName);

		this.drmDrypto_.enabled(drmEnabled);
		this.pool_.getContext_().drmEnabled_ = drmEnabled;
		if (!drmEnabled) {
			return this.doOpen_();
		}

		// this.drmDrypto_.open();
		// this.encryptTryTimes_ = 0;
		// this.pieceTnTryTimes_ = 0;
		// downloadEnryptKey_();
	},

	doOpen_ : function() {
		if (!this.opened_ || !(this.sessions_.length == 0)) {
			// already closed or already opened
			return true;
		}
		// add primary session
		var nodeIndex = 0;
		var primarySession = null;
		var isStream = (this._superprototype.getPool_.call(this).playType_ == "stream");
		if (isStream) {
			// primarySession.reset(new RtlSession(*this, ""));
		} else {
			primarySession = new p2p$.com.webp2p.protocol.cdn.Session(this, "", nodeIndex++, this.drmDrypto_);
		}
		this.sessions_.push(primarySession);

		// mirrors
		var gslbResponseData = this.pool_.getContext_().gslbData_;
		var mirrorNodeList = gslbResponseData["nodelist"];
		for ( var n = 0; n < mirrorNodeList.length; n++) {
			var mirrorNodeItem = mirrorNodeList[n];
			var name = mirrorNodeItem["name"];
			var locationUrl = mirrorNodeItem["location"];
			if (locationUrl == "" || locationUrl == this.pool_.getMetaData_().sourceUrl_) {
				// primary url
				primarySession.setName(name);
				continue;
			}
			if (this.pool_.getContext_().cdnMultiRequest_ && this.sessions_.length < this.pool_.getContext_().cdnMultiMaxHost_) {
				var mirrorSession = null;
				if (isStream) {
					// primarySession.reset(new RtlSession(*this, ""));
				} else {
					mirrorSession = new p2p$.com.webp2p.protocol.cdn.Session(this, locationUrl, nodeIndex++, this.drmDrypto_);
				}

				mirrorSession.setName(name);
				this.sessions_.push(mirrorSession);
			}
		}

		for ( var n = 0; n < this.sessions_.length; n++) {
			// if(n > 1) break;
			var session = this.sessions_[n];
			session.open();
		}
		// P2P_ULOG_INFO("this.sessions_[1].downloader_",this.sessions_[1].downloader_);
		// P2P_ULOG_INFO("this.sessions_[2].downloader_",this.sessions_[2].downloader_);
		// P2P_ULOG_INFO(this.sessions_[1].downloader_ == this.sessions_[2].downloader_);
		this.pool_.getContext_().cdnTotalNodeCount_ = this.sessions_.length;

		// P2P_ULOG_INFO("protocol::cdn::Manager Intialize total "+this.sessions_.length+" session(s)");

		// this.sleep(2000);
		// P2P_ULOG_INFO("this.sessions_[1].downloader_",this.sessions_[1].downloader_);
		// P2P_ULOG_INFO("this.sessions_[2].downloader_",this.sessions_[2].downloader_);
		// P2P_ULOG_INFO(this.sessions_[1].downloader_ == this.sessions_[2].downloader_);
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
		// deactive
		this.opened_ = false;

		// boost::system::error_code errorCode;
		// drmTimer_.cancel(errorCode);
		if (this.drmDownloader_ != null) {
			this.drmDownloader_.close();
			// drmDownloader_.reset();
		}

		for ( var n = 0; n < this.sessions_.length; n++) {
			var session = this.sessions_[n];
			session.close();
		}
		this.sessions_ = [];
		// this.drmDrypto_.close();
		return true;
	},

	downloadEnryptKey_ : function() {
	},

	downloadPieceTn_ : function() {
	},

	onEncryptKeyTimeout_ : function(errorCode) {
	},

	onPieceTnTimeout_ : function(errorCode) {
	},

	// override protocol::base::Manager
	onTimeout_ : function(tag, timer, errorCode) {
	},

	// override core::supernode::HttpDownloaderListener
	onHttpDownloadCompleted_ : function(downloader) {
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