p2p$.ns('com.webp2p.protocol.webrtc');
p2p$.com.webp2p.protocol.webrtc.Packet = {
	peerIds_ : [],

	// encode
	encode : function(message, peerIdsList, type) {
		// this.sendrangNum++;
		var _sendDataSct = [ {
			"sequence_4" : 0
		},// 0
		{
			"dataLength_4" : 0
		},// 1
		{
			"rangeCount_4" : 0
		},// 2
		{
			"rangeItems" : [ [ {
				"type_2" : 123
			}, {
				"start_8" : 234
			}, {
				"end_4" : 345
			} ] ]
		},// 3
		{
			"requestCount_4" : 0
		},// 4
		{
			"requestItems" : [ [ {
				"type_2" : 0
			}, {
				"start_8" : 1411033199
			}, {
				"cks_4" : 57473
			} ] ]
		},// 5
		{
			"responseCount_4" : 0
		},// 6
		{
			"responseItems" : [ [ {
				"type_2" : 0
			}, {
				"start_8" : 1411033199
			}, {
				"streamLength_4" : 57473
			}, {
				"stream_d" : null
			} ] ]
		},// 7
		{
			"peerCount_4" : 1
		},// 连接节点数
		{
			"peerItems" : [ [ {
				"head_4" : 0
			}, {
				"URL_utf" : "ws://202.103.4.52:34567/*****"
			} ] ]
		} // 9
		];

		// 3
		var _rangeItems = [];
		var _start;
		var _end;
		for ( var n = 0; n < message.ranges_.length; n++) {
			var item = message.ranges_[n];
			_start = item.start_;
			_end = item.count_;
			_rangeItems.push([ {
				"type_2" : item.type_
			}, {
				"start_8" : _start
			}, {
				"end_4" : (_end)
			} ]);
		}
		_sendDataSct[3].rangeItems = _rangeItems;

		// 5
		var _requestItems = [];
		for ( var n = 0; n < message.requests_.length; n++) {
			var item = message.requests_[n];
			_requestItems.push([ {
				"type_2" : item.pieceType_
			}, {
				"start_8" : item.pieceId_
			}, {
				"cks_4" : item.checksum_
			} ]);
		}
		_sendDataSct[5].requestItems = _requestItems;

		// 7
		var _responseItems = [];
		for ( var n = 0; n < message.responses_.length; n++) {
			var item = message.responses_[n];
			_responseItems.push([ {
				"type_2" : item.pieceType_
			}, {
				"start_8" : item.pieceId_
			}, {
				"streamLength_4" : item.data_.length
			}, {
				"stream_d" : item.data_
			} ]);
		}
		_sendDataSct[7].responseItems = _responseItems;

		// 9
		var _peerItems = [];
		if (typeof peerIdsList != 'undefined') {
			for ( var n = 0; n < peerIdsList.length; n++) {
				var item = peerIdsList[n];
				_peerItems.push([ {
					"head_4" : n
				}, {
					"URL_utf" : item
				} ]);
			}
			_sendDataSct[9].peerItems = _peerItems;
		}

		_sendDataSct[2].rangeCount_4 = _sendDataSct[3].rangeItems.length;
		_sendDataSct[4].requestCount_4 = _sendDataSct[5].requestItems.length;
		_sendDataSct[6].responseCount_4 = _sendDataSct[7].responseItems.length;
		_sendDataSct[8].peerCount_4 = _sendDataSct[9].peerItems.length;

		// for(var _i = 0; _i < _sendDataSct[7].responseItems.length;_i++ )
		// {
		// _sendDataSct[7].responseItems[_i][2].streamLength_4 = _sendDataSct[7].responseItems[_i][3].stream_d.length;
		// }

		for ( var _i = 0; _i < _sendDataSct[9].peerItems.length; _i++) {
			_sendDataSct[9].peerItems[_i][0].head_4 = _sendDataSct[9].peerItems[_i][1].URL_utf.length;
		}

		// /结算分享数据信息
		// for(var _i=0;_i<_sendDataSct[7].responseItems.length;_i++)
		// {
		// this.shareNum++;
		// this.shareSize+=Number(_sendDataSct[7].responseItems[_i][2].streamLength_4);
		// }

		// this.sendInfo(_sendDataSct);

		var _arr = [];
		if (type != p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc) {
			_sendDataSct.splice(1, 1);
		}
		this.processObject_(_sendDataSct, _arr);
		var _size = 0;

		for ( var _i = 0; _i < _arr.length; _i++) {
			_size += _arr[_i].length;
		}
		var _sendData = new Uint8Array(_size);
		var _count = 0;
		for ( var _i = 0; _i < _arr.length; _i++) {
			for ( var _j = 0; _j < _arr[_i].length; _j++) {
				_sendData[_count++] = _arr[_i][_j];
			}
		}
		// //
		if (type == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc) {
			var _sdatalen = _sendData.length;
			_sendData[4] = (parseInt(_sdatalen) >> 24) & 0xff;
			_sendData[5] = (parseInt(_sdatalen) >> 16) & 0xff;
			_sendData[6] = (parseInt(_sdatalen) >> 8) & 0xff;
			_sendData[7] = parseInt(_sdatalen) & 0xff;
		}
		// this.req++;
		// this.dl++;
		return _sendData;
	},

	decode : function(value, type) {
		var _position = 0;
		// var _sequnce = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
		// var _time;
		var _type;
		// var _info;
		var _i;
		var message = new p2p$.com.webp2p.protocol.base.Message();
		// ranges_:null,
		// requests_:null,
		// responses_:null,

		_position += 4;
		if (type == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc) {
			_position += 4;// 跳过4个字节，这4个字节是说明数据长度的
		}

		var _rangeCount = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
		_position += 4;
		var rangeInfo = null;
		if (_rangeCount !== 0) {
			for (_i = 0; _i < _rangeCount; _i++) {
				_type = p2p$.com.webp2p.core.common.Number.convertToValue_('2', value, _position);
				_position += 2;
				if (p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn === _type) {
					// this.remoteTNList.push({"start":_start,"end":(_start+_end-1)});
					rangeInfo = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
					rangeInfo.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
				} else {
					// this.remotePNList.push({"start":_start,"end":(_start+_end-1)});
					rangeInfo = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
					rangeInfo.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;

				}
				rangeInfo.start_ = -1;
				rangeInfo.count_ = 0;
				var _start = p2p$.com.webp2p.core.common.Number.convertToValue_('8', value, _position);
				_position += 8;
				var _end = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
				_position += 4;
				rangeInfo.start_ = _start;
				rangeInfo.count_ = _end;
				message.ranges_.push(rangeInfo);
			}
			// 输出 range信息
			// _info={};
			// _info.code="P2P.Range.Info";
			// _info.info={"TN":this.remoteTNList,"PN":this.remotePNList};
			// this.statics.sendToJs(_info);
		}

		var _reqCount = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
		_position += 4;
		var requestInfo = null;
		for (_i = 0; _i < _reqCount; _i++) {

			requestInfo = new p2p$.com.webp2p.protocol.base.RequestDataItem();
			_type = p2p$.com.webp2p.core.common.Number.convertToValue_('2', value, _position);
			_position += 2;
			var _pid = p2p$.com.webp2p.core.common.Number.convertToValue_('8', value, _position);
			_position += 8;
			var _sck = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
			_position += 4;

			requestInfo.pieceType_ = _type;
			requestInfo.pieceId_ = _pid;
			requestInfo.checksum_ = _sck;
			message.requests_.push(requestInfo);
		}

		var _respCount = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
		_position += 4;
		var responseInfo = null;
		// var _len = 1;// (requestArr?requestArr.length:1); && _i<_len
		for (_i = 0; _i < _respCount; _i++) {
			// _responseItems.push([{"type_2":item.pieceType_},
			// {"start_8":item.pieceId_},
			// {"streamLength_4":item.data_.length},
			// {"stream_d":item.data_}]);
			//
			responseInfo = new p2p$.com.webp2p.protocol.base.ResponseDataItem();
			// if(value.length > 50)
			// {
			// console.log("response");
			// }
			// _time = this.config.localTime - this.starttime;
			_type = p2p$.com.webp2p.core.common.Number.convertToValue_('2', value, _position);
			_position += 2;
			var _pid2 = p2p$.com.webp2p.core.common.Number.convertToValue_('8', value, _position);
			_position += 8;
			var _DataL = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
			_position += 4;

			var _stream = p2p$.com.webp2p.core.common.Number.convertToValue_('d', value, _position, _DataL);
			_position += _DataL;

			responseInfo.pieceType_ = _type;
			responseInfo.pieceId_ = _pid2;
			responseInfo.data_ = _stream;
			message.responses_.push(responseInfo);

			// this.dealRemoteData({'pieceID':_pid2,'data':_stream});
			// this.downNum++;
			// this.downSize+=_stream.length;
			// this.speed = Math.round(_stream.length*8/_time/10)/100;
			// _info = {};
			// _info.code = "P2P.Info.Debug";
			// _info.info="p2p:["+this.remoteId_+"] "+_type+"_"+_pid2;
			// this.statics.sendToJs(_info);
		}

		var _peerCount = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);// sequnce
		_position += 4;
		var peersInfo = [];
		for (_i = 0; _i < _peerCount; _i++) {
			var _peerheadL = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);// sequnce
			_position += 4;
			var _url = p2p$.com.webp2p.core.common.Number.convertToValue_('utf', value, _position, _peerheadL);
			_position += _peerheadL;
			peersInfo.push(_url);
		}
		// //接受完数据
		// if(_rangeCount>0)
		// {
		// this.reqrangNum++;
		// //防止发送太快，设置间隔
		// this.peer.sendMessage_();
		// }
		return message;
	},

	processObject_ : function(obj, _array) {
		switch (typeof (obj)) {
		case "array":
			for ( var i = 0; i < obj.length; i++) {
				if (obj[i] instanceof Array) {
					this.processObject_(obj[i], _array);
				} else if (typeof (obj[i]) == "object") {
					this.processObject_(obj[i], _array);
				}
			}
			break;
		case "object":
			for ( var element in obj) {
				var size = element.split("_")[1];
				if (size) {
					p2p$.com.webp2p.core.common.Number.convertToBit_(size, obj[element], _array);
				}
				if (!size && obj[element]) {
					this.processObject_(obj[element], _array);
				}
			}
			break;
		default:
			break;
		}
	}
};
