p2p$.ns('com.test');
p2p$.com.test.TestHttp = CdeBaseClass.extend_({
    init: function() {
    	console.log("..TestHttp.init...");
    },
    load: function() {
    	var url = "http://115.182.11.21/query?streamid=233132zxczxc123&type=20&isp=2";
    	var url2 = "http://g3.letv.cn/vod/v2/MTA2LzEyLzc4L2xldHYtdXRzLzE0L3Zlcl8wMF8yMi0zMTA4NjYzODAtYXZjLTg2ODEyNi1hYWMtNjQwMDAtMjcyODgwMC0zMjA5NjE3NDQtMDUzNjYwNTc0N2Q2M2U1NDJiODdmY2IzZjIyZGUxMWItMTQyNTM3OTcyOTUzNi5tcDQ=?b=940&mmsid=27556118&tm=1425878842&key=3dda8ebdad2c9e861ffc9f860af47748&platid=1&splatid=102&playid=0&tss=ios&vtype=22&cvid=1364804609726&pip=828930bd802cffea4e5afb84a5c3c046&ctv=pc&m3v=1&termid=1&format=1&hwtype=un&ostype=MacOS10.10.2&tag=letv&sign=letv&expect=3&p1=1&p2=10&p3=-&tn=0.4151888438500464&pay=1&uinfo=S2VaaVkVdBIK65SoFfPX6DN3QRJ3DXpnDYkQi2MmWPpUh1EM_6VWLQ==&iscpn=f9051&rateid=1300&key2=XXXX";
    	var xhr = new p2p$.com.webp2p.core.supernode.HttpDownloader(url2,this,"GET");
    	xhr.load();
    },
    success: function(data) {
    	console.log(data);
    }
});