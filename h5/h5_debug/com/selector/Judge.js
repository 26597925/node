p2p$.ns('com.selector');
p2p$.com.selector.Judge = JClass.extend_({
    //flag : 0,//表示播放方式，0代表mediasource的MP4，1代表mediasource的ts，2代表系统播放,3代表其他
    mediaType_ : null,
    enviroment_:null,
    sysParam_ : null,
    flag_:2,
    tag_:"com::selector::Juge",
    
    init : function(){
        this.enviroment_ = p2p$.com.selector.Enviroment;
        this.enviroment_.initialize_();
        this.mediaType_=this.enviroment_.getMediaType_();
        if(this.mediaType_.mediasource){
        	if(this.mediaType_.ts){
                this.flag_ = 1;
            }else if(this.mediaType_.mp4){
                this.flag_ = 0;
            }else{
                this.flag_ = 2;
            }
        }
    },
    setFlag:function(flag)
    {
    	P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::setFlag 设置播放方式 flag={1}",this.tag_,flag));
    	switch(flag)
    	{
    	case 0:
    		if(this.mediaType_.mp4)
    		{
    			this.flag_ = 0;
    		}
    		else
    		{
    			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::setFlag 设置播放方式失败，不支持mp4格式播放",this.tag_));
    		}
    		break;
    	case 1:
    		if(this.mediaType_.ts)
    		{
    			this.flag_ = 1;
    		}
    		else
    		{
    			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::setFlag 设置播放方式失败，不支持ts格式播放",this.tag_));
    		}
    		break;
    	case 2:
    		this.flag_ = 2;
    		break;
    	default:
    		break;
    	}
    }
});
