var dictTrade_selectList = [ 
//[id,label,title]
//[id,label]
];

var dict_trade_list_head = ["id","所属的券商","券商的登录帐号","操作"];//"操作"单加按钮
var dict_trade_list = [
//[name,value,id+'_dict']
//[data.data["USERID"],data.data["TRADEID"],data.data["ACCOUNTID"]]
];

// $('<input></input>',{
// 				'type':'checkbox'
// 				,'name':checkValue[checkId][0]
// 				,'value':checkValue[checkId][1]
// 				,'checked':checkValue[checkId][2]==0?false:true
// 			}).appendTo(tmp_label);

var dictTrade_selectElement = null;

var getValue_dt_selectList = function(id){
	if(dictTrade_selectList.length>0){
		for(var i =0; i< dictTrade_selectList.length; i++){
			if(dictTrade_selectList[i][0]==id){
				return dictTrade_selectList[i][1];
			}
		}
	}
}

var delete_dictTrade_Account = function(){
	console.log('delete_dictTrade_Account',arguments)
	var sendData = {
        tradeid:arguments[0]
        ,accountid:arguments[1]
    };

    $.ajax({
        type:"post",
        url:"/delete_userAccount",
        async:false,
        dataType:"json",
        data:sendData,
        success:function(data,textStatus){
            if(data.success){
            	load_dictTrade_info(); 
            }
        },
        beforeSend: function(xhr){
            xhr.withCredentials = true;
        }
    });
}

var modify_dictTrade_Account = function(){
	//tradeid=4&accountid=10500998&password=1111111
	console.log("modify_dictTrade_Account",arguments)
	var sendData = {
        tradeid:arguments[0]
        ,accountid:arguments[1]
        ,password:arguments[2]
    };

    $.ajax({
        type:"post",
        url:"/modify_userAccount",
        async:false,
        dataType:"json",
        data:sendData,
        success:function(data,textStatus){
            
            if(data.success){
                load_dictTrade_info(); 
            }
        },
        beforeSend: function(xhr){
            xhr.withCredentials = true;
        }
    });

}

var add_dictTrade_Account = function(){
	console.log(arguments)
	var sendData = {
        tradeid:arguments[0]
        ,accountid:arguments[1]
        ,password:arguments[2]
    };

    $.ajax({
        type:"post",
        url:"/add_userAccount",
        async:false,
        dataType:"json",
        data:sendData,
        success:function(data,textStatus){
            if(data.success){
            	load_dictTrade_info();
            }
        },
        beforeSend: function(xhr){
            xhr.withCredentials = true;
        }
    });
}



var reset_dictTrade_Account = function(){
	$("#dictTrade_account").val('');
	$("#dictTrade_pwd").val('')
	dictTrade_selectElement.val(0)
}

var dictTrade_clickHandler = function(){
	
	if(this.type == "submit"){
		if(this.textContent == "删除"){
			// console.log(this.id,this.name,this.value);
			delete_dictTrade_Account(this.value,this.id.replace("_dict",""));
		}else if(this.textContent == "修改"){
			//console.log(this.id,this.name,this.value);
			var pwd = "";
			modify_dictTrade_Account(this.value,this.id.replace("_dict",""),pwd);
		}
	}else if(this.type == "button"){
		if(this.value == "新增"){
			// console.log("select",$("#dictTrade_account").val());
			// console.log("select",$("#dictTrade_pwd").val());
			// console.log("select",dictTrade_selectElement.val());
			add_dictTrade_Account(dictTrade_selectElement.val(),$("#dictTrade_account").val(),$("#dictTrade_pwd").val());
		}else if(this.value == "重置"){
			reset_dictTrade_Account();
			// console.log("select",dictTrade_selectElement.val());
		}
	}
}

var start_dictTrade_Page = function(){
	if(dictTrade_selectList.length==0){
		$.ajax({
	        type:"get",
	        url:"/select_dictTrade",
	        async:false,
	        dataType:"json",
	        success:function(data,textStatus){
	            if(data.success){
	            	dictTrade_selectList = [];
	            	for(var i in data.data){
	            		dictTrade_selectList.push([data.data[i]["ID"],data.data[i]["NAME"]]);
	            	}
	            	create_dictTrade_Select();
	            	load_dictTrade_info();
	            }
	        },
	        beforeSend: function(xhr){
	            xhr.withCredentials = true;
	        }
	    });
	}else{
		load_dictTrade_info();
	}
}


