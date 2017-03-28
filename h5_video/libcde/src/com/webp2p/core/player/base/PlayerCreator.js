p2p$.ns('com.webp2p.core.player.base');
p2p$.com.webp2p.core.player.base.PlayerCreator = CdeBaseClass.extend_({
	channel_ : null,
	player_ : null,
	playUrl_ : "",
	videoBox_ : null,
	videoStream_ : null,
	cdeMediaPlayer_ : null,

	init : function() {
		this.channel_ = null;
		this.player_ = null;
		this.playUrl_ = "";
		this.videoBox_ = null;
		this.videoStream_ = null;
	},

	initialize_ : function(player, playUrl, videoBox, videoStream) {
		this.cdeMediaPlayer_ = player;
		this.playUrl_ = playUrl;
		this.videoBox_ = videoBox;
		this.videoStream_ = videoStream;
	},

	changeChannel_ : function(playUrl) {
		this.playUrl_ = playUrl;
		this.player_.stop();
		this.player_ = null;
	},

	createPlayer_ : function() {

		this.channel_ = this.videoStream_.requestPlay_(this.playUrl_);
		if (this.channel_ != null) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::base::PlayerCreator::Create player open channel({0}) success", this.playUrl_));
			if (this.channel_.type_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod) {
				// VOD
				this.player_ = new p2p$.com.webp2p.core.player2.vod.Player(this.cdeMediaPlayer_);
				if (this.cdeMediaPlayer_.firstSeekTime_) {
					this.channel_.setFirstSeekTime_(this.cdeMediaPlayer_.firstSeekTime_);
				}
			} else {
				// LIVE
				this.player_ = new p2p$.com.webp2p.core.player2.live.Player(this.cdeMediaPlayer_);
			}
			// this.startMainTimer();
			if (this.player_ != null) {
				this.player_.initialize_(this.playUrl_, this.videoBox_, this.videoStream_, this.channel_,
						p2p$.com.webp2p.core.player.base.PLAY_TYPE.kPlayTypeBinary);
				if (this.player_.playerContext_.metaDataType_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod) {
					if (this.cdeMediaPlayer_.firstSeekTime_) {
						this.player_.firstSeekStatus_ = this.player_.kFirstSeekInit;
						this.player_.firstSeekPosition_ = this.cdeMediaPlayer_.firstSeekTime_;
					}
				}

			} else {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::PlayerCreator.Create player failed"));
			}
		} else {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::base::PlayerCreator::Create player open channel({0}) failed", this.playUrl_));
		}

		return this.player_;
	}
});