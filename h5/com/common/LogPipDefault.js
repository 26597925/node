p2p$.ns('com.common');
p2p$.com.common.LogPipDefault = JClass.extend_({
	records_ : null,
	uploadTimer_ : null,
	logServer_ : null,
	logDom_ : null,
	maxRecordCount_ : 500,
	nextLogId_ : 0,
	downloader_:null,

	init : function(logServer) {
		this.records_ = [];
		this.uploadTimer_ = null;
		this.downloader_ = null;
		this.logServer_ = logServer;
		this.nextLogId_ = 1;
		this.logDom_ = document.getElementById("cde-log-container");
	},

	setUploadTimeout_ : function(timeoutMs) {
		var me = this;
		this.uploadTimer_ = setTimeout(function() {
			me.onUploadTimeout_();
		}, timeoutMs);
	},

	onUploadTimeout_ : function() {
		this.upload();
		this.setUploadTimeout_(2000);
	},

	addRecord_ : function(level, name, log) {
		// this.records_.push(log);

		var logTime = p2p$.com.common.Global.getCurentTime_();
		var formatLog = "[" + logTime + " - " + name + "]" + log;

		if (this.logServer_) {
			$.post(this.logServer_, {
				sessionid : "lmpn",
				log : formatLog
			}, function(data, status) {
			});
		}

		if (this.logDom_) {
			try {
				if (this.logDom_.value.length > 100000) {
					this.logDom_.value = "";
				}
				if (this.logDom_.value) {
					this.logDom_.value += "\r\n";
				}
				this.logDom_.value += formatLog;
			} catch (e) {
			}
		}

		if (this.records_.length >= this.maxRecordCount_) {
			this.records_.shift();
		}
		var localTime = new Date().getTime() * 1000;
		this.records_.push({
			level : level,
			id : this.nextLogId_++,
			localTime : localTime,
			absTime : localTime,
			content : log
		});
	},

	upload : function() {
		var params = "";
		for ( var n = 0; n < this.records_.length; n++) {
			params += this.records_[n] + "\r\n";
		}
		this.records_ = [];
		this.downloader_ = new p2p$.com.loaders.HttpDownLoader({url_:"http://127.0.0.1:8000/", scope_:this, method_:"POST", tag_:"upload::log",postData_:{
			log : params
		}});
		this.downloader_.load_();
	},

	onHttpDownloadCompleted_ : function(downloader) {
		var handled = false;
		this.downloader_ = null;
		if ("upload::log" == downloader.tag_) {
			if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
				// waiting for timeout and retry ...
				return handled;
			} else {

			}
		}
	},

	require : function(lastId, lastTime, level, filter, limit, maxLogTime, order) {
		if (typeof order == 'undefined') {
			order = false;
		}
		var result = {
			records : [],
			maxLogTime : maxLogTime
		};
		for ( var i = 0; i < this.records_.length; i++) {
			var item = this.records_[i];
			if (item.id <= lastId || item.absTime <= lastTime) {
				continue;
			} else if ((item.level & level) == 0) {
				continue;
			} else if (filter && item.content.indexOf(filter) < 0) {
				continue;
			}

			result.maxLogTime = Math.max(result.maxLogTime, item.absTime);
			if (!order) {
				result.records.unshift(item);
			} else {
				result.records.push(item);
			}

			if (result.records.length >= limit) {
				break;
			}
		}
		return result;
	}
});
