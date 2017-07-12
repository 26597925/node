var unit_date = function()
{
	this.Format = function(_date,fmt) { // author: meizz
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
	};

	this.matchYMD = function(myd,type){
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
		if(!myd){
			return false;
		}

		if( !(String(myd).match(reg)) ){
			return false;
		}else{
			return true;
		}
	};
	this.getID = function makeid(digit)
	{
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < digit; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	};
	this.sortTime = function(date_str){
		var _date = new Date("1970-1-1 0:0:0");
		var _date2;
		if(date_str){
			_date2 = new Date(date_str);
		}
		return _date2.getTime() - _date.getTime();
	};

	this.toNumber = function(date_str){
		// date_str = "1:1:1";
		date_str = date_str.trim();
		date_str = date_str.split(":");
		date_str = parseInt(date_str[0])*60*60+parseInt(date_str[1])*60+parseInt(date_str[2]);
		return date_str;
	};

    this.string2int = function(val){
	    return parseInt(val) || 0;
    };

    this.string2num = function(val){
	    return Number(val) || 0 ;
    };

    this.string2_ = function(val){
    	if(String(val).toUpperCase() == "NULL"){
		    val = "";
			}
			if(String(val).toLowerCase() == 'undefined'){
				val = "";
			}
	    return String(val) || "" ;
    };

    this.objToNumber = function(_obj){

	    var obj = {hh:0,mm:0,ss:0};
	    obj = _obj;
	    if(obj!=null){
		    return parseInt(obj['hh'])*60*60+parseInt(obj['mm'])*60+parseInt(obj['ss']);
	    }else{
		    return {hh:0,mm:0,ss:0};
			}
    };

	this.toHMS = function(){
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
	};
	
	this.getTime = function(){
		return new Date();//this.Format(new Date(),"yyyy-MM-dd HH:mm:ss.S");
	};
	
	this.test=function()
	{
		var status = ["TP","PQ","KJ","PZ","ZJ","LT","SJ","PH","WX"];
		// console.log(status.indexOf("PH"));
		// var _d = new Date("2016-2-12 2:4:45");
		// console.log(this.Format(_d,"yyyy-MM-dd HH:mm:ss.S"));
		// var _d = new Date();
		// console.log(this.Format(_d,"yyyy-MM-dd HH:mm:ss.S"));
		// console.log(this.sortTime("2016-2-12 2:4:45"));
		// console.log(">>>",JSON.stringify({aa:0,bb:1}).substring(0,200));
	};

	// this.test();
	
};
module.exports = new unit_date();
//test-----------------------------------------------
// var unit_date = require("./unit_date.js");
// unit_date.test();
