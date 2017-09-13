p2p$.ns('com.webp2p.protocol.cdn');

p2p$.com.webp2p.protocol.cdn.DrmCrypto = JClass.extend_({
	enabled_ : false,
	handle_ : null,
	publicKey_ : "",
	encryptKey_ : "",

	init : function() {
	},
	enabled : function(on) {
		this.enabled_ = on;
	},

	open : function() {
	},
	close : function() {
	},

	decrypt : function(data, size, sequence) {
	}
});
