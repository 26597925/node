p2p$.ns('com.selector');
p2p$.com.selector.LoadScript = JClass.extend_({
    judge_ : null,
    message_ : null,
    scope_ : null,
    config_:null,
    tag_:"com::selector::LoadScript",
    urls_:[],
    index_:0,
    module_:null,
    
    init : function(){
    	if(arguments.length>0)
    	{
    		this.scope_ = arguments[0];
    	}
    	this.module_=p2p$.com.selector.Module;
    	this.config_ = p2p$.com.selector.Config;
        this.judge_ = new p2p$.com.selector.Judge();
        if(this.config_.useType != null)
    	{	
    		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::init 设置useType={1}",this.tag_,this.config_.useType));
    		this.judge_.setFlag(this.config_.useType);
    	}
        this.urls_.push(this.module_.kernel[this.judge_.flag_]);
        if(this.config_.showConsole == 1)
        {
        	this.urls_.push(p2p$.com.selector.Module.other[0]);
        }
        this.loadScript_();
    },
    loadScript_ : function(){
    	me = this;
    	var url=this.urls_[this.index_];
        if(this.config_.domains == "/"){
            this.module_.domains = "";
        }
        else if(this.config_.domains != "")
        {
            this.module_.domains = this.config_.domains;
        }
    	if(this.module_.domains != "")
        {
            url=this.module_.domains+this.urls_[this.index_];
        }
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = script.onreadystatechange = function () {
            me.onComplete_();
        };
        script.src = encodeURI(url);
        document.getElementsByTagName('head')[0].appendChild(script);
        this.index_++;
    },
    onComplete_:function()
    {
    	if(this.index_>=this.urls_.length)
    	{
    		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::loadScript_ 模块加载完毕",this.tag_));
    		this.scope_.onComplete_();
    		return
    	}
    	this.loadScript_();
    },
    getFlag_:function()
    {
    	return this.judge_.flag_;
    }
});
