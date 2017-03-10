//
var parseURL = require('url').parse;
var routes = {get:[], post:[], head:[], put:[], delete:[]};

/**
 * Register route table rules
 * for example:
 * route.map({
 *     method:'post',
 *     url: /\/blog\/post\/(\d+)\/?$/i,
 *     controller: 'blog',
 *     action: 'showBlogPost'
 * })
 */
exports.map = function(dict){
    if(dict && dict.url && dict.controller){
        var method = dict.method ? dict.method.toLowerCase() : 'get';
        routes[method].push({
            u: dict.url, 
            c: dict.controller,
            a: dict.action || 'index'
        });
    }
};

exports.getActionInfo = function(url, method){
    var r = {controller:null, action:null, args:null},
        method = method ? method.toLowerCase() : 'get';
	var urlObj = parseURL(url,true);

   var m_routes = routes[method];
   //debugger;
    for(var i in m_routes){
        r.args = m_routes[i].u.exec(urlObj.pathname);
        if(r.args){
            r.controller = m_routes[i].c;
            r.action = m_routes[i].a;
            r.args.shift(); 
            if(urlObj.query){
                r.args = [urlObj.query];
            }
            break;
        }
    }
    return r;
};
