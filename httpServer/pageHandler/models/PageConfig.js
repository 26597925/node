//
var route = require('./Route');

exports.svrPort = 20080;
exports.svrIP = '123.126.32.18';


// General request
route.map({
    method:'get',
    url:/^\/$/i,
    controller:'common',
    action:'index'
});

route.map({
    method:'get',
    url:/^\/exit\/?$/i,
    controller:'common',
    action:'exit'
});

// User behavior 
route.map({
    method:'get',
    url:/^\/login\/?$/i,
    controller:'common',
    action:'login'
});


route.map({
    method:'get',
    url:/^\/main\/?$/i,
    controller:'common',
    action:'main'
});



// User management
route.map({
    method:'get',
    url:/^\/users\/guidereset\/?$/i,
    controller:'users',
    action:'guideReset'
});

route.map({
    method:'get',
    url:/^\/users\/reseta\/?$/i,
    controller:'users',
    action:'resetStepA'
});

//addIdc
route.map({
    method:'get',
    url:/^\/query\/addIdc\/?$/i,
    controller:'mainFrame',
    action:'queryAddIdc'
});

route.map({
    method:'get',
    url:/^\/query\/delIdc\/?$/i,
    controller:'mainFrame',
    action:'queryDelIdc'
});
route.map({
    method:'get',
    url:/^\/query\/cde\/?$/i,
    controller:'mainFrame',
    action:'queryCDE'
});

route.map({
    method:'get',
    url:/^\/query\/rtmfp\/?$/i,
    controller:'mainFrame',
    action:'queryRtmfp'
});
// addVersion 
route.map({
    method:'get',
    url:/^\/query\/addVersion\/?$/i,
    controller:'mainFrame',
    action:'queryAddVersion'
});

// delVersion 
route.map({
    method:'get',
    url:/^\/query\/delVersion\/?$/i,
    controller:'mainFrame',
    action:'queryDelVersion'
});

// add GroupId
route.map({
    method:'get',
    url:/^\/query\/addGroup\/?$/i,
    controller:'mainFrame',
    action:'queryAddGroup'
});

// del GroupId 
route.map({
    method:'get',
    url:/^\/query\/delGroup\/?$/i,
    controller:'mainFrame',
    action:'queryDelGroup'
});

// add StreamId
route.map({
    method:'get',
    url:/^\/query\/addStream\/?$/i,
    controller:'mainFrame',
    action:'queryAddStream'
});

// del StreamId 
route.map({
    method:'get',
    url:/^\/query\/delStream\/?$/i,
    controller:'mainFrame',
    action:'queryDelStream'
});

// Summary data 
route.map({
    method:'get',
    url:/^\/query\/summary_info\/?$/i,
    controller:'mainFrame',
    action:'querySummaryInfoData'
});

//gather rtmfp p2p monitor data
route.map({
    method:'get',
    url:/^\/query\/recentAllInfo\/?$/i,
    controller:'mainFrame',
    action:'queryRecentAllInfo'
});

// History onlineuser data
route.map({
    method:'get',
    url:/^\/query\/hisdata_onlineuser\/?$/i,
    controller:'mainFrame',
    action:'query_hisdata_onlineuser'
});

//node distribute
route.map({
    method:'get',
    url:/^\/query\/hisdata_nodedistribute\/?$/i,
    controller:'mainFrame',
    action:'query_hisdata_nodedistribute'
});
//film duration 
route.map({
    method:'get',
    url:/^\/query\/hisdata_filmduration\/?$/i,
    controller:'mainFrame',
    action:'query_hisdata_filmduration'
});
//video bit rate
route.map({
    method:'get',
    url:/^\/query\/hisdata_videobitrate\/?$/i,
    controller:'mainFrame',
    action:'query_hisdata_videobitrate'
});
//p2p ratio
route.map({
    method:'get',
    url:/^\/query\/hisdata_ptopratio\/?$/i,
    controller:'mainFrame',
    action:'query_hisdata_ptopratio'
});

