p2p$.ns('com.webp2p.core.player');

p2p$.com.webp2p.core.player.Creator = JClass.extend_({
	channel_ : null,
	player_ : null,
	url_ : "",
	video_ : null,
	stream_ : null,
	wrapper_ : null,
	tag_:"com::webp2p::core::player::Creator",

	init : function() {
		this.channel_ = null;
		this.player_ = null;
		this.url_ = "";
		this.video_ = null;
		this.stream_ = null;
	},

	initialize_ : function(wrapper, url, video, stream) {
		this.wrapper_ = wrapper;
		this.url_ = url;
		this.video_ = video;
		this.stream_ = stream;
	},

	changeChannel_ : function(url) {
		this.url_ = url;
		this.channel_ != null ? this.channel_.close_():"";
		this.player_.stop_();
		this.player_ = null;
	},

	createPlayer_ : function() {

		this.channel_ = this.stream_.requestPlay_(this.url_);
		if (this.channel_ != null) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Create player open channel({1}) success",this.tag_,this.url_));
			this.channel_.setListener_(this.wrapper_);
			this.channel_.open();
			if (this.channel_.type_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod) {
				// VOD
				this.player_ = new p2p$.com.webp2p.core.player.VodPlayer(this.wrapper_);
				if (this.wrapper_.config_.startTime>0) {
					this.channel_.setFirstSeekTime_(this.wrapper_.config_.startTime);
				}
			} else {
				// LIVE
				this.player_ = new p2p$.com.webp2p.core.player.LivePlayer(this.wrapper_);
			}

			if (this.player_ != null) {
				this.player_.initialize_(this.url_, this.video_, this.stream_, this.channel_);
				if (this.player_.playerContext_.metaDataType_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod) {
					if (this.wrapper_.config_.startTime>0) {
						this.player_.firstSeekStatus_ = this.player_.kFirstSeekInit;
						this.player_.firstSeekPosition_ = this.wrapper_.config_.startTime;
					}
				}
			} else {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}.Create player failed",this.tag_));
			}
		} else {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Create player open channel({1}) failed",this.tag_,this.url_));
		}
		return this.player_;
	}
});
