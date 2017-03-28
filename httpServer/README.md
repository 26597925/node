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

<p><br />
//nameSpace<br />
<br />
var oojs$ = {<br />
  ns : function(space) {<br />
    var names = (space + '').split(".");<br />
    var objs = this;<br />
    for ( var i = 0; i < names.length; i++) {<br />
      var subName = names[i];<br />
      var subType = typeof (objs[subName]);<br />
      if (subType != 'object' && subType != 'undefined') {<br />
        throw "Invalid namespace " + space + ", sub: " + subName;<br />
      }<br />
      objs = objs[subName] = objs[subName] || {};<br />
    }<br />
  }<br />
  ,createClass:function(value)<br />
  {<br />
    var cls = function()<br />
    {<br />
      if(typeof(this.__ctor) == 'function')<br />
      {<br />
        this.__ctor.apply(this,arguments);<br />
      }<br />
    };<br />
    cls.prototype = cls.prototype || {};<br />
    var type = 0;<br />
    var fname;<br />
    var get_set_obj = {};<br />
    for(var name in value)<br />
    {<br />
      if(name.indexOf('getter_') === 0)<br />
      {<br />
        fname = name.split('_')[1];<br />
        type = 1;<br />
      }<br />
      else if(name.indexOf('setter_') === 0)<br />
      {<br />
        fname = name.split('_')[1];<br />
        type = 2;<br />
      }<br />
      else<br />
      {<br />
        type = 0;<br />
      }<br />
      switch(type)<br />
      {<br />
        case 0:<br />
          cls.prototype[name] = value[name];<br />
          break;<br />
        case 1:<br />
          get_set_obj[fname] = get_set_obj[fname] || {};<br />
          get_set_obj[fname].get = value[name];<br />
          break;<br />
        case 2:<br />
          get_set_obj[fname] = get_set_obj[fname] || {};<br />
          get_set_obj[fname].set = value[name];<br />
          break;<br />
      }<br />
    }<br />
    //设置属性的方法<br />
    for(var i in get_set_obj)<br />
    {<br />
      Object.defineProperty(cls.prototype,i,{<br />
        get:get_set_obj[i].get,<br />
        set:get_set_obj[i].set,<br />
      });<br />
    }<br />
    return cls;<br />
  }<br />
  ,distroyClass:function(namespace,className)<br />
  {<br />
    var names = (namespace + '').split(".");<br />
      var objs = this;<br />
    for( var i = 0; i < names.length; i ++ )<br />
    {<br />
      var subName = names[i];<br />
      var subType = typeof(objs[subName]);<br />
      if( subType == 'object'  )<br />
      {<br />
        if(i < names.length-1)<br />
        {<br />
          objs = objs[subName];<br />
          continue;<br />
        }else if(i == names.length-1 ){<br />
          objs = objs[subName];<br />
          objs[className] = null;<br />
          delete objs[className];<br />
        }<br />
      }else{<br />
        throw "Invalid namespace " + namespace;<br />
      }<br />
    }<br />
  }<br />
};<br />
<br />
oojs$.util = {<br />
  apply : function(dest, source) {<br />
    for ( var name in source) {<br />
      dest[name] = source[name];<br />
    }<br />
    return dest;<br />
  },<br />
<br />
  applyIf : function(dest, source) {<br />
    for ( var name in source) {<br />
      if (typeof (dest[name]) == 'undefined') {<br />
        dest[name] = source[name];<br />
      }<br />
    }<br />
    return dest;<br />
  }<br />
};<br />
<br />
//use stage <br />
oojs$.ns("com.utils");<br />
oojs$.com.utils.Audio = oojs$.createClass(<br />
{<br />
  fullscreen:false,<br />
  reset:function(){<br />
<br />
  },<br />
  getter_fullscreen:function()<br />
  {<br />
    return this.initData.fullscreen;<br />
  },<br />
  setter_fullscreen:function(value)<br />
  {<br />
    this.fullscreen = true;<br />
  },<br />
  __ctor: function()<br />
  {<br />
    this.reset();<br />
  }<br />
}<br />
</p><br />



   
<br />
<br />
</p>