//process quality
route.map({
    method:'get',
    url:/^\/query\/hisdata_stagequality\/?$/i,
    controller:'mainFrame',
    action:'query_hisdata_stagequality'
});
/*
//create live table
route.map({
    method:'get',
    url:/^\/query\/table_live\/?$/i,
    controller:'mainFrame',
    action:'query_table_live'
});

//create vod table
route.map({
    method:'get',
    url:/^\/query\/table_vod\/?$/i,
    controller:'mainFrame',
    action:'query_table_vod'
});
*/
//create termid table
route.map({
    method:'get',
    url:/^\/query\/table_termid\/?$/i,
    controller:'mainFrame',
    action:'query_table_termid'
});
//create termid table
route.map({
    method:'get',
    url:/^\/query\/table_termid_vv\/?$/i,
    controller:'mainFrame',
    action:'query_table_termid_vv'
});
//create webp2p table
route.map({
    method:'get',
    url:/^\/query\/table_webp2p\/?$/i,
    controller:'mainFrame',
    action:'query_table_webp2p'
});
//create webp2p table
route.map({
    method:'get',
    url:/^\/query\/table_webp2p_cdn\/?$/i,
    controller:'mainFrame',
    action:'query_table_webp2p_cdn'
});
//create webp2p table
route.map({
    method:'get',
    url:/^\/query\/table_webp2p_user\/?$/i,
    controller:'mainFrame',
    action:'query_table_webp2p_user'
});

//create webp2p table
route.map({
    method:'get',
    url:/^\/query\/table_p2p_all\/?$/i,
    controller:'mainFrame',
    action:'query_table_p2p_all'
});

//create webp2p table
route.map({
    method:'get',
    url:/^\/query\/table_p2p_web\/?$/i,
    controller:'mainFrame',
    action:'query_table_p2p_web'
});
//create webp2p table
route.map({
    method:'get',
    url:/^\/query\/table_p2p_cde\/?$/i,
    controller:'mainFrame',
    action:'query_table_p2p_cde'
});
route.map({
    method:'get',
    url:/^\/query\/table_all_share\/?$/i,
    controller:'mainFrame',
    action:'query_table_all_share'
});
//uselist massage
route.map({
    method:'get',
    url:/^\/useradmin\/listall\/?$/i,
    controller:'users',
    action:'listAll'
});

//add user
route.map({
    method:'get',
    url:/^\/useradmin\/addnewuser\/?$/i,
    controller:'users',
    action:'addnewuser'
});

//
route.map({
    method:'get',
    url:/^\/query\/serverIPList\/?$/i,
    controller:'mainFrame',
    action:'queryServerIPList'
});

route.map({
    method:'get',
    url:/^\/query\/serverVersionList\/?$/i,
    controller:'mainFrame',
    action:'queryServerVersionList'
});

route.map({
    method:'get',
    url:/^\/query\/serverGroupList\/?$/i,
    controller:'mainFrame',
    action:'queryServerGroupList'
});

route.map({
    method:'get',
    url:/^\/query\/serverStreamList\/?$/i,
    controller:'mainFrame',
    action:'queryServerStreamList'
});
route.map({
    method:'get',
    url:/^\/query\/upgrade_version\/?$/i,
    controller:'mainFrame',
    action:'query_upgrade_version'
});
route.map({
    method:'get',
    url:/^\/query\/upgradeversion\/?$/i,
    controller:'mainFrame',
    action:'queryupgradeversion'
});
route.map({
    method:'get',
    url:/^\/query\/upgrademodel\/?$/i,
    controller:'mainFrame',
    action:'queryupgrademodel'
});
route.map({
    method:'get',
    url:/^\/query\/upgradevendor\/?$/i,
    controller:'mainFrame',
    action:'queryupgradevendor'
});
route.map({
    method:'get',
    url:/^\/query\/upgraderomversion\/?$/i,
    controller:'mainFrame',
    action:'queryupgraderomversion'
});

// add loc upgrade
route.map({
    method:'get',
    url:/^\/query\/addUpgrade\/?$/i,
    controller:'mainFrame',
    action:'queryAddUpgrade'
});

// del upgrade 
route.map({
    method:'get',
    url:/^\/query\/delUpgrade\/?$/i,
    controller:'mainFrame',
    action:'queryDelUpgrade'
});

route.map({
    method:'get',
    url:/^\/query\/upgrade_accumulate\/?$/i,
    controller:'mainFrame',
    action:'query_upgrade_accumulate'
});

route.map({
    method:'get',
    url:/^\/query\/upgrade_failed\/?$/i,
    controller:'mainFrame',
    action:'query_upgrade_failed'
});

route.map({
    method:'get',
    url:/^\/query\/cloundCidList\/?$/i,
    controller:'mainFrame',
    action:'query_cloundCidList'
});

route.map({
    method:'get',
    url:/^\/query\/cloundCidAdd\/?$/i,
    controller:'mainFrame',
    action:'query_cloundCidAdd'
});

route.map({
    method:'get',
    url:/^\/query\/cloundCidDel\/?$/i,
    controller:'mainFrame',
    action:'query_cloundCidDel'
});

route.map({
    method:'post',
    url:/^\/query\/cloundCidUpdate\/?$/i,
    controller:'mainFrame',
    action:'query_cloundCidUpdate'
});
