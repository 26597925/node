rc$.ns("com.relayCore.statics");
rc$.com.relayCore.statics.Statics = JClass.extend_({
	config_:null,
	strings_:null,
	global_:null,
	controller_:null,
	tag_:"com::relayCore::statics::Statics",
	
	init:function(_controller)
	{
		this.controller_ = _controller;
		this.config_ = rc$.com.relayCore.vo.Config;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.global_ = rc$.com.relayCore.utils.Global;
	},
	send_:function(_params)//发送数据上报
	{
		
	},
	close_:function()
	{
		this.config_=null;
		this.strings_=null;
		this.global_=null;
		this.controller_=null;
	}
});
