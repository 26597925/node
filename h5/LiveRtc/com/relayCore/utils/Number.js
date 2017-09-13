rc$.ns("com.relayCore.utils");

rc$.com.relayCore.utils.Number = {
	max : function(_value1, _value2) {
		return _value1 > _value2 ? _value1 : _value2;
	},

	min : function(_value1, _value2) {
		return _value1 > _value2 ? _value2 : _value1;
	},

	maxUnsignedValue_ : function() {
		return -1 >>> 0;
	},

	convertToBit_ : function(_size, _data, _array) {
		var __uint8 = null;
		switch (_size) {
		case "1":
			__uint8 = new Uint8Array(1);
			__uint8[0] = parseInt(_data) & 0xff;
			_array.push(__uint8);
			break;
		case "2":
			__uint8 = new Uint8Array(2);
			__uint8[0] = (parseInt(_data) >> 8) & 0xff;
			__uint8[1] = parseInt(_data) & 0xff;
			_array.push(__uint8);
			break;
		case "3":
			__uint8 = new Uint8Array(3);
			__uint8[0] = (parseInt(_data) >> 16) & 0xff;
			__uint8[1] = (parseInt(_data) >> 8) & 0xff;
			__uint8[2] = parseInt(_data) & 0xff;
			_array.push(__uint8);
			break;
		case "4":
			__uint8 = new Uint8Array(4);
			__uint8[0] = (parseInt(_data) >> 24) & 0xff;
			__uint8[1] = (parseInt(_data) >> 16) & 0xff;
			__uint8[2] = (parseInt(_data) >> 8) & 0xff;
			__uint8[3] = parseInt(_data) & 0xff;
			_array.push(__uint8);
			break;
		case "8":
			__uint8 = new Uint8Array(8);
			var data1 = Math.floor(_data / 0x100000000);
			__uint8[0] = (data1 >> 24) & 0xff;
			__uint8[1] = (data1 >> 16) & 0xff;
			__uint8[2] = (data1 >> 8) & 0xff;
			__uint8[3] = (data1) & 0xff;
			var data2 = Math.floor(_data % 0x100000000);
			__uint8[4] = (data2 >> 24) & 0xff;
			__uint8[5] = (data2 >> 16) & 0xff;
			__uint8[6] = (data2 >> 8) & 0xff;
			__uint8[7] = (data2) & 0xff;
			_array.push(__uint8);
			break;
		case "utf":
			__uint8 = new Uint8Array(_data.length);
			for ( var i = 0; i < _data.length; i++) {
				__uint8[i] = _data.charCodeAt(i);
			}
			_array.push(__uint8);
			break;
		case "d":
			if (_data && _data.length > 0) {
				_array.push(_data);
			}
			break;
		}
	},

	convertToValue_ : function(_size, _byteArray, _position, _len) {
		var value1_;
		var value2_;
		var value3_;
		var value4_;
		var value_ = null;
		switch (_size) {
		case "1":
			value_ = _byteArray[_position];
			break;
		case "2":
			value1_ = _byteArray[_position];
			value2_ = _byteArray[_position + 1];
			value_ = (value1_ << 8) + value2_;
			break;
		case "3":
			value1_ = _byteArray[_position];
			value2_ = _byteArray[_position + 1];
			value3_ = _byteArray[_position + 2];
			value_ = (value1_ << 16) + (value1_ << 8) + value2_;
		case "4":
			value1_ = _byteArray[_position];
			value2_ = _byteArray[_position + 1];
			value3_ = _byteArray[_position + 2];
			value4_ = _byteArray[_position + 3];
			value_ = (value1_ * Math.pow(2, 24)) + (value2_ << 16) + (value3_ << 8) + value4_;
			break;
		case "8":
			value1_ = _byteArray[_position];
			value2_ = _byteArray[_position + 1];
			value3_ = _byteArray[_position + 2];
			value4_ = _byteArray[_position + 3];

			var high = (value1_ * Math.pow(2, 24)) + (value2_ << 16) + (value3_ << 8) + value4_;
			value1_ = _byteArray[_position + 4];
			value2_ = _byteArray[_position + 5];
			value3_ = _byteArray[_position + 6];
			value4_ = _byteArray[_position + 7];
			var low_ = (value1_ * Math.pow(2, 24)) + (value2_ << 16) + (value3_ << 8) + value4_;
			value_ = (high * 0x100000000) + low;
			break;
		case "utf":
			var str_ = "";
			for ( var i = 0; i < _len; i++) {
				str_ += String.fromCharCode(_byteArray[_position + i]);
			}
			value_ = str_;
			break;
		case "d":
			value_ = _byteArray.subarray(_position, _position + _len);
			break;
		}
		return value_;
	}
};
