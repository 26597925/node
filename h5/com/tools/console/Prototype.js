if(!document.getElementsByClassName)
{
	document.getElementsByClassName=function(className)
	{
		var doms=document.getElementsByTagName("*");
		var arr=[];
		for(var i=0;i<doms.length;i++)
		{
            var allName = doms[i].className.split(' '); 
            for(var j=0;j<allName.length;j++) {
            	if(allName[j] == className) {
            		arr.push(doms[i]);
            		break;
            	}
            }
		}
        return arr;
	}
}
