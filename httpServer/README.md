# web server

<p><li><a href="https://github.com/mysqljs/mysql">https://github.com/mysqljs/mysql</a></li>
<li>
js
</li>
function(){<br />
	console.log(JSON.stringify(arguments));<br />
}<br />

ALTER TABLE `tb_user_basic` ADD `userLastLogin` INT NULL DEFAULT NULL COMMENT '用户最后访问时间' AFTER `STATUS`;
<br />
<br />
</p>
<br />
<p>
把代码整理一下，省的以后再下手写，直接copy<br />
<br />
var jsPackage = <br />
{<br />
 namespace: function( space )<br />
 {<br />
  var names = (space + '').split(".");<br />
  var objs = this;<br />
  for( var i = 0; i < names.length; i ++ )<br />
  {<br />
   var subName = names[i];<br />
   var subType = typeof(objs[subName]);<br />
   if( subType != 'object' && subType != 'undefined' )<br />
   {<br />
    throw "Invalid namespace " + space + ", sub: " + subName;<br />
   }<br />
   objs = objs[subName] = objs[subName] || {};<br />
  }<br />
 },<br />
 distroyClass:function(namespace,className){<br />
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
    <br />
   }else{<br />
    throw "Invalid namespace " + namespace;<br />
   }<br />
  }<br />
 },<br />
 util:{  <br />
  createClass: function( members, ctor)<br />
  {<br />
   var cls = typeof(ctor) == 'function' ? ctor : function()<br />
   {<br />
    if( typeof(this.__ctor) == 'function' )<br />
    {<br />
     this.__ctor.apply(this, arguments);<br />
    }<br />
   };<br />
   cls.prototype = cls.prototype || {};<br />
   var type = 0;<br />
   var fname;<br />
   var get_set_Obj={};<br />
   for( var name in members )<br />
   {<br />
    if(name.indexOf("getter_")==0)<br />
    {<br />
     fname=name.split("_")[1];<br />
     type=1;<br />
    }<br />
    else if(name.indexOf("setter_")==0)<br />
    {<br />
     fname=name.split("_")[1];<br />
     type=2;<br />
    }<br />
    else<br />
    {<br />
     type=3;<br />
    }<br />
    switch(type)<br />
    {<br />
     case 1:<br />
      if(null==get_set_Obj[fname])<br />
      {<br />
       get_set_Obj[fname]={};<br />
      }<br />
      get_set_Obj[fname].get=members[name];<br />
      break;<br />
     case 2:<br />
      if(null==get_set_Obj[fname])<br />
      {<br />
       get_set_Obj[fname]={};<br />
      }<br />
      get_set_Obj[fname].set=members[name];<br />
      break;<br />
     case 3:<br />
      cls.prototype[name] = members[name];<br />
      break;<br />
    } <br />
   }<br />
   <br />
   for(var name in get_set_Obj)<br />
   {<br />
    Object.defineProperty(cls.prototype,name,{<br />
     get:get_set_Obj[name]['get'],<br />
     set:get_set_Obj[name]['set'],<br />
    });<br />
   }<br />
   return cls;<br />
  },<br />
  <br />
  apply: function( dest, source )<br />
  {<br />
   for( var name in source )<br />
   {<br />
    dest[name] = source[name];<br />
   }<br />
   return dest;<br />
  },<br />
  <br />
  applyIf: function( dest, source )<br />
  {<br />
   for( var name in source )<br />
   {<br />
    if( typeof(dest[name]) == 'undefined' ) dest[name] = source[name];<br />
   }<br />
   return dest;<br />
  },<br />
  <br />
  // LZW-compress a string<br />
  lzwEncode : function(s)<br />
  {<br />
   var dict = {};<br />
   var data = (s + "").split("");<br />
   var out = [];<br />
   var currChar = 0;<br />
   var phrase = data[0];<br />
   var code = 256;<br />
   for (var i = 1; i < data.length; i++)<br />
   {<br />
    currChar = data[i];<br />
    if (dict[phrase + currChar] != null)<br />
    {<br />
     phrase += currChar;<br />
    }<br />
    else<br />
    {<br />
     out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));<br />
     dict[phrase + currChar] = code;<br />
     code++;<br />
     phrase = currChar;<br />
    }<br />
   }<br />
   out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));<br />
   for (var i = 0; i < out.length; i++)<br />
   {<br />
    out[i] = String.fromCharCode(out[i]);<br />
   }<br />
   return out.join("");<br />
  },<br />
  <br />
  createForm: function(formId, tableId, data, addOption)<br />
  {<br />
   if(formId)<br />
   {<br />
    if(tableId )<br />
    {<br />
     $('<table></table>', {<br />
      'id': tableId,<br />
      'cellpadding': '0',<br />
      'cellspacing': '0',<br />
      'class':'tb'<br />
     }).appendTo($('#'+formId));<br />
    }<br />
    <br />
    if( data )<br />
    {<br />
     var tmpTD = null;<br />
     for( var dtId = 0; dtId < data.length;dtId++ )<br />
     {<br />
      if(dtId%2==0){<br />
       tr = $('<tr class="row1"></tr>').appendTo($('#'+tableId));<br />
      }else<br />
      {<br />
       tr = $('<tr class="row2"></tr>').appendTo($('#'+tableId));<br />
      }<br />
      <br />
      for( var s_dtId = 0; s_dtId < data[dtId].length; s_dtId++ )<br />
      {<br />
       tmpTD = $('<td></td>');<br />
       tmpTD.append(data[dtId][s_dtId]);<br />
       tr.append(tmpTD);<br />
      }<br />
     }<br />
    }<br />
    <br />
    <br />
    if(addOption)<br />
    {<br />
     var tr = $('<tr style="background-color:#dddddd" align="center"></tr>').appendTo($('#'+tableId));<br />
     var td = $('<td></td>',{<br />
      'colspan':data[0].length<br />
     });<br />
     addOption(td);<br />
     tr.append(td);<br />
    }<br />
   }<br />
  },<br />
  <br />
  /**<br />
  *Usage scenario:<br />
  *createTable(<br />
  $(#div)<br />
  ,tableId<br />
  , ['id',name]<br />
  ,[[0,'zhangsan'],[1,'lisi']]<br />
  ,{titleList:[click],domClick:function(td,row){}}<br />
  ,addOption<br />
  )<br />
  **/<br />
  createTable: function(container,tableId,titleList,data,clickOption,addOption)<br />
  {<br />
   <br />
   if(container)<br />
   {<br />
    if(tableId && titleList && data )<br />
    {<br />
     $('<table></table>', {<br />
      'id': tableId,<br />
      'cellpadding': '0',<br />
      'cellspacing': '0',<br />
   <br />
      'class':'tb'<br />
     }).appendTo($('#'+container));<br />
     var tr = $('<tr class="tbtitle"></tr>').appendTo($('#'+tableId));<br />
     <br />
     for(var tId = 0; tId < titleList.length;tId++)<br />
     {<br />
      tr.append('<td>'+titleList[tId]+'</td>');<br />
     }<br />
     <br />
     if(clickOption && clickOption.titleList.length)<br />
     {<br />
      for( tId = 0; tId < clickOption.titleList.length;tId++)<br />
      {<br />
       tr.append('<td>'+clickOption.titleList[tId]+'</td>');<br />
      }<br />
     }<br />
     <br />
     for( var dtId = 0; dtId < data.length;dtId++ )<br />
     {<br />
      if(dtId%2==0){<br />
       tr = $('<tr class="row1" ></tr>').appendTo($('#'+tableId));<br />
      }else<br />
      {<br />
       tr = $('<tr class="row2" ></tr>').appendTo($('#'+tableId));<br />
      }<br />
      <br />
      for( var s_dtId = 0; s_dtId < data[dtId].length; s_dtId++ )<br />
      {<br />
       tr.append('<td>'+data[dtId][s_dtId]+'</td>');<br />
       <br />
       if(s_dtId==data[dtId].length-1 && clickOption)<br />
       {<br />
        <br />
        var td = $('<td></td>');<br />
        clickOption.domClick(td,data[dtId]);<br />
        tr.append(td);<br />
       }<br />
      }<br />
     }<br />
    }<br />
    <br />
    if(addOption)<br />
    {<br />
     var tr = $('<tr style="background-color:#dddddd" align="center"></tr>').appendTo($('#'+tableId));<br />
     <br />
     var td = $('<td></td>',{<br />
      'colspan':data[0].length<br />
     });<br />
     <br />
     addOption(td);<br />
     tr.append(td);<br />
     <br />
    }<br />
   }<br />
  },<br />
  /**<br />
  *Usage scenario:<br />
  *var serveruuid = jsPackage.util.getParam(window.location.search,'uuid');<br />
  **/<br />
  getParam: function( url, key )<br />
  {<br />
   var reg = new RegExp("\[?&]?"+key+"=([-\.\\w]{0,})?");<br />
   //console.log(url.match(reg));<br />
   var param = "";<br />
   if(reg.test(url))<br />
   {<br />
    param=url.match(reg)[1];<br />
   }<br />
   return param;<br />
  },<br />
  <br />
  getRequest: function(url,fun,type,sendData,param)<br />
  {<br />
   if(!url){return;}<br />
   type = type || 'get';<br />
   if('get'== type)<br />
   {<br />
    $.ajax({<br />
      type:type,<br />
      url:url,<br />
      async:false,<br />
      dataType:"json",<br />
      success:function(data,textStatus){<br />
     if(fun){<br />
      if(param){<br />
       fun(data,textStatus,param);<br />
      }else{<br />
       fun(data,textStatus);<br />
      }<br />
     }<br />
      },<br />
      beforeSend: function(xhr){<br />
       xhr.withCredentials = true;<br />
      }<br />
    });<br />
   }else if('post'== type)<br />
   {<br />
    $.ajax({<br />
     type:"post",<br />
     url:url,<br />
     async:false,<br />
     dataType:"json",<br />
     data:sendData,<br />
     success:function(data,textStatus){<br />
      if(fun){<br />
       if(param){<br />
        fun(data,textStatus,param);<br />
       }else{<br />
        fun(data,textStatus);<br />
       }<br />
      }<br />
     },<br />
     beforeSend: function(xhr){<br />
      xhr.withCredentials = true;<br />
     }<br />
    });<br />
   }<br />
  }<br />
  <br />
 }<br />
};<br />
<br />
<br />
<br />
把以上内容拷贝以下，另存为util.js<br />
然后在自己的页面加载该文件，前提是要引入jquery包<br />
<br />
如请求用户名和密码<br />
jsPackage.util.getRequest(<br />
 "http:127.0.0.1:10080/login?user=lisi&pwd=123",<br />
function(result){<br />
    console.log(result);<br />
});<br />
 <br />
附样式表<br />
.tb{<br />
	width:100%;<br />
	border:0px #949494 solid;<br />
	-webkit-box-shadow: 0 1px 2px rgba(0,0,0,.5);<br />
	-moz-box-shadow: 0 1px 2px rgba(0,0,0,.5);<br />
	box-shadow: 0 1px 2px rgba(0,0,0,.5);<br />
} <br />
.tb .row1 td{<br />
	background:#fff;<br />
	padding:5px 7px;<br />
	font-size:12px;<br />
	border-right:1px solid #f6f6f6;<br />
	border-top:1px solid #f6f6f6;<br />
}<br />
.tb .row1:hover td{<br />
	background:#ecf9fa;<br />
	border-top:1px solid #e7f6f6;<br />
}<br />
.tb .row2 td{<br />
	background: #fafafa;<br />
	padding:5px 7px;<br />
	font-size:12px;<br />
	border-right:1px solid #f3f3f3;<br />
	border-top:1px solid #f6f6f6;<br />
}<br />
.tb .row2:hover td{<br />
	background:#ecf9fa;<br />
	border-top:1px solid #e7f6f6;<br />
} <br />
<br />
<br />
</p>