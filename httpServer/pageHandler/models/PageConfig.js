//
var route = require('./Route');

// General request
route.map({
    method:'get',
    url:/^\/$/i,
    controller:'common',
    action:'index'
});

// User behavior 
route.map({
    method:'get',
    url:/^\/login\/?$/i,
    controller:'common',
    action:'login'
});

// User behavior 
route.map({
    method:'get',
    url:/^\/logup\/?$/i,
    controller:'common',
    action:'logup'
});

// User behavior 
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



//=============================
route.map({
    method:'get',
    url:/^\/exit\/?$/i,
    controller:'common',
    action:'exit'
});






//add user
route.map({
    method:'get',
    url:/^\/useradmin\/addnewuser\/?$/i,
    controller:'users',
    action:'addnewuser'
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

// del GroupId 
route.map({
    method:'get',
    url:/^\/query\/delGroup\/?$/i,
    controller:'mainFrame',
    action:'queryDelGroup'
});

//
route.map({
    method:'get',
    url:/^\/query\/serverIPList\/?$/i,
    controller:'mainFrame',
    action:'queryServerIPList'
});

