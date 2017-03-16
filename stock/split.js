var http = require('http');
var readline = require('readline');  
var fs = require('fs');  
var os = require('os'); 

var ymd = process.argv[2];
var index = process.argv[3];
var fReadName = './lineNum.txt';  
var fRead = fs.createReadStream(fReadName);
var fWriteName = "split.sh";
var fWrite = fs.createWriteStream(fWriteName);

var objReadline = readline.createInterface({  
    input: fRead,
    output: null,   
    terminal: true  
});  

var enableWriteIndex = true;  
fRead.on('end', ()=>{  
    console.log('end'); 
});  
var path = "/letv/mzgit/node/data_all";
//split -l 755 2016-12-01-00.data
objReadline.on('line', (line)=>{ 
    
    columns = line.split(" ");
    columns[1]//2016-12-01-13.data
    fWrite.write("cd "+path+"/data"+parseInt(columns[1].substr(-7,2))+"\n");
    fWrite.write("split -l "+Math.ceil(columns[0]/(676))+" "+columns[1]+"\n");
});  
   
objReadline.on('close', ()=>{  
    console.log('readline close...');  
}); 