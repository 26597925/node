/**
 * Created by chenzhaofei on 2017/5/19.
 */
p2p$.ns('com.webp2p.logic.base');
p2p$.com.webp2p.logic.base.Gslb = JClass.extend_({
    tag_:"com::webp2p::logic::base::Gslb",
    gslbTryTimes_ : 0,
    gslbServerResponseCode_ : 0,
    gslbServerErrorCode_ : 0,
    gslbServerErrorDetails_ : "",
    gslbReloadInterval_ : 0,
    gslbLoadTime_ : 0,
    gslbConsumedTime_ : 0,
    gslbTotalUseTime_:0,
    gslbReloadTimes_ : 0,
    gslbCompleteReported_ : false,
    openTime_:0,
    downloader_:null,
    gslbRequestUrl_:null,
    location_:null,
    nodelist_:null,
    url_:null,
    config_:null,
    global_:null,
    timer_:null,
    wrapper_:null,
    data_:null,
    createTime_:0,
    activeTime_:0,
    sn_:0,

    //调度请求

    init:function(wrapper,url)
    {
        this.wrapper_=wrapper;
        this.config_ = p2p$.com.selector.Config;
        this.global_ = p2p$.com.common.Global;
        this.gslbTryTimes_ = 0;
        this.gslbServerResponseCode_ = 0;
        this.gslbServerErrorCode_ = -1;
        this.gslbCompleteReported_ = false;
        this.gslbReloadTimes_ = 0;
        this.gslbReloadInterval_ = 0;
        this.gslbConsumedTime_ = 0;
        this.sn_ = -1;
        this.createTime_ = this.activeTime_ = this.global_.getMilliTime_();
        this.url_=url;
        this.addTionalParams_();
    },
    start_:function()
    {
        if(this.url_ == null){
            P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}:start url is null",this.tag_));
            return;
        }
        this.stop_();
        if(this.openTime_==0){
            this.openTime_ = this.global_.getMilliTime_();
        }
        this.sn_++;
        var timeoutMs = 5000 + (this.gslbTryTimes_ * 3000); // 5 seconds
        var type_="json";
        if(this.config_.jsonp==1){
            type_="jsonp";
            timeoutMs = 1000;
        }
        this.setTimeout_(timeoutMs);
        this.gslbRequestUrl_ = this.url_.toString();
        this.downloader_ = new p2p$.com.loaders.HttpDownLoader({url_:this.gslbRequestUrl_, scope_:this,type_:type_, tag_:"base::gslb"});
        this.downloader_.load_();
    },
    addTionalParams_:function()
    {
        this.url_.params_.set("appid", 800);
        this.url_.params_.set("format", "1");
        this.url_.params_.set("expect", "3");
        this.url_.params_.set("ajax", "1");

        var tss = this.url_.params_.get("tss");
        var m3v = this.url_.params_.get("m3v");
        if (tss != "ios") {
            tss = "tvts";
        }
        if (!m3v || m3v == "0") {
            m3v = "1";
        }
        // m3v = "0";
        this.url_.params_.set("tss", tss);
        this.url_.params_.set("m3v", m3v);
    },
    stop_:function()
    {
        if(this.downloader_ != null)
        {
            this.downloader_.close();
            this.downloader_ = null;
        }
    },
    onHttpDownloadCompleted_:function(downloader){
        this.stop_();
        this.gslbConsumedTime_ = downloader.totalUsedTime_;
        this.activeTime_ = this.global_.getMilliTime_();
        this.gslbTotalUseTime_ = this.activeTime_-this.openTime_;
        this.gslbServerResponseCode_ = downloader.successed_ ? downloader.responseCode_ : -1;
        if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
            // waiting for timeout and retry ...
            P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onHttpDownloadComplete_ success_({1}),responseCode({2})",this.tag_,downloader.successed_,downloader.responseCode_));
            this.stopTimer_();
            this.onTimeout_();
            return;
        }

        if (!this.parseResponse_(downloader, "")) {
            P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onHttpDownloadComplete_ parseGslbResponse_->false",this.tag_));
            if (52001 == this.gslbServerErrorCode_) {
                // json parse failed, waiting timeout and retry
                this.stopTimer_();
                this.onTimeout_();
                return;
            }
            // stop timer
            this.stopTimer_();
            this.wrapper_.onMetaComplete_(20501, "GSLB Response Failed " + this.gslbServerErrorCode_);
            return;
        }

        // stop timer
        this.stopTimer_();
        if (!this.gslbCompleteReported_) {
            this.gslbCompleteReported_ = true;
            this.wrapper_.sendStatus_({type:"ACTION.SCHEDULE.COMPLETED",code:p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess, host:downloader.remoteEndpoint_, ut:this.activeTime_ - this.createTime_});
            if (this.wrapper_.onGslbComplete_) {
                this.wrapper_.onGslbComplete_();
            }
        }
    },
    parseResponse_ : function(downloader, data) {
        var gslbData = downloader.responseData_;
        if (gslbData == "" || gslbData == null) {
            if (this.gslbServerErrorCode_ <= 0) {
                gslbServerErrorCode_ = 52001;
            }
            return false;
        }
        // parse responseData
        gslbData["ercode"] = 0;
        gslbData["errinfo"] = "Direct Meta";

        this.gslbServerErrorCode_ = gslbData.ercode;
        this.gslbServerErrorDetails_ = gslbData.errinfo || "";
        this.gslbLoadTime_ = this.global_.getMilliTime_();
        this.gslbReloadInterval_ = gslbData.forcegslb * 1000;
        // url timeout or linkshell timeout
        if (this.gslbServerErrorCode_ == 424 || this.gslbServerErrorCode_ == 428) {
            // sync time with server again
            // this.manager_.getAuthorization().update();
        }

        this.wrapper_.context_.loadData_(gslbData);
        // test for cdn meta timeout
        this.wrapper_.manager_.getEnviroment_().attachContext_(this.wrapper_.context_);

        this.wrapper_.context_.detectSpecialPlayerTimeOffset_();
        this.wrapper_.metaData_.directMetaMode_ = false;

        this.wrapper_.metaData_.sourceUrl_ = this.wrapper_.context_.gslbData_["location"];
        var allMetaNodes = this.wrapper_.context_.gslbData_["nodelist"];
        if ("" == this.wrapper_.metaData_.sourceUrl_ && allMetaNodes.length > 0) {
            this.metaData_.sourceUrl_ = allMetaNodes[0]["location"];
        }
        if ("" == this.wrapper_.metaData_.sourceUrl_) {
            P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} Gslb response failed, no g3 meta url location, url({1}))",this.tag_,downloader.url_));
            if (this.gslbServerErrorCode_ <= 0) {
                this.gslbServerErrorCode_ = 52002;
            }
            return false;
        }

        return true;
    },
    setTimeout_ : function(timeoutMs) {
        var me = this;
        this.timer_ = setTimeout(function() {
            me.onTimeout_();
        }, timeoutMs);
    },
    stopTimer_:function()
    {
        if (this.timer_) {
            clearTimeout(this.timer_);
            this.timer_ = null;
        }
    },
    onTimeout_ : function() {
        P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onGslbTimeout_",this.tag_));
        this.stop_();
        this.gslbTryTimes_++;
        if (this.gslbTryTimes_ <= 2) {
            this.start_();
        } else {
            this.wrapper_.onMetaComplete_(20500, "GSLB Request Failed", "");
        }
    },
    updateBackupIp_ : function() {
        var predefinedStrings = this.wrapper_.manager_.getEnviroment_().getBackupHostIps_();
        if (!predefinedStrings) {
            return;
        }
        // standard domain
        var predefineIps = null;
        predefineIps = predefinedStrings.split(",");
        if (!predefineIps) {
            return;
        }
        var seed = Math.floor(Math.random() * (100 + 1));
        var randIdx = seed % predefineIps.length;
        if (randIdx < 0 || randIdx >= predefineIps.length) {
            randIdx = 0;
        }
        var retryIndex = this.gslbTryTimes_ % 4;
        switch (retryIndex) {
            case 1:
            case 2:
                this.gslbBackupIp_ = predefineIps[randIdx];
                break;
            default:
                // try default domain at the last time
                this.gslbBackupIp_ = "";
                break;
        }
    },
});

