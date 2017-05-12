/**
 * Register route table rules
 * for example:
 * route.map({
 *     'type':'type1',
 *     'controller': 'blog',
 *     'action': 'showBlogPost'
 * })
 */
var routes_ws = {};
exports.map = function(dict){

    if(dict && dict.hasOwnProperty('type')
        && dict.hasOwnProperty('controller')
        && dict.hasOwnProperty('action'))
    {
        var type =  dict.type;
        routes_ws[type] = dict;
    }else{
        throw "error: route"
    }
};

exports.getActionInfo = function(type){

    if(routes_ws.hasOwnProperty(type)){
        return routes_ws[type];
    }

    return null;
};
