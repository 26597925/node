p2p$.ns("com.webp2p.core.storage");

p2p$.com.webp2p.core.storage.BucketStatic = {
	kLowDataCapacity : 30 * 1024 * 1024,
	kUpperMemoryCapacity : 60 * 1024 * 1024,
	kUpperDataCapacity : 1000 * 1024 * 1024
},

p2p$.com.webp2p.core.storage.Bucket = CdeBaseClass.extend_({
	name_ : "",
	opened_ : false,
	dataSize_ : 0,
	dataCapacity_ : 0,
	upperCapacity_ : 0,
	maxOpenBlocks_ : 0,

	init : function(name) {
		this.name_ = name;
		this.opened_ = false;
		this.dataSize_ = 0;
		this.dataCapacity_ = p2p$.com.webp2p.core.storage.BucketStatic.kLowDataCapacity;
		this.upperCapacity_ = p2p$.com.webp2p.core.storage.BucketStatic.kUpperDataCapacity;
		this.maxOpenBlocks_ = 500;
	},

	getName_ : function() {
		return this.name_;
	},

	getDataSize_ : function() {
		return this.dataSize_;
	},

	getDataCapacity_ : function() {
		return this.dataCapacity_;
	},

	getMaxOpenBlocks_ : function() {
		return this.maxOpenBlocks_;
	},

	setDataCapacity_ : function(size) {
		var old = this.dataCapacity_;
		if (size <= this.upperCapacity_) {
			this.dataCapacity_ = p2p$.com.webp2p.core.storage.BucketStatic.kLowDataCapacity > size ? p2p$.com.webp2p.core.storage.BucketStatic.kLowDataCapacity
					: size;
		} else {
			this.dataCapacity_ = this.upperCapacity_;
		}
		return old;
	},

	available : function() {
		return this.opened_;
	},
});