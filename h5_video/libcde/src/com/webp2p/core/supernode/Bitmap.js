p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.BitmapStatic = {
	kMaxBitCount : 80 * 1000,
};

p2p$.com.webp2p.core.supernode.Bitmap = CdeBaseClass.extend_({
	data_ : null,

	init : function() {
		this.data_ = new p2p$.com.webp2p.core.common.Map();
	},

	getValue : function(id) {
		var index = id % p2p$.com.webp2p.core.supernode.BitmapStatic.kMaxBitCount;
		var offset = Math.floor(index / 8);
		var retValue = {
			value : 0,
		};
		if (index < 0 || offset < 0 || !this.data_.find2(offset, retValue)) {
			return false;
		}
		// this.data_.find2(offset,retValue);
		var value = retValue.value;// this.data_.get(offset);
		var old = (value & (1 << (index % 8))) ? true : false;
		return old;
	},

	setValue : function(id, bit) {

		var index = id % p2p$.com.webp2p.core.supernode.BitmapStatic.kMaxBitCount;
		var offset = Math.floor(index / 8);
		if (index < 0 || offset < 0) {
			return false;
		}
		var value = this.data_.get(offset);
		if (typeof value == 'undefined' || value == null) {
			value = new Uint8Array(1);
			this.data_.set(offset, value);
		}
		var old = (value & (1 << (index % 8))) ? true : false;
		value |= (1 << (index % 8));
		this.data_.set(offset, value);
		return old;
	},

	reserve : function(size) {
	},

	clear : function(reserveBuffer) {
		if (reserveBuffer) {
			for ( var i = 0; i < this.data_.elements_.length; i++) {
				this.data_.elements_[i].value = new Uint8Array(1);
			}
		} else {
			this.data_.clear();
		}
	}
});