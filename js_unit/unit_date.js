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
	}

	this.test=function()
	{
		var _d = new Date("2016-2-12 2:4:45");
		console.log(this.Format(_d,"yyyy-MM-dd HH:mm:ss.S"));
		var _d = new Date();
		console.log(this.Format(_d,"yyyy-MM-dd HH:mm:ss.S"));
	}
	
}
module.exports = new unit_date();
//test-----------------------------------------------
// var unit_date = require("./unit_date.js");
// unit_date.test();
