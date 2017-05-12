//
var route_ws = require('./WSSRoute');

route_ws.map({
    type:'order_today',
    controller:'order_today',
    action:'message'
});

route_ws.map({
    type:'market',
    controller:'market',
    action:'message'
});

