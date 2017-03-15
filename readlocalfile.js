var path = require("path");
var schedule = require("node-schedule");
var config = require(path.join(__dirname,"config.js"));
var insertES = require(path.join(__dirname,"es","insertES_readline.js"));
var unit_date = require(path.join(__dirname,"js_unit","unit_date.js"));

var main = function(){
	var _self = this;
	_self.offsetday = 0; // start 2016-09-01 2017-03-12
	_self.subOffday = 0;  // 0-47
	_self.date = new  Date("2016-12-01 00:00:00");
	_self.date2 = new Date("2017-03-12 00:00:00");
	_self.data = {"body":[]};
	_self.alph = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
	_self.fileName = [];
	_self.index = 0;
	_self.pre = "";

	_self.addNewdate = function(){
		var pre = unit_date.Format(_self.date,"yyyy-MM-dd");
		if(_self.subOffday<48){
			pre = pre
				+"-"
				+(_self.subOffday<=9?("0"+_self.subOffday):_self.subOffday);
		}
		
		_self.subOffday++;
		if(_self.subOffday == 49){
			_self.subOffday = 0;
			_self.offsetday++;
			_self.date.setDate(_self.date.getDate()+1);
		}

		if(_self.date.getTime() - _self.date2.getTime()>0){
			return null;
		}

		return "http://10.130.211.60:8001/stock_data/"+pre+".data";
	}
	
	_self.createFileName = function(){
		for(var i=0;i<_self.alph.length;i++){
			for(var j=0; j<_self.alph.length;j++){
				_self.fileName.push("x"+_self.alph[i]+_self.alph[j]);
			}
		}
	}

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

	_self.getSuffixName = function(){
		// var date = new Date(param2+" 00:00:00");
		// date.setDate(date.getDate()-_self.offsetday);
		var yMd =unit_date.Format(_self.date,"yyyy-MM-dd");
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


	_self.readFile = function(){
		
		var fReadName = "./data/"+_self.fileName[_self.index]; 
		console.log(fReadName);
		var fRead = fs.createReadStream(fReadName);
		
		var objReadline = readline.createInterface({
		    input: fRead,
		    output: null,
		    terminal: true
		});

		objReadline.on('line', (line)=>{ 
			_self.generateBulk(line);
		});

		objReadline.on('close', ()=>{
		    console.log('readline close...');
		    _self.insertes();
		});
	}

	_self.generateBulk = function(param){
		var body = _self.parseTableBody(param);
		if(body){
			_self.data.body.push({
				"index":{
					_index: "stock"+_self.getSuffixName()
					,_type: _self.pre
					// ,_id: _self.filteSpecialCharacter(param2)
				}
			})
			
			_self.data.body.push({
					inserttime:unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss.S")
					,list:body
				}
			);
		}
	}

	_self.insertes = function(){
		_self.client.bulk(_self.data, function (err, resp) {
			_self.insertdataOk();
			_self.data.body = [];
			if(err){
				config.es.error(">>>",JSON.stringify(err).substring(0,300));
			}
		});
	}

	_self.isFirst = true;

	_self.insertdataOk=function(){
		if(_self.isFirst){
			_self.isFirst = false;
		}else{
			_self.index++;
		}
		_self.readFile();
	}
}

var mainobj = exports.main = new main();
mainobj.addNewdate();
mainobj.main.pre = "2016-12-01-00"
mainobj._self.insertdataOk();




///==================================================

// var rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = [0, new schedule.Range(1, 6)];
// rule.hour = 0;
// rule.minute = 0;

// var j = schedule.scheduleJob(rule, function(){
// 	console.log(">>>");
// });