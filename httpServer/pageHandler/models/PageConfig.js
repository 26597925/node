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
    url:/^\/heartTime\/?$/i,
    controller:'heartTime',
    action:'heartTime'
});
//=============================
route.map({
    method:'get',
    url:/^\/detail.html\/?$/i,
    controller:'common',
    action:'detail'
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
    controller:'order',
    action:'insert_preorder'
});

route.map({
    method:'get',
    url:/^\/select_userPolicyGID\/?$/i,
    controller:'order',
    action:'select_userPolicyGID'
});

route.map({
    method:'post',
    url:/^\/select_preorder\/?$/i,
    controller:'order',
    action:'select_preorder'
});


//================================
route.map({
    method:'get',
    url:/^\/exit\/?$/i,
    controller:'login',
    action:'exit'
});

