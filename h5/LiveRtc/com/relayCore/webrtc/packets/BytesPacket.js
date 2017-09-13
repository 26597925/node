rc$.ns("com.relayCore.webrtc.packets");
rc$.com.relayCore.webrtc.packets.BytesPacket = {
	// encode
	ext_:{
		C:0,
		H:0,
		K:0,
		M:16,
		N:0,
		P:16,
		Q:0,
		R:0,
		T:0,
		k:0
	},
	encode_ : function(_message) {
		var type_ = this.selectType_(_message.type);
		var packet_;
		if(type_ == "stream")
		{
			packet_ = this.streamEncode_(_message);
		}
		if(type_ == "meta")
		{
			packet_ = this.metaEncode_(_message);
		}
		return packet_;
	},
	decode_:function(_message)
	{
		var bytes_ = new Uint8Array(_message);
		var type_ = rc$.com.relayCore.utils.Number.convertToValue_('1', bytes_,0);
		var dataType_ = this.selectType_(type_);
		var obj_={type:dataType_};
		switch(dataType_)
		{
		case "stream":
			obj_.data = this.streamDecode_(bytes_);
			break;
		case "meta":
			obj_.data = this.metaDecode_(bytes_);
			break;
		default:
			break;
		}
		return obj_;
	},
	selectType_:function(_type)
	{
		var str_ = "未知";
		switch(_type)
		{
		case 72://H 媒体流数据包
		case 75://K Ping包
		case 107://k Ping的响应
		case 67://C 
		case 78://N
		case 80://P
		case 81://Q
		case 84://T
		case 85://U 媒体状态数据
		case 77://M 媒体流元数据包，包含校验哈希值
		case 82://R 媒体所在频道元数据
			str_ = "stream";
			break;
		default:
			str_ = "meta";
			break;
		}
		return str_;
	},
	streamEncode_:function(_message)
	{
		var sendDataSct_ = [ {
			"type_1" : _message.type?_message.type:81
		}// 0
		,{
			"mpt_1" : _message.mpt?_message.mpt:0
		}// 1
		,{
			"reveive_1" : 0
		}// 2
		,{
			"seq_1" : _message.seq?_message.seq:0
		}// 3
		,{
			"ts_4" : _message.ts?_message.ts:0
		}// 4
		,{
			"ext" : []
		}// 5
		,{
			"payload" :[]
		}// 6
		];
		var type_ = String.fromCharCode(_message.type);
		var extL_ = this.ext_[type_];
		var obj_;
		if(extL_>0)
		{
			obj_ = {};
			obj_["ext_"+extL_]=_message.ext?_message.ext:"";
			sendDataSct_[5].ext.push(obj_);
		}
		var mypayload_ = _message.payload?_message.payload:0;
		if(type_=="U")
		{
			obj_ = {};
			obj_.payload_utf=mypayload_;
		}
		else
		{
			obj_ = {};
			obj_.payload_d=mypayload_;
		}
		sendDataSct_[6].payload.push(obj_);
		return this.toBytes_(sendDataSct_);
	},
	streamDecode_:function(_value)
	{
		var message_ = {};
		var position_ = 0;
		message_.type = rc$.com.relayCore.utils.Number.convertToValue_('1', _value, position_);
		position_ += 1;
		message_.mpt = rc$.com.relayCore.utils.Number.convertToValue_('1', _value, position_);
		position_ += 2;
		message_.seq = rc$.com.relayCore.utils.Number.convertToValue_('1', _value, position_);
		position_ += 1;
		message_.ts = rc$.com.relayCore.utils.Number.convertToValue_('4', _value, position_);
		position_ += 4;
		var ext_len = this.ext_[String.fromCharCode(message_.type)];
		if(ext_len>0)
		{
			message_.ext = rc$.com.relayCore.utils.Number.convertToValue_('utf', _value, position_,ext_len);
			position_ += ext_len;
		}
		var pay_len_ = _value.length-position_;
		if(message_.type==85)
		{
			message_.payload = rc$.com.relayCore.utils.Number.convertToValue_('utf', _value, position_,pay_len_);
		}
		else
		{
			message_.payload = rc$.com.relayCore.utils.Number.convertToValue_('d', _value, position_,pay_len_);
		}
		return message_;
	},
	metaEncode_:function(_message)
	{
		var _sendDataSct = [ {
			"status_1" : _message.type?_message.type:0
		}// 0
		,{
			"Layers_1" : _message.layers?_message.layer:0
		}// 1
		,{
			"AuthPoint_1" : _message.authpoint?_message.authpoint:0
		}// 2
		,{
			"receive_1" : 0
		}// 3
		,{
			"NTPS_4" : _message.ntps?_message.ntps:0
		}// 4
		,{
			"NTPSF_4" : _message.ntpsf?_message.ntpsf:0
		}// 5
		,{
			"SDPHash" : [{"len_4":16},{"sdp_utf":_message.sdphash?_message.sdphash:""}]
		}//6
		];
		if(_message.layers>1)
		{
			for(var i=0;i<_message.Tags.length;i++)
			{
				var tag_ = _message.Tags[i];
				_sendDataSct.push({"len_4":16,"tag_utf":tag_});
			}
		}
		return this.toBytes_(_sendDataSct);
	},
	metaDecode_:function(_value)
	{
		var message_ = {};
		var position_ = 0;
		message_.status = rc$.com.relayCore.utils.Number.convertToValue_('1', _value, position_);
		position_ += 1;
		message_.Layers = rc$.com.relayCore.utils.Number.convertToValue_('1', _value, position_);
		position_ += 1;
		message_.AuthPoint = rc$.com.relayCore.utils.Number.convertToValue_('1', _value, position_);
		position_ += 2;
		message_.NTPS = rc$.com.relayCore.utils.Number.convertToValue_('4', _value, position_);
		position_ += 4;
		message_.NTPSF = rc$.com.relayCore.utils.Number.convertToValue_('4', _value, position_);
		position_ += 4;
		message_.SDPHash = rc$.com.relayCore.utils.Number.convertToValue_('utf', _value, position_,16);
		position_ += 16;
		if(message_.Layers>1)
		{
			var len_ = 16;
			message_.Tags=[];
			for(var i=0;i<message_.Layers-2;i++)
			{
				message_.Tags.push(rc$.com.relayCore.utils.Number.convertToValue_('utf', _value, position_,len_));
				position_ += len_;
			}
		}
		return message_;
	},
	toBytes_:function(_value)
	{
		var arr_ = [];
		this.processObject_(_value, arr_);
		var size_ = 0;

		for ( var _i = 0; _i < arr_.length; _i++) {
			size_ += arr_[_i].length;
		}
		var sendData_ = new Uint8Array(size_);
		var count_ = 0;
		for ( var _i = 0; _i < arr_.length; _i++) {
			for ( var _j = 0; _j < arr_[_i].length; _j++) {
				sendData_[count_++] = arr_[_i][_j];
			}
		}
		return sendData_;
	},
	processObject_ : function(_obj, _array) {
		switch (typeof (_obj)) {
		case "array":
			for ( var i = 0; i < _obj.length; i++) {
				if (_obj[i] instanceof Array) {
					this.processObject_(_obj[i], _array);
				} else if (typeof (_obj[i]) == "object") {
					this.processObject_(_obj[i], _array);
				}
			}
			break;
		case "object":
			var element_;
			for ( element_ in _obj) {
				var size_ = element_.split("_")[1];
				if (size_) {
					rc$.com.relayCore.utils.Number.convertToBit_(size_, _obj[element_], _array);
				}
				if (!size_ && _obj[element_]) {
					this.processObject_(_obj[element_], _array);
				}
			}
			break;
		default:
			break;
		}
	}
};
