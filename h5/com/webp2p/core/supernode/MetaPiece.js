p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.MetaPiece = JClass.extend_({
	id_ : 0,
	type_ : 0,
	key_ : 0,
	offset_ : 0,
	size_ : 0,
	wild_ : false,
	checksum_ : 0,
	index_ : 0,

	// status
	randomNumber_ : 0,
	transferDepth_ : 0,
	receiveProtocol_ : 0,
	shareInRanges_ : 0,
	receiveByStable_ : false,
	receiveByOther_ : false,
	receiveSessionId_ : 0,
	receiveStartTime_ : 0,
	playedTime_ : 0,
	completedTime_ : 0,
	recvTimes_ : 0,
	writeTimes_ : 0,

	init : function() {
		this.id_ = 0;
		this.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
		this.key_ = 0;
		this.offset_ = 0;
		this.size_ = 0;
		this.wild_ = false;
		this.checksum_ = 0;
		this.index_ = 0;
		this.randomNumber_ = Math.floor(Math.random() * 100 + 1);
		this.transferDepth_ = 0;
		this.receiveProtocol_ = 0;
		this.shareInRanges_ = 0;
		this.receiveByStable_ = false;
		this.receiveByOther_ = false;
		this.receiveSessionId_ = 0;
		this.receiveStartTime_ = 0;
		this.playedTime_ = 0;
		this.completedTime_ = 0;
		this.recvTimes_ = 0;
	},

	fork : function() {
		var result = new p2p$.com.webp2p.core.supernode.MetaPiece();
		for ( var n in this) {
			result[n] = this[n];
		}
		return result;
	},

	verify : function(data, size) {
		if (this.size_ <= 0 || this.wild_) {
			return true;
		}

		var step = 47;
		var pos = 0;
		var sum = 0xffffffff;
		if (size >= 188) {
			pos += 4;
			while (pos + step < size) {
				// uint32 item1 = core::common::network2Host32(*(uint32 *)(data + pos));
				// uint32 item2 = (uint32(data[pos]) << 24) + (uint32(data[pos + 1]) << 16) + (uint32(data[pos + 2]) << 8) + (uint32(data[pos + 3]));
				// p2p$.com.webp2p.core.common.Number.convertToValue_('8',value,_position);'4',value,_position
				var item1 = p2p$.com.webp2p.core.common.Number.convertToValue_('4', data, pos);
				sum ^= item1;
				pos += step;
			}
		}
		sum = (~(((sum >> 16) & 0xffff) + (sum & 0xffff))) & 0xffff;
		return this.checksum_ == sum;
	},

	verifyWithCrc32_ : function(data, size) {
	},

	getTypeName_ : function() {
	},
	getAllStatus_ : function(result) {
		result["id"] = this.id_;
		result["index"] = this.index_;
		result["type"] = this.type_;
		result["offset"] = this.offset_;
		result["size"] = this.size_;
		result["wild"] = this.wild_;
		result["checksum"] = this.checksum_;
		result["transferDepth"] = this.transferDepth_;
		result["shareInRanges"] = this.shareInRanges_;
		result["receiveProtocol"] = this.receiveProtocol_;
		result["receiveByStable"] = this.receiveByStable_;
		result["receiveStartTime"] = this.receiveStartTime_;
		result["playedTime"] = this.playedTime_;
		result["completedTime"] = this.completedTime_;
	}
});
