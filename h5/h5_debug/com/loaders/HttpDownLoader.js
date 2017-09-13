/**
 * 下载模块，统一处理下载数据
 */
p2p$.ns("com.loaders");
p2p$.com.loaders.JSONPHandler={
		data_:null,
		scope_:null,
		onData_:function(data)
		{
			if(this.scope_ != null)
			{
				this.scope_.onData_(data);
			}
		}
};
p2p$.com.loaders.HttpDownLoader = JClass.extend_({
		url_ : null,
		scope_ : null,
		method_ : "GET",
		type_ : "text",
		tag_ : "",
		//以上五个参数由外部传入
		startTime_ : "",
		endTime_: "",
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
		config_ : null,
		jsnode_ : null,
		tag2_:"com::loaders::HttpDownLoader",
		
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
			this.global_ = p2p$.com.common.Global;
            this.startTime_ = this.global_.getMilliTime_();
			if(p2p$.com.selector){
				this.config_ = p2p$.com.selector.Config;
			}
			if(arguments.length>0&&typeof(arguments[0])=="object")
	    	{
	    		p2p$.apply(this,arguments[0]);
	    	}
		},
		setRequsetRange_ : function(rangeStr) {
			this.rangeStr_ = rangeStr;
		},
		//备用地址
		setPredefineHost_ : function(predefine) {
			var predefineIpAndPort = predefine.split(":");
			if (!predefineIpAndPort) {
				return;
			}
			var url = new p2p$.com.common.Url();
			url.fromString_(this.url_);
			if (predefineIpAndPort.length > 2) {
				return;
			}
			url.host_ = predefineIpAndPort[0];
			if (predefineIpAndPort.length == 1) {
				url.port_ = 0;
			} else {
				url.port_ = predefineIpAndPort[1];

			}
			this.url_ = url.toString();
		},
		log_ : function(result) {
			if ("cdn::range-data" == this.tag_) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}] Download {2}, Segment ({3}/{4}-{16}), url({5}),response code({6}), data({7}/{8} Bytes),resolved time({9} ms),connected time({10} ms),responsed time({11} ms),total used time({12} ms),transfered time({13} ms),ready State({14}),speed({15}),bytes({16})",this.tag2_,this.tag_,(result == "" ? (this.successed_ ? "OK" : "FAILED") : result), this.info_ ? this.info_.segmentId_ : 0, this.info_ ? this.info_.startIndex_: 0, this.url_, this.responseCode_, this.successed_ ? this.responseData_.length : 0, this.responseLength_, this.resolvedTime_,this.connectedTime_, this.responsedTime_, this.totalUsedTime_, this.transferedTime_, this.readyState_, this.global_.speed(this.transferedSpeed_, false), this.transferedBytes_, this.info_ ? this.info_.endIndex_ : 0));
			} else {
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}] Download {2}, url({3}),response code({4}), data({5}/{6} Bytes),resolved time({7} ms),connected time({8} ms), responsed time({9} ms),total used time({10} ms), transfered time({11} ms),ready State({12}), peed({13}),bytes({14})",this.tag2_, this.tag_,(result == "" ? (this.successed_ ? "OK" : "FAILED") : result), this.url_, this.responseCode_,this.successed_ ? this.responseData_.length : 0, this.responseLength_, this.resolvedTime_, this.connectedTime_, this.responsedTime_,this.totalUsedTime_, this.transferedTime_, this.readyState_, this.global_.speed(this.transferedSpeed_, false),this.transferedBytes_));
			}
		},
		load_ : function() {
			var me = this;
			me.isAbort_=false;
			var url = new p2p$.com.common.Url();
			url.fromString_(this.url_);
			if("jsonp" == me.type_)
			{
				p2p$.com.loaders.JSONPHandler.scope_=this;
				url.params_.set('jsonp', "p2p$.com.loaders.JSONPHandler.onData_");
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::load_ type({1}),url({2})",this.tag2_,this.type_,url.toString()));
				this.jsnode_ = document.createElement("script");
                this.jsnode_.type = 'text/javascript';
                // this.jsnode_.onload = this.jsnode_.onreadystatechange = function () {
                //     console.log("######",this.innerText);
                // };
				this.jsnode_.setAttribute('src', url.toString());
			    // 把script标签加入head，此时调用开始
			    document.getElementsByTagName('head')[0].appendChild(this.jsnode_);
			    return;
			}
			var xhr = this.http_ = this.createRequest_();
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
					me.endTime_ = me.global_.getMilliTime_();
					me.responseCode_ = this.status;
					me.responseData_ = this.response || '';

					// Calculate usedTime
					me.totalUsedTime_ = me.endTime_ - me.startTime_;

					if (this.status >= 200 && this.status < 300) {
						// Calculate speed
						if (me.tag_ == "cdn::range-data") {
							var uInt8Array = new Uint8Array(me.responseData_);
							me.responseData_ = uInt8Array;
							me.responseLength_ = uInt8Array.length;
							me.transferedBytes_ = uInt8Array.length;
						} else {
							if ("json" == me.type_) {
								var str = JSON.stringify(me.responseData_);
								me.transferedBytes_ = me.responseLength_ = str.length;
							} 
							else
							{
								me.transferedBytes_ = me.responseLength_ = me.responseData_.length;
							}
						}
						me.transferedSpeed_ = (me.transferedBytes_ * 1000 / me.totalUsedTime_);// .toFixed(2);
						me.transferedSpeed_ = Math.round(me.transferedSpeed_ * 100) / 100;
						// P2P_ULOG_TRACE("tag:"+me.tag_+",responseLength_:"+me.responseLength_+",speed:"+this.global_.speed(me.transferedSpeed_,false));
						me.successed_ = true;

					} else {
						me.successed_ = false;
					}
					if (!me.isAbort_) {
						me.onDownloadCompleted_();
					}
				}
			};
			xhr.open(this.method_, this.url_);
            if(this.method_ == "POST"){
                xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            }
			if (this.rangeStr_) {
				xhr.setRequestHeader("Range", this.rangeStr_);
			}
			try {
				xhr.responseType = this.type_;// arraybuffer
				if (!this.postData_) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}] Start download {2}...", this.tag2_, this.tag_, this.url_));
				}
			} catch (e) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}] responseTypeErrror {2}...", this.tag2_, this.tag_, e.toString()|""));
			}
			this.remoteEndpoint_ = url.host_ + (url.port_ == 0 ? "" : ":" + url.port_);
			try {
				if (this.postData_) {
					var form = new FormData();
					for(var key in this.postData_){
                        form.append(key,this.postData_[key]);
					}
					xhr.send(form);
                    // if(xhr.readyState != 4){
                     //    xhr.send(JSON.stringify({'a':11}));//this.postData_));
					// }
				} else {
					xhr.send(null);
				}

			} catch (e) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}] send Error {2}...", this.tag2_, this.tag_, e.toString()|""));
			}
		},
		createRequest_:function()
		{
			var objXMLHttpRequest = null;	
			if (window.XMLHttpRequest) { // NOT MS IE
				objXMLHttpRequest = new XMLHttpRequest();
				if (objXMLHttpRequest.overrideMimeType) { // 针对某些特定版本的mozillar浏览器的BUG进行修正
					objXMLHttpRequest.overrideMimeType(this.type_);
				}
			}
			else
			{
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
			}
			return objXMLHttpRequest;
		},
		onDownloadData_ : function() {
			if (typeof this.scope_.onHttpDownloadData_ != 'undefined' & this.scope_.onHttpDownloadData_ instanceof Function) {
				this.scope_.onHttpDownloadData_(this);
			}
		},

		stringToJson_ : function(stringVal) {
			eval("var theJsonVal = " + stringVal);
			return theJsonVal;
		},

		setInfo_ : function(info) {
			this.info_ = info;
		},
		onData_:function(data)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onData url({1})",this.tag_,this.url_));
			this.readyState_ = 4;
			this.successed_ = true;
			this.endTime_ = this.global_.getMilliTime_();
			this.responseCode_ = 200;
			this.responseData_ = data;
			var str = JSON.stringify(this.responseData_);
			this.responseLength_ = str.length;
			// Calculate usedTime
			this.totalUsedTime_ = this.endTime_ - this.startTime_;
			this.onDownloadCompleted_();
			if(this.jsnode_ != null){
				document.getElementsByTagName('head')[0].removeChild(this.jsnode_);
			}
		},
		onDownloadCompleted_ : function() {
			if (typeof this.scope_.onHttpDownloadCompleted_ != 'undefined' & this.scope_.onHttpDownloadCompleted_ instanceof Function) {
				this.scope_.onHttpDownloadCompleted_(this);
			}
		},

		sendInfo : function(value) {
			var info = {};
			info.code = "Mobile.Info.Debug";
			info.info = value;
			this.config_.sendInfo(info);
		},
		close : function() {
			if (this.http_) {
				this.isAbort_ = true;
				this.http_.abort();
			}
		}
});