var create_dictTrade_Select=function(){
	
	dictTrade_selectElement = $('<select></select>',{
		id:'dictTrade_select'
	})

	for(var sId = 0; sId < dictTrade_selectList.length; sId++)
	{
		if( 3 <= dictTrade_selectList[sId].length )
		{
			if(dictTrade_selectList[sId][2])
			{
				dictTrade_selectElement.append("<option value='"
					+dictTrade_selectList[sId][0]
					+"' title='"+dictTrade_selectList[sId][2]+"'>"+dictTrade_selectList[sId][1]+"</option>");
			}else{
				dictTrade_selectElement.append("<option value='"
					+dictTrade_selectList[sId][0]+"'>"
					+dictTrade_selectList[sId][1]+"</option>");
			}
			
		}else if( 2 == dictTrade_selectList[sId].length )
		{
			dictTrade_selectElement.append("<option value='"
				+dictTrade_selectList[sId][0]+"'>"+dictTrade_selectList[sId][1]+"</option>");
		}
	}

	// dictTrade_selectElement.val("maxMem");

	$("#dict_trade_opt").append(dictTrade_selectElement);

		
}

var append_dict_trade_list = function(){
	$("#dict_trade_list").empty();
	var tb = $('<table></table>', {
		'id': "dict_trade_list_tb",
		'class':'display dataTable'
	}).appendTo($('#dict_trade_list'));

	var thead = $('<thead></thead>').appendTo(tb);
	var tr = $('<tr></tr>').appendTo(thead);
	
	for(var elm = 0; elm < dict_trade_list_head.length; elm++){
		var th = $('<th></th>',
		{class:"ui-state-default"
		}).appendTo(tr).text(dict_trade_list_head[elm]);
	}

	var tbody = $('<tbody></tbody>').appendTo(tb);
	
	for(var elm = 0; elm < dict_trade_list.length; elm++){
		var tr=null;
		if(elm%2==0){
			tr = $('<tr></tr>',{class:"odd"}).appendTo(tbody);
		}else{
			tr = $('<tr></tr>',{class:"even"}).appendTo(tbody);
		}
		for(var inElm=0; inElm <= dict_trade_list[elm].length; inElm++){
			if(inElm == dict_trade_list[elm].length){
				var td = $('<td></td>').appendTo(tr);
				
	   			var button = $('<button></button>',{
	   					'id':dict_trade_list[elm][2]+"_dict",
						'name':dict_trade_list[elm][0],
						'value':dict_trade_list[elm][1],
						'text':'删除'
					}).click(dictTrade_clickHandler);
				td.append(button);
				var button = $('<button></button>',{
						'id':dict_trade_list[elm][2]+"_dict",
						'name':dict_trade_list[elm][0],
						'value':dict_trade_list[elm][1],
						'text':'修改'
					}).click(dictTrade_clickHandler);
				td.append(button);
			}else{
				if(inElm == 1){
					$('<td></td>').appendTo(tr).text(getValue_dt_selectList(dict_trade_list[elm][inElm]));
				}else{
					$('<td></td>').appendTo(tr).text(dict_trade_list[elm][inElm]);
				}
				
			}

		}
	}

	show_dictTrade_Page();
}

var show_dictTrade_Page = function(){
	$("#dict_trade_panel").show();
}

var load_dictTrade_info = function(){
	$.ajax({
	    type:"get",
	    url:"/select_userAccount",
	    async:false,
	    dataType:"json",
	    success:function(data,textStatus){
	        
	        if(data.success){
	        	// console.log(data.data);
	        	dict_trade_list = [];
	        	for(var i=0; i<data.data.length; i++){
	        		dict_trade_list.push([data.data[i]["USERID"],data.data[i]["TRADEID"],data.data[i]["ACCOUNTID"]]);
	        	}
	        	append_dict_trade_list();
	        }
	    },
	    beforeSend: function(xhr){
	        xhr.withCredentials = true;
	    }

	});
	// var progressBar = document.getElementById("p"),
	// var client = new XMLHttpRequest();
	// client.open("GET", "select_userAccount");
	// client.setRequestHeader("Content-Type", "text/json;charset=UTF-8");
	// client.onprogress = function(pe) {
	// 	if(pe.lengthComputable) {
	//  		progressBar.max = pe.total
	//  		progressBar.value = pe.loaded
	// 	}
	// }
	// client.onloadend = function(pe) {
	// 	progressBar.value = pe.loaded

	// }
	// client.send()
}

