var path = require("path");
var elasticsearch = require('elasticsearch');
var unit_date = require(path.join(__dirname,"..","js_unit","unit_date.js"));
var config = require(path.join(__dirname,"..","config.js"));
var unit_string = require(path.join(__dirname,"..","js_unit","unit_string.js"));
var main_readline = require(path.join(__dirname,"..","main_readline"));
var insertES_stock = function() {

	var _self = this;
	_self.offsetday = 0;
	_self._count = 0;
	_self.data = {"body":[]};

	_self.init=function(){
	}

	_self.filedTitle = [];
	_self.insertTime = function(){
		var date = new Date();
		date.setDate(date.getDate()-_self.offsetday);
		var yMd =unit_date.Format(date,"yyyy-MM-dd");
		return yMd;
	}

	_self.client = new elasticsearch.Client({
		hosts : [ '10.127.92.39:9200', '10.127.92.40:9200', '10.127.92.41:9200' ]
	});

	//2cn_sz002747=埃斯顿,09:07:54,2017-02-28,41.340,0.000,0.000,0.000,0.000,TP,0,0,0.000,0,0.000,0,0.000,0,0,0.000,0,0,0.000,0,0,0,0,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0,0,0,0,0,0,0,0,0,0,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0,0,0,0,0,0,0,0,0,0
	_self.parseTableBody = function(param){

		param = param.trim();
		var field_arr = [];
		var result_obj = {};
		var status = ["TP","PQ","KJ","PZ","ZJ","LT","SJ","PH","WX"];
		field_arr = param.split(",");
		
		if(field_arr.length == 66){
		//2cn_sz002747=埃斯顿
		//2cn_sh（market,2cn_sh用0，表示，2cn_sz,用1表示）
			if(field_arr[0].indexOf("2cn_sz")>=0){
				result_obj.market=0;
			}else if(field_arr[0].indexOf("2cn_sh")>=0){
				result_obj.market=1;
			}else{
				result_obj.market=2;
			}

			result_obj.index=field_arr[0].substr(6,6);
			result_obj.name=field_arr[0].substr(12).replace("=","");
			result_obj.secs=unit_date.toNumber(field_arr[1]);
			result_obj.day=field_arr[2];
			result_obj.preClose=field_arr[3];
			result_obj.open=	field_arr[4];
			result_obj.high=	field_arr[5];
			result_obj.low=	field_arr[6];
			result_obj.close=	field_arr[7];
		//PH,状态(不同状态用不同数字表示，TP(0), PQ(1), KJ(2), PZ(3), ZJ(4), LT(5), SJ(6), PH(7),WX(8)，出现其他用9表示按照顺序用数字表示）(status)
			result_obj.status=	status.indexOf(field_arr[8]);
			result_obj.bi=	field_arr[9];
			result_obj.mount=	field_arr[10];
			result_obj.sum=	field_arr[11];
			result_obj.totalBuy=	field_arr[12];
			result_obj.buyAve=	field_arr[13];
			result_obj.totalSell=	field_arr[14];
			result_obj.sellAve=	field_arr[15];
			result_obj.unkonw1=	field_arr[16];
			result_obj.unkown2=	field_arr[17];
			result_obj.unkown3=	field_arr[18];
			result_obj.unkown4=	field_arr[19];
			result_obj.unkown5=	field_arr[20];
			result_obj.unkown6=	field_arr[21];
			result_obj.unkown7=	field_arr[22];
			result_obj.unkown8=	field_arr[23];
			result_obj.buyQueueCnt=	field_arr[24];
			result_obj.sellQueueCnt=	field_arr[25];
			result_obj.buyPrice1=	field_arr[26];
			result_obj.buyPrice2=	field_arr[27];
			result_obj.buyPrice3=	field_arr[28];
			result_obj.buyPrice4=	field_arr[29];
			result_obj.buyPrice5=	field_arr[30];
			result_obj.buyPrice6=	field_arr[31];
			result_obj.buyPrice7=	field_arr[32];
			result_obj.buyPrice8=	field_arr[33];
			result_obj.buyPrice9=	field_arr[34];
			result_obj.buyPrice10=	field_arr[35];
			result_obj.buyMount1=	field_arr[36];
			result_obj.buyMount2=	field_arr[37];
			result_obj.buyMount3=	field_arr[38];
			result_obj.buyMount4=	field_arr[39];
			result_obj.buyMount5=	field_arr[40];
			result_obj.buyMount6=	field_arr[41];
			result_obj.buyMount7=	field_arr[42];
			result_obj.buyMount8=	field_arr[43];
			result_obj.buyMount9=	field_arr[44];
			result_obj.buyMount10=	field_arr[45];
			result_obj.sellPrice1=	field_arr[46];
			result_obj.sellPrice2=	field_arr[47];
			result_obj.sellPrice3=	field_arr[48];
			result_obj.sellPrice4=	field_arr[49];
			result_obj.sellPrice5=	field_arr[50];
			result_obj.sellPrice6=	field_arr[51];
			result_obj.sellPrice7=	field_arr[52];
			result_obj.sellPrice8=	field_arr[53];
			result_obj.sellPrice9=	field_arr[54];
			result_obj.sellPrice10=	field_arr[55];
			result_obj.sellMount1=	field_arr[56];
			result_obj.sellMount2=	field_arr[57];
			result_obj.sellMount3=	field_arr[58];
			result_obj.sellMount4=	field_arr[59];
			result_obj.sellMount5=	field_arr[60];
			result_obj.sellMount6=	field_arr[61];
			result_obj.sellMount7=	field_arr[62];
			result_obj.sellMount8=	field_arr[63];
			result_obj.sellMount9=	field_arr[64];
			result_obj.sellMount10=	field_arr[65];
			
		}else{
			config.es.error("date formate err \n",JSON.stringify(result_obj),"\n market index name");
			return null;
		}
			
		return result_obj;
	}

	_self.getSuffixName = function(param2){
		var date = new Date(param2+" 00:00:00");
		// date.setDate(date.getDate()-_self.offsetday);
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
	//2016-11-10-00.data
	//2016-11-10-01.data
	//2016-11-10-02.data
	_self.insertdata = function(param,param2){
		// param2 = param2.replace(".","_");
		// param2 = param2.replace("-","_");
		
		var body = _self.parseTableBody(param);
		if(!body){
			_self.data.body.push({
				"index":{
					_index: "stock"+_self.getSuffixName(param2)
					,_type: param2
					// ,_id: _self.filteSpecialCharacter(param2)
				}
			})
			
			_self.data.body.push({
					inserttime:unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss.S"),
					list:body
				}
			);
			
			// _self._count++
			// if(_self._count >= 10){
			// 	_self._count = 0;
				// console.log(path.basename(__filename),JSON.stringify(_self.data).substring(0,300));

				_self.client.bulk(_self.data, function (err, resp) {
					main_readline.main.esindex++;
					main_readline.main.insertdataOk();
					
					if(err){
						config.es.error(">>>",JSON.stringify(err).substring(0,300));
					}
					
				});
				
				_self.data.body = [];
			// }
		}else{
			main_readline.main.esindex++;
			main_readline.main.insertdataOk();
			
					
		}
		
	}
	
	_self.filteSpecialCharacter = function(str){
		str = str.replace(/\./g,"_");
		str = str.replace(/\-/g,"_");
		return str;
	}

	_self.test = function(){
		var record = "2cn_sz002747=埃斯顿,09:07:54,2017-02-28,41.340,0.000,0.000,0.000,0.000,TP,0,0,0.000,0,0.000,0,0.000,0,0,0.000,0,0,0.000,0,0,0,0,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0,0,0,0,0,0,0,0,0,0,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0,0,0,0,0,0,0,0,0,0"
		record = "2cn_sh600018=上港集团,09:08:06,2017-03-01,5.910,0.000,0.000,0.000,0.000,PQ,0,0,0.000,0,0.000,0,0.000,0,0,0.000,0,0,0.000,0,0,0,0,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0,0,0,0,0,0,0,0,0,0,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0,0,0,0,0,0,0,0,0,0"
		console.log(JSON.stringify(_self.parseTableBody(record)));
	}
	// _self.test();
}

exports.insertES_stock = new insertES_stock();
/**
//2cn_sh（market,2cn_sh用0，表示，2cn_sz,用1表示）
2cn_sh（market,2cn_sh用1，表示，2cn_sz,用0表示）
600082(index,股票代码)
=海泰发展（name）
15:05:11(secs, 计算公式是hour * 60 * 60 + min*60 + sec，假定时间是12:10:04,则secs=12 * 60 * 60 + 10 * 60 + 4 = 43804)
,
2017-02-23,(day)
8.070 昨日收盘价(preClose)
,8.040 今日开盘价(open)
,8.090,最高价(high)
7.920,最低价(low)
7.950,收盘价(close)
PH,状态(不同状态用不同数字表示，TP(0), PQ(1), KJ(2), PZ(3), ZJ(4), LT(5), SJ(6), PH(7),WX(8)，出现其他用9表示按照顺序用数字表示）(status)
3708,总笔(bi)
10138752,成交总量(mount)
81089539.250,成交额(sum) 
1517200,总买(totalBuy) 
7.755,买均(buyAve)
3796331,总卖(totalSell)
8.378,卖均(sellAve)
770,未知1(unkonw1)
3636848,未知2(unkown2)
28572629.450,未知3(unkown3)
711,未知4(unkown4)
4026005,未知5(unkown5)
32667459.620,未知6(unkown6) 
417,未知7(unkown7)
780,未知8(unkown8)
10,(买入队列长度,buyQueueCnt)
10,(卖出队列长度，sellQueueCnt)
7.950,买一(buyPrice1) 
7.940,买二(buyPrice2)
7.930,买三((buyPrice3))
7.920,买四((buyPrice4))
7.910,买五((buyPrice5))
7.900,买六(buyPrice6)
7.890,买七(buyPrice7)
7.880,买八(buyPrice8) 
7.870,买九(buyPrice9)
7.860,买十(buyPrice10)
13800,买一量(buyMount1)
29000,买二量(buyMount2)
74200,买三量(buyMount3)
108400,买四量(buyMount4)
96100,买五量(buyMount5)
223600,买六量(buyMount6)
74300,买七量(buyMount7)
109100,买八量(buyMount8)
18900,买九量(buyMount9)
23100,买十量(buyMount10)
7.960,卖一(sellPrice1) 
7.970,卖二(sellPrice2)
7.980,卖三(sellPrice3)
7.990,卖四(sellPrice4)
8.000,卖五(sellPrice5)
8.010,卖六(sellPrice6) 
8.020,卖七(sellPrice7) 
8.030,卖八(sellPrice8)
8.040,卖九(sellPrice9)
8.050,卖十(sellPrice10)
175100,卖一量(sellMount1)
8000,卖二量(sellMount2) 
72100,卖三量(sellMount3)
37800,卖四量(sellMount4)
57900,卖五量(sellMount5)
33300,卖六量(sellMount6)
24500,卖七量(sellMount7)
28800,卖八量(sellMount8) 
64700,卖九量(sellMount9)
51300,卖十量(sellMount10)
*/