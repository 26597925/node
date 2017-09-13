p2p$.ns('com.webp2p.protocol.cdn');

p2p$.com.webp2p.protocol.cdn.RequestRange = JClass.extend_({
	downloading_ : null,
	updated_ : false,
	urgent_ : false,
	urlOffset_ : 0,
	segmentId_ : 0,
	segmentSize_ : 0,
	tryTimes_ : 0,
	offset_ : 0,
	length_ : 0,
	dataUsed_ : 0,
	pieceUsed_ : 0,
	url_ : "",
	startIndex_ : 0,
	endIndex_ : 0,
	pieces_ : null,

	init : function() {
		this.pieces_ = [];
		this.downloading_ = false;
		this.updated_ = false;
		this.urgent_ = false;
		this.urlOffset_ = -1;
		this.segmentId_ = -1;
		this.segmentSize_ = 0;
		this.tryTimes_ = 0;
		this.offset_ = 0;
		this.length_ = 0;
		this.dataUsed_ = 0;
		this.pieceUsed_ = 0;
		this.startIndex_ = 0;
		this.endIndex_ = 0;
	},

	addPiece_ : function(piece) {
		this.updated_ = true;

		var exists = false;
		for ( var n = 0; n < this.pieces_.length; n++) {
			var item = this.pieces_[n];
			if (item.type_ == piece.type_ && item.id_ == piece.id_) {
				exists = true;
				break;
			}
		}
		if (!exists) {
			this.pieces_.push(piece.fork());
		}
		return !exists;
	},

	preparePieces_ : function(forkRange) {
		this.offset_ = 0;
		this.length_ = 0;
		this.pieces_.sort(function(item1, item2) {
			return item1.offset_ - item2.offset_;
		});
		// std::sort(pieces_.begin(), pieces_.end());
		if (this.segmentSize_ <= 0) {
			return;
		}

		var lastIndex = -1;
		var newSize = 0;
		for ( var n = 0; n < this.pieces_.length; n++) {
			var piece = this.pieces_[n];
			if (piece.size_ <= 0) {
				this.offset_ = 0;
				this.length_ = 0;
				return;
			} else if (piece.completedTime_ > 0) {
				// alreay completed, skip
				continue;
			}

			if (lastIndex < 0) {
				lastIndex = piece.index_;
				this.offset_ = piece.offset_;
				this.length_ = piece.size_;
				newSize++;
				this.startIndex_ = this.endIndex_ = lastIndex;
				continue;
			}
			if (lastIndex + 1 != piece.index_) {
				// multi segments
				forkRange.addPiece_(piece);
				continue;
			}
			this.endIndex_ = lastIndex = piece.index_;
			this.length_ += piece.size_;
			newSize++;
		}

		if (this.length_ >= this.segmentSize_ && this.urlOffset_ < 0) {
			// full request
			this.length_ = 0;
		}
	}
});
