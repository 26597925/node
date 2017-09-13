p2p$.ns("com.player");
p2p$.com.player.MediaPlayer = p2p$.com.player.BasePlayer.extend_({
	init:function(video)
	{
		this._super(video);
		this.tag_="com::player::MediaPlayer";
	},
	start:function()
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0} start url({1})",this.tag_,this.url_));
		if (!this.url_) {
			return;
		}
		this.stream_ = p2p$.com.webp2p.core.entrance.VideoStream;
		this.stream_.init();
		this.creator_ = new p2p$.com.webp2p.core.player.Creator();
		this.creator_.initialize_(this, this.url_, this.video_, this.stream_);
		this.player_ = this.creator_.createPlayer_();
	},
	pause:function()
	{
        if (!this.url_) {
            return;
        }
        if (!this.creator_) {
            return;
        }
        if (this.player_) {
            P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::pause...",this.tag_));
            this.player_.pause();
        }
	},
	resume:function()
	{

	},
	openUrl_:function(url)
	{
		this.url_=url;
		if(!this.creator_){
			this.start();
			return;
		}
		this.creator_.changeChannel_(url);
		this.player_ = this.creator_.createPlayer_();
	}
});
