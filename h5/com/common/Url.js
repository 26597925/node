p2p$.ns("com.common");
p2p$.com.common.Url = JClass.extend_({
	protocol_ : "",
	host_ : "",
	port_ : 0,
	path_ : "",
	file_ : "",
	segment_ : "",
	params_ : null,

	init : function() {
		this.protocol_ = "";
		this.host_ = "";
		this.port_ = 0;
		this.path_ = "";
		this.file_ = "";
		this.segment_ = "";
		this.params_ = new p2p$.com.common.Map();
	},

	getParams : function() {
		return this.params_;
	},

	fromString_ : function(value) {
		p2p$.com.common.String.parseUrl_(value, this, false);
	},

	toString : function() {
		var isDefaultPort = (this.port_ == 0) || (this.protocol_ == "http" && this.port_ == 80) || (this.protocol_ == "https" && this.port_ == 443);
		var protocolName = this.protocol_ == "" ? "http" : this.protocol_;

		var value;
		if (isDefaultPort) {
			value = protocolName + "://" + this.host_ + this.file_;
		} else {
			value = protocolName + "://" + this.host_ + ":" + this.port_ + this.file_;
		}

		return value + this.toQueryString_();
	},

	toQueryString_ : function(fromFirst) {
		var value = "";
		var isFirstKey = true;
		if (typeof fromFirst == 'undefined') {
			isFirstKey = true;
		} else {
			isFirstKey = fromFirst;
		}
		if (!this.params_.empty()) {
			for ( var i = 0; i < this.params_.elements_.length; i++) {
				// var vthis.params_.elements_[i].value
				if (isFirstKey) {
					value += "?";
				} else {
					value += "&";
				}
				value += (p2p$.com.common.String.urlEncodeNonAscii_(this.params_.elements_[i].key) + "=" + p2p$.com.common.String.urlEncodeNonAscii_(this.params_.elements_[i].value));
				isFirstKey = false;
			}
		}

		if (this.segment_ != "") {
			value += "#";
			value += segment_;
		}
		return value;
	}
});
