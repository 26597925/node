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
</ul>
</p>
<p>
	npm install ccap  <br />
</p>

oojs 
<pre>

<p>

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

</pre>
</p>
<p>
	<pre>
listenerobj.addEventListener("listnerName",function)
var listenerobj = function(){};
listenerobj._events = {};
listenerobj.addEventListener(eventName, callback)
{
    listenerobj._events[eventName] = listenerobj._events[eventName] || [];
    listenerobj._events[eventName].push(callback);
};

listenerobj.dispatch= function(eventName, _) 
{    
    var events = listenerobj ._events[eventName];
    var args = Array.prototype.slice.call(arguments, 1);
    if (!events)
    {      
        return;    
    }
    for (var i = 0, len = events.length; i < len; i++) 
    {      
        events[i].apply(null, args);
    }  
};
	</pre>
</p>