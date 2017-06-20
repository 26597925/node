# web server
<p>
<ul>
	<li>http://www.bootcss.com/</li>
	<li>https://github.com/DoubleSpout/ccap</li>
	<li>https://www.datatables.net/</li>
	<li>http://www.jqplot.com/</li>
	<li>http://jqueryui.com/tabs/</li>
	<li>http://jqueryui.com/accordion/</li>
	<li><a href="https://github.com/DoubleSpout/ccap">https://github.com/DoubleSpout/ccap</a></li>
	<li><a href="https://github.com/mysqljs/mysql">https://github.com/mysqljs/mysql</a></li>
	<li>http://api.jqueryui.com/autocomplete/</li>
	<li>npm install captchapng</li>
	<li>https://www.npmjs.com/package/captchapng</li>
	<li>https://msdn.microsoft.com/en-us/library/ms533723(VS.85).aspx</li>
</ul>
</p>
<p>
	npm install ccap  <br />
</p>
<pre>
<h2>jQuery ≥ 1.7</h2>

$('#myimage').click(function() { return false; }); // Adds another click event
$('#myimage').off('click');
$('#myimage').on('click.mynamespace', function() { /* Do stuff */ });
$('#myimage').off('click.mynamespace');

<h2>jQuery < 1.7</h2>

$('#myimage').click(function() { return false; }); // Adds another click event
$('#myimage').unbind('click');

If you want to add a single event and then remove it 
(without removing any others that might have been added) 
then you can use event namespacing:

$('#myimage').bind('click.mynamespace', function() { /* Do stuff */ });
and to remove just your event:

$('#myimage').unbind('click.mynamespace');

</pre>
<pre>
	<div  title="7/pn/112, Share In Ranges: 0" style="background-color: rgb(170, 170, 170);width:6px;display: inline-block;height: 10px;margin-top: 20px;">*</div>
		<div  title="7/pn/112, Share In Ranges: 0" style="background-color: rgb(170, 0, 0);width:6px;display: inline-block;height: 10px;margin-top: 20px;color: #fff;">&nbsp;</div>
		<div  title="7/pn/112, Share In Ranges: 0" style="background-color: rgb(170, 0, 0);width:6px;display: inline-block;height: 10px;margin-top: 20px;color: #fff;">*</div>

		
<div class="piece-units" title="7/pn/112, Share In Ranges: 0" style="background-color: rgb(170, 0, 0);">
	*
</div>

.channel-item .pieces .piece-units {
    display: inline-block;
    width: 6px;
    height: 10px;
    border-top: solid #fff 1px;
    border-right: solid #fff 1px;
    cursor: pointer;
    margin-top: 20px;
    color: #fff;
}
</pre>
oojs 
<pre>

<p>

SyntaxError: Use of const in strict mode.
>>>
node --version v0.10.37
>>>
npm cache clean -f
npm install -g n
n v7.5.0 //
n stable
node --version
node app.js


//nameSpace
var oojs$ = {
	ns : function(space) {
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
	}
	,createClass:function(value)
	{
		var cls = function()
		{
			if(typeof(this.__ctor) == 'function')
			{
				this.__ctor.apply(this,arguments);
			}
		};
		cls.prototype = cls.prototype || {};
		var type = 0;
		var fname;
		var get_set_obj = {};
		for(var name in value)
		{
			if(name.indexOf('getter_') === 0)
			{
				fname = name.split('_')[1];
				type = 1;
		}
		else if(name.indexOf('setter_') === 0)
		{
			fname = name.split('_')[1];
			type = 2;
		}
		else
		{
			type = 0;
		}

		switch(type)
		{
			case 0:
				cls.prototype[name] = value[name];
				break;
			case 1:
				get_set_obj[fname] = get_set_obj[fname] || {};
				get_set_obj[fname].get = value[name];
				break;
			case 2:
				get_set_obj[fname] = get_set_obj[fname] || {};
				get_set_obj[fname].set = value[name];
				break;
			}
		}
	
		for(var i in get_set_obj)
		{
			Object.defineProperty(cls.prototype,i,{
			get:get_set_obj[i].get,
			set:get_set_obj[i].set,
			});
		}
		return cls;
	}
	,distroyClass:function(namespace,className)
	{
		var names = (namespace + '').split(".");
		var objs = this;
		for( var i = 0; i < names.length; i ++ )
		{
			var subName = names[i];
			var subType = typeof(objs[subName]);
			if( subType == 'object'  )
			{
				if(i < names.length-1)
				{
					objs = objs[subName];
					continue;
				}else if(i == names.length-1 ){
					objs = objs[subName];
					objs[className] = null;
					delete objs[className];
				}
			}else{
				throw "Invalid namespace " + namespace;
			}
		}
	}
	,apply : function(dest, source) {
		for ( var name in source) {
			dest[name] = source[name];
		}
		return dest;
	}
	,
	applyIf : function(dest, source) {
		for ( var name in source) {
			if (typeof (dest[name]) == 'undefined') {
				dest[name] = source[name];
			}
		}
		return dest;
	}
	,_events:{}
	,addEventListener: function(eventName, callback){
		this._events[eventName] = this._events[eventName] || [];
		this._events[eventName].push(callback);
	}
	,dispatch:function(eventName, _){
		var events = this._events[eventName];
		var args = Array.prototype.slice.call(arguments, 1);
		if (!events)
		{
			return;
		}
		for (var i = 0, len = events.length; i < len; i++) 
		{
			events[i].apply(null, args);
		}
	}
};


//use stage 
oojs$.ns("com.utils");
oojs$.com.utils.Audio = oojs$.createClass(
{
	fullscreen:false,
	reset:function(){
	},
	getter_fullscreen:function()
	{
		return this.initData.fullscreen;
	},
	setter_fullscreen:function(value)
	{
		this.fullscreen = true;
	},
	__ctor: function(value)
	{
		oojs$.apply(this,value);
		this.reset();
	}
}

<!--
<tfoot>
    <tr>
        <th>板块名称</th>
        <th>最新价</th>
        <th>涨跌额</th>
        <th>跌幅</th>
        <th>换手率</th>
        <th>涨跌幅</th>
    </tr>
</tfoot>
-->
</pre>
</p>

