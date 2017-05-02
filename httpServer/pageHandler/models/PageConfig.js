//
var route = require('./Route');


route.map({
    method:'get',
    url:/^\/$/i,
    controller:'common',
    action:'index'
});


route.map({
    method:'get',
    url:/^\/login\/?$/i,
    controller:'login',
    action:'login'
});



route.map({
    method:'get',
    url:/^\/findpassword\/?$/i,
    controller:'common',
    action:'findpassword'
});


route.map({
    method:'get',
    url:/^\/logup\/?$/i,
    controller:'common',
    action:'logup'
});

route.map({
    method:'post',
    url:/^\/submit_find\/?$/i,
    controller:'findPWD',
    action:'submit_find'
});

route.map({
    method:'post',
    url:/^\/logup_submit\/?$/i,
    controller:'login',
    action:'logup_submit'
});

route.map({
    method:'get',
    url:/^\/updateLoginTime\/?$/i,
    controller:'login',
    action:'updateLoginTime'
});

route.map({
    method:'get',
    url:/^\/getUserInfo\/?$/i,
    controller:'login',
    action:'getUserInfo'
});

route.map({
    method:'get',
    url:/^\/heartTime\/?$/i,
    controller:'heartTime',
    action:'heartTime'
});

//=============================
route.map({
    method:'get',
    url:/^\/detailOrder.html\/?$/i,
    controller:'common',
    action:'detailOrder'
});

route.map({
    method:'get',
    url:/^\/detailStock.html\/?$/i,
    controller:'common',
    action:'detailStock'
});


route.map({
    method:'get',
    url:/^\/main\/?$/i,
    controller:'common',
    action:'main'
});


route.map({
    method:'get',
    url:/^\/select_dictTrade\/?$/i,
    controller:'dict_trade',
    action:'select_dictTrade'
});


route.map({
    method:'get',
    url:/^\/select_policyGID\/?$/i,
    controller:'policyGID',
    action:'select_policyGID'
});



//=================================
route.map({
    method:'get',
    url:/^\/select_userAccount\/?$/i,
    controller:'user_account',
    action:'select_userAccount'
});

route.map({
    method:'post',
    url:/^\/delete_userAccount\/?$/i,
    controller:'user_account',
    action:'delete_userAccount'
});

route.map({
    method:'post',
    url:/^\/add_userAccount\/?$/i,
    controller:'user_account',
    action:'add_userAccount'
});

route.map({
    method:'post',
    url:/^\/modify_userAccount\/?$/i,
    controller:'user_account',
    action:'modify_userAccount'
});

//=================================

route.map({
    method:'get',
    url:/^\/select_subscrible\/?$/i,
    controller:'policy',
    action:'select_subscrible'
});



route.map({
    method:'get',
    url:/^\/select_alreadySubscrible\/?$/i,
    controller:'policy',
    action:'select_alreadySubscrible'
});


route.map({
    method:'post',
    url:/^\/update_subscrible\/?$/i,
    controller:'policy',
    action:'update_subscrible'
});

//================================

route.map({
    method:'post',
    url:/^\/insert_preorder\/?$/i,
    controller:'order_today',
    action:'insert_preorder'
});

route.map({
    method:'post',
    url:/^\/update_ordertoday\/?$/i,
    controller:'order_today',
    action:'update_ordertoday'
});

route.map({
    method:'post',
    url:/^\/select_preorder\/?$/i,
    controller:'order_today',
    action:'select_preorder'
});
//================================

route.map({
    method:'post',
    url:/^\/insert_orderPeriod\/?$/i,
    controller:'order_period',
    action:'insert_orderPeriod'
});

route.map({
    method:'post',
    url:/^\/update_orderPeriod\/?$/i,
    controller:'order_period',
    action:'update_ordertoday'
});

route.map({
    method:'post',
    url:/^\/select_orderPeriod\/?$/i,
    controller:'order_period',
    action:'select_orderPeriod'
});

//================================

route.map({
    method:'post',
    url:/^\/select_tradeDetail\/?$/i,
    controller:'detail',
    action:'select_tradeDetail'
});

//================================

route.map({
    method:'get',
    url:/^\/stocks\/?$/i,
    controller:'proxy',
    action:'stocks'
});


route.map({
    method:'post',
    url:/^\/capital\/?$/i,
    controller:'proxy',
    action:'capital'
});

//================================
route.map({
    method:'get',
    url:/^\/exit\/?$/i,
    controller:'login',
    action:'exit'
});

