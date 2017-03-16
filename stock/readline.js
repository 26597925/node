var http = require('http');
var readline = require('readline');  
var fs = require('fs');  
var os = require('os'); 

var ymd = process.argv[2];
var index = process.argv[3];
var fReadName = './nodeshell_basic.sh';  
var fRead = fs.createReadStream(fReadName);
var fWriteName = "nodeshell"+(index<=9?"0"+index:index)+".sh";
var fWrite = fs.createWriteStream(fWriteName);

var objReadline = readline.createInterface({  
    input: fRead,  
    output: null,   
    terminal: true  
});

var enableWriteIndex = true;  
fRead.on('end', ()=>{  
    console.log('end');  
    enableWriteIndex = false;  
});  
var lastchar = "";
var iwant = "\"";

objReadline.on('line', (line)=>{ 
    // lastchar = line.charAt(line.length-1);
    line = line.replace(/\"/g,"");
	fWrite.write("node readlocal_param.js ./data_all/data"+index+"/"+line+" "+ymd+" "+ymd+"-"+(index<=9?"0"+index:index)+"\n");
});  

objReadline.on('close', ()=>{  
    console.log('readline close...');  
});  




