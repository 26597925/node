var p2p$ = {
	ns: function(space) {
		var names = (space + '').split(".");
		var objs = this;
		for ( var i = 0; i < names.length; i++) {
			var subName = names[i];
			var subType = typeof (objs[subName]);
			if (subType != 'object' && subType != 'undefined') {
				throw "Invalid namespace " + space + ", sub: " + subName;
			}
			objs = objs[subName] = objs[subName] || {};
		}
	},
	apply : function(dest, src) {
		for ( var n in src) {
			dest[n] = src[n];
		}
	},

	applyIf : function(dest, src) {
		for ( var n in src) {
			if (typeof (dest[n]) != 'undefined') {
				dest[n] = src[n];
			}
		}
	}
};
