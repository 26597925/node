p2p$.ns("com.webp2p.core.storage");

p2p$.com.webp2p.core.storage.MemoryBlock = CdeBaseClass.extend_({
	archived_ : false,
	activeTime_ : 0,
	writeTime_ : 0,
	archiveTime_ : 0,
	data_ : "",

	init : function() {
		this.archived_ = false;
		this.activeTime_ = 0;
		this.writeTime_ = 0;
		this.archiveTime_ = 0;
		this.data_ = "";// new ArrayBuffer(0);
	},
});

p2p$.com.webp2p.core.storage.MemoryBucket = p2p$.com.webp2p.core.storage.Bucket.extend_({
	lowCapacity_ : false,
	blocks_ : null,
	manager_ : null,

	init : function(manager) {
		this.manager_ = manager;
		this._super("memory");
		this.lowCapacity_ = false;
		this.blocks_ = new p2p$.com.webp2p.core.common.Map();// p2p$.com.webp2p.core.storage.MemoryBlock();
	},

	open : function() {
		this.blocks_.clear();

		// core::common::PhysicalMemory memory;
		// if( !core::common::System::getPhysicalMemory(memory) )
		// {
		// __ULOG_ERROR(__ULOG_FMT_ERR("core::storage::MemoryBucket", "Query system physical memory info failed"), __UERR_CODE, __UERR_STR);
		// }

		this.lowCapacity_ = false;
		this.dataCapacity_ = 200 * 1024 * 1024;// memory.availableBytes_ / 5;
		this.upperCapacity_ = this.dataCapacity_;
		if (this.dataCapacity_ < p2p$.com.webp2p.core.storage.BucketStatic.kLowDataCapacity) {
			this.lowCapacity_ = true;
			this.dataCapacity_ = p2p$.com.webp2p.core.storage.BucketStatic.kLowDataCapacity;
			this.upperCapacity_ = this.dataCapacity_;
		} else if (this.dataCapacity_ > p2p$.com.webp2p.core.storage.BucketStatic.kUpperMemoryCapacity) {
			this.dataCapacity_ = p2p$.com.webp2p.core.storage.BucketStatic.kUpperMemoryCapacity;
		}

		// P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::MemoryBucket::System physical memory total size(" _U64FMT_ " Bytes), available " _U64FMT_ " Bytes, using "
		// _I64FMT_
		// " Bytes"),
		// memory.totalBytes_, memory.availableBytes_, dataCapacity_);
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::MemoryBucket::Open successfully"));

		// memory always open
		this.opened_ = true;
		return true;
	},

	close : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::MemoryBucket::losing...."));

		this.opened_ = false;
		this.blocks_.clear();

		P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::MemoryBucket::Closed"));
		return true;
	},

	clearExpiredBlocks_ : function(currentId) {
		var removedCount = 0;
		var minBlockTime = -1;
		var elemIndex = null;
		for ( var n = 0; n < this.blocks_.length; n++) {
			// ignore current block
			var elem = this.blocks_.element(n);
			if (elem.key == currentId) {
				continue;
			}
			if (minBlockTime < 0 || elem.value.writeTime_ < minBlockTime) {
				elemIndex = elem;
				minBlockTime = elem.value.writeTime_;
			}
		}
		if (elemIndex != this.blocks_.element(this.blocks_.length - 1)) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::MemoryBucket::Clear expire block({0}), size({1}), last write({2})", elemIndex.key,
					elemIndex.value.data_.length, p2p$.com.webp2p.core.common.String.formatTime_(elemIndex.value.writeTime_, "yyyy-M-d h:m:s")));

			removedCount++;
			this.dataSize_ -= elemIndex.value.data_.length;
			this.blocks_.erase(elemIndex.key);
			var items = elemIndex.key.split("//");
			if (items.length >= 3) {
				for ( var n = 0; n < this.manager_.channels_.length; n++) {
					var mapItem = this.manager_.channels_.element(n);
					if (mapItem.value.id_ == items[1]) {
						var channel = mapItem.value;
						channel.resetSegmentPieceCompletion_(items[2]);
					}
				}
			}

		}
		return removedCount;
	},

	exists : function(objectId) {
		return this.blocks_.find(objectId);
	},

	archived : function(objectId) {
	},

	read : function(objectId, offset, size) {
		var itrFind = this.blocks_.find(objectId);
		if (!itrFind) {
			return -1;
		}
		if (typeof size == 'undefined') {
			size = p2p$.com.webp2p.core.common.Number.maxUnsignedValue_();
		}
		var block = this.blocks_.get(objectId);
		var stream = null;
		if (size == p2p$.com.webp2p.core.common.Number.maxUnsignedValue_()) {
			stream = block.data_;
		} else if (offset == 0 && size == block.data_.length) {
			stream = block.data_;
		} else {
			stream = block.data_.subarray(offset, offset + size);
		}
		return stream;

		// {"stream":block,"block":tmpBlock};
		// size_t offsize = (block.data_.size() > offset) ? (block.data_.size() - offset) : 0;
		// block.activeTime_ = core::common::getHighResolutionTime();
		// if( nullptr == data )
		// {
		// return offsize;
		// }
		//
		// size_t result = std::min<size_t>(size, offsize);
		// memcpy(data, block.data_.data() + offset, result);
	},

	write : function(objectId, offset, data, size) {
		if (this.dataSize_ + size > this.dataCapacity_) {
			while (this.dataSize_ + size > this.dataCapacity_) {
				if (this.clearExpiredBlocks_(objectId) <= 0) {
					break;
				}
			}
		}
		var block = this.blocks_.get(objectId);
		block.activeTime_ = block.writeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		var minSize = offset + size;
		var allocSize = (minSize > block.data_.length) ? (minSize - block.data_.length) : 0;
		if (allocSize > 0) {
			block.data_ = new Uint8Array(minSize);
			this.dataSize_ += allocSize;
		}
		block.data_.set(data, offset);
		// memcpy((uint8 *)(block.data_.data() + offset), data, size);
		return true;
	},

	archive : function(objectId, archived) {
	},

	reserve : function(objectId, size) {
		var block = this.blocks_.get(objectId);
		if (typeof block == 'undefined' || block == null) {
			block = new p2p$.com.webp2p.core.storage.MemoryBlock();
			this.blocks_.set(objectId, block);
		}
		block.activeTime_ = block.writeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		var allocSize = (size > block.data_.length) ? (size - block.data_.length) : 0;
		if (allocSize > 0) {
			block.data_ = new Uint8Array(size);
			this.dataSize_ += allocSize;
		}
		return true;
	},

	remove : function(objectId) {
		var itrFind = this.blocks_.find(objectId);
		if (!itrFind) {
			return -1;
		}
		var block = this.blocks_.get(objectId);
		this.dataSize_ -= block.data_.length;
		this.blocks_.erase(objectId);
		return true;
	}
});