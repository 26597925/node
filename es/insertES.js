var path = require("path");
var elasticsearch = require('elasticsearch');
var unit_date = require(path.join(__dirname,"..","js_unit","unit_date.js"));
var config = require(path.join(__dirname,"..","config.js"));
var unit_string = require(path.join(__dirname,"..","js_unit","unit_string.js"));


var insertES_delegateType = function() {
	var _root = this;
	_root.offsetday = 0;
	_root.debug = false;
	_root.debug2 = false;
	_root._count = 0;
	_root.insertCallBack = null;
	_root.data = {"body":[]};
	

	_root.init=function(){
		
	}

	_root.insertTime = function(){
		var date = new Date();
		date.setDate(date.getDate()-_root.offsetday);
		var yMd =unit_date.Format(date,"yyyy-MM-dd");
		return yMd;
	}

	_root.client = new elasticsearch.Client({
		hosts : [ '10.127.92.39:9200', '10.127.92.40:9200', '10.127.92.41:9200' ]
	});

	//时间  价格 数量 委托类型 完整性
	_root.parseTableBody = function(param){

		var line_arr = param.split("\n");
		var field_arr = [];
		var result_obj = {};
		var result_arr=[]
		
		for(var i = 0; i < line_arr.length; i++){
			if(line_arr[i].length>0){
				field_arr = line_arr[i].split("\t");
				if(field_arr.length == 5){
					result_obj.sorttime = field_arr[0];
					result_obj.price = field_arr[1];
					result_obj.amount = field_arr[2];
					result_obj.delegatetype = field_arr[3];
					result_obj.integrality = unit_string.trim(field_arr[4]);
					result_arr.push(result_obj);
				}else{
					config.es.error("date formate err \n",JSON.stringify(result_obj),"\n 时间  价格 数量 委托类型 完整性");
				}
			}
		}
		
		return result_arr;
	}
	_root.getSuffixName = function(){
		var date = new Date();
		date.setDate(date.getDate()-_root.offsetday);
		var yMd =unit_date.Format(date,"yyyy-MM-dd");
		var yMdArr = yMd.split("-");

		var yy = yMdArr[0];
		var MM = yMdArr[1];
		var dd = yMdArr[2];
		
		if(Math.ceil(dd/10)== 1){
			return yy+"_"+MM+"_pre";
		}else if(Math.ceil(dd/10 )== 2){
			return yy+"_"+MM+"_mid";
		}else{
			return yy+"_"+MM+"_suf";
		}
	}
	_root.insertdata = function(param,param2,callback){
		_root.insertCallBack = callback;
		
		var parseBady = _root.parseTableBody(param)
		
		if(result_arr.length==0){
			_root.data.body = [];
			_root.insertCallBack();
			
		}else{

			_root.data.body.push({
				"index":{
					_index: "delegatetype"+_root.getSuffixName(),
					_type: _root.insertTime(),
					_id: param2
				}
			})
			
			_root.data.body.push({
					inserttime:unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss.S"),
					list:parseBady
				}
			);
			// debugger;
			// console.log(path.basename(__filename),JSON.stringify(_root.data).substring(0,300));

			_root.client.bulk(_root.data, function (err, resp) {
				
				if(err){
					config.es.error(">>>",JSON.stringify(err).substring(0,300));
				}
				
				_root.data.body = [];
				_root.insertCallBack();
			});
		}
	}

	_root.test=function(){		
		// // ==>>DEPRECATE======
		_root.client.index({
			index : "mz_test_index",
			type : "mz_test_type",
			body : {aa:"aa",bb:"bb"}
		}, function(error, response) {
			console.log(error,response);
		});
	}

	_root.test2=function(){
		config.es.error("date formate err \n",JSON.stringify({aa:0,bb:1}));
		config.es.info("test2")
		var str = "21598	2756	10	0	1\n21597	2755	1	0	1\n21597	2755	1	0	1\n";
		// console.log(_root.parseTableBody(str));
		// config.es.info(_root.insertdata(str));
	}
}



exports.insertES_delegateType = new insertES_delegateType();
// exports.insertES_stock = new insertES_stock();