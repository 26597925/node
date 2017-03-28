p2p$.ns("com.p2p.utils");
p2p$.com.webp2p.core.utils.ParseUrl = {
	parseUrlToObj : function(url) {
		var pattern = /^([a-z+\w\+\.\-]+:\/?\/?)?([^\/?#]*)?(\/[^?#]*)?(\?[^#]*)?(\#.*)?/i;

		var result = url.match(pattern);
		if (result != null) {
			// 去掉后缀名
			var objUrl = {};
			objUrl.protocol = result[1];
			objUrl.hostName = result[2];
			objUrl.path = result[3];
			objUrl.query = result[4];
			objUrl.fragment = result[5];

			return objUrl;
		}
		return null;
	},

	getParam : function(url, key) {
		// var reg = new RegExp("\[?&]?"+key+"=(\\w{0,})?", "");
		// var reg = /"\[?&]?"+key+"=(\\w{0,})?"/;
		var reg = new RegExp("\[?&]?" + key + "=(\\w{0,})?");
		var param = "";
		if (reg.test(url)) {
			param = url.match(reg)[1];
		}
		return param;
	},

	replaceParam : function(URL, key, value) {
		// var reg=new RegExp("\[?&]"+key+"=(\\w{0,})?", "");
		var reg = new RegExp("\[?&]" + key + "=(\\w{0,})?");
		var findStr = "";

		if (reg.test(URL)) {
			findStr = URL.match(reg)[0];
		}

		if (URL.indexOf("?") == -1) {
			URL = URL + ("?" + key + "=" + value);
		} else if (findStr.length > 0) {
			URL = URL.replace(findStr, findStr.charAt(0) + key + "=" + value);
		} else if (findStr.length === 0) {
			URL = URL + "&" + key + "=" + value;
		}
		return URL;
	},

	replaceParamAndKey : function(URL, org_key, dest_Key, value) {
		// var reg = new RegExp("\[?&]"+org_key+"=(\\w{0,})?", "");
		var reg = new RegExp("\[?&]" + org_key + "=(\\w{0,})?");
		var findStr = "";

		if (reg.test(URL)) {
			findStr = URL.match(reg)[0];
		}

		if (findStr.length > 0) {
			if (findStr.indexOf("?") >= 0) {
				URL = URL.replace(findStr, "");

				if (URL.indexOf("&") >= 0) {
					URL = URL.replace(URL.charAt(URL.indexOf("&")), "?");
				}
			} else {
				URL = URL.replace(findStr, "");
			}
		}

		URL = this.replaceParam(URL, dest_Key, value);
		return URL;
	}
};

p2p$.com.webp2p.core.utils.CheckSum = {

	step : 47,
	checkSum : function(input) {
		var leng = input.byteLength;
		var bytesAvailable = input.byteLength;
		var sums = [ 0xff, 0xff, 0xff, 0xff ];
		var pos = 0, step = 47;
		if (bytesAvailable >= 188) {
			pos += 4;
			bytesAvailable = leng - pos;
			while (bytesAvailable > step) {
				for (var i = 0; i < sums.length; i++) {
					sums[i] ^= input[pos + i];// this.readByte( input, pos+i );//input.readUnsignedByte();
				}

				pos += step;
				bytesAvailable = leng - pos;
			}
		}
		var result = ((sums[0] << 8) + sums[1]) + ((sums[2] << 8) + sums[3]);
		return (~result & 0xffff);
	}
};
