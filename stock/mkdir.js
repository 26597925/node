const fs = require("fs");
var type = "mk"
var date = "2016-12-02"
//建立文件夹，并下载数据
var cws =  fs.createWriteStream("wc.sh");
if(type == "mk"){
	cws =  fs.createWriteStream("mk.sh");	
}
if(type == "wget"){
	cws =  fs.createWriteStream("wget.sh");
}
if(type == "wc"){
	cws =  fs.createWriteStream("wc.sh");
}
var path = "/letv/mzgit/node/data_all/"+date;
if(type == "mk"){
	cws.write("mkdir -p ");
}

for(var i=0;i<=47;i++){
	if(type == "mk"){
		cws.write(" data_all/"+date+"/data"+(i<=9?"0"+i:i));
	}
	if(type == "wget"){
		cws.write("cd "+path+"/data"+(i<=9?"0"+i:i)+" \n");
		cws.write("wget  \"http://10.130.211.60:8001/stock_data/"+date+"-"+(i<=9?"0"+i:i)+".data\"\n");
	}
	if(type == "wc"){
		cws.write("cd "+path+"/data"+(i<=9?"0"+i:i)+" \n");
		cws.write("wc -l \""+date+"-"+(i<=9?"0"+i:i)+".data\"\n");
	}
}

// var sh_node_all =  fs.createWriteStream("sh_node_all.sh");
// for(var i = 0; i<=47; i++){
// 	sh_node_all.write("node readline.js  "+date+" "+i+"\n");
// }

//合并所有要下载的数据
// var mergefile =  fs.createWriteStream("mergefile.sh");

// mergefile.write("cat ");
// for(var i = 0; i<=47; i++){
// 	mergefile.write(" nodeshell"+(i<=9?"0"+i:i)+".sh");
// }
// mergefile.write("> allNodeShell.sh");


// _self.alph = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];	
// _self.addNewdate = function(){
	// 	var pre = unit_date.Format(_self.date,"yyyy-MM-dd");
	// 	if(_self.subOffday<48){
	// 		pre = pre
	// 			+"-"
	// 			+(_self.subOffday<=9?("0"+_self.subOffday):_self.subOffday);
	// 	}
		
	// 	_self.subOffday++;
	// 	if(_self.subOffday == 49){
	// 		_self.subOffday = 0;
	// 		_self.offsetday++;
	// 		_self.date.setDate(_self.date.getDate()+1);
	// 	}

	// 	return "http://10.130.211.60:8001/stock_data/"+pre+".data";
	// }
	
	// _self.createFileName = function(){
	// 	for(var i=0;i<_self.alph.length;i++){
	// 		for(var j=0; j<_self.alph.length;j++){
	// 			_self.fileName.push("x"+_self.alph[i]+_self.alph[j]);
	// 		}
	// 	}
	// }