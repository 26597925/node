var CdeLocalPlayer = CdeBaseClass.extend_({
	player_ : null,
	playerContext_ : null,
	http_ : null,
	url_ : "",
	cdeMediaPlayer_ : null,

	init : function(cdeMediaPlayer, player, playUrl) {
		this.cdeMediaPlayer_ = cdeMediaPlayer;
		this.player_ = player;
		this.playerContext_ = new p2p$.com.webp2p.core.player.Context();
		this.http_ = null;
		this.url_ = playUrl;
	},
	play : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Start play ...", this.url_));
		this.player_.play();
	},
	replay : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::replay ...", this.url_));
		this.seek(1);
	},
	pause : function() {
		this.player_.pause();
	},
	stop : function() {
		this.player_.pause();
	},
	seek : function(pos) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::seek ...({0})", pos));
		this.player_.currentTime = pos;
	},
	getCurrentPosition : function() {
		return this.player_.currentTime;
	},
	getDuration : function() {
		return this.player_.duration;
	},
	getCurrentBuffered : function() {
		return -1;
	},
	playLocalUrl_ : function() {
		if (this.http_) {
			this.http_.abort();
			this.http_ = null;
		}
		var urlInfo = CdeMediaHelper.parseUrl(this.url_);
		urlInfo.params_.set('format', '1');
		urlInfo.params_.set('expect', '3');
		urlInfo.params_.set('ajax', '1');
		if (!urlInfo.params_.has('stream_id')) {
			urlInfo.params_.set('tss', 'no');
		}
		var gslbUrl = urlInfo.toString();
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::Start download gslb url: {0} ...", gslbUrl));

		var me = this;
		this.http_ = $.ajax({
			url : gslbUrl,
			type : 'GET',
			error : function(request, textStatus, errorThrown) {
				me.playLocalUrlDone_(data, textStatus, errorThrown);
			},
			success : function(data, textStatus) {
				me.playLocalUrlDone_(data, textStatus, '');
			}
		});

		var env = p2p$.com.webp2p.core.supernode.Enviroment;
		var report = new p2p$.com.webp2p.core.supernode.Url();
		report.protocol_ = "http";
		report.host_ = env.getHostDomain_("s.webp2p.letv.com");
		report.file_ = "/ClientStageInfo";
		report.params_.set("act", "0");
		report.params_.set("err", "1");
		report.params_.set("utime", CdeMediaHelper.initializeTime_ || 0);
		report.params_.set("type", urlInfo.params_.has("stream_id") ? "liv" : "vod");
		report.params_.set("termid", urlInfo.params_.get("termid"));
		report.params_.set("platid", urlInfo.params_.get("platid"));
		report.params_.set("splatid", urlInfo.params_.get("splatid"));
		report.params_.set("vtype", urlInfo.params_.get("vtype") || "0");
		report.params_.set("streamid", urlInfo.params_.get("stream_id") || "");
		report.params_.set("ch", urlInfo.params_.get("ch") || "");
		report.params_.set("p1", urlInfo.params_.get("p1") || "");
		report.params_.set("p2", urlInfo.params_.get("p2") || "");
		report.params_.set("p3", urlInfo.params_.get("p3") || "");
		report.params_.set("uuid", urlInfo.params_.get("uuid") || "");
		report.params_.set("p2p", "0");
		report.params_.set("appid", env.externalAppId_);
		report.params_.set("cdeid", env.moduleId_);
		report.params_.set("package", env.externalAppPackageName_);

		// var reportUrl = report.toString();
		// $.ajax({
		// url : reportUrl.toString(),
		// type : 'GET',
		// error : function(request, textStatus, errorThrown) {
		// P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::Report stage failed({0}, url: {1}", textStatus, reportUrl));
		// },
		// success : function(data, textStatus) {
		// P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::Report stage ok({0}), url: {1}", textStatus, reportUrl));
		// }
		// });
	},

	playLocalUrlDone_ : function(data, textStatus, errorThrown) {

		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::Download gslb {0}: {1}, {2} ...", data ? 'success' : 'failed', textStatus + '', errorThrown + ''));
		if (!data) {
			if (this.cdeMediaPlayer_.onerror) {
				this.cdeMediaPlayer_.onerror(this);
			}
			return;
		}

		try {
			var gslbData = (typeof (data) == "string") ? eval("(" + data + ")") : data;
			var mediaUrl = gslbData.location;

			P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::Gslb responsed, error code({0}), details({1}), user ip({2}), url({3})", gslbData.ercode,
					gslbData.errinfo || '', gslbData.remote, mediaUrl));

			this.player_.src = mediaUrl;
			this.addVideoEvent_(this.player_);
			this.player_.play();
		} catch (e) {
			if (this.cdeMediaPlayer_.onerror) {
				this.cdeMediaPlayer_.onerror(this);
			}
		}
	},

	addVideoEvent_ : function(video) {
		var _me = this;
		var _ve = p2p$.com.webp2p.core.player.PLAY_STATES.VideoEvents;
		for ( var i = 0; i < _ve.length; i++) {
			P2P_ULOG_TRACE(P2P_ULOG_FMT("CdeLocalPlayer::Add video event, type({0})", _ve[i]));
			try {
				video.addEventListener(_ve[i], function(evt) {
					_me.videoStatusHandler_(evt);
				});
			} catch (e) {
				P2P_ULOG_TRACE(P2P_ULOG_FMT("CdeLocalPlayer::Add video event failed, type({0}), error({1})", _ve[i], (e || "none").toString()));
			}
		}
	},

	removeVideoEvent_ : function(video) {
		var me = this;
		var _ve = p2p$.com.webp2p.core.player.PLAY_STATES.VideoEvents;
		for ( var i = 0; i < _ve.length; i++) {
			try {
				video.removeEventListener(_ve[i], function(evt) {
					me.videoStatusHandler_(evt);
				});
			} catch (e) {
				P2P_ULOG_TRACE(P2P_ULOG_FMT("CdeLocalPlayer::Remove video event failed, type({0}), error({1})", _ve[i], (e || "none").toString()));
			}
		}
	},

	videoStatusHandler_ : function(evt) {
		var _type = evt.type;
		P2P_ULOG_TRACE(P2P_ULOG_FMT("CdeLocalPlayer::Video status handler, type({0})", _type));
		switch (_type) {
		case "abort":
			break;
		case "canplay":
			this.onVideoCanPlay_(evt);
			break;
		case "canplaythrough":
			// this.onCanPlayThrough_();
			break;
		case "durationchange":
			this.durationChange_();
			break;
		case "emptied":
			break;
		case "ended":
			// this.onEnded_();
			break;
		case "error":
			this.onError_(evt);
			break;
		case "loadeddata":
			this.onLoadedData_(evt);
			break;
		case "loadedmetadata":
			// this.onVideoLoadedMetaData_();
			break;
		case "loadstart":
			break;
		case "pause":
			P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::pause ..."));
			break;
		case "play":
			break;
		case "playing":
			// this.onVideoPlaying_();
			break;
		case "progress":

			break;
		case "ratechange":
			break;
		case "seeked":
			this.onVideoSeeked_(evt);
			break;
		case "seeking":
			this.onVideoSeeking_(evt);
			break;
		case "stalled":
			break;
		case "suspend":
			break;
		case "timeupdate":
			this.onVideoTimeUpdate_(evt);
			break;
		case "volumechange":
			break;
		case "waiting":
			// this.onVideoWaiting_(evt);
			break;
		}
	},
	durationChange_ : function() {
	},
	onLoadedData_ : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Loaded data"));
		if (this.cdeMediaPlayer_.onbufferstart) {
			this.cdeMediaPlayer_.onbufferstart();
		}
		this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.loadeddata;
	},

	onVideoCanPlay_ : function() {
		if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.loadeddata) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Video can play"));
			this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.canplay;
			if (this.cdeMediaPlayer_.onbufferend) {
				this.cdeMediaPlayer_.onbufferend();
			}
			if (this.cdeMediaPlayer_.onprepared) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Video onVideoCanPlay onprepared"));
				this.cdeMediaPlayer_.onprepared();
			}
			if (this.cdeMediaPlayer_.firstSeekTime_) {
				this.player_.currentTime = this.cdeMediaPlayer_.firstSeekTime_;
			} else {
				// this.player_.currentTime = 500;
			}
		}
	},

	onVideoSeeking_ : function() {
		var vTime = this.player_.currentTime ? this.player_.currentTime.toFixed(1) : 0;

		if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.canplay
				|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking
				|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeked) {
			if (this.cdeMediaPlayer_.onbufferstart) {
				this.cdeMediaPlayer_.onbufferstart();
			}
			this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Video seeking vTime({0}) videoStatus({1})", vTime, this.playerContext_.videoStatus_));
	},

	onVideoSeeked_ : function() {
		var vTime = this.player_.currentTime ? this.player_.currentTime.toFixed(1) : 0;
		if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking) {
			if (this.cdeMediaPlayer_.onbufferend) {
				this.cdeMediaPlayer_.onbufferend();
			}
			this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.seeked;

		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Video seeked  vTime({0}) videoStatus({1})", vTime, this.playerContext_.videoStatus_));
	},

	onVideoTimeUpdate_ : function() {
		var vLength = this.player_.duration.toFixed(1);
		var vTime = this.player_.currentTime.toFixed(1);
		var vRemaining = (vLength - vTime).toFixed(1);
		P2P_ULOG_TRACE(P2P_ULOG_FMT("CdeLocalPlayer::Video time update vTime({0}) vLength({1}) vRemaining({2})", vTime, vLength, vRemaining));
		if (Math.abs(vRemaining) <= 0.5) {
			if (this.cdeMediaPlayer_.onEnded_) {
				this.cdeMediaPlayer_.onEnded_();
			}

		}
	},

	onEnded_ : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Ended"));
		if (this.cdeMediaPlayer_.oncomplete) {
			this.cdeMediaPlayer_.oncomplete();
		}
	},

	onError_ : function(evt) {
		var details = this.player_.error ? this.player_.error.code : 'unknown';
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Error, code: {0}", details));
		if (this.cdeMediaPlayer_.onerror) {
			this.cdeMediaPlayer_.onerror();
		}

	}
});