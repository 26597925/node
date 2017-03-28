p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.HttpDownloader = CdeBaseClass.extend_({
	fullUrl_ : null,
	scope : null,
	method : "GET",
	config : null,
	type : "",
	tag_ : "",
	startTime_ : "",
	endTime : "",
	totalUsedTime_ : "",
	transferedSpeed_ : 0,
	transferedBytes_ : -1,
	responseCode_ : 0,
	responseLength_ : -1,
	responseData_ : "",
	successed_ : false,
	resolvedTime_ : 0,
	connectedTime_ : 0,
	responsedTime_ : 0,
	transferedTime_ : 0,
	info_ : "",
	http_ : null,
	readyState_ : 0,
	init : function(_url, _scope, _method, _type, _tag, _postData) {
		this.fullUrl_ = _url;
		this.scope = _scope;
		this.method = _method || "GET";
		this.type = _type || "";
		this.tag_ = _tag || "";
		this.startTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.responseLength_ = 0;
		this.resolvedTime_ = 0;
		this.connectedTime_ = 0;
		this.responsedTime_ = 0;
		this.transferedTime_ = 0;
		this.transferedSpeed_ = 0;
		this.transferedBytes_ = 0;
		this.responseCode_ = 0;
		this.info_ = "";
		this.responseData_ = "";
		this.remoteEndpoint_ = "";
		this.postData_ = null;
		this.http_ = null;
		if (this.method == "POST") {
			this.postData_ = _postData;
		}
		this.readyState_ = 0;
	},
	setRequsetRange_ : function(rangeStr) {
		this.rangeStr_ = rangeStr;
	},
	setPredefineHost_ : function(predefine) {
		var predefineIpAndPort = predefine.split(":");
		if (!predefineIpAndPort) {
			return;
		}
		var url = new p2p$.com.webp2p.core.supernode.Url();
		url.fromString_(this.fullUrl_);
		if (predefineIpAndPort.length > 2) {
			return;
		}
		url.host_ = predefineIpAndPort[0];
		if (predefineIpAndPort.length == 1) {
			url.port_ = 0;
		} else {
			url.port_ = predefineIpAndPort[1];

		}
		this.fullUrl_ = url.toString();
	},
	log : function(result) {
		if ("cdn::range-data" == this.tag_) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::supernode::HttpDownloader [{0}] Download {1}, Segment ({2}/{3}-{16}), url({4}), "
					+ "response code({5}), data({6}/{7} Bytes), " + "resolved time({8} ms), " + "connected time({9} ms), " + "responsed time({10} ms), "
					+ "total used time({11} ms), " + "transfered time({12} ms), " + "ready State({13}), " + "speed({14}), " + "bytes({15})", this.tag_,
					(result == "" ? (this.successed_ ? "OK" : "FAILED") : result), this.info_ ? this.info_.segmentId_ : 0, this.info_ ? this.info_.startIndex_
							: 0, this.fullUrl_, this.responseCode_, this.successed_ ? this.responseData_.length : 0, this.responseLength_, this.resolvedTime_,
					this.connectedTime_, this.responsedTime_, this.totalUsedTime_, this.transferedTime_, this.readyState_, p2p$.com.webp2p.core.common.Global
							.speed(this.transferedSpeed_, false), this.transferedBytes_, this.info_ ? this.info_.endIndex_ : 0));
		} else {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::supernode::HttpDownloader [{0}] Download {1}, url({2}), " + "response code({3}), data({4}/{5} Bytes), "
					+ "resolved time({6} ms), " + "connected time({7} ms), " + "responsed time({8} ms), " + "total used time({9} ms), "
					+ "transfered time({10} ms), " + "ready State({11}), " + "speed({12}), " + "bytes({13})", this.tag_,
					(result == "" ? (this.successed_ ? "OK" : "FAILED") : result), this.fullUrl_, this.responseCode_,
					this.successed_ ? this.responseData_.length : 0, this.responseLength_, this.resolvedTime_, this.connectedTime_, this.responsedTime_,
					this.totalUsedTime_, this.transferedTime_, this.readyState_, p2p$.com.webp2p.core.common.Global.speed(this.transferedSpeed_, false),
					this.transferedBytes_));
		}
	},

	load : function() {
		// if (this.tag_ == "cdn::range-data") {
		this.load2();
		// } else {
		// this.load1();
		// }
	},

	load1 : function() {
		// this.ajaxId_ = $.ajax({
		// url : this.fullUrl_
		// }).done(function(data) {
		// if (typeof (data) == 'string') {
		// try {
		// data = eval('(' + data + ')');
		// } catch (e) {
		// }
		// P2P_ULOG_INFO(P2P_ULOG_FMT("gslb return location={0} remote={1}", data.location, data.remote));
		// }
		//		
		// me.responseCode_ = this.status;
		// me.responseData_ = this.response || '';
		//		
		// }).fail(function() {
		//		
		// }).always(function() {
		//		
		// });
		var me = this;
		if (me.tag_ == "cdn::range-data") {
			this.type = "text";
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::supernode::HttpDownloader [{0}] Start download {1}...", this.tag_, this.fullUrl_));
		this.http_ = $.ajax({
			url : this.fullUrl_,
			type : this.method,
			dataType : "text",
			error : function(request, textStatus, errorThrown) {
				// alert(request.status);
				// alert(request.readyState);
				// alert(textStatus); // paser error;
				me.endTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
				me.totalUsedTime_ = me.endTime - me.startTime_;
				me.successed_ = false;
			},
			complete : function(request, textStatus) {
				me.responseCode_ = request.status;
				me.readyState_ = request.readyState;
				me.onDownloadCompleted_();
			},
			success : function(data, textStatus) {
				me.endTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
				me.totalUsedTime_ = me.endTime - me.startTime_;
				me.responseData_ = data;
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::supernode::HttpDownloader textStatus {0}", textStatus));
				if (me.tag_ == "cdn::range-data") {
					var buf = new ArrayBuffer(data.length); // 每个字符占用2个字节
					var bufView = new Uint8Array(buf);
					for ( var i = 0, strLen = data.length; i < strLen; i++) {
						bufView[i] = data.charCodeAt(i);
					}
					var uInt8Array = new Uint8Array(data);
					me.responseData_ = uInt8Array;
					me.responseLength_ = uInt8Array.length;
					me.transferedBytes_ = uInt8Array.length;
				} else {
					me.transferedBytes_ = me.responseLength_ = me.responseData_.length;
					if ("json" == me.type && typeof (me.responseData_) == "string") {
						try {
							me.responseData_ = JSON.parse(me.responseData_);
						} catch (err) {
							P2P_ULOG_ERROR(P2P_ULOG_FMT("core::supernode::HttpDownloader::Parse response json data failed, url:{0}, error:{1}", me.fullUrl_,
									(err || "").toString()));
						}
					}
				}
				// Math.round(original*100)/100;
				me.transferedSpeed_ = (me.transferedBytes_ * 1000 / me.totalUsedTime_);// .toFixed(2);
				me.transferedSpeed_ = Math.round(me.transferedSpeed_ * 100) / 100;
				// P2P_ULOG_TRACE("tag:"+me.tag_+",responseLength_:"+me.responseLength_+",speed:"+p2p$.com.webp2p.core.common.Global.speed(me.transferedSpeed_,false));
				me.successed_ = true;
			}
		});
	},

	close : function() {
		if (this.http_) {
			this.isAbort_ = true;
			this.http_.abort();
		}
	},

	load2 : function() {

		var xhr = this.http_ = this.createRequest_();
		var me = this;
		// ajaxRequest = new XMLHttpRequest();
		// ajaxRequest.open('POST', 'https://api.github.com/markdown', true);
		// ajaxRequest.setRequestHeader('Content-Type', 'application/json');
		xhr.onreadystatechange = function() {
			if (this.readyState == 1) {
				me.readyState_ = 1;
			}
			if (this.readyState == 2) {
				me.readyState_ = 2;
			}
			if (this.readyState == 3) {
				me.readyState_ = 3;
			}
			if (this.readyState == 4) {
				me.readyState_ = 4;
				me.endTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
				me.responseCode_ = this.status;
				me.responseData_ = this.response || '';

				// Calculate usedTime
				me.totalUsedTime_ = me.endTime - me.startTime_;

				if (this.status >= 200 && this.status < 300) {
					// Calculate speed
					if (me.tag_ == "cdn::range-data") {
						var uInt8Array = new Uint8Array(me.responseData_);
						me.responseData_ = uInt8Array;
						me.responseLength_ = uInt8Array.length;
						me.transferedBytes_ = uInt8Array.length;
					} else {
						if ("json" == me.type) {
							var str = JSON.stringify(me.responseData_);
							me.transferedBytes_ = me.responseLength_ = str.length;
						} else {
							me.transferedBytes_ = me.responseLength_ = me.responseData_.length;
						}

					}
					// Math.round(original*100)/100;
					me.transferedSpeed_ = (me.transferedBytes_ * 1000 / me.totalUsedTime_);// .toFixed(2);
					me.transferedSpeed_ = Math.round(me.transferedSpeed_ * 100) / 100;
					// P2P_ULOG_TRACE("tag:"+me.tag_+",responseLength_:"+me.responseLength_+",speed:"+p2p$.com.webp2p.core.common.Global.speed(me.transferedSpeed_,false));
					me.successed_ = true;

				} else {
					me.successed_ = false;
				}
				if (!me.isAbort_) {
					me.onDownloadCompleted_();
				}

			}
		};

		// if(this.tag_ != "cdn::range-dat")
		// {
		// xhr.onprogress = function(evt) {
		//				
		// // Calculate progress
		// var str = "";
		// if (evt.lengthComputable) {
		// var percent = 100 * evt.loaded / evt.total;
		// str = percent + "%. load:"+evt.loaded+",total:"+evt.total+",Current total size: " + this.responseText.length;
		// } else {
		// str = "Progress unknown. Current total size: " + this.responseText.length;
		// }
		// me.responseData_ = this.responseText;
		// me.responseLength_ = evt.total;
		// // Calculate usedTime and speed
		// me.endTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		// me.totalUsedTime_ = me.endTime - me.startTime_;
		// me.transferedBytes_ = evt.loaded;
		// me.transferedSpeed_ = (me.transferedBytes_ * 1000 / me.totalUsedTime_).toFixed(2);
		// //;
		// //P2P_ULOG_TRACE("transferedSpeed_:"+me.transferedSpeed_+",speed:"+p2p$.com.webp2p.core.common.Global.speed(me.transferedSpeed_,false)+",transferedBytes_:"+me.transferedBytes_+",total:"+evt.total);
		// me.onDownloadData_(me);
		// if(me.tag_ == "cdn::range-data")
		// {
		// P2P_ULOG_TRACE("tag:"+me.tag_+",str:"+str);
		// }
		//				
		// };
		// }

		xhr.open(me.method, me.fullUrl_);
		if (this.rangeStr_) {
			xhr.setRequestHeader("Range", this.rangeStr_);
		}
		try {
			xhr.responseType = this.type;// arraybuffer
			if (!this.postData_) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::supernode::HttpDownloader [{0}] Start download {1}...", this.tag_, this.fullUrl_));
			}
		} catch (e) {
			alert(e);
			alert(this.type);
		}
		var url = new p2p$.com.webp2p.core.supernode.Url();
		url.fromString_(this.fullUrl_);
		this.remoteEndpoint_ = url.host_ + (url.port_ == 0 ? "" : ":" + url.port_);

		try {
			if (this.postData_) {
				xhr.send(this.postData_);
			} else {
				xhr.send(null);
			}

		} catch (e) {
			console.log(e);
		}
	},

	setInfo_ : function(info) {
		this.info_ = info;
	},

	createRequest_ : function() {
		var objXMLHttpRequest = null;
		if (window.ActiveXObject) { // MS IE
			var activeXNameList = new Array("Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP",
					"Microsoft.XMLHTTP");
			for ( var h = 0; h < activeXNameList.length; h++) {
				try {
					objXMLHttpRequest = new ActiveXObject(activeXNameList[h]);
				} catch (e) {
					continue;
				}
				if (objXMLHttpRequest) {
					break;
				}
			}
		} else if (window.XMLHttpRequest) { // NOT MS IE
			objXMLHttpRequest = new XMLHttpRequest();
			if (objXMLHttpRequest.overrideMimeType) { // 针对某些特定版本的mozillar浏览器的BUG进行修正
				objXMLHttpRequest.overrideMimeType(this.type);
			}
		}

		return objXMLHttpRequest;
	},

	onDownloadData_ : function() {
		if (typeof this.scope.onHttpDownloadData_ != 'undefined' & this.scope.onHttpDownloadData_ instanceof Function) {
			this.scope.onHttpDownloadData_(this);
		}
	},

	stringToJson_ : function(stringVal) {
		eval("var theJsonVal = " + stringVal);
		return theJsonVal;
	},

	onDownloadCompleted_ : function() {
		// P2P_ULOG_TRACE("download success:",this);
		if (!this.postData_) {
			this.log("");
		}
		if (typeof this.scope.onHttpDownloadCompleted_ != 'undefined' & this.scope.onHttpDownloadCompleted_ instanceof Function) {
			this.scope.onHttpDownloadCompleted_(this);
		}

	},

	sendInfo : function(value) {
		var info = {};
		info.code = "Mobile.Info.Debug";
		info.info = value;
		this.config.sendInfo(info);
	}
});
