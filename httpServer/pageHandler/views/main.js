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
    ,changeToStar: function(letter){
        var size = letter.length;
        var newLetter = '';
        if(size>2){
            newLetter += letter.substr(0,2)+"******"
        }else{
            newLetter += '********'
        }
        return newLetter;
    }
    /*****
    * <input id="upload-input" type="file" name="uploads_name" multiple="multiple"></br>
    * <button class="btn btn-lg upload-btn" type="button">Upload File</button>
    * $('.upload-btn').on('click', function (){
    *   $('#upload-input').click();
    *   //$('.progress-bar').text('0%');
    *   //$('.progress-bar').width('0%');
    * });
    * $('#upload-input').on('change', function(){
    *   var files = $(this).get(0).files;
    *   oojs$.http_upload( 'uploads_name', files, function(percent){
    *       console.log(percent);
    *   })
    *  })
    */
    ,http_upload: function(  name, files, callback, percentback){

        if (files.length > 0){
            var formData = new FormData();
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                formData.append(name, file, file.name);
            }   
            $.ajax({
                url: '/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(result){
                    // console.log('upload successful!\n' + result);
                    if(callback){
                        callback(result);
                    }
                },
                xhr: function() {
                    // create an XMLHttpRequest
                    var xhr = new XMLHttpRequest();

                    // listen to the 'progress' event
                    xhr.upload.addEventListener('progress', function(evt) {

                        if (evt.lengthComputable) {
                            // calculate the percentage of upload completed
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);
                            if(percentback){
                                percentback(percentComplete);
                            }
                            // if (percentComplete === 100) {
                            // }
                        }
                    }, false);
                    return xhr;
                }
            });
        }else{
            oojs$.showError("没有选择文件");
        }
    }
    
	,httpPost_json: function( send_url, send_jsonObj, callback, token ){
        var req = new XMLHttpRequest();
        var method =  "POST" ;
        req.open(method,send_url);
        // req.setRequestHeader('User-Agent','XMLHTTP/1.0');
        req.setRequestHeader('Content-type','application/json');
        
        req.onreadystatechange = function () {
            if (req.readyState != 4) return;
            if (req.status != 200 && req.status != 304) {
                callback();
                return;
            }
            // console.log(this.response);
            // console.log(this.responseText);
            callback(JSON.parse(this.responseText));
        }
        
        if (req.readyState == 4) return;
        req.send(JSON.stringify(send_jsonObj));

    //     $.ajax({
    //         type:"post",
    //         url:send_url,
    //         async:false,
    //         dataType:"json",
    //         data:JSON.stringify(send_jsonObj),
    //         success:function(result, textStatus){
				// if(callback){
    //                 callback(result, textStatus, token);
    //             }
    //         },
    //         beforeSend: function(xhr){
    //             xhr.withCredentials = true;
    //             xhr.onreadystatechange=function () { 
    //                 console.log("onreadystatechange",arguments) 
    //             };
    //             // xhr.error=function(){
    //             //     console.log("err",arguments)
    //             // }
    //         }
    //     });
	}

	,httpGet: function(send_url, callback, token){
        var req = new XMLHttpRequest();
        var method =  "GET" ;
        req.open(method,send_url);
        // req.setRequestHeader('User-Agent','XMLHTTP/1.0');
        
        req.setRequestHeader('Content-type','application/json');
        

        req.onreadystatechange = function () {
            if (req.readyState != 4) return;
            if (req.status != 200 && req.status != 304) {
                callback();
                return;
            }
            callback(JSON.parse(this.responseText));
        }
        
        if (req.readyState == 4) return;
        req.send();
        // $.ajax({
        //     type:"get",
        //     url:send_url,
        //     async:false,
        //     dataType:"json",
        //     success:function(result, textStatus){
        //         if(callback){
        //             callback(result, textStatus, token);
        //         }
        //     },
        //     beforeSend: function(xhr){
        //         xhr.withCredentials = true;
        //     }
        // });
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
    /***
    * oojs$.toHMSOBJ(time)
    */
    ,toHMSOBJ: function(){
        var shortTime = arguments[0];
        var obj = {hh:0,mm:0,ss:0};
        if( shortTime === undefined || shortTime === null ){
            return obj;
        }
        if(parseInt(shortTime)<0 || parseInt(shortTime)> 24*60*60 ){
            return obj;
        }

        obj['hh'] = Math.floor( parseInt(shortTime)/(60*60) );
        obj['mm'] = Math.floor( parseInt(shortTime)%(60*60)/60 );
        obj['ss'] = parseInt(shortTime)%60;

        return obj;
    }
    /***
    * oojs$.toHMS(time)
    */
    ,toHMS: function(){
        var shortTime = arguments[0];
        var obj = {hh:0,mm:0,ss:0};
        if( shortTime === undefined || shortTime === null ){
            return obj;
        }
        if(parseInt(shortTime)<0 || parseInt(shortTime)> 24*60*60 ){
            return obj;
        }

        obj['hh'] = Math.floor( parseInt(shortTime)/(60*60) );
        obj['mm'] = Math.floor( parseInt(shortTime)%(60*60)/60 );
        obj['ss'] = parseInt(shortTime)%60;

        return obj['hh']+":"+obj['mm']+":"+obj['ss'];
    }
    /**
    * usage
    * oojs$.generateHMDOption(div)
    * 
    */
    ,generateHMDOption: function(){
		var htmltag = arguments[0];
        var type = '';
        if(arguments.length>1){
            type = arguments[1];
        }

		htmltag.empty();

        if(type!='' && type == 'datepicker')
        {
            var input = $('<input></input>',{
                'type':'text'
            }).datepicker({ dateFormat: 'yy年mm月dd日' });
            input.datepicker('setDate',new Date());
            htmltag.append(input);
        }

		var tmpval = '';
        var select=null;

        htmltag.append($('<label>时</label>'));
        select= $('<select ></select>',{
            style:"height:25px;width:50px;"//-webkit-appearance: none;-moz-appearance: none;-o-appearance: none;"
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
            style:"height:25px;width:50px;"//-webkit-appearance: none;-moz-appearance: none;-o-appearance: none;"
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
            style:"height:25px;width:50px;"//-webkit-appearance: none;-moz-appearance: none;-o-appearance: none;"
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
            closeOnEscape: false
            ,
            
            resizable: false
            ,
            height: "auto"
            ,
            width: 400
            ,
            modal: true
            ,
            open: function(event, ui) {
                $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            }
            ,
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
            closeOnEscape: false
            ,
            open: function(event, ui) {
                $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            }
            ,
            buttons: {
                "Ok":function(){$(this).dialog("close");if(callback){callback()};}
            }
            ,
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

    ,getCookie: function (name) {
        function escape(s) { return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1'); };
        var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
        return match ? match[1] : null;
    }

    /****
    * oojs$.sendMessage({'type':"helloe",'other':'something'})
    *
    *
    **/
    ,_ws:null
    ,_ws_catch:[]
    ,_ws_status:'init'
    ,sendWSMessage:function(sendDt){
        if(sendDt){
            sendDt.uID = oojs$.getCookie('uID');
        }
        var self = this;
        if(self._ws == null){
            var host = window.document.location.host.replace(/:.*/, '');
            
            this._ws = new WebSocket('ws://' + location.hostname+(location.port ? ':'+location.port: ''));
            self._ws.onopen = function(){
                self._ws_status = "open";
                if(self._ws_catch.length>0){
                    for(var i = 0; i < self._ws_catch.length; i++){
                        self._ws.send(JSON.stringify(self._ws_catch[i]));
                    }
                }
            };
            self._ws.onmessage = function(evt){
                //console.log('main',evt.data);
                var jsonObj = JSON.parse(evt.data);
                if(jsonObj.hasOwnProperty('type')){
                    oojs$.dispatch(jsonObj['type'],jsonObj);
                }
            };
            self._ws.onerror = function (e) {
                self._ws = null;
            };
            self._ws.onclose = function () {
                self._ws = null;
                self._ws_status = "init"
            };
        }

        if(self._ws_status == "init"){
            if(sendDt.hasOwnProperty("type")){
                self._ws_catch.push(sendDt);
            }
        }else{
            if(sendDt.hasOwnProperty("type")){
                self._ws.send(JSON.stringify(sendDt));
            }
        }
    }

	,_events:{}

	,addEventListener: function(eventName, callback, scope){
        if(!callback){return;}
		this._events[eventName] = this._events[eventName] || [];
        for (var i = 0, len = this._events[eventName].length; i < len; i++) 
        {
            if(this._events[eventName][i] === callback ){
                return;
            }
        }
        callback['scope'] = scope;
        this._events[eventName].push(callback);
	}

    ,removeEventListener: function(eventName, callback){
        var events = this._events[eventName];
        for(var i = 0, len = events.length; i < len; i++){
            if(callback === events[i]){
                if(events[i]['scope']){
                    events[i]['scope'] = null;
                    delete events[i]['scope'];
                }
                events[i] = null;
                events.splice(i,1);
            }
        }
    }

    ,clearEventListener: function(eventName, callback){
        var events = this._events[eventName];
        for(var i = 0, len = events.length; i < len; i++){
            if(events[i]['scope']){
                events[i]['scope'] = null;
                delete events[i]['scope'];
            }
            events[i] = null;
        }
        delete this._events[eventName];
    }

	,dispatch:function(eventName, _){
        /**
         * function f(){console.log(arguments)}
		 * oojs$.addEventListener("ready",f);
		 * oojs$.dispatch("ready");
         * oojs$.removeEventListener("ready",f);
         * oojs$.dispatch("ready");
         */
		var events = this._events[eventName];
		var args = Array.prototype.slice.call(arguments, 1);
		if (!events)
		{
			return;
		}
		for (var i = 0, len = events.length; i < len; i++) 
		{
			events[i].apply(events[i]['scope'], args);
		}
	}
    /***
     * usage
     * oojs$.generateSelect(select,data)
     * param
     * select: $('<select></select>',{id:'id'})
     * data:{"used":1,"data":[{"ID":0,"NAME":"name0"},{"ID":1,"NAME":"name1"},{"ID":2,"NAME":"name2"}]} 
     *
     */
    ,generateSelect: function(select,data){
        if( select && data.hasOwnProperty('data') && data.data.length>0 ){
            for( var i = 0; i < data.data.length; i++ ){
                select.append("<option  value='"+data.data[i].ID+"'>"+data.data[i].NAME+"</option>")
            }
            if(data.hasOwnProperty('used')){
                select.val(data.data.used);
            }
        }
    }
    /***
     * usage
     * oojs$.fetch_paramName(data)
     * data:{"used":1,"data":[{"ID":0,"NAME":"name0"},{"ID":1,"NAME":"name1"},{"ID":2,"NAME":"name2"}]} 
     */
    ,fetch_paramName:function(data){
        if(  data.hasOwnProperty('used') &&data.hasOwnProperty('data') && data.data.length>0 ){
            for(var i = 0; i < data.data.length; i++ ){
                if(String(data.data[i].ID) == String(data.used)){
                    return String(data.data[i].NAME)
                }
            }
        }
        return '';
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
	 * "COL3":{ ELEMENT:"left",ELEMENT1:'right-up',ELEMENT2:'right-down',ROWSPAN:2},//"COL3":{ ELEMENT1:'right-up',ELEMENT2:'right-mid',ELEMENT3:'right-down',ROWSPAN:3},
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
                    $('<td></td>',{ 'class':"td",style:"max-width:46px"}).appendTo(tr).text(head[i]["NAME"]);
                    $('<td></td>',{ 'class':"td"}).appendTo(tr).append(item[head[i]["ID"]]["ELEMENT"]);
                }else if(COLSPAN == "2"){
                    $('<td></td>',{ 'colspan':"2",'align':"center",'valign':"bottom"}).appendTo(tr).append(item[head[i]["ID"]]["ELEMENT"]);
                }else{
                    throw "the value of COLSPAN not allowed"+COLSPAN;
                }
            }else{
                int_ROWSPAN = parseInt(ROWSPAN);

                if(i%2==0){
                    tmpClass = "even";
                }else{
                    tmpClass = "odd";
                }

                tr = $('<tr></tr>',{'class':tmpClass}).appendTo(tb);
                $('<td></td>',{ 'rowspan':int_ROWSPAN}).appendTo(tr).text(head[i]["NAME"]+" ");
                $('<td></td>',{ }).appendTo(tr).append(item[head[i]["ID"]]["ELEMENT1"]);
                for(var j = 0; j < int_ROWSPAN-1; j++)
                {
                    tr = $('<tr></tr>',{'class':tmpClass}).appendTo(tb);
                    $('<td></td>',{  }).appendTo(tr).append(item[head[i]["ID"]]["ELEMENT"+(j+2)]);
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
        var self = this;
		if(self.heartID==null){
			self.heartID = setInterval(function(){
                //self.closeHeartTime();
				$.ajax({
					type:"get",
					url:"/heartTime",
					async:false,
					dataType:"json",
					success:function(result,textStatus){
						if(result.success){
							//console.log( "success!" );
                            self.heartTime();
						}else{
                            self.closeHeartTime();
							oojs$.showError(result.message,function(){
                                window.location.href = "/";
                            });
						}
					},
					beforeSend: function(xhr){
						xhr.withCredentials = true;
					}
                    //
                    ,
                    xhr: function() {
                        // create an XMLHttpRequest
                        var xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4) {
                                if (xhr.status == 404) {
                                    // I can live with that, log it and go on
                                    alert("404");
                                    console.log("file missing");
                                }
                                else {
                                    // Wohoo, all is fine, do loading stuff
                                }
                            }
                            // listen to the 'progress' event
                            return xhr;
                        }
                    }
           
                    //
				});

			},30*1000);
		}
	}

    ,closeHeartTime:function(){
        var self = this;
		clearInterval( self.heartID);
        self.heartID = null;
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
    ,getPanelID: function(){
        return $('#accordion').accordion('option','active');
    }
    ,showPanel: function(){
        hideAllPanel();
        var active = $('#accordion').accordion('option','active');
        switch(active){
            case 0:
                $('#dictTrade_panel').show()
                break;
            case 1:
                $('#policy_panel').show()
                break;
            case 2:
                $('#order_today_panel').show()
                break;
            case 3:
                $('#market_panel').show()
                break;
            case 4:
                $('#user_panel').show()
                break;
            case 5:
                $('#_panel').show()
                break;
        }
    }
    //,$(':button').prop('disabled', true);
};
</script>
<!--
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-->
<script type="text/javascript">
//step 1:
// fun_policy:function(div,obj_json,fun_plcy){
//         var tag = null;
//         switch(obj_json['type']){
//             case 'label':
//                 tag = new oojs$.com.stock.Label();
//                 tag.init(div,obj_json,fun_plcy);
//                 return tag;
//             case 'input':
//                 tag = new oojs$.com.stock.Input();
//                 tag.init(div,obj_json,fun_plcy);
//                 return tag ;
//             case 'select':
//                 tag = new oojs$.com.stock.Select();
//                 tag.init(div,obj_json,fun_plcy);
//                 return tag;
//             case 'check':
//                 tag = new oojs$.com.stock.Check();
//                 tag.init(div,obj_json,fun_plcy);
//                 return tag;
//             case 'space':
//                 tag = new oojs$.com.stock.Space();
//                 tag.init(div,obj_json,fun_plcy);
//                 return tag;
//             default :
//                 return null;
//         }
//     }
//step 2:
//fun_policy(div,jsonData,fun_policy);
//
//jsonData {"view":[{"type":"label","value":"请输入最大值","suf":{  ...}}],"result":[{"id":"check_id","value":[0,1,0]}]}
//jsonData {"view":[{"type":"input","id":"input_id","value":"","suf":{  ...}},"result":[{"id":"check_id","value":[0,1,0]}]}
//jsonData {"view":[{"type":"check","id":"check_id","key":["ck_1","ck_2","ck_3"],"value":["近期涨停","昨日一封","昨日烂板"]}],"title":"","result":[{"id":"check_id","value":[0,1,0]}]}
//jsonData {"view":[{"type":"select","id":"select_id","key":["k1","k2"],"value":["值1","值2"],"suf":[{...},{...}}],"result":[{"id":"check_id","value":[0,1,0]}]}
//
oojs$.ns("com.stock.JsonView");
oojs$.com.stock.JsonView = oojs$.createClass(
{
    frame_jsonView:null
    ,jsonData:null
    ,tags:null
    ,init:function( jsonData ){
        //jsonData : {view:jsonData,result:[{'id':,value:}]}
        var self = this;
        self.jsonData = jsonData;
        self.draw_jsonView();
        return self.frame_jsonView;
    }

    ,fun_policy:function(div,obj_json,result,fun_plcy){
        var tag = null;
        switch(obj_json['type']){
            case 'label':
                tag = new oojs$.com.stock.Label();
                tag.init(div,obj_json,result,fun_plcy);
                return tag;
            case 'input':
                tag = new oojs$.com.stock.Input();
                tag.init(div,obj_json,result,fun_plcy);
                return tag ;
            case 'select':
                tag = new oojs$.com.stock.Select();
                tag.init(div,obj_json,result,fun_plcy);
                return tag;
            case 'check':
                tag = new oojs$.com.stock.Check();
                tag.init(div,obj_json,result,fun_plcy);
                return tag;
            case 'space':
                tag = new oojs$.com.stock.Space();
                tag.init(div,obj_json,result,fun_plcy);
                return tag;
            default :
                return null;
        }
    }

    ,draw_jsonView:function(){
        var self = this;
        
        if(self.frame_jsonView!=null
            && $.isArray(self.frame_jsonView)
        ){
            for(var idx=0; idx < self.frame_jsonView.length; idx++){
                self.frame_jsonView[idx].empty();
            }
            self.frame_jsonView = null;
        }

        self.tags = [];
        self.frame_jsonView = [];

        if(self.jsonData.view!=null){
            for(var id = 0; id < self.jsonData.view.length; id++){
                if(self.jsonData.view[id] == null){continue;}
                self.frame_jsonView[id] = $('<div></div>',{});
                var root = self.fun_policy(self.frame_jsonView[id],self.jsonData.view[id],self.jsonData.result,self.fun_policy);
                self.tags.push(root);
            }
        }
    }

    ,val:function(){
        var self = this;
        var result = [];
        for(var idx = 0; idx < self.tags.length; idx++){
            self.tags[idx].val(result);
        }
        
        self.jsonData.result = result;
        return self.jsonData;
    }

    ,clear:function(){
    }
})


oojs$.ns("com.stock.Space");
oojs$.com.stock.Space = oojs$.createClass(
{
    type:"space"
    ,suf:null
    ,init:function(div, obj_json, result, fun_policy){
        var self = this;
        if(obj_json!=null ){
            $("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>").appendTo(div);
            if(
                obj_json.hasOwnProperty('suf')
                && obj_json['suf']
            ){
                self.div = $('<div></div>',{style:"display:inline"});
                div.append(self.div);
                if(fun_policy!=null){
                    self.suf = fun_policy(self.div, obj_json['suf'], result, fun_policy);
                }
            }
        }
    }
    ,val:function(arr){
        var self = this;
        if( self.suf != null ){
            return self.suf.val(arr);
        }else{
            return null;
        }
    }
});


oojs$.ns("com.stock.Label");
oojs$.com.stock.Label = oojs$.createClass(
{
    type:"label"
    ,suf:null
    ,div:null
    ,init:function(div, obj_json, result, fun_policy){
        var self = this;
        
        if(obj_json!=null ){
            if(
                obj_json.hasOwnProperty('value')
                && obj_json['value']
            ){
                $('<label></label>').text(obj_json['value']).appendTo(div);
            }
            
            if(
                obj_json.hasOwnProperty('suf')
                && obj_json['suf']
            ){
                self.div = $('<div></div>',{style:"display:inline"});
                div.append(self.div);
                if(fun_policy!=null){
                    self.suf = fun_policy(self.div, obj_json['suf'], result, fun_policy);
                }
            }
        }
    }

    ,val:function(arr){
        var self = this;
        if( self.suf != null ){
            self.suf.val(arr);
        }
    }
});


oojs$.ns("com.stock.Input");
oojs$.com.stock.Input = oojs$.createClass(
{
    type:'input'
    ,id:''
    ,value:''
    ,div:null
    ,suf:null
    ,tag_input:null
    ,init:function(div, obj_json, result, fun_policy){
        var self = this;
        if(obj_json!=null ){
            self.obj_json = obj_json;
            if(
                obj_json.hasOwnProperty('id')
                && obj_json['id']
                
            ){
                self.id = obj_json['id'];
                self.value = obj_json['value'];
                self.tag_input = $('<input></input>',
                {
                    'type':'text'
                })
                .appendTo(div);

                for(var idx = 0; idx < result.length; idx++){
                    if(result[idx]['id'] == self.id){
                        self.tag_input
                        .val(result[idx]['value']);
                    }
                }
                
                if(
                    obj_json.hasOwnProperty('suf')
                    && obj_json['suf']
                ){
                    self.div = $('<div></div>',{style:"display:inline"});
                    div.append(self.div);
                    if(fun_policy!=null){
                        self.suf = fun_policy(self.div, obj_json['suf'], result, fun_policy);
                    }
                }
            }
        }
    }
    ,val:function(arr){
        var self = this;
        
        arr.push(
            {
                "id":self.id
                ,"value":self.tag_input.val()
            }
        );

        if( self.suf != null ){
            self.suf.val(arr);
        };
    }
});

oojs$.ns("com.stock.Select");
oojs$.com.stock.Select = oojs$.createClass(
{
    type:"select"
    ,id:null
    ,key:null
    ,value:null
    ,default:null
    ,div_parent:null
    ,div_self:null
    ,suf:null
    ,obj_json:null
    ,fun_policy:null
    ,tag_select:null
    ,init:function(div, obj_json, result, fun_policy){
        var self = this;
        self.fun_policy = fun_policy;
        self.div_parent = div;
        if(obj_json!=null ){
            self.obj_json = obj_json;
            if(
                obj_json.hasOwnProperty('id')
                && obj_json['id']
                && obj_json.hasOwnProperty('key')
                && obj_json['key']
                && obj_json.hasOwnProperty('value')
                && obj_json['value']
            ){
                self.id = obj_json['id'];
                self.key = obj_json['key'];
                self.value = obj_json['value'];
                if(self.key.length!=self.value.length  ){
                    oojs$.showError("jsonview length not match!");
                    return;
                }else
                {
                    self.tag_select = $('<select ></select>',{
                        style:"height:25px;"//-webkit-appearance: none;-moz-appearance: none;-o-appearance: none;"
                    }).appendTo(div).change(
                    {'scope':self},
                    self.select_change
                    );

                    for(var id = 0; id < self.value.length; id++){
                        $('<option value="'+self.key[id]+'">'+self.value[id]+'</option>').appendTo(self.tag_select);
                    }

                    for(var idx = 0; idx < result.length; idx++){
                        if(result[idx]['id'] == self.id){
                            self.default = result[idx]['value'];
                            self.hand_suf();
                        }
                    }
                }
            }
        }
    }
    ,val:function(arr){
        var self = this;
        
        arr.push({
            "id":self.id,
            "value":self.default
        });

        if( self.suf != null ){
            self.suf.val(arr);
        }
    }
    ,select_change:function(event){
        var self = event.data['scope'];
        var div = event.data['div'];
        console.log($(this).val());
        self.default = $(this).val();
        self.hand_suf();
    }
    ,hand_suf:function(){
        var self = this;

        if(self.div_self!=null){
            self.div_self.empty();
        }else{
            self.div_self = $('<div></div>',{style:"display:inline"});
        }

        self.suf = null;

        if(
            self.default!=null
        ){
            self.tag_select.val(self.default);
            if(
                self.obj_json.hasOwnProperty('suf')
                && self.obj_json['suf']
            ){
                if(self.fun_policy!=null){
                    for(var id_suf = 0; id_suf < self.value.length; id_suf++){
                        if(self.default == self.key[id_suf]){
                            if(self.obj_json['suf'][id_suf]!=null){
                                
                                self.div_parent.append(self.div_self);
                                self.suf = self.fun_policy(self.div_self, self.obj_json['suf'][id_suf], result, self.fun_policy);
                            }
                        }
                    }
                }
            }
        }
    }
});

oojs$.ns("com.stock.Check");
oojs$.com.stock.Check = oojs$.createClass(
{
    type:"check"
    ,id:null
    ,key:null
    ,value:null
    ,default:null
    ,suf:null
    ,div:null
    ,checks:null
    ,result:null
    ,init:function(div, obj_json, result, fun_policy){
        var self = this;
        self.div_parent = div;
        if(obj_json!=null ){
            if(
                obj_json.hasOwnProperty('id')
                && obj_json['id']
                && obj_json.hasOwnProperty('key')
                && obj_json['key']
                && obj_json.hasOwnProperty('value')
                && obj_json['value']
            ){
                
                self.id = obj_json['id'];
                self.key = obj_json['key'];
                self.value = obj_json['value'];

                if(self.key.length!=self.value.length  ){
                    oojs$.showError("jsonview_check length not match!");
                    return;
                }else{
                    div.prop('style','display:inline-block');
                    var table = $('<table></table>',{}).appendTo(div);
                    if(self.checks == null){self.checks=[]}
                    for(var idx = 0; idx < result.length; idx++){
                        if(result[idx]['id'] == self.id){
                            self.default = result[idx]['value'];
                        }
                    }
                    for(var id_ck = 0; id_ck < self.value.length; id_ck++){
                        
                        var tr = $('<tr></tr>').appendTo(table);
                        var td = $('<td></td>',{style:'padding:0;font-family:Microsoft YaHei, Verdana, Geneva, sans-serif;font-size: 10px;'}).appendTo(tr);
                        self.default
                        var check = $('<input></input>',{
                            'type':'checkbox'
                            ,'name':self.key[id_ck]
                        })
                        .appendTo(td)
                        .change(
                            {'scope':self},
                            self.check_change
                        );
                        if(self.default[id_ck]) {
                            check.prop("checked",true)
                        }else{
                            check.prop("checked",false)
                        }
                        self.checks.push(check)
                        $('<label></label>').text(self.value[id_ck])
                        .appendTo(td);
                    }
                }
            }
        }
    }
    ,val:function(arr){
        var self = this;
        var obj = {};
        arr.push({
            "id":self.id
            ,"value":self.default
        });

        if( self.suf != null ){
            obj.suf = self.suf.val(arr);
            return obj;
        }else{
            return obj;
        }

    }

    ,check_change:function(event){
        var self = event.data.scope;
        var div = event.data['div'];
        // self.result = {}
        self.default = [];
        for(var id = 0; id < self.checks.length; id++)
        {
            self.default.push(self.checks[id].is(':checked')?1:0)
            // self.result[self.checks[id].prop('name')] = self.checks[id].is(':checked')
        }
    }
});

</script>
<!--
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-->
<script type="text/javascript">
/**
* var accountset = new oojs$.com.stock.component.accountset();
* accountset.init( div1, div2, ACCOUNTID, DIRTYPE, BORROW, BUYCOUNT, BUYAMOUNT, PERCENT, CHECKED, ACCOUNT);
* console.log(accountset.val());=>{ACCOUNTID:"123456",BORROW:0,BUYAMOUNT:"",BUYCOUNT:"",CHECKED:true,DIRTYPE:9,PERCENT:""}
*/
oojs$.ns("com.stock.component.accountset");
oojs$.com.stock.component.accountset =oojs$.createClass({
    NAME:"account"
    ,div1:null
    ,div2:null
    ,INPUT:null
    ,NEWDIRTYPE:0
    ,CHECK:null
    ,LABEL_UNIT:null
    ,SELECT_DIRTYPE:null
    ,SELECT:null
    ,ACCOUNTID:''
    ,DIRTYPE:''
    ,BORROW:''
    ,BUYCOUNT:''
    ,BUYAMOUNT:''
    ,PERCENT:''
    ,BUYCOUNT_tmp:''
    ,BUYAMOUNT_tmp:''
    ,PERCENT_tmp:''
    ,ACCOUNT:null
    ,CAPITAL:null
    ,select_tradetype:[
        {id:"BUYCOUNT",name:"交易股数"}
        ,{id:"BUYAMOUNT",name:"交易金额"}
        ,{id:"PERCENT",name:"交易比例"}
    ]//帐户用
    
    ,init:function(div1, div2, ACCOUNTID, DIRTYPE, BORROW, BUYCOUNT, BUYAMOUNT, PERCENT, CHECKED, ACCOUNT){
        //column1
        var self = this;
        div1.empty();
        div2.empty();
        self.DIRTYPE = DIRTYPE;
        self.ACCOUNTID = ACCOUNTID;
        self.BORROW = BORROW;
        self.BUYCOUNT_tmp = self.BUYCOUNT = BUYCOUNT;
        self.BUYAMOUNT_tmp = self.BUYAMOUNT = BUYAMOUNT;
        self.PERCENT_tmp = self.PERCENT = PERCENT;
        self.CHECKED = CHECKED;
        self.ACCOUNT = ACCOUNT;

        self.INPUT = $('<input></input>',{'type':'text'});
        self.LABEL_UNIT = $('<label></label>');

        var checkbox = self.CHECK = $('<input></input>',{
            'type':'checkbox'

        }).change(
            {'scope':self},
            self.ck_change
        );

        if(CHECKED){
            checkbox.prop('checked', true);
        }
        
        div1.append(checkbox);
        var label_name = $('<label></label>').text('帐户:');
        div1.append(label_name);
        //column2
        var label_value = $('<label></label>').text(ACCOUNTID);
        div2.append(label_value);

        self.NEWDIRTYPE = 0;

        if(DIRTYPE == 0){//买入
            if(BORROW == 0){
                self.NEWDIRTYPE = 0;
            }else if(BORROW == 1){
                //委托种类
                self.NEWDIRTYPE = 0;
                self.SELECT_DIRTYPE = $('<select></select>');
                self.SELECT_DIRTYPE.append(
                    "<option value='0'>普通</option>"
                );
                self.SELECT_DIRTYPE.append(
                    "<option value='2'>融资买入</option>"
                );
                if(!CHECKED){
                    self.SELECT_DIRTYPE.prop("disabled", true );
                }
                self.SELECT_DIRTYPE.change(
                    {'scope':self},
                    self.DIRTYPE
                );
                div2.append(self.SELECT_DIRTYPE);
            }
            
        }else if(DIRTYPE == 1){//卖出
            if(BORROW == 0){
                self.NEWDIRTYPE = 1;
            }else if(BORROW == 1){
                //委托种类
                self.NEWDIRTYPE = 1;
                self.SELECT_DIRTYPE = $('<select></select>');
                self.SELECT_DIRTYPE.append(
                    "<option value='1'>普通</option>"
                );
                self.SELECT_DIRTYPE.append(
                    "<option value='5'>卖券还款</option>"
                );
                
                if(!CHECKED){
                    self.SELECT_DIRTYPE.prop("disabled", true );
                }
                div2.append(self.SELECT_DIRTYPE);
            }
        }else if(DIRTYPE == 9){//撤单
            self.NEWDIRTYPE = 9
            label_value = $('<label></label>').text("撤单");
            div2.append(label_value);
            
        }

        if(DIRTYPE == null||DIRTYPE != 9){
            if( self.SELECT == null ){//one_third
                self.SELECT = self.append_select_tradetype(CHECKED);
                 self.SELECT.change(
                    {'scope':self},
                    self.select_change
                );
            }

            div2.append(self.SELECT);
            
            if(!CHECKED){
                self.INPUT.prop("disabled", true );
            }
            div2.append(self.INPUT);
            
            div2.append(self.LABEL_UNIT);
        }
    }
    /****
    *capital = {account_msum:"8026.90",
    account_muse:"1986.90",
    account_value:"6040.00",
    accountid:"309219512983",
    status:"200",
    tradeid:"1",
    userid:"20000"}
    */
    ,addCapital:function(CAPITAL){
        var self = this;
        self.CAPITAL = CAPITAL;
    }
    ,ck_change:function(event){
        var self = event.data['scope'];
        if ($(this).is(':checked')) {
            if(self.INPUT){
                self.INPUT.prop('disabled',false);
            }

            if(self.SELECT_DIRTYPE){
                self.SELECT_DIRTYPE.prop('disabled',false);
            }

            if(self.SELECT){
                self.SELECT.prop('disabled',false);
            }
        }else{
            self.BUYCOUNT='';
            self.BUYAMOUNT='';
            self.PERCENT='';

            if(self.INPUT){
                self.INPUT.val('');
                self.INPUT.prop('disabled',true);
            }

            if(self.SELECT_DIRTYPE){
                self.SELECT_DIRTYPE.prop('disabled',true);
            }

            if(self.SELECT){
                self.SELECT.val('-1');
                self.SELECT.prop('disabled',true);
            }
            if(self.LABEL_UNIT){
                self.LABEL_UNIT.text("");
            }
        }
    }
    ,select_change:function(event){
        var self = event.data['scope'];
        console.log("select_change",self.SELECT.val(),"select_change");
        self.INPUT.val('');
        switch(self.SELECT.val()){
            case "BUYCOUNT":
                if(self.LABEL_UNIT){
                    if(self.DIRTYPE == 0){
                        self.LABEL_UNIT.text("股(请输入100的倍数)");
                    }else{
                        self.LABEL_UNIT.text("股");
                    }
                    self.BUYCOUNT='';
                    self.BUYAMOUNT='';
                    self.PERCENT='';
                    if(Number(self.BUYCOUNT_tmp)>0){
                        self.INPUT.val(self.BUYCOUNT_tmp);
                        self.BUYCOUNT=self.BUYCOUNT_tmp;
                    }
                }

                break;
            case "BUYAMOUNT":
                if(self.LABEL_UNIT){
                    self.LABEL_UNIT.text("¥");
                    self.BUYCOUNT='';
                    self.BUYAMOUNT='';
                    self.PERCENT='';
                    if(Number(self.BUYAMOUNT_tmp)>0){
                        self.INPUT.val(self.BUYAMOUNT_tmp)
                        self.BUYAMOUNT = self.BUYAMOUNT_tmp;
                    }
                }
                // if( self.CAPITAL && self.CAPITAL.hasOwnProperty('account_muse')  ){
                //     self.INPUT.val(self.CAPITAL.account_muse);
                // }
                
                break;
            case "PERCENT":
                if(self.LABEL_UNIT){
                    self.LABEL_UNIT.text("请输入0-1的数");
                    self.BUYCOUNT='';
                    self.BUYAMOUNT='';
                    self.PERCENT='';
                    // if(self.ACCOUNT!=null){
                    //     if( self.ACCOUNT.hasOwnProperty('PERCENT') ){
                    //         self.INPUT.val(self.ACCOUNT['PERCENT']);
                    //     }
                    // }
                    if(Number(self.PERCENT_tmp)>0){
                        self.INPUT.val(self.PERCENT_tmp);
                        self.PERCENT = self.PERCENT_tmp
                    }
                }
                break;
        }
    }
    ,val:function(){
        var self = this;
        var checked = $(self.CHECK).is(':checked');
        var dirtype = self.NEWDIRTYPE;
        
        if( self.SELECT_DIRTYPE ){
            dirtype = $(self.SELECT_DIRTYPE).val()
        }

        // if($.trim(self.INPUT.val()) == ""){
        //     oojs$.showError("请选择交易策略并输入信息");
        //     return null;
        // }
        
        if(self.SELECT && checked){
            var one_third_slct = $(self.SELECT).val();
            switch(one_third_slct){
                case "BUYCOUNT":
                    self.BUYCOUNT = self.INPUT.val();
                    self.BUYAMOUNT='';
                    self.PERCENT='';
                    if(self.DIRTYPE == 0){
                        if(parseInt(self.BUYCOUNT)%100!=0||parseInt(self.BUYCOUNT)==0){
                            oojs$.showError("您输入的股数不是100的倍数");
                            return null;
                        }
                    }
                    break;
                case "BUYAMOUNT":
                    self.BUYCOUNT='';
                    self.BUYAMOUNT=self.INPUT.val();
                    self.PERCENT='';
                    if( self.CAPITAL && self.CAPITAL.hasOwnProperty('account_muse') && Number(self.BUYAMOUNT) > Number(self.CAPITAL.account_muse) ){
                        oojs$.showError("您输入的资金大于可用的资金");
                        return null;
                    }
                    break;
                case "PERCENT":
                    self.BUYCOUNT='';
                    self.BUYAMOUNT='';
                    self.PERCENT=self.INPUT.val();
                    if(!regular.checkFloat(self.PERCENT)){
                        oojs$.showError("您输入的比例非法");
                        return null;
                    }
                    if(Number(self.PERCENT)>1){
                        oojs$.showError("您输入的比例超出范围已经大于1");
                        return null;
                    }
                    break;
            }
        }

        return {
            'CHECKED':checked
            ,'ACCOUNTID':self.ACCOUNTID
            ,'DIRTYPE':dirtype
            ,'BORROW':self.BORROW
            ,'BUYCOUNT':self.BUYCOUNT
            ,'BUYAMOUNT':self.BUYAMOUNT
            ,'PERCENT':self.PERCENT
            ,'INPUT':self.INPUT
        };
    }
    ,append_select_tradetype: function(CHECKED){
        var self = this;
        var select = $('<select></select>',{
            // id:'order_select2'
        });

        if(!CHECKED){
            select.prop( "disabled", true );
        }

        for(var i = 0; i < self.select_tradetype.length; i++){
            select.append(
                "<option value='"
                +self.select_tradetype[i]['id']
                +"'>"
                +self.select_tradetype[i]['name']+"</option>"
            );
        }

        console.log("main select append_select_tradetype ",self.BUYCOUNT,self.BUYAMOUNT,self.PERCENT,self.select_tradetype);
        if(Number(self.PERCENT_tmp)>0){
            select.val('PERCENT');
            self.INPUT.val(Number(self.PERCENT_tmp))
            self.LABEL_UNIT.text("请输入0-1的数");
        }else if(Number(self.BUYCOUNT_tmp)>0){
            select.val('BUYCOUNT');
            self.INPUT.val(Number(self.BUYCOUNT_tmp));
            if(self.DIRTYPE == 0){
                self.LABEL_UNIT.text("股(请输入100的倍数)");
            }else{
                self.LABEL_UNIT.text("股");
            }
            
        }else if(Number(self.BUYAMOUNT_tmp)>0){
            select.val('BUYAMOUNT');
            self.INPUT.val(Number(self.BUYAMOUNT_tmp))
            self.LABEL_UNIT.text("¥");
        }
        return select;
    }
    ,destroy:function(){
        if(div1){
            div1.empty();
        }
        if(div2){
            div2.empty();
        }
        self.INPUT = null;
        self.CHECK = null;
        self.LABEL_UNIT = null;
        self.ACCOUNT = null;
        delete self.ACCOUNT;
        self.init = null;
        delete self.init;
        self.append_select_tradetype = null;
        delete self.append_select_tradetype;
    }
})
</script>
<!--
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-->
<script type="text/javascript">
/**
* var hh_mm_ss = new oojs$.com.stock.component.hh_mm_ss();
* hh_mm_ss.init(div,{ hh:0, mm:1, ss:2 }[,'datepicker'])
* console.log(hh_mm_ss.val())=>{ hh:0, mm:1, ss:2 }
*/
oojs$.ns("com.stock.component.hh_mm_ss");
oojs$.com.stock.component.hh_mm_ss=oojs$.createClass({
    NAME:"hh_mm_ss"
    ,kids:null
    ,inputs:null
    ,type:''
    ,val:function(){
        if(this.type == 'tomorrow'){
            var date = new Date($(this.inputs[0]).val());
            date.setHours($(this.kids[0]).val());
            date.setMinutes($(this.kids[1]).val());
            date.setSeconds($(this.kids[2]).val());
            return date.toJSON();
        }
        if(this.type == 'datepicker'){
            var date = new Date($(this.inputs[0]).datepicker('getDate'));
            date.setHours($(this.kids[0]).val());
            date.setMinutes($(this.kids[1]).val());
            date.setSeconds($(this.kids[2]).val());
            return date.toJSON();
            //return {'yMd':date.toJSON(),'hh':$(this.kids[0]).val(),'mm':$(this.kids[1]).val(),'ss':$(this.kids[2]).val()};;
        }
        return {hh:$(this.kids[0]).val(),"mm":$(this.kids[1]).val(),"ss":$(this.kids[2]).val()};;
    }
    ,init:function(div, hh_mm_ss, datepicker, date){
        if(datepicker && datepicker == 'tomorrow'){
            this.type = datepicker;
            oojs$.generateHMDOption(div,'datepicker');
            this.inputs = div.find( "input" );
            
            var _date = new Date();
            if(date == null){
                _date.setDate(_date.getDate()+1);
            }else{
                _date = new Date(date);
            }
            $(this.inputs[0]).val(oojs$.Format(_date,'yyyy-MM-dd'));
            $(this.inputs[0]).prop('disabled',true);

        }else if(datepicker && datepicker == 'datepicker'){
            this.type = datepicker;
            oojs$.generateHMDOption(div,datepicker);
            this.inputs = div.find( "input" );
            if( date!=null ){
                $(this.inputs[0]).datepicker('setDate',date);
            }
        }else{
            this.type = '';
            oojs$.generateHMDOption(div);
        }

        this.kids = div.find( "select" );
        var hh = parseInt(hh_mm_ss["hh"]);
        var mm = parseInt(hh_mm_ss["mm"]);
        var ss = parseInt(hh_mm_ss["ss"]);
        $(this.kids[0]).val(hh<=9?"0"+hh:hh);
        $(this.kids[1]).val(mm<=9?"0"+mm:mm);
        $(this.kids[2]).val(ss<=9?"0"+ss:ss);
    }
    
})
</script>
<!--
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-->
<script type="text/javascript">
/****
* var stockset = new oojs$.com.stock.component.stockset();
* stockset.appendCK_stockset(div1, div2,'value');
* console.log(stockset.val())=>value
*/
oojs$.ns("com.stock.component.stockset");
oojs$.com.stock.component.stockset=oojs$.createClass({
    NAME:"stockset"
    ,data:''
    ,input:null
    ,val:function(){
        console.log("检查当前的值是否合法")
        return this.data;
    }
    ,delCKBtnFun: function(event){
        var kids1 = event.data['div_ck'].find( "input" );
        var self = event.data['scope'];
        var data = "";
        var isselect = false;
        for(var i =0; i < kids1.length; i++){
            if(!$(kids1[i]).is(':checked')){
                isselect = true;
                data += $(kids1[i]).val()+",";
            }
        }
        if(isselect){
            data = data.substr(0,data.length-1);
        }
        self.data = data;

        self.rangeChk(event.data['div_ck']);
    }

    ,addCKBtnFun: function(event){

        var inputval = event.data['input'].val();
        var self = event.data['scope'];
        event.data['input'].val('');
        inputval = $.trim(inputval);
        if(inputval.length < 3){
            oojs$.showError("输入的数据有误 code 001");
            return;
        }
        
        if(preload.STOCKS.length>0){
            var instock = false;
            for(var i = 0; i < preload.STOCKS.length; i++){
                if(preload.STOCKS[i]['value'] == ""+inputval){
                    instock = true;
                    break;
                }
                
            }
            if(!instock){
                oojs$.showError("输入的股票数据有误 code 002" );
                return;
            }
        }
        var data = self.data ;
        console.log("addCKBtnFun>>>>",data);

        data = $.trim(String(data));
        if(data.indexOf(inputval)>=0){
            oojs$.showError(inputval+"已经存在");
            return;
        }
        if( inputval.length > 1){

            if(data.length>1){
                data += ","+inputval
            }else{
                data +=  inputval
            }
        }else{
            oojs$.showError("数据有误请核查");
            return;
        }
        self.data = data;
        self.rangeChk(event.data['div_ck']);
    }

    ,rangeChk: function(div_ck){
        var self = this;
        div_ck.empty();
        var label = null;
        var checkbox = null;
        var data = String(self.data);
        

        if(data.indexOf(",") == 0){
            data = data.substr(1);
        }

        if(data[data.length-1]==","){
            data = data.substr(0,data.length-1);
        }


        if( data.length > 0 ){
            var datas = data.split(",");

            if(datas.length == 1 &&  datas[0] == ""){
                //null
            }else{
                for(var i = 0; i < datas.length; i++){
                    checkbox = $('<input></input>',{
                        'style':'width:10px',
                        'type':'checkbox',
                        'value':datas[i]
                    }).appendTo(div_ck);

                    $('<label></label>').appendTo(div_ck).text(datas[i]);
                    div_ck.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
                }
            }
        }
    }

    ,init:function(div1,div2,data){
        var self = this;
        if(data == "null"){
            data = "";
        }
        data = $.trim(String(data));
        console.log('data',typeof(data));
        div1.empty();
        div2.empty();
        
        self.data = data;
        
        var div_ck = $('<div></div>',{
            'width': '590px',
            'word-wrap': 'break-word'});
        div1.append(div_ck);

        self.rangeChk(div_ck);

        $('<input></input>',{type:"button",value:"删除"}).appendTo(div1).click(
            {"div1":div1,"div2":div2,"div_ck":div_ck,'data':data,'scope':self},
            self.delCKBtnFun
        );

        var input = self.input = $('<input></input>',{}).text("");
        var stocks = preload.getStock();
        if(stocks!=null){

            $(input).autocomplete({
                source: stocks
                // ,change: function( event, ui ) {
                //     console.log("autocomplete change",ui);
                // }
                // ,focus: function( event, ui ) {console.log("autocomplete change",ui);}
                // ,open: function( event, ui ) {}
                ,select: function( event, ui ) {
                    input.val(ui.item.value);
                    var tmp_event = {};
                    tmp_event.data = {"div1":div1,"div2":div2,"div_ck":div_ck,"input":input,'data':data,'scope':self};
                    self.addCKBtnFun(tmp_event);
                }
                // ,response: function( event, ui ) {console.log("autocomplete response",ui);}
            });
        }

        $('<label style="color: #000000; font-size: 80%;">请输入股票编码</label>').appendTo(div2);
        div2.append(input);
        $('<input></input>',{'type':"button",'value':"新增"}).appendTo(div2).click(
            {"div1":div1,"div2":div2,"div_ck":div_ck,"input":input,'data':data,'scope':self},
            self.addCKBtnFun
        );

        var input_up = $('<input  type="file" name="uploads" multiple="multiple" style="display: none;" />');//
        var button = $('<input type="button" value="上传文件"></input>');
        button.click(function (){
            input_up.click();
         });
        input_up.change(function(){
            var files = $(this).get(0).files;
            $(':input').prop('disabled', true);
            // $(':a').prop('disabled', true);
            console.log(files);
            oojs$.http_upload( 'uploads_name', files,function(result){
                console.log(JSON.stringify(result));
                if(result.type == 'too long'){
                    oojs$.showError('您的股票太长会导致服务器偷懒，所以提取了前1000股票!');
                }
                if(self.data.length>0){
                    for(var i = 0; i < result.data.length; i++){
                        self.data += ","+result.data[i];
                    }
                }else{
                    for(var i = 0; i < result.data.length; i++){
                        if(i == 0){
                            self.data += result.data[0];
                        }else{
                            self.data += ","+result.data[i];
                        }
                    }
                }
                
                self.rangeChk(div_ck);
                $(':input').prop('disabled', false);
                // $(':a').prop('disabled', false);
                
            }, function(percent){
                console.log(percent);
            })
        });

        div2.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
        div2.append(input_up);
        div2.append(button);

    }
})
</script>
<!--
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-->
<script type="text/javascript">
/****
* var rmb = new oojs$.com.stock.component.RMB();
* rmb.int(input,select,'元');
*/
oojs$.ns("com.stock.component.RMB");
oojs$.com.stock.component.RMB=oojs$.createClass({
    NAME:"stockset"
    ,input:null
    ,select:null
    ,input2:null
    ,val:function(){
        return this.data;
    }
    ,init:function(input,select,danWei,input2){
        var self = this;
        input.focusout(function(){
            if(input2!=null){
                if(parseInt(input2.val())>parseInt(input.val())){
                    input2.val(input.val())
                }
            }
        });
        select.append($('<option  value="0">万元</option>'));
        select.append($('<option  value="1">元</option>'));
        select.change(
            {'scope':self,'input':input},
            self.select_change
        );
        if(danWei=='万元'){
            select.val('0');
        }else if(danWei=='元'){
            select.val('1');
        }else{
            select.val('1');
        }
    }
    ,select_change:function(event){
        var self = event.data['scope'];
        var input = event.data['input'];
        console.log('select_change:',$(this).val());
        if($(this).val() == '0'){//万元->元
            if(Number(input.val())>0){
                input.val(input.val()/10000)
            }
        }else if($(this).val() == '1'){//元-万元
            if(Number(input.val())>0){
                input.val(input.val()*10000)
            }
        }
    }
    ,clear:function(){
        input = null;
        select = null;
        input2 = null;
    }
})
</script>
<!--
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-->
<script type="text/javascript">
oojs$.ns("com.stock.regular");
oojs$.com.stock.regular=oojs$.createClass({
    NAME:'grep'
    ,reg1:/^[0-9]*$/ //验证数字
    ,reg2:/^\d{n}$/ //验证n位的数字：
    ,reg3:/^\d{n,}$/ //验证至少n位数字
    ,reg4:/^\d{m,n}$/ //验证m-n位的数字

    ,reg5:/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/ //正浮点数
    ,reg6:/^(?:[a-z\d]+[_\-\+\.]?)*[a-z\d]+@(?:([a-z\d]+\-?)*[a-z\d]+\.)+([a-z]{2,})+$/ //验证Email地址
    ,reg7:/^[a-zA-Z]\w{5,17}$/ //以字母开头，长度在6-18之间，只能包含字符、数字和下划线
    ,reg8:/[^%&',;=?$\x22]+\"/ //否含有 ^%&',;=?$\" 等字符
    ,reg9:/^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/ //验证电话号码正确格式为：XXXX-XXXXXXX，XXXXXXXXXXXX，
    ,reg10:/^(-?\d+)(\.\d+)?$/ //验证数字
    ,checkNum:function(value){
        var self = this;
        return (self.reg1.test(value))
    }
    ,checkXNum:function(value,bit){
        var self = this;
        var reg2 = new RegExp("^\\d{"+bit+"}");
        return (reg2.test(value))
    }
    ,checkFloat:function(value){
        var self = this;
        return self.reg5.test(value);
    }
});
var regular = new oojs$.com.stock.regular();
oojs$.ns("com.stock.preload");
oojs$.com.stock.preload=oojs$.createClass({
    NAME:'preload'
    ,PGROUP:[]
    // ,POLICY:[]
    ,TRADE:[]
    ,EXECUTE:[]
    ,STATUS:{'TRADE':0,'PGROUP':0,'EXECUTE':0}
    ,STOCKS:null
    ,isLoadStock:false
    ,getStock:function(callback){
        var self = this;
        if(self.STOCKS == null && !self.isLoadStock ){
            self.isLoadStock = true;
            oojs$.httpGet("/stocks",function(result,textStatus,token){
                if(result.success){
                    self.STOCKS = [];
                    
                    var obj = JSON.parse(result.data);
                    for(var i = 0; i < obj.length; i++){
                        self.STOCKS.push({
                            'label':obj[i]['code']+" "+obj[i]['name']
                            ,'value':obj[i]['code']
                        });
                    }
                    self.isLoadStock = false;

                    if(callback){
                        callback(self.STOCKS);
                    }
                    return self.STOCKS;
                }else{
                    // oojs$.showError(result.message);
                    if(callback){
                        callback([]);
                    }
                    self.isLoadStock = false;
                }
            })
        }else{
            if(callback){
                callback(self.STOCKS);
            }
            return self.STOCKS;
        }
    }
    ,getPGroupItem:function(){ 
        var self = this;
        for( var i = 0; i < self.PGROUP.length; i++ ){
            if(parseInt(self.PGROUP[i]["ID"]) == parseInt(arguments[0])){
                return self.PGROUP[i];
            }
        }
        oojs$.showError("PGROUP:不在数据域内");
        return -1;
    }
    ,getTradeItem:function(){
        var self = this;
        for( var i = 0; i < self.TRADE.length; i++ ){
            if(parseInt(self.TRADE[i]["ID"]) == parseInt(arguments[0])){
                return self.TRADE[i];
            }
        }
        oojs$.showError("Trade:不在数据域内");
        return -1;
    }

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
    ,getExecute:function(){
        var self = this;
        var id = arguments[0];
        for(var idx = 0; idx <  self.EXECUTE.length;idx++){
            if(String(self.EXECUTE[idx]['STATUS']) == String(id)){
                return self.EXECUTE[idx]['NAME'];
            }
        }
        return id+"-未定义"
        // switch (parseInt(arguments[0])){
        //     case 0 :
        //         return "已提交";
        //     case 1 :
        //         return "已读取";
        //     case 2:
        //         return "已下单";
        //     case 3:
        //         return "部分成交";
        //     case 4:
        //         return "全部完成";
        //     case 5:
        //         return "网络异常";
        //     case 6:
        //         return "业务处理失败";
        //  } 
    }
    ,getFrom:function(){
        switch (parseInt(arguments[0])){
            case 1 :
                return "周期单";
            case 2:
                return "盘中单";
            case 3:
                return "隔日单";
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

        oojs$.httpPost_json( "/select_status",[],function(result,textStatus,token){
            if(result.success){
                self.EXECUTE = [];
                self.EXECUTE = result.data;
                self.STATUS.EXECUTE = 1;
                self.checkAllload();
            }else{
                oojs$.showError(result.message);
            }
        },'EXECUTE');

        oojs$.httpGet("/select_policyGID",function(result,textStatus,token){

            if(result.success){
                self.PGROUP = [];
                self.PGROUP = result.data;
                self.STATUS.PGROUP = 1;
                self.checkAllload();
            }else{
                oojs$.showError(result.message);
            }
        },'PGROUP');

    }

});

var preload = new oojs$.com.stock.preload();

<%- jsState %>
oojs$.addEventListener("ready",function(){
        oojs$.showPanel();
    });
var shareObj = {};

$(document).ready(function(){
    hideAllPanel();
    $("#accordion").accordion({
        active: 2
    });
    
    var showTopInfo = function(){
        $("#topinfo").append(
            $('<a  href="#"">退出</a>').click(function(event){
                event.preventDefault();
                oojs$.httpGet("/exit",function(result,textStatus,token){
                    if(result.success){
                        window.location.href = "/";
                    }else{
                        oojs$.showError(result.message);
                    }
                });
            })
        )
    };
    showTopInfo();

	hideAllPanel();
	
    preload.load(function(){
        oojs$.dispatch("ready");
        oojs$.sendWSMessage({'type':'ready','action':'init'})
    });
    

<%- jsRegist %>

    oojs$.heartTime();
});

</script>