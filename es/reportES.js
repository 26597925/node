var elasticsearch = require('elasticsearch');
var unit_date = require("./../js_unit/unit_date.js");
var config = require("./../config.js");

var ReportESMD = function() {

	var _root = this;
	_root._count = 0;
	_root.data = {"body":[]};
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
					result_obj.sorttime = line_arr[i][0];
					result_obj.price = line_arr[i][1];
					result_obj.amount = line_arr[i][2];
					result_obj.delegatetype = line_arr[i][3];
					result_obj.integrality = line_arr[i][4];
					result_arr.push(result_obj);
				}else{
					config.es.error("date formate err \n",JSON.stringify(result_obj),"\n 时间  价格 数量 委托类型 完整性");
				}
			}
		}
		return result_arr;
	}

	_root.insertdata = function(param){
		_root.data.body.push({
			_index :"delegatetype",
			_type :"delegatetype"
		})

		_root.data.body.push({
			time:unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss.S")
			,list:_root.parseTableBody(param)});
		// config.es.info(_root.data);
		_root.client.bulk(_root.data, function (err, resp) {
			config.es.error(err, resp);
		});

		_root.data.body = [];
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

module.exports = new ReportESMD();

//test-----------------------------------------------
// var reportES = require("./reportES.js");
// reportES.test2();