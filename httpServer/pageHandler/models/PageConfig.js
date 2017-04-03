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
    controller:'common',
    action:'login'
});


route.map({
    method:'get',
    url:/^\/logup\/?$/i,
    controller:'common',
    action:'logup'
});


route.map({
    method:'post',
    url:/^\/logup_submit\/?$/i,
    controller:'common',
    action:'logup_submit'
});

route.map({
    method:'get',
    url:/^\/updateLoginTime\/?$/i,
    controller:'common',
    action:'updateLoginTime'
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


route.map({
    method:'post',
    url:/^\/select_subscrible\/?$/i,
    controller:'policy',
    action:'select_subscrible'
});



route.map({
    method:'post',
    url:/^\/select_unsubscrible\/?$/i,
    controller:'policy',
    action:'select_unsubscrible'
});
//================================


route.map({
    method:'get',
    url:/^\/exit\/?$/i,
    controller:'common',
    action:'exit'
});

