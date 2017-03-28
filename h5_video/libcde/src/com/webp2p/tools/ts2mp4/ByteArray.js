p2p$.ns('com.webp2p.tools.ts2mp4');

p2p$.com.webp2p.tools.ts2mp4.ByteArray = CdeBaseClass.extend_({
	position : 0,
	length : 0,
	data : null,
	autoIncrementSize_ : 1024,
	className : 'WebP2P.ts2mp4.ByteArray',

	init : function(size, writeable) {
		this.position = 0;
		this.data = new Uint8Array(size);
		this.length = writeable ? 0 : this.data.length;
	},

	bytesAvailable_ : function() {
		return this.data.length - this.position;
	},

	resize : function(size) {
		var newData = new Uint8Array(size);
		for (var i = 0; i < size && i < this.length; i++) {
			newData[i] = this.data[i];
		}
		this.data = newData;
		if (this.length > size) {
			this.length = size;
		}
	},

	getByte_ : function(index) {
		return this.data[index];
	},

	readUnsignedByte_ : function() {
		if (this.position >= this.data.length) {
			return 0;
		}
		return this.data[this.position++];
	},

	readUnsignedShort_ : function() {
		if ((this.position + 1) >= this.data.length) {
			return 0;
		}
		var value1 = this.data[this.position++];
		var value2 = this.data[this.position++];
		return (value1 << 8) + value2;
	},

	readUnsignedInt_ : function() {
		if ((this.position + 3) >= this.data.length) {
			return 0;
		}
		var value1 = this.data[this.position++];
		var value2 = this.data[this.position++];
		var value3 = this.data[this.position++];
		var value4 = this.data[this.position++];
		return (value1 << 24) + (value2 << 16) + (value3 << 8) + value4;
	},

	setByte_ : function(index, value) {
		this.data[index] = value;
	},

	writeByte_ : function(value) {
		this.writeUnsignedByte_(value);
	},

	writeUnsignedByte_ : function(value) {
		this.position = Math.min(this.position, this.length);
		if (this.data.length < this.position + 1) {
			this.resize(this.data.length + Math.max(1, this.autoIncrementSize_));
		}
		this.data[this.position++] = value;
		this.length = this.position;
	},

	writeUnsignedShort_ : function(value) {
		this.position = Math.min(this.position, this.length);
		if (this.data.length < this.position + 2) {
			this.resize(this.data.length + Math.max(2, this.autoIncrementSize_));
		}
		this.data[this.position++] = (value >> 8) & 0xff;
		this.data[this.position++] = value & 0xff;
		this.length = this.position;
	},

	writeUnsignedInt_ : function(value) {
		this.position = Math.min(this.position, this.length);
		if (this.data.length < this.position + 2) {
			this.resize(this.data.length + Math.max(4, this.autoIncrementSize_));
		}
		this.data[this.position++] = (value >> 24) & 0xff;
		this.data[this.position++] = (value >> 16) & 0xff;
		this.data[this.position++] = (value >> 8) & 0xff;
		this.data[this.position++] = value & 0xff;
		this.length = this.position;
	},

	writeBytes_ : function(bytes, start, size) {
		var byteSize = bytes.length || 0;
		start = start || 0;
		size = size || byteSize;

		if (bytes.className == 'WebP2P.ts2mp4.ByteArray') {
			bytes = bytes.data;
		}

		size = Math.min(size, byteSize - start);
		if (start < 0 || size <= 0) {
			return;
		}

		this.position = Math.min(this.position, this.length);
		if (this.data.length < this.position + size) {
			this.resize(this.data.length + Math.max(size, this.autoIncrementSize_));
		}

		var maxIndex = start + size;
		this.data[this.position + size - 1] = 0;
		for (var i = start; i < maxIndex && i < byteSize; i++) {
			this.data[this.position++] = bytes[i];
		}
		this.length = this.position;
	}
});