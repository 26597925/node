/**
 * Created by zhouma on 2017/5/26.
 */
const captchapng = require('captchapng');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB.js"));

this.letters = [];
this.resultLength = 12;
this.start = 65;
this.end = 91;
this.offend = 81;
for(var i = this.start; i < this.end; i++){
	this.letters.push(String.fromCharCode(i));
}

var self_verify = this;
exports.verifyCode = function(){
	var self = this;
	var result = {'success':true,'data':''};

	var random = parseInt(9*Math.random()+1)*10000+parseInt(10000*Math.random());
	var p = new captchapng(80,20,random); // width,height,numeric captcha
	p.color(0, 0, 0, 0);	// First color: background (red, green, blue, alpha)
	p.color(0, 0, 80, 255); // Second color: paint (red, green, blue, alpha)

	var img = p.getBase64();
	var imgbase64 = new Buffer(img,'base64');

	var res = this.res;
	sessions.setCookieCode(self.req,self.res, self_verify.encode(random));
	res.writeHead(200, {
		'Content-Type': 'image/png'
	});
	res.end(imgbase64);
};



exports.encode = function(random){
	random = String(random);
	var result = [];
	for(var i = 0; i < this.resultLength; i++){
		result.push(this.letters[Math.floor(Math.random()*(this.end-this.start))]);
	}
	var params = [];
	var off = Math.floor( Math.random()*(this.offend-this.start) );
	for(var i = 0; i< random.length;i++){
		params.push(parseInt(random[i]) +i+off);
	}
	params.push(off);
	for(var i = 0; i< params.length;i++){
		result[i*2] = this.letters[params[i]];
	}
	var realResult = '';
	for(var i = 0; i < result.length; i++ ){
		realResult += result[i];
	}

	return realResult;
};

exports.decode = function(param){
	param = String(param);
	if(param.length != 12){
		return '';
	}else{
		var result = [];
		for(var i = 0; i < param.length; i++ ){
			if(i%2==0){
				result.push(param[i]);
			}else{
				continue;
			}
		}

		var l_1 = this.letters.indexOf(result[0]);
		var l_2 = this.letters.indexOf(result[1]);
		var l_3 = this.letters.indexOf(result[2]);
		var l_4 = this.letters.indexOf(result[3]);
		var l_5 = this.letters.indexOf(result[4]);
		var l_6 = this.letters.indexOf(result[5]);

		return ""+
			(l_1-l_6-0)+
			(l_2-l_6-1)+
			(l_3-l_6-2)+
			(l_4-l_6-3)+
			(l_5-l_6-4);
	}
};
