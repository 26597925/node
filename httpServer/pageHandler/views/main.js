<script language="javascript" type="text/javascript" src="/public/js/jquery.min.js"></script>
<script language="javascript" type="text/javascript" src="/public/js/jquery.jqplot.min.js"></script>
<script type="text/javascript" src="/public/js/jquery-ui-1.8.21.custom.min.js"></script>

<script type="text/javascript" src="/public/js/jquery.crypt.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.pieRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.donutRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.canvasTextRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.highlighter.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.canvasAxisLabelRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.barRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.categoryAxisRenderer.min.js"></script>
<script type="text/javascript" src="/public/js/plugins/jqplot.pointLabels.min.js"></script>




<style type="text/css" media="screen">
@import "/public/js/plugins/DataTables-1.9.2/media/css/demo_page.css";
@import "/public/js/plugins/DataTables-1.9.2/media/css/demo_table_jui.css";
</style>
<script type="text/javascript" src="/public/js/plugins/DataTables-1.9.2/media/js/jquery.dataTables.min.js"></script>
<link rel="stylesheet" type="text/css" href="/public/js/css/smoothness/jquery-ui-1.8.21.custom.css" />
<link rel="stylesheet" type="text/css" href="/public/js/jquery.jqplot.min.css" />

<script type="text/javascript">
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
	,matchYMD: function(myd,type){
        var yearReg = '(20[0-9][0-9]|20[0-9][0-9])';            ///< Allows a number between 2014 and 2029
        var monthReg = '(0[1-9]|1[0-2])';               ///< Allows a number between 00 and 12
        var dayReg = '(0[1-9]|1[0-9]|2[0-9]|3[0-1])';   ///< Allows a number between 00 and 31
        var hourReg = '([0-1][0-9]|2[0-3])';            ///< Allows a number between 00 and 24
        var minReg = '([0-5][0-9])';                    ///< Allows a number between 00 and 59
        var reg1 = new RegExp('^' + yearReg + '-' + monthReg + '-' + dayReg + ' ' + hourReg + ':' + minReg + '$', 'g');
        var reg2 = new RegExp('^' + yearReg + '-' + monthReg + '-' + dayReg + '$', 'g');
        var reg = null;
        if(type == 1){
            reg = reg1;
        }else{
            reg = reg2;
        }
        if( !myd.match(reg) ){
            return false;
        }else{
            return true;
        }
    }

    ,showInfo:function (text,callback) {

		/**
		 *<div id="dialog" title="提示" style="display:none;">
         *<p id="dialogtext" style=""></p>
         *</div>
		 * */
        $("#dialogtext").text(text);
        $( "#dialog" ).dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "确定": function() {

                    $( this ).dialog( "close" );
                    if(callback){
                        callback("yes");
                    }
                },
                "取消": function() {
                    $( this ).dialog( "close" );
                    if(callback){
                        callback("no");
                    }
                }
            }
        });
    }
	,showError:function (text,callback) {
        // $("#dialogtext").text('text');
        // $("#dialog").dialog({
        //     buttons: {"Ok":function(){$(this).dialog("close");}},
        //     modal:true,
        //     close:function(event,ui){
        //
        //     }
        // });

        $("#dialogtext").text(text);
        $("#dialog").dialog({
            buttons: {"Ok":function(){$(this).dialog("close");if(callback){callback()};}},
            modal:true
        });
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

<%- jsState %>
$(document).ready(function(){
	hideAllPanel();
	$("#accordion").accordion();
	oojs$.dispatch("ready");

<%- jsRegist %>

});


</script>