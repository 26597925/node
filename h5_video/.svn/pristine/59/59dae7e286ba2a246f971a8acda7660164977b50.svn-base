var p2p$ = {
	ns : function(space) {
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
	}
};