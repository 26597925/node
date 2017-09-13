p2p$.ns('com.webp2p.protocol.base');

p2p$.com.webp2p.protocol.base.PieceRangeItem = JClass.extend_({
	type_ : 0,
	count_ : 0,
	start_ : 0,
	init : function() {
		this.type_ = 0;
		this.count_ = 0;
		this.start_ = 0;
	},
});

p2p$.com.webp2p.protocol.base.RequestDataItem = JClass.extend_({
	urgent_ : false,
	segmentId_ : 0,
	pieceId_ : 0,
	pieceType_ : 0,
	checksum_ : 0,
	init : function() {
		this.urgent_ = false;
		this.segmentId_ = -1;
		this.pieceId_ = 0;
		this.pieceType_ = 0;
		this.checksum_ = 0;
	},
});

p2p$.com.webp2p.protocol.base.ResponseDataItem = JClass.extend_({
	segmentId_ : 0,
	pieceId_ : 0,
	pieceType_ : 0,
	pieceKey_ : 0,
	data_ : "",
	init : function() {
		this.segmentId_ = -1;
		this.pieceId_ = 0;
		this.pieceType_ = 0;
		this.pieceKey_ = 0;
	},
});

p2p$.com.webp2p.protocol.base.Message = JClass.extend_({
	type_ : "",
	ranges_ : null,
	requests_ : null,
	responses_ : null,
	init : function() {
		this.type_ = 0;
		this.ranges_ = [];
		this.requests_ = [];
		this.responses_ = [];
	},
	empty : function() {
		return this.ranges_.length == 0 && this.requests_.length == 0 && this.responses_.length == 0;
	}
});
