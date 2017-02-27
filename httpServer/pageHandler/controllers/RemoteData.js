var http = require('http');
var url  = require('url');
var path = require('path');
var fs = require('fs');
var myself = require('./RemoteData.js');
var fileData_oss = null,fileData_bandwidth = null;

var url_oss= 'http://fid.oss.letv.com/gslb/splatid?format=1';
var url_bandwidth = 'http://10.200.94.212:8081/bw201501192200_result.csv.html';

/*
var platData = [ { "platid": "0", "platname": "未知业务", "splatid": "0", "splatname": "未知", "remark": "" }, 
{ "platid": "1", "platname": "网站类", "splatid": "101", "splatname": "主站", "remark": "高俊" }, 
{ "platid": "1", "platname": "网站类", "splatid": "102", "splatname": "网络院线", "remark": "宋文江" }, 
{ "platid": "1", "platname": "网站类", "splatid": "103", "splatname": "合作站", "remark": "廖生栋" }, 
{ "platid": "1", "platname": "网站类", "splatid": "104", "splatname": "音乐", "remark": "廖生栋" },
{ "platid": "10", "platname": "直播", "splatid": "1001", "splatname": "Letv主站_PC", "remark": "" }, 
{ "platid": "10", "platname": "直播", "splatid": "1002", "splatname": "乐视视频_iPad", "remark": "" }, 
{ "platid": "103", "platname": "内部业务", "splatid": "10313", "splatname": "快网kw", "remark": "" } ];
*/

 function parsePlatData(platData)
 {
	var splatObjList = {};
	var platList = [];
	var platDataObj = JSON.parse(platData); 
	
	for(var elm = 0; elm < platDataObj.length; elm++)
	{
		if(!splatObjList[platDataObj[elm].platid])
		{
			splatObjList[platDataObj[elm].platid]=[];//{name:platDataObj[elm].platname,splat:[]};
			platList.push([platDataObj[elm].platid, platDataObj[elm].platid+platDataObj[elm].platname])
		}
		splatObjList[platDataObj[elm].platid].push([platDataObj[elm].splatid, platDataObj[elm].splatid+platDataObj[elm].splatname]);
	}
	return {platList:platList,splatObjList:splatObjList};
 }

var updateFile = {
	timestamp:0,
	isUpdate:false,
	updateTime:2
};

var getData = function ()
{
	var isGetData = false;
	if( updateFile['timestamp'] == 0 )
	{
		isGetData=true;
		updateFile['timestamp'] = getTimer();
	}else
	{
		var date = new Date();
		if(date.getHours() == updateFile['timestamp'] && !updateFile['isUpdata'] )
		{
			updateFile['isUpdata'] = true;
			isGetData=true;
			console.log("RemoteData update ");
		}else
		{
			if(date.getHours() != updateFile['isUpdata'])
			{
				isUpdata = false;
			}
		}
	}
	
	if(isGetData )
	{
		myself.getHttpRequest(url_oss,function(result){
			if(result.statusCode != -1)
			{
				fileData_oss = result.data;
				console.log("RemoteData inner url_oss success " + url_oss );
			}
		});

		myself.getHttpRequest(url_bandwidth,function(result){
			if(result.statusCode != -1)
			{
				fileData_bandwidth = result.data;
				console.log("RemoteData inner bandwidth success " + url_bandwidth);
			}
		});
	}
};

var getTimer = function()
{
	return (new Date).getTime();
};

exports.getFileData_oss = function(callback)
{
	if(fileData_oss)
	{
		callback(parsePlatData(fileData_oss));
	}else{
		myself.getHttpRequest(url_oss,function(result){
			if(result.statusCode != -1)
			{
				callback(parsePlatData(result.data));
				console.log("RemoteData outer oss success :" + url_oss);
			}else
			{
				callback(null);
				console.log("RemoteData outer oss failure " + url_oss);
			}
		});
	}
};

exports.getFileData_bandwidth = function(callback)
{
	if(fileData_bandwidth)
	{
		callback(fileData_bandwidth)
	}else
	{
		myself.getHttpRequest(url_bandwidth,function(result){
			if(result.statusCode != -1)
			{
				callback(result.data);
				console.log("RemoteData outer bandwidth success " + url_bandwidth);
			}else
			{
				callback(null);
				console.log("RemoteData bandwidth failure " + url_bandwidth);
			}
		});
	}
	
};

exports.init = function()
{
	setInterval(function (){
		getData();
	//},3000);
	},0.5*60*60*1000);
}

exports.getHttpRequest = function(url,callback)
{
	console.log("RemoteData request: " + url);
	http.get(url, function(response) {
		var statusCode = response.statusCode;
		var str = '';
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			str += chunk;
		});
		
		response.on('end', function () {
			callback({statusCode:statusCode,data:str});
		});
	}).on('error', function(e) {
		callback({statusCode:-1,data:e.message});
	});
}

exports.init();
getData();

