rc$.ns("com.relayCore.utils");

rc$.com.relayCore.utils.Url = JClass.extend_({
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
		this.params_ = new rc$.com.relayCore.utils.Map();
	},

	getParams : function() {
		return this.params_;
	},

	fromString_ : function(_value) {
		rc$.com.relayCore.utils.String.parseUrl_(_value, this, false);
	},

	toString : function() {
		var isDefaultPort_ = (this.port_ == 0) || (this.protocol_ == "http" && this.port_ == 80) || (this.protocol_ == "https" && this.port_ == 443);
		var protocolName_ = this.protocol_ == "" ? "http" : this.protocol_;

		var value_;
		if (isDefaultPort_) {
			value_ = protocolName_ + "://" + this.host_ + this.file_;
		} else {
			value_ = protocolName_ + "://" + this.host_ + ":" + this.port_ + this.file_;
		}

		return value_ + this.toQueryString_();
	},

	toQueryString_ : function(_fromFirst) {
		var value_ = "";
		var isFirstKey_ = true;
		if (typeof fromFirst == 'undefined') {
			isFirstKey_ = true;
		} else {
			isFirstKey_ = _fromFirst;
		}
		if (!this.params_.empty()) {
			for ( var i = 0; i < this.params_.elements_.length; i++) {
				// var vthis.params_.elements_[i].value
				if (isFirstKey_) {
					value_ += "?";
				} else {
					value_ += "&";
				}
				value_ += (rc$.com.relayCore.utils.String.urlEncodeNonAscii_(this.params_.elements_[i].key) + "=" + rc$.com.relayCore.utils.String
						.urlEncodeNonAscii_(this.params_.elements_[i].value));
				isFirstKey_ = false;
			}
		}

		if (this.segment_ != "") {
			value_ += "#";
			value_ += this.segment_;
		}
		return value_;
	}
});
