var util = require('util');
var http = require('http');
var readline = require('readline');  
var fs = require('fs');  
var os = require('os'); 

var fReadName1 = 'other.txt'; 
var fReadName2 = 'telecom.txt'; 
var fReadName3 = 'unicom.txt'; 

var fWriteName = 'emerge.txt';

var fRead1 = fs.createReadStream(fReadName1); 
var fRead2 = fs.createReadStream(fReadName2); 
var fRead3 = fs.createReadStream(fReadName3); 

var fWrite = fs.createWriteStream(fWriteName);  
 
 
var objReadline1 = readline.createInterface({  
    input: fRead1,  
    output: null
}); 
 
var objReadline2 = readline.createInterface({  
    input: fRead2,  
    output: null
}); 

var objReadline3 = readline.createInterface({  
    input: fRead3,  
    output: null
});

var otherObj = {}
var linearr1 = []
objReadline1.on('line', (line)=>{ 
	line = line.replace(/\ /g,"");
	linearr1 = line.split(",");
	otherObj[linearr1[2].trim()] = [linearr1[0].trim(),linearr1[1].trim()];
});  
var telecom = {}
var linearr2 = []
objReadline2.on('line', (line)=>{ 
	line = line.replace(/\ /g,"");
	linearr2 = line.split(",");
	telecom[linearr2[2]] = [linearr2[0],linearr2[1]];
}); 
var unicom = {}
var linearr3 = []
objReadline3.on('line', (line)=>{ 
	line = line.replace(/\ /g,"");
	linearr3 = line.split(",");
	unicom[linearr3[2]] = [linearr3[0],linearr3[1]];
}); 


objReadline1.on('close', ()=>{  
    console.log('readline close...');  
    countResult()
});  

objReadline2.on('close', ()=>{  
    console.log('readline close...');  
     countResult()
});  

objReadline3.on('close', ()=>{  
    console.log('readline close...'); 
     countResult() 
});  

var index = 0;
var countResult = function(){
	index++;
	if(index>=3){
		var day = '';
		var tm = '';
		var pre = ''
		var cdn = 0;
		var p2p = 0;
		var tmp = 1024 * 1024 * 1024;
		var total = 0;
		var share = 0;
		for(var i = 1 ;i<=30;i++){
			for(var j = 0; j <= 23; j++){
				if(i<10){
					day = "0"+i
				}else{
					day = ""+i
				}
				if(j<10){
					tm = "0"+j
				}else{
					tm = ""+j
				}
				
				pre = "201609"+day+tm;
				cdn = (
						findNum(otherObj,pre,0)+
						findNum(telecom,pre,0)+
						findNum(unicom,pre,0)
					)/tmp*8;
				p2p = (	
						findNum(otherObj,pre,1)+
						findNum(telecom,pre,1)+
						findNum(unicom,pre,1)
					)/tmp*8;
				total = cdn+p2p
				share = cdn/total
				fWrite.write(
					pre
					+","
					+cdn
					+","
					+p2p
					+","
					+total
					+","
					+share
					+"\n"
				)
				
			}
		}
	}
}
var findNum = function(obj,pre,id){
	if(obj 
		&& 
		obj[pre] 
	){
		return parseFloat(obj[pre][id]);
	}
	return 0;
}