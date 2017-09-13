rc$.ns("com.relayCore.utils");
rc$.com.relayCore.utils.HttpDownLoader = JClass.extend_({
		url_ : null,
		scope_ : null,
		method_ : "GET",
		config_ : null,
		type_ : "text",
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
		global_:null,
		
		init:function()
		{
			//初始化参数
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
			this.readyState_ = 0;
			this.global_ = rc$.com.relayCore.utils.Global;
			this.startTime_ = this.global_.getMilliTime_();
			if(arguments.length>0&&typeof(arguments[0])=="object")
	    	{
	    		rc$.apply(this,arguments[0]);
	    	}
		},
		setRequsetRange_ : function(_rangeStr) {
			this.rangeStr_ = _rangeStr;
		},
		setPredefineHost_ : function(_predefine) {
			var predefineIpAndPort_ = _predefine.split(":");
			if (!predefineIpAndPort_) {
				return;
			}
			var myurl_ = new rc$.com.relayCore.utils.Url();
			myurl_.fromString_(this.url_);
			if (predefineIpAndPort_.length > 2) {
				return;
			}
			myurl_.host_ = predefineIpAndPort_[0];
			if (predefineIpAndPort_.length == 1) {
				myurl_.port_ = 0;
			} else {
				myurl_.port_ = predefineIpAndPort_[1];

			}
			this.url_ = myurl_.toString();
		},
		log_ : function(_result) {
			if ("cdn::range-data" == this.tag_) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("HttpDownloader [{0}] Download {1}, Segment ({2}/{3}-{16}), url({4}), "
						+ "response code({5}), data({6}/{7} Bytes), " + "resolved time({8} ms), " + "connected time({9} ms), " + "responsed time({10} ms), "
						+ "total used time({11} ms), " + "transfered time({12} ms), " + "ready State({13}), " + "speed({14}), " + "bytes({15})", this.tag_,
						(_result == "" ? (this.successed_ ? "OK" : "FAILED") : _result), this.info_ ? this.info_.segmentId_ : 0, this.info_ ? this.info_.startIndex_
								: 0, this.url_, this.responseCode_, this.successed_ ? this.responseData_.length : 0, this.responseLength_, this.resolvedTime_,
						this.connectedTime_, this.responsedTime_, this.totalUsedTime_, this.transferedTime_, this.readyState_, this.global_
								.speed(this.transferedSpeed_, false), this.transferedBytes_, this.info_ ? this.info_.endIndex_ : 0));
			} else {
				P2P_ULOG_INFO(P2P_ULOG_FMT("HttpDownloader [{0}] Download {1}, url({2}), " + "response code({3}), data({4}/{5} Bytes), "
						+ "resolved time({6} ms), " + "connected time({7} ms), " + "responsed time({8} ms), " + "total used time({9} ms), "
						+ "transfered time({10} ms), " + "ready State({11}), " + "speed({12}), " + "bytes({13})", this.tag_,
						(_result == "" ? (this.successed_ ? "OK" : "FAILED") : _result), this.url_, this.responseCode_,
						this.successed_ ? this.responseData_.length : 0, this.responseLength_, this.resolvedTime_, this.connectedTime_, this.responsedTime_,
						this.totalUsedTime_, this.transferedTime_, this.readyState_, this.global_.speed(this.transferedSpeed_, false),
						this.transferedBytes_));
			}
		},
		load_ : function() {

			var xhr_ = this.http_ = this.createRequest_();
			var scope_ = this;
			xhr.onreadystatechange = function() {
				if (this.readyState == 1) {
					scope_.readyState_ = 1;
				}
				if (this.readyState == 2) {
					scope_.readyState_ = 2;
				}
				if (this.readyState == 3) {
					scope_.readyState_ = 3;
				}
				if (this.readyState == 4) {
					scope_.readyState_ = 4;
					scope_.endTime = scope_.global_.getMilliTime_();
					scope_.responseCode_ = this.status;
					scope_.responseData_ = this.response || '';

					// Calculate usedTime
					scope_.totalUsedTime_ = scope_.endTime - scope_.startTime_;

					if (this.status >= 200 && this.status < 300) {
						// Calculate speed
						if (scope_.tag_ == "cdn::range-data") {
							var uInt8Array = new Uint8Array(scope_.responseData_);
							scope_.responseData_ = uInt8Array;
							scope_.responseLength_ = uInt8Array.length;
							scope_.transferedBytes_ = uInt8Array.length;
						} else {
							if ("json" == scope_.type_) {
								var str_ = JSON.stringify(scope_.responseData_);
								scope_.transferedBytes_ = scope_.responseLength_ = str_.length;
							} else {
								scope_.transferedBytes_ = scope_.responseLength_ = scope_.responseData_.length;
							}
						}
						scope_.transferedSpeed_ = (scope_.transferedBytes_ * 1000 / scope_.totalUsedTime_);// .toFixed(2);
						scope_.transferedSpeed_ = Math.round(scope_.transferedSpeed_ * 100) / 100;
						// P2P_ULOG_TRACE("tag:"+scope_.tag_+",responseLength_:"+scope_.responseLength_+",speed:"+this.global_.speed(scope_.transferedSpeed_,false));
						scope_.successed_ = true;

					} else {
						scope_.successed_ = false;
					}
					if (!scope_.isAbort_) {
						scope_.onDownloadCompleted_();
					}

				}
			};
			xhr_.open(this.method_, this.url_);
			if (this.rangeStr_) {
				xhr_.setRequestHeader("Range", this.rangeStr_);
			}
			try {
				xhr_.responseType = this.type_;// arraybuffer
				if (!this.postData_) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("HttpDownloader [{0}] Start download {1}...", this.tag_, this.url_));
				}
			} catch (e) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("HttpDownloader [{0}] url({1})ERROR({2})", this.tag_, this.url_,e.toString()|""));
			}
			var myurl_ = new rc$.com.relayCore.utils.Url();
			myurl_.fromString_(this.url_);
			this.remoteEndpoint_ = myurl_.host_ + (myurl_.port_ == 0 ? "" : ":" + myurl_.port_);

			try {
				if (this.postData_) {
					xhr_.send(this.postData_);
				} else {
					xhr_.send(null);
				}

			} catch (e) {
				console.log(e);
			}
		},
		createRequest_:function()
		{
			var objXMLHttpRequest_ = null;
			if (window.ActiveXObject) { // MS IE
				var activeXNameList = new Array("Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP",
						"Microsoft.XMLHTTP");
				for ( var h = 0; h < activeXNameList.length; h++) {
					try {
						objXMLHttpRequest_ = new ActiveXObject(activeXNameList[h]);
					} catch (e) {
						continue;
					}
					if (objXMLHttpRequest_) {
						break;
					}
				}
			} else if (window.XMLHttpRequest) { // NOT MS IE
				objXMLHttpRequest_ = new XMLHttpRequest();
				if (objXMLHttpRequest_.overrideMimeType) { // 针对某些特定版本的mozillar浏览器的BUG进行修正
					objXMLHttpRequest_.overrideMimeType(this.type);
				}
			}
			return objXMLHttpRequest_;
		},
		onDownloadData_ : function() {
			if (typeof this.scope_.onHttpDownloadData_ != 'undefined' & this.scope_.onHttpDownloadData_ instanceof Function) {
				this.scope_.onHttpDownloadData_(this);
			}
		},

		stringToJson_ : function(_stringVal) {
			eval("var theJsonVal = " + _stringVal);
			return theJsonVal;
		},

		setInfo_ : function(_info) {
			this.info_ = _info;
		},
		
		onDownloadCompleted_ : function() {
			// P2P_ULOG_TRACE("download success:",this);
			if (!this.postData_) {
//				
			}
			if (typeof this.scope_.onHttpDownloadCompleted_ != 'undefined' & this.scope_.onHttpDownloadCompleted_ instanceof Function) {
				this.scope_.onHttpDownloadCompleted_(this);
			}

		},

		sendInfo : function(_value) {
			var info_ = {};
			info_.code = "Mobile.Info.Debug";
			info_.info = _value;
		},
		close : function() {
			if (this.http_) {
				this.isAbort_ = true;
				this.http_.abort();
			}
		}
});
