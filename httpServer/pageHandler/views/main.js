<script type="text/javascript" src="/public/js/jquery-ui-1.8.21.custom.min.js"></script>
<script type="text/javascript" src="/public/js/jquery.crypt.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.pieRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.donutRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.canvasTextRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.highlighter.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.canvasAxisLabelRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.barRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.categoryAxisRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.pointLabels.min.js"></script>
<script type="text/javascript" src="/public/js/spin/spin.min.js"></script>
<script type="text/javascript" src="/public/js/spin/spinUse.js"></script>


<style type="text/css" media="screen">
@import "/public/js/plugins/DataTables-1.9.2/media/css/demo_page.css";
@import "/public/js/plugins/DataTables-1.9.2/media/css/demo_table_jui.css";
</style>
<script type="text/javascript" src="/public/js/plugins/DataTables-1.9.2/media/js/jquery.dataTables.min.js"></script>

	<link rel="stylesheet" type="text/css" href="/public/js/css/smoothness/jquery-ui-1.8.21.custom.css" />
	<link rel="stylesheet" type="text/css" href="/public/js/jquery.jqplot.min.css" />


	<script type="text/javascript">
//business_line
var p1_business_line = [
	['-1','p1'],
	['0','移动站'],
	['1','pc端'],
	['2','tv站'],
	['3','云视频'],
	['4','乐视商城'],
	['5','乐视云（lecloud）'],
	['6','乐看搜索产品'],
	['7','乐迷社区'],
	['8','应用商店']
];

var p2_business_line = [
	['-1','p2'],
	['0-00','乐视视频'],
	['0-01','乐拍'],
	['0-02','大咔'],
	['0-03','看球'],
	['0-04','M站'],
	['0-06','html5'],
	['0-07','client'],
	['0-08','starCast'],
	['0-09','le123'],
	['0-0a','乐视视频（桌面版）'],
	['0-0b','我是歌手的单片app'],
	['0-0c','乐视视频（精品app）'],
	['0-0d','新编辑部故事单片app'],
	['0-0e','看音乐'],
	['0-0f','百度sdk'],
	['0-0g','今日视频'],
	['0-0h','360sdk'],
	['0-0i','移动领先版'],
	['0-0j','头条视频'],
	['0-0k','快看影视'],
	['0-0l','影视大全'],
	['0-0m','SDK'],
	['0-0s','SARRS项目'],
	['1-10','网页'],
	['1-11','客户端'],
	['2-20','TV实体机'],
	['2-21','TV版'],
	['2-22','明星个人'],
	['2-23','影视俱乐部'],
	['2-24','乐搜'],
	['2-25','影视大全'],
	['2-26','视频盒子'],
	['2-27','游戏盒子'],
	['2-28','TV版SDK'],
	['2-29','运营商盒子'],
	['2-2a','海外超级电视'],
	['2-2s','SARRS项目'],
	['3-30','pc端'],
	['3-31','html5'],
	['3-32','云视频app'],
	['4-41','乐视商城pcweb端'],
	['4-42','乐视商城m站'],
	['5-50','云盘（Android、IOS）'],
	['5-51','云相册'],
	['5-52','云盘（PC端）'],
	['6-60','手机版app'],
	['6-61','Pad版app'],
	['6-62','PC网页版'],
	['6-63','M站版'],
	['6-64','TV版'],
	['7-70','pc'],
	['7-71','mobile'],
	['7-72','tv'],
	['8-80','移动网'],
	['8-82','TV端']
];
var p3_business_line = [
	['-1','p3'],
	['0-00-001','乐视视频gphone'],
	['0-00-002','乐视视频iphone'],
	['0-00-003','乐视视频gpad'],
	['0-00-004','乐视视频ipad'],
	['0-00-005','乐视视频w8phone'],
	['0-00-006','乐视视频w8pad'],
	['0-00-007','乐视视频wphone'],
	['0-00-008','领先版'],
	['0-01-011','Android phone基线乐拍'],
	['0-01-012','iphone 乐拍'],
	['0-01-013','超级手机乐拍'],
	['0-03-031','看球gphone'],
	['0-03-032','看球iphone'],
	['0-0m-0m0','Android 百度浏览器'],
	['0-0m-0m1','Android 360手机助手'],
	['0-0m-0m2','Android 宜搜'],
	['0-0m-0m3','Android 100TV'],
	['0-0m-0m4','Android 开讯'],
	['0-0m-0m5','IOS 开讯'],
	['0-0m-0m5','手机百度播放器SDK(Android)'],
	['0-0m-0m7','手机百度播放器SDK(IOS)'],
	['0-0m-0m8','乐影客接入乐视视频合作SDK'],
	['0-0s-001','SARRS 桌面'],
	['0-0s-002','SARRS 安卓'],
	['0-0s-003','SARRS IOS'],
	['1-11-111','PC客户端'],
	['1-11-112','服务弹窗'],
	['1-11-113','手机助手'],
	['2-21-letvrelease_0_0_1_2'],['乐视自由版本'],
	['2-21-pre_cibn_201410'],['乐视国广版本'],
	['2-2a-001','香港TV版'],
	['2-2a-002','香港轮播桌面'],
	['3-30-300','FLASH播放器'],
	['3-31-310','在PC平台播放'],
	['3-31-311','在IOS平台播放'],
	['3-31-312','在安卓平台播放'],
	['3-32-321','在IOS平台播放'],
	['3-32-322','在安卓平台播放'],
	['6-60-00','超级手机内置'],
	['6-60-01','超级手机市场（1080P）'],
	['6-60-02','超级手机2K'],
	['6-60-03','超级手机2K市场（2560P）'],
	['6-60-04','乐视APP的SDK android'],
	['6-60-05','乐视APP的SDK IOS'],
	['6-60-06','独立APP android（通用版）'],
	['6-60-07','独立APP IOS（通用版）',''],
	['6-64-001','乐看搜索APP'],
	['6-64-002','TV版内搜索'],
	['6-64-003','桌面搜索'],
	['6-64-004','乐看搜索SDK包'],
	['7-70-1000','乐视网'],
	['7-70-1001','乐视致新'],
	['7-70-1002','乐视应用市场'],
	['8-82-820','乐视TV应用商店'],
	['8-82-822','乐视TV游戏']
];
//end business_line

//btn
var querygo_onlineuser_able = true;//在线用户
var querygo_nodedistribute_able = true;//节点分布
var querygo_ptopratio_able = true;//p2p下载率历史数据
var querygo_stagequality_able = true;//过程质量历史数据
var querygo_filmduration_able = true;//影片时长历史数据
var querygo_videobitrate_able = true;//视频码率
var querygo_pl_able = true;//视频码率
var querygo_upgrade_able = true;//升级统计
var querygo_all_share_able = true; //生成报表

var plotSize,plotTime,plotToday,dtAllUsers, dtS,dtR,dtG, dt_onlineuser,dt_nodedistribute,dt_ptopratio,dt_stagequality;
var dt_filmduration,dt_videobitrate,dt_pl,dt_live,dt_vod,dt_termid,dt_webp2p,dt_p2p_all,dt_all_share,dt_upgrade, dtGroupIDs, dt_hgdd;
var chart_historydata_onlineuser,chart_historydata_nodedistribute,chart_historydata_nodedistribute_partThree, chart_historydata_nodedistribute_partFour;
var chart_historydata_ptopratio,chart_historydata_stagequality,chart_historydata_ptopratio_partThree, chart_historydata_stagequality_partThree;
var chart_historydata_stagequality_partFour, chart_historydata_stagequality_partFive, chart_historydata_videobitrate_Beat;
var chart_historydata_videobitrate_Share, chart_upgrade_version_increase, chart_upgrade_version_total_increase,chart_upgrade_faild_statistics;
var ipPort_historydata_onlineuser,ipPort_historydata_ptopratio,chart_historydata_filmduration_Beat,chart_historydata_filmduration_Share;
var chart_historydata_play,chart_historydata_heart;
var chart_table_share_rate,chart_people_number;
var chart_table_average_bitrate,chart_table_show_time,chart_table_contribute_rate,chart_table_cdn_data;
var nSummaryTimer, nServerRtmfpTimer, nServerCDETimer,nServerRecentallTimer, nServerGroupIDsTimer;
var servermonitor_recentall_cdeusers_chart_div,servermonitor_recentall_rtmfpusers_chart_div,servermonitor_recentall_ptopdownload_chart_div,servermonitor_recentall_connectivity_chart_div;

var upgrade_version_from_db;
var upgrade_model_from_db;
var upgrade_vendor_from_db;
var upgrade_rom_version_from_db;
var version_data_from_lb;
var idc_data_from_lb;
var group_data_from_lb;
var stream_data_from_lb;
var cloundCId_DT;
$(document).ready(function(){

	fillServerInfoDropList();
	fillVersionInfoDropList();
	fillGroupInfoDropList();
	fillStreamInfoDropList();
	fillCloundCIdList();

	upgrade_local_version_list();
	upgrade_server_version_list();

	showTopInfo();
	$("#accordion").accordion();

	$("#tabs_for_ptopratio").tabs();

	showSvrrecentall();
	loadDT_recentall();
	nServerRecentallTimer = setInterval(loadDT_recentall,30*1000);

	load_SummaryInfoAndDisplay();
	nSummaryTimer = setInterval(load_SummaryInfoAndDisplay,10*1000);

	var lastDayDate = new Date(new Date() - 1*24*3600000); //1*24*3600000);
	var lastTable = new Date(new Date() - 7*24*3600000);

	$("input:submit,button").button();

	$("#fromdatepicker_onlineuser").datepicker();
	$("#todatepicker_onlineuser").datepicker();
	$("#todatepicker_onlineuser").datepicker('setDate',new Date());
	$("#fromdatepicker_onlineuser").datepicker('setDate',lastDayDate);
	$("#fromdatepicker_onlineuser").text($("#fromdatepicker_onlineuser").datepicker('getDate'));
	$("#todatepicker_onlineuser").text($("#todatepicker_onlineuser").datepicker('getDate'));


	$("#fromdatepicker_nodedistribute").datepicker();
	$("#todatepicker_nodedistribute").datepicker();
	$("#todatepicker_nodedistribute").datepicker('setDate',new Date());
	$("#fromdatepicker_nodedistribute").datepicker('setDate',lastDayDate);
	$("#fromdatepicker_nodedistribute").text($("#fromdatepicker_nodedistribute").datepicker('getDate'));
	$("#todatepicker_nodedistribute").text($("#todatepicker_nodedistribute").datepicker('getDate'));

	$("#fromdatepicker_ptopratio").datepicker();
	$("#todatepicker_ptopratio").datepicker();
	$("#todatepicker_ptopratio").datepicker('setDate',new Date());
	$("#fromdatepicker_ptopratio").datepicker('setDate',lastDayDate);
	$("#fromdatepicker_ptopratio").text($("#fromdatepicker_ptopratio").datepicker('getDate'));
	$("#todatepicker_ptopratio").text($("#todatepicker_ptopratio").datepicker('getDate'));

	$("#fromdatepicker_stagequality").datepicker();
	$("#todatepicker_stagequality").datepicker();
	$("#todatepicker_stagequality").datepicker('setDate',new Date());
	$("#fromdatepicker_stagequality").datepicker('setDate',lastDayDate);
	$("#fromdatepicker_stagequality").text($("#fromdatepicker_stagequality").datepicker('getDate'));
	$("#todatepicker_stagequality").text($("#todatepicker_stagequality").datepicker('getDate'));

	$("#fromdatepicker_filmduration").datepicker();
	$("#todatepicker_filmduration").datepicker();
	$("#todatepicker_filmduration").datepicker('setDate',new Date());
	$("#fromdatepicker_filmduration").datepicker('setDate',lastDayDate);
	$("#fromdatepicker_filmduration").text($("#fromdatepicker_filmduration").datepicker('getDate'));
	$("#todatepicker_filmduration").text($("#todatepicker_filmduration").datepicker('getDate'));

	$("#fromdatepicker_videobitrate").datepicker();
	$("#todatepicker_videobitrate").datepicker();
	$("#todatepicker_videobitrate").datepicker('setDate',new Date());
	$("#fromdatepicker_videobitrate").datepicker('setDate',lastDayDate);
	$("#fromdatepicker_videobitrate").text($("#fromdatepicker_videobitrate").datepicker('getDate'));
	$("#todatepicker_videobitrate").text($("#todatepicker_videobitrate").datepicker('getDate'));

	$("#fromdatepicker_pl").datepicker();
	$("#todatepicker_pl").datepicker();
	$("#todatepicker_pl").datepicker('setDate',new Date());
	$("#fromdatepicker_pl").datepicker('setDate',lastDayDate);
	$("#fromdatepicker_pl").text($("#fromdatepicker_pl").datepicker('getDate'));
	$("#todatepicker_pl").text($("#todatepicker_pl").datepicker('getDate'));

	$("#fromdatepicker_termid").datepicker();
	$("#todatepicker_termid").datepicker();
	$("#todatepicker_termid").datepicker('setDate',new Date());
	$("#fromdatepicker_termid").datepicker('setDate',lastTable);
	$("#fromdatepicker_termid").text($("#fromdatepicker_termid").datepicker('getDate'));
	$("#todatepicker_termid").text($("#todatepicker_termid").datepicker('getDate'));

	$("#fromdatepicker_webp2p").datepicker();
	$("#todatepicker_webp2p").datepicker();
	$("#todatepicker_webp2p").datepicker('setDate',new Date());
	$("#fromdatepicker_webp2p").datepicker('setDate',lastTable);
	$("#fromdatepicker_webp2p").text($("#fromdatepicker_webp2p").datepicker('getDate'));
	$("#todatepicker_webp2p").text($("#todatepicker_webp2p").datepicker('getDate'));

	$("#fromdatepicker_webp2p_cdn").datepicker();
	$("#todatepicker_webp2p_cdn").datepicker();
	$("#todatepicker_webp2p_cdn").datepicker('setDate',new Date());
	$("#fromdatepicker_webp2p_cdn").datepicker('setDate',lastTable);
	$("#fromdatepicker_webp2p_cdn").text($("#fromdatepicker_webp2p_cdn").datepicker('getDate'));
	$("#todatepicker_webp2p_cdn").text($("#todatepicker_webp2p_cdn").datepicker('getDate'));

	$("#fromdatepicker_p2p_all").datepicker();
	$("#todatepicker_p2p_all").datepicker();
	$("#todatepicker_p2p_all").datepicker('setDate',new Date());
	$("#fromdatepicker_p2p_all").datepicker('setDate',lastTable);
	$("#fromdatepicker_p2p_all").text($("#fromdatepicker_p2p_all").datepicker('getDate'));
	$("#todatepicker_p2p_all").text($("#todatepicker_p2p_all").datepicker('getDate'));

	$("#fromdatepicker_all_share").datepicker();
	$("#todatepicker_all_share").datepicker();
	$("#todatepicker_all_share").datepicker('setDate',new Date());
	$("#fromdatepicker_all_share").datepicker('setDate',lastTable);
	$("#fromdatepicker_all_share").text($("#fromdatepicker_all_share").datepicker('getDate'));
	$("#todatepicker_all_share").text($("#todatepicker_all_share").datepicker('getDate'));


	$("#fromdatepicker_upgrade").datepicker();
	$("#todatepicker_upgrade").datepicker();
	$("#todatepicker_upgrade").datepicker('setDate',new Date());
	$("#fromdatepicker_upgrade").datepicker('setDate',lastDayDate);
	$("#fromdatepicker_upgrade").text($("#fromdatepicker_upgrade").datepicker('getDate'));
	$("#todatepicker_upgrade").text($("#todatepicker_upgrade").datepicker('getDate'));

	$("#fromdatepicker_hgdd").datepicker();
	$("#fromdatepicker_hgdd").datepicker('setDate',lastDayDate);
	$("#fromdatepicker_hgdd").text($("#fromdatepicker_hgdd").datepicker('getDate'));

	//selecthandler------------------------------
	//share
	filterOption(1,null,'share_select_items_p1');

	$("#share_select_items_p1").change(function(){
		var checkValue=$("#share_select_items_p1").val();   //获取Select选择的Value
		//var checkIndex=$("#share_select_items_p1 ").get(0).selectedIndex;
		filterOption(2,checkValue,'share_select_items_p2');
	});

	$("#share_select_items_p2").change(function(){
		var checkValue=$("#share_select_items_p2").val();   //获取Select选择的Value
		//var checkIndex=$("#share_select_items_p2 ").get(0).selectedIndex;
		filterOption(3,checkValue,'share_select_items_p3');
	});
	//stagequality

	filterOption(1,null,'stage_select_items_p1');

	$("#stage_select_items_p1").change(function(){
		var checkValue=$("#stage_select_items_p1").val();   //获取Select选择的Value
		//var checkIndex=$("#select_items_p1 ").get(0).selectedIndex;
		filterOption(2,checkValue,'stage_select_items_p2');
	});

	$("#stage_select_items_p2").change(function(){
		var checkValue=$("#stage_select_items_p2").val();   //获取Select选择的Value
		//var checkIndex=$("#select_items_p2 ").get(0).selectedIndex;
		filterOption(3,checkValue,'stage_select_items_p3');
	});

	//end selecthandler------------------------------

	$("#topinfoexit").click(function(){
		$.ajax( {
			"dataType": 'json',
			"contentType": "application/json; charset=utf-8",
			"type": "GET",
			"url": "/exit",
			"success":function (data,textStatus) {
				window.location.href = "/";
			}
		});
	});

	/* ----------- Event--------------- */
	$("#svr_recentall").click(function(){
		stopRealTimeServerInfoTimers();

		showSvrrecentall();
		loadDT_recentall();

		nServerRecentallTimer = setInterval(loadDT_recentall,30*1000);
	});

	$("#svr_rtmfp").click(function(){
		stopRealTimeServerInfoTimers();

		showSvrRTMFP();
		if(!dtR){
			dtR = $("#dt_rtmfp").dataTable(tableOptions);
		}
		loadDT_RTMFP();
		nServerRtmfpTimer = setInterval(loadDT_RTMFP,30*1000);
	});

	$("#svr_cde").click(function(){
		stopRealTimeServerInfoTimers();

		showSvrCDE();
		if(!dtG){
			dtG = $("#dt_cde").dataTable(tableOptions);
		}
		loadDT_CDE();
		nServerCDETimer = setInterval(loadDT_CDE,30*1000);
	});


	$("#svr_groupids").click(function(){
		stopRealTimeServerInfoTimers();

		showSvrGroupIDs();
		if(!dtGroupIDs){
			dtGroupIDs = $("#dt_groupids").dataTable(tableOptions);
		}

		loadDT_GroupIDs();
		nServerGroupIDsTimer = setInterval(loadDT_GroupIDs,30*1000);
	});


	var stopRealTimeServerInfoTimers = function(){
		clearInterval(nServerRtmfpTimer);
		clearInterval(nServerCDETimer);
		clearInterval(nServerRecentallTimer);
		clearInterval(nServerGroupIDsTimer);
	};

	//----------------History------------------------
	var loadAndDisplay_historydata_onlineuser = function(){
		show_historydata_onlineuser();
		if(!dt_onlineuser){
			dt_onlineuser = $("#dt_onlineuser").dataTable(tableOptionsForOnlineUsers);
		}
		loadDT_historydata_onlineuser();
	};

	$("#historydata_onlineuser_here").click(function(){
		stopRealTimeServerInfoTimers();
		//loadAndDisplay_historydata_onlineuser();
		show_historydata_onlineuser();
	});

	$("#querygo_onlineuser").click(function(){
		if(!querygo_onlineuser_able){return;}
		querygo_onlineuser_able = false;
		loadAndDisplay_historydata_onlineuser();
	});

	var loadAndDisplay_historydata_nodedistribute = function(){
		show_historydata_nodedistribute();
		if(!dt_nodedistribute){
			dt_nodedistribute = $("#dt_nodedistribute").dataTable(tableOptions);
		}
		loadDT_historydata_nodedistribute();
	};

	$("#historydata_nodedistribute_here").click(function(){
		stopRealTimeServerInfoTimers();
		//loadAndDisplay_historydata_nodedistribute();
		show_historydata_nodedistribute();
	});

	$("#querygo_nodedistribute").click(function(){
		if(!querygo_nodedistribute_able){return;}
		querygo_nodedistribute_able = false;
		loadAndDisplay_historydata_nodedistribute();
	});


	var loadAndDisplay_historydata_ptopratio = function(){
		show_historydata_ptopratio();
		if(!dt_ptopratio){
			dt_ptopratio = $("#dt_ptopratio").dataTable(tableOptions);
		}
		loadDT_historydata_ptopratio();
	};
	$("#historydata_ptopratio_here").click(function(){
		stopRealTimeServerInfoTimers();
		show_historydata_ptopratio();
	});

	//P2P下载率历史数据
	$("#querygo_ptopratio").click(function(){
		if(!querygo_ptopratio_able){return;}
		querygo_ptopratio_able = false;
		loadAndDisplay_historydata_ptopratio();
	});


	var loadAndDisplay_historydata_stagequality = function(){
		show_historydata_stagequality();
		if(!dt_stagequality){
			dt_stagequality = $("#dt_stagequality").dataTable(tableOptions);
		}
		loadDT_historydata_stagequality();
	};
	$("#historydata_stagequality_here").click(function(){
		stopRealTimeServerInfoTimers();
		show_historydata_stagequality();
	});
	$("#querygo_stagequality").click(function(){
		if(!querygo_stagequality_able){return;}
		querygo_stagequality_able = false;
		loadAndDisplay_historydata_stagequality();
	});


	var loadAndDisplay_historydata_filmduration = function(){
		show_historydata_filmduration();
		if(!dt_filmduration){
			dt_filmduration = $("#dt_filmduration").dataTable(tableOptions);
		}
		loadDT_historydata_filmduration();
	};
	$("#historydata_filmduration_here").click(function(){
		stopRealTimeServerInfoTimers();
		show_historydata_filmduration();
	});
	$("#querygo_filmduration").click(function(){
		if(!querygo_filmduration_able){return;}
		querygo_filmduration_able = false;
		loadAndDisplay_historydata_filmduration();
	});

	var loadAndDisplay_historydata_pl = function(){
		show_historydata_pl();
		if(!dt_pl){
			dt_pl = $("#dt_pl").dataTable(tableOptions);
		}
		loadDT_historydata_pl();
	};
	$("#historydata_pl_here").click(function(){
		stopRealTimeServerInfoTimers();
		show_historydata_pl();
	});
	$("#querygo_pl").click(function(){
		if(!querygo_pl_able){console.log("__________"); return;}
		querygo_pl_able = false;
		loadAndDisplay_historydata_pl();
	});

	var loadAndDisplay_historydata_videobitrate = function(){
		show_historydata_videobitrate();
		if(!dt_videobitrate){
			dt_videobitrate = $("#dt_videobitrate").dataTable(tableOptions);
		}
		loadDT_historydata_videobitrate();
	};
	$("#historydata_videobitrate_here").click(function(){
		stopRealTimeServerInfoTimers();
		show_historydata_videobitrate();
	});
	$("#querygo_videobitrate").click(function(){
		if(!querygo_videobitrate_able){return;}
		querygo_videobitrate_able = false;
		loadAndDisplay_historydata_videobitrate();
	});


	var loadAndDisplay_historydata_hgdd = function(){
		show_historydata_hgdd();
		if(!dt_hgdd){
			dt_hgdd = $("#dt_hgdd").dataTable(tableOptions);
		}
		loadDT_historydata_hgdd();
	};

	$("#historydata_hgdd_here").click(function(){
		stopRealTimeServerInfoTimers();
		//loadAndDisplay_historydata_hgdd();
		show_historydata_hgdd(); // show ONLY
	});

	$("#querygo_hgdd").click(function(){
		loadAndDisplay_historydata_hgdd();
	});

	$("#a_toggle_history_hgdd").click(function(){
		toggleVisibale_history_hgdd();
	});


	var loadAndDisplay_table_termid = function(){
		show_table_termid();
		if(!dt_termid){
			dt_termid = $("#dt_termid").dataTable(tableOptions);
		}
		loadDT_table_termid();
	};
	$("#table_termid_here").click(function(){
		stopRealTimeServerInfoTimers();
		show_table_termid();
	});
	$("#querygo_termid").click(function(){
		loadAndDisplay_table_termid();
	});
	/*
	 var loadAndDisplay_table_webp2p_cdn = function(){
	 show_table_webp2p();
	 if(!dt_webp2p){
	 dt_webp2p = $("#dt_webp2p").dataTable(tableOptions);
	 }
	 loadDT_table_webp2p();
	 };
	 $("#table_webp2p_here").click(function(){
	 stopRealTimeServerInfoTimers();
	 show_table_webp2p();
	 });
	 $("#querygo_webp2p").click(function(){
	 loadAndDisplay_table_webp2p_cdn();
	 });
	 */
	var loadAndDisplay_table_p2p_all = function(){
		show_table_p2p_all();
		if(!dt_p2p_all){
			dt_p2p_all = $("#dt_p2p_all").dataTable(tableOptions);
		}
		loadDT_table_p2p_all();
	};
	$("#table_p2p_all_here").click(function(){
		stopRealTimeServerInfoTimers();
		show_table_p2p_all();
	});
	$("#querygo_p2p_all").click(function(){
		loadAndDisplay_table_p2p_all();
	});

	//分辨率报表-查询-方法
	var loadAndDisplay_table_all_share = function(){
		show_table_all_share();
		if(!dt_all_share){
			dt_all_share = $("#dt_all_share").dataTable(tableOptions);
		}
		loadDT_table_all_share();
	};

	$("#table_all_share_here").click(function(){
		stopRealTimeServerInfoTimers();
		show_table_all_share();
	});

	//分辨率报表-查询
	$("#querygo_all_share").click(function(){
		if(!querygo_all_share_able){return;}
		querygo_all_share_able = false;
		loadAndDisplay_table_all_share();
	});



	var loadAndDisplay_upgrade = function(){
		show_upgrade();
		if(!dt_upgrade){
			dt_upgrade = $("#dt_upgrade").dataTable(tableOptions);
		}
		loadDT_upgrade();
	};
	$("#upgrade_here").click(function(){
		stopRealTimeServerInfoTimers();
		show_upgrade();
	});
	$("#querygo_upgrade").click(function(){
		if(!querygo_upgrade_able){
			return;
		}
		querygo_upgrade_able=false;
		if(chart_upgrade_faild_statistics){
			chart_upgrade_faild_statistics.destroy();
		}
		loadAndDisplay_upgrade();
	});

	$("#querygo_idctype").click(function(){
		stopRealTimeServerInfoTimers();
		ChangeIDCTypeIntoStore();
	});

	//----------------------------------------------------------------------------
	var ChangeIDCTypeIntoStore = function(){

		var objIPList=document.getElementById("divselect_idctype_iplist");
		var iS=objIPList.selectedIndex;
		var str_address=objIPList.options[iS].value;


		var objIDCName=document.getElementById("divselect_idctype_name");
		var iIDC=objIDCName.selectedIndex;
		var str_idcValue=objIDCName.options[iIDC].value;

		var valIPPort = str_address.split(":");
		var strIp = valIPPort[0];
		var strPort = valIPPort[1];

		var isAsSegment = $("#radio_iptype_mode_segment:checked").val();
		var paraIDC = "&mode=0";
		// "&mode=" + (isAsSegment? "1" : "0"),
		if(isAsSegment)
			paraIDC = "&mode=1" ;


		$.ajax( {
			"dataType": 'json',
			"contentType": "application/json; charset=utf-8",
			"type": "GET",
			"url": "/settings/setIDCType?ipport=" + str_address +"&idcvalue=" + str_idcValue + paraIDC,
			"success":function (res,textStatus) {
				if(res.result == "success"){
					showInfo("设置成功");
				}else if(res.result == "expired"){
					showExpired("您当前登录已过期,请重新登录");
				}else if(res.result == "zero"){
					showLoadError("无相关数据");
				}else if(res.result == "doing"){
					showLoadError("请等待...");
				}else{
					showLoadError("加载数据错误");
				}
			}
		});
	};

	//TEST ONLY DEBUG PURPOSE NEVER_EXPIRE
	if($("#aalluser")){
		$("#aalluser").click(function(){
			showAllUsers();
			if(!dtAllUsers){
				dtAllUsers = $("#dtallusers").dataTable(tableOptions);
			}
			loadDTAllUsers();
		});
	}

	$("#a_anu_full").click(function(){
		showAddNewUser();
	});

	$("#anu_ok").click(function(){
		uifunc_addnewuser();
	});

	$("#changepsw").click(function(){
		showModifyPsw();
	});

	$("#mpswok").click(function(){
		modifyPsw();
	});
	$("#mpswcancel").click(function(){
		$("#oldpsw").val("");
		$("#newpsw").val("");
		$("#renewpsw").val("");
	});

	$("#changeidc").click(function(){
		showModifyIDC();
	});

	$("#version_set").click(function(){
		showVersionManager();
	});

	$("#group_set").click(function(){
		showGroupManager();
	});

	$("#stream_set").click(function(){
		showStreamManager();
	});

	$("#ch_set").click(function(){
		showCloundCIdManager();
	});

	/*
	 $("#loc_version_set").click(function(){
	 showlocUpgradeManager();
	 });
	 */
	$("#upgrade_version_set").click(function(){
		showUpgradeManager();
	});

	divselect_onchange_onlineuser  = function(){
		var i=$("divselect_onlineuser").selectedIndex;
		var str_address=$("divselect_onlineuser").options[i].value;
		//alert('address is: '+ str_address);
		ipPort_historydata_onlineuser = str_address;
	};
}); // ready


