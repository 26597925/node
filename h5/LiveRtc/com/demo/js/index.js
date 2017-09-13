var controller;
$(document).ready(
			function()
			{
				var params={
						debugBarId:"relayBar",
						auto:true
				}
				controller = new rc$.com.relayCore.controller.LMPN(params);
			}
);
function openServing()
{
	var params={};
	params.id=document.getElementById("serving").value;
	if(!params.id||params.id=="")
	{
		return;
	}
	params.callback = trace;
	params.channel="chenzhaofei";
	params.layer=4;
	var ssrcs_ = controller.ssManager_.ssrcs_;
	var level = document.getElementById("serve-type").value;
	if(ssrcs_.find(params.id+":"+level))
	{
		console.log("exit:",params.id,":",level);
		return;
	}
	if(level=="serving")
	{
		controller.requetSS(params)
	}
	else
	{
		controller.sourcingSS(params);
	}
}
function stopServing()
{
	var params={};
	params.id=document.getElementById("serving").value;
	params.callback = trace;
	params.channel="chenzhaofei";
	params.layer=4;
	var ssrcs_ = controller.ssManager_.ssrcs_;
	var level = document.getElementById("serve-type").value;
	if(ssrcs_.find(params.id+":"+level))
	{
		if(level=="serving")
		{
			controller.stopRequetSS(params);
		}
		else
		{
			controller.stopSourcingSS(params);
		}
		
	}	
}
var seq_=0,ts_;
function sending()
{
	seq_++;
	ts_ = rc$.com.relayCore.utils.Global.getMilliTime_();
	var defaultMsg_ = {"ts":ts_,"layer":0,"seq":seq_,"payload":0};
	var message = document.getElementById("message").value;
	if(message){
		message = JSON.parse("{"+message+"}");
	}
	for(var i in message)
	{
		defaultMsg_[i]=message[i];
	}
	var params={};
	params.id=document.getElementById("ssrcId").value;
	params.message = defaultMsg_;
	var ssrcs_ = controller.ssManager_.ssrcs_;
	var type = document.getElementById("message-type").value;
	params.type = type
	params.level="sourcing";
	if(ssrcs_.find(params.id+":"+params.level))
	{
		//ssrcs_.get(params.id+":"+params.level).messageFromApp_(params,params.layer);
		controller.testSourcingSS(params)
		return;
	}
}
function trace(message)
{
}