p2p$.ns("com.webp2p.core.common");

p2p$.com.webp2p.core.common.Number = {
	max : function(value1, value2) {
		return value1 > value2 ? value1 : value2;
	},

	min : function(value1, value2) {
		return value1 > value2 ? value2 : value1;
	},

	maxUnsignedValue_ : function() {
		return -1 >>> 0;
	},

	convertToBit_ : function(size, data, _array) {
		var __uint8 = null;
		switch (size) {
		case "2":
			__uint8 = new Uint8Array(2);
			__uint8[0] = (parseInt(data) >> 8) & 0xff;
			__uint8[1] = parseInt(data) & 0xff;
			_array.push(__uint8);
			break;
		case "4":
			__uint8 = new Uint8Array(4);
			__uint8[0] = (parseInt(data) >> 24) & 0xff;
			__uint8[1] = (parseInt(data) >> 16) & 0xff;
			__uint8[2] = (parseInt(data) >> 8) & 0xff;
			__uint8[3] = parseInt(data) & 0xff;
			_array.push(__uint8);
			break;
		case "8":
			__uint8 = new Uint8Array(8);
			var data1 = Math.floor(data / 0x100000000);
			__uint8[0] = (data1 >> 24) & 0xff;
			__uint8[1] = (data1 >> 16) & 0xff;
			__uint8[2] = (data1 >> 8) & 0xff;
			__uint8[3] = (data1) & 0xff;
			var data2 = Math.floor(data % 0x100000000);
			__uint8[4] = (data2 >> 24) & 0xff;
			__uint8[5] = (data2 >> 16) & 0xff;
			__uint8[6] = (data2 >> 8) & 0xff;
			__uint8[7] = (data2) & 0xff;
			_array.push(__uint8);
			break;
		case "utf":
			__uint8 = new Uint8Array(data.length);
			for ( var i = 0; i < data.length; i++) {
				__uint8[i] = data.charCodeAt(i);
			}
			_array.push(__uint8);
			break;
		case "d":
			if (data && data.length > 0) {
				_array.push(data);
			}
			break;
		}
	},

	convertToValue_ : function(size, byteArray, position, len) {
		var value1;
		var value2;
		var value3;
		var value4;
		var value = null;
		switch (size) {
		case "2":
			value1 = byteArray[position];
			value2 = byteArray[position + 1];
			value = (value1 << 8) + value2;
			break;
		case "4":
			value1 = byteArray[position];
			value2 = byteArray[position + 1];
			value3 = byteArray[position + 2];
			value4 = byteArray[position + 3];
			value = (value1 * Math.pow(2, 24)) + (value2 << 16) + (value3 << 8) + value4;
			break;
		case "8":
			value1 = byteArray[position];
			value2 = byteArray[position + 1];
			value3 = byteArray[position + 2];
			value4 = byteArray[position + 3];

			var high = (value1 * Math.pow(2, 24)) + (value2 << 16) + (value3 << 8) + value4;
			value1 = byteArray[position + 4];
			value2 = byteArray[position + 5];
			value3 = byteArray[position + 6];
			value4 = byteArray[position + 7];
			var low = (value1 * Math.pow(2, 24)) + (value2 << 16) + (value3 << 8) + value4;
			value = (high * 0x100000000) + low;
			break;
		case "utf":
			var str = "";
			for ( var i = 0; i < len; i++) {
				str += String.fromCharCode(byteArray[position + i]);
			}
			value = str;
			break;
		case "d":
			value = byteArray.subarray(position, position + len);
			break;
		}
		return value;
	}
};