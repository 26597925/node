p2p$.util = {
	apply : function(dest, source) {
		for ( var name in source) {
			dest[name] = source[name];
		}
		return dest;
	},

	applyIf : function(dest, source) {
		for ( var name in source) {
			if (typeof (dest[name]) == 'undefined') {
				dest[name] = source[name];
			}
		}
		return dest;
	}
};