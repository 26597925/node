# web server
<p>
<ul>
  
  <li>http://www.bootcss.com/</li>
  <li>https://github.com/DoubleSpout/ccap</li>
  <li>https://www.datatables.net/</li>
  <li>http://www.jqplot.com/</li>
  <li>http://jqueryui.com/tabs/</li>
  <li>http://jqueryui.com/accordion/</li>
</ul>
</p>
<p>
  <li><a href="https://github.com/DoubleSpout/ccap">https://github.com/DoubleSpout/ccap</a></li>
<li><a href="https://github.com/mysqljs/mysql">https://github.com/mysqljs/mysql</a></li>
npm install ccap  <br />
<li>
js
</li>
function(){<br />
	console.log(JSON.stringify(arguments));<br />
}<br />
ALTER TABLE `tb_user_basic` CHANGE `USERID` `USERID` INT(11) UNSIGNED NULL DEFAULT NULL AUTO_INCREMENT COMMENT '用户ID,可登录使用';<br />
ALTER TABLE `tb_user_basic` ADD `USERLASTLOGIN` INT NULL DEFAULT NULL COMMENT '用户最后访问时间' AFTER `STATUS`;
<br />
ALTER TABLE `tb_user_basic` CHANGE `USERLASTLOGIN` `USERLASTLOGIN` VARCHAR(256) NULL DEFAULT NULL COMMENT '用户最后访问';
<br />
<br />
</p>
<br />
<p>
把代码整理一下，省的以后再下手写，直接copy<br />

//nameSpace<br />
<br />
//nameSpace<br />
<br />
var oojs$ = {<br />
20 ns : function(space) {<br />
20 20 var names = (space + '').split(".");<br />
20 20 var objs = this;<br />
20 20 for ( var i = 0; i < names.length; i++) {<br />
20 20 20 var subName = names[i];<br />
20 20 20 var subType = typeof (objs[subName]);<br />
20 20 20 if (subType != 'object' && subType != 'undefined') {<br />
20 20 20 20 throw "Invalid namespace " + space + ", sub: " + subName;<br />
20 20 20 }<br />
20 20 20 objs = objs[subName] = objs[subName] || {};<br />
20 20 }<br />
20 }<br />
20 ,createClass:function(value)<br />
20 {<br />
20 20 var cls = function()<br />
20 20 {<br />
20 20 20 if(typeof(this.__ctor) == 'function')<br />
20 20 20 {<br />
20 20 20 20 this.__ctor.apply(this,arguments);<br />
20 20 20 }<br />
20 20 };<br />
20 20 cls.prototype = cls.prototype || {};<br />
20 20 var type = 0;<br />
20 20 var fname;<br />
20 20 var get_set_obj = {};<br />
20 20 for(var name in value)<br />
20 20 {<br />
20 20 20 if(name.indexOf('getter_') === 0)<br />
20 20 20 {<br />
20 20 20 20 fname = name.split('_')[1];<br />
20 20 20 20 type = 1;<br />
20 20 20 }<br />
20 20 20 else if(name.indexOf('setter_') === 0)<br />
20 20 20 {<br />
20 20 20 20 fname = name.split('_')[1];<br />
20 20 20 20 type = 2;<br />
20 20 20 }<br />
20 20 20 else<br />
20 20 20 {<br />
20 20 20 20 type = 0;<br />
20 20 20 }<br />
20 20 20 switch(type)<br />
20 20 20 {<br />
20 20 20 20 case 0:<br />
20 20 20 20 20 cls.prototype[name] = value[name];<br />
20 20 20 20 20 break;<br />
20 20 20 20 case 1:<br />
20 20 20 20 20 get_set_obj[fname] = get_set_obj[fname] || {};<br />
20 20 20 20 20 get_set_obj[fname].get = value[name];<br />
20 20 20 20 20 break;<br />
20 20 20 20 case 2:<br />
20 20 20 20 20 get_set_obj[fname] = get_set_obj[fname] || {};<br />
20 20 20 20 20 get_set_obj[fname].set = value[name];<br />
20 20 20 20 20 break;<br />
20 20 20 }<br />
20 20 }<br />
20 20 //设置属性的方法<br />
20 20 for(var i in get_set_obj)<br />
20 20 {<br />
20 20 20 Object.defineProperty(cls.prototype,i,{<br />
20 20 20 20 get:get_set_obj[i].get,<br />
20 20 20 20 set:get_set_obj[i].set,<br />
20 20 20 });<br />
20 20 }<br />
20 20 return cls;<br />
20 }<br />
20 ,distroyClass:function(namespace,className)<br />
20 {<br />
20 20 var names = (namespace + '').split(".");<br />
20   20 var objs = this;<br />
20 20 for( var i = 0; i < names.length; i ++ )<br />
20 20 {<br />
20 20 20 var subName = names[i];<br />
20 20 20 var subType = typeof(objs[subName]);<br />
20 20 20 if( subType == 'object'  )<br />
20 20 20 {<br />
20 20 20 20 if(i < names.length-1)<br />
20 20 20 20 {<br />
20 20 20 20 20 objs = objs[subName];<br />
20 20 20 20 20 continue;<br />
20 20 20 20 }else if(i == names.length-1 ){<br />
20 20 20 20 20 objs = objs[subName];<br />
20 20 20 20 20 objs[className] = null;<br />
20 20 20 20 20 delete objs[className];<br />
20 20 20 20 }<br />
20 20 20 }else{<br />
20 20 20 20 throw "Invalid namespace " + namespace;<br />
20 20 20 }<br />
20  20 }<br />
20 }<br />
};<br />
<br />
oojs$.util = {<br />
20 apply : function(dest, source) {<br />
20 20 for ( var name in source) {<br />
20 20 20 dest[name] = source[name];<br />
20 20 }<br />
20 20 return dest;<br />
20 },<br />
<br />
20 applyIf : function(dest, source) {<br />
20 20 for ( var name in source) {<br />
20 20 20 if (typeof (dest[name]) == 'undefined') {<br />
20 20 20 20 dest[name] = source[name];<br />
20 20 20 }<br />
20 20 }<br />
20 20 return dest;<br />
20 }<br />
};<br />
<br />
//use stage <br />
oojs$.ns("com.utils");<br />
oojs$.com.utils.Audio = oojs$.createClass(<br />
{<br />
20 fullscreen:false,<br />
20 reset:function(){<br />
<br />
20 },<br />
20 getter_fullscreen:function()<br />
20 {<br />
20 20 return this.initData.fullscreen;<br />
20 },<br />
20 setter_fullscreen:function(value)<br />
20 {<br />
20 20 this.fullscreen = true;<br />
20 },<br />
20 __ctor: function()<br />
20 {<br />
20 20 this.reset();<br />
20 }<br />
}<br />


   
<br />
<br />
</p>