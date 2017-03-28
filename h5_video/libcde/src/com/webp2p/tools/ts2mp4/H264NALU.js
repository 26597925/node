p2p$.ns('com.webp2p.tools.ts2mp4');

p2p$.com.webp2p.tools.ts2mp4.H264NALU = CdeBaseClass.extend_({
	data : null,

	init : function(source) {
		this.data = source;
	},

	NALtype : function() {
		return this.data.getByte_(0) & 0x1f;
	},

	length : function() {
		return this.data.length;
	},

	NALdata : function() {
		return this.data;
	}
});