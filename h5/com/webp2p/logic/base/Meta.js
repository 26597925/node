p2p$.ns('com.webp2p.logic.base');
p2p$.com.webp2p.logic.base.Meta = JClass.extend_({
    tag_: "com::webp2p::logic::base::Meta",
    activeTime_:0,
    scope_:null,
    channelType_:"vod",
    metaLoadTime_ : 0,
    metaUseTime_ : 0,
    metaReloadTimes_ : 0,
    metaResponsed_ : false,
    metaServerResponseCode_ : 0,
    metaCompleteReported_ : false,

    liveMetaRefreshInterval_ : 0,//直播刷新时间
    liveMaxSegmentStartTime_ : 0,
    livePlayOffset_ : 0,
    livePlayMaxTimeLength_ : 0,
    liveMetaTryTimeoutTimes_ : 0,
    liveTimeShift_ : 0,
    livePlayerShift_ : 0,
    liveCurrentTime_ : 0,
    liveStartTime_ : 0,
    liveAbTimeShift_ : 0,
    liveNowPlayOffset_ : 0,
    liveMetaLoadTime_ : 0,
    liveMetaUpdateTime_ : 0,
    updateLiveTimer_:null,
    lastProgramChangeTime_ : 0,

    timer_:null,
    nodelist_:null,
    sourceMetaUrl_:"",
    updateMetaUrl_ : "",
    config_:null,
    global_:null,
    strings_:null,
    loaders_:[],
    init:function(scope,type)
    {
        this.config_ = p2p$.com.selector.Config;
        this.global_ = p2p$.com.common.Global;
        this.strings_ = p2p$.com.common.String;
        this.scope_=scope;
        this.channelType_ = type;
        this.liveMetaRefreshInterval_ = 5000; // ms
        this.lastProgramChangeTime_ = 0;
        this.livePlayOffset_ = 120; // seconds
        this.livePlayMaxTimeLength_ = 200; // 200 seconds
        this.liveMetaTryTimeoutTimes_ = 0;
        this.liveTimeShift_ = -1;
        this.livePlayerShift_ = 0;
        this.liveCurrentTime_ = 0;
        this.liveStartTime_ = 0;
        this.liveAbTimeShift_ = 0;
        this.liveNowPlayOffset_ = 0;
        this.liveMetaLoadTime_ = 0;
        this.liveMetaUpdateTime_ = 0;
        this.liveMaxSegmentStartTime_ = 0;
        this.updateLiveTimer_ = null;
        this.sourceMetaUrl_="";
    },
    load_:function(nodelist)
    {
        if(nodelist != null){
            this.nodelist_ = nodelist;
        }
        var gslbEncryptUrl_;
        switch(this.channelType_){
            case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive:
                this.setUpdateLiveMetaTimeout_(p2p$.com.webp2p.logic.live.ChannelStatic.kTimerTagMetaUpdate, this.liveMetaRefreshInterval_);
                gslbEncryptUrl_ = this.getNowRequestMetaUrl_();
                this.openLoader_({url_:gslbEncryptUrl_, scope_:this, tag_:"live::meta_"});
            case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod:
                if(this.metaLoadTime_<=0){
                    this.metaLoadTime_ = this.global_.getMilliTime_();
                }
                for(var i=0;i<this.nodelist_.length&&i<this.config_.maxMetaNum;i++)
                {
                    gslbEncryptUrl_ = this.nodelist_[i]["location"];
                    this.openLoader_({url_:gslbEncryptUrl_, scope_:this, tag_:"base::meta_"+i});
                }
                var timeoutMs = 10 * 1000;
                this.setTimeout_(timeoutMs);
        }
    },
    setLiveParams_:function()
    {
        var gslbData = this.scope_.context_.gslbData_;
        var nowTime = this.global_.getMilliTime_();
        this.liveMaxSegmentStartTime_ = 0;
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
        this.liveCurrentTime_ += 10;
        this.liveAbTimeShift_ = this.liveCurrentTime_ - this.liveNowPlayOffset_ - 10;
        this.liveMetaLoadTime_ = nowTime;
        this.liveMetaUpdateTime_ = nowTime;
        this.activeTime_ = this.global_.getMilliTime_();
        P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Detect channel({1}), time shift({2} sec), gslb reload({3} sec), current time({4}), start time({5})",this.tag_,this.id_,this.liveTimeShift_, this.gslbReloadInterval_ / 1000, p2p$.com.common.String.formatTime_(this.liveCurrentTime_),p2p$.com.common.String.formatTime_(this.liveStartTime_)));
    },

    openLoader_:function(params)
    {
        var downloader = new p2p$.com.loaders.HttpDownLoader(params);
        downloader.load_();
        this.loaders_.push(downloader);
    },
    onHttpDownloadCompleted_:function(downloader)
    {
        if(downloader.tag_ == "live::meta_"){
            this.onLiveMetaComplete_(downloader);
            return;
        }
        var tag_= downloader.tag_.split("_")[1];
        if (downloader.successed_) {//加载成功,关闭其他m3u8的加载
            P2P_ULOG_INFO(P2P_ULOG_FMT("{0} close other loaders",this.tag_));
            //通知meta加载完毕
            this.onMetaCompleted_(downloader);
            var loader_,index_=-1;
            for(var i=0;i<this.loaders_.length;i++) {
                loader_ = this.loaders_[i];
                index_ = loader_.tag_.split("_")[1];
                if (tag_ != index_) {
                    loader_.close();
                }
            }
        }
    },
    onLiveMetaComplete_:function(downloader)
    {
        this.metaServerResponseCode_ = downloader.successed_ ? downloader.responseCode_ : -1;
        this.scope_.context_.metaServerIp_ = downloader.remoteEndpoint_;
        if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
                // failed
            this.scope_.onSchedule_(false);
            this.switchNextMetaSource_();
            return;
        }
        if (!this.parseUpdateMetaResponse_(downloader)) {
            this.switchNextMetaSource_();
            return;
        }
        this.metaReloadTimes_++;
        this.activeTime_ = this.global_.getMilliTime_();
        this.metaUseTime_ = this.activeTime_-this.metaLoadTime_;
    },
    onMetaCompleted_:function(downloader)
    {
        P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onMetaComplete_",this.tag_));
        var handled = true;
        this.activeTime_ = this.global_.getMilliTime_();
        this.metaServerResponseCode_ = downloader.successed_ ? downloader.responseCode_ : -1;
        // stop timer
        this.stopTimer_();
        this.scope_.metaData_.finalUrl_ = downloader.url_;
        this.scope_.metaData_.lastReceiveSpeed_ = downloader.transferedSpeed_;
        if (!this.parseMetaResponse_(downloader)) {
            this.scope_.onMetaComplete_(20601, "Meta Response Failed", "");
            return;
        }
        this.metaReloadTimes_++;
        this.metaUseTime_ = this.activeTime_-this.metaLoadTime_;
        this.scope_.context_.videoFormat_ = this.scope_.metaData_.p2pGroupId_ == "" ? "m3u8" : "lm3u8";
        if (this.scope_.metaData_.p2pGroupId_ == "") {
            // standard hls redirect
            this.onMetaCompleteCode_ = 302;
            this.scope_.onMetaComplete_(302, "Moved", this.scope_.metaData_.sourceUrl_);
            return;
        }
        if (!this.metaCompleteReported_) {
            this.metaCompleteReported_ = true;
        }
        this.scope_.onMetaComplete_(200, "OK", this.scope_.metaData_.getLocalMetaContent_());
    },
    parseMetaResponse_ : function(downloader) {
        var metaTypeName = p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.scope_.type_);
        if (!this.scope_.metaData_.load(downloader.responseData_, downloader.totalUsedTime_, true)) {
            P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}]Parse hls meta response failed, url({2}), channel({3}), size({4})",this.tag_,metaTypeName,downloader.url_,this.id_,downloader.responseData_.length));
            return false;
        }
        return true;
    },
    parseUpdateMetaResponse_ : function(downloader) {
        var metaChanged = false;
        var p2pGroupIdChanged = false;
        var nowTime = this.global_.getMilliTime_();
        var updateMeta = new p2p$.com.webp2p.core.supernode.MetaData();
        updateMeta.type_ = this.scope_.metaData_.type_;
        updateMeta.rangeParamsSupported_ = this.scope_.metaData_.rangeParamsSupported_;
        updateMeta.verifyMethod_ = this.scope_.metaData_.verifyMethod_;
        updateMeta.sourceUrl_ = downloader.url_;
        updateMeta.finalUrl_ = downloader.url_;
        updateMeta.channelUrl_ = this.scope_.metaData_.channelUrl_;
        updateMeta.storageId_ = this.scope_.metaData_.storageId_;
        if (!updateMeta.load(downloader.responseData_, downloader.totalUsedTime_)) {
            P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::parseUpdateMetaResponse_ Parse meta response failed, url({1}), channel({2}), size({3})"),this.tag_,downloader.url_,this.id_,this.downloader_.responseData_.length);
            this.metaServerResponseCode_ = 701; // content error
            this.scope_.onSchedule_(false);
            return false;
        }

        if (updateMeta.p2pGroupId_ != this.scope_.metaData_.p2pGroupId_) {//gid发生变化
            P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::parseUpdateMetaResponse_ Meta group id change from({1}) to({2}), reopen p2p protocols...",this.tag_,this.scope_.metaData_.p2pGroupId_,updateMeta.p2pGroupId_));
            if (this.lastProgramChangeTime_ <= 0) {
                this.lastProgramChangeTime_ = this.global_.getMilliTime_();
                var retval = {
                    newSegmentCount_ : 0,
                    newSegments_ : []
                };
                retval = this.scope_.metaData_.combineSameGroup_(updateMeta);
                if (retval.newSegmentCount_ > 0) {
                    P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add2 ({1}) new meta segment({2}) to channel({3}), total {4} segment(s) now",this.tag_,retval.newSegmentCount_, retval.newSegments_.join(','), this.scope_.id_, this.scope_.metaData_.segments_.length));
                }
            }
            if (this.lastProgramChangeTime_ + (120 * 1000) > nowTime) {
                // check if all segments are completed
                var allSegmentsCompleted = true;
                for ( var k = 0; k < this.scope_.metaData_.segments_.length; k++) {
                    var segment = this.scope_.metaData_.segments_[k];
                    if (segment.id_ < this.scope_.urgentSegmentId_) {
                        continue;
                    }
                    if (segment.completedTime_ <= 0) {
                        allSegmentsCompleted = false;
                        break;
                    }
                }
                if (!allSegmentsCompleted) {
                    // wait for next time
                    this.scope_.onSchedule_(false);
                    return true;
                }
            }
            metaChanged = true;
            p2pGroupIdChanged = true;
            this.scope_.metaData_.p2pGroupId_ = updateMeta.p2pGroupId_;
            this.scope_.metaData_.markAllSegmentP2pDisabled_();
            var retval = {
                newSegmentCount_ : 0,
                newSegments_ : []
            };
            retval = this.scope_.metaData_.combineWith_(updateMeta, false, true);
            if (retval.newSegmentCount_ <= 0) {
                // rebuild segment and piece indexes while all p2p segments disabled
                this.scope_.metaData_.buildIndexes_();
            }
            if (retval.newSegmentCount_ > 0) {
                P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add3 ({1}) new meta segment({2}) to channel({3}), total {4} segment(s) now",this.tag_,retval.newSegmentCount_, retval.newSegments_.join(','), this.scope_.id_, this.scope_.metaData_.segments_.length));
            }
            // update self range cache
            this.scope_.fillSelfPieceRanges_(this.scope_.selfRangesMessage_);

        } else {
            // {newSegmentCount_:newSegmentCount,newSegments_:newSegments};
            var retval = this.scope_.metaData_.combineWith_(updateMeta, false, false);
            if (retval.newSegmentCount_ > 0) {
                P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add4 ({1}) new meta segment({2}) to channel({3}), total {4} segment(s) now",this.tag_,retval.newSegmentCount_, retval.newSegments_.join(','), this.scope_.id_, this.scope_.metaData_.segments_.length));
                metaChanged = true;
            }
        }

        this.scope_.metaData_.updateTime_ = nowTime;
        if (metaChanged) {
            this.scope_.removeExpiredSegments_();
            this.scope_.updateMetaPieceShareInRanges_(true);
            this.scope_.metaResponseBody_ = this.scope_.metaData_.localMetaContent_;
        }

        this.lastProgramChangeTime_ = 0;
        this.liveMaxSegmentStartTime_ = 0;
        for ( var k = 0; k < this.scope_.metaData_.segments_.length; k++) {
            var segment = this.scope_.metaData_.segments_[k];
            this.liveMaxSegmentStartTime_ = this.liveMaxSegmentStartTime_ > segment.startTime_ ? this.liveMaxSegmentStartTime_ : segment.startTime_;
        }
        this.scope_.onSchedule_(false);
        return true;
    },
    switchNextMetaSource_ : function() {
        this.liveMetaTryTimeoutTimes_++;
        var bak = this.sourceMetaUrl_;
        var allMetaNodes = this.nodelist_;
        for ( var n = 0; n < allMetaNodes.length; n++) {
            var metaItem = allMetaNodes[(n + this.liveMetaTryTimeoutTimes_) % allMetaNodes.length];
            var locationUrl = metaItem["location"];
            if (!(locationUrl == "") && locationUrl != this.scope_.metaData_.sourceUrl_) {
                this.sourceMetaUrl_ = locationUrl;
                break;
            }
        }

        var url = new p2p$.com.common.Url();
        url.fromString_(this.sourceMetaUrl_);
        this.scope_.context_.metaServerIp_ = this.strings_.format("{0}:{1}", url.host_, (url.port_) == 0 ? 80 : url.port_);
        P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::switchNextMetaSource_ [{1}]Meta timeout/error for url({2}), channel({3}), {4} try times, switch next source({4})...",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), bak, this.scope_.id_, this.liveMetaTryTimeoutTimes_, this.sourceMetaUrl_));
    },
    updateMeta_ : function() {
        var nowTime = this.global_.getMilliTime_();
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
        this.load_();
    },
    setTimeout_:function(timeoutMs)
    {
        var me = this;
        this.timer_ = setTimeout(function() {
            me.onMetaTimeout_();
        }, timeoutMs);
    },
    onMetaTimeout_:function()
    {
        this.close_();
        this.scope_.onMetaComplete_(20600, "Meta Request Failed", "");
    },
    stopTimer_:function()
    {
        if (this.timer_) {
            clearTimeout(this.timer_);
            this.timer_ = null;
        }
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
    onUpdateLiveMetaTimeout_ : function(tag) {
        switch (tag) {
            case p2p$.com.webp2p.logic.live.ChannelStatic.kTimerTagMetaUpdate:
                this.close_();
                this.switchNextMetaSource_();
                this.updateMeta_();
                break;
            default:
                break;
        }
    },
    getNowRequestMetaUrl_ : function() {
        var url = this.sourceMetaUrl_ == "" ? this.scope_.metaData_.sourceUrl_ : this.sourceMetaUrl_;
        var time = this.global_.getMilliTime_();
        url += (url.indexOf('?') < 0) ? "?" : "&";
        if (this.livePlayerShift_ == 0) {
            // auto delay
            url += p2p$.com.common.String.format("abtimeshift={0}&cdernd={1}", this.liveAbTimeShift_, time);
        } else if (url.indexOf("&timeshift=") < 0 && url.indexOf("?timeshift=") < 0) {
            // shift time not found, repair it
            url += p2p$.com.common.String.format("timeshift={0}&cdernd={1}", this.livePlayerShift_, time);
        } else {
            url += p2p$.com.common.String.format("cdernd={0}", time);
        }

        return url;
    },
    close_:function()
    {
        for(var i=0;i<this.loaders_.length;i++)
        {
            loader_ = this.loaders_[i];
            loader_.close();
        }
        this.loaders_=[];
        this.stopUpdateLiveMetaTimer_();
        this.stopTimer_();
    }
});
