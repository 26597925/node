var rc$ = {
	ns: function(_space) {
		var names_ = (_space + '').split(".");
		var objs_ = this;
		for ( var i = 0; i < names_.length; i++) {
			var subName_ = names_[i];
			var subType_ = typeof (objs_[subName_]);
			if (subType_ != 'object' && subType_ != 'undefined') {
				throw "Invalid namespace " + _space + ", sub: " + subName_;
			}
			objs_ = objs_[subName_] = objs_[subName_] || {};
		}
	},
	apply : function(_dest, _src) {
		for ( var n in _src) {
			_dest[n] = _src[n];
		}
	},
	applyIf : function(_dest, _src) {
		for ( var n in _src) {
			if (typeof (_dest[n]) != 'undefined') {
				_dest[n] = _src[n];
			}
		}
	}
};
