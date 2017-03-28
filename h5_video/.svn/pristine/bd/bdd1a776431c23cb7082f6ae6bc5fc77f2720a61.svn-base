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
	timer_ : null,
	drmDrypto_ : null,
	downloadingRange_ : null,
	pendingRanges_ : null,

	primary_ : false,
	metaTryTimes_ : 0,
	activeTime_ : 0,
	maxRangeDownloadTime_ : 0,
	lastReceiveSpeed_ : 0,
	lastStartReceiveTime_ : 0,
	lastTotalReceiveBytes_ : 0,

	init : function(mgr, remoteId, nodeIndex, drm) {
		this._super(mgr, remoteId);
		this.nodeIndex_ = nodeIndex;
		this.drmDrypto_ = drm;
		this.activeTime_ = 0;
		this.metaTryTimes_ = 0;
		this.maxRangeDownloadTime_ = 30 * 1000; // ms
		this.lastReceiveSpeed_ = 0;
		this.lastStartReceiveTime_ = 0;
		this.lastTotalReceiveBytes_ = 0;
		this.metaData_ = new p2p$.com.webp2p.core.supernode.MetaData();
		var mainMeta = this.manager_.getPool_().getMetaData_();
		this.metaUrl_ = new p2p$.com.webp2p.core.supernode.Url();
		this.firstSegmentUrl_ = new p2p$.com.webp2p.core.supernode.Url();
		this.pendingRanges_ = new p2p$.com.webp2p.core.common.Map();
		if (this.remoteId_.length == 0) {
			// primary session
			this.primary_ = true;
			this.metaData_ = mainMeta;
			this.remoteId_ = this.metaData_.sourceUrl_;
			this.lastReceiveSpeed_ = this.metaData_.lastReceiveSpeed_;
			if (this.metaData_.segments_.length > 0) {
				this.firstSegmentUrl_.fromString_(this.metaData_.segments_[0].mediaUrl_);
			}
		} else {
			this.primary_ = false;
			this.metaData_.verifyMethod_ = mainMeta.verifyMethod_;
			this.metaData_.rangeParamsSupported_ = mainMeta.rangeParamsSupported_;
			this.metaData_.sourceUrl_ = this.remoteId_;
		}
		this.metaUrl_.fromString_(this.metaData_.primaryDataUrl_ == "" ? this.metaData_.sourceUrl_ : this.metaData_.primaryDataUrl_);
		this.remoteAddress_ = (this.primary_ ? "* " : "") + (this.metaUrl_.host_ + ":") + ((this.metaUrl_.port_ == 0) ? 80 : this.metaUrl_.port_);
		this.metaData_.sourceServer_ = this.metaUrl_.host_ + ":" + ((this.metaUrl_.port_ == 0) ? 80 : this.metaUrl_.port_);
		this.downloadingRange_ = new p2p$.com.webp2p.protocol.cdn.RequestRange();
	},

	attachMeta_ : function(index) {
		var mainMeta = this.manager_.getPool_().getMetaData_();
		this.metaData_ = mainMeta;
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (index < segment.moreMediaUrls_.size()) {
				segment.mediaUrl_ = segment.moreMediaUrls_[index];
			}
			segment.moreMediaUrls_ = [];
		}
	},

	cleanAllPending_ : function() {
		P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::cdn::Session [{0}]Clean all pending requests, session({1})", p2p$.com.webp2p.core.common.Enum
				.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), this.remoteAddress_));

		// stop timer
		if (this.timer_ != null) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		if (this.downloader_ != null) {
			this.downloader_.log("clean");
			this.downloader_.close();
			this.downloader_ = null;
		}
		this.pendingRanges_.clear();
		this.downloadingRange_.downloading_ = false;
	},

	downloadMeta_ : function() {
		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (this.downloader_ != null) {
			// downloader_->log("cancel");
			// downloader_->close();
		}
		this.downloader_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(this.metaData_.sourceUrl_, this, "GET", "", "cdn::meta");
		this.downloader_.load();
		// set meta timer
		this.setTimeout_(p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeMeta, this.timer_, 10 * 1000);
	},

	downloadNextRange_ : function(retry) {
		if (this.downloader_ != null) {
			// busy
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
				requestUrl += p2p$.com.webp2p.core.common.String.format("rstart={0}&rend={1}", offsetBegin, offsetEnd);

			}
			// P2P_ULOG_INFO(P2P_ULOG_FMT("com.webp2p.protocol.cdn.Session.downloadNextRange_",));
			else {
				this.requestRange_ = p2p$.com.webp2p.core.common.String.format("bytes={0}-{1}", offsetBegin, offsetEnd);
				// using http range header instead of rstart,rend
				// downloader_->requestHeaders_["Range"] = core::common::String::format("bytes=" _I64FMT_ "-" _I64FMT_, offsetBegin, offsetEnd);
			}
		}

		if (requestUrl.indexOf('?') == -1) {
			requestUrl += "?";
		} else {
			requestUrl += "&";
		}

		// requestUrl += p2p$.com.webp2p.core.common.String.format("curSegment={0}&sIndex={1}&eIndex={2}", this.downloadingRange_.segmentId_,
		// this.downloadingRange_.startIndex_, this.downloadingRange_.endIndex_);

		// addtional appid
		if (requestUrl.indexOf("&appid=") == -1 && requestUrl.indexOf("?appid=") == -1) {
			var externalAppId = p2p$.com.webp2p.core.common.String.urlEncode_(this.manager_.getPool_().getEnviroment_().externalAppId_);
			var moduleVersion = p2p$.com.webp2p.core.common.String.fromNumber(p2p$.com.webp2p.core.common.Module.getkCdeFullVersion_());
			if (requestUrl.indexOf('?') == -1) {
				requestUrl += "?";
			} else {
				requestUrl += "&";
			}
			requestUrl += p2p$.com.webp2p.core.common.String.format("appid={0}&cde={1}", externalAppId, moduleVersion);
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

		requestUrl += p2p$.com.webp2p.core.common.String.format("&ajax={0}", 1);
		//
		this.lastTotalReceiveBytes_ = 0;
		this.lastStartReceiveTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.downloader_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(requestUrl, this, "GET", "arraybuffer", "cdn::range-data");
		this.downloader_.setInfo_(this.downloadingRange_);
		if (this.requestRange_) {
			this.downloader_.setRequsetRange_(this.requestRange_);
		}
		this.downloader_.load();
		this.setTimeout_(p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeRangeDownload, this.timer_, this.maxRangeDownloadTime_);
	},

	parseMetaResponse_ : function(downloader) {
		if (!this.metaData_.load(downloader.responseData_, downloader.totalUsedTime_)) {
			P2P_ULOG_ERROR("protocol::cdn::Session[" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_)
					+ "]Parse meta response failed, url(" + this.metaData_.sourceUrl_ + "), channel(" + this.manager_.getPool_().getMetaData_().storageId_
					+ "), size(" + downloader.responseData_.length + ")");
			return false;
		}
		return true;
	},

	onOpenTimeout_ : function(errorCode) {
		this.manager_.getEventListener_().onProtocolSessionOpen_(this);
	},

	onMetaTimeout_ : function(errorCode) {
		if (this.downloader_ != null) {
			this.downloader_.log("timeout");
			this.downloader_.close();
			this.downloader_ = null;
		}
		if (++this.metaTryTimes_ != 0) {
			var tryTimes = this.metaTryTimes_ < 3 ? "retry again ..." : "meta failed";
			P2P_ULOG_ERROR("protocol::cdn::Session [" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_)
					+ "]Meta timeout for url(" + this.metaData_.sourceUrl_ + "), channel(" + this.manager_.getPool_().getMetaData_().storageId_ + "), "
					+ this.metaTryTimes_ + " try times, " + tryTimes);
		}
		if (this.metaTryTimes_ < 3) {
			this.downloadMeta_();
		}
	},

	onRangeDownloadTimeout_ : function(errorCode) {

		if (this.downloader_ != null) {
			this.downloader_.log("timeout");
			this.downloader_.close();
			this.downloader_ = null;
		}
		// downloader_.reset();

		// retry by scheduler ...
		this.downloadingRange_.downloading_ = false;
		this.downloadingRange_.tryTimes_++;
		this.lastReceiveSpeed_ = 0;
		P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::cdn::Session [{0}] Range download timeout, segment({1}), items({2})", p2p$.com.webp2p.core.common.Enum
				.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), this.downloadingRange_.segmentId_, this.downloadingRange_.pieces_.length));

		var segmentIndex = -1;
		if (this.downloadingRange_.segmentId_ >= 0) {
			segmentIndex = this.metaData_.getSegmentIndexById_(this.downloadingRange_.segmentId_);
		}
		if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::cdn::Session::onRangeDownloadTimeout segment({0}) not found", this.downloadingRange_.segmentId_));
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
		// if( this.downloadingRange_.pieces_.length > 0 )
		// {
		// var emptyResponse = new p2p$.com.webp2p.protocol.base.Message();
		// //emptyResponse.responses_.resize(downloadingRange_.pieces_.size());
		// for( var n = 0; n < this.downloadingRange_.pieces_.length; n ++ )
		// {
		// var item = new p2p$.com.webp2p.protocol.base.ResponseDataItem();
		// item.pieceId_ = -1;
		// item.segmentId_ = this.downloadingRange_.segmentId_;
		// emptyResponse.responses_.push(item);
		// }
		// this.manager_.getEventListener_().onProtocolSessionMessage_(this, emptyResponse);
		// }

		// if( downloadingRange_.tryTimes_ <= 3 )
		// {
		// this.downloadNextRange_(true);
		// }
		// else
		// {
		// this.downloadNextRange_(false);
		// }
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
			// expired
			P2P_ULOG_INFO("protocol::cdn::Session::onHttpDownloadData ["
					+ p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_) + "]Expired http complete for tag("
					+ downloader.tag_ + "), url(" + downloader.fullUrl_ + "), channel(" + this.manager_.getPool_().getMetaData_().storageId_
					+ "), response code(" + downloader.responseCode_ + "), details(" + downloader.responseDetails_ + "), size("
					+ downloader.responseData_.length + "), ignore");
			return handled;
		}

		if (downloader.tag_ == "cdn::range-data") {

		}
	},

	onHttpDownloadCompleted_ : function(downloader) {
		var handled = false;

		if (this.downloader_ != downloader) {
			// expired
			P2P_ULOG_INFO("protocol::cdn::Session::onHttpDownloadCompleted ["
					+ p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_) + "]Expired http complete for tag("
					+ downloader.tag_ + "), url(" + downloader.fullUrl_ + "), channel(" + this.manager_.getPool_().getMetaData_().storageId_
					+ "), response code(" + downloader.responseCode_ + "), details(" + downloader.responseDetails_ + "), size("
					+ downloader.responseData_.length + "), ignore");
			return handled;
		}
		// P2P_ULOG_INFO("this.download:",this.downloader_);
		this.downloader_ = null;
		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (downloader.tag_ == "cdn::meta") {
			P2P_ULOG_INFO("protocol::cdn::Session [" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_)
					+ "]Meta complete " + ((downloader.successed_ && downloader.responseCode_ == 200) ? "OK" : "FAILED") + ", url(" + downloader.fullUrl_
					+ "), channel(" + this.manager_.getPool_().getMetaData_().storageId_ + ")");

			if (downloader.successed_ /* && !downloader.remoteEndpoint_.empty() */) {
				this.remoteAddress_ /* = (primary_ ? "* " : "") + downloader.remoteEndpoint_ */;
			}

			handled = true;
			if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
				// waiting for timeout and retry ...
				return handled;
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
			this.metaData_.finalUrl_ = downloader.fullUrl_;
			if (!this.parseMetaResponse_(downloader)) {
				return handled;
			}

			if (this.metaData_.segments_.length > 0) {
				this.firstSegmentUrl_.fromString_(this.metaData_.segments_[0].mediaUrl_);
			}

			this.active_ = true;
			this.downloadNextRange_(false);
			this.manager_.getEventListener_().onProtocolSessionOpen_(this);
		} else if (downloader.tag_ == "cdn::range-data") {
			if (this.downloadingRange_.dataUsed_ <= 0 /* && !downloader.remoteEndpoint_.empty() */) {
				// this.remoteAddress_ = (this.primary_ ? "* " : "") + downloader.remoteEndpoint_;
				// this.remoteAddress_ = "*" + this.remoteAddress_;
			}

			handled = true;
			this.downloadingRange_.downloading_ = false;
			if (downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
				this.lastReceiveSpeed_ = 0;
				if (downloader.responseCode_ == 403) {
					this.gslbExpired_ = true;
					this.manager_.checkGslbExpired_();
				}
				return handled;
			}
			this.gslbExpired_ = false;
			// if( downloader.transferedBytes_ > 2000 )
			// {
			// to avoid speed jitter
			this.lastReceiveSpeed_ = downloader.transferedSpeed_;
			// }
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
				piece.completedTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
				// P2P_ULOG_INFO("segment:"+this.downloadingRange_.segmentId_+",pieceUsed_:"+this.downloadingRange_.pieceUsed_+
				// ",dataUsed_:"+this.downloadingRange_.dataUsed_);
				// if( !drmDrypto_.decrypt((void *)responseData.data_.data(), responseData.data_.size(), downloadingRange_.segmentId_) )
				// {
				// __ULOG_ERROR(__ULOG_FMT("protocol::cdn::Session", "[%s]Piece data decrypt failed, segment(" _I64FMT_ "), piece(%s," _I64FMT_ "),
				// url(%s), channel(%s)"),
				// core::common::getMetaTypeName_(manager_.getPool_().getMetaData_().type_),
				// responseData.segmentId_,
				// core::common::getPieceTypeName_(piece.type_),
				// piece.id_,
				// downloader.fullUrl_.c_str(),
				// manager_.getPool_().getMetaData_().storageId_.c_str());
				// break;
				// }
				message.responses_.push(responseData);
			}
			if (message.responses_.length != 0) {
				this.manager_.getEventListener_().onProtocolSessionMessage_(this, message);
			}
		}
	},

	open : function() {
		if (this.active_) {
			return true;
		}

		this._super();
		if (!this.metaData_.finalUrl_ == "") {
			this.active_ = true;
			// rank first
			if (this.lastReceiveSpeed_ <= 0) {
				this.lastReceiveSpeed_ = 200000;
			}
			this.lastReceiveSpeed_ = this.metaData_.lastReceiveSpeed_;
			this.manager_.getEventListener_().onProtocolSessionOpen_(this);
			// setTimeout(kTimerTypeOpen, &timer_, 1); // async
		} else if (this.metaUrl_.params_.get("__cde_attach__") != null) {
			var index = p2p$.com.webp2p.core.common.String.parseNumber_(metaUrl_.params_["__cde_attach__"], 0);
			this.attachMeta_(index);
			this.active_ = true;
			this.lastReceiveSpeed_ = 1;
			this.manager_.getEventListener_().onProtocolSessionOpen_(this);
		} else {
			// this.downloadMeta_();
			// delay open to avoid network congestion
			this.metaTryTimes_ = -1;
			this.setTimeout_(p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeMeta, this.timer_, 5 * 1000);
		}

		return true;
	},

	close : function() {
		this._super();
		if (this.timer_ != null) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		if (this.downloader_ != null) {
			this.downloader_.log("clean");
			this.downloader_.close();
			this.downloader_ = null;
		}
		return true;
	},

	send : function(message) {
		var emptyResponseCount = 0;
		var meta = this.metaData_.directMetaMode_ ? this.metaData_ : this.manager_.getPool_().getMetaData_();
		var globalMeta = this.manager_.getPool_().getMetaData_();
		//
		// // check expire segments
		if (this.downloadingRange_.downloading_ && this.downloadingRange_.segmentId_ < meta.urgentSegmentId_) {
			// cancel
			if (this.downloader_ != null) {
				this.downloader_.log("cancel");
				this.downloader_.close();
				this.downloader_ = null;
			}
			this.downloadingRange_.downloading_ = false;
		}
		// for( var n = 0 ; n < this.pendingRanges_.length; n++ )
		// {
		// var kv = this.pendingRanges_.element(n);
		// var range = kv.value;
		// if( range.segmentId_ < meta.urgentSegmentId_ )
		// {
		// // expired
		// emptyResponseCount += range.pieces_.length;
		// this.pendingRanges_.erase(kv.key);
		// }
		// }

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
				P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::cdn::Session [{0}]Send piece from session({1}) not found, type({2}), id({3}), ignore it!",
						p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), this.remoteAddress_,
						p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(item.pieceType_), item.pieceId_));
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
					P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::cdn::Session [{0}]Using backup url from meta, index({1}), url({2})", p2p$.com.webp2p.core.common.Enum
							.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), backupIndex, range.url_));
				} else {
					var newUrl = new p2p$.com.webp2p.core.supernode.Url();
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

		// if( emptyResponseCount > 0 )
		// {
		// protocol::base::Message emptyResponse;
		// emptyResponse.responses_.resize(emptyResponseCount);
		// for( size_t n = 0; n < emptyResponse.responses_.size(); n ++ )
		// {
		// protocol::base::ResponseDataItem &item = emptyResponse.responses_[n];
		// item.pieceId_ = -1;
		// }
		// manager_.getEventListener_().onProtocolSessionMessage_(*this, emptyResponse);
		// }
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