function filterOption( business_line_id,regKey,selectId)
{
	var prepareOption;
	if( 1 == business_line_id )
	{
		prepareOption = p1_business_line;
		addSelectOption(selectId,prepareOption);

	}else if( 2 == business_line_id )
	{
		prepareOption=[];
		prepareOption[0] = p2_business_line[0];

		if(regKey)
		{
			for(var elm=0;elm<p2_business_line.length;elm++)
			{
				if(p2_business_line[elm][0].indexOf(regKey)==0)
				{
					prepareOption.push(p2_business_line[elm]);
				}
			}
		}

		addSelectOption(selectId,prepareOption);

	}else if( 3 == business_line_id )
	{
		prepareOption=[];
		prepareOption[0] = p3_business_line[0];
		if(regKey)
		{
			for(var elm=0;elm<p3_business_line.length;elm++)
			{
				if(p3_business_line[elm][0].indexOf(regKey)==0)
				{
					prepareOption.push(p3_business_line[elm]);
				}
			}
		}

		addSelectOption(selectId,prepareOption);
	}

}

function addSelectOption(selectId,optionList)
{
	$("#"+selectId).empty();

	for(var i=0;i<optionList.length;i++)
	{
		if(3==optionList[i].length){
			$("#"+selectId).append("<option value='"+optionList[i][0]+"' title='"+optionList[i][2]+"'>"+optionList[i][1]+"</option>");
		}else if(2==optionList[i].length){
			$("#"+selectId).append("<option value='"+optionList[i][0]+"'>"+optionList[i][1]+"</option>");
		}
	}

}

var loadDT_historydata_onlineuser = function(){
	var fromdate = $("#fromdatepicker_onlineuser").datepicker("getDate");
	var todate = $("#todatepicker_onlineuser").datepicker("getDate");
	if(fromdate > todate){
		showLoadError("时间开始日期不能大于时间截止日期");
		querygo_onlineuser_able = true;
		return;
	}
	var todateBefore7 = new Date(todate - 7 * 24 * 3600 * 1000);
	if(fromdate < todateBefore7){
		showLoadError("只能查询7天内的数据");
		querygo_onlineuser_able = true;
		return;
	}
	
	var isasday = $("#asday_onlineuser:checked").val();
	var ticks = getDates(fromdate,todate,isasday);
	dt_onlineuser.fnClearTable();

	var dataForDisplay = new Array();
	var objAA=document.getElementById("divselect_onlineuser");
	var iS=objAA.selectedIndex;
	var str_address=objAA.options[iS].value;
	var ipPort_historydata_onlineuser = str_address;

	var valIPPort = ipPort_historydata_onlineuser.split(":");
	var strIp = valIPPort[0];
	var strPort = valIPPort[1];


	var val_divselect_version_onlineuser = -1;

	var val_divselect_cliptype_onlineuser = -1;

	var sel_divselect_idcvar_onlineuser=document.getElementById("divselect_idcvar_onlineuser");
	var index_divselect_idcvar_onlineuser=sel_divselect_idcvar_onlineuser.selectedIndex;
	var val_divselect_idcvar_onlineuser = sel_divselect_idcvar_onlineuser.options[index_divselect_idcvar_onlineuser].value;

//+"&ip=" +strIp +"&port="+strPort + "&typVar="+val_divselect_cliptype_onlineuser + "&verVar="+val_divselect_version_onlineuser
	$.ajax( {
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/hisdata_onlineuser?type=" + (isasday? "day" : "hour") + "&from=" + fromdate.toDateString() +"&to=" + todate.toDateString()
		+"&ip=" +strIp  + "&typVar="+val_divselect_cliptype_onlineuser + "&verVar="+val_divselect_version_onlineuser
		+"&idcVar="+val_divselect_idcvar_onlineuser,
		"beforeSend": function () {
			spinOpen("querygo_onlineuser_spin");
		},
		"complete":function (res, textStatus) {
			spinClose();
		},
		"success":function (res,textStatus) {
			querygo_onlineuser_able = true;
			if(res.result == "success"){

				for (j=0;j< res.data.length; j++){
					dataForDisplay[j] = { '0': res.data[j][0], '1':res.data[j][1], '2': formatMoney(res.data[j][2],0)};
				}

				dt_onlineuser.fnAddData(dataForDisplay);

				var chartData = new Array();
				var chartDataCore = new Array();
				var chartDataX = new Array();
				var chartDataCoreX = new Array();
				var nAxisY = 0;
				var k=0;
				var nTmpVal=0;
				for (k=0;k< res.data.length; k++){
					nTmpVal = res.data[k][2];  // date, time, data
					chartDataCore.push(nTmpVal);
					if( Number(nAxisY) < Number(nTmpVal) )
						nAxisY=nTmpVal;

					//chartDataX.push(Number(k)+1);
					chartDataX.push(res.data[k][1]);

				}
				nAxisY=nAxisY*1.618;
				chartData.push(chartDataCore);

				loadDT_historydata_onlineuser_partTwo(chartData, Number(nAxisY),chartDataX);
			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else if(res.result == "zero"){
				chart_historydata_onlineuser.destroy();
				showLoadError("无相关数据");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};

var loadDT_historydata_onlineuser_partTwo = function (chartDataPara, nMaxY,ticksPara){
	if(chart_historydata_onlineuser){
		chart_historydata_onlineuser.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_historydata_onlineuser = $.jqplot('historydata_onlineuser_chart_div', chartDataNow, {
		stackSeries: true,
		captureRightClick: true,
		title: {
			text: '在线用户数',
			show: true,
		},
		series:[{renderer:$.jqplot.BarRenderer}],
		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 3,
				barPadding: 1,
				highlightMouseOver: true
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px',
			},
			pointLabels: {show: true},
			shadow: false,   // show shadow or not.
		},
		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
		},
		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:0,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				tickOptions: {
					fontSize: '11px'
				},
				pad:1.4,
				min:0,
				autoscale : true,
				numberTicks: 7,
				label:"人数",
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				autoscale : true,
			}
		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd',  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {},   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
	});
};


var loadDT_historydata_nodedistribute = function(){
	var fromdate = $("#fromdatepicker_nodedistribute").datepicker("getDate");
	var todate = $("#todatepicker_nodedistribute").datepicker("getDate");
	if(fromdate > todate){
		showLoadError("时间开始日期不能大于时间截止日期");
		querygo_nodedistribute_able = true;
		return;
	}
	var todateBefore7 = new Date(todate - 7 * 24 * 3600 * 1000);
	if(fromdate < todateBefore7){
		showLoadError("只能查询7天内的数据");
		querygo_nodedistribute_able = true;
		return;
	}
	
	var isasday = $("#asday_nodedistribute:checked").val();
	var ticks = getDates(fromdate,todate,isasday);
	//var chartData;

	dt_nodedistribute.fnClearTable();

	// var val_divselect_version_nodedistribute = -1;
	var sel_divselect_group_nodedistribute=document.getElementById("divselect_group_nodedistribute");
	var index_divselect_group_nodedistribute=sel_divselect_group_nodedistribute.selectedIndex;
	var val_divselect_group_nodedistribute = sel_divselect_group_nodedistribute.options[index_divselect_group_nodedistribute].value;


	var sel_divselect_stream_nodedistribute=document.getElementById("divselect_stream_nodedistribute");
	var index_divselect_stream_nodedistribute=sel_divselect_stream_nodedistribute.selectedIndex;
	var val_divselect_stream_nodedistribute = sel_divselect_stream_nodedistribute.options[index_divselect_stream_nodedistribute].value;

	// var val_divselect_version_nodedistribute = -1;
	var sel_divselect_version_nodedistribute=document.getElementById("divselect_version_nodedistribute");
	var index_divselect_version_nodedistribute=sel_divselect_version_nodedistribute.selectedIndex;
	var val_divselect_version_nodedistribute = sel_divselect_version_nodedistribute.options[index_divselect_version_nodedistribute].value;


	var sel_divselect_cliptype_nodedistribute=document.getElementById("divselect_cliptype_nodedistribute");
	var index_divselect_cliptype_nodedistribute=sel_divselect_cliptype_nodedistribute.selectedIndex;
	var val_divselect_cliptype_nodedistribute = sel_divselect_cliptype_nodedistribute.options[index_divselect_cliptype_nodedistribute].value;



	var sel_divselect_idcvar_nodedistribute=document.getElementById("divselect_idcvar_nodedistribute");
	var index_divselect_idcvar_nodedistribute=sel_divselect_idcvar_nodedistribute.selectedIndex;
	var val_divselect_idcvar_nodedistribute = sel_divselect_idcvar_nodedistribute.options[index_divselect_idcvar_nodedistribute].value;

	var terminalId = $("#node_terminal").val();
	var appid = $("#node_appid").val();
	var methods = $("#node_methods").val();
	var p = $("#divselect_p_nodedistribute").val();
	var agree = $("#node_agree").val();
	var protocol = $("#divselect_protocol_nodedistribute").val();
	var country= $("#node_country").val();
	var province= $("#node_province").val();
	//+"&agree="+agree

	$.ajax( {
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/hisdata_nodedistribute?type=" + (isasday? "min" : "hour") + "&from=" + fromdate.toDateString() +"&to=" + todate.toDateString()
		+ "&typVar="+val_divselect_cliptype_nodedistribute + "&verVar="+val_divselect_version_nodedistribute+"&idcVar="+val_divselect_idcvar_nodedistribute
		+ "&gid="+val_divselect_group_nodedistribute+"&terminalId="+terminalId+"&appid="+appid+"&methods="+methods+"&p="+p+"&protocol="+protocol+"&agree="+agree
		+"&sid="+val_divselect_stream_nodedistribute+"&country="+country+"&province="+province,
		"beforeSend": function () {
			spinOpen("querygo_nodedistribute_spin");
		},
		"complete":function (res, textStatus) {
			spinClose();
		},
		"success":function (res,textStatus) {
			querygo_nodedistribute_able = true;
			if(res.result == "success"){
				dt_nodedistribute.fnAddData(res.data);

				var chartData = new Array();
				var chartData_partThree = new Array();

				var chartData_partFour = new Array();
				var chartDataCore_partFour = new Array();

				var chartDataCore = new Array();
				var chartDataX = new Array();
				var chartDataCoreX = new Array();
				var nAxisY = 0;
				var k=0;
				var nTmpVal=0;

				var chartDataCore_Z = new Array();
				var chartDataCore_A = new Array();
				var chartDataCore_B = new Array();
				var chartDataCore_C = new Array();
				var chartDataCore_D = new Array();
				var chartDataCore_E = new Array();
				var chartDataCore_F = new Array();
				var chartDataCore_G = new Array();
				var chartDataCore_H = new Array();
				var chartDataCore_I = new Array();

				//chartData = res.data;
				for (k=0;k< res.data.length; k++){
					nTmpVal = res.data[k][11];

					var nTheValue = nTmpVal;

					chartDataCore.push( parseInt(nTheValue));
					if( Number(nAxisY) < Number(nTmpVal) )
						nAxisY=nTmpVal;

					chartDataCore_partFour.push( parseInt(nTheValue)/20 );
					//alert(res.data[k][0]);
					//chartDataX.push(res.data[k][0]);

					//chartDataX.push(Number(k)+1);
					var strDateAndTime =  res.data[k][0];
					var strTmpArray = strDateAndTime.split(' ');
					var strTimeFull = strTmpArray[1];
					var strTimeHour = strTimeFull.split(':');
					chartDataX.push(strTimeHour[0]);


					chartDataCore_Z.push( parseInt(res.data[k][1]));
					chartDataCore_A.push( parseInt(res.data[k][2]));
					chartDataCore_B.push( parseInt(res.data[k][3]));
					chartDataCore_C.push( parseInt(res.data[k][4]));
					chartDataCore_D.push( parseInt(res.data[k][5]));
					chartDataCore_E.push( parseInt(res.data[k][6]));
					chartDataCore_F.push( parseInt(res.data[k][7]));
					chartDataCore_G.push( parseInt(res.data[k][8]));
					chartDataCore_H.push( parseInt(res.data[k][9]));

					var tmpRemain = 100 - (Number( parseInt(res.data[k][1]))+Number( parseInt(res.data[k][2]))+Number( parseInt(res.data[k][3]))+Number( parseInt(res.data[k][4]))+Number( parseInt(res.data[k][5]))+Number( parseInt(res.data[k][6]))+Number( parseInt(res.data[k][7]))+Number( parseInt(res.data[k][8]))+Number( parseInt(res.data[k][9])));
					chartDataCore_I.push( tmpRemain);
				}
				nAxisY=nAxisY*1.618;
				chartData.push(chartDataCore);

				chartData_partFour.push(chartDataCore_partFour);

				chartData_partThree.push(chartDataCore_Z);
				chartData_partThree.push(chartDataCore_A);
				chartData_partThree.push(chartDataCore_B);
				chartData_partThree.push(chartDataCore_C);
				chartData_partThree.push(chartDataCore_D);
				chartData_partThree.push(chartDataCore_E);
				chartData_partThree.push(chartDataCore_F);
				chartData_partThree.push(chartDataCore_G);
				chartData_partThree.push(chartDataCore_H);
				chartData_partThree.push(chartDataCore_I);

				loadDT_historydata_nodedistribute_partTwo(chartData, chartDataX);
				loadDT_historydata_nodedistribute_partThree(chartData_partThree, chartDataX);
				loadDT_historydata_nodedistribute_partFour(chartData_partFour, chartDataX);

			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else if(res.result == "zero"){
				showLoadError("无相关数据");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};

var loadDT_historydata_nodedistribute_partTwo = function (chartDataPara, ticksPara){
	if(chart_historydata_nodedistribute){
		chart_historydata_nodedistribute.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_historydata_nodedistribute = $.jqplot('historydata_nodedistribute_chart_div', chartDataNow, {

		stackSeries: true,
		captureRightClick: true,

		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				//barMargin: 20,
				highlightMouseOver: true,
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '12px',
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			lineWidth: 3, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 8,            // 数据点的大小
			},
		},

		title: {
			text: '心跳次数统计',   // title for the plot,
			show: true,
		},

		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},

		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:0,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				pad:1.4,
				min:0,
				//max:50000000,
				//ticks: [60, 65, 70, 75, 80],
				numberTicks: 11,
				label:"心跳上报次数",
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
				//tickOptions: {formatString:'%.1f%'},
			},

		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			sizeAdjust: 6, // 当鼠标移动到数据点上时，数据点扩大的增量增量
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td>心跳数：</td><td>%s , %s</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};


var loadDT_historydata_nodedistribute_partFour = function (chartDataPara, ticksPara){
	if(chart_historydata_nodedistribute_partFour){
		chart_historydata_nodedistribute_partFour.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_historydata_nodedistribute_partFour = $.jqplot('historydata_nodedistribute_partFour_chart_div', chartDataNow, {

		stackSeries: true,
		captureRightClick: true,

		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				//barMargin: 20,
				highlightMouseOver: true,
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '12px',
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			lineWidth: 3, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 8,            // 数据点的大小
			},
		},

		title: {
			text: '在线人数统计',   // title for the plot,
			show: true,
		},

		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},

		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:0,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				pad:1.4,
				min:0,
				//max:50000000,
				//ticks: [60, 65, 70, 75, 80],
				numberTicks: 11,
				label:"人数",
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
				//tickOptions: {formatString:'%.1f%'},
			},

		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			sizeAdjust: 6, // 当鼠标移动到数据点上时，数据点扩大的增量增量
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td>人数：</td><td>%s , %s</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};

//节点分布图表
var loadDT_historydata_nodedistribute_partThree = function (chartDataPara, ticksPara){
	if(chart_historydata_nodedistribute_partThree){
		chart_historydata_nodedistribute_partThree.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_historydata_nodedistribute_partThree = $.jqplot('historydata_nodedistribute_partThree_chart_div', chartDataNow, {

		stackSeries: true,
		captureRightClick: true,
		seriesColors: [ "#000","#808080", "#b92d5d", "#e63b7a","#ff6251", "#ff8647", "#fec700","#f5ec00", "#c3d117", "#77bb41"],
		series:[
			{label:'未连接'},
			{label:'禁用p2p'},
			{label:'0节点'},
			{label:'2节点'},
			{label:'4节点'},
			{label:'6节点'},
			{label:'8节点'},
			{label:'10节点'},
			{label:'12节点'},
			{label:'14节点以上'},
		],

		seriesDefaults:{
			renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				//barMargin: 20,
				highlightMouseOver: true,
				barMargin: 3,
				barPadding: 1,
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '12px',
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			markerOptions: {
				show: true,          // wether to show data point markers.
				shadow: false,       // wether to draw shadow on marker or not.
			},
		},

		title: {
			text: '节点分布统计',   // title for the plot,
			show: true,
		},

		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},

		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:0,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				//pad:1.4,
				min:0,
				max:100,
				numberTicks: 11,
				label:"百分比",
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.0f %'},
			},

		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		legend: {
			show: true,			//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'ne',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 20,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			textColor:'#000' ,         //分类名称框距图表区域内字体颜色
			placement: 'outsideGrid',
		},
		highlighter: {
			show: true,
			showMarker:false,
			tooltipAxes: 'xy',
			yvalues: 1,
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td><tr>比例：</tr></td><td>%s , %s %</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};

//P2P下载率历史数据
var loadDT_historydata_ptopratio = function(){
	var fromdate = $("#fromdatepicker_ptopratio").datepicker("getDate");
	var todate = $("#todatepicker_ptopratio").datepicker("getDate");

	if(fromdate > todate){
		showLoadError("时间开始日期不能大于时间截止日期");
		querygo_ptopratio_able = true;
		return;
	}
	var todateBefore7 = new Date(todate - 7 * 24 * 3600 * 1000);
	if(fromdate < todateBefore7){
		querygo_ptopratio_able = true;
		showLoadError("只能查询7天内的数据");
		return;
	}

	var isasday = $("#asday_ptopratio:checked").val();
	var ticks = getDates(fromdate,todate,isasday);
	//var chartData;

	dt_ptopratio.fnClearTable();

	var sel_divselect_group_ptopratio=document.getElementById("divselect_group_ptopratio");
	var index_divselect_group_ptopratio=sel_divselect_group_ptopratio.selectedIndex;
	var val_divselect_group_ptopratio = sel_divselect_group_ptopratio.options[index_divselect_group_ptopratio].value;

	var sel_divselect_stream_ptopratio=document.getElementById("divselect_stream_ptopratio");
	var index_divselect_stream_ptopratio=sel_divselect_stream_ptopratio.selectedIndex;
	var val_divselect_stream_ptopratio = sel_divselect_stream_ptopratio.options[index_divselect_stream_ptopratio].value;

	//var val_divselect_version_ptopratio = -1;
	var sel_divselect_version_ptopratio=document.getElementById("divselect_version_ptopratio");
	var index_divselect_version_ptopratio=sel_divselect_version_ptopratio.selectedIndex;
	var val_divselect_version_ptopratio = sel_divselect_version_ptopratio.options[index_divselect_version_ptopratio].value;

	var sel_divselect_cliptype_ptopratio=document.getElementById("divselect_cliptype_ptopratio");
	var index_divselect_cliptype_ptopratio=sel_divselect_cliptype_ptopratio.selectedIndex;
	var val_divselect_cliptype_ptopratio = sel_divselect_cliptype_ptopratio.options[index_divselect_cliptype_ptopratio].value;

	var sel_divselect_idcvar_ptopratio=document.getElementById("divselect_idcvar_ptopratio");
	var index_divselect_idcvar_ptopratio=sel_divselect_idcvar_ptopratio.selectedIndex;
	var val_divselect_idcvar_ptopratio = sel_divselect_idcvar_ptopratio.options[index_divselect_idcvar_ptopratio].value;

	var terminalId = $("#p2p_terminal").val();
	var platid= $("#p2p_platid").val();
	var splatid= $("#p2p_splatid").val();
	var appid= $("#p2p_appid").val();
	var country= $("#p2p_country").val();
	var province= $("#p2p_province").val();
	var methods= $("#p2p_methods").val();
	var p= $("#divselect_p_ptopratio").val();
	var ch= $("#share_select_items_ch").val();
	var p1= $("#share_select_items_p1").val();
	var p2= $("#share_select_items_p2").val();
	var p3= $("#share_select_items_p3").val();
	$.ajax( {
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/hisdata_ptopratio?type=" + (isasday? "min" : "hour") + "&from=" + fromdate.toDateString() +"&to=" + todate.toDateString()
		+ "&typVar="+val_divselect_cliptype_ptopratio + "&verVar="+val_divselect_version_ptopratio+"&idcVar="+val_divselect_idcvar_ptopratio
		+ "&gid="+val_divselect_group_ptopratio+"&terminalId="+terminalId+"&platid="+platid+"&splatid="+splatid+"&appid="+appid+"&methods="+methods
		+ "&p="+p+"&sid="+val_divselect_stream_ptopratio+"&ch="+ch
		+"&p1="+p1+"&p2="+p2+"&p3="+p3+"&country="+country+"&province="+province,
		"beforeSend": function () {
			spinOpen("querygo_ptopratio_spin");
		},
		"complete":function (res, textStatus) {
			spinClose();
		},
		"success":function (res,textStatus) {
			querygo_ptopratio_able = true;
			if(res.result == "success"){
				dt_ptopratio.fnAddData(res.data);

				var chartData = new Array();
				var chartDataCore = new Array();
				var chartDataX = new Array();
				var chartDataCoreX = new Array();
				var nAxisY = 0;
				var k=0;
				var nTmpVal=0;
				var chartData_partThree_ = new Array();
				var chartData_partThree_CoreOne = new Array();
				var chartData_partThree_CoreTwo = new Array();
				var chartData_partThree_CoreThree = new Array();

				var nAxisY_partThree_partThree = 0;
				var nTmpVal_partThree=0;
				var nCompensate = 0.1;

				//chartData = res.data;
				for (k=0;k< res.data.length; k++){
					nTmpVal = res.data[k][24];
					var nTheValue = nTmpVal.split('%');
					chartDataCore.push( parseFloat(nTheValue[0]) + Number(nCompensate) );

					chartData_partThree_CoreOne.push( parseFloat(res.data[k][22]));
					chartData_partThree_CoreTwo.push( parseFloat(res.data[k][23])); // + parseFloat(res.data[k][7])   );

					//chartData_partThree_CoreTwo.push( parseFloat(res.data[k][8]) - parseFloat(res.data[k][7])   );
					//chartData_partThree_CoreThree.push(   parseFloat(res.data[k][7])      );

					if( Number(nAxisY) < Number(nTmpVal) )
						nAxisY=nTmpVal;

					var strDateAndTime =  res.data[k][0];
					var strTmpArray = strDateAndTime.split(' ');
					var strTimeFull = strTmpArray[1];
					var strTimeHour = strTimeFull.split(':');

					chartDataX.push(strTimeHour[0]);
				}

				//nAxisY=nAxisY*1.618;
				chartData.push(chartDataCore);

				chartData_partThree_.push(chartData_partThree_CoreOne);
				chartData_partThree_.push(chartData_partThree_CoreTwo);
				//chartData_partThree_.push(chartData_partThree_CoreThree);

				loadDT_historydata_ptopratio_partTwo(chartData, Number(nAxisY),chartDataX);
				loadDT_historydata_ptopratio_partThree(chartData_partThree_,  chartDataX);


			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else if(res.result == "zero"){
				showLoadError("无相关数据");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};

//P2P下载率图表开始
var loadDT_historydata_ptopratio_partTwo = function (chartDataPara, nMaxY,ticksPara){
	if(chart_historydata_ptopratio){
		chart_historydata_ptopratio.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_historydata_ptopratio = $.jqplot('historydata_ptopratio_chart_div', chartDataNow, {

		stackSeries: true,
		captureRightClick: true,

		seriesColors: [ "#22ac38", "#c5b47f", "#EAA228"],

		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 20,
				highlightMouseOver: true
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px',
			},
			pointLabels: {show: false},
			tickOptions: {formatString:'%.1f%'},
			shadow: false,   // show shadow or not.
			lineWidth: 3, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 8,            // 数据点的大小
			},
		},

		title: {
			text: 'P2P下载率统计图表',   // title for the plot,
			show: true,
		},

		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},

		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:0,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				pad:1.4,
				min:0,
				//max:80,
				numberTicks: 11,
				label:"P2P下载率（%）",
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.1f%'},
			},

		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			sizeAdjust: 6, // 当鼠标移动到数据点上时，数据点扩大的增量增量
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td>下载率：</td><td>%s , %s %</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};
//P2P下载率图表结束

//带宽图表
var loadDT_historydata_ptopratio_partThree = function (chartDataPara, ticksPara){
	if(chart_historydata_ptopratio_partThree){
		chart_historydata_ptopratio_partThree.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_historydata_ptopratio_partThree = $.jqplot('historydata_ptopratio_partThree_chart_div', chartDataNow, {

		stackSeries: true,
		captureRightClick: true,

		seriesColors: [ "#3b6c9d", "#6ea45a", "#EAA228"],
		series:[
			{label:'CDN带宽 (实际使用)'},
			{label:'P2P带宽 (节省带宽)'},
			{label:'总带宽 (理论带宽)'},
		],

		seriesDefaults:{
			renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				// Put a 30 pixel margin between bars.
				barMargin: 3,
				barPadding: 1,
				// Highlight bars when mouse button pressed.
				// Disables default highlighting on mouse over.
				highlightMouseOver: true
			},
			pointLabels: {show: false,},

			shadow: false,   // show shadow or not.
			markerOptions: {
				show: true,             // wether to show data point markers.
				shadow: false,       // wether to draw shadow on marker or not.
			},
		},

		title: {
			text: 'CDN、P2P带宽统计图表',   // title for the plot,
			show: true,
		},

		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},

		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:0,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				pad:1.4,
				min:0,
				//max:1000,
				numberTicks: 11,
				label:"带宽（G bps）",
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.2f G'},
			},

		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		legend: {
			show: true,//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'nw',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 120,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			textColor:'#000' ,         //分类名称框距图表区域内字体颜色
			//placement: 'outsideGrid',

		},
		highlighter: {
			show: true,
			showMarker:false,
			tooltipAxes: 'xy',
			yvalues: 1,
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td>带宽：</td><td>%s , %s G</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};


var loadDT_historydata_filmduration = function(){
	var fromdate = $("#fromdatepicker_filmduration").datepicker("getDate");
	var todate = $("#todatepicker_filmduration").datepicker("getDate");

	if(fromdate > todate){
		querygo_filmduration_able = true;
		showLoadError("时间开始日期不能大于时间截止日期");
		return;
	}
	var todateBefore7 = new Date(todate - 7 * 24 * 3600 * 1000);
	if(fromdate < todateBefore7){
		querygo_filmduration_able = true;
		showLoadError("只能查询7天内的数据");
		return;
	}

	var isasday = $("#asday_filmduration:checked").val();
	var ticks = getDates(fromdate,todate,isasday);
	//var chartData;

	dt_filmduration.fnClearTable();

	var objAA=document.getElementById("divselect_filmduration");
	var iS=objAA.selectedIndex;
	var str_address=objAA.options[iS].value;
	var ipPort_historydata_filmduration = str_address;


	//var val_divselect_version_stagequality = -1;
	var sel_divselect_version_filmduration=document.getElementById("divselect_version_filmduration");
	var index_divselect_version_filmduration=sel_divselect_version_filmduration.selectedIndex;
	var val_divselect_version_filmduration = sel_divselect_version_filmduration.options[index_divselect_version_filmduration].value;


	//var val_divselect_cliptype_filmduration = -1;
	var sel_divselect_cliptype_filmduration=document.getElementById("divselect_cliptype_filmduration");
	var index_divselect_cliptype_filmduration=sel_divselect_cliptype_filmduration.selectedIndex;
	var val_divselect_cliptype_filmduration = sel_divselect_cliptype_filmduration.options[index_divselect_cliptype_filmduration].value;

	//filmduration_terminal
	var appid= $("#filmduration_appid").val();
	var terminalId = $("#filmduration_terminal").val();
	var country = $("#filmduration_country").val();
	var province = $("#filmduration_province").val();

	var valIPPort = ipPort_historydata_filmduration.split(":");
	var strIp = valIPPort[0];
	var strPort = valIPPort[1];
	//+"&ip=" +strIp +"&port="+strPort
	$.ajax( {
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/hisdata_filmduration?type=" + (isasday? "min" : "hour") + "&from=" + fromdate.toDateString() +"&to=" + todate.toDateString()
		+ "&typVar="+val_divselect_cliptype_filmduration + "&verVar="+val_divselect_version_filmduration+"&terminalId="+terminalId
		+"&appid="+appid+"&country="+country+"&province="+province,
		"beforeSend": function () {
			spinOpen("querygo_filmduration_spin");
		},
		"complete":function (res, textStatus) {
			spinClose();
		},
		"success":function (res,textStatus) {
			querygo_filmduration_able = true;
			if(res.result == "success"){
				dt_filmduration.fnAddData(res.data);

				var chartDataX = new Array();
				var k=0;
				var chartData_Beat = new Array();
				var chartData_Beat_A = new Array();
				var chartData_Beat_B = new Array();
				var chartData_Beat_C = new Array();
				var chartData_Beat_D = new Array();
				var chartData_Beat_E = new Array();
				var chartData_Beat_F = new Array();

				var chartData_Share = new Array();
				var chartData_Share_A = new Array();
				var chartData_Share_B = new Array();
				var chartData_Share_C = new Array();
				var chartData_Share_D = new Array();
				var chartData_Share_E = new Array();
				var chartData_Share_F = new Array();

				for (k=0;k< res.data.length; k++){
					var strDateAndTime =  res.data[k][0];
					var strTmpArray = strDateAndTime.split(' ');
					var strTimeFull = strTmpArray[1];
					var strTimeHour = strTimeFull.split(':');
					chartDataX.push(strTimeHour[0]);

					chartData_Beat_A.push( parseFloat(res.data[k][2])  );
					chartData_Beat_B.push( parseFloat(res.data[k][4])  );
					chartData_Beat_C.push( parseFloat(res.data[k][6])  );
					chartData_Beat_D.push( parseFloat(res.data[k][8])  );
					chartData_Beat_E.push( parseFloat(res.data[k][10])  );
					chartData_Beat_F.push( parseFloat(res.data[k][12])  );

					chartData_Share_A.push( parseFloat(res.data[k][1])  );
					chartData_Share_B.push( parseFloat(res.data[k][3]));
					chartData_Share_C.push( parseFloat(res.data[k][5]) );
					chartData_Share_D.push( parseFloat(res.data[k][7]));
					chartData_Share_E.push( parseFloat(res.data[k][9]));
					chartData_Share_F.push( parseFloat(res.data[k][11]));
				}

				chartData_Beat.push(chartData_Beat_A );
				chartData_Beat.push(chartData_Beat_B );
				chartData_Beat.push(chartData_Beat_C );
				chartData_Beat.push(chartData_Beat_D );
				chartData_Beat.push(chartData_Beat_E );
				chartData_Beat.push(chartData_Beat_F );

				chartData_Share.push(chartData_Share_A );
				chartData_Share.push(chartData_Share_B );
				chartData_Share.push(chartData_Share_C );
				chartData_Share.push(chartData_Share_D );
				chartData_Share.push(chartData_Share_E );
				chartData_Share.push(chartData_Share_F );


				loadDT_historydata_filmduration_Beat(chartData_Beat, chartDataX);
				loadDT_historydata_filmduration_Share(chartData_Share, chartDataX);

			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else if(res.result == "zero"){
				showLoadError("无相关数据");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};

var loadDT_historydata_filmduration_Beat = function (chartDataPara, ticksPara){
	if(chart_historydata_filmduration_Beat){
		chart_historydata_filmduration_Beat.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_historydata_filmduration_Beat = $.jqplot('historydata_filmduration_Beat_chart_div', chartDataNow, {

		stackSeries: true,
		captureRightClick: true,
		seriesColors: [ "#f26c4f", "#f9af5d", "#abd373", "#3bb878", "#3ebef3", "#5574b9", "#8560a9", "#f06ea9"],
		series:[
			{label:'0-5'},
			{label:'5-15'},
			{label:'15-30'},
			{label:'30-60'},
			{label:'60-120'},
			{label:'>=120'},
		],

		seriesDefaults:{
			renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				//barMargin: 20,
				highlightMouseOver: true,
				barMargin: 3,
				barPadding: 1,
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '12px',
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			lineWidth: 1.5, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 2,            // 数据点的大小
			},
		},

		title: {
			text: '各时长心跳数比率',   // title for the plot,
			show: true,
		},

		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},

		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:0,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},

			yaxis: {
				labelOptions:{fontSize:10},
				//pad:1.4,
				min:0,
				max:100,
				label:"心跳次数比率",
				autoscale : true,
				numberTicks: 7,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.1f %'},
			}

		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		legend: {
			show: true,			//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'e',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 5,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			textColor:'#000' ,         //分类名称框距图表区域内字体颜色
			placement: 'outsideGrid',
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			sizeAdjust: 5, // 当鼠标移动到数据点上时，数据点扩大的增量增量
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td>心跳：</td><td>%s , %s</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};

var loadDT_historydata_filmduration_Share = function (chartData_Share, ticksPara) {
	if(chart_historydata_filmduration_Share){
		chart_historydata_filmduration_Share.destroy();
	}
	var chartDataNow = chartData_Share;
	chart_historydata_filmduration_Share = $.jqplot('historydata_filmduration_Share_chart_div', chartDataNow, {
		stackSeries: false,
		captureRightClick: true,
		title: {
			text: '各时长下载率',
			show: true,
		},

		seriesColors: [ "#f26c4f", "#f9af5d", "#abd373", "#3bb878", "#3ebef3", "#5574b9", "#8560a9", "#f06ea9"],
		series:[
			{label:'0-5'},
			{label:'5-15'},
			{label:'15-30'},
			{label:'30-60'},
			{label:'60-120'},
			{label:'>=120'},
		],

		seriesDefaults:{
			rendererOptions: {
				barMargin: 3,
				barPadding: 1,
				highlightMouseOver: true
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px',
			},

			pointLabels: {show: false},
			tickOptions: {formatString:'%.2f%'},
			shadow: false,   // show shadow or not.
			lineWidth: 2, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 4,            // 数据点的大小
			},
		},
		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
		},
		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,

			xaxis: {
				//	pad:1.01,
				min:0,
				//	tickOptions: {
				//		showGridline: true
				//	}
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				tickOptions: {
					fontSize: '11px'
				},
				pad:1.4,
				min:0,
				autoscale : true,
				numberTicks: 7,
				label:"下载率",
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				tickOptions: {formatString:'%.1f%'},
			}
		},
		legend: {
			show: true,			//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'e',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 1,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			rowSpacing:'0px' ,         //分类名称框距图表区域内字体颜色
			placement: 'outsideGrid',
			rendererOptions: {
				// set to true to replot when toggling series on/off
				// set to an options object to pass in replot options.
				seriesToggle: 'normal',
				seriesToggleReplot: {resetAxes: true}
			}
		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd',  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {},   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			sizeAdjust: 6, // 当鼠标移动到数据点上时，数据点扩大的增量增量
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td>下载率：</td><td>%s , %s %</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};


var loadDT_historydata_videobitrate = function(){
	var fromdate = $("#fromdatepicker_videobitrate").datepicker("getDate");
	var todate = $("#todatepicker_videobitrate").datepicker("getDate");

	//var fromdateStr = (fromdate.toDateString()).replace(" ","-");
	//var todateStr = (todate.toDateString()).replace(" ","-");

	if(fromdate > todate){
		showLoadError("时间开始日期不能大于时间截止日期");
		querygo_videobitrate_able = true;
		return;
	}
	var todateBefore7 = new Date(todate - 7 * 24 * 3600 * 1000);
	if(fromdate < todateBefore7){
		querygo_videobitrate_able = true;
		showLoadError("只能查询7天内的数据");
		return;
	}

	var isasday = $("#asday_videobitrate:checked").val();
	var ticks = getDates(fromdate,todate,isasday);
	//var chartData;

	dt_videobitrate.fnClearTable();

	var objAA=document.getElementById("divselect_videobitrate");
	var iS=objAA.selectedIndex;
	var str_address=objAA.options[iS].value;
	var ipPort_historydata_videobitrate = str_address;


	//var val_divselect_version_videobitrate = -1;
	var sel_divselect_version_videobitrate=document.getElementById("divselect_version_videobitrate");
	var index_divselect_version_videobitrate=sel_divselect_version_videobitrate.selectedIndex;
	var val_divselect_version_videobitrate = sel_divselect_version_videobitrate.options[index_divselect_version_videobitrate].value;


	//var val_divselect_cliptype_videobitrate = -1;
	var sel_divselect_cliptype_videobitrate=document.getElementById("divselect_cliptype_videobitrate");
	var index_divselect_cliptype_videobitrate=sel_divselect_cliptype_videobitrate.selectedIndex;
	var val_divselect_cliptype_videobitrate = sel_divselect_cliptype_videobitrate.options[index_divselect_cliptype_videobitrate].value;

	//videobitrate_terminal
	var appid= $("#videobitrate_appid").val();
	var terminalId = $("#videobitrate_terminal").val();

	//videobitrate_protocol
	var protocolId = $("#videobitrate_protocol").val();
	var country = $("#videobitrate_country").val();
	var province = $("#videobitrate_province").val();

	var valIPPort = ipPort_historydata_videobitrate.split(":");
	var strIp = valIPPort[0];
	var strPort = valIPPort[1];
	//+"&ip=" +strIp +"&port="+strPort
	$.ajax( {
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/hisdata_videobitrate?type=" + (isasday? "min" : "hour") + "&from=" + fromdate.toDateString() +"&to=" + todate.toDateString()
		+ "&typVar="+val_divselect_cliptype_videobitrate + "&verVar="+val_divselect_version_videobitrate+"&terminalId="+terminalId
		+"&protocolId="+protocolId+"&appid="+appid+"&country="+country+"&province="+province,
		"beforeSend": function () {
			spinOpen("querygo_videobitrate_spin");
		},
		"complete":function (res, textStatus) {
			spinClose();
		},

		"success":function (res,textStatus) {
			querygo_videobitrate_able = true;
			if(res.result == "success"){
				dt_videobitrate.fnAddData(res.data);

				var chartDataX = new Array();
				var k=0;
				var chartData_Beat = new Array();
				var chartData_Beat_A = new Array();
				var chartData_Beat_B = new Array();
				var chartData_Beat_C = new Array();
				var chartData_Beat_D = new Array();
				var chartData_Beat_E = new Array();
				var chartData_Beat_F = new Array();
				var chartData_Beat_G = new Array();
				var chartData_Beat_H = new Array();

				var chartData_Share = new Array();
				var chartData_Share_A = new Array();
				var chartData_Share_B = new Array();
				var chartData_Share_C = new Array();
				var chartData_Share_D = new Array();
				var chartData_Share_E = new Array();
				var chartData_Share_F = new Array();
				var chartData_Share_G = new Array();
				var chartData_Share_H = new Array();
				var nCompensate = 0.1;
				var Share_A = new Array();
				var Share_B = new Array();
				var Share_C = new Array();
				var Share_D = new Array();
				var Share_E = new Array();
				var Share_F = new Array();
				var Share_G = new Array();
				var Share_H = new Array();

				for (k=0;k< res.data.length; k++){
					var strDateAndTime =  res.data[k][0];
					var strTmpArray = strDateAndTime.split(' ');
					var strTimeFull = strTmpArray[1];
					var strTimeHour = strTimeFull.split(':');
					chartDataX.push(strTimeHour[0]);

					chartData_Beat_A.push( parseFloat(res.data[k][2])  );
					chartData_Beat_B.push( parseFloat(res.data[k][4])  );
					chartData_Beat_C.push( parseFloat(res.data[k][6])  );
					chartData_Beat_D.push( parseFloat(res.data[k][8])  );
					chartData_Beat_E.push( parseFloat(res.data[k][10])  );
					chartData_Beat_F.push( parseFloat(res.data[k][12])  );
					chartData_Beat_G.push( parseFloat(res.data[k][14])  );
					chartData_Beat_H.push( parseFloat(res.data[k][16])  );

					chartData_Share_A.push( parseFloat(res.data[k][1])  );
					chartData_Share_B.push( parseFloat(res.data[k][3]));
					chartData_Share_C.push( parseFloat(res.data[k][5]) );
					chartData_Share_D.push( parseFloat(res.data[k][7]));
					chartData_Share_E.push( parseFloat(res.data[k][9]));
					chartData_Share_F.push( parseFloat(res.data[k][11]));
					chartData_Share_G.push( parseFloat(res.data[k][13]));
					chartData_Share_H.push( parseFloat(res.data[k][15]));
				}

				chartData_Beat.push(chartData_Beat_A );
				chartData_Beat.push(chartData_Beat_B );
				chartData_Beat.push(chartData_Beat_C );
				chartData_Beat.push(chartData_Beat_D );
				chartData_Beat.push(chartData_Beat_E );
				chartData_Beat.push(chartData_Beat_F );
				chartData_Beat.push(chartData_Beat_G );
				chartData_Beat.push(chartData_Beat_H );

				chartData_Share.push(chartData_Share_A );
				chartData_Share.push(chartData_Share_B );
				chartData_Share.push(chartData_Share_C );
				chartData_Share.push(chartData_Share_D );
				chartData_Share.push(chartData_Share_E );
				chartData_Share.push(chartData_Share_F );
				chartData_Share.push(chartData_Share_G );
				chartData_Share.push(chartData_Share_H );

				loadDT_historydata_videobitrate_Beat(chartData_Beat, chartDataX);
				loadDT_historydata_videobitrate_Share(chartData_Share, chartDataX);

			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else if(res.result == "zero"){
				showLoadError("无相关数据");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};

//视频码率心跳统计
var loadDT_historydata_videobitrate_Beat = function (chartDataPara, ticksPara){
	if(chart_historydata_videobitrate_Beat){
		chart_historydata_videobitrate_Beat.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_historydata_videobitrate_Beat = $.jqplot('historydata_videobitrate_Beat_chart_div', chartDataNow, {

		stackSeries: true,
		captureRightClick: true,
		seriesColors: [ "#f26c4f", "#f9af5d", "#abd373", "#3bb878", "#3ebef3", "#5574b9", "#8560a9", "#f06ea9"],
		series:[
			{label:'180K'},
			{label:'350K'},
			{label:'800K'},
			{label:'1300K'},
			{label:'720P'},
			{label:'1080P 3M'},
			{label:'1080P 6M'},
			{label:'4K'},
		],

		seriesDefaults:{
			renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				// barMargin: 30,
				highlightMouseOver: true,
				barMargin: 3,
				barPadding: 1,
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '12px',
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			markerOptions: {
				show: true,          // wether to show data point markers.
				shadow: false,       // wether to draw shadow on marker or not.
			},
		},

		title: {
			text: '各码率心跳数比例',   // title for the plot,
			show: true,
		},

		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},

		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:0,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},

			yaxis: {
				labelOptions:{fontSize:10},
				// pad:1.4,
				min:0,
				max:100,
				label:"心跳次数比例",
				autoscale : true,
				numberTicks: 7,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.1f %'},
			},
		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},

		legend: {
			show: true,			//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'e',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 5,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			textColor:'#000' ,         //分类名称框距图表区域内字体颜色
			placement: 'outsideGrid',
		},
		highlighter: {
			show: true,
			showMarker:false,
			tooltipAxes: 'y',
			yvalues: 1,
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td>心跳：</td><td>%s , %s</td></tr></table>'
		},
	})
};

var loadDT_historydata_videobitrate_Share = function (chartData_Share, ticksPara) {
	if(chart_historydata_videobitrate_Share){
		chart_historydata_videobitrate_Share.destroy();
	}
	var chartDataNow = chartData_Share;
	chart_historydata_videobitrate_Share = $.jqplot('historydata_videobitrate_Share_chart_div', chartDataNow, {
		stackSeries: false,
		captureRightClick: true,
		title: {
			text: '各码率下载率',
			show: true,
		},

		seriesColors: [ "#f26c4f", "#f9af5d", "#abd373", "#3bb878", "#3ebef3", "#5574b9", "#8560a9", "#f06ea9"],
		series:[
			{label:'180K'},
			{label:'350K'},
			{label:'800K'},
			{label:'1300K'},
			{label:'720P'},
			{label:'1080P 3M'},
			{label:'1080P 6M'},
			{label:'4K'},
		],

		seriesDefaults:{
			rendererOptions: {
				barMargin: 3,
				barPadding: 1,
				highlightMouseOver: true
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px',
			},

			pointLabels: {show: false},
			tickOptions: {formatString:'%.2f%'},
			shadow: false,   // show shadow or not.
			lineWidth: 1.5, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 4,            // 数据点的大小
			},
		},
		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
		},
		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,

			xaxis: {
				//	pad:1.01,
				min:0,
				//	tickOptions: {
				//		showGridline: true
				//	}
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				tickOptions: {
					fontSize: '11px'
				},
				pad:1.4,
				min:0,
				autoscale : true,
				numberTicks: 7,
				label:"下载率",
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				tickOptions: {formatString:'%.1f%'},
			}
		},
		legend: {
			show: true,			//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'e',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 1,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			rowSpacing:'0px' ,         //分类名称框距图表区域内字体颜色
			placement: 'outsideGrid',
			rendererOptions: {
				// set to true to replot when toggling series on/off
				// set to an options object to pass in replot options.
				seriesToggle: 'normal',
				seriesToggleReplot: {resetAxes: true}
			}
		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd',  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {},   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			sizeAdjust: 6, // 当鼠标移动到数据点上时，数据点扩大的增量增量
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td>下载率：</td><td>%s , %s %</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};

var loadDT_historydata_pl = function(){
	var fromdate = $("#fromdatepicker_pl").datepicker("getDate");
	var todate = $("#todatepicker_pl").datepicker("getDate");

	if(fromdate > todate){
		showLoadError("时间开始日期不能大于时间截止日期");
		querygo_pl_able = true;
		return;
	}
	var todateBefore7 = new Date(todate - 7 * 24 * 3600 * 1000);
	if(fromdate < todateBefore7){
		querygo_pl_able = true;
		showLoadError("只能查询7天内的数据");
		return;
	}

	var isasday = $("#asday_pl:checked").val();
	var ticks = getDates(fromdate,todate,isasday);
	//var chartData;

	dt_pl.fnClearTable();

	var objAA=document.getElementById("divselect_pl");
	var iS=objAA.selectedIndex;
	var str_address=objAA.options[iS].value;
	var ipPort_historydata_pl = str_address;

	var appid= $("#pl_appid").val();
	var plaid = $("#pl_platid").val();
	var splatid = $("#pl_splatid").val()
	//+"&ip=" +strIp +"&port="+strPort
	$.ajax( {
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/hisdata_pl?type=" + (isasday? "min" : "hour") + "&from=" + fromdate.toDateString() +"&to=" + todate.toDateString()+"&platid="+plaid+"&splatid="+splatid+"&appid="+appid,
		"beforeSend": function () {
			spinOpen("querygo_pl_spin");
		},
		"complete":function (res, textStatus) {
			spinClose();
		},
		"success":function (res,textStatus) {
			querygo_pl_able = true;
			if(res.result == "success"){
				dt_pl.fnAddData(res.data);

				var chartDataX = new Array();
				var k=0;
				var chartData_heart = new Array();
				var chart_heart_block = new Array();

				var chartData_play = new Array();
				var chart_play_block = new Array();

				var nCompensate = 0.1; //小数点保留位数
				var play_rate = 0;
				var heart_rate = 0;

				for (k=0;k< res.data.length; k++){
					var strDateAndTime =  res.data[k][0];
					var strTmpArray = strDateAndTime.split(' ');
					var strTimeFull = strTmpArray[1];
					var strTimeHour = strTimeFull.split(':');
					chartDataX.push(strTimeHour[0]);

					play_rate = res.data[k][3];
					var chart_play_rate = play_rate.split('%');
					chart_play_block.push( parseFloat(chart_play_rate[0]) + Number(nCompensate) );

					heart_rate = res.data[k][6];
					var chart_heart_rate = heart_rate.split('%');
					chart_heart_block.push( parseFloat(chart_heart_rate[0]) + Number(nCompensate) );
				}
				chartData_play.push(chart_play_block);
				chartData_heart.push(chart_heart_block);

				loadDT_historydata_pl_play(chartData_play, chartDataX);
				loadDT_historydata_pl_heart(chartData_heart, chartDataX);

			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else if(res.result == "zero"){
				showLoadError("无相关数据");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};

//播放卡顿率
var loadDT_historydata_pl_play = function (chartDataPara, nMaxY,ticksPara){
	if(chart_historydata_play){
		chart_historydata_play.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_historydata_play = $.jqplot('historydata_play_chart_div', chartDataNow, {

		stackSeries: true,
		captureRightClick: true,

		seriesColors: [ "#22ac38", "#c5b47f", "#EAA228"],

		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 20,
				highlightMouseOver: true
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px',
			},
			pointLabels: {show: false},
			tickOptions: {formatString:'%.1f%'},
			shadow: false,   // show shadow or not.
			lineWidth: 3, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 8,            // 数据点的大小
			},
		},

		title: {
			text: '播放卡顿播放比图表',   // title for the plot,
			show: true,
		},

		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},

		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:0,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				pad:1.4,
				min:0,
				//max:80,
				numberTicks: 11,
				label:"播放卡顿播放比（%）",
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.1f%'},
			},

		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			sizeAdjust: 6, // 当鼠标移动到数据点上时，数据点扩大的增量增量
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td>播放卡顿播放比：</td><td>%s , %s %</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};
//心跳卡顿率
var loadDT_historydata_pl_heart = function (chartDataPara, nMaxY,ticksPara){
	if(chart_historydata_heart){
		chart_historydata_heart.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_historydata_heart = $.jqplot('historydata_heart_chart_div', chartDataNow, {

		stackSeries: true,
		captureRightClick: true,

		seriesColors: [ "#22ac38", "#c5b47f", "#EAA228"],

		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 20,
				highlightMouseOver: true
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px',
			},
			pointLabels: {show: false},
			tickOptions: {formatString:'%.1f%'},
			shadow: false,   // show shadow or not.
			lineWidth: 3, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 8,            // 数据点的大小
			},
		},

		title: {
			text: '心跳卡顿比图表',   // title for the plot,
			show: true,
		},

		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},

		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:0,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				pad:1.4,
				min:0,
				//max:80,
				numberTicks: 11,
				label:"心跳卡顿播放比（%）",
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.1f%'},
			},

		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			sizeAdjust: 6, // 当鼠标移动到数据点上时，数据点扩大的增量增量
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td>心跳播放卡顿比：</td><td>%s , %s %</td></tr></table>'
		},
	});
};

//查询分享率报表
var loadDT_table_all_share = function(){
	var fromdate = $("#fromdatepicker_all_share").datepicker("getDate");
	var todate = $("#todatepicker_all_share").datepicker("getDate");

	var share_tomorrow = $("#todatepicker_all_share").datepicker("getDate");
	var share_yestorday = $("#todatepicker_all_share").datepicker("getDate");  //显示前几天数据，不显示当天数据

	var _tomorrow  = todate.getDate()+1;
	share_tomorrow.setDate(_tomorrow);
	var _yestorday = todate.getDate()-1;
	share_yestorday.setDate(_yestorday) ;

	if(fromdate > todate){
		querygo_all_share_able = true;
		showLoadError("时间开始日期不能大于时间截止日期");
		return;
	}
	var todateBefore7 = new Date(todate - 7 * 24 * 3600 * 1000);
	if(fromdate < todateBefore7){
		querygo_all_share_able = true;
		showLoadError("只能查询7天内的数据");
		return;
	}


	var isasday = $("#asday_all_share:checked").val();
	var ticks = getDates(fromdate,todate,isasday);
	//var chartData;

	dt_all_share.fnClearTable();

	var sel_divselect_group_all_share=document.getElementById("divselect_group_all_share");
	var index_divselect_group_all_share=sel_divselect_group_all_share.selectedIndex;
	var val_divselect_group_all_share = sel_divselect_group_all_share.options[index_divselect_group_all_share].value;

	var sel_divselect_stream_all_share=document.getElementById("divselect_stream_all_share");
	var index_divselect_stream_all_share=sel_divselect_stream_all_share.selectedIndex;
	var val_divselect_stream_all_share = sel_divselect_stream_all_share.options[index_divselect_stream_all_share].value;

	//var val_divselect_version_all_share = -1;
	var sel_divselect_version_all_share=document.getElementById("divselect_version_all_share");
	var index_divselect_version_all_share=sel_divselect_version_all_share.selectedIndex;
	var val_divselect_version_all_share = sel_divselect_version_all_share.options[index_divselect_version_all_share].value;

	var sel_divselect_cliptype_all_share=document.getElementById("divselect_cliptype_all_share");
	var index_divselect_cliptype_all_share=sel_divselect_cliptype_all_share.selectedIndex;
	var val_divselect_cliptype_all_share = sel_divselect_cliptype_all_share.options[index_divselect_cliptype_all_share].value;

	var sel_divselect_idcvar_all_share=document.getElementById("divselect_idcvar_all_share");
	var index_divselect_idcvar_all_share=sel_divselect_idcvar_all_share.selectedIndex;
	var val_divselect_idcvar_all_share = sel_divselect_idcvar_all_share.options[index_divselect_idcvar_all_share].value;

	var terminalId = $("#all_share_terminal").val();
	var platid= $("#all_share_platid").val();
	var splatid= $("#all_share_splatid").val();
	var appid= $("#all_share_appid").val();
	var methods= $("#all_share_methods").val();
	var p= $("#divselect_p_all_share").val();
	var p1= $("#div_select_p1").val();
	var p2= $("#div_select_p2").val();
	var p3= $("#div_select_p3").val();

	//分享率报表查询
	$.ajax( {
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/table_all_share?type=" + (isasday? "min" : "hour") + "&from=" + todate.toDateString() +"&to=" + todate.toDateString()
		+ "&typVar="+val_divselect_cliptype_all_share + "&verVar="+val_divselect_version_all_share+"&idcVar="+val_divselect_idcvar_all_share
		+ "&gid="+val_divselect_group_all_share+"&terminalId="+terminalId+"&platid="+platid+"&splatid="+splatid+"&appid="+appid+"&methods="+methods
		+ "&p="+p+"&sid="+val_divselect_stream_all_share+"&table_all_share=1"+"&p1="+p1+"&p2="+p2,

		"beforeSend": function () {
			spinOpen("querygo_all_share_spin");
		},
		error: function (e) {
			spinClose();
		},
		"success":function (re,textStatus) {
			querygo_all_share_able = true;
			if(re.result == "success" || re.result == "zero"){
				var chart_table_share_H = new Array();
				var chart_people_number_H = new Array();
				var chart_average_bitrate_H = new Array();
				var chart_show_time_H = new Array();
				var chart_contribute_rate_H = new Array();
				var chart_cdn_data_H = new Array();

				var show_hour = 0;
				var q=0;
				var flag = 0;
				var hour_count =1;

				while(q < re.data.length)
				{
					var strDateAndTime =  re.data[q][0];
					var strTmpArray = strDateAndTime.split(' ');
					var strTimeFull = strTmpArray[1];
					var strTimeHour = strTimeFull.split(':');
					if(strTimeHour[0] != show_hour && flag == 1)
					{
						for(var i_n = 6-hour_count;i_n > 0;i_n--)
						{

							//q++;
							chart_table_share_H.push(parseFloat('0.00%'));
							chart_people_number_H.push('0');
							chart_average_bitrate_H.push('0');
							chart_show_time_H.push(parseFloat('0.0'));
							chart_contribute_rate_H.push(parseFloat('0.0%'));
							chart_cdn_data_H.push('0.0');
						}
						flag = 0;
						hour_count = 1;
					}
					if(strTimeHour[0] != show_hour )
					{
						chart_table_share_H.push(parseFloat(re.data[q][10]));
						chart_people_number_H.push(parseInt(re.data[q][11]));
						chart_average_bitrate_H.push(parseInt(re.data[q][12]));
						chart_show_time_H.push(parseFloat(re.data[q][13]));
						chart_contribute_rate_H.push(parseFloat(re.data[q][14]));
						chart_cdn_data_H.push(parseFloat(re.data[q][8]));
						q++;
					}
					else {
						flag = 1;
						hour_count++;
						chart_table_share_H.push(parseFloat(re.data[q][10]));
						chart_people_number_H.push(parseInt(re.data[q][11]));
						chart_average_bitrate_H.push(parseInt(re.data[q][12]));
						chart_show_time_H.push(parseFloat(re.data[q][13]));
						chart_contribute_rate_H.push(parseFloat(re.data[q][14]));
						chart_cdn_data_H.push(parseFloat(re.data[q][8]));
						q++;
					}
					show_hour = strTimeHour[0];
				}
				$.ajax( {
					"dataType": 'json',
					"contentType": "application/json; charset=utf-8",
					"type": "GET",
					"url": "/query/table_all_share?type=" + (isasday? "min" : "hour") + "&from=" + fromdate.toDateString() +"&to=" + share_yestorday.toDateString()
					+ "&typVar="+val_divselect_cliptype_all_share + "&verVar="+val_divselect_version_all_share+"&idcVar="+val_divselect_idcvar_all_share
					+ "&gid="+val_divselect_group_all_share+"&terminalId="+terminalId+"&platid="+platid+"&splatid="+splatid+"&appid="+appid+"&methods="+methods
					+ "&p="+p+"&sid="+val_divselect_stream_all_share+"&table_all_share=1"+"&p1="+p1+"&p2="+p2,
					"complete":function (res, textStatus) {
						spinClose();
					},
					"success":function (res,textStatus) {
						if(res.result == "success"){
							dt_all_share.fnAddData(re.data);

							var chart_table_share = new Array();
							var chart_table_share_A = new Array();
							var chart_table_share_B = new Array();
							var chart_table_share_C = new Array();
							var chart_table_share_D = new Array();
							var chart_table_share_E = new Array();
							var chart_table_share_F = new Array();
							var chart_table_share_G = new Array();

							var chart_people_number = new Array();
							var chart_people_number_A = new Array();
							var chart_people_number_B = new Array();
							var chart_people_number_C = new Array();
							var chart_people_number_D = new Array();
							var chart_people_number_E = new Array();
							var chart_people_number_F = new Array();
							var chart_people_number_G = new Array();

							var chart_average_bitrate = new Array();
							var chart_average_bitrate_A = new Array();
							var chart_average_bitrate_B = new Array();
							var chart_average_bitrate_C = new Array();
							var chart_average_bitrate_D = new Array();
							var chart_average_bitrate_E = new Array();
							var chart_average_bitrate_F = new Array();
							var chart_average_bitrate_G = new Array();

							var chart_contribute_rate = new Array();
							var chart_contribute_rate_A = new Array();
							var chart_contribute_rate_B = new Array();
							var chart_contribute_rate_C = new Array();
							var chart_contribute_rate_D = new Array();
							var chart_contribute_rate_E = new Array();
							var chart_contribute_rate_F = new Array();
							var chart_contribute_rate_G = new Array();

							var chart_show_time = new Array();
							var chart_show_time_A = new Array();
							var chart_show_time_B = new Array();
							var chart_show_time_C = new Array();
							var chart_show_time_D = new Array();
							var chart_show_time_E = new Array();
							var chart_show_time_F = new Array();
							var chart_show_time_G = new Array();

							var chart_cdn_data = new Array();
							var chart_cdn_data_A = new Array();
							var chart_cdn_data_B = new Array();
							var chart_cdn_data_C = new Array();
							var chart_cdn_data_D = new Array();
							var chart_cdn_data_E = new Array();
							var chart_cdn_data_F = new Array();
							var chart_cdn_data_G = new Array();

							var days = -1;
							var last_day = -1
							var chartDataX = new Array();

							for(var j=0;j<144;j++)
							{
								if((j+3)%6 == 0)
								{
									var cur_hour = (j+3)/6-1;
									chartDataX.push(cur_hour+":30");
								}
								else {
									chartDataX.push("");
								}
							}
							var last_time = -10;
							for(var i = 0 ; i< res.data.length-1; i++)
							{
								var str_date_time = res.data[i][0];
								var str_date = str_date_time.split(' ');
								var str_year_day = str_date[0];
								var str_day = str_year_day.split('-');
								var day_time = str_day[2];
								var strDateAndTime =  res.data[i][0];
								var strTmpArray = strDateAndTime.split(' ');
								var strTimeFull = strTmpArray[1];
								var strTimeHour = strTimeFull.split(':');
								if(day_time != last_day)
								{
									days++;
								}
								last_time = (last_time + 10) % (60 * 24);
								//console.log(last_time+"  "+strTimeHour[1]+"  "+ (Number(strTimeHour[0])*60+Number(strTimeHour[1]))) ;
								while (last_time !=(Number(strTimeHour[0]) * 60 + Number(strTimeHour[1]))) {
									switch(days)
									{
										case 0:
											chart_table_share_A.push(parseFloat('0.0'));
											chart_people_number_A.push(parseInt('0'));
											chart_average_bitrate_A.push(parseInt('0'));
											chart_show_time_A.push(parseFloat('0.0'));
											chart_contribute_rate_A.push(parseFloat('0'));
											chart_cdn_data_A.push(parseFloat('0.0'));
											break;
										case 1:
											chart_table_share_B.push(parseFloat('0.0'));
											chart_people_number_B.push(parseInt('0'));
											chart_average_bitrate_B.push(parseInt('0'));
											chart_show_time_B.push(parseFloat('0.0'));
											chart_contribute_rate_B.push(parseFloat('0'));
											chart_cdn_data_B.push(parseFloat('0.0'));
											break;
										case 2:
											chart_table_share_C.push(parseFloat('0.0'));
											chart_people_number_C.push(parseInt('0'));
											chart_average_bitrate_C.push(parseInt('0'));
											chart_show_time_C.push(parseFloat('0.0'));
											chart_contribute_rate_C.push(parseFloat('0'));
											chart_cdn_data_C.push(parseFloat('0.0'));
											break;
										case 3:
											chart_table_share_D.push(parseFloat('0.0'));
											chart_people_number_D.push(parseInt('0'));
											chart_average_bitrate_D.push(parseInt('0'));
											chart_show_time_D.push(parseFloat('0.0'));
											chart_contribute_rate_D.push(parseFloat('0'));
											chart_cdn_data_D.push(parseFloat('0.0'));
											break;
										case 4:
											chart_table_share_E.push(parseFloat('0.0'));
											chart_people_number_E.push(parseInt('0'));
											chart_average_bitrate_E.push(parseInt('0'));
											chart_show_time_E.push(parseFloat('0.0'));
											chart_contribute_rate_E.push(parseFloat('0'));
											chart_cdn_data_E.push(parseFloat('0.0'));
											break;
										case 5:
											chart_table_share_F.push(parseFloat('0.0'));
											chart_people_number_F.push(parseInt('0'));
											chart_average_bitrate_F.push(parseInt('0'));
											chart_show_time_F.push(parseFloat('0.0'));
											chart_contribute_rate_F.push(parseFloat('0'));
											chart_cdn_data_F.push(parseFloat('0.0'));
											break;
										case 6:
											chart_table_share_G.push(parseFloat('0.0'));
											chart_people_number_G.push(parseInt('0'));
											chart_average_bitrate_G.push(parseInt('0'));
											chart_show_time_G.push(parseFloat('0.0'));
											chart_contribute_rate_G.push(parseFloat('0'));
											chart_cdn_data_G.push(parseFloat('0.0'));
											break;
									}
									//	i--;
									//console.log("dys: " + " " + res.data[i-1][0] + " " + res.data[i][0] + " " + last_time + " " + strTimeHour[1] + " " + i +"\n");
									last_time = (last_time + 10) % (60 * 24);
									//	console.log(last_time+"  "+strTimeHour[1]+"  "+ (Number(strTimeHour[0])*60+Number(strTimeHour[1]))) ;
									//	continue;
								}

								switch(days)
								{
									case 0:
										chart_table_share_A.push(parseFloat(res.data[i][10]));
										chart_people_number_A.push(parseInt(res.data[i][11]));
										chart_average_bitrate_A.push(parseInt(res.data[i][12]));
										chart_show_time_A.push(parseFloat(res.data[i][13]));
										chart_contribute_rate_A.push(parseFloat(res.data[i][14]));
										chart_cdn_data_A.push(parseFloat(res.data[i][8]));
										break;
									case 1:
										chart_table_share_B.push(parseFloat(res.data[i][10]));
										chart_people_number_B.push(parseInt(res.data[i][11]));
										chart_average_bitrate_B.push(parseInt(res.data[i][12]));
										chart_show_time_B.push(parseFloat(res.data[i][13]));
										chart_contribute_rate_B.push(parseFloat(res.data[i][14]));
										chart_cdn_data_B.push(parseFloat(res.data[i][8]));
										break;
									case 2:
										chart_table_share_C.push(parseFloat(res.data[i][10]));
										chart_people_number_C.push(parseInt(res.data[i][11]));
										chart_average_bitrate_C.push(parseInt(res.data[i][12]));
										chart_show_time_C.push(parseFloat(res.data[i][13]));
										chart_contribute_rate_C.push(parseFloat(res.data[i][14]));
										chart_cdn_data_C.push(parseFloat(res.data[i][8]));
										break;
									case 3:
										chart_table_share_D.push(parseFloat(res.data[i][10]));
										chart_people_number_D.push(parseInt(res.data[i][11]));
										chart_average_bitrate_D.push(parseInt(res.data[i][12]));
										chart_show_time_D.push(parseFloat(res.data[i][13]));
										chart_contribute_rate_D.push(parseFloat(res.data[i][14]));
										chart_cdn_data_D.push(parseFloat(res.data[i][8]));
										break;
									case 4:
										chart_table_share_E.push(parseFloat(res.data[i][10]));
										chart_people_number_E.push(parseInt(res.data[i][11]));
										chart_average_bitrate_E.push(parseInt(res.data[i][12]));
										chart_show_time_E.push(parseFloat(res.data[i][13]));
										chart_contribute_rate_E.push(parseFloat(res.data[i][14]));
										chart_cdn_data_E.push(parseFloat(res.data[i][8]));
										break;
									case 5:
										chart_table_share_F.push(parseFloat(res.data[i][10]));
										chart_people_number_F.push(parseInt(res.data[i][11]));
										chart_average_bitrate_F.push(parseInt(res.data[i][12]));
										chart_show_time_F.push(parseFloat(res.data[i][13]));
										chart_contribute_rate_F.push(parseFloat(res.data[i][14]));
										chart_cdn_data_F.push(parseFloat(res.data[i][8]));
										break;
									case 6:
										chart_table_share_G.push(parseFloat(res.data[i][10]));
										chart_people_number_G.push(parseInt(res.data[i][11]));
										chart_average_bitrate_G.push(parseInt(res.data[i][12]));
										chart_show_time_G.push(parseFloat(res.data[i][13]));
										chart_contribute_rate_G.push(parseFloat(res.data[i][14]));
										chart_cdn_data_G.push(parseFloat(res.data[i][8]));
										break;
								}
								last_day = day_time;
							}

							chart_table_share.push(chart_table_share_A);
							chart_table_share.push(chart_table_share_B);
							chart_table_share.push(chart_table_share_C);
							chart_table_share.push(chart_table_share_D);
							chart_table_share.push(chart_table_share_E);
							chart_table_share.push(chart_table_share_F);
							chart_table_share.push(chart_table_share_G);
							chart_table_share.push(chart_table_share_H);
							chart_people_number.push(chart_people_number_A);
							chart_people_number.push(chart_people_number_B);
							chart_people_number.push(chart_people_number_C);
							chart_people_number.push(chart_people_number_D);
							chart_people_number.push(chart_people_number_E);
							chart_people_number.push(chart_people_number_F);
							chart_people_number.push(chart_people_number_G);
							chart_people_number.push(chart_people_number_H);


							chart_average_bitrate.push(chart_average_bitrate_A);
							chart_average_bitrate.push(chart_average_bitrate_B);
							chart_average_bitrate.push(chart_average_bitrate_C);
							chart_average_bitrate.push(chart_average_bitrate_D);
							chart_average_bitrate.push(chart_average_bitrate_E);
							chart_average_bitrate.push(chart_average_bitrate_F);
							chart_average_bitrate.push(chart_average_bitrate_G);
							chart_average_bitrate.push(chart_average_bitrate_H);

							chart_show_time.push(chart_show_time_A);
							chart_show_time.push(chart_show_time_B);
							chart_show_time.push(chart_show_time_C);
							chart_show_time.push(chart_show_time_D);
							chart_show_time.push(chart_show_time_E);
							chart_show_time.push(chart_show_time_F);
							chart_show_time.push(chart_show_time_G);
							chart_show_time.push(chart_show_time_H);

							chart_contribute_rate.push(chart_contribute_rate_A);
							chart_contribute_rate.push(chart_contribute_rate_B);
							chart_contribute_rate.push(chart_contribute_rate_C);
							chart_contribute_rate.push(chart_contribute_rate_D);
							chart_contribute_rate.push(chart_contribute_rate_E);
							chart_contribute_rate.push(chart_contribute_rate_F);
							chart_contribute_rate.push(chart_contribute_rate_G);
							chart_contribute_rate.push(chart_contribute_rate_H);

							chart_cdn_data.push(chart_cdn_data_A);
							chart_cdn_data.push(chart_cdn_data_B);
							chart_cdn_data.push(chart_cdn_data_C);
							chart_cdn_data.push(chart_cdn_data_D);
							chart_cdn_data.push(chart_cdn_data_E);
							chart_cdn_data.push(chart_cdn_data_F);
							chart_cdn_data.push(chart_cdn_data_G);
							chart_cdn_data.push(chart_cdn_data_H);

							loadDT_table_share_rate(chart_table_share,chartDataX);
							loadDT_table_people_number(chart_people_number,chartDataX);
							loadDT_table_average_bitrate(chart_average_bitrate,chartDataX);
							loadDT_table_show_time(chart_show_time,chartDataX);
							loadDT_table_contribute_rate(chart_contribute_rate,chartDataX);
							loadDT_table_cdn_data(chart_cdn_data,chartDataX);
						}else if(res.result == "expired"){
							showExpired("您当前登录已过期,请重新登录");
						}else if(res.result == "zero"){
							showLoadError("无相关数据");
						}else{
							showLoadError("加载数据错误");
						}
					}
				});

			}else if(re.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else if(re.result == "zero"){
				showLoadError("无相关数据");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};

//生成报表分享率
var loadDT_table_share_rate = function (chartDataPara, ticksPara){
	if(chart_table_share_rate){
		chart_table_share_rate.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_table_share_rate = $.jqplot('table_share_rate_chart_div', chartDataNow, {
		stackSeries: false,
		captureRightClick: true,
		//seriesColors: ["#579bc2","00c9cb","#9ce159", "#ffe061", "#ffc072" , "#BF3EFF", "#ff2f92"],
		seriesColors: ["#d6b82c","#e26b77","#e286a1","#daaed4","#b7bce6","#74bae6","#1aaee6","#3fd254"],
		title: {
			text: '分享率图表',   // title for the plot,
			show: true,
		},
		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 20,
				highlightMouseOver: true
			},

			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px'
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			lineWidth: 1.5, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 2,            // 数据点的大小
			},
		},
		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},
		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				showTicks:false,
				pad:1,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				min:0,
				max:100,
				pad:1.4,
				label:"分享率",
				autoscale : true,
				numberTicks: 11,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				tickOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.2f %'},
			}
		},
		series:[
			{label:'最近7天'},
			{label:'最近6天'},
			{label:'最近5天'},
			{label:'最近4天'},
			{label:'最近3天'},
			{label:'最近2天'},
			{label:'最近1天'},
			{label:' 今 天 '},
		],
		legend: {
			show: true,//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'ne',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 20,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			textColor:'#000' ,         //分类名称框距图表区域内字体颜色
			placement: 'outsideGrid',
		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#f3f3f3'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td> </td><td>%s , %s %</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};

var loadDT_table_people_number = function (chartDataPara, ticksPara){
	if(chart_people_number){
		chart_people_number.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_people_number = $.jqplot('table_people_number_chart_div', chartDataNow, {
		stackSeries: false,
		captureRightClick: true,
		seriesColors: ["#d6b82c","#e26b77","#e286a1","#daaed4","#b7bce6","#74bae6","#1aaee6","#3fd254"],
		title: {
			text: '人数图表',   // title for the plot,
			show: true,
		},
		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 20,
				highlightMouseOver: true
			},

			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '15px'
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			lineWidth: 1.5, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 2,            // 数据点的大小
			},
		},
		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},
		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:1,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				min:0,
				pad:1.4,
				label:"人数",
				autoscale : true,
				numberTicks: 11,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.0f '},
			}
		},
		series:[
			{label:'最近7天'},
			{label:'最近6天'},
			{label:'最近5天'},
			{label:'最近4天'},
			{label:'最近3天'},
			{label:'最近2天'},
			{label:'最近1天'},
			{label:' 今 天 '},
		],
		legend: {
			show: true,//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'ne',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 20,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			textColor:'#000' ,         //分类名称框距图表区域内字体颜色
			placement: 'outsideGrid',
		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#f3f3f3'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td> </td><td>%s , %s</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};

//生成报表平均码率
var loadDT_table_average_bitrate = function (chartDataPara, ticksPara){
	if(chart_table_average_bitrate){
		chart_table_average_bitrate.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_table_average_bitrate = $.jqplot('table_average_bitrate_chart_div', chartDataNow, {
		stackSeries: false,
		captureRightClick: true,
		seriesColors: ["#d6b82c","#e26b77","#e286a1","#daaed4","#b7bce6","#74bae6","#1aaee6","#3fd254"],
		title: {
			text: '平均码率图表',   // title for the plot,
			show: true,
		},
		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 20,
				highlightMouseOver: true
			},

			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px'
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			lineWidth: 1.5, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 2,            // 数据点的大小
			},
		},
		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},
		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				showTicks:false,
				pad:1,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				min:0,
				pad:1.4,
				label:"平均码率",
				autoscale : true,
				numberTicks: 11,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				tickOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.0f '},
			}
		},
		series:[
			{label:'最近7天'},
			{label:'最近6天'},
			{label:'最近5天'},
			{label:'最近4天'},
			{label:'最近3天'},
			{label:'最近2天'},
			{label:'最近1天'},
			{label:' 今 天 '},
		],
		legend: {
			show: true,//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'ne',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 20,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			textColor:'#000' ,         //分类名称框距图表区域内字体颜色
			placement: 'outsideGrid',
		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#f3f3f3'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td> </td><td>%s , %s</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};

var loadDT_table_show_time = function (chartDataPara, ticksPara){
	if(chart_table_show_time){
		chart_table_show_time.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_table_show_time = $.jqplot('table_show_time_chart_div', chartDataNow, {
		stackSeries: false,
		captureRightClick: true,
		seriesColors: ["#d6b82c","#e26b77","#e286a1","#daaed4","#b7bce6","#74bae6","#1aaee6","#3fd254"],
		title: {
			text: '平均时长图表',   // title for the plot,
			show: true,
		},
		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 20,
				highlightMouseOver: true
			},

			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px'
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			lineWidth: 1.5, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 2,            // 数据点的大小
			},
		},
		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},
		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				showTicks:false,
				pad:1,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				min:0,
				//max:100,
				pad:1.4,
				label:"平均时长",
				autoscale : true,
				numberTicks: 11,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				tickOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.1f'},
			}
		},
		series:[
			{label:'最近7天'},
			{label:'最近6天'},
			{label:'最近5天'},
			{label:'最近4天'},
			{label:'最近3天'},
			{label:'最近2天'},
			{label:'最近1天'},
			{label:' 今 天 '},
		],
		legend: {
			show: true,//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'ne',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 20,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			textColor:'#000' ,         //分类名称框距图表区域内字体颜色
			placement: 'outsideGrid',
		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#f3f3f3'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td></td><td>%s , %s</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};

var loadDT_table_cdn_data = function (chartDataPara, ticksPara){
	if(chart_table_cdn_data){
		chart_table_cdn_data.destroy();
	}

	var chartDataNow = chartDataPara;
	chart_table_cdn_data = $.jqplot('table_cdn_data_chart_div', chartDataNow, {
		stackSeries: false,
		captureRightClick: true,
		seriesColors: ["#d6b82c","#e26b77","#e286a1","#daaed4","#b7bce6","#74bae6","#1aaee6","#3fd254"],
		title: {
			text: 'CDN带宽图表',   // title for the plot,
			show: true,
		},
		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 20,
				highlightMouseOver: true
			},

			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px'
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			lineWidth: 1.5, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 2,            // 数据点的大小
			},
		},
		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},
		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				showTicks:false,
				pad:1,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				min:0,
				//max:100,
				pad:1.4,
				label:"CDN带宽",
				autoscale : true,
				numberTicks: 11,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				tickOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.1f'},
			}
		},
		series:[
			{label:'最近7天'},
			{label:'最近6天'},
			{label:'最近5天'},
			{label:'最近4天'},
			{label:'最近3天'},
			{label:'最近2天'},
			{label:'最近1天'},
			{label:' 今 天 '},
		],
		legend: {
			show: true,//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'ne',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 20,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			textColor:'#000' ,         //分类名称框距图表区域内字体颜色
			placement: 'outsideGrid',
		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#f3f3f3'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td></td><td>%s , %s</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};

var loadDT_table_contribute_rate = function (chartDataPara, ticksPara){
	if(chart_table_contribute_rate){
		chart_table_contribute_rate.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_table_contribute_rate = $.jqplot('table_contribute_rate_chart_div', chartDataNow, {
		stackSeries: false,
		captureRightClick: true,
		seriesColors: ["#d6b82c","#e26b77","#e286a1","#daaed4","#b7bce6","#74bae6","#1aaee6","#3fd254"],
		title: {
			text: '报表PC贡献比图表',   // title for the plot,
			show: true,
		},
		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 20,
				highlightMouseOver: true
			},

			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px'
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			lineWidth: 1.5, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 2,            // 数据点的大小
			},
		},
		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},
		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				showTicks:false,
				pad:1,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				min:0,
				max:100,
				pad:1.4,
				label:"PC贡献比",
				autoscale : true,
				numberTicks: 11,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				tickOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.1f %'},
			}
		},
		series:[
			{label:'最近7天'},
			{label:'最近6天'},
			{label:'最近5天'},
			{label:'最近4天'},
			{label:'最近3天'},
			{label:'最近2天'},
			{label:'最近1天'},
			{label:' 今 天 '},
		],
		legend: {
			show: true,//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'ne',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 20,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			textColor:'#000' ,         //分类名称框距图表区域内字体颜色
			placement: 'outsideGrid',
		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#f3f3f3'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td> </td><td>%s , %s</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};


var loadDT_upgrade = function(){
	var fromdate = $("#fromdatepicker_upgrade").datepicker("getDate");
	var todate = $("#todatepicker_upgrade").datepicker("getDate");

	if(fromdate > todate){
		showLoadError("时间开始日期不能大于时间截止日期");
		querygo_upgrade_able = true;
		return;
	}
	var todateBefore7 = new Date(todate - 7 * 24 * 3600 * 1000);
	if(fromdate < todateBefore7){
		querygo_upgrade_able = true;
		showLoadError("只能查询7天内的数据");
		return;
	}

	var isasday = $("#asday_upgrade:checked").val();
	var ticks = getDates(fromdate,todate,isasday);
	//var chartData;

	dt_upgrade.fnClearTable();

	var sel_divselect_group_ptopratio=document.getElementById("divselect_group_ptopratio");
	var index_divselect_group_ptopratio=sel_divselect_group_ptopratio.selectedIndex;
	var val_divselect_group_ptopratio = sel_divselect_group_ptopratio.options[index_divselect_group_ptopratio].value;

	var sel_divselect_stream_ptopratio=document.getElementById("divselect_stream_ptopratio");
	var index_divselect_stream_ptopratio=sel_divselect_stream_ptopratio.selectedIndex;
	var val_divselect_stream_ptopratio = sel_divselect_stream_ptopratio.options[index_divselect_stream_ptopratio].value;

	//var val_divselect_version_ptopratio = -1;
	var sel_divselect_version_ptopratio=document.getElementById("divselect_version_ptopratio");
	var index_divselect_version_ptopratio=sel_divselect_version_ptopratio.selectedIndex;
	var val_divselect_version_ptopratio = sel_divselect_version_ptopratio.options[index_divselect_version_ptopratio].value;

	var sel_divselect_cliptype_ptopratio=document.getElementById("divselect_cliptype_ptopratio");
	var index_divselect_cliptype_ptopratio=sel_divselect_cliptype_ptopratio.selectedIndex;
	var val_divselect_cliptype_ptopratio = sel_divselect_cliptype_ptopratio.options[index_divselect_cliptype_ptopratio].value;

	var sel_divselect_idcvar_ptopratio=document.getElementById("divselect_idcvar_ptopratio");
	var index_divselect_idcvar_ptopratio=sel_divselect_idcvar_ptopratio.selectedIndex;
	var val_divselect_idcvar_ptopratio = sel_divselect_idcvar_ptopratio.options[index_divselect_idcvar_ptopratio].value;

	var termId = $("#upgrade_termid").val();
	var appid= $("#upgrade_appid").val();
	var net_type = $("#divselect_net_type_upgrade").val();
	var so = $("#upgrade_so").val();
	var upgrade_type = $("#upgrade_type").val();

	var primary= $("#divselect_primary_version_upgrade").val();
	var aim= $("#divselect_aim_version_upgrade").val();

	//upgrade handler
	getRequest(
		"/query/upgrade_failed?"
		+"type=" + (isasday? "min" : "hour")
		+"&from=" + fromdate.toDateString()
		+"&to=" + todate.toDateString()
		+"&aim="+aim
		+"&primary="+primary
		+"&net_type="+net_type
		+"&appid="+appid
		+"&so="+so
		+ "&upgrade_type="+upgrade_type
		+"&termId="+termId,
		function( result,textStatus ){
			if(result.result == "success"){
				upgrade_faild_statistics(result.data,result.xData);
			}else if(result.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else if(result.result == "zero"){
				showLoadError("无相关数据");
			}else{
				showLoadError("加载数据错误");
			}
		}
	);


	$.ajax( {
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/upgrade_accumulate?type="
		+(isasday? "min" : "hour")
		+"&from=" + fromdate.toDateString()
		+"&to=" + todate.toDateString()
		+"&aim="+aim + "&primary="+primary
		+"&net_type="+net_type+"&appid="+appid+"&so="+so + "&upgrade_type="+upgrade_type+"&termId="+termId,
		"beforeSend": function () {
			spinOpen("querygo_upgrade_spin");
		},
		error: function (e) {
			spinClose();
		},
		"success":function (res,textStatus) {
			if(res.result == "success"){

				$.ajax( {
					"dataType": 'json',
					"contentType": "application/json; charset=utf-8",
					"type": "GET",
					"url": "/query/upgrade_version?type=" + (isasday? "min" : "hour") + "&from=" + fromdate.toDateString() +"&to=" + todate.toDateString()
					+ "&aim="+aim + "&primary="+primary+"&net_type="+net_type+"&appid="+appid+"&so="+so
					+ "&upgrade_type="+upgrade_type+"&termId="+termId,
					"complete":function (res, textStatus) {
						spinClose();
					},
					"success":function (re,textStatus) {
						querygo_upgrade_able=true;
						if(re.result == "success"){
							for(var j=0;j<re.data.length;j++)
							{
								re.data[j][2] = re.data[j][2] + Number(res.data);
							}

							dt_upgrade.fnAddData(re.data);

							var chartDataX = new Array();
							var k=0;
							var chartData_increase = new Array();
							var chartData_total_increase = new Array();
							var chartData_increase_A = new Array();
							var chartData_total_increase_B = new Array();

							for (k=0;k< re.data.length; k++){
								var strDateAndTime =  re.data[k][0];
								var strTmpArray = strDateAndTime.split(' ');
								var strTimeFull = strTmpArray[1];
								var strTimeHour = strTimeFull.split(':');
								chartDataX.push(strTimeHour[0]);

								chartData_increase_A.push( parseInt(re.data[k][1]));
								chartData_total_increase_B.push( parseInt(re.data[k][2]));
							}

							chartData_increase.push(chartData_increase_A );
							chartData_total_increase.push(chartData_total_increase_B );

							loadDT_upgrade_version_increase(chartData_increase, chartDataX);
							loadDT_upgrade_version_total_increase(chartData_total_increase, chartDataX);
						}else if(re.result == "expired"){
							showExpired("您当前登录已过期,请重新登录");
						}else if(re.result == "zero"){
							showLoadError("无相关数据");
						}else{
							showLoadError("加载数据错误");
						}
					}
				});
			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else if(res.result == "zero"){
				showLoadError("无相关数据");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};

var loadDT_upgrade_version_increase = function (chartDataPara, ticksPara){
	if(chart_upgrade_version_increase){
		chart_upgrade_version_increase.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_upgrade_version_increase = $.jqplot('upgrade_version_increase_div', chartDataNow, {

		stackSeries: true,
		captureRightClick: true,
		seriesColors: [ "#e63b7a"],

		seriesDefaults:{
			renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				//barMargin: 20,
				highlightMouseOver: true,
				barMargin: 3,
				barPadding: 1,
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '12px',
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			markerOptions: {
				show: true,          // wether to show data point markers.
				shadow: false,       // wether to draw shadow on marker or not.
			},
		},

		title: {
			text: '增量升级量统计',   // title for the plot,
			show: true,
		},

		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},

		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:0,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				//pad:1.4,
				min:0,
				//max:100,
				numberTicks: 11,
				label:"升级增量",
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
			},

		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		legend: {
			show: true,			//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'ne',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 20,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			textColor:'#000' ,         //分类名称框距图表区域内字体颜色
			placement: 'outsideGrid',
		},
		highlighter: {
			show: true,
			showMarker:false,
			tooltipAxes: 'xy',
			yvalues: 1,
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td><tr>增量：</tr></td><td>%s , %s</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};

var upgrade_faild_statistics = function(chartDataPara,ticksPara)
{
	//移交到submit button
	if(chart_upgrade_faild_statistics){
		chart_upgrade_faild_statistics.destroy();
	}
	chart_upgrade_faild_statistics = $.jqplot('upgrade_failed_div',chartDataPara,
		{
			stackSeries: false,
			captureRightClick: true,
			seriesColors: ["#3b6c9d", "#6ea45a","#edb04d", "#ca423e", "#83528c" , "#835666", "#835333"],//,"#edb04d", "#ca423e", "#83528c" , "#83528c"
			title: {
				text: '升级失败数',   // title for the plot,
				show: true,
			},
			seriesDefaults:{
				//renderer:$.jqplot.BarRenderer,
				rendererOptions: {
					barMargin: 20,
					highlightMouseOver: true
				},

				tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
				tickOptions: {
					angle: 30,
					fontSize: '11px'
				},
				pointLabels: {show: false},
				shadow: false,   // show shadow or not.
				lineWidth: 1.5, // 分类图（特别是折线图）哪宽度
				markerOptions: {
					shadow: false,       // wether to draw shadow on marker or not.
					show: true,             // 是否在图中显示数据点
					style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
					//其他几种方式circle，diamond, square, filledCircle，
					// filledDiamond or filledSquare.
					lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
					size: 4,            // 数据点的大小
				},
			},
			axesDefaults: {
				tickOptions: {
					showMark: false,
					showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
					showLabel: true,    // wether to show the text label at the tick,
				},
				showTicks: true,        // wether or not to show the tick labels,
				showTickMarks: true,    // wether or not to show the tick marks
			},
			axes: {
				//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				xaxis: {
					pad:0,
					min:0,
					ticks:ticksPara,
					renderer: $.jqplot.CategoryAxisRenderer,
				},
				yaxis: {
					pad:1.4,
					//max:60,
					//min:0,
					label:"失败数",
					autoscale : true,
					numberTicks: 11,
					labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
					labelOptions: {fontSize: '11pt'}//,
					//tickOptions: {formatString:'%.0f %'},
				}
			},
			series:[
				{label:'安装成功'},
				{label:'Jasn解析失败'},
				{label:'so下载失败'},
				{label:'so保存失败'},
				{label:'so解压失败'},
				{label:'soMD5失败'},
				{label:'soMD5_CK失败'},
				{label:'so安装失败'}
			],
			legend: {
				show: true,//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
				location: 'ne',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
				xoffset: 20,        // 分类名称框距图表区域上边框的距离（单位px）
				yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
				background:'#fff' ,       //分类名称框距图表区域背景色
				textColor:'#000' ,         //分类名称框距图表区域内字体颜色
				placement: 'outsideGrid',
			},
			grid: {
				drawGridLines: true,        // wether to draw lines across the grid or not.
				gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
				background: '#f9f9f9',      // 设置整个图表区域的背景色
				borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
				borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
				shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
				renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
				rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
				// CanvasGridRenderer takes no additional options.
			},
			highlighter: {
				show: true,
				showMarker:true,
				tooltipAxes: 'xy',
				yvalues: 1,
				// You can customize the tooltip format string of the highlighter
				// to include any arbitrary text or html and use format string
				// placeholders (%s here) to represent x and y values.
				formatString:'<table class="jqplot-highlighter"> 	  <tr><td> </td><td>%s , %s</td></tr></table>',
				tooltipContentEditor:tooltipContentEditor,
			},
		}
	);

}

var upgrade_faild_statistics = function(chartDataPara,ticksPara)
{
	//移交到submit button
	if(chart_upgrade_faild_statistics){
		chart_upgrade_faild_statistics.destroy();
	}
	chart_upgrade_faild_statistics = $.jqplot('upgrade_failed_div',chartDataPara,
		{
			stackSeries: false,
			captureRightClick: true,
			seriesColors: ["#3b6c9d", "#6ea45a","#edb04d", "#ca423e", "#83528c" , "#835666", "#835333"],//,"#edb04d", "#ca423e", "#83528c" , "#83528c"
			title: {
				text: '升级失败数',   // title for the plot,
				show: true,
			},
			seriesDefaults:{
				//renderer:$.jqplot.BarRenderer,
				rendererOptions: {
					barMargin: 20,
					highlightMouseOver: true
				},

				tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
				tickOptions: {
					angle: 30,
					fontSize: '11px'
				},
				pointLabels: {show: false},
				shadow: false,   // show shadow or not.
				lineWidth: 1.5, // 分类图（特别是折线图）哪宽度
				markerOptions: {
					shadow: false,       // wether to draw shadow on marker or not.
					show: true,             // 是否在图中显示数据点
					style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
					//其他几种方式circle，diamond, square, filledCircle，
					// filledDiamond or filledSquare.
					lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
					size: 4,            // 数据点的大小
				},
			},
			axesDefaults: {
				tickOptions: {
					showMark: false,
					showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
					showLabel: true,    // wether to show the text label at the tick,
				},
				showTicks: true,        // wether or not to show the tick labels,
				showTickMarks: true,    // wether or not to show the tick marks
			},
			axes: {
				//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				xaxis: {
					pad:0,
					min:0,
					ticks:ticksPara,
					renderer: $.jqplot.CategoryAxisRenderer,
				},
				yaxis: {
					pad:1.4,
					//max:60,
					//min:0,
					label:"失败数",
					autoscale : true,
					numberTicks: 11,
					labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
					labelOptions: {fontSize: '11pt'}//,
					//tickOptions: {formatString:'%.0f %'},
				}
			},
			series:[
				{label:'安装成功'},
				{label:'Jasn解析失败'},
				{label:'so下载失败'},
				{label:'so保存失败'},
				{label:'so解压失败'},
				{label:'soMD5失败'},
				{label:'soMD5_CK失败'},
				{label:'so安装失败'}
			],
			legend: {
				show: true,//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
				location: 'ne',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
				xoffset: 20,        // 分类名称框距图表区域上边框的距离（单位px）
				yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
				background:'#fff' ,       //分类名称框距图表区域背景色
				textColor:'#000' ,         //分类名称框距图表区域内字体颜色
				placement: 'outsideGrid',
			},
			grid: {
				drawGridLines: true,        // wether to draw lines across the grid or not.
				gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
				background: '#f9f9f9',      // 设置整个图表区域的背景色
				borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
				borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
				shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
				renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
				rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
				// CanvasGridRenderer takes no additional options.
			},
			highlighter: {
				show: true,
				showMarker:true,
				tooltipAxes: 'xy',
				yvalues: 1,
				// You can customize the tooltip format string of the highlighter
				// to include any arbitrary text or html and use format string
				// placeholders (%s here) to represent x and y values.
				formatString:'<table class="jqplot-highlighter"> 	  <tr><td>失败数：</td><td>%s , %s</td></tr></table>',
				tooltipContentEditor:tooltipContentEditor,
			},
		}
	);

}



var loadDT_upgrade_version_total_increase = function (chartDataPara, ticksPara){
	if(chart_upgrade_version_total_increase){
		chart_upgrade_version_total_increase.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_upgrade_version_total_increase = $.jqplot('upgrade_version_total_increase_div', chartDataNow, {

		stackSeries: true,
		captureRightClick: true,
		seriesColors: [ "#e63b7a"],

		seriesDefaults:{
			renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				//barMargin: 20,
				highlightMouseOver: true,
				barMargin: 3,
				barPadding: 1,
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '12px',
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			markerOptions: {
				show: true,          // wether to show data point markers.
				shadow: false,       // wether to draw shadow on marker or not.
			},
		},

		title: {
			text: '累计升级量统计',   // title for the plot,
			show: true,
		},

		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},

		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:0,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				//pad:1.4,
				min:0,
				//max:1000,
				numberTicks: 11,
				label:"升级累计增量",
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
			},
		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		legend: {
			show: true,			//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'ne',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 120,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			textColor:'#000' ,         //分类名称框距图表区域内字体颜色
			placement: 'outsideGrid',
		},
		highlighter: {
			show: true,
			showMarker:false,
			tooltipAxes: 'xy',
			yvalues: 1,
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td><tr>增量：</tr></td><td>%s , %s</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};



var loadDT_historydata_stagequality = function(){
	var fromdate = $("#fromdatepicker_stagequality").datepicker("getDate");
	var todate = $("#todatepicker_stagequality").datepicker("getDate");

	if(fromdate > todate){
		querygo_stagequality_able = true;
		showLoadError("时间开始日期不能大于时间截止日期");
		return;
	}
	var todateBefore7 = new Date(todate - 7 * 24 * 3600 * 1000);
	if(fromdate < todateBefore7){
		querygo_stagequality_able = true;
		showLoadError("只能查询7天内的数据");
		return;
	}

	var isasday = $("#asday_stagequality:checked").val();
	var ticks = getDates(fromdate,todate,isasday);
	//var chartData;

	dt_stagequality.fnClearTable();

	var objAA=document.getElementById("divselect_stagequality");
	var iS=objAA.selectedIndex;
	var str_address=objAA.options[iS].value;
	var ipPort_historydata_stagequality = str_address;

	var sel_divselect_stream_stagequality=document.getElementById("divselect_stream_stagequality");
	var index_divselect_stream_stagequality=sel_divselect_stream_stagequality.selectedIndex;
	var val_divselect_stream_stagequality = sel_divselect_stream_stagequality.options[index_divselect_stream_stagequality].value;

	var sel_divselect_group_stagequality=document.getElementById("divselect_group_stagequality");
	var index_divselect_group_stagequality=sel_divselect_group_stagequality.selectedIndex;
	var val_divselect_group_stagequality = sel_divselect_group_stagequality.options[index_divselect_group_stagequality].value;

	//var val_divselect_version_stagequality = -1;
	var sel_divselect_version_stagequality=document.getElementById("divselect_version_stagequality");
	var index_divselect_version_stagequality=sel_divselect_version_stagequality.selectedIndex;
	var val_divselect_version_stagequality = sel_divselect_version_stagequality.options[index_divselect_version_stagequality].value;


	//var val_divselect_cliptype_stagequality = -1;
	var sel_divselect_cliptype_stagequality=document.getElementById("divselect_cliptype_stagequality");
	var index_divselect_cliptype_stagequality=sel_divselect_cliptype_stagequality.selectedIndex;
	var val_divselect_cliptype_stagequality = sel_divselect_cliptype_stagequality.options[index_divselect_cliptype_stagequality].value;

	//stagequality_terminal
	var terminalId = $("#stagequality_terminal").val();
	var appid = $("#stagequality_appid").val();
	var methods = $("#stagequality_methods").val();
	var platid= $("#stagequality_platid").val();
	var splatid= $("#stagequality_splatid").val();
	var p1= $("#stage_select_items_p1").val();
	var p2= $("#stage_select_items_p2").val();
	var p3= $("#stage_select_items_p3").val();
	var country = $("#stage_country").val();
	var province = $("#stage_province").val();

	var valIPPort = ipPort_historydata_stagequality.split(":");
	var strIp = valIPPort[0];
	var strPort = valIPPort[1];
	var ch = $("#static_select_items_ch").val();
	//+"&ip=" +strIp +"&port="+strPort
	$.ajax( {
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/hisdata_stagequality?type=" + (isasday? "min" : "hour") + "&from=" + fromdate.toDateString() +"&to=" + todate.toDateString()
		+ "&typVar="+val_divselect_cliptype_stagequality + "&verVar="+val_divselect_version_stagequality+"&gid="+val_divselect_group_stagequality
		+"&terminalId="+terminalId+"&platid="+platid+"&splatid="+splatid+"&appid="+appid+"&methods="+methods+"&sid="+val_divselect_stream_stagequality+"&ch="+ch
		+"&p1="+p1+"&p2="+p2+"&p3="+p3+"&country="+country+"&province="+province,
		"beforeSend": function () {
			spinOpen("querygo_stagequality_spin");
		},
		"complete":function (res, textStatus) {
			spinClose();
		},
		"success":function (res,textStatus) {
			querygo_stagequality_able = true;
			if(res.result == "success"){
				dt_stagequality.fnAddData(res.data);

				var chartData = new Array();
				var chartData_Three = new Array();
				var chartData_Four = new Array();
				var chartData_Five = new Array();

				var chartDataCore = new Array();
				var chartDataCore_Three = new Array();

				var chartDataCore_Four_A = new Array();
				var chartDataCore_Four_B = new Array();
				var chartDataCore_Four_C = new Array();
				var chartDataCore_Four_D = new Array();
				var chartDataCore_Four_E = new Array();
				var chartDataCore_Four_F = new Array();
				var chartDataCore_Four_G = new Array();
				var chartDataCore_Four_H = new Array();
				var chartDataCore_Four_I = new Array();

				var chartDataCore_Five_A = new Array();
				var chartDataCore_Five_B = new Array();
				var chartDataCore_Five_C = new Array();
				var chartDataCore_Five_D = new Array();
				//var chartDataCore_Five_E = new Array();

				var chartDataX = new Array();
				var chartDataCoreX = new Array();
				var nAxisY = 0;
				var k=0;
				var nTmpVal=0;

				for (k=0;k< res.data.length; k++){

					nTmpVal = res.data[k][2];
					var nTheValue = nTmpVal;
					chartDataCore.push( parseInt(nTheValue));
					chartDataCore_Three.push( parseFloat(res.data[k][1]) );
					if( Number(nAxisY) < Number(nTmpVal) )
						nAxisY=nTmpVal;

					chartDataCore_Four_A.push( parseInt(res.data[k][15]) ) ;
					chartDataCore_Four_B.push( parseInt(res.data[k][3])  );
					chartDataCore_Four_C.push( parseInt(res.data[k][17]) ) ;
					chartDataCore_Four_D.push( parseInt(res.data[k][5])  ) ;
					chartDataCore_Four_E.push( parseInt(res.data[k][13]) ) ;
					chartDataCore_Four_F.push( parseInt(res.data[k][7])  ) ;
					chartDataCore_Four_G.push( parseInt(res.data[k][9])  ) ;
					chartDataCore_Four_H.push( parseInt(res.data[k][11]) ) ;


					chartDataCore_Five_A.push( 100*parseInt( res.data[k][5]) / parseInt(res.data[k][3]) );
					chartDataCore_Five_B.push( 100*parseInt( res.data[k][7]) / parseInt(res.data[k][5]) ) ;
					chartDataCore_Five_C.push( 100*parseInt( res.data[k][9]) / parseInt(res.data[k][5]) ) ;
					chartDataCore_Five_D.push( 100*parseInt( res.data[k][11]) / parseInt(res.data[k][9]) ) ;

					var strDateAndTime =  res.data[k][0];
					var strTmpArray = strDateAndTime.split(' ');
					var strTimeFull = strTmpArray[1];
					var strTimeHour = strTimeFull.split(':');
					chartDataX.push(strTimeHour[0]);
				}
				nAxisY=nAxisY*1.618;

				chartData.push(chartDataCore);
				chartData_Three.push(chartDataCore_Three);

				chartData_Four.push(chartDataCore_Four_A );
				chartData_Four.push(chartDataCore_Four_B );
				chartData_Four.push(chartDataCore_Four_C );
				chartData_Four.push(chartDataCore_Four_D );
				chartData_Four.push(chartDataCore_Four_E );
				chartData_Four.push(chartDataCore_Four_F );
				chartData_Four.push(chartDataCore_Four_G );
				chartData_Four.push(chartDataCore_Four_H );

				chartData_Five.push(chartDataCore_Five_A );
				chartData_Five.push(chartDataCore_Five_B );
				chartData_Five.push(chartDataCore_Five_C );
				chartData_Five.push(chartDataCore_Five_D );

				loadDT_historydata_stagequality_partTwo(chartData, chartDataX);
				loadDT_historydata_stagequality_partThree(chartData_Three, chartDataX);
				loadDT_historydata_stagequality_partFour(chartData_Four, chartDataX);
				loadDT_historydata_stagequality_partFive(chartData_Five, chartDataX);

			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else if(res.result == "zero"){
				showLoadError("无相关数据");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};


//过程质量
var loadDT_historydata_stagequality_partTwo = function (chartDataPara, ticksPara){
	if(chart_historydata_stagequality){
		chart_historydata_stagequality.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_historydata_stagequality = $.jqplot('historydata_stagequality_chart_div', chartDataNow, {
		stackSeries: true,
		captureRightClick: true,
		seriesColors: [ "#0097d1", "#c5b47f", "#EAA228"],
		title: {
			text: '播放次数统计图表 ',   // title for the plot,
			show: true,
		},
		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 20,
				highlightMouseOver: true
			},

			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px'
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			markerOptions: {
				show: true,             // wether to show data point markers.
				shadow: false,       // wether to draw shadow on marker or not.
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 4,
			},
		},
		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},
		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:1,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
				//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				//tickRenderer:$.jqplot.CanvasAxisTickRenderer,
				//tickOptions: {
				//	fontSize: '12px',
				//	angle: -30
				//},
				//labelOptions:{fontSize:'15px', angle:30},
				//label:"时间点"
				//autoscale : true
			},
			yaxis: {
				labelOptions:{fontSize:10},
				pad:1.4,
				min:0,
				//max:6000000,
				label:"播放次数",
				autoscale : true,
				numberTicks: 7,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
			}
		},
		series:[
			//{label:'在线用户数'}
		],
		legend: {
			show: false,
			location: 'w',
			placement: 'outside'
		} ,
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			sizeAdjust: 6, // 当鼠标移动到数据点上时，数据点扩大的增量增量
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td>播放次数为：</td><td>%s , %s</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};


var loadDT_historydata_stagequality_partThree = function (chartDataPara, ticksPara){
	if(chart_historydata_stagequality_partThree){
		chart_historydata_stagequality_partThree.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_historydata_stagequality_partThree = $.jqplot('historydata_stagequality_partThree_chart_div', chartDataNow, {
		stackSeries: true,
		captureRightClick: true,
		seriesColors: [ "#0097d1", "#c5b47f", "#EAA228"],
		title: {
			text: '平均播放时长统计图表 ',   // title for the plot,
			show: true,
		},
		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 20,
				highlightMouseOver: true
			},

			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px'
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			lineWidth: 1.5,
			markerOptions: {
				show: true,             // wether to show data point markers.
				shadow: false,       // wether to draw shadow on marker or not.
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 4,
			},
		},
		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},
		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:0,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,

			},
			yaxis: {
				labelOptions:{fontSize:10},
				pad:1.4,
				min:0,
				//max:32,
				//max:6000000,
				label:"时间（分钟）",
				autoscale : true,
				numberTicks: 11,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.0f'},
			}
		},
		series:[
			//{label:'数'}
		],
		legend: {
			show: false,
			location: 'w',
			placement: 'outside'
		} ,
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			sizeAdjust: 6, // 当鼠标移动到数据点上时，数据点扩大的增量增量
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td>播放时长为：</td><td>%s , %s</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};

//过程统计图表
var loadDT_historydata_stagequality_partFour = function (chartDataPara, ticksPara){
	if(chart_historydata_stagequality_partFour){
		chart_historydata_stagequality_partFour.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_historydata_stagequality_partFour = $.jqplot('historydata_stagequality_partFour_chart_div', chartDataNow, {
		stackSeries: false,
		captureRightClick: true,
		seriesColors: ["#579bc2","00c9cb","#9ce159", "#ffe061", "#ffc072" , "#ff5f5e", "#ff2f92","#b44ed3"],
		title: {
			text: '过程质量统计图表',   // title for the plot,
			show: true,
		},
		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 20,
				highlightMouseOver: true
			},

			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px'
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			lineWidth: 1.5, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 4,            // 数据点的大小
			},
		},
		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},
		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:0,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				pad:1.4,
				min:0,
				//max:110,
				label:"百分比",
				autoscale : true,
				numberTicks: 11,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.0f %'},
			}
		},
		series:[
			{label:'调度'},
			{label:'下载M3U8'},
			{label:'下载Piece'},
			{label:'连接Selector'},
			{label:'连接Tracker'},
			{label:'连接RTMFP'},
			{label:'连接Gather'},
			{label:'P2P Piece'},
		],
		legend: {
			show: true,//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'ne',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 20,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			textColor:'#000' ,         //分类名称框距图表区域内字体颜色
			placement: 'outsideGrid',
		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td>成功率：</td><td>%s , %s %</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};


//过程质量相对成功率图表
var loadDT_historydata_stagequality_partFive = function (chartDataPara, ticksPara){
	if(chart_historydata_stagequality_partFive){
		chart_historydata_stagequality_partFive.destroy();
	}
	var chartDataNow = chartDataPara;
	chart_historydata_stagequality_partFive = $.jqplot('historydata_stagequality_partFive_chart_div', chartDataNow, {
		stackSeries: false,
		captureRightClick: true,
		seriesColors: ["#3b6c9d", "#6ea45a","#edb04d", "#ca423e", "#83528c" , "#83528c"],
		title: {
			text: '相对成功率',   // title for the plot,
			show: true,
		},
		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 20,
				highlightMouseOver: true
			},

			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px'
			},
			pointLabels: {show: false},
			shadow: false,   // show shadow or not.
			lineWidth: 1.5, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 4,            // 数据点的大小
			},
		},
		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},
		axes: {
			//labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			xaxis: {
				pad:0,
				min:0,
				ticks:ticksPara,
				renderer: $.jqplot.CategoryAxisRenderer,
			},
			yaxis: {
				pad:1.4,
				//max:60,
				//min:0,
				label:"百分比",
				autoscale : true,
				numberTicks: 11,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				labelOptions: {fontSize: '11pt'},
				tickOptions: {formatString:'%.0f %'},
			}
		},
		series:[
			{label:'Selector/Checksum'},
			{label:'Rtmfp/Selector'},
			{label:'Gather/Selector'},
			{label:'Peer/Gather'}
			//{label:' '},
		],
		legend: {
			show: true,//设置是否出现分类名称框（即所有分类的名称出现在图的某个位置）
			location: 'ne',     // 分类名称框出现位置, nw, n, ne, e, se, s, sw, w.
			xoffset: 20,        // 分类名称框距图表区域上边框的距离（单位px）
			yoffset: 20,        // 分类名称框距图表区域左边框的距离(单位px)
			background:'#fff' ,       //分类名称框距图表区域背景色
			textColor:'#000' ,         //分类名称框距图表区域内字体颜色
			placement: 'outsideGrid',
		},
		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> 	  <tr><td>成功率：</td><td>%s , %s %</td></tr></table>',
			tooltipContentEditor:tooltipContentEditor,
		},
	});
};

var toggleVisibale_history_hgdd = function(){
	//var iColArray = [0,1,3];
	var iColArray = [1,2,3];
	for (var iCol in iColArray)
	{
		var bVis = dt_hgdd.fnSettings().aoColumns[iCol].bVisible;
		dt_hgdd.fnSetColumnVis( iCol, bVis ? false : true );
	}

};

var loadDT_historydata_hgdd = function(){
	var fromdate = $("#fromdatepicker_hgdd").datepicker("getDate");

	var isasday = 0;//$("#asday_hgdd:checked").val();
	//var ticks = getDates(fromdate,todate,isasday);
	dt_hgdd.fnClearTable();

	var dataForDisplay = new Array();
	var objHour=document.getElementById("divselect_forhour_hgdd");
	var nHour=objHour.selectedIndex;
	var val_hgdd_atclock = nHour;

	//var str_address=objAA.options[iS].value;
	//var ipPort_historydata_hgdd = str_address;

	//var valIPPort = ipPort_historydata_hgdd.split(":");
	var strIp = '0'; //valIPPort[0];
	var strPort = 0; //valIPPort[1];

	var val_divselect_version_hgdd = -1;
	/*
	 var sel_divselect_version_hgdd=document.getElementById("divselect_version_hgdd");
	 var index_divselect_version_hgdd=sel_divselect_version_hgdd.selectedIndex;
	 var val_divselect_version_hgdd = sel_divselect_version_hgdd.options[index_divselect_version_hgdd].value;
	 */

	var val_divselect_cliptype_hgdd = -1;
	/*var sel_divselect_cliptype_hgdd=document.getElementById("divselect_cliptype_hgdd");
	 var index_divselect_cliptype_hgdd=sel_divselect_cliptype_hgdd.selectedIndex;
	 var val_divselect_cliptype_hgdd = sel_divselect_cliptype_hgdd.options[index_divselect_cliptype_hgdd].value;
	 */


	//var val_divselect_idcvar_hgdd = -1;
	var sel_divselect_idcvar_hgdd=document.getElementById("divselect_idcvar_hgdd");
	var index_divselect_idcvar_hgdd=sel_divselect_idcvar_hgdd.selectedIndex;
	var val_divselect_idcvar_hgdd = sel_divselect_idcvar_hgdd.options[index_divselect_idcvar_hgdd].value;


	$.ajax( {
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/hisdata_hgdd?type=" + (isasday? "day" : "hour") + "&from=" + fromdate.toDateString() +"&at=" + val_hgdd_atclock
		+"&ip=" +strIp +"&port="+strPort + "&typVar="+val_divselect_cliptype_hgdd + "&verVar="+val_divselect_version_hgdd
		+"&idcVar="+val_divselect_idcvar_hgdd,
		"beforeSend": function () {
			spinOpen("querygo_hgdd_spin");
		},
		"complete":function (res, textStatus) {
			spinClose();
		},

		"success":function (res,textStatus) {
			if(res.result == "success"){

				dt_hgdd.fnAddData(res.data);

				//loadDT_historydata_hgdd_partTwo(chartData, Number(nAxisY),chartDataX);

			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else if(res.result == "zero"){
				chart_historydata_hgdd.destroy();
				showLoadError("无相关数据");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};

//------------------------------------------------------------
var loadDT_recentall = function(){

	var arrayA = new Array();
	var arrayB = new Array();
	var arrayC = new Array();
	var arrayD = new Array();
	var avgA,avgB,avgC,avgD;
	var minA,minB,minC,minD;
	var maxA,maxB,maxC,maxD;
	$.ajax( {
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/recentAllInfo",
		"success":function (res,textStatus) {
			if(res.result == "success"){
				arrayA.push( (res.data.cdeusers).reverse() );
				arrayB.push( (res.data.rtmfpusers).reverse() );
				arrayC.push( (res.data.ptopdownload).reverse() );
				arrayD.push( (res.data.connectivity).reverse() );
				///	console.log(res.data.ptopdownload.reverse());
				//console.log(arrayC);

				loadDT_recentall_plotchart_cdeusers(arrayA,  0);
				//loadDT_recentall_plotchart_cdeusers(arrayB,  0);
				loadDT_recentall_plotchart_rtmfpusers(arrayB,  0);
				loadDT_recentall_plotchart_ptopdownload(arrayC, 0);
				//loadDT_recentall_plotchart_connectivity(arrayD,  0);


			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else if(res.result == "zero"){
				chart_historydata_onlineuser.destroy();
				showLoadError("无相关数据");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};




//cde用户数 最近一览
var loadDT_recentall_plotchart_cdeusers = function (chartDataPara, ticksPara){
	//alert("chartDataPara:"+chartDataPara);
	if(servermonitor_recentall_cdeusers_chart_div){
		servermonitor_recentall_cdeusers_chart_div.destroy();
	}
	servermonitor_recentall_cdeusers_chart_div = $.jqplot('servermonitor_recentall_cdeusers_chart_div', chartDataPara, {
		stackSeries: true,
		captureRightClick: true,
		seriesColors: [ "#0097d1", "#c5b47f", "#EAA228"],
		title: {
			text: '最近30分钟 CDE用户数 ',   // title for the plot,
			show: true,
		},
		//series:[{renderer:$.jqplot.BarRenderer}],//柱状图
		seriesDefaults:{
			rendererOptions: {
				highlightMouseOver: true
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				fontSize: '11px',
			},
			pointLabels: {show: false},//数据点数值
			shadow: false,   // show shadow or not.
			lineWidth: 2, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 6,            // 数据点的大小
			},
		},

		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},

		axes: {
			xaxis: {
				showTicks:false,
				pad:1,
				//ticks: [1,5,10,15,20,25,30,35,40,45,50,55,60],
			},
			yaxis: {
				min:0,
				//max:2000000,
				tickOptions: {
					fontSize: '11px'
				},
				pad:1.5,
				autoscale : true,
				numberTicks: 7,
				label:"CDE用户数",
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			}
		},

		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			sizeAdjust: 8, // 当鼠标移动到数据点上时，数据点扩大的增量增量
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td></td><td>%s , %s</td></tr></table>',
		},
	});
};

//rtmfp用户数 最近一览
var loadDT_recentall_plotchart_rtmfpusers = function (chartDataPara, ticksPara){
	if(servermonitor_recentall_rtmfpusers_chart_div){
		servermonitor_recentall_rtmfpusers_chart_div.destroy();
	}
	//console.log("rtmfpusers",chartDataPara);
	servermonitor_recentall_rtmfpusers_chart_div = $.jqplot('servermonitor_recentall_rtmfpusers_chart_div', chartDataPara, {
		stackSeries: false,
		captureRightClick: true,

		seriesColors: [ "#ec6941", "#c5b47f", "#EAA228"],

		title: {
			text: '最近30分钟 Rtmfp用户数 ',   // title for the plot,
			show: true,
		},
		//series:[{renderer:$.jqplot.BarRenderer}],
		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 20,
				highlightMouseOver: true
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px',
			},
			pointLabels: {show: false},//数据点数值
			shadow: false,   // show shadow or not.
			lineWidth: 2, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 6,            // 数据点的大小
			},
		},

		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},

		axes: {
			xaxis: {
				showTicks:false,
				pad:1,
				//ticks: [1,5,10,15,20,25,30,35,40,45,50,55,60],
			},
			yaxis: {
				min:0,
				//max:3000000,
				tickOptions: {
					fontSize: '11px'
				},
				pad:1.5,
				autoscale : true,
				numberTicks: 7,
				label:"Rtmfp用户数",
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
			}
		},

		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			sizeAdjust: 8, // 当鼠标移动到数据点上时，数据点扩大的增量增量
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td></td><td>%s , %s</td></tr></table>',
		},
	});
};

//P2P下载率 最近一览
var loadDT_recentall_plotchart_ptopdownload = function (chartDataPara, ticksPara){
	if(servermonitor_recentall_ptopdownload_chart_div){
		servermonitor_recentall_ptopdownload_chart_div.destroy();
	}
	console.log("ptopdownload",chartDataPara);
	servermonitor_recentall_ptopdownload_chart_div = $.jqplot('servermonitor_recentall_ptopdownload_chart_div', chartDataPara, {
		seriesColors: [ "#22ac38", "#c5b47f", "#EAA228"],
		title: {
			text: '最近30分钟 P2P下载率 ',   // title for the plot,
			show: true,
		},
		stackSeries: true,
		captureRightClick: true,

		seriesDefaults:{
			//renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				barMargin: 20,
				highlightMouseOver: true
			},
			tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
			tickOptions: {
				angle: 30,
				fontSize: '11px',
			},
			pointLabels: {show: false},
			tickOptions: {formatString:'%.2f%'},
			shadow: false,   // show shadow or not.
			lineWidth: 2, // 分类图（特别是折线图）哪宽度
			markerOptions: {
				shadow: false,       // wether to draw shadow on marker or not.
				show: true,             // 是否在图中显示数据点
				style: 'filledCircle', // 各个数据点在图中显示的方式，默认是"filledCircle"(实心圆点),
				//其他几种方式circle，diamond, square, filledCircle，
				// filledDiamond or filledSquare.
				lineWidth: 1,       // 数据点各个的边的宽度（如果设置过大，各个边会重复，会显示的类似于实心点）
				size: 6,            // 数据点的大小
			},
		},

		axesDefaults: {
			tickOptions: {
				showMark: false,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				showLabel: true,    // wether to show the text label at the tick,
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},

		axes: {
			xaxis: {
				showTicks:false,
				pad:1,
				//ticks: [1,5,10,15,20,25,30,35,40,45,50,55,60],
			},
			yaxis: {
				//min:0,
				//max:80,
				tickOptions: {
					fontSize: '11px'
				},
				pad:1.4,
				autoscale : true,
				numberTicks: 11,
				label:"P2P下载率",
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				tickOptions: {formatString:'%.2f %'},
			}
		},

		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#ddd'  ,  // 设置整个图标区域网格背景线的颜色
			background: '#f9f9f9',      // 设置整个图表区域的背景色
			borderColor: '#999999',     // 设置图表的(最外侧)边框的颜色
			borderWidth: 1.0,           //设置图表的（最外侧）边框宽度
			shadow: false,               // 为整个图标（最外侧）边框设置阴影，以突出其立体效果
			renderer: $.jqplot.CanvasGridRenderer, // renderer to use to draw the grid.
			rendererOptions: {}      ,   // options to pass to the renderer. Note, the default
			// CanvasGridRenderer takes no additional options.
		},
		highlighter: {
			show: true,
			showMarker:true,
			tooltipAxes: 'xy',
			yvalues: 1,
			sizeAdjust: 8, // 当鼠标移动到数据点上时，数据点扩大的增量增量
			// You can customize the tooltip format string of the highlighter
			// to include any arbitrary text or html and use format string
			// placeholders (%s here) to represent x and y values.
			formatString:'<table class="jqplot-highlighter"> \
			  <tr><td></td><td>%s , %s %</td></tr></table>',
		},
	});
};

//服务器连通率 最近一览
var loadDT_recentall_plotchart_connectivity = function (chartDataPara, nMaxY,ticksPara){
	if(servermonitor_recentall_connectivity_chart_div){
		servermonitor_recentall_connectivity_chart_div.destroy();
	}
	servermonitor_recentall_connectivity_chart_div = $.jqplot('servermonitor_recentall_connectivity_chart_div', chartDataPara, {

		seriesColors: [ "#4bb2c5", "#c5b47f", "#EAA228", "#579575", "#839557", "#958c12",
			"#953579", "#4b5de4", "#d8b83f", "#ff5800", "#0085cc"],  // colors that will
		// be assigned to the series.  If there are more series than colors, colors
		// will wrap around and start at the beginning again.

		stackSeries: false, // if true, will create a stack plot.
							// Currently supported by line and bar graphs.
		title: {
			text: '连通率',   // title for the plot,
			show: true,
		},

		axesDefaults: {
			pointLabels: {show: true},
			show: false,    // wether or not to renderer the axis.  Determined automatically.
			min: null,      // minimum numerical value of the axis.  Determined automatically.
			max: null,      // maximum numverical value of the axis.  Determined automatically.
			pad: 1.2,       // a factor multiplied by the data range on the axis to give the
							// axis range so that data points don't fall on the edges of the axis.
			//ticks: [],      // a 1D [val1, val2, ...], or 2D [[val, label], [val, label], ...]
			// array of ticks to use.  Computed automatically.
			//numberTicks: undefined,
			renderer: $.jqplot.LinearAxisRenderer,  // renderer to use to draw the axis,
			//rendererOptions: {},    // options to pass to the renderer.  LinearAxisRenderer
			// has no options,
			tickOptions: {
				mark: 'outside',    // Where to put the tick mark on the axis
									// 'outside', 'inside' or 'cross',
				showMark: true,
				showGridline: true, // wether to draw a gridline (across the whole grid) at this tick,
				markSize: 4,        // length the tick will extend beyond the grid in pixels.  For
									// 'cross', length will be added above and below the grid boundary,
				show: true,         // wether to show the tick (mark and label),
				showLabel: true,    // wether to show the text label at the tick,
				formatString: '',   // format string to use with the axis tick formatter
			},
			showTicks: true,        // wether or not to show the tick labels,
			showTickMarks: true,    // wether or not to show the tick marks
		},

		axes: {
			xaxis: {
				// same options as axesDefaults
			},
			yaxis: {
				// same options as axesDefaults
				ticks: [0,50,100,150],
			},
			x2axis: {
				// same options as axesDefaults
			},
			y2axis: {
				// same options as axesDefaults
			}
		},

		seriesDefaults: {
			show: true,     // wether to render the series.
			xaxis: 'xaxis', // either 'xaxis' or 'x2axis'.
			yaxis: 'yaxis', // either 'yaxis' or 'y2axis'.
			label: 'thisLable',      // label to use in the legend for this line.
			color: '#006600',      // CSS color spec to use for the line.  Determined automatically.
			lineWidth: 2.5, // Width of the line in pixels.
			shadow: true,   // show shadow or not.
			shadowAngle: 45,    // angle (degrees) of the shadow, clockwise from x axis.
			shadowOffset: 1.25, // offset from the line of the shadow.
			shadowDepth: 3,     // Number of strokes to make when drawing shadow.  Each
								// stroke offset by shadowOffset from the last.
			shadowAlpha: 0.1,   // Opacity of the shadow.
			showLine: true,     // whether to render the line segments or not.
			showMarker: true,   // render the data point markers or not.
			fill: true,        // fill under the line,
			fillAndStroke: false,       // *stroke a line at top of fill area.
			fillColor: '#446644',       // *custom fill color for filled lines (default is line color).
			fillAlpha: undefined,       // *custom alpha to apply to fillColor.
			renderer: $.jqplot.LineRenderer ,    // renderer used to draw the series.
			//rendererOptions: {}, // options passed to the renderer.  LineRenderer has no options.
			markerRenderer: $.jqplot.MarkerRenderer,    // renderer to use to draw the data
														// point markers.
			markerOptions: {
				show: true,             // wether to show data point markers.
				style: 'filledCircle',  // circle, diamond, square, filledCircle.
										// filledDiamond or filledSquare.
				lineWidth: 2,       // width of the stroke drawing the marker.
				size: 9,            // size (diameter, edge length, etc.) of the marker.
				color: '#666666',    // color of marker, set to color of line by default.
				shadow: true,       // wether to draw shadow on marker or not.
				shadowAngle: 45,    // angle of the shadow.  Clockwise from x axis.
				shadowOffset: 1,    // offset from the line of the shadow,
				shadowDepth: 3,     // Number of strokes to make when drawing shadow.  Each stroke
									// offset by shadowOffset from the last.
				shadowAlpha: 0.07   // Opacity of the shadow
			}
		},

		series:[
			//{Each series has same options as seriesDefaults},
			//{You can override each series individually here}
			{
				label:'连通率',
				fontSize: '12pt'
			}
		],

		legend: {
			show: true,
			location: 'w',     // compass direction, nw, n, ne, e, se, s, sw, w.
			xoffset: 12,        // pixel offset of the legend box from the x (or x2) axis.
			yoffset: 12        // pixel offset of the legend box from the y (or y2) axis.
		},

		grid: {
			drawGridLines: true,        // wether to draw lines across the grid or not.
			gridLineColor: '#cccccc',    // *Color of the grid lines.
			background: '#fffdf6',      // CSS color spec for background color of grid.
			borderColor: '#999999',     // CSS color spec for border around grid.
			borderWidth: 2.0,           // pixel width of border around grid.
			shadow: true,               // draw a shadow for grid.
			shadowAngle: 45,            // angle of the shadow.  Clockwise from x axis.
			shadowOffset: 1.5,          // offset from the line of the shadow.
			shadowWidth: 3,             // width of the stroke for the shadow.
			shadowDepth: 3,             // Number of strokes to make when drawing shadow.
										// Each stroke offset by shadowOffset from the last.
			shadowAlpha: 0.07,           // Opacity of the shadow
			renderer: $.jqplot.CanvasGridRenderer,  // renderer to use to draw the grid.
			rendererOptions: {}         // options to pass to the renderer.  Note, the default
										// CanvasGridRenderer takes no additional options.
		},

		// Plugin and renderer options.

		// BarRenderer.
		// With BarRenderer, you can specify additional options in the rendererOptions object
		// on the series or on the seriesDefaults object.  Note, some options are respecified
		// (like shadowDepth) to override lineRenderer defaults from which BarRenderer inherits.

		seriesDefaults: {
			rendererOptions: {
				barPadding: 8,      // number of pixels between adjacent bars in the same
									// group (same category or bin).
				barMargin: 10,      // number of pixels between adjacent groups of bars.
				barDirection: 'vertical', // vertical or horizontal.
				barWidth: null,     // width of the bars.  null to calculate automatically.
				shadowOffset: 2,    // offset from the bar edge to stroke the shadow.
				shadowDepth: 5,     // nuber of strokes to make for the shadow.
				shadowAlpha: 0.8,   // transparency of the shadow.
			}
		},

		// Cursor
		// Options are passed to the cursor plugin through the "cursor" object at the top
		// level of the options object.

		cursor: {
			style: 'crosshair',     // A CSS spec for the cursor type to change the
									// cursor to when over plot.
			show: true,
			showTooltip: true,      // show a tooltip showing cursor position.
			followMouse: false,     // wether tooltip should follow the mouse or be stationary.
			tooltipLocation: 'se',  // location of the tooltip either relative to the mouse
									// (followMouse=true) or relative to the plot.  One of
									// the compass directions, n, ne, e, se, etc.
			tooltipOffset: 6,       // pixel offset of the tooltip from the mouse or the axes.
			showTooltipGridPosition: false,     // show the grid pixel coordinates of the mouse
												// in the tooltip.
			showTooltipUnitPosition: true,      // show the coordinates in data units of the mouse
												// in the tooltip.
			tooltipFormatString: '%.4P',    // sprintf style format string for tooltip values.
			useAxesFormatters: true,        // wether to use the same formatter and formatStrings
											// as used by the axes, or to use the formatString
											// specified on the cursor with sprintf.
			tooltipAxesGroups: [],  // show only specified axes groups in tooltip.  Would specify like:
									// [['xaxis', 'yaxis'], ['xaxis', 'y2axis']].  By default, all axes
									// combinations with for the series in the plot are shown.

		},

		// Dragable
		// Dragable options are specified with the "dragable" object at the top level
		// of the options object.

		dragable: {
			color: undefined,       // custom color to use for the dragged point and dragged line
									// section. default will use a transparent variant of the line color.
			constrainTo: 'none',    // Constrain dragging motion to an axis: 'x', 'y', or 'none'.
		},

		// Highlighter
		// Highlighter options are specified with the "highlighter" object at the top level
		// of the options object.

		highlighter: {
			lineWidthAdjust: 2.5,   // pixels to add to the size line stroking the data point marker
									// when showing highlight.  Only affects non filled data point markers.
			sizeAdjust: 5,          // pixels to add to the size of filled markers when drawing highlight.
			showTooltip: true,      // show a tooltip with data point values.
			tooltipLocation: 'nw',  // location of tooltip: n, ne, e, se, s, sw, w, nw.
			fadeTooltip: true,      // use fade effect to show/hide tooltip.
			tooltipFadeSpeed: "fast",// slow, def, fast, or a number of milliseconds.
			tooltipOffset: 2,       // pixel offset of tooltip from the highlight.
			tooltipAxes: 'both',    // which axis values to display in the tooltip, x, y or both.
			tooltipSeparator: ', ' , // separator between values in the tooltip.
			useAxesFormatters: true, // use the same format string and formatters as used in the axes to
			// display values in the tooltip.
			//tooltipFormatString: '%.5P' // sprintf format string for the tooltip.  only used if
			// useAxesFormatters is false.  Will use sprintf formatter with
			// this string, not the axes formatters.
		},

		// LogAxisRenderer
		// LogAxisRenderer add 2 options to the axes object.  These options are specified directly on
		// the axes or axesDefaults object.

		axesDefaults: {
			base: 10,                   // the logarithmic base.
			tickDistribution: 'even',   // 'even' or 'power'.  'even' will produce with even visiual (pixel)
										// spacing on the axis.  'power' will produce ticks spaced by
										// increasing powers of the log base.
		},

		// PieRenderer
		// PieRenderer accepts options from the rendererOptions object of the series or seriesDefaults object.

		seriesDefaults: {
			rendererOptions: {
				diameter: undefined, // diameter of pie, auto computed by default.
				padding: 20,        // padding between pie and neighboring legend or plot margin.
				sliceMargin: 0,     // gap between slices.
				fill: true,         // render solid (filled) slices.
				shadowOffset: 2,    // offset of the shadow from the chart.
				shadowDepth: 5,     // Number of strokes to make when drawing shadow.  Each stroke
									// offset by shadowOffset from the last.
				shadowAlpha: 0.07   // Opacity of the shadow
			}
		},

		// Trendline
		// Trendline takes options on the trendline object of the series or seriesDefaults object.

		seriesDefaults: {
			trendline: {
				show: true,         // show the trend line
				color: '#666666',   // CSS color spec for the trend line.
				label: '',          // label for the trend line.
				type: 'linear',     // 'linear', 'exponential' or 'exp'
				shadow: true,       // show the trend line shadow.
				lineWidth: 1.5,     // width of the trend line.
				shadowAngle: 45,    // angle of the shadow.  Clockwise from x axis.
				shadowOffset: 1.5,  // offset from the line of the shadow.
				shadowDepth: 3,     // Number of strokes to make when drawing shadow.
									// Each stroke offset by shadowOffset from the last.
				shadowAlpha: 0.07   // Opacity of the shadow
			}
		}

	});
};
//--------------------------------------------

$( "#getvalue" ).click(function() {
	alert( spinner.spinner( "value" ) );
});
$( "#setvalue" ).click(function() {
	spinner.spinner( "value", 5 );
});

//-------------------------------------------------
var fillServerInfoDropList = function(){
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/serverIPList",
		"success":function (res,textStatus) {
			idc_data_from_lb = res.data;

			//alert('res.data.length is: '+res.data.length);
			var obj_s_onlineuser=document.getElementById("divselect_onlineuser");

			for ( var i=0;i<res.data.length;i++){
				var oOption_onlineuser = document.createElement("OPTION");
				oOption_onlineuser.value= res.data[i][1];
				oOption_onlineuser.text= res.data[i][1];
				obj_s_onlineuser.options.add(oOption_onlineuser);

				//$("divselect_nodedistribute").options.add(oOption);
				//$("divselect_ptopratio").options.add(oOption);
			} // for
		} // function
	});
};

var fillVersionInfoDropList = function(){
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/serverVersionList",
		"success":function (res,textStatus) {
			version_data_from_lb = res.data;
			version_data_from_lb=sortArr(version_data_from_lb);
			var obj_v_nodedistribute=document.getElementById("divselect_version_nodedistribute");
			var obj_v_ptopratio=document.getElementById("divselect_version_ptopratio");
			var obj_v_all_share=document.getElementById("divselect_version_all_share");
			var obj_v_stagequality=document.getElementById("divselect_version_stagequality");
			var obj_v_filmduration=document.getElementById("divselect_version_filmduration");
			var obj_v_videobitrate=document.getElementById("divselect_version_videobitrate");

			for ( var i=0;i<res.data.length;i++){

				var oOption_nodedistribute = document.createElement("OPTION");
				oOption_nodedistribute.value= res.data[i][0]; //res.data[i];
				oOption_nodedistribute.text= res.data[i][1];
				obj_v_nodedistribute.options.add(oOption_nodedistribute);

				var oOption_ptopratio = document.createElement("OPTION");
				oOption_ptopratio.value= res.data[i][0];
				oOption_ptopratio.text= res.data[i][1];
				obj_v_ptopratio.options.add(oOption_ptopratio);

				var oOption_all_share = document.createElement("OPTION");
				oOption_all_share.value= res.data[i][0];
				oOption_all_share.text= res.data[i][1];
				obj_v_all_share.options.add(oOption_all_share);


				var oOption_stagequality = document.createElement("OPTION");
				oOption_stagequality.value= res.data[i][0];
				oOption_stagequality.text= res.data[i][1];
				obj_v_stagequality.options.add(oOption_stagequality);

				var oOption_filmduration = document.createElement("OPTION");
				oOption_filmduration.value= res.data[i][0];
				oOption_filmduration.text= res.data[i][1];
				obj_v_filmduration.options.add(oOption_filmduration);

				var oOption_videobitrate = document.createElement("OPTION");
				oOption_videobitrate.value= res.data[i][0];
				oOption_videobitrate.text= res.data[i][1];
				obj_v_videobitrate.options.add(oOption_videobitrate);
			} // for
		} // function
	});
};

var fillGroupInfoDropList = function(){
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/serverGroupList",
		"success":function (res,textStatus) {
			group_data_from_lb = res.data;

			var obj_g_nodedistribute=document.getElementById("divselect_group_nodedistribute");
			var obj_g_ptopratio=document.getElementById("divselect_group_ptopratio");
			var obj_g_all_share=document.getElementById("divselect_group_all_share");
			var obj_g_stagequality=document.getElementById("divselect_group_stagequality");

			for ( var i=0;i<res.data.length;i++){

				var oOption_nodedistribute = document.createElement("OPTION");
				oOption_nodedistribute.value= res.data[i][0]; //res.data[i];
				oOption_nodedistribute.text= res.data[i][1];
				obj_g_nodedistribute.options.add(oOption_nodedistribute);

				var oOption_ptopratio = document.createElement("OPTION");
				oOption_ptopratio.value= res.data[i][0];
				oOption_ptopratio.text= res.data[i][1];
				obj_g_ptopratio.options.add(oOption_ptopratio);

				var oOption_all_share = document.createElement("OPTION");
				oOption_all_share.value= res.data[i][0];
				oOption_all_share.text= res.data[i][1];
				obj_g_all_share.options.add(oOption_all_share);

				var oOption_stagequality = document.createElement("OPTION");
				oOption_stagequality.value= res.data[i][0];
				oOption_stagequality.text= res.data[i][1];
				obj_g_stagequality.options.add(oOption_stagequality);

			} // for
		} // function
	});
};
var fillCloundCIdList = function()
{
	cloundCId_DT = null;
	getRequest
	(
		'/query/cloundCidList?',
		function( result,textStatus ){
			cloundCId_DT = result.data;
			handlerSelectOpt();
		}
	);
}
var handlerSelectOpt = function()
{
	var selectOpt = cloundCId_DT.concat();
	selectOpt.unshift([-1,'ch']);

	$("#share_select_items_ch").empty();
	$("#static_select_items_ch").empty();
	addSelectOption('share_select_items_ch',selectOpt);
	addSelectOption('static_select_items_ch',selectOpt);
};

var fillStreamInfoDropList = function(){
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/serverStreamList",
		"success":function (res,textStatus) {
			stream_data_from_lb = res.data;

			var obj_s_nodedistribute=document.getElementById("divselect_stream_nodedistribute");
			var obj_s_ptopratio=document.getElementById("divselect_stream_ptopratio");
			var obj_s_all_share=document.getElementById("divselect_stream_all_share");
			var obj_s_stagequality=document.getElementById("divselect_stream_stagequality");

			for ( var i=0;i<res.data.length;i++){

				var oOption_nodedistribute = document.createElement("OPTION");
				oOption_nodedistribute.value= res.data[i][0]; //res.data[i];
				oOption_nodedistribute.text= res.data[i][1];
				obj_s_nodedistribute.options.add(oOption_nodedistribute);

				var oOption_ptopratio = document.createElement("OPTION");
				oOption_ptopratio.value= res.data[i][0];
				oOption_ptopratio.text= res.data[i][1];
				obj_s_ptopratio.options.add(oOption_ptopratio);

				var oOption_all_share = document.createElement("OPTION");
				oOption_all_share.value= res.data[i][0];
				oOption_all_share.text= res.data[i][1];
				obj_s_all_share.options.add(oOption_all_share);

				var oOption_stagequality = document.createElement("OPTION");
				oOption_stagequality.value= res.data[i][0];
				oOption_stagequality.text= res.data[i][1];
				obj_s_stagequality.options.add(oOption_stagequality);

			} // for
		} // function
	});
};

var upgrade_local_version_list = function(){
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/upgradeversion",
		"success":function (res,textStatus) {
			upgrade_version_from_db = res.data;
			upgrade_version_from_db=sortupgrade(upgrade_version_from_db);
			var obj_v_local_upgrade=document.getElementById("divselect_primary_version_upgrade");

			for ( var i=1;i<res.data.length;i++){
				var oOption_local_upgrade = document.createElement("OPTION");
				oOption_local_upgrade.value= res.data[i][0]; //res.data[i];
				oOption_local_upgrade.text= res.data[i][1];
				obj_v_local_upgrade.options.add(oOption_local_upgrade);

			}
		}
	});
};
var upgrade_server_version_list = function(){
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/upgradeversion",
		"success":function (res,textStatus) {
			upgrade_version_from_db = res.data;
			upgrade_version_from_db=sortupgrade(upgrade_version_from_db);
			var obj_v_server_upgrade=document.getElementById("divselect_aim_version_upgrade");

			for ( var i=0;i<res.data.length;i++){
				var oOption_server_upgrade = document.createElement("OPTION");
				oOption_server_upgrade.value= res.data[i][0]; //res.data[i];
				oOption_server_upgrade.text= res.data[i][1];
				obj_v_server_upgrade.options.add(oOption_server_upgrade);

			}
		}
	});
};

//----------------------------------------------------------
var showInfo = function(text){
	spinClose();
	$("#dialogtext").text(text);
	$("#dialog").dialog({
		buttons: {"Ok":function(){$(this).dialog("close");}},
		modal:true,
		close:function(event,ui){

		}
	});
};

var showExpired = function(text){
	spinClose();
	$("#dialogtext").text(text);
	$("#dialog").dialog({
		buttons: {"Ok":function(){$(this).dialog("close");}},
		modal:true,
		close:function(event,ui){
			window.location.href = "/";
		}
	});
};

var showLoadError = function(text){
	spinClose();
	$("#dialogtext").text(text);
	$("#dialog").dialog({
		buttons: {"Ok":function(){$(this).dialog("close");}},
		modal:true
	});
};

var showTopInfo = function(){
	if(document.cookie){
		var usr;
		var cookies = document.cookie.split(";");
		for(var i = 0; i < cookies.length;i++){
			var kv = cookies[i].split("=");
			if(kv.length > 1 && $.trim(kv[0]) == "user"){
				usr = $.trim(kv[1]);
				break;
			}
		}
		if(usr){
			$("#topinfo").html("<a id='topinfousr' href='#'>" + usr + "</a>" +
				"<a id='topinfoexit' href='#'>退出</a>");
		}
	}
};

var uifunc_addnewuser= function(){
	var usrname = $("#anu_username").val();
	var mb = $("#anu_mailbox").val();
	var psw = $("#anu_password").val();

	$.ajax( {
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/useradmin/addnewuser?usr=" + usrname + "&mb=" + mb + "&ptxt=" + psw ,
		"success":function (res,textStatus) {
			if(res && res.result == "success"){
				$("#mpswmessage").text("添加用户成功");
			}else if(res && res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				$("#mpswmessage").text("添加用户失败");
			}
		}
	});

};


var modifyPsw = function(){
	var old_psw = $("#oldpsw").val();
	var new_psw = $("#newpsw").val();
	var rnew_psw = $("#renewpsw").val();
	if(old_psw.length <= 0){
		$("#mpswmessage").text("请输入当前密码");
		return;
	}
	if(new_psw.length <= 0){
		$("#mpswmessage").text("请输入新密码");
		return;
	}
	if(rnew_psw.length <= 0){
		$("#mpswmessage").text("请输入再输入一遍新密码");
		return;
	}

	if(new_psw!=rnew_psw){
		$("#mpswmessage").text("两次输入不一致");
		return;
	}

	$.ajax( {
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/settings/modifypsw?opsw=" + old_psw + "&npsw=" + new_psw,
		"success":function (res,textStatus) {
			if(res && res.result == "success"){
				$("#mpswmessage").text("修改密码成功");
			}else if(res && res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				$("#mpswmessage").text("修改密码失败");
			}
		}
	});
};


var showSvrrecentall = function(){
	$("#servermonitor").show();
	$("#servermonitor_recentall_datawiget").show();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();
	$("#servermonitor_groupids_datawiget").hide();
	$("#servermonitor_stream_datawiget").hide();

	$("#historydata").hide();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();
	$("#historydata_stagequality_datawiget").hide();
	$("#historydata_filmduration_datawiget").hide();
	$("#historydata_videobitrate_datawiget").hide();
	$("#historydata_pl_datawiget").hide();
	$("#historydata_hgdd_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();


	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#mpswcontainer").hide()
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};


var showSvrGroupIDs = function(){
	$("#servermonitor").show();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();
	$("#servermonitor_groupids_datawiget").show();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#historydata").hide();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();
	$("#historydata_stagequality_datawiget").hide();
	$("#historydata_filmduration_datawiget").hide();
	$("#historydata_videobitrate_datawiget").hide();
	$("#historydata_pl_datawiget").hide();
	$("#historydata_hgdd_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#mpswcontainer").hide()
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};


var showSvrRTMFP = function(){
	$("#servermonitor").show();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").show();
	$("#servermonitor_cde_datawiget").hide();
	$("#servermonitor_groupids_datawiget").hide();

	$("#historydata").hide();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();
	$("#historydata_stagequality_datawiget").hide();
	$("#historydata_filmduration_datawiget").hide();
	$("#historydata_videobitrate_datawiget").hide();
	$("#historydata_pl_datawiget").hide();
	$("#historydata_hgdd_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};

var showSvrCDE = function(){
	$("#servermonitor").show();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").show();
	$("#servermonitor_groupids_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#historydata").hide();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();
	$("#historydata_stagequality_datawiget").hide();
	$("#historydata_filmduration_datawiget").hide();
	$("#historydata_videobitrate_datawiget").hide();
	$("#historydata_pl_datawiget").hide();
	$("#historydata_hgdd_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};

var show_historydata_onlineuser = function(){

	$("#historydata").show();
	$("#historydata_onlineuser_datawiget").show();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();
	$("#historydata_stagequality_datawiget").hide();
	$("#historydata_filmduration_datawiget").hide();
	$("#historydata_videobitrate_datawiget").hide();
	$("#historydata_pl_datawiget").hide();
	$("#historydata_hgdd_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();
	$("#servermonitor_groupids_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};

var show_historydata_nodedistribute = function(){
	$("#historydata").show();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").show();
	$("#historydata_ptopratio_datawiget").hide();
	$("#historydata_stagequality_datawiget").hide();
	$("#historydata_filmduration_datawiget").hide();
	$("#historydata_videobitrate_datawiget").hide();
	$("#historydata_pl_datawiget").hide();
	$("#historydata_hgdd_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();
	$("#servermonitor_groupids_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};

var show_historydata_ptopratio = function(){
	$("#historydata").show();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").show();
	$("#historydata_stagequality_datawiget").hide();
	$("#historydata_filmduration_datawiget").hide();
	$("#historydata_videobitrate_datawiget").hide();
	$("#historydata_pl_datawiget").hide();
	$("#historydata_hgdd_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();
	$("#servermonitor_groupids_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};

var show_historydata_stagequality = function(){
	$("#historydata").show();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();
	$("#historydata_stagequality_datawiget").show();
	$("#historydata_filmduration_datawiget").hide();
	$("#historydata_pl_datawiget").hide();
	$("#historydata_hgdd_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();
	$("#servermonitor_groupids_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};

var show_historydata_filmduration = function(){
	$("#historydata").show();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();
	$("#historydata_stagequality_datawiget").hide();
	$("#historydata_filmduration_datawiget").show();
	$("#historydata_videobitrate_datawiget").hide();
	$("#historydata_pl_datawiget").hide();
	$("#historydata_hgdd_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();
	$("#servermonitor_groupids_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};
var show_historydata_pl = function(){
	$("#historydata").show();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();
	$("#historydata_stagequality_datawiget").hide();
	$("#historydata_filmduration_datawiget").hide();
	$("#historydata_videobitrate_datawiget").hide();
	$("#historydata_pl_datawiget").show();
	$("#historydata_hgdd_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();
	$("#servermonitor_groupids_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};

var show_historydata_videobitrate = function(){
	$("#historydata").show();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();
	$("#historydata_stagequality_datawiget").hide();
	$("#historydata_filmduration_datawiget").hide();
	$("#historydata_videobitrate_datawiget").show();
	$("#historydata_pl_datawiget").hide();
	$("#historydata_hgdd_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();
	$("#servermonitor_groupids_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};

var show_historydata_hgdd = function(){

	$("#historydata").show();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();
	$("#historydata_stagequality_datawiget").hide();
	$("#historydata_filmduration_datawiget").hide();
	$("#historydata_videobitrate_datawiget").hide();
	$("#historydata_pl_datawiget").hide();
	$("#historydata_hgdd_datawiget").show();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();
	$("#servermonitor_groupids_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};

var show_table_all_share = function(){
	$("#historydata").hide();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();
	$("#historydata_stagequality_datawiget").hide();
	$("#historydata_filmduration_datawiget").hide();
	$("#historydata_videobitrate_datawiget").hide();
	$("#historydata_pl_datawiget").hide();
	$("#historydata_hgdd_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();
	$("#servermonitor_groupids_datawiget").hide();

	$("#table").show();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").show();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};
var show_upgrade = function(){
	$("#historydata").hide();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();
	$("#historydata_stagequality_datawiget").hide();
	$("#historydata_filmduration_datawiget").hide();
	$("#historydata_videobitrate_datawiget").hide();
	$("#historydata_pl_datawiget").hide();
	$("#historydata_hgdd_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();
	$("#servermonitor_groupids_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#upgrade").show();
	$("#allupgrade").show();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};

var showAllUsers = function(){

	$("#historydata").hide();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").show();
	$("#allusers").show();
	$("#anu_full").hide();


	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};

var showAddNewUser = function(){

	$("#historydata").hide();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").show();
	$("#allusers").hide();
	$("#anu_full").show();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
};

var showModifyPsw = function(){
	hideAllContainer();

	$("#settings").show();
	$("#mpswcontainer").show();

};

var idcDelHandler = function(){
	idc_data_from_lb = null;
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/delIdc?idcId="+arguments[0],
		"success":function (res,textStatus) {
			if(res.result == "success"){
				//更新表
				idc_data_from_lb = res.data;
				showIdcTable();
			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};

var	idcAddHandler= function(){
	if($.trim($("#addIdc").val()).length == 0)
	{
		$("#idcHint").text("输入的信息不合法");
		return;
	}
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/addIdc?idcId="+$.trim($("#addIdc").val())+"&idcType="+$.trim($("#idcType").val()),
		"success":function (res,textStatus) {
			if(res.result == "success"){
				//更新表
				idc_data_from_lb = res.data;
				showIdcTable();
			}else if(res.result == "error"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};

var getIdcTable = function(idc_arr)
{
	var table = '&nbsp;&nbsp;<table border="0" align="left" width="600">'+
		'<tr>'+
		'<th style="width:50px" align="left"><font size="4" face="verdana">id</font></th>'+
		'<th style="width:200px" align="left"><font size="4" face="verdana">&nbsp;&nbsp;ip</font></th>'+
		'<th style="width:200px" align="left"><font size="4" face="verdana">类型</font></th>'+
		'<th style="width:100px"><font size="4" face="verdana">操作</font></th>'+
		'</tr>';

	for(var idcId = 0; idcId < idc_arr.length; idcId++ ){
		table +='<tr >'+
			'<td style="width:200px" align="left">'+idc_arr[idcId][0]+'</td>'+
			'<td style="width:200px" align="left">'+idc_arr[idcId][1]+'</td>';
		if(idc_arr[idcId][2] == 0)
		{
			table +='<td style="width:200px" align="left">电信</td>';
		}
		else if(idc_arr[idcId][2] == 1)
		{
			table +='<td style="width:200px align="left">联通</td>';
		}
		else
		{
			table +='<td style="width:200px align="left">其他</td>';
		}
		table +='<td align="center"><input type="button" id="delIdcBtn" value="删除" onclick="idcDelHandler('+idc_arr[idcId][0]+');"/></td>'+
			'</tr>';
	}

	table +='<tr>'+
		'<td colspan="3" >&nbsp;新增服务器:&nbsp;<input type="text" name="addIdc" id="addIdc" placeholder="请输入合法IP地址"/>&nbsp;&nbsp;&nbsp;&nbsp;类型：'+
		'<input type="text" name="idcType" id="idcType" placeholder="0电信，1联通，2其他"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" id="addIdcBtn" value="确定" onclick="idcAddHandler();"/></td>'+
		'</tr>';
	table += '</table>';
	table +='<label id="idcHint"></label>';
	return table;
};

var showIdcTable = function()
{
	$("#settings_idctype").html(
		getIdcTable(idc_data_from_lb)
	);
};

var showModifyIDC = function(){

	$("#historydata").hide();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").show();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").show();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
	$("#versionManagercontainer").hide();
	showIdcTable();

};
//-----------------------start version -----------------------
var versionDelHandler = function(){
	version_data_from_lb = null;
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/delVersion?versionId="+arguments[0],
		"success":function (res,textStatus) {
			if(res.result == "success"){
				//更新表
				version_data_from_lb = res.data;
				version_data_from_lb=sortArr(version_data_from_lb);
				showVersionTable();
			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};

var	versionAddHandler= function(){
	if($.trim($("#addVersion").val()).length == 0)
	{
		$("#versionHint").text("输入的信息不合法");
		return;
	}
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/addVersion?versionId="+$.trim($("#addVersion").val()),
		"success":function (res,textStatus) {
			if(res.result == "success"){
				//更新表
				version_data_from_lb = res.data;
				version_data_from_lb=sortArr(version_data_from_lb);
				showVersionTable();
			}else if(res.result == "error"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
}
var getTable = function( version_arr ){
	var table = '&nbsp;&nbsp;<table border="0" align="left" width="600">'+
		'<tr>'+
		'<th style="width:50px" align="left"><font size="4" face="verdana">id</font></th>'+
		'<th style="width:100px" align="left"><font size="4" face="verdana">&nbsp;&nbsp;version</font></th>'+
		'<th style="width:100px"><font size="4" face="verdana">操作</font></th>'+
		'</tr>';

	if( !version_arr ){return table +='</table>'; }
	for(var vId = 0; vId < version_arr.length; vId++ ){
		table +='<tr >'+//background: '#f9f9f9'

			'<td style="width:100px" align="left">'+version_arr[vId][0]+'</td>'+
			'<td style="width:100px" align="left">'+version_arr[vId][1]+'</td>'+
			'<td align="center"><input type="button" id="delVersionBtn" value="删除" onclick="versionDelHandler('+version_arr[vId][0]+');"/></td>'+
			'</tr>';
	}
	table +='<tr>'+
		'<td colspan="3">新增版本号： <input type="text" name="addVersion" id="addVersion" /><input type="button" id="addVersionBtn" value="确定" onclick="versionAddHandler();"/></td>'+
		'</tr>';
	table +='</table>';
	table +='<label id="versionHint"></label>';
	return table;
};
var showVersionTable = function(){
	$("#versionManagerTable").html(
		getTable(version_data_from_lb)
	);
};

var showVersionManager = function(){

	$("#historydata").hide();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").show();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#groupcontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
	$("#versionManagercontainer").show();
	showVersionTable();
};
// -----------------------end version ----------------------
//-------------------------start group----------------
var groupDelHandler = function(){
	group_data_from_lb = null;
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/delGroup?groupId="+arguments[0],
		"success":function (res,textStatus) {
			if(res.result == "success"){
				//更新表
				group_data_from_lb = res.data;
				group_data_from_lb=sortArr(group_data_from_lb);
				showGroupTable();
			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};
var	GroupAddHandler= function(){
	if($.trim($("#addGroup").val()).length == 0)
	{
		$("#groupHint").text("输入的信息不合法");
		return;
	}
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/addGroup?groupId="+$.trim($("#addGroup").val()),
		"success":function (res,textStatus) {
			if(res.result == "success"){
				//更新表
				group_data_from_lb = res.data;
				group_data_from_lb=sortArr(group_data_from_lb);
				showGroupTable();
			}else if(res.result == "error"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
}
var get_group_table = function( group_arr ){

	var table = '&nbsp;&nbsp;<table border="0" align="left" width="600">'+
		'<tr>'+
		'<th style="width:50px" align="left"><font size="4" face="verdana">&nbsp;id</font></th>'+
		'<th style="width:100px" align="left"><font size="4" face="verdana">&nbsp;&nbsp;group</font></th>'+
		'<th style="width:100px"><font size="4" face="verdana">操作</font></th>'+
		'</tr>';

	if( !group_arr ){return table +='</table>'; }
	for(var vId = 0; vId < group_arr.length; vId++ ){
		table +='<tr >'+//background: '#f9f9f9'

			'<td style="width:100px" align="left">'+group_arr[vId][0]+'</td>'+
			'<td style="width:100px" align="left">'+group_arr[vId][1]+'</td>'+
			'<td align="center"><input type="button" id="delGroupBtn" value="删除" onclick="groupDelHandler('+group_arr[vId][0]+');"/></td>'+
			'</tr>';
	}
	table +='<tr>'+
		'<td colspan="3">新增GroupID号： <input type="text" name="addGroup" id="addGroup" /><input type="button" id="addGroupBtn" value="确定" onclick="GroupAddHandler();"/></td>'+
		'</tr>';
	table +='</table>';
	table +='<label id="groupHint"></label>';
	return table;
};
var showGroupTable = function(){
	$("#groupManagerTable").html(
		get_group_table(group_data_from_lb)
	);
};

var showGroupManager = function(){

	$("#historydata").hide();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").show();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#versionManagercontainer").hide();
	$("#streamcontainer").hide();
	$("#primarycontainer").hide();
	$("#aimcontainer").hide();
	$("#groupcontainer").show();
	showGroupTable();
};
//----------------end group -----------------------
//----------- start stream  ------------------
var streamDelHandler = function(){
	stream_data_from_lb = null;
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/delStream?streamId="+arguments[0],
		"success":function (res,textStatus) {
			if(res.result == "success"){
				//更新表
				stream_data_from_lb = res.data;
				stream_data_from_lb=sortArr(stream_data_from_lb);
				showStreamTable();
			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};
var	StreamAddHandler= function(){
	if($.trim($("#addStream").val()).length == 0)
	{
		$("#streamHint").text("输入的信息不合法");
		return;
	}
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/addStream?streamId="+$.trim($("#addStream").val()),
		"success":function (res,textStatus) {
			if(res.result == "success"){
				//更新表
				stream_data_from_lb = res.data;
				stream_data_from_lb=sortArr(stream_data_from_lb);
				showStreamTable();
			}else if(res.result == "error"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
}
var get_stream_table = function( stream_arr ){

	var table = '&nbsp;&nbsp;<table border="0" align="left" width="600">'+
		'<tr>'+
		'<th style="width:50px" align="left"><font size="4" face="verdana">&nbsp;id</font></th>'+
		'<th style="width:100px" align="left"><font size="4" face="verdana">&nbsp;&nbsp;stream</font></th>'+
		'<th style="width:100px"><font size="4" face="verdana">操作</font></th>'+
		'</tr>';

	if( !stream_arr ){return table +='</table>'; }
	for(var vId = 0; vId < stream_arr.length; vId++ ){
		table +='<tr >'+//background: '#f9f9f9'

			'<td style="width:100px" align="left">'+stream_arr[vId][0]+'</td>'+
			'<td style="width:100px" align="left">'+stream_arr[vId][1]+'</td>'+
			'<td align="center"><input type="button" id="delStreamBtn" value="删除" onclick="streamDelHandler('+stream_arr[vId][0]+');"/></td>'+
			'</tr>';
	}
	table +='<tr>'+
		'<td colspan="3">新增StreamID号： <input type="text" name="addStream" id="addStream" /><input type="button" id="addStreamBtn" value="确定" onclick="StreamAddHandler();"/></td>'+
		'</tr>';
	table +='</table>';
	table +='<label id="streamHint"></label>';
	return table;
};

var createTable = function(container,tableId,titleList,data,delClickFun,addDataOption,addClickFun,changeClickFun)
{
	if(container)
	{
		if(tableId && titleList && data && delClickFun)
		{
			$('<table></table>', {
				'id': tableId,
				'cellpadding': '0',
				'cellspacing': '0',
				'border': '0',
				'width':"100%",
				'class':'display'
			}).appendTo($('#'+container));
			var tr = $('<tr style="background-color:#dddddd" ></tr>').appendTo($('#'+tableId));

			for(var elm = 0; elm < titleList.length;elm++)
			{
				tr.append('<th style="width:100px" align="center"><font size="4" face="verdana">&nbsp;'+titleList[elm]+'</font></th>');
			}

			for( var outElm = 0; outElm < data.length;outElm++ )
			{
				if(outElm%2==0){
					tr = $('<tr style="background-color:#eeeeee" ></tr>').appendTo($('#'+tableId));
				}else
				{
					tr = $('<tr></tr>').appendTo($('#'+tableId));
				}

				for( var inElm = 0; inElm < data[outElm].length; inElm++ )
				{
					tr.append('<td style="width:100px" align="left">'+data[outElm][inElm]+'</td>');
					if(inElm==data[outElm].length-1)
					{
						if(changeClickFun)
						{
							tr.append('<td align="center"><input type="button" value="删除" onclick="'+delClickFun+'('+data[outElm][0]+')"/>&nbsp;<input type="button" value="修改" onclick="'+changeClickFun+'('+data[outElm][0]+')"/></td>');
						}else{
							tr.append('<td align="center"><input type="button" value="删除" onclick="'+delClickFun+'('+data[outElm][0]+')"/></td>');
						}
					}
				}
			}
		}

		var tr = $('<tr style="background-color:#dddddd" align="center"></tr>').appendTo($('#'+tableId));

		if(titleList.length>0)
		{
			var inputOption = '';
			for(var oElm=0; oElm<addDataOption.length; oElm++ )
			{
				inputOption += addDataOption[oElm][0]+': <input type="text" id="'+addDataOption[oElm][1]+'" />&nbsp;'
			}
			tr.append('<td colspan="'+titleList.length+'">'+inputOption+'&nbsp;<input type="button" id="addStreamBtn" value="确定" onclick="'+addClickFun+'();"/></td>');
		}
	}
};

var createFrom = function(container,tableId,titleList,data,changeClickFun,backClickFun,changeField)
{
	if(container)
	{
		if(tableId && titleList && data && changeClickFun )
		{

			var form = $('<form></form>',{
				'id': tableId
			}).appendTo($('#'+container));

			var table = $('<table></table>', {
				'cellpadding': '0',
				'cellspacing': '0',
				'border': '0',
				'width':"100%",
				'class':'display'
			}).appendTo(form);

			var tr = $('<tr style="background-color:#dddddd" ></tr>').appendTo(table);

			for(var elm = 0; elm < titleList.length;elm++)
			{
				tr.append('<th style="width:100px" align="center"><font size="4" face="verdana">&nbsp;'+titleList[elm]+'</font></th>');
			}

			for( var outElm = 0; outElm < data.length;outElm++ )
			{
				if(outElm%2==0){
					tr = $('<tr style="background-color:#eeeeee" ></tr>').appendTo(table);
				}else
				{
					tr = $('<tr></tr>').appendTo(table);
				}

				for( var inElm = 0; inElm < data[outElm].length; inElm++ )
				{
					if(changeField[inElm])
					{
						tr.append('<td style="width:100px" align="left"><input type="text" name="'+titleList[inElm]+'~_~'+data[outElm][0]+'" value="'+data[outElm][inElm]+'" /></td>');
					}else{
						tr.append('<td style="width:100px" align="left">'+data[outElm][inElm]+'</td>');
					}
				}
			}

			var tr = $('<tr style="background-color:#dddddd" align="center"></tr>').appendTo(table);
			tr.append('<td colspan="'+titleList.length+'"><input type="button" value="提交" onclick="'+changeClickFun+'()"/><input type="button" value="返回" onclick="'+backClickFun+'()"/></td>');
		}
	}
}

var showStreamTable = function(){
	$("#streamManagerTable").html(
		get_stream_table(stream_data_from_lb)
	);
};

function cloundCidDel(id){
	getRequest
	(
		'/query/cloundCidDel?id='+id,
		function( result,textStatus ){
			cloundCId_DT = result.data;
			handlerSelectOpt();
			showCloundCIdTable();
		}
	);
};

function cloundCidAdd(){
	if($.trim($("#cloundCidAddId").val()).length == 0)
	{
		showInfo("输入的信息不合法,请检查是否输入数据或合法性");
		return;
	}
	getRequest
	(
		'/query/cloundCidAdd?ch_name='+$.trim($("#cloundCidAddId").val())+'&ch_remarks='+$.trim($("#remarks").val()),
		function( result,textStatus ){
			cloundCId_DT = result.data;
			handlerSelectOpt();
			showCloundCIdTable();
		}
	);

};

function cloundCidChangeHD(id)
{
	var formDt = $('#cloundCIdFrom').serializeArray();
	var dataFormat = {};
	var id ='';
	var th = '';
	var arr;
	$('#cloundCIdContainerTable').empty();
	for(var elm=0;elm<formDt.length;elm++)
	{
		arr = formDt[elm]['name'].split('~_~');
		id = arr[1];
		th = arr[0];
		if(0 == id ){continue;}
		if(!dataFormat[id])
		{
			dataFormat[id]={};
		}

		dataFormat[id][th]=formDt[elm]['value'];
	}
	//console.log(">>"+JSON.stringify(dataFormat));
	getRequest
	(
		'/query/cloundCidUpdate',
		function (result)
		{
			//alert('reback');
			//showCloundCIdTable();
			cloundCId_DT = result.data;
			handlerSelectOpt();
			showCloundCIdTable();
		},
		'post',
		JSON.stringify(dataFormat)
	);
};

function cloundCidBackHD(id)
{
	showCloundCIdTable();
};

function cloundCidChange(id)
{
	$('#cloundCIdContainerTable').empty();
	var tmpData = [];
	for(var elm=1; elm < cloundCId_DT.length; elm++)
	{
		if( id == cloundCId_DT[elm][0])
		{
			tmpData.push(cloundCId_DT[elm]);
			break;
		}
	}
	createFrom(
		'cloundCIdContainerTable',
		'cloundCIdFrom',
		['id','ch_name','备注'],
		tmpData,
		'cloundCidChangeHD',
		'cloundCidBackHD',
		[0,0,1]
	);
};

var showCloundCIdTable = function()
{
	$('#cloundCIdContainerTable').empty();
	cloundCId_DT;
	var noFirstItem = [];
	for(var elm = 1; elm < cloundCId_DT.length;elm++ )
	{
		noFirstItem.push(cloundCId_DT[elm]);
	}
	createTable(
		'cloundCIdContainerTable',
		'cloundCIdContainerTableTB',
		['id','ch_name','备注','操作'],
		noFirstItem,
		'cloundCidDel',
		[
			['添加云视频客户id','cloundCidAddId'],
			['备注','remarks']
		],
		'cloundCidAdd',
		'cloundCidChange'
	);
};

var showStreamManager = function(){
	hideAllContainer();
	$("#settings").show();
	$("#streamcontainer").show();
	showStreamTable();
};

var showCloundCIdManager = function()
{
	hideAllContainer();
	$("#settings").show();
	$("#cloundCIdContainer").show();
	showCloundCIdTable();
};

//-----------------end stream-------------------
function hideAllContainer()
{
	$("#historydata").hide();
	$("#historydata_onlineuser_datawiget").hide();
	$("#historydata_nodedistribute_datawiget").hide();
	$("#historydata_ptopratio_datawiget").hide();

	$("#servermonitor").hide();
	$("#servermonitor_recentall_datawiget").hide();
	$("#servermonitor_selector_datawiget").hide();
	$("#servermonitor_rtmfp_datawiget").hide();
	$("#servermonitor_cde_datawiget").hide();

	$("#table").hide();
	$("#table_termid_datawiget").hide();
	$("#table_webp2p_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#useradmin").hide();
	$("#allusers").hide();
	$("#anu_full").hide();

	$("#settings").hide();
	$("#mpswcontainer").hide();
	$("#settings_idctype_datawiget").hide();
	$("#versionManagercontainer").hide();
	$("#groupcontainer").hide();


	$("#aimcontainer").hide();
	$("#primarycontainer").hide();
	$("#cloundCIdContainer").hide();

	$("#table_webp2p_datawiget").hide();
	$("#table_p2p_all_datawiget").hide();
	$("#table_all_share_datawiget").hide();

	$("#upgrade").hide();
	$("#allupgrade").hide();

	$("#streamcontainer").hide();
}
//----------------upgrade----------------------
var upgradeDelHandler = function(){
	upgrade_version_from_db = null;
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/delUpgrade?upgradeId="+arguments[0],
		"success":function (res,textStatus) {
			if(res.result == "success"){
				//更新表
				upgrade_version_from_db = res.data;
				upgrade_version_from_db=sortArr(upgrade_version_from_db);
				showUpgradeTable();
			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};
var	UpgradeAddHandler= function(){
	if($.trim($("#addUpgrade").val()).length == 0)
	{
		$("#upgradeHint").text("输入的信息不合法");
		return;
	}
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/addUpgrade?upgradeId="+$.trim($("#addUpgrade").val()),
		"success":function (res,textStatus) {
			if(res.result == "success"){
				//更新表
				upgrade_version_from_db = res.data;
				upgrade_version_from_db=sortArr(upgrade_version_from_db);
				showUpgradeTable();
			}else if(res.result == "error"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
}
var get_upgrade_table = function( upgrade_arr ){

	var table = '&nbsp;&nbsp;<table border="0" align="left" width="600">'+
		'<tr>'+
		'<th style="width:50px" align="left"><font size="4" face="verdana">&nbsp;id</font></th>'+
		'<th style="width:100px" align="left"><font size="4" face="verdana">&nbsp;&nbsp;upgrade</font></th>'+
		'<th style="width:100px"><font size="4" face="verdana">操作</font></th>'+
		'</tr>';

	if( !upgrade_arr ){return table +='</table>'; }
	for(var vId = 0; vId < upgrade_arr.length; vId++ ){
		table +='<tr >'+//background: '#f9f9f9'
			'<td style="width:100px" align="left">'+upgrade_arr[vId][0]+'</td>'+
			'<td style="width:100px" align="left">'+upgrade_arr[vId][1]+'</td>'+
			'<td align="center"><input type="button" id="delUpgradeBtn" value="删除" onclick="upgradeDelHandler('+upgrade_arr[vId][0]+');"/></td>'+
			'</tr>';
	}
	table +='<tr>'+
		'<td colspan="3">新增UpgradeID号： <input type="text" name="addUpgrade" id="addUpgrade" /><input type="button" id="addUpgradeBtn" value="确定" onclick="UpgradeAddHandler();"/></td>'+
		'</tr>';
	table +='</table>';
	table +='<label id="upgradeHint"></label>';
	return table;
};
var showUpgradeTable = function(){
	$("#upgradeManagerTable").html(
		get_upgrade_table(upgrade_version_from_db)
	);
};

var showUpgradeManager = function(){
	hideAllContainer();
	$("#settings").show();
	$("#aimcontainer").show();
	showUpgradeTable();
};

//---------------------end ser upgrade---------------

var tableOptions = {
	"bJQueryUI": true,
	"bFilter": false,
	"bInfo": false,
	"iDisplayLength": -1,
	"aLengthMenu": [[10, 20, 50, 100, -1], [10, 20, 50, 100, "全部"]],
	"oLanguage": {
		"sLengthMenu": "显示 _MENU_ 条记录",
		"sZeroRecords": "没有检索到数据",
		"sInfo": "当前数据为从第 _START_ 到第 _END_ 条数据；总共有 _TOTAL_ 条记录",
		"sInfoEmtpy": "没有数据",
		"sProcessing": "正在加载数据...",
		"oPaginate": {
			"sFirst": "首页",
			"sPrevious": "前页",
			"sNext": "后页",
			"sLast": "尾页"
		}
	},
	"sDom": '<"wrapper"flipt>',
	"sPaginationType": "full_numbers"
};

var tableOptionsForOnlineUsers = {
	"bJQueryUI": true,
	"bFilter": false,
	"bInfo": false,
	"iDisplayLength": 24,
	"aLengthMenu": [[24, 48, -1], [24, 48, "全部"]],
	"oLanguage": {
		"sLengthMenu": "显示 _MENU_ 条记录",
		"sZeroRecords": "没有检索到数据",
		"sInfo": "当前数据为从第 _START_ 到第 _END_ 条数据；总共有 _TOTAL_ 条记录",
		"sInfoEmtpy": "没有数据",
		"sProcessing": "正在加载数据...",
		"oPaginate": {
			"sFirst": "首页",
			"sPrevious": "前页",
			"sNext": "后页",
			"sLast": "尾页"
		}
	},
	"sDom": '<"wrapper"flipt>',
	"sPaginationType": "full_numbers"
};
//--------------------------------------------------------
var load_SummaryInfoAndDisplay = function(){
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/summary_info",
		"success":function (res,textStatus) {
			if(res.result == "success"){
				var vPd =	(res.data.pdRatio_tr*100).toFixed(2);
				var vCR = (res.data.coRatio_tr*100).toFixed(2);
				var vOU = formatMoney(res.data.onUsers_tr,0);
				var vCU = formatMoney(res.data.cuUsers_tr,0);

				$('#situation_nowstat_PtopDownRatio').html(vPd);
				//$('#situation_nowstat_ConnectivityRatio').html(vCR);
				$('#situation_nowstat_OnlineUsers').html(vOU);
				$('#situation_nowstat_CumulusUsers').html(vCU);


			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};

//--------------------------------------------------------
var loadDT_Selector = function(){
	dtS.fnClearTable();
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/selector",
		"success":function (res,textStatus) {
			if(res.result == "success"){
				dtS.fnAddData(res.data);
			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};

var loadDT_RTMFP = function(){
	dtR.fnClearTable();
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/rtmfp",
		"success":function (res,textStatus) {
			if(res.result == "success"){
				dtR.fnAddData(res.data);
			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};

var loadDT_CDE = function(){
	dtG.fnClearTable();
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/cde",
		"success":function (res,textStatus) {
			if(res.result == "success"){
				dtG.fnAddData(res.data);
			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};


var loadDT_GroupIDs = function(){
	dtGroupIDs.fnClearTable();
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/query/groupIDsInfo",
		"success":function (res,textStatus) {
			if(res.result == "success"){
				dtGroupIDs.fnAddData(res.data);
			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};
//------------------------------------------------------
var loadDTAllUsers = function(){
	dtAllUsers.fnClearTable();
	$.ajax({
		"dataType": 'json',
		"contentType": "application/json; charset=utf-8",
		"type": "GET",
		"url": "/useradmin/listall",
		"success":function (res,textStatus) {
			if(res.result == "success"){
				if(res.data.length >= 1 && res.data[0].length == 6 ){
					dtAllUsers.fnAddData(res.data);
				}
			}else if(res.result == "expired"){
				showExpired("您当前登录已过期,请重新登录");
			}else{
				showLoadError("加载数据错误");
			}
		}
	});
};


function getDates(startDate, stopDate,byDay){
	var dateArray = new Array();
	var currentDate = new Date(startDate.toString());
	while (currentDate <= stopDate) {
		if(byDay){
			dateArray.push((currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear());
			currentDate.setDate(currentDate.getDate() + 1);
		}else{//by hour
			dateArray.push((currentDate.getMonth() + 1) + "/" + currentDate.getFullYear());
			currentDate.setMonth(currentDate.getMonth() + 1);
		}
	}
	return dateArray;
};


function formatMoney(s,type) {
	if (/[^0-9\.]/.test(s)) return "0";
	if (s == null || s == "") return "0";
	s = s.toString().replace(/^(\d*)$/, "$1.");
	s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
	s = s.replace(".", ",");
	var re = /(\d)(\d{3},)/;
	while (re.test(s))
		s = s.replace(re, "$1,$2");

	s = s.replace(/,(\d\d)$/, ".$1");
	if (type == 0) {
		var a = s.split(".");
		if (a[1] == "00") {
			s = a[0];
		}
	}
	return s;
};

function sortArr(arr){
	arr=arr.sort(function (x,y){
		return x[1].localeCompare(y[1]);
	});
	return arr;
};

function sortupgrade(arr){
	arr=arr.sort(function (x,y){
		return y[1].localeCompare(x[1]);
	});
	return arr;
};

function getRequest(url,fun,type,sendData,param)
{
	if(!url){return;}
	type = type || 'get';
	if('get'== type)
	{
		$.ajax({
			type:type,
			url:url,
			async:false,
			dataType:"json",
			success:function(data,textStatus){
				if(fun){
					if(param){
						fun(data,textStatus,param);
					}else{
						fun(data,textStatus);
					}
				}
			},
			beforeSend: function(xhr){
				xhr.withCredentials = true;
			}
		});
	}else if('post'== type)
	{
		$.ajax({
			type:"post",
			url:url,
			async:false,
			dataType:"json",
			data:sendData,
			success:function(data,textStatus){
				if(fun){
					if(param){
						fun(data,textStatus,param);
					}else{
						fun(data,textStatus);
					}
				}
			},
			beforeSend: function(xhr){
				xhr.withCredentials = true;
			}
		});
	}
}

function tooltipContentEditor(str, seriesIndex, pointIndex, plot) {
	var xValue =plot.axes.xaxis.ticks[pointIndex];
	var yValue = plot.data[seriesIndex][pointIndex].toString()
	var formatString = plot.options.highlighter.formatString;

	console.info(yValue);
	var ystrs =[];
	ystrs.push(yValue);
	ystrs.unshift(xValue);
	ystrs.unshift(formatString);
	var showValue = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
	return showValue;
}
</script>

