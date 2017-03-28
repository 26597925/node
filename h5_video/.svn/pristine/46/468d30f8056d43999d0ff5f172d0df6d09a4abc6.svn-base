p2p$.ns("com.webp2p.core.storage");

p2p$.com.webp2p.core.storage.Pool = {

	buckets_ : null,
	memoryBucket_ : null,

	initialize_ : function(manager) {
		this.buckets_ = [];
		this.memoryBucket_ = null;
		this.memoryBucket_ = new p2p$.com.webp2p.core.storage.MemoryBucket(manager);
		this.buckets_.push(this.memoryBucket_);

		for ( var n = 0; n < this.buckets_.length; n++) {
			var item = this.buckets_[n];
			if (!item.open()) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::Pool::Open bucket({0}) failed", item.getName_()));
				return false;
			}
		}

		// if( params.isMember("core.storage.maxMemoryDataSize") )
		// {
		// // Mega-Bytes
		// int64 dataCapacity = params["core.storage.maxMemoryDataSize"].asInt64() * core::common::kByteUnitsPerMega;
		// int64 oldCapacity = memoryBucket_->setDataCapacity_(dataCapacity);
		//
		// __ULOG_INFO(__ULOG_FMT("core::storage::Pool", "Set memory storage bucket data capacity(" _I64FMT_ " to " _I64FMT_ " bytes)..."),
		// oldCapacity, dataCapacity);
		// }

		P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::Pool::Initialize successfully"));
		return true;
	},

	exit : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::Pool::Exiting...."));
		for ( var n = 0; n < this.buckets_.length; n++) {
			var item = this.buckets_[n];
			item.close();
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::Pool::Exited"));
	},

	getDefaultBucket_ : function() {
		return this.memoryBucket_;
	},

	getMemoryBucket_ : function() {
		return this.memoryBucket_;
	}
};