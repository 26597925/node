<script language="javascript" type="text/javascript" src="/json2.js"></script>

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
	}

	,createClass: function(value)
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
			set:get_set_obj[i].set
			});
		}
		return cls;
	}

	,distroyClass: function(namespace,className)
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

	,httpPost_json: function( send_url, send_jsonObj, callback, token ){
        $.ajax({
            type:"post",
            url:send_url,
            async:false,
            dataType:"json",
            data:JSON.stringify(send_jsonObj),
            success:function(result, textStatus){
				if(callback){
                    callback(result, textStatus, token);
                }
            },
            beforeSend: function(xhr){
                xhr.withCredentials = true;
            }
        });
	}

	,httpGet: function(send_url, callback, token){
        $.ajax({
            type:"get",
            url:send_url,
            async:false,
            dataType:"json",
            success:function(result, textStatus){
                if(callback){
                    callback(result, textStatus, token);
                }
            },
            beforeSend: function(xhr){
                xhr.withCredentials = true;
            }
        });
	}

	,Format: function(_date,fmt) { // author: meizz
        var o = {
            "M+" : _date.getMonth() + 1, // 月份
            "d+" : _date.getDate(), // 日
            "H+" : _date.getHours(), // 小时
            "m+" : _date.getMinutes(), // 分
            "s+" : _date.getSeconds(), // 秒
            "q+" : Math.floor((_date.getMonth() + 3) / 3), // 季度
            "S" : _date.getMilliseconds()
            // 毫秒
        };

        if (/(y+)/.test(fmt)){
            fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        }

        for ( var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
                    : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

	,matchYMD: function(myd,type){
		if(!myd){
            return false;
		}
        type = type||2;
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

    ,valideStock: function(){
        if(arguments[0].match(/^[a-zA-Z0-9]{6}$/)){
            return true;
        }else{
            return false;
        }
    }

    ,generateHMDOption: function(){
		var htmltag = arguments[0];
        // var hh_id = arguments[1];
        // var mm_id = arguments[2];
        // var ss_id = arguments[3];

		htmltag.empty();
		var tmpval = '';
        var select=null;

        htmltag.append($('<label>时</label>'));
        select= $('<select ></select>',{
            // id:hh_id,
            style:"height:25px;width:30px;-webkit-appearance: none;"
        });
		for(var i = 0; i < 24; i++){

            tmpval = i<=9?("0"+i):i;
            select.append("<option value='"
                +tmpval+"'>"
                +tmpval+"</option>");
		}
        htmltag.append(select);

        htmltag.append($('<label>:分</label>'));

        select= $('<select ></select>',{
            // id:mm_id,
            style:"height:25px;width:30px;-webkit-appearance: none;"
        });
        for(var i = 0; i < 60; i++){

            tmpval = i<=9?("0"+i):i;
            select.append("<option value='"
                +tmpval+"'>"
                +tmpval+"</option>");
        }
        htmltag.append(select);

        htmltag.append($('<label>:秒</label>'));

        select= $('<select></select>',{
            // id:ss_id,
            style:"height:25px;width:30px;-webkit-appearance: none;"
        });
        for(var i = 0; i < 60; i++){
            tmpval = i<=9?("0"+i):i;
            select.append("<option value='"
                +tmpval+"'>"
                +tmpval+"</option>");
        }
        htmltag.append(select);


		return htmltag;
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
        /**
         *<div id="dialog" title="提示" style="display:none;">
         *<p id="dialogtext" style=""></p>
         *</div>
         * */
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
	
	,applyIf : function(dest, source) {
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

    ,removeEventListener: function(eventName, callback){
       //??
    }

	,dispatch:function(eventName, _){
        /**
		 * oojs$.dispatch("ready");
		 * oojs$.addEventListener("ready",function(){console.log("ready")});
         */
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
    /***
     * usage
     * oojs$.appendTB_list(panel,list_head,list_body)
     * param
     * panel: div
     * list_head: [{ID:"COL1",NAME:"title1"},{ID:"COL2",NAME:"title2"}]
     * list_body: [
     * {
     *      "COL1":{ ELEMENT:"value1" },
     *      "COL2":{ ELEMENT:"value2" }
     * }
     * ,
     * {
     *      "COL1":{ ELEMENT:"value1" },
     *      "COL2":{ ELEMENT:"value2" }
     * }
     * ]
     *
     */
    ,appendTB_list : function(panel,list_head,list_body){
        panel.empty();
        if(list_head && list_head.length > 0
            && list_body && list_body.length > 0){
            var tb = $('<table></table>', {
                'class':'display dataTable'
            }).appendTo(panel);

            var thead = $('<thead></thead>').appendTo(tb);
            var tr = $('<tr></tr>').appendTo(thead);
            for(var elm = 0; elm < list_head.length; elm++){
                if(!list_body[0].hasOwnProperty( list_head[elm]["ID"] )){
                    continue;
                }
                var th = $('<th></th>',{
                    'class':"ui-state-default"
                }).appendTo(tr).text(list_head[elm]["NAME"]);
            }

            var tbody = $('<tbody></tbody>').appendTo(tb);
            for( var elm = 0; elm < list_body.length; elm++ ){
                var tr = null;
                if(elm%2 == 0){
                    tr = $('<tr></tr>',{'class':"even"}).appendTo(tbody);
                }else{
                    tr = $('<tr></tr>',{'class':"odd"}).appendTo(tbody);
                }
                var td = null;
                for(var in_elm = 0; in_elm < list_head.length; in_elm++){
                    if(!list_body[elm].hasOwnProperty( list_head[in_elm]["ID"] )){
                        continue;
                    }
                    td = $('<td></td>').appendTo(tr);
                    td.append(list_body[elm][ list_head[in_elm]["ID"] ]['ELEMENT']);
                }
            }
        }
    }


    /***
     * usage
     * oojs$.appendTB_item_D2(tb,list_head,item)
     * param
     * panel: tb
     * head: [{ID:"COL1",NAME:"title1"},{ID:"COL2",NAME:"title2"},{ID:"COL3",NAME:"title3"},{ID:"COL4",NAME:"title4"}]
     * item: {
	 * "COL1":{ ELEMENT:"value1" },
	 * "COL2":{ ELEMENT:"value2" },
	 * "COL3":{ ELEMENT:"left",ELEMENT1:'right-up',ELEMENT2:'right-down',ROWSPAN:2},//"COL3":{ ELEMENT:"left",ELEMENT1:'right-up'},ELEMENT2:'right-mid',ELEMENT3:'right-down',ROWSPAN:3},
     * "COL4":{ ELEMENT:"only one cell",COLSPAN:2}
     * }
     *
     *(D2 identify 2 col )
     */
    ,appendTB_item_D2 : function(tb,head,item){
        var tr = null;
        var ROWSPAN = "";
        var COLSPAN = "";
        var int_ROWSPAN = 0;
        var tmpClass = "";
        for(var i = 0; i < head.length; i++){

            if(!item.hasOwnProperty(head[i]["ID"])){
                continue;
            }
            ROWSPAN = "";
            COLSPAN = "";
            if(item[head[i]["ID"]].hasOwnProperty("ROWSPAN")){
                ROWSPAN = String(item[head[i]["ID"]]["ROWSPAN"]);
            }
            if(item[head[i]["ID"]].hasOwnProperty("COLSPAN")){
                COLSPAN = String(item[head[i]["ID"]]["COLSPAN"]);
            }
            if(ROWSPAN == ""){
                if(i%2==0){
                    tr = $('<tr></tr>',{'class':"even"}).appendTo(tb);
                }else{
                    tr = $('<tr></tr>',{'class':"odd"}).appendTo(tb);
                }
                if(COLSPAN == ""){
                	//width:100px;
                    $('<td></td>',{ 'class':"td",style:"max-width:46px"}).appendTo(tr).text(head[i]["NAME"]+": ");
                    $('<td></td>',{ 'class':"td"}).appendTo(tr).append(item[head[i]["ID"]]["ELEMENT"]);
                }else if(COLSPAN == "2"){
                    $('<td></td>',{ 'colspan':"2",'align':"center",'valign':"bottom"}).appendTo(tr).append(item[head[i]["ID"]]["ELEMENT"]);
                }else{
                    throw "the value of COLSPAN not allowed"+COLSPAN;
                }
            }else{
                int_ROWSPAN = parseInt(ROWSPAN);
                if(int_ROWSPAN<2){
                    throw "the value of ROWSPAN not allowed"+ROWSPAN;
                }

                if(i%2==0){
                    tmpClass = "even";
                }else{
                    tmpClass = "odd";
                }

                tr = $('<tr></tr>',{'class':tmpClass}).appendTo(tb);
                $('<td></td>',{ 'rowspan':int_ROWSPAN}).appendTo(tr).text(head[i]["NAME"]+": ");
                $('<td></td>',{ }).appendTo(tr).append(item[head[i]["ID"]]["ELEMENT1"]);
                for(var j = 0; j < int_ROWSPAN-1; j++)
                {
                    tr = $('<tr></tr>',{'class':tmpClass}).appendTo(tb);
                    $('<td></td>',{  }).appendTo(tr).append(item[head[i]["ID"]]["ELEMENT2"]);
                }

            }
        }
    }

    /***
     * usage
     * oojs$.appendTB_item_D2x(tb,item_D2)
     * param
     * panel: tb
     *
     * item_D2: [
     * { 'COLUMN1':"value1", 'COLUMN2':"value2" },
     * { 'COLUMN1':"value1", 'COLUMN2':"value2"},
     * { 'COLUMN1':"left",COLUMN2:'right-up',COLUMN3:'right-down',ROWSPAN:2},
     * { 'COLUMN1':"only one cell",COLSPAN:2}
     * ]
     *
     *(D2x identify 2 column but not head limit body)
     */
    ,appendTB_item_D2x:function(tb,item_D2){
        var tr = null;
        var ROWSPAN = "";
        var COLSPAN = "";
        var int_ROWSPAN = 0;
        var tmpClass = "";
        for(var i = 0; i < item_D2.length; i++){
            ROWSPAN = "";
            COLSPAN = "";

            if(item_D2[i].hasOwnProperty("ROWSPAN")){
                ROWSPAN = String(item_D2[i]["ROWSPAN"]);
            }else if(item_D2[i].hasOwnProperty("COLSPAN")){
                COLSPAN = String(item_D2[i]["COLSPAN"]);
            }

            if(ROWSPAN == ""){

                if(i%2==0){
                    tr = $('<tr></tr>',{'class':"even"}).appendTo(tb);
                }else{
                    tr = $('<tr></tr>',{'class':"odd"}).appendTo(tb);
                }

                if(COLSPAN == ""){
                    $('<td></td>',{ 'class':"td"}).appendTo(tr).append(item_D2[i]["COLUMN1"] );
                    $('<td></td>',{ 'class':"td"}).appendTo(tr).append(item_D2[i]["COLUMN2"]);
                }else if(COLSPAN == "2"){
                    $('<td></td>',{ 'colspan':"2",'align':"center",'valign':"bottom"}).appendTo(tr).append(item_D2[i]["COLUMN1"]);
                }else{
                    throw "the value of COLSPAN not allowed"+COLSPAN;
                }
            }else{
                int_ROWSPAN = parseInt(ROWSPAN);
                if(int_ROWSPAN<2){
                    throw "the value of ROWSPAN not allowed"+ROWSPAN;
                }

                if(i%2==0){
                    tmpClass = "even";
                }else{
                    tmpClass = "odd";
                }
                tr = $('<tr></tr>',{'class':tmpClass}).appendTo(tb);
                $('<td></td>',{ 'rowspan':int_ROWSPAN}).appendTo(tr).append(item_D2[i]["COLUMN1"] );
                $('<td></td>',{ }).appendTo(tr).append(item_D2[i]["ELEMENT2"]);
                for(var j = 0; j < int_ROWSPAN-1; j++)
                {
                    tr = $('<tr></tr>',{'class':tmpClass}).appendTo(tb);
                    $('<td></td>',{  }).appendTo(tr).append(item_D2[i]["ELEMENT"+(j+3)]);
                }

            }
        }
    }

	,heartID:null

	,heartTime:function(){
		if(this.heartID==null){
			this.heartID = setInterval(function(){
				$.ajax({
					type:"get",
					url:"/heartTime",
					async:false,
					dataType:"json",
					success:function(result,textStatus){

						if(result.success){
							console.log( "success!" );
						}else{
							oojs$.showError(result.message)
						}
					},
					beforeSend: function(xhr){
						xhr.withCredentials = true;
					}
				});
			},30000);
		}
	}

    ,closeHeartTime:function(){
		clearInterval( this.heartID);
        this.heartID = null;
    }
    ,valideString:function(val){
        val = String(val);
        return (val.trim() === 'undefined' || val.trim() == "null" || val.length <= 0) ? "" : val;
    }
    ,valideDate:function(){
        var str_date = arguments[0];
        if(oojs$.matchYMD(str_date))
        {
        	return str_date;
        }else{
        	return oojs$.Format(new Date(),"yyyy-MM-dd");
        }
    }
    ,valide6letter:function(){
        if(arguments[0].match(/^[a-zA-Z0-9]{6}$/)){
            return true;
        }else{
            return false;
        }
    }

};
oojs$.ns("com.stock.preload");
oojs$.com.stock.preload=oojs$.createClass({
    NAME:'preload'
    ,GROUP:''
    // ,POLICY:[]
    ,TRADE:[]
    ,STATUS:{'TRADE':0,'GROUP':0}
    ,getDirtype:function(){
        switch (parseInt(arguments[0])){
            case 0:
                return "买入";
            case 1:
                return "卖出";
            case 2:
                return "融资买入";
            case 3:
                return "融券卖出";
            case 4:
                return "买券还券";
            case 5:
                return "卖券还款";
            case 6:
                return "现券还券";
            case 9:
                return "撤单";
        }
    }

    ,checkAllload:function(){
        var self = this;
        for(var  elm in self.STATUS){
            if(self.STATUS[elm] == 1){
                continue;
            }else{
                return;
            }
        }
        if(self.callback){
            self.callback();
        }
    }
    ,load:function(callback){
        var self = this;
        self.callback = callback;
        oojs$.httpGet("/select_dictTrade",function(result,textStatus,token){
            if(result.success){
                self.TRADE = [];
                self.TRADE = result.data;
                self.STATUS.TRADE = 1;
                self.checkAllload();
            }else{
                oojs$.showError(result.message);
            }
        },'TRADE');

        oojs$.httpGet("/select_policyGID",function(result,textStatus,token){

            if(result.success){
                self.GROUP = [];
                self.GROUP = result.data;
                self.STATUS.GROUP = 1;
                self.checkAllload();
            }else{
                oojs$.showError(result.message);
            }
        },'GROUP');

    }

});

var preload = new oojs$.com.stock.preload();


<%- jsState %>
$(document).ready(function(){

    var showTopInfo = function(){
        $("#topinfo").html("<a id='topinfousr' href='/#'>退出</a>")
    };
    showTopInfo();

	hideAllPanel();
	// $("#accordion").accordion();
    $("#accordion").accordion({
        active: 2
    });

    preload.load(function(){
        oojs$.dispatch("ready");
    });


<%- jsRegist %>

//oojs$.heartTime();
});

</script>