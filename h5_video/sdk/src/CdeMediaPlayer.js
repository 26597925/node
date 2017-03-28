CdeMediaPlayer = CdeBaseClass.extend_({

	// events
	onprepared : null,
	onbufferstart : null,
	onbufferend : null,
	oncomplete : null,
	onerror : null,

	// properties
	url_ : null,
	playerTimer_ : null,
	playerCreated_ : false,
	videoStream_ : null,
	logicPlayer_ : null,
	localPlayer_ : null,
	pendingCallbacks_ : null,
	playWithCdeLocalPlayer_ : false,
	firstSeekTime_ : 0,
	preload_ : true,
	// constructor
	init : function(url, el, params) {

		params = params || {};
		if ((el.tagName + '').toLowerCase() == 'video') {
			this.localPlayer_ = el;
		} else {
			this.localPlayer_ = document.createElement("video");

			if (params && params.playerAttributes) {
				try {
					for ( var n in params.playerAttributes) {
						newVideo[n] = params.playerAttributes[n];
					}
				} catch (e) {
					// Ignore
				}
			}
			while (el.childNodes.length > 0) {
				el.removeChild(el.childNodes[0]);
			}
			el.appendChild(this.localPlayer_);
		}
		if (params.localVideo) {
			this.playWithCdeLocalPlayer_ = params.localVideo;
		}
		if (params.seekTo) {
			this.firstSeekTime_ = parseFloat(params.seekTo) || 0;
		}
		this.url_ = url;
		this.playerCreated_ = false;
		this.videoStream_ = p2p$.com.webp2p.core.entrance.VideoStream;
		this.videoStream_.init();

		if (this.url_) {
			CdeMediaHelper.init(null, {
				fn : this.createPlayer_,
				scope : this
			});
		}

	},

	createPlayer_ : function() {
		if (!this.url_) {
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::createPlayer..."));
		this.playerCreated_ = true;
		if (this.firstSeekTime_) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::createPlayer::Seek to({0})", this.firstSeekTime_));
		}

		if (this.playWithCdeLocalPlayer_ || !CdeMediaHelper.supportPlayer()) {
			this.logicPlayer_ = new CdeLocalPlayer(this, this.localPlayer_, this.url_);
			this.logicPlayer_.playLocalUrl_();
		} else {
			var creator = new p2p$.com.webp2p.core.player.Creator();
			creator.initialize_(this, this.url_, this.localPlayer_, this.videoStream_);
			this.logicPlayer_ = creator.createPlayer_();
			this.firstSeekTime_ = null;
		}

		if (this.pendingCallbacks_) {
			for ( var i = 0; i < this.pendingCallbacks_.length; i++) {
				var action = this.pendingCallbacks_[i];
				action.fn.apply(action.scope || this, action.params);
			}
			this.pendingCallbacks_ = null;
		}
	},

	addPendingAction_ : function(fn, scope, params) {
		if (!this.pendingCallbacks_) {
			this.pendingCallbacks_ = [];
		}
		this.pendingCallbacks_.push({
			fn : fn,
			scope : scope,
			params : params || []
		});
	},

	getVideoStream : function() {
		return this.videoStream_;
	},

	play : function(url) {
		if (!this.url_) {
			return;
		}
		if (!this.playerCreated_) {
			this.addPendingAction_(this.play, this, [ url ]);
			return;
		}
		if (this.logicPlayer_) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::play..."));
			this.logicPlayer_.play();
		}
	},
	setSource : function(url, preload) {
		if (!this.playerCreated_ && this.url_) {
			this.url_ = url;
			this.preload_ = preload;
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::setSource..."));
		this.url_ = url;
		this.preload_ = preload;
		CdeMediaHelper.init(null, {
			fn : this.createPlayer_,
			scope : this
		});
	},
	pause : function() {
		if (!this.url_) {
			return;
		}
		if (!this.playerCreated_) {
			this.addPendingAction_(this.pause, this);
			return;
		}

		if (this.logicPlayer_) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::pause..."));
			this.logicPlayer_.pause();
		}
	},
	replay : function() {
		if (!this.url_) {
			return;
		}
		if (!this.playerCreated_) {
			return;
		}
		if (this.logicPlayer_) {
			this.logicPlayer_.replay();
		}
	},

	stop : function() {
		if (!this.url_) {
			return;
		}
		if (!this.playerCreated_) {
			this.addPendingAction_(this.stop, this);
			return;
		}

		if (this.logicPlayer_) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::stop..."));
			this.logicPlayer_.stop();
		}
	},

	release : function() {
		if (!this.url_) {
			return;
		}
		if (this.playerTimer_) {
			clearTimeout(this.playerTimer_);
			this.playerTimer_ = null;
		}

		if (this.logicPlayer_) {
			this.logicPlayer_.stop();
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::release..."));
		this.logicPlayer_ = null;
		this.playerCreated_ = false;
		this.videoStream_.requestPlayStop_(this.url_);
		this.url_ = null;
	},

	seek : function(pos) {
		if (!this.url_) {
			return;
		}
		if (!this.playerCreated_) {
			this.addPendingAction_(this.seek, this);
			return;
		}

		if (this.logicPlayer_) {
			this.logicPlayer_.seek(pos);
		}
	},

	getCurrentPosition : function() {
		if (!this.url_) {
			return;
		}
		if (!this.playerCreated_) {
			return -1;
		}

		if (this.logicPlayer_) {
			return this.logicPlayer_.getCurrentPosition();
		}
	},

	getDuration : function() {
		if (!this.url_) {
			return;
		}
		if (!this.playerCreated_) {
			return -1;
		}

		if (this.logicPlayer_) {
			return this.logicPlayer_.getDuration();
		}
	},
	getCurrentBuffered : function() {
		if (!this.url_) {
			return;
		}
		if (!this.playerCreated_) {
			return -1;
		}

		if (this.logicPlayer_) {
			return this.logicPlayer_.getCurrentBuffered();
		}
	}
});
