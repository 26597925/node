p2p$.ns('com.webp2p.logic.live');

p2p$.com.webp2p.logic.live.ChannelStatic = {
	kTimerTagMetaUpdate : 0,
};

p2p$.com.webp2p.logic.live.Channel = p2p$.com.webp2p.logic.base.Channel.extend_({
	channelType_ : "liv",
	livePlayOffset_ : 0,
	livePlayMaxTimeLength_ : 0,
	liveFirstUrgentUpdated_ : false,
	liveSkipSegmentTime_ : 0,
	liveMetaRefreshInterval_ : 0,
	liveMetaTryTimeoutTimes_ : 0,
	playLastSegmentCount_ : 0,

	liveTimeShift_ : 0,
	livePlayerShift_ : 0,
	liveCurrentTime_ : 0,
	liveStartTime_ : 0,
	liveAbTimeShift_ : 0,
	liveNowPlayOffset_ : 0,
	liveMetaLoadTime_ : 0,
	liveMetaUpdateTime_ : 0,
	liveMaxSegmentStartTime_ : 0,
	lastFetchEndSegmentId_ : 0,
	lastProgramChangeTime_ : 0,
	liveStreamId_ : "",
	sourceMetaUrl_ : "",
	updateMetaUrl_ : "",
	backupMetaData_ : null,
	// boost::asio::deadline_timer liveTimer_;

	init : function(channelUrl, decodedUrl, mgr) {
		this._super(p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive, channelUrl, decodedUrl, mgr);
		this.context_.playType_ = "liv";
		this.maxSleepTime_ = 60 * 1000;
		this.livePlayOffset_ = 120; // seconds
		this.livePlayMaxTimeLength_ = 200; // 200 seconds
		this.liveMetaRefreshInterval_ = 5000; // ms
		this.liveMetaTryTimeoutTimes_ = 0;
		this.liveFirstUrgentUpdated_ = false;
		this.liveSkipSegmentTime_ = 0;
		this.playLastSegmentCount_ = 20; // last 20 segments
		this.liveTimeShift_ = -1;
		this.livePlayerShift_ = 0;
		this.liveCurrentTime_ = 0;
		this.liveStartTime_ = 0;
		this.liveAbTimeShift_ = 0;
		this.liveNowPlayOffset_ = 0;
		this.liveMetaLoadTime_ = 0;
		this.liveMetaUpdateTime_ = 0;
		this.liveMaxSegmentStartTime_ = 0;
		this.lastFetchEndSegmentId_ = 0;
		this.lastProgramChangeTime_ = 0;
		this.updateLiveTimer_ = null;
	},

	getChannelType_ : function() {
		return this.channelType_;
	},

	open : function() {
		if (!this._super()) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::live::Channel::Super return false"));
			return false;
		}

		if (this.manager_.getEnviroment_().livePlayOffset_ > 0) {
			this.livePlayOffset_ = this.manager_.getEnviroment_().livePlayOffset_;
		}

		this.liveStreamId_ = this.url_.params_.get("stream_id");
		this.playerHistoryKey_ = "live:" + this.liveStreamId_;
		// this.updateUrlParams(false);
		this.url_.params_.set("mslice", 5);

		var timeshift = this.url_.params_.get("timeshift");
		if (timeshift != null) {
			this.livePlayerShift_ = p2p$.com.webp2p.core.common.String.parseNumber_(timeshift.value, 0);
			if (this.livePlayerShift_ == 0) {
				// remove invalid timeshift value
				this.url_.params_.erase(timeshift.key);
			}
		}

		this.gslbRequestUrl_ = this.url_.toString();
		this.gslbEncryptUrl_ = this.gslbRequestUrl_;
		this._superprototype.downloadGslb_.call(this);
		return true;
	},
	close : function() {
		this.stopUpdateLiveMetaTimer_();
		this._super();
		return true;
	},
	// override logic::base::Channel
	onOpened_ : function() {

		var minSegmentTime = -1;
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			this.liveMaxSegmentStartTime_ = Math.max(this.liveMaxSegmentStartTime_, segment.startTime_);
			if (minSegmentTime < 0 || minSegmentTime > segment.startTime_) {
				minSegmentTime = segment.startTime_;
			}
		}
		if (this.gslbReloadTimes_ <= 0 && (minSegmentTime / 1000) > this.liveAbTimeShift_) {
			// fixed abtimeshift
			this.liveCurrentTime_ += (minSegmentTime / 1000 - this.liveAbTimeShift_);
		}

		var p2pGroupIdChanged = false;
		if (this.gslbReloadTimes_ > 0) {
			var newSegment = {
				newSegmentCount_ : 0,
				newSegments_ : []
			};
			if (this.backupMetaData_ && this.backupMetaData_.p2pGroupId_ == this.metaData_.p2pGroupId_) {
				p2pGroupIdChanged = false;
				newSegment = this.metaData_.combineWith_(this.backupMetaData_, true, false);
			} else {
				p2pGroupIdChanged = true;
			}
			this.backupMetaData_.tidy();
			this.liveMaxSegmentStartTime_ = 0;
			for ( var k = 0; k < this.metaData_.segments_.length; k++) {
				var segment = this.metaData_.segments_[k];
				this.liveMaxSegmentStartTime_ = Math.max(this.liveMaxSegmentStartTime_, segment.startTime_);
			}

			P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::live::Channel::Add {0} backup meta segment(s) to reloaded channel({1}), total {2} segment(s) now",
					newSegment.newSegmentCount_, this.id_, this.metaData_.segments_.length));
		}

		this.stablePeers_ = [];
		this.otherPeers_ = [];
		if (this.protocolPool_ != null && !this.protocolPool_.initialize_()) {
			return false;
		}
		this.setUpdateLiveMetaTimeout_(p2p$.com.webp2p.logic.live.ChannelStatic.kTimerTagMetaUpdate, this.liveMetaRefreshInterval_);
		return true;
	},

	onUpdateLiveMetaTimeout_ : function(tag) {
		// if( timer != &timer_ || !opened_ )
		// {
		// return;
		// }

		switch (tag) {
		case p2p$.com.webp2p.logic.live.ChannelStatic.kTimerTagMetaUpdate: {
			if (this.downloader_ != null) {
				this.metaServerResponseCode_ = 0;
				this.downloader_.log("timeout");
				this.downloader_.close();
				this.downloader_ = null;
				this.switchNextMetaSource_();
			}
			// for test switch only
			// this.switchNextMetaSource_();

			this.updateLiveMeta_();
			break;
		}
		default:
			break;
		}
	},

	switchNextMetaSource_ : function() {
		this.liveMetaTryTimeoutTimes_++;
		var bak = this.sourceMetaUrl_;
		var allMetaNodes = this.context_.gslbData_["nodelist"];
		for ( var n = 0; n < allMetaNodes.length; n++) {
			var metaItem = allMetaNodes[(n + this.liveMetaTryTimeoutTimes_) % allMetaNodes.length];
			var locationUrl = metaItem["location"];
			if (!(locationUrl == "") && locationUrl != this.metaData_.sourceUrl_) {
				this.sourceMetaUrl_ = locationUrl;
				break;
			}
		}

		var url = new p2p$.com.webp2p.core.supernode.Url();
		url.fromString_(this.sourceMetaUrl_);
		this.context_.metaServerIp_ = p2p$.com.webp2p.core.common.String.format("{0}:{1}", url.host_, (url.port_) == 0 ? 80 : url.port_);

		P2P_ULOG_INFO(P2P_ULOG_FMT("logic::live::Channel [{0}]Meta timeout/error for url({1}), channel({2}), {3} try times, switch next source({4})...",
				p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), bak, this.id_, this.liveMetaTryTimeoutTimes_, this.sourceMetaUrl_));
	},

	updateLiveMeta_ : function() {
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		// this.gslbReloadInterval_ = 10800000;
		if (this.gslbLoadTime_ + this.gslbReloadInterval_ <= nowTime) {
			// reload gslb again
			P2P_ULOG_INFO(P2P_ULOG_FMT("logic::live::Channel Channel({0}), gslb reload({1} sec) expired, last({2}), reload gslb again ...", this.id_,
					this.gslbReloadInterval_ / p2p$.com.webp2p.core.common.Global.kMicroUnitsPerSec, p2p$.com.webp2p.core.common.String.formatTime_(
							this.gslbLoadTime_, false)));
			// liveTimeShift_ = -1;
			this.gslbReloadTimes_++;
			this.backupMetaData_ = this.metaData_.fork();
			// this.updateUrlParams(true);
			this.gslbRequestUrl_ = this.url_.toString();
			// this.gslbEncryptUrl_ = this.manager_.getAuthorization().encrypt(gslbRequestUrl_);
			this.downloadGslb_();
			return;
		}

		if (this.liveNowPlayOffset_ > 0) {
			if (this.liveNowPlayOffset_ > this.liveTimeShift_) {
				this.liveNowPlayOffset_ -= this.liveTimeShift_;
			} else {
				this.liveNowPlayOffset_ = 0;
			}
		}
		this.liveAbTimeShift_ = this.liveMaxSegmentStartTime_ / 1000;
		if (this.liveAbTimeShift_ <= 0) {
			this.liveAbTimeShift_ = this.liveCurrentTime_ - this.liveTimeShift_;
		}
		this.liveMetaUpdateTime_ = nowTime;

		if (this.downloader_ != null) {
			this.downloader_.log("cancel");
			this.downloader_.close();
			this.downloader_ = null;
		}
		this.updateMetaUrl_ = this.getNowRequestMetaUrl_(nowTime);
		this.downloader_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(this.updateMetaUrl_, this, "GET", "", "live::meta");
		this.downloader_.load();
		// set meta timer
		this.setUpdateLiveMetaTimeout_(p2p$.com.webp2p.logic.live.ChannelStatic.kTimerTagMetaUpdate, this.liveMetaRefreshInterval_); // liveNowPlayOffset_ >
		// 0 ?
		// 1000 :
		// liveMetaRefreshInterval_);
	},

	getNowRequestMetaUrl_ : function(nowTime) {
		var url = this.sourceMetaUrl_ == "" ? this.metaData_.sourceUrl_ : this.sourceMetaUrl_;
		url += (url.indexOf('?') < 0) ? "?" : "&";
		if (this.livePlayerShift_ == 0) {
			// auto delay
			url += p2p$.com.webp2p.core.common.String.format("abtimeshift={0}&cdernd={1}", this.liveAbTimeShift_, nowTime);
		} else if (url.indexOf("&timeshift=") < 0 && url.indexOf("?timeshift=") < 0) {
			// shift time not found, repair it
			url += p2p$.com.webp2p.core.common.String.format("timeshift={0}&cdernd={1}", this.livePlayerShift_, nowTime);
		} else {
			url += p2p$.com.webp2p.core.common.String.format("cdernd={0}", nowTime);
		}

		return url;
	},

	setUpdateLiveMetaTimeout_ : function(tag, timeoutMs) {
		var me = this;
		this.updateLiveTimer_ = setTimeout(function() {
			me.onUpdateLiveMetaTimeout_(tag);
		}, timeoutMs);
	},

	stopUpdateLiveMetaTimer_ : function() {
		if (this.updateLiveTimer_) {
			clearTimeout(this.updateLiveTimer_);
			this.updateLiveTimer_ = null;
		}
	},

	onHttpDownloadCompleted_ : function(downloader) {
		if (this._super(downloader)) {
			// handled by base channel
			return true;
		}

		var handled = false;

		if (!this.opened_ || (this.downloader_ != null && this.downloader_ != downloader)) {
			return handled;
		}

		if (downloader.tag_ == "live::meta") {
			handled = true;
			this.downloader_ = null;
			this.metaServerResponseCode_ = downloader.successed_ ? downloader.responseCode_ : -1;
			this.context_.metaServerIp_ = downloader.remoteEndpoint_;
			if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
				// failed
				this.onSchedule_(false);
				this.switchNextMetaSource_();
				return handled;
			}
			if (!this.parseUpdateMetaResponse_(downloader)) {
				this.switchNextMetaSource_();
				return handled;
			}
			this.metaReloadTimes_++;
			this.metaLoadTime_ = this.activeTime_;
		}

		return handled;
	},

	parseUpdateMetaResponse_ : function(downloader) {
		var metaChanged = false;
		var p2pGroupIdChanged = false;
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		var updateMeta = new p2p$.com.webp2p.core.supernode.MetaData();
		updateMeta.type_ = this.metaData_.type_;
		updateMeta.rangeParamsSupported_ = this.metaData_.rangeParamsSupported_;
		updateMeta.verifyMethod_ = this.metaData_.verifyMethod_;
		updateMeta.sourceUrl_ = this.updateMetaUrl_;
		updateMeta.finalUrl_ = downloader.fullUrl_;
		updateMeta.channelUrl_ = this.metaData_.channelUrl_;
		updateMeta.storageId_ = this.metaData_.storageId_;
		if (!updateMeta.load(downloader.responseData_, downloader.totalUsedTime_)) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::live::Channel Parse meta response failed, url({0}), channel({1}), size({2})"), downloader.fullUrl_, this.id_,
					this.downloader.responseData_.length);

			this.gslbServerResponseCode_ = 701; // content error
			this.onSchedule_(false);
			return false;
		}

		if (updateMeta.p2pGroupId_ != this.metaData_.p2pGroupId_) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("logic::live::Channel Meta p2p group id change from({0}) to({1}), reopen p2p protocols...", this.metaData_.p2pGroupId_,
					updateMeta.p2pGroupId_));

			if (this.lastProgramChangeTime_ <= 0) {
				this.lastProgramChangeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
				var retval = {
					newSegmentCount_ : 0,
					newSegments_ : []
				};
				retval = this.metaData_.combineSameGroup_(updateMeta);
				if (retval.newSegmentCount_ > 0) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("logic::live::Channel::Add2 ({0}) new meta segment({1}) to channel({2}), total {3} segment(s) now",
							retval.newSegmentCount_, retval.newSegments_.join(','), this.id_, this.metaData_.segments_.length));
				}
			}

			if (this.lastProgramChangeTime_ + (120 * 1000) > nowTime) {
				// check if all segments are completed
				var allSegmentsCompleted = true;
				for ( var k = 0; k < this.metaData_.segments_.length; k++) {
					var segment = this.metaData_.segments_[k];
					if (segment.id_ < this.urgentSegmentId_) {
						continue;
					}
					if (segment.completedTime_ <= 0) {
						allSegmentsCompleted = false;
						break;
					}
				}
				if (!allSegmentsCompleted) {
					// wait for next time
					this.onSchedule_(false);
					return true;
				}
			}

			metaChanged = true;
			p2pGroupIdChanged = true;
			this.metaData_.p2pGroupId_ = updateMeta.p2pGroupId_;
			this.metaData_.markAllSegmentP2pDisabled_();
			var retval = {
				newSegmentCount_ : 0,
				newSegments_ : []
			};
			retval = this.metaData_.combineWith_(updateMeta, false, true);
			if (retval.newSegmentCount_ <= 0) {
				// rebuild segment and piece indexes while all p2p segments disabled
				this.metaData_.buildIndexes_();
			}
			if (retval.newSegmentCount_ > 0) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("logic::live::Channel::Add3 ({0}) new meta segment({1}) to channel({2}), total {3} segment(s) now",
						retval.newSegmentCount_, retval.newSegments_.join(','), this.id_, this.metaData_.segments_.length));
			}
			// update self range cache
			this.fillSelfPieceRanges_(this.selfRangesMessage_);

		} else {
			// {newSegmentCount_:newSegmentCount,newSegments_:newSegments};
			var retval = this.metaData_.combineWith_(updateMeta, false, false);
			if (retval.newSegmentCount_ > 0) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("logic::live::Channel::Add4 ({0}) new meta segment({1}) to channel({2}), total {3} segment(s) now",
						retval.newSegmentCount_, retval.newSegments_.join(','), this.id_, this.metaData_.segments_.length));
				metaChanged = true;
			}
		}

		this.metaData_.updateTime_ = nowTime;
		if (metaChanged) {
			this.removeExpiredSegments_();
			this.updateMetaPieceShareInRanges_(true);
			// if( p2pGroupIdChanged ) metaData_.updateSegmentTimeGap_();
			// this.metaData_.updateSegmentTimeGap_();
			// this.metaData_.updateMetaCache_(this.getPseudoPlayTime_(nowTime), false);
			this.metaResponseBody_ = this.metaData_.localMetaContent_;
		}

		this.lastProgramChangeTime_ = 0;
		this.liveMaxSegmentStartTime_ = 0;
		for ( var k = 0; k < this.metaData_.segments_.length; k++) {
			var segment = this.metaData_.segments_[k];
			this.liveMaxSegmentStartTime_ = this.liveMaxSegmentStartTime_ > segment.startTime_ ? this.liveMaxSegmentStartTime_ : segment.startTime_;
		}

		if (p2pGroupIdChanged) {
			// this.otherPeers_.clear();
			// this.context_.resetPeerState_();
			// if( this.protocolPool_ != null ) this.protocolPool_.p2pGroupIdChange_();
		}

		this.onSchedule_(false);
		return true;
	},

	removeExpiredSegments_ : function() {
		var validDuration = 0;
		var validSegmentCount = 0;
		var endIndex = this.metaData_.segments_.length;
		for (; endIndex != -1; endIndex--) {
			if (endIndex == this.metaData_.segments_.length) {
				continue;
			}

			var segment = this.metaData_.segments_[endIndex];
			validDuration += segment.duration_;
			validSegmentCount++;
			if (validDuration >= (this.livePlayMaxTimeLength_) * 1000) {
				break;
			}
		}
		if (endIndex > 0) {
			var expiredSegmentCount = this.metaData_.segments_.length - validSegmentCount;
			var expiredSegmentNames = "";
			var bucket = this.getStorageBucket_();
			for ( var n = 0; n < endIndex; n++) {
				var segment = this.metaData_.segments_[n];
				var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
				if (n == endIndex - 1) {
					expiredSegmentNames += segment.id_;
				} else {
					expiredSegmentNames += (segment.id_ + ",");
				}
				bucket.remove(objectId);
			}
			for ( var n = 0; n < endIndex; n++) {
				var segment = this.metaData_.segments_[n];
				this.metaData_.p2pPieceCount_ -= segment.pieces_.length;
			}
			this.metaData_.segments_.splice(0, endIndex);
			P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::live::Channel Remove {0} ({1}) expired meta segment(s) from channel({2}), total {3} segment(s) now",
					expiredSegmentCount, expiredSegmentNames, this.id_, this.metaData_.segments_.length));
			//
			if (expiredSegmentCount > 0) {
				this.fillSelfPieceRanges_(this.selfRangesMessage_);
				this.metaData_.buildIndexes_();
			}
		}
	},

	downloadMeta_ : function() {
		// gslb responsed
		// if( gslbServerErrorCode_ >= 0 && gslbServerErrorCode_ < 300 )
		// {
		// manager_.addPlayedHistoryKey(playerHistoryKey_);
		// }

		var gslbData = this.context_.gslbData_;
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		if (this.gslbReloadTimes_ <= 0) {
			this.liveMaxSegmentStartTime_ = 0;

			// switch to livesftime from gslb server
			this.liveTimeShift_ = gslbData["livesftime"];
			if (this.liveTimeShift_ >= 0) {
				// use gslb configure, max 180 seconds (livePlayMaxTimeLength_ - 20)
				this.livePlayOffset_ = this.liveTimeShift_ > (this.livePlayMaxTimeLength_ - 20) ? (this.livePlayMaxTimeLength_ - 20) : this.liveTimeShift_;
			}
			this.livePlayMaxTimeLength_ = (this.livePlayOffset_ > 30 ? this.livePlayOffset_ : 30) + 60;
			this.liveCurrentTime_ = gslbData["curtime"];
			this.liveStartTime_ = gslbData["starttime"];
			this.liveNowPlayOffset_ = this.livePlayOffset_;

			if (this.livePlayerShift_ != 0) {
				this.liveCurrentTime_ += (this.livePlayerShift_ + this.livePlayOffset_);
			}

			P2P_ULOG_INFO(P2P_ULOG_FMT(
					"logic::live::Channel::Detect channel({0}), time shift({1} sec), gslb reload({2} sec), current time({3}), start time({4})", this.id_,
					this.liveTimeShift_, this.gslbReloadInterval_ / 1000, p2p$.com.webp2p.core.common.String.formatTime_(this.liveCurrentTime_),
					p2p$.com.webp2p.core.common.String.formatTime_(this.liveStartTime_)));

			// switch to livesftime from gslb server
			this.liveCurrentTime_ += 10;
			this.liveAbTimeShift_ = this.liveCurrentTime_ - this.liveNowPlayOffset_ - 10;
			this.liveMetaLoadTime_ = nowTime;
			this.liveMetaUpdateTime_ = nowTime;
		}

		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (this.downloader_ != null) {
			this.downloader_.log("cancel");
			this.downloader_.close();
			this.downloader_ = null;
		}

		var metaUrl = this.getNowRequestMetaUrl_(nowTime);
		this.downloader_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(metaUrl, this, "GET", "", "base::meta");
		this.downloader_.load();
		// set meta timer
		this.setMetaTimeout_(8 * 1000);
	},

	onSchedule_ : function(shareMode) {
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (this.paused_) {
			// skip schedule
			return;
		}

		// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::live::Channel", "Schedule %s for channel(%s) ..."), shareMode ? "share only" : "multi mode", id_.c_str());
		P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::live::Channel::Schedule urgent segment index:{0}, id :{1},", this.urgentSegmentIndex_, this.urgentSegmentId_));
		this.lastScheduleTime_ = nowTime;
		this.updatePeersSpeed_(nowTime, this.stablePeers_);

		// check pieces to download
		var totalDuration = 0;
		var maxDuration = this.context_.p2pUrgentSize_ * 1000;
		this.urgentSegmentIndex_ = -1;
		for ( var n = 0; (this.urgentSegmentId_ >= 0) && (n < this.metaData_.segments_.length); n++) {
			var segment = this.metaData_.segments_[n];

			if (segment.id_ == this.urgentSegmentId_) {
				// find urgent segment index
				this.urgentSegmentIndex_ = n;
				this.context_.playingPosition_ = segment.startTime_ / 1000;
			}

			if (n >= this.urgentSegmentIndex_) {
				if (totalDuration < maxDuration || this.urgentSegmentEndId_ <= this.urgentSegmentId_) {
					// urgent should has 2 segments at least if more segments eixst
					this.urgentSegmentEndId_ = segment.id_;
				}
				totalDuration += segment.duration_;
			}
		}

		if (this.urgentSegmentIndex_ < 0 && this.metaData_.segments_.length > 0) {
			this.urgentSegmentIndex_ = 0;
		}

		this.updateUrgentIncompleteCount_();
		if (!shareMode) {
			this.checkTimeoutPieces_(nowTime);
			this.checkTimeoutPeers_(nowTime);
			this.checkPeerPieceRanges_(nowTime);

			this.lastPeerSortTime_ = nowTime;
			this.stablePeers_.sort(function(item1, item2) {
				if (item1.lastReceiveSpeed_ == item2.lastReceiveSpeed_) {
					return item1.lastTimeoutTime_ - item2.lastTimeoutTime_;
				}
				return item2.lastReceiveSpeed_ - item1.lastReceiveSpeed_;
			});
			this.otherPeers_.sort(function(item1, item2) {
				if (item1.lastReceiveSpeed_ == item2.lastReceiveSpeed_) {
					return item1.lastTimeoutTime_ - item2.lastTimeoutTime_;
				}
				return item2.lastReceiveSpeed_ - item1.lastReceiveSpeed_;
			});
			this.statData_.addReceiveData_(true, p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn, 0, 0); // flush speed
			// updateStatSyncSpeeds_();
		}

		this.metaData_.urgentSegmentId_ = this.urgentSegmentId_;
		if (this.urgentSegmentIndex_ < 0) {
			// all segments completed
			return;
		}

		// urgent area stable peers first
		var stableDispatchPiece = 0;
		if (!shareMode && this.stablePeers_.length > 0) {
			stableDispatchPiece = this.dispatchStablePeers_(this.urgentSegmentIndex_);
		}

		// p2p area try other peers, sort by last receive speed
		// if( manager_.getEnviroment_().p2pEnabled_ )
		// if( urgentIncompleteCount_ <= 0 )
		{
			this.otherPeerRequestCount_ = this.dispatchOtherPeers_(this.urgentSegmentIndex_);
		}

		// active cdn fetch area
		var fetchPieces = 0;
		if (!shareMode && (this.urgentSegmentIndex_ >= 0) && this.manager_.getEnviroment_().p2pEnabled_ && this.urgentIncompleteCount_ <= 0
				&& this.otherPeers_.length > 0) {
			fetchPieces = this.dispatchFetchRate_(this.urgentSegmentIndex_);
		}

		// updateStatDownloadedDuration();

		P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::live::Channel::Schedule {0} stable pieces ...", stableDispatchPiece));
	},
	dispatchFetchRate_ : function(startSegmentIndex) {
		if (this.stablePeers_.length == 0 || this.metaData_.segments_.length == 0) {
			return 0;
		}

		// active cdn fetch area
		var fetchPieceCount = 0;
		var idlePieceCount = 0;
		// var maxRatioFetchCount = 1;
		var maxFetchNumber = this.context_.p2pFetchRate_ * 100;
		var startFetchId = this.lastFetchEndSegmentId_;
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		var usedSegmentCount = 0;
		var usedOffsetBytes = 0;
		var maxOffsetBytes = (this.getStorageBucket_().getDataCapacity_()) * 2 / 3;

		var message = new p2p$.com.webp2p.protocol.base.Message();
		var peer = this.getNextIdleStablePeer_();
		for ( var n = startSegmentIndex; n < this.metaData_.segments_.length && peer; n++) {
			var segment = this.metaData_.segments_[n];
			if (this.urgentIncompleteCount_ > 0 && this.urgentSegmentEndId_ >= 0 && segment.id_ >= this.urgentSegmentEndId_) {
				// urgent incompleted
				break;
			}

			usedSegmentCount++;
			if (segment.size_ > 0) {
				// to avoid too many bytes
				usedOffsetBytes += segment.size_;
				if (usedOffsetBytes > maxOffsetBytes) {
					break;
				}
			} else if (usedSegmentCount > 10) {
				// to avoid too many segments
				break;
			}

			this.lastFetchEndSegmentId_ = segment.id_;
			if (segment.id_ <= startFetchId) {
				continue;
			} else if (segment.completedTime_ > 0) {
				continue;
			}

			var previousTn = false;
			var previousHit = false;
			for ( var k = 0; k < segment.pieces_.length && peer; k++) {
				var piece = segment.pieces_[k];
				if (piece.completedTime_ > 0 || piece.receiveStartTime_ > 0 || piece.shareInRanges_ > 0 || piece.size_ <= 0) {
					// completed or receiving or exits other peer
					previousHit = false;
					continue;
				}

				if (piece.randomNumber_ >= maxFetchNumber) {
					if (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) {
						if (k + 1 >= segment.pieces_.length) {
							continue;
						}
						var next = segment.pieces_[k + 1];
						if (next.completedTime_ > 0 || next.receiveStartTime_ > 0 || next.shareInRanges_ > 0) {
							continue;
						} else if (next.randomNumber_ >= maxFetchNumber) {
							continue;
						}
					} else if (!previousHit || !previousTn) {
						continue;
					}
				}

				var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
				requestItem.segmentId_ = segment.id_;
				requestItem.pieceType_ = piece.type_;
				requestItem.pieceId_ = piece.id_;
				requestItem.checksum_ = piece.checksum_;
				message.requests_.push(requestItem);
				piece.receiveByStable_ = true;
				piece.receiveStartTime_ = nowTime;
				piece.receiveSessionId_ = peer.sessionId_;
				if (segment.startReceiveTime_ <= 0) {
					segment.startReceiveTime_ = nowTime;
				}
				fetchPieceCount++;
				previousTn = (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn);
				previousHit = true;
			}
			if (message.requests_.length > 0) {
				if (peer.pendingRequestCount_ <= 0) {
					peer.lastSegmentId_ = segment.id_;
				}
				peer.pendingRequestCount_ += message.requests_.length;
				peer.statSendMessage_(message);
				peer.session_.send(message);
				message.requests_ = [];
				peer = this.getNextIdleStablePeer_();
			}
		}

		P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::live::Channel Random fetch, start index ({0}), total ({1}) idle pieces, fetched ({2}) fetch rate({3})",
				startFetchId, idlePieceCount, fetchPieceCount, this.context_.p2pFetchRate_ * 100));

		return fetchPieceCount;
	},
	dispatchStablePeers_ : function(startSegmentIndex) {
		if (this.stablePeers_.length == 0 || this.metaData_.segments_.length == 0) {
			return 0;
		}

		// urgent area stable peers first
		var totalDuration = 0;
		var stableDispatchPiece = 0;
		// var allPeersBusy = false;
		var busyPieceCount = 0;
		var appendDuration = 0;
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		var maxDuration = this.getUrgentMaxDuration_(this.manager_.getEnviroment_().isMobileNetwork_() ? 1000 : 1500); // 1.5 ratio for p2p
		var message = new p2p$.com.webp2p.protocol.base.Message();

		var peer = this.getNextIdleStablePeer_();
		for ( var n = startSegmentIndex;
		// n < endSegmentIndex && n < metaData_.segments_.size() && eachStablePiece > 0 && stableIterator != stablePeers_.end() && totalDuration <
		// maxDuration;
		n < this.metaData_.segments_.length && totalDuration < maxDuration; n++) {
			var segment = this.metaData_.segments_[n];
			this.lastFetchEndSegmentId_ = Math.max(this.lastFetchEndSegmentId_, segment.id_);
			totalDuration += segment.duration_;
			// if( segment.lastPlayTime_ > 0 ) continue;
			if (segment.completedTime_ > 0) {
				continue;
			}

			for ( var k = 0; k < segment.pieces_.length && peer != null && busyPieceCount <= 0; k++) {
				var piece = segment.pieces_[k];
				if (piece.completedTime_ > 0) {
					if (message.requests_.length > 0) {
						// if message.requests_.length > 0
						// Keep downloadrange Continuous
						// break
						break;
					} else {
						// already complete
						// continue;
						continue;
					}
				} else if (piece.receiveStartTime_ > 0) {
					// duplicate receiving
					var pieceTimeout = ((piece.size_ > 0) ? (this.context_.p2pUrgentSize_ / 2) : this.context_.p2pUrgentSize_) * 1000;
					if (piece.receiveByStable_ && (piece.receiveStartTime_ + pieceTimeout > nowTime)) {
						// receving by stable cdn peer
						busyPieceCount++;
						continue;
					}
				}

				if (segment.size_ > 0 && segment.duration_ > 0) {
					appendDuration += piece.size_ / segment.size_ * segment.duration_ * 1000.0;
				}

				var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
				requestItem.urgent_ = true;
				requestItem.segmentId_ = segment.id_;
				requestItem.pieceType_ = piece.type_;
				requestItem.pieceId_ = piece.id_;
				requestItem.checksum_ = piece.checksum_;
				message.requests_.push(requestItem);
				piece.receiveByStable_ = true;
				piece.receiveStartTime_ = nowTime + appendDuration;
				piece.receiveSessionId_ = peer.sessionId_;
				if (segment.startReceiveTime_ <= 0) {
					segment.startReceiveTime_ = nowTime;
				}

				stableDispatchPiece++;
				if (message.requests_.length >= 50) {
					if (peer.pendingRequestCount_ <= 0) {
						peer.lastSegmentId_ = segment.id_;
					}
					peer.activeTime_ = nowTime;
					peer.pendingRequestCount_ += message.requests_.length;
					peer.statSendMessage_(message);
					peer.session_.send(message);
					message.requests_ = [];
					appendDuration = 0;
					peer = null;
					break;
				}
			}
			if (message.requests_.length > 0 && peer != null) {
				if (peer.pendingRequestCount_ <= 0) {
					peer.lastSegmentId_ = segment.id_;
				}
				peer.activeTime_ = nowTime;
				peer.pendingRequestCount_ += message.requests_.length;
				peer.statSendMessage_(message);
				peer.session_.send(message);
				message.requests_ = [];
				appendDuration = 0;
				peer = null;
			}
		}

		return stableDispatchPiece;
	},

	dispatchOtherPeers_ : function(startSegmentIndex) {
		if (this.otherPeers_.length == 0 || this.metaData_.segments_.length == 0) {
			return 0;
		}

		// p2p area try other peers, sort by last receive speed
		var stableTooSlow = false;
		var requestCount = this.getOtherPeerRequestCount_();
		var maxCount = this.urgentIncompleteCount_ > 0 ? this.context_.p2pMaxUrgentRequestPieces_ : this.context_.p2pMaxParallelRequestPieces_;
		var bucket = this.getStorageBucket_();
		var offsetIndex = -1;
		var usedSegmentCount = 0;
		var usedOffsetBytes = 0;
		var maxOffsetBytes = bucket.getDataCapacity_() * 2 / 3;

		// forward offset
		if (startSegmentIndex >= 0) {
			// var startIndex = startSegmentIndex;
			var totalDuration = 0;
			var maxDuration = this.getUrgentMaxDuration_(this.manager_.getEnviroment_().isMobileNetwork_() ? 1500 : 2000); // 2 ratio of urgent size
			stableTooSlow = this.getStablePeersSpeedTooSlow_();
			for ( var n = startSegmentIndex; requestCount < maxCount && n < this.metaData_.segments_.length; n++) {
				var segment = this.metaData_.segments_[n];
				totalDuration += segment.duration_;
				usedSegmentCount++;
				if (segment.size_ > 0) {
					// to avoid too many bytes
					usedOffsetBytes += segment.size_;
					if (usedOffsetBytes > maxOffsetBytes || (usedSegmentCount + 5) > bucket.getMaxOpenBlocks_()) {
						break;
					}
				} else if (usedSegmentCount > 10) {
					// to avoid too many segments
					break;
				}

				if (segment.p2pDisabled_) {
					continue;
				}
				if (totalDuration <= maxDuration && !stableTooSlow && this.urgentSegmentIndex_ >= 0) {
					continue;
				}
				if (offsetIndex < 0) {
					offsetIndex = n;
				}
				requestCount = this.dispatchSegmentForOtherPeers_(stableTooSlow, requestCount, maxCount, segment);
				if (this.urgentIncompleteCount_ > 0 && this.urgentSegmentEndId_ >= 0 && segment.id_ >= this.urgentSegmentEndId_) {
					// urgent incompleted
					break;
				}
			}
		}
		if (offsetIndex < 0) {
			offsetIndex = this.metaData_.segments_.length - 1;
		}
		// backward check
		for ( var n = offsetIndex; requestCount < maxCount && n >= 0 && n >= startSegmentIndex; n--) {
			var segment = this.metaData_.segments_[n];
			if (segment.p2pDisabled_ || segment.completedTime_ > 0) {
				continue;
			}
			requestCount += this.dispatchSegmentForOtherPeers_(stableTooSlow, requestCount, maxCount, segment);
		}
		return requestCount;
	},

	dispatchSegmentForOtherPeers_ : function(stableTooSlow, requestCount, maxCount, segment) {
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		for ( var k = 0; requestCount < maxCount && k < segment.pieces_.length; k++) {
			var piece = segment.pieces_[k];
			if (piece.completedTime_ > 0 || piece.size_ <= 0) {
				// completed
				continue;
			} else if (piece.receiveStartTime_ > 0) // || k == 4 ) // test only
			{
				// duplicate receiving
				var pieceTimeout = ((piece.size_ > 0) ? (this.context_.p2pUrgentSize_ / 2) : this.context_.p2pUrgentSize_) * 1000;
				if (piece.receiveStartTime_ + pieceTimeout > nowTime) {
					if (!piece.receiveByStable_ || !stableTooSlow) {
						// not expired
						continue;
					}
				}
			}

			var peer = this.getNextIdleOtherPeer_(piece.type_, piece.id_);

			if (peer == null) {
				// no idle peer has this piece
				continue;
			}

			var message = new p2p$.com.webp2p.protocol.base.Message();
			var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
			requestItem.segmentId_ = segment.id_;
			requestItem.pieceType_ = piece.type_;
			requestItem.pieceId_ = piece.id_;
			requestItem.checksum_ = piece.checksum_;
			message.requests_.push(requestItem);
			piece.receiveByOther_ = true;
			piece.receiveSessionId_ = peer.sessionId_;
			piece.receiveStartTime_ = nowTime;
			peer.activeTime_ = nowTime;
			peer.lastSegmentId_ = segment.id_;
			peer.receivePiece_ = piece;
			peer.statSendMessage_(message);
			peer.statReceiveBegin_();
			peer.session_.send(message);
			requestCount++;

			// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::vod::Channel::dispatchSegmentForOtherPeer"));
		}

		return requestCount;
	},

	getAllStatus_2_ : function(params, result) {
		this._super(params, result);
		result["liveStreamId"] = this.liveStreamId_;
		// result["liveStartTime"] = this.liveStartTime_;
		// result["liveCurrentTime"] = this.liveCurrentTime_;
		// result["livePlayerShift"] = this.livePlayerShift_;
		// result["liveAbTimeShift"] = this.liveAbTimeShift_;
		// result["livePseudoPlayTime"] = this.getPseudoPlayTime_(nowTime);
		// result["liveNowPlayOffset"] = this.liveNowPlayOffset_;
		// result["livePlayOffset"] = this.livePlayOffset_;
		// result["livePlayMaxTimeLength"] = this.livePlayMaxTimeLength_;
		// result["liveMetaRefreshInterval"] = this.liveMetaRefreshInterval_;
		// result["liveSkipSegmentTime"] = this.liveSkipSegmentTime_;
	},

	getPseudoPlayTime_ : function(nowTime) {
		var liveSkipTime = Math.floor(this.liveSkipSegmentTime_ / 1000);
		this.liveSkipTime = Math.max(Math.min(liveSkipTime, 60), 0);
		var playFlushGap = 0;
		var pseudoTime = this.liveCurrentTime_ + (nowTime - this.liveMetaLoadTime_) / 1000;
		return pseudoTime - this.livePlayOffset_ + this.context_.specialPlayerTimeOffset_ + playFlushGap + liveSkipTime; // +
		// (time_t)(metaData_.totalGapDuration_ / 1000);
	},

	updateUrgentSegment_ : function(requireId) {
		this._super(requireId);
		if ( /* fromPlayer && */requireId >= 0 && !this.liveFirstUrgentUpdated_) {
			this.liveFirstUrgentUpdated_ = true;
			this.liveSkipSegmentTime_ = 0;
			for ( var n = 0; n < this.metaData_.segments_.length; n++) {
				var segment = this.metaData_.segments_[n];
				if (segment.id_ >= requireId) {
					break;
				}
				if (segment.duration_ > 0) {
					this.liveSkipSegmentTime_ += segment.duration_;
				}
			}
		}
	}
});