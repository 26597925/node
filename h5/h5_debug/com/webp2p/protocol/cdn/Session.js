p2p$.ns('com.webp2p.protocol.cdn');

p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE = {
	kTimerTypeOpen : 0,
	kTimerTypeMeta : 1,
	kTimerTypeRangeDownload : 2
};

p2p$.com.webp2p.protocol.cdn.Session = p2p$.com.webp2p.protocol.base.Session.extend_({
	metaUrl_ : null,
	firstSegmentUrl_ : null,
	metaData_ : null,
	downloader_ : null,
	downloadingRange_ : null,
	pendingRanges_ : null,

	primary_ : false,
	metaTryTimes_ : 0,
	activeTime_ : 0,
	maxRangeDownloadTime_ : 0,
	lastReceiveSpeed_ : 0,
	lastStartReceiveTime_ : 0,
	lastTotalReceiveBytes_ : 0,

	init : function(mgr, remoteId, nodeIndex) {
		this._super(mgr, remoteId);
		this.tag_="com::webp2p::protocol::cdn::Session";
		this.nodeIndex_ = nodeIndex;
		this.activeTime_ = 0;
		this.metaTryTimes_ = 0;
		this.maxRangeDownloadTime_ = 30 * 1000; // ms
		this.lastReceiveSpeed_ = 0;
		this.lastStartReceiveTime_ = 0;
		this.lastTotalReceiveBytes_ = 0;
		this.metaData_ = new p2p$.com.webp2p.core.supernode.MetaData();
		var mainMeta = this.manager_.getPool_().getMetaData_();
		this.metaUrl_ = new p2p$.com.common.Url();
		this.firstSegmentUrl_ = new p2p$.com.common.Url();
		this.pendingRanges_ = new p2p$.com.common.Map();
		if(mainMeta.finalUrl_==remoteId)
		{
            // primary session
            this.primary_ = true;
            this.metaData_ = mainMeta;
            this.lastReceiveSpeed_ = this.metaData_.lastReceiveSpeed_;
            if (this.metaData_.segments_.length > 0) {
                this.firstSegmentUrl_.fromString_(this.metaData_.segments_[0].mediaUrl_);
            }
		}else {
			this.primary_ = false;
			this.metaData_.verifyMethod_ = mainMeta.verifyMethod_;
			this.metaData_.rangeParamsSupported_ = mainMeta.rangeParamsSupported_;
			this.metaData_.sourceUrl_ = this.remoteId_;
		}
		this.metaUrl_.fromString_(this.metaData_.sourceUrl_);
		this.remoteAddress_ = (this.primary_ ? "*" : "") + (this.metaUrl_.host_ + ":") + ((this.metaUrl_.port_ == 0) ? 80 : this.metaUrl_.port_);
		this.metaData_.sourceServer_ = this.metaUrl_.host_ + ":" + ((this.metaUrl_.port_ == 0) ? 80 : this.metaUrl_.port_);
		this.downloadingRange_ = new p2p$.com.webp2p.protocol.cdn.RequestRange();
	},

    open : function() {
        if (this.active_) {
            return true;
        }
        this._super();
        if (this.metaData_.finalUrl_ != "") {
            this.active_ = true;
            // rank first
            if (this.lastReceiveSpeed_ <= 0) {
                this.lastReceiveSpeed_ = 200000;
            }
            this.lastReceiveSpeed_ = this.metaData_.lastReceiveSpeed_;
            this.manager_.getEventListener_().onProtocolSessionOpen_(this);
        } else {
            // delay open to avoid network congestion
            this.metaTryTimes_ = -1;
            this.setTimeout_(p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeMeta, this.timer_, 5 * 1000);
        }
        return true;
    },

	cleanAllPending_ : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}]Clean all pending requests, session({2})",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), this.remoteAddress_));

		// stop timer
		if (this.timer_ != null) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		if (this.downloader_ != null) {
			this.downloader_.log_("clean");
			this.downloader_.close();
			this.downloader_ = null;
		}
		this.pendingRanges_.clear();
		this.downloadingRange_.downloading_ = false;
	},

	downloadMeta_ : function() {
		this.activeTime_ = this.global_.getMilliTime_();
		if (this.downloader_ != null) {
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::downloadMeta_ name({1})",this.tag_,this.name_));
		this.downloader_ = new p2p$.com.loaders.HttpDownLoader({url_:this.metaData_.sourceUrl_, scope_:this, tag_:"cdn::meta"});
		this.downloader_.load_();
		// set meta timer
		this.setTimeout_(p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeMeta, this.timer_, 10 * 1000);
	},

	downloadNextRange_ : function(retry) {
		if (this.downloader_ != null) {
			return;
		}
		if (!retry) {
			if (this.pendingRanges_.empty()) {
				// completed
				return;
			}
			var forkRange = new p2p$.com.webp2p.protocol.cdn.RequestRange();
			this.downloadingRange_ = this.pendingRanges_.element(0).value;
			this.downloadingRange_.preparePieces_(forkRange);
			if (forkRange.pieces_.length == 0) {
				this.pendingRanges_.clear();
			}
		}

		var requestUrl = this.downloadingRange_.url_;
		this.downloadingRange_.downloading_ = true;
		this.downloadingRange_.dataUsed_ = 0;
		this.downloadingRange_.pieceUsed_ = 0;
		if (this.downloadingRange_.length_ > 0) {
			var offsetBegin = Math.max(this.downloadingRange_.urlOffset_, 0) + this.downloadingRange_.offset_;
			var offsetEnd = offsetBegin + this.downloadingRange_.length_ - 1;
			if (this.manager_.getPool_().getMetaData_().rangeParamsSupported_) {
				if (requestUrl.indexOf('?') == -1) {
					requestUrl += "?";
				} else {
					requestUrl += "&";
				}
				requestUrl += this.strings_.format("rstart={0}&rend={1}", offsetBegin, offsetEnd);
			}
			else {
				this.requestRange_ = this.strings_.format("bytes={0}-{1}", offsetBegin, offsetEnd);
			}
		}

		// addtional appid
		if (requestUrl.indexOf("&appid=") == -1 && requestUrl.indexOf("?appid=") == -1) {
			var externalAppId = this.strings_.urlEncode_(this.manager_.getPool_().getEnviroment_().externalAppId_);
			var moduleVersion = this.strings_.fromNumber(p2p$.com.selector.Module.getkH5FullVersion_());
			if (requestUrl.indexOf('?') == -1) {
				requestUrl += "?";
			} else {
				requestUrl += "&";
			}
			requestUrl += this.strings_.format("appid={0}&cde={1}", externalAppId, moduleVersion);
		}
		//
		// // p1,p2,p3 parameters, cdn server may take those parameters
		if (this.manager_.getPool_().getContext_().addtionalParams_ != "" && requestUrl.indexOf("&p1=") == -1 && requestUrl.indexOf("?p1=") == -1) {
			if (requestUrl.indexOf('?') == -1) {
				requestUrl += "?";
			} else {
				requestUrl += "&";
			}
			requestUrl += this.manager_.getPool_().getContext_().addtionalParams_;
		}

		requestUrl += this.strings_.format("&ajax={0}", 1);
		//
		this.lastTotalReceiveBytes_ = 0;
		this.lastStartReceiveTime_ = this.global_.getMilliTime_();
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::downloadNextrange_ url({1})",this.tag_,requestUrl));
        this.manager_.sn_++;
		var params={};
		params["err"]=0;
        params["sn"]=this.manager_.sn_;
		this.manager_.eventListener_.sendStatus_({type:"VIDEO.TS.LOADING",params:params});
		this.downloader_ = new p2p$.com.loaders.HttpDownLoader({url_:requestUrl, scope_:this,type_:"arraybuffer", tag_:"cdn::range-data"});
		this.downloader_.setInfo_(this.downloadingRange_);
		if (this.requestRange_) {
			this.downloader_.setRequsetRange_(this.requestRange_);
		}
		this.downloader_.load_();
		this.setTimeout_(p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeRangeDownload, this.timer_, this.maxRangeDownloadTime_);
	},

	parseMetaResponse_ : function(downloader) {
		if (!this.metaData_.load(downloader.responseData_, downloader.totalUsedTime_)) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}[{1}]Parse meta response failed,url({2}),channel({3}),size({4})",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_),this.metaData_.sourceUrl_, this.manager_.getPool_().getMetaData_().storageId_,downloader.responseData_.length)); 
			return false;
		}
		return true;
	},

	onOpenTimeout_ : function(errorCode) {
		this.manager_.getEventListener_().onProtocolSessionOpen_(this);
	},

	onMetaTimeout_ : function(errorCode) {
		if (this.downloader_ != null) {
			this.downloader_.log_("timeout");
			this.downloader_.close();
			this.downloader_ = null;
		}
		if (++this.metaTryTimes_ != 0) {
			var tryTimes = this.metaTryTimes_ < 3 ? "retry again ..." : "meta failed";
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}]Meta timeout for url{2},channel({3}),try times({4}),result({5})",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_),this.metaData_.sourceUrl_,this.manager_.getPool_().getMetaData_().storageId_,this.metaTryTimes_,tryTimes));
		}
		if (this.metaTryTimes_ < 3) {
			this.downloadMeta_();
		}
	},

	onRangeDownloadTimeout_ : function(errorCode) {

		if (this.downloader_ != null) {
			this.downloader_.log_("timeout");
			this.downloader_.close();
			this.downloader_ = null;
		}

		// retry by scheduler ...
		this.downloadingRange_.downloading_ = false;
		this.downloadingRange_.tryTimes_++;
		this.lastReceiveSpeed_ = 0;
		P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}] Range download timeout, segment({2}), items({3})",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), this.downloadingRange_.segmentId_, this.downloadingRange_.pieces_.length));

		var segmentIndex = -1;
		if (this.downloadingRange_.segmentId_ >= 0) {
			segmentIndex = this.metaData_.getSegmentIndexById_(this.downloadingRange_.segmentId_);
		}
		if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onRangeDownloadTimeout segment({1}) not found",this.tag_,this.downloadingRange_.segmentId_));
			return null;
		}
		var segment = this.metaData_.segments_[segmentIndex];
		for ( var k = 0; k < segment.pieces_.length; k++) {
			// setting receiveStartTime_ = 0
			// waiting schedule
			var piece = segment.pieces_[k];
			if (piece.completedTime_ > 0) {
				continue;
			}
			piece.receiveStartTime_ = 0;
		}
	},

	// override protocol::base::Session
	onTimeout_ : function(tag, timer, errorCode) {
		if (timer != this.timer_ || !this.opened_) {
			return;
		}

		// stop timer
		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}

		switch (tag) {
		case p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeOpen:
			this.onOpenTimeout_(errorCode);
			break;
		case p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeMeta:
			this.onMetaTimeout_(errorCode);
			break;
		case p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeRangeDownload:
			this.onRangeDownloadTimeout_(errorCode);
			break;
		default:
			break;
		}
	},

	// override core::supernode::HttpDownloaderListener
	onHttpDownloadData_ : function(downloader) {
		var handled = false;
		if (this.downloader_ != downloader) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onHttpDownloadData type({1}),tag({2}),url({3}),channel({4}),code({5}),detail({6}),size({7})",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_),downloader.tag_,downloader.url_,this.manager_.getPool_().getMetaData_().storageId_,downloader.responseCode_,downloader.responseDetails_,downloader.responseData_.length));
			return handled;
		}
		if (downloader.tag_ == "cdn::range-data") {

		}
	},
	onMetaCompleted_ :function(downloader)
	{
        P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onMetaCompleted, channel({1})",this.tag_,this.manager_.getPool_().getMetaData_().storageId_));
        if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
            // waiting for timeout and retry ...
            return;
        }
        this.metaData_.lastReceiveSpeed_ = downloader.transferedSpeed_;
        this.lastReceiveSpeed_ = downloader.transferedSpeed_;
        this.lastTotalReceiveBytes_ = downloader.transferedBytes_;

        // stop timer
        if (this.timer_) {
            clearTimeout(this.timer_);
            this.timer_ = null;
        }
        // parse meta data
        this.metaData_.storageId_ = this.manager_.getPool_().getMetaData_().storageId_;
        this.metaData_.finalUrl_ = downloader.url_;
        if (!this.parseMetaResponse_(downloader)) {
            return;
        }
        if (this.metaData_.segments_.length > 0) {
            this.firstSegmentUrl_.fromString_(this.metaData_.segments_[0].mediaUrl_);
        }
        this.active_ = true;
        this.downloadNextRange_(false);
        this.manager_.getEventListener_().onProtocolSessionOpen_(this);
	},
	onRangeDataCompleted_ :function(downloader){
        P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onRangeDataCompleted_ tag({1}) ",this.tag_,downloader.tag_));
        this.downloadingRange_.downloading_ = false;
        var params={};
        params["err"]=downloader.responseCode_;
        params["utime"]=downloader.totalUsedTime_;
        params["sn"]=this.manager_.sn_;
        if (downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
            this.lastReceiveSpeed_ = 0;
            params["err"]=30001;
            this.manager_.eventListener_.sendStatus_({type:"VIDEO.PLAY.ERROR",code:downloader.responseCode_,params:params});
            if (downloader.responseCode_ == 403) {
                this.gslbExpired_ = true;
                this.manager_.checkGslbExpired_();
            }
            return;
        }
        this.manager_.eventListener_.sendStatus_({type:"VIDEO.TS.LOADED",params:params});
        this.gslbExpired_ = false;
        this.lastReceiveSpeed_ = downloader.transferedSpeed_;
        this.lastTotalReceiveBytes_ = downloader.transferedBytes_;
        // stop timer
        if (this.timer_) {
            clearTimeout(this.timer_);
            this.timer_ = null;
        }

        var dataOffset = this.downloadingRange_.dataUsed_;
        var message = new p2p$.com.webp2p.protocol.base.Message();
        while (this.downloadingRange_.pieceUsed_ < this.downloadingRange_.pieces_.length) {
            var piece = this.downloadingRange_.pieces_[this.downloadingRange_.pieceUsed_];
            if (piece.size_ <= 0) {
                if (piece.checksum_ != 0) {
                    // maybe AD
                    break;
                }
            } else if (piece.completedTime_ > 0) {
                // already completed
                if (this.downloadingRange_.length_ > 0) {
                    dataOffset += piece.size_;
                }
                this.downloadingRange_.dataUsed_ += piece.size_;
                this.downloadingRange_.pieceUsed_++;
                continue;
            }

            if (this.downloadingRange_.length_ <= 0) {
                dataOffset = piece.offset_;
            }
            if ((dataOffset + piece.size_) > downloader.responseData_.length) {
                // incompleted
                break;
            }

            var responseData = new p2p$.com.webp2p.protocol.base.ResponseDataItem();
            responseData.segmentId_ = this.downloadingRange_.segmentId_;
            responseData.pieceType_ = piece.type_;
            responseData.pieceId_ = piece.id_;
            responseData.pieceKey_ = piece.key_;
            if (piece.size_ <= 0) {
                responseData.data_ = downloader.responseData_;
            } else {
                responseData.data_ = downloader.responseData_.subarray(dataOffset, piece.size_ + dataOffset);
            }

            if (this.downloadingRange_.length_ > 0) {
                dataOffset += piece.size_;
            }
            this.downloadingRange_.dataUsed_ += piece.size_;
            this.downloadingRange_.pieceUsed_++;
            piece.completedTime_ = this.global_.getMilliTime_();
            message.responses_.push(responseData);
        }
        if (message.responses_.length != 0) {
            this.manager_.getEventListener_().onProtocolSessionMessage_(this, message);
        }
	},
	onHttpDownloadCompleted_ : function(downloader) {
		if (this.downloader_ != downloader) {
			return;
		}
		this.downloader_ = null;
		this.activeTime_ = this.global_.getMilliTime_();
        if (downloader.tag_ == "cdn::meta") {
        	this.onMetaCompleted_(downloader);
        	return;
        }
		if (downloader.tag_ == "cdn::range-data") {
			this.onRangeDataCompleted_(downloader);
			return;
		}
	},

	close : function() {
		this._super();
		if (this.timer_ != null) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		if (this.downloader_ != null) {
			this.downloader_.log_("clean");
			this.downloader_.close();
			this.downloader_ = null;
		}
		return true;
	},

	send : function(message) {
		var emptyResponseCount = 0;
		var meta = this.metaData_.directMetaMode_ ? this.metaData_ : this.manager_.getPool_().getMetaData_();
		var globalMeta = this.manager_.getPool_().getMetaData_();
		// // check expire segments
		if (this.downloadingRange_.downloading_ && this.downloadingRange_.segmentId_ < meta.urgentSegmentId_) {
			// cancel
			if (this.downloader_ != null) {
				this.downloader_.log_("cancel");
				this.downloader_.close();
				this.downloader_ = null;
			}
			this.downloadingRange_.downloading_ = false;
		}
		for ( var n = 0; n < message.requests_.length; n++) {
			var item = message.requests_[n];
			if (item.pieceId_ == -1) {
				// clean all requests
				this.lastReceiveSpeed_ = -1;
				this.lastStartReceiveTime_ = 0;
				this.lastTotalReceiveBytes_ = 0;
				this.cleanAllPending_();
				return true;
			}

			var index = -1;
			if (item.segmentId_ >= 0) {
				index = meta.getSegmentIndexById_(item.segmentId_);
			} else {
				index = meta.getSegmentIndexByPieceId_(item.pieceType_, item.pieceId_);
			}
			if (index < 0 || index >= meta.segments_.length) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}]Send piece from session({2}) not found, type({3}), id({4}), ignore it!",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), this.remoteAddress_,p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(item.pieceType_), item.pieceId_));
				emptyResponseCount++;
				continue;
			}
			var segment = meta.segments_[index];
			var pieceIndex = segment.getPieceIndex_(item.pieceType_, item.pieceId_);
			if (pieceIndex < 0 || pieceIndex >= segment.pieces_.length) {
				emptyResponseCount++;
				continue;
			}

			var piece = segment.pieces_[pieceIndex];
			// if( this.downloadingRange_.downloading_ && this.downloadingRange_.segmentId_ == segment.id_ && this.downloadingRange_.length_ <= 0 )
			// {
			// // full range request, add piece is ok
			// if( !this.downloadingRange_.addPiece_(piece) )
			// {
			// emptyResponseCount ++;
			// }
			// continue;
			// }
			//
			var range = this.pendingRanges_.get(index);
			if (typeof range == 'undefined' || range == null) {
				range = new p2p$.com.webp2p.protocol.cdn.RequestRange();
				this.pendingRanges_.set(index, range);
			}
			range.urgent_ = item.urgent_;
			range.urlOffset_ = segment.urlOffset_;
			range.segmentId_ = segment.id_;
			range.segmentSize_ = segment.size_;
			if (range.url_ == "") {
				// range.url_ = segment.mediaUrl_;
				var backupIndex = this.nodeIndex_ - 1;
				var isSameSource = (this.primary_ && globalMeta.sourceServer_ == "") || (globalMeta.sourceServer_ == this.metaData_.sourceServer_);
				if (isSameSource || this.metaData_.directMetaMode_) {
					range.url_ = segment.mediaUrl_;
				} else if (p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive == globalMeta.type_ && !globalMeta.directMetaMode_ && backupIndex >= 0
						&& segment.moreMediaUrls_ && backupIndex < segment.moreMediaUrls_.length && segment.moreMediaUrls_[backupIndex]) {
					range.url_ = segment.moreMediaUrls_[backupIndex];
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}]Using backup url from meta, index({2}), url({3})",this.tag_, p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), backupIndex, range.url_));
				} else {
					var newUrl = new p2p$.com.common.Url();
					newUrl.fromString_(segment.mediaUrl_);
					var isSamePort = newUrl.port_ == this.firstSegmentUrl_.port_ || (newUrl.port_ == 0 && this.firstSegmentUrl_.port_ == 80)
							|| (newUrl.port_ == 80 && this.firstSegmentUrl_.port_ == 0);
					if (newUrl.host_ != this.firstSegmentUrl_.host_ || !isSamePort) {
						newUrl.host_ = this.firstSegmentUrl_.host_;
						newUrl.port_ = this.firstSegmentUrl_.port_;

						if (this.firstSegmentUrl_.params_.has("path")) {
							newUrl.params_.set("path", this.firstSegmentUrl_.params_.get("path"));
						}

						if (this.firstSegmentUrl_.params_.has("proxy")) {
							newUrl.params_.set("proxy", this.firstSegmentUrl_.params_.get("proxy"));
						}

						range.url_ = newUrl.toString();
					} else {
						range.url_ = segment.mediaUrl_;
					}
				}
			}
			if (!range.addPiece_(piece)) {
				emptyResponseCount++;
			}
		}
		this.downloadNextRange_(false);
		return true;
	},

	getLastReceiveSpeed_ : function() {
		return -1;
	},

	getUpdateReceiveSpeed_ : function(nowTime, waiting) {
		if (this.pendingRanges_.isEmpty() && !this.downloadingRange_.downloading_ && !waiting) {
			return this.lastReceiveSpeed_;
		}

		var timeUsed = this.lastStartReceiveTime_ > 0 ? (nowTime - this.lastStartReceiveTime_) : 0;
		if (timeUsed > 1000) {
			this.lastReceiveSpeed_ = this.lastTotalReceiveBytes_ * 1000 / timeUsed;
		}
		return this.lastReceiveSpeed_;
	}
});
