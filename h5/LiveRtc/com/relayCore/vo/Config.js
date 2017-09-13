rc$.ns("com.relayCore.vo");
rc$.com.relayCore.vo.Config=
{
	/*设置外部参数*/
	version:"1.0.1",//版本
	clientId:null,//客户端ID
	debugBarId:null,//调试面板
	auto:false,//是否自动启动rtc
	logLevel : 15,
	logType : 3,
	webrtcTotalNodeCount:0,
	//服务器配置地址
	webrtcServerHost_:"ws://10.75.134.220:8091",//ws://123.125.89.103:3852,
	stunServerHost:"stun:stun01.sipphone.com",//stun:106.39.244.125:3478,stun:111.206.210.145:8124,
	logServer:"http://10.58.132.159:8000",
	syncMax_:10,
	channel_:"test",
	prints_:[72,85],
	unavailableMaxTimes_:5,
	maxThreshold_:5,//最大阈值设定
	messageExpiredTime_:30*1000,//消息过期检测间隔
	test:"//"
};
