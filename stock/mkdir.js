const fs = require("fs");
var type = "wc"
var date = "2016-12-01"

// var cws =  fs.createWriteStream("wc.sh");
// if(type == "mk"){
// 	cws =  fs.createWriteStream("mk.sh");	
// }
// if(type == "wget"){
// 	cws =  fs.createWriteStream("wget.sh");
// }
// if(type == "wc"){
// 	cws =  fs.createWriteStream("wc.sh");
// }
// var path = "/letv/mzgit/node/data_all";
// if(type == "mk"){
// 	cws.write("mkdir -p ");
// }

// for(var i=0;i<=47;i++){
// 	if(type == "mk"){
// 		cws.write(" data_all/data"+(i<=9?"0"+i:i));
// 	}
// 	if(type == "wget"){
// 		cws.write("cd "+path+"/data"+(i<=9?"0"+i:i)+" \n");
// 		cws.write("wget  \"http://10.130.211.60:8001/stock_data/"+date+"-"+(i<=9?"0"+i:i)+".data\"\n");
// 	}
// 	if(type == "wc"){
// 		cws.write("cd "+path+"/data"+(i<=9?"0"+i:i)+" \n");
// 		cws.write("wc -l \""+date+"-"+(i<=9?"0"+i:i)+".data\"\n");
// 	}
// }

// var sh_node_all =  fs.createWriteStream("sh_node_all.sh");
// for(var i = 0; i<=47; i++){
// 	sh_node_all.write("node readline.js  "+date+" "+i+"\n");
// }

var mergefile =  fs.createWriteStream("mergefile.sh");

mergefile.write("cat ");
for(var i = 0; i<=47; i++){
	mergefile.write(" nodeshell"+(i<=9?"0"+i:i)+".sh");
}
mergefile.write("> allNodeShell.sh");