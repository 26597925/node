// 当前是否处于创建类的阶段
var CdeBaseInitializing_ = false;
var JClass = function() {
};
JClass.extend_ = function(prop) {
// 如果调用当前函数的对象（这里是函数）不是Class，则是父类
var baseClass = null;
if (this !== JClass) {
baseClass = this;
}

// 本次调用所创建的类（构造函数）
function F() {
// 如果当前处于实例化类的阶段，则调用init原型函数
if (!CdeBaseInitializing_) {
// 如果父类存在，则实例对象的baseprototype指向父类的原型
// 这就提供了在实例对象中调用父类方法的途径
if (baseClass) {
this._superprototype = baseClass.prototype;
}
this.init.apply(this, arguments);
}
}

// 如果此类需要从其它类扩展
if (baseClass) {
CdeBaseInitializing_ = true;
F.prototype = new baseClass();
F.prototype.constructor = F;
CdeBaseInitializing_ = false;
}
// 新创建的类自动附加extend函数
F.extend_ = arguments.callee;

// 覆盖父类的同名函数
for ( var name in prop) {
if (prop.hasOwnProperty(name)) {
// 如果此类继承自父类baseClass并且父类原型中存在同名函数name
if (baseClass && typeof (prop[name]) === "function" && typeof (F.prototype[name]) === "function" && /\b_super\b/.test(prop[name])) {
// 重定义函数name -
// 首先在函数上下文设置this._super指向父类原型中的同名函数
// 然后调用函数prop[name]，返回函数结果
// 注意：这里的自执行函数创建了一个上下文，这个上下文返回另一个函数，
// 此函数中可以应用此上下文中的变量，这就是闭包（Closure）。
// 这是JavaScript框架开发中常用的技巧。
F.prototype[name] = (function(name, fn) {
return function() {
this._super = baseClass.prototype[name];
return fn.apply(this, arguments);
}
})(name, prop[name]);
} else {
F.prototype[name] = prop[name];
}
}
}
return F;
};

JClass.apply = function(cls, members) {
for ( var name in members) {
if (members.hasOwnProperty(name)) {
cls.prototype[name] = members[name];
}
}
};
var p2p$ = {
ns: function(space) {
var names = (space + '').split(".");
var objs = this;
for ( var i = 0; i < names.length; i++) {
var subName = names[i];
var subType = typeof (objs[subName]);
if (subType != 'object' && subType != 'undefined') {
throw "Invalid namespace " + space + ", sub: " + subName;
}
objs = objs[subName] = objs[subName] || {};
}
},
apply : function(dest, src) {
for ( var n in src) {
dest[n] = src[n];
}
},

applyIf : function(dest, src) {
for ( var n in src) {
if (typeof (dest[n]) != 'undefined') {
dest[n] = src[n];
}
}
}
};
p2p$.ns("com.utils");

p2p$.com.utils.Utils = {
format : function(fmt) {
var args = [];
for (var i = 1; i < arguments.length; i++) {
args.push(arguments[i]);
}
return (fmt || '').replace(/\{(\d+)\}/g, function(m, i) {
return args[i];
});
},

formatDate_ : function(fmt, value) {
if (!fmt) {
fmt = 'Y-m-d H:i:s';
}
if (!value) {
return '-';
} else if (typeof (value) == 'number') {
value = new Date(value);
}

return fmt.replace(/Y/g, value.getFullYear()).replace(/m/g, this.pad(value.getMonth() + 1, 2)).replace(/d/g, this.pad(value.getDate(), 2)).replace(
/H/g, this.pad(value.getHours(), 2)).replace(/i/g, this.pad(value.getMinutes(), 2)).replace(/s/g, this.pad(value.getSeconds(), 2)).replace(
/U/g, this.pad(value.getMilliseconds(), 3));
},

formatDuration_ : function(value) {
var result = '';
if (value > 3600) {
result += (Math.floor(value / 3600) + ':');
}
if (value > 60) {
result += (this.pad(Math.floor((value % 3600) / 60), 2) + ':');
}
if (value >= 0) {
result += this.pad(Math.floor(value % 60), 2);
}
return result;
},

size : function(value) {
var step = 1024;
if (value < step) {
return value.toFixed(0) + ' B';
} else if (value < (step * step)) {
return (value / step).toFixed(1) + ' KB';
} else if (value < (step * step * step)) {
return (value / step / step).toFixed(1) + ' MB';
} else if (value < (step * step * step * step)) {
return (value / step / step / step).toFixed(1) + ' GB';
}
},

speed : function(value, bps) {
value = (value || 0);
var step = 1024;
var suffix = 'B/s';
if (bps) {
value *= 8;
step = 1000;
suffix = 'bps';
}
if (value < 1024) {
return value.toFixed(0) + ' ' + suffix;
} else if (value < (step * step)) {
return (value / step).toFixed(1) + ' K' + suffix;
} else if (value < (step * step * step)) {
return (value / step / step).toFixed(1) + ' M' + suffix;
} else if (value < (step * step * step * step)) {
return (value / step / step / step).toFixed(1) + ' G' + suffix;
}
},

pad : function(num, size) {
var s = num + "";
while (s.length < size) {
s = "0" + s;
}
return s;
},

trim : function(value) {
var trimRegex = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
return (value + '').replace(trimRegex, "");
},

getUrlParams_ : function(url) {
var params = {};
var paramString = url.indexOf('?') >= 0 ? (url.substr(url.indexOf('?') + 1) || '') : url;
var paramArray = paramString.split('&');
for (var i = 0; i < paramArray.length; i++) {
var itemArray = paramArray[i].split('=');
var key = '';
var value = null;
if (itemArray.length > 0) {
key = decodeURIComponent(itemArray[0]);
}
if (itemArray.length > 1) {
value = decodeURIComponent(itemArray[1]);
}
params[key] = value;
}
return params;
},

htmlEscape_ : function(str) {
return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
};
