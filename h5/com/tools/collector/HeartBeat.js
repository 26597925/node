/**
 * Created by letv on 2017/6/21.
 */
p2p$.ns("com.tools.collector");
p2p$.com.tools.collector.HeartBeat = p2p$.com.tools.collector.ClientBase.extend_({
    sn_:0,//序列号
    bcnt_:0,//卡顿次数
    blen_:0,//卡顿时长
    pcnt_:0,//结束暂停次数
    plen_:0,//暂停时长
    vacnt_:0,//调节音量次数
    facnt_:0,//全屏次数
    dv_:1,//设备音量
    inter_:0,
    playInter_:1000,
    playInterId_:-1,
    pt_:0,//心跳内播放时长
    psn_:0,//暂停序列号
    ppos_:"",
    bsn_:0,
    bpos_:"",
    gTime_:0,
    uTime_:0,
    timerId_:-1,
    init:function(wrapper)
    {
        this._super();
        this.scope_ = wrapper;
        this.tag_="com::tools::collector::HeartBeat";
        this.gTime_ = this.global_.getMilliTime_();
        this.timerId_ = -1;
        this.sn_=0;
        this.inter_= wrapper.getContext_().statReportInterval_ * 1000;
    },
    tidy : function() {
        this._super();
        this.bcnt_ = 0;
        this.blen_ = 0;
        this.pcnt_ = 0;
        this.vacnt_ = 0;
        this.facnt_ = 0;
        this.dv_=1;
        this.pt_ = 0;
        this.psn_ = 0;
        this.ppos_ =  0;
        this.bsn_ = 0;
        this.bpos_ = 0;
    },
    playStatus_:function(params)
    {
        var type_ = params["type"];
        switch(type_)
        {
            case "VIDEO.GSLB.LOADING":
                this.startHeart_();
                break;
            case "VIDEO.INIT":
                this.gTime_ = this.global_.getMilliTime_();
                break;
            case "VIDEO.PLAY.PLAYING":
            case "VIDEO.PLAY.FIRST":
                this.startPlayTimer_();
                break;
            case "VIDEO.PLAY.PAUSE":
                this.stopPlayTimer_();
                this.psn_ += 1;
                this.gTime_ = this.global_.getMilliTime_();
                this.addElement_(this.strings_.format("{0}_{1}",this.gTime_,this.psn_),1)
                break;
            case "VIDEO.PLAY.RESUME":
                this.uTime_=this.global_.getMilliTime_()-this.gTime_;
                this.pcnt_ += 1;
                this.plen_ += this.uTime_;
                this.addElement_(this.strings_.format("{0}_{1}",this.global_.getMilliTime_(),this.psn_),1)
                break;
            case "VIDEO.BUFFER.START":
                this.gTime_=this.global_.getMilliTime_();
                this.bcnt_ += 1;
                this.bsn_ += 1;
                this.addElement_(this.strings_.format("{0}_{1}",this.gTime_,this.bsn_));
                break;
            case "VIDEO.BUFFER.END":
                break;
            case "VIDEO.PLAY.SEEKING":
                this.stopPlayTimer_();
                this.gTime_ = this.global_.getMilliTime_();
                break;
            case "VIDEO.PLAY.SEEKED":
                this.uTime_=this.global_.getMilliTime_()-this.gTime_;
                this.blen_ += this.uTime_;
                this.addElement_(this.strings_.format("{0}_{1}",this.global_.getMilliTime_(),this.bsn_));
                break;
            case "VIDEO.PLAY.END":
                this.stopPlayTimer_();
                this.stopHeart_();
                break;
        }
    },
    //播放计时
    startPlayTimer_:function()
    {
        if(this.playInterId_>-1){
            return;
        }
        var callback = this.setPlayTime_.bind(this);
        this.playInterId_ = setInterval(callback,this.playInter_);
    },
    stopPlayTimer_:function()
    {
        if(this.playInterId_>-1){
            clearInterval(this.playInterId_) ;
            this.playInterId_ = -1;
        }
    },
    setPlayTime_:function()
    {
        this.pt_++;
    },
    addElement_:function(str,type)
    {
        if(!type){
            type = 0;
        }
        switch(type)
        {
            case 0:
                if(this.bpos_ == "")
                {
                    this.bpos_ = str;
                }
                else
                {
                    this.bpos_+="*"+str;
                }
                break;
            case 1:
                if(this.ppos_ == "")
                {
                    this.ppos_ = str;
                }
                else
                {
                    this.ppos_+="*"+str;
                }
            default:
                break
        }
    },

    startHeart_:function()
    {
        if(this.timerId_ < 0){
            P2P_ULOG_INFO(P2P_ULOG_FMT("{0} startHeart!",this.tag_));
            var callback_ = this.timerHandler_.bind(this);
            this.timerId_=setInterval(callback_,this.inter_);
        }
    },
    stopHeart_:function()
    {
        this.timerHandler_();
        if(this.timerId_>-1){
            P2P_ULOG_INFO(P2P_ULOG_FMT("{0} stopHeart!",this.tag_));
            clearInterval(this.timerId_);
            this.timerId_=-1;
        }
    },
    timerHandler_:function()
    {
        this.sn_+=1;
        var params_ = {
            sn:this.sn_,
            bcnt:this.bcnt_,
            blen:this.blen_,
            pcnt:this.bcnt_,
            plen:this.plen_,
            vacnt:this.vacnt_,
            facnt:this.facnt_,
            pt:this.pt_,
            bpos:this.bpos_,
            ppos:this.ppos_
        }
        this.scope_.sendStatus_({type:"VIDEO.HEART",params:params_});
        this.tidy();
    },
    close_:function()
    {
        P2P_ULOG_INFO(P2P_ULOG_FMT("{0} close!",this.tag_));
        this.stopHeart_();
        this.stopPlayTimer_();
    }
});
