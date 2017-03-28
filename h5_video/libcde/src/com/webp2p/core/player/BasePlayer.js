p2p$.ns('com.webp2p.core.player');
p2p$.com.webp2p.core.player.BasePlayer = CdeBaseClass.extend_({

	stream_ : null,
	wrapper_ : null,
	url_ : "",
	mediaSource_ : null,
	mediaOpened_ : false,
	fectchInterval_ : 500,
	channel_ : null,
	video_ : null,
	blockList_ : null,
	sourceBuffer_ : null,
	sourceIdle_ : true,
	sourceMime_ : null,
	fileMp4_ : null,
	initFnum_ : 0,
	fetchTimer_ : null,
	metaData_ : null,
	nextSegmentId_ : 0,
	playerContext_ : null,
	preTime_ : 0,
	preSegmentId_ : "",
	breakTimes_ : 0,
	macSafariPattern_ : false,
	videoDuration_ : 0,
	actived_ : false,
	maxErrorTimes_ : 0,
	duration_ : 0,
	init : function(wrapper) {
		this.wrapper_ = wrapper;
		this.stream_ = null;
		this.url_ = "";
		this.mediaSource_ = null;
		this.mediaOpened_ = false;
		this.channel_ = null;
		this.blockList_ = [];
		this.sourceBuffer_ = null;
		this.video_ = null;
		this.fileMp4_ = new p2p$.com.webp2p.tools.ts2mp4.FileHandler();

		this.initFnum_ = 0;
		this.fetchTimer_ = null;
		this.metaData_ = null;
		this.nextSegmentId_ = 0;
		this.playerContext_ = new p2p$.com.webp2p.core.player.Context();
		this.preTime_ = 0;
		this.preSegmentId_ = -1;
		this.sourceIdle_ = true;
		this.macSafariPattern_ = false;
		this.actived_ = false;
		// this.loop_ = 0;
		this.urgentSegment_ = 0;
		this.errorTimes_ = 0;
		this.maxErrorTimes_ = 3;
		this.duration_ = 0;
		this.lastErrorTime_ = 0;
	},

	stopFetchTimer_ : function() {
		if (this.fetchTimer_) {
			clearInterval(this.fetchTimer_);
			this.fetchTimer_ = null;
		}
	},

	initialize_ : function(url, video, stream, channel) {
		this.channel_ = channel;
		this.url_ = url;
		this.stream_ = stream;
		this.video_ = video;
		this.actived_ = true;
		this.mediaOpened_ = false;

		var mediaType = p2p$.com.webp2p.core.supernode.Enviroment.getMediaType_();
		if (mediaType.mediasource) {
			if (mediaType.ts) {
				// no decoder
				this.macSafariPattern_ = true;
			} else if (mediaType.mp4) {
				this.playerContext_.isEncode_ = true;
			}
		}

		this.addVideoEvents_(this.video_);
		this.startTimer_();
		return true;
	},
	startTimer_ : function() {
		this.onLoop_();
		if (this.fetchTimer_) {
			clearInterval(this.fetchTimer_);
		}
		this.fetchTimer_ = setInterval(this.onLoop_.bind(this), this.fectchInterval_);
	},
	play : function() {
		if (!this.video_) {
			return;
		}
		if (this.video_.paused) {
			this.video_.play();
		}
		return;
	},

	onLoop_ : function() {
		if (!this.metaData_) {
			this.getMetaData_();
		} else {
			if (this.actived_) {
				this.getSegment_();
				this.playSegment_();
			}
		}
		// this.onError_();
		// this.loop_++;
		// if (this.loop_ == 3) {
		// this.loop_ = 0;
		// this.onError_();
		// }
	},

	getMetaData_ : function() {
		if ((this.channel_.metaData_ && this.channel_.metaData_.p2pGroupId_) || (this.channel_.metaData_ && this.channel_.onMetaCompleteCode_ == 302)) {
			this.metaData_ = this.channel_.metaData_;
			this.pictureHeight_ = this.metaData_.pictureHeight_;
			this.pictureWidth_ = this.metaData_.pictureWidth_;
		}
	},

	getSegment_ : function() {
		if (this.blockList_.length >= 1) {
			return;
		}

		if (this.firstSeekStatus_ != undefined && this.firstSeekStatus_ == this.kFirstSeekInit) {
			this.firstSeekStatus_ = this.kFirstSeekWaitDownLoadSegment;
			var seek2Segment = this.findSegment_(this.firstSeekPosition_);
			if (seek2Segment) {
				this.nextSegmentId_ = seek2Segment.id_;
				this.preSeekTime_ = this.firstSeekPosition_;
			} else {
			}
		}

		var tempBlock = this.getBlock_(this.nextSegmentId_);
		if (!tempBlock) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::getSegment ({0}) return null", this.nextSegmentId_));
			return;
		}
		this.refreshUrgentSegment_(tempBlock.id_);

		var streamInfo = this.stream_.requestPlaySlice_(this.channel_.getId_(), tempBlock.id_, this.urgentSegment_);
		if (!streamInfo || !streamInfo.stream) {
			var nowTime = new Date().getTime();
			if (!this.lastSegmentFailedLogTime_ || (this.lastSegmentFailedLogTime_ + 5000) < nowTime) {
				this.lastSegmentFailedLogTime_ = nowTime;
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::vtime({0}) getSegment({1}) stream({2})", this.video_ ? this.video_.currentTime.toFixed(2)
						: 0, this.nextSegmentId_, (streamInfo.stream != null)));
			}
			return null;
		}

		this.preSegmentId_ = tempBlock.id_;
		this.nextSegmentId_ = tempBlock.nextId_;
		var startChangeTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::BasePlayer::Start change to mp4"));

		var stream = this.fileMp4_.processFileSegment_(streamInfo.stream, {
			start : tempBlock.startTime_ / 1000,
			duration : tempBlock.duration_,
			type : 0,
			width : tempBlock.pictureWidth_ || 960,
			height : tempBlock.pictureHeight_ || 400,
		}, this.initFnum_, this.playerContext_.isEncode_);
		tempBlock.timestamp_ = this.fileMp4_.startTime_;
		this.playerContext_.avccName_ = this.fileMp4_.getMediaStreamAvccName_();
		this.playerContext_.aacName_ = this.fileMp4_.getMediaStreamAacName_();
		this.initFnum_++;
		var endChangeTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		P2P_ULOG_INFO(P2P_ULOG_FMT(
				"core::player::BasePlayer turn to mp4, segmentid({0}), before({1}), after({2}),timeuse({3}),playtime({4}),nextSegmentId({5})", tempBlock.id_,
				streamInfo.stream.length, stream.length, ((endChangeTime - startChangeTime) / 1000).toFixed(1), this.video_ ? this.video_.currentTime
						.toFixed(2) : 0, this.nextSegmentId_));
		this.blockList_.push({
			data : stream,
			block : tempBlock,
			mime : this.formatMimeTypeName_(this.playerContext_.avccName_, this.playerContext_.aacName_)
		});
	},

	findSegment_ : function(time) {
		var segment = null;
		if (this.metaData_) {
			for ( var n = 0; n < this.metaData_.segments_.length; n++) {
				segment = this.metaData_.segments_[n];
				if (segment.startTime_ <= time * 1000 && time * 1000 < segment.startTime_ + segment.duration_) {
					return segment;
				}
			}
		}
		return null;
	},

	playSegment_ : function() {
	},

	calculateBufferLength_ : function() {
	},

	existTime_ : function(value) {
		var b = false;
		for ( var i = 0; i < this.playerContext_.buffers_.length; i++) {
			var _start = this.playerContext_.buffers_[i][0];
			var _end = this.playerContext_.buffers_[i][1];
			if (value >= _start && value <= _end) {
				b = true;
				break;
			}
		}
		return b;
	},

	createMediaSource_ : function() {
		var media = null;
		try {
			media = new MediaSource();

			this.onMediaSourceOpenBinded_ = this.onMediaSourceOpen_.bind(this);
			this.onMediaSourceEndedBinded_ = this.onMediaSourceEnded_.bind(this);
			this.onMediaSourceClosedBinded_ = this.onMediaSourceClosed_.bind(this);
			this.onMediaSourceErrorBinded_ = this.onMediaSourceError_.bind(this);

			media.addEventListener('sourceopen', this.onMediaSourceOpenBinded_);
			media.addEventListener('sourceended', this.onMediaSourceEndedBinded_);
			media.addEventListener('sourceclose', this.onMediaSourceClosedBinded_);
			media.addEventListener('error', this.onMediaSourceErrorBinded_);

			this.actived_ = true;
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Add media source failed: {0}", (e || "").toString()));
		}
		return media;
	},

	removeSourceBuffer_ : function() {
		if (!this.mediaSource_) {
			return;
		}
		// this.mediaSource_.endOfStream();
		try {
			if (this.sourceBuffer_) {
				this.sourceBuffer_.abort();
				this.mediaSource_.removeSourceBuffer(this.sourceBuffer_);
				this.removeSourceEvents_(this.sourceBuffer_);
				this.sourceBuffer_ = null;
			}
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::remove sourcebuffer failed: {0}", (e || "").toString()));
		}
	},

	clearMediaSource_ : function() {
		this.mediaOpened_ = false;
		if (!this.mediaSource_) {
			return;
		}

		try {
			if (this.sourceBuffer_) {
				this.sourceBuffer_.abort();
				this.mediaSource_.removeSourceBuffer(this.sourceBuffer_);
				this.removeSourceEvents_(this.sourceBuffer_);
				this.sourceBuffer_ = null;
			}
			this.mediaSource_.endOfStream();
			this.mediaSource_.removeEventListener('sourceopen', this.onMediaSourceOpenBinded_);
			this.mediaSource_.removeEventListener('sourceended', this.onMediaSourceEndedBinded_);
			this.mediaSource_.removeEventListener('sourceclose', this.onMediaSourceClosedBinded_);
			this.mediaSource_.removeEventListener('error', this.onMediaSourceErrorBinded_);
			this.mediaSource_ = null;
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Clear media source failed: {0}", (e || "").toString()));
		}
	},

	formatMimeTypeName_ : function(avcc, aac) {
		var typeName = 'video/mp2t; codecs="avc1.64001f"';
		if (avcc) {
			if (this.playerContext_.isEncode_) {
				typeName = 'video/mp4; codecs="' + avcc + ', ' + aac + '"';
			} else {
				typeName = 'video/mp2t; codecs="' + avcc + ', ' + aac + '"';
			}
		}
		return typeName;
	},

	addMediaSourceHeader_ : function() {
		var _b = false;

		// if (this.playerContext_.metaDataType_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod) {
		// this.playerContext_.aacName_ = 'mp4a.40.2';
		// } else {
		// if (this.channel_.metaData_.programId_ && this.channel_.metaData_.programId_.length != 32) {
		// this.playerContext_.aacName_ = 'mp4a.40.5';
		// } else {
		// this.playerContext_.aacName_ = 'mp4a.40.2';
		// }
		// }
		// this.playerContext_.aacName_ = 'mp4a.40.5';
		var typeName = this.formatMimeTypeName_(this.playerContext_.avccName_, this.playerContext_.aacName_);
		// var supported = MediaSource.isTypeSupported(typeName);
		// alert(typeName + ":" + supported);
		var mediaDescriptions = this.fileMp4_.getMediaInfoDescriptions_();
		if (this.mediaSource_ && !this.sourceBuffer_) {
			try {
				if (this.mediaSource_.sourceBuffers.length > 0) {
					return true;
				}

				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Add media source header, type: {0}, medias: {1}", typeName, mediaDescriptions));
				this.sourceBuffer_ = this.mediaSource_.addSourceBuffer(typeName);
				this.sourceIdle_ = true;
				this.sourceMime_ = typeName;
				this.addSourceEvents_(this.sourceBuffer_);
				// this.addSourceBufferListEvent_();
				_b = true;
			} catch (err) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Add media source header, type: {0}, medias: {1}, error: {2}", typeName,
						mediaDescriptions, err.toString()));
				this.clearMediaSource_();
				_b = false;
			}
		}

		return _b;
	},

	onMediaSourceOpen_ : function(evt) {
		if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
			return;
		}

		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::onMediaSource open, {0} arguments", arguments.length));
		if (this.playerContext_.metaDataType_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod) {
			this.mediaSource_.duration = this.channel_.metaData_.totalDuration_ / 1000;
		}
		this.mediaOpened_ = true;
		this.addMediaSourceHeader_();
		this.playSegment_();
	},

	onMediaSourceEnded_ : function(evt) {
		if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::onMediaSource end, {0} arguments,({1}),({2})", arguments.length, arguments[1], arguments[2]));
	},

	onMediaSourceClosed_ : function(evt) {
		if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::onMediaSource close, {0} arguments", arguments.length));
		this.actived_ = false;
		this.mediaOpened_ = false;
	},

	onMediaSourceError_ : function(evt) {
		if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
			return;
		}
		P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::onMediaSource error, {0} arguments", arguments.length));
		this.actived_ = false;
		this.mediaOpened_ = false;
	},

	addSourceBufferListEvent_ : function() {
		var bufferlists = this.mediaSource_.sourceBuffers;
		this.onRemoveSourceBufferBinded_ = this.onRemoveSourceBuffer_.bind(this);
		this.onAddSourceBufferBinded_ = this.onAddSourceBuffer_.bind(this);
		bufferlists.addEventListener('removesourcebuffer', this.onRemoveSourceBufferBinded_);
		bufferlists.addEventListener('addsourcebuffer', this.onAddSourceBufferBinded_);
	},

	onRemoveSourceBuffer_ : function() {
		this.sourceBufferRemoved_ = true;
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::removesourcebuffer..."));
	},

	onAddSourceBuffer_ : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::onAddSourceBuffer..."));
	},

	addSourceEvents_ : function(source) {
		try {

			this.onSourceUpdateEndBinded_ = this.onSourceUpdateEnd_.bind(this);
			this.onSourceUpdateBinded_ = this.onSourceUpdate_.bind(this);
			this.onSourceUpdateStartBinded_ = this.onSourceUpdateStart_.bind(this);
			this.onSourceUpdateErrorBinded_ = this.onSourceUpdateError_.bind(this);

			source.addEventListener('updateend', this.onSourceUpdateEndBinded_)
			source.addEventListener('update', this.onSourceUpdateBinded_);
			source.addEventListener('updatestart', this.onSourceUpdateStartBinded_);
			source.addEventListener('error', this.onSourceUpdateErrorBinded_);
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Add source event failed: {0}", (e || "").toString()));
		}
	},

	removeSourceEvents_ : function(source) {
		try {
			var me = this;
			source.removeEventListener('updateend', this.onSourceUpdateEndBinded_);
			source.removeEventListener('update', this.onSourceUpdateBinded_);
			source.removeEventListener('updatestart', this.onSourceUpdateStartBinded_);
			source.removeEventListener('error', this.onSourceUpdateErrorBinded_);
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Remove source event failed: {0}", (e || "").toString()));
		}
	},

	onSourceUpdateStart_ : function(evt) {
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::BasePlayer::Source update start"));
		this.sourceIdle_ = false;
	},

	onSourceUpdate_ : function(evt) {
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::BasePlayer::Source updated"));
	},

	onSourceUpdateEnd_ : function(evt) {
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
		this.sourceIdle_ = true;
		if (this.firstSeekStatus_ != undefined && this.firstSeekStatus_ == this.kFirstSeekWaitDownLoadSegment) {
			this.video_.currentTime = this.preSeekTime_;
			this.firstSeekStatus_ = this.kFirstSeekDownLoadSegmentOk;
		}
		try {
			this.playerContext_.bufferd_ = this.sourceBuffer_.buffered;
		} catch (err) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer buffered error ({0})", err));
		}

		var currenTime = this.video_.currentTime;
		if (this.playerContext_.bufferd_ && this.playerContext_.bufferd_.length > 0) {
			for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Source update finished, idx({0}), time({1}), range({2}, {3})", i, (currenTime || 0),
						this.playerContext_.bufferd_.start(i), this.playerContext_.bufferd_.end(i)));
			}
		}
	},

	onSourceUpdateError_ : function(evt) {
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
		P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Source update error:{0}", arguments.length));
	},

	addVideoEvents_ : function(video) {
		var events = p2p$.com.webp2p.core.player.PLAY_STATES.VideoEvents;
		this.videoStatusHandlerBinded_ = this.videoStatusHandler_.bind(this);
		for ( var i = 0; i < events.length; i++) {
			try {
				video.addEventListener(events[i], this.videoStatusHandlerBinded_);
			} catch (e) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Add video event({0}) failed: {1}", events[i], (e || "").toString()));
			}
		}
	},

	removeVideoEvents_ : function(video) {
		var events = p2p$.com.webp2p.core.player.PLAY_STATES.VideoEvents;
		for ( var i = 0; i < events.length; i++) {
			try {
				video.removeEventListener(events[i], this.videoStatusHandlerBinded_);
			} catch (e) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Remove video event({0}) failed: {1}", events[i], (e || "").toString()));
			}
		}
	},

	videoStatusHandler_ : function(evt) {
		if (!this.video_ || this.video_ != evt.target) {
			return;
		}

		var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
		var type = evt.type;
		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::BasePlayer::Video status handler, type({0}),time({1})", type, time));
		switch (type) {
		case "abort":
			break;
		case "canplay":
			this.onVideoCanPlay_();
			break;
		case "canplaythrough":
			this.onCanPlayThrough_();
			break;
		case "durationchange":
			break;
		case "emptied":
			break;
		case "ended":
			// this.onEnded_();
			break;
		case "error":
			this.onError_();
			break;
		case "loadeddata":
			this.onLoadedData_();
			break;
		case "loadedmetadata":
			this.onVideoLoadedMetaData_();
			break;
		case "loadstart":
			this.loadStart_();
			break;
		case "pause":
			this.onVideoPuase_();
			break;
		case "play":
			this.onVideoPlay_();
			break;
		case "playing":
			this.onVideoPlaying_();
			break;
		case "progress":
			this.onVideoProgress_();
			break;
		case "ratechange":
			break;
		case "seeked":
			this.onVideoSeeked_();
			break;
		case "seeking":
			this.onVideoSeeking_();
			break;
		case "stalled":
			break;
		case "suspend":
			break;
		case "timeupdate":
			this.onVideoTimeUpdate_();
			break;
		case "volumechange":
			break;
		case "waiting":
			this.onVideoWaiting_();
			break;
		default:
			break;
		}
	},
	onVideoProgress_ : function() {

	},
	loadStart_ : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video loaded start"));
		if (this.wrapper_.onbufferstart) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video event onloadStart bufferstart"));
			this.wrapper_.onbufferstart();
		}
		this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.loadstart;
	},

	onLoadedData_ : function() {
	},

	onVideoLoadedMetaData_ : function() {
		this.videoDuration_ = this.video_.duration ? this.video_.duration.toFixed(1) : 0;
		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::BasePlayer::Video loaded meta data, duration({0})", this.videoDuration_));
	},

	onVideoTimeUpdate_ : function() {
		this.errorTimes_ = 0;
		if (this.wrapper_.ontimeupdate) {
			this.wrapper_.ontimeupdate();
		}
	},

	onVideoSeeking_ : function() {
	},

	onVideoSeeked_ : function() {
	},
	onVideoPuase_ : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video pause"));
		if (this.wrapper_.onpause) {
			this.wrapper_.onpause();
		}
	},
	onVideoPlay_ : function() {
		if (this.playerContext_.videoStatus_ != p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking) {
			if (this.wrapper_.onplay) {
				this.wrapper_.onplay();
			}
		}

	},

	onVideoWaiting_ : function() {
	},

	onVideoCanPlay_ : function() {
	},

	onCanPlayThrough_ : function() {
	},

	onVideoPlaying_ : function() {
	},

	onBufferEndAndOnPrepared_ : function() {
		if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.loadstart) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video can play"));
			this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.canplay;
			if (this.wrapper_.onbufferend) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video event onVideoCanPlay bufferend"));
				this.wrapper_.onbufferend();
			}
			if (!this.firstOnPrepared_ && this.wrapper_.onprepared) {
				// throw the onprepared event at first play only
				this.firstOnPrepared_ = true;
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video event onVideoCanPlay onprepared"));
				this.wrapper_.onprepared();
			} else {
				// error,replay
				this.video_.play();
			}
		}
	},

	onEnded_ : function(from) {
		var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
		// this.video_.pause();
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video ended, time({0}),from timer({1})", time, from));
		if (this.wrapper_.oncomplete) {
			this.wrapper_.oncomplete();
		}
	},

	onError_ : function() {
		var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
		var code = -100;
		if (this.video_ && this.video_.error) {
			// MEDIA_ERR_ABORTED: 1
			// MEDIA_ERR_NETWORK: 2
			// MEDIA_ERR_DECODE: 3
			// MEDIA_ERR_SRC_NOT_SUPPORTED: 4
			code = this.video_.error.code;
		}
		this.actived_ = false;
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video error, play time({0}), time({1}), code({2})", this.playerContext_.currentPlayTime_, time,
				code));
		var nowTime = new Date().getTime();
		if (nowTime - this.lastErrorTime_ >= 4000) {
			this.lastErrorTime_ = nowTime;
			return true;
		}
		// return true;

		if (this.playerContext_.videoStatus_ != p2p$.com.webp2p.core.player.VIDEO_STATUS.seeked
				&& this.playerContext_.videoStatus_ != p2p$.com.webp2p.core.player.VIDEO_STATUS.canplay) {
			if (this.wrapper_.onbufferend) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::ChromeVodPlayer::Video event onError bufferend"));
				this.wrapper_.onbufferend();
			}
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video error code({0}),upload error", code));
		CdeMediaHelper.submitSupportLog({
			contact : "123455432100",
			remarks : "abcdefg"
		}, function(errorCode, serviceNumber) {
			var displayValue = errorCode ? ("Error: " + errorCode) : (serviceNumber);
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video error, serviceNumber ({0})", displayValue));
		});

		var info = "";
		switch (code) {
		case 1:
			info = "MEDIA_ERR_ABORTED";
			break;
		case 2:
			info = "MEDIA_ERR_NETWORK";
			break;
		case 3:
			info = "MEDIA_ERR_DECODE";
			break;
		case 4:
			info = "MEDIA_ERR_SRC_NOT_SUPPORTED";
			break;
		default:
			info = "";
		}
		if (this.wrapper_.onerror) {
			code += 10000;
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video error code({0}),onError ...", code));
			this.wrapper_.onerror(code, info);
		}
		return false;
	},

	stop : function() {
		this.actived_ = false;
		this.stopFetchTimer_();
		this.clearMediaSource_();
		if (this.video_) {
			this.video_.pause();
			this.removeVideoEvents_(this.video_);
			// this.video_ = null;
		}

		this.blockList_ = [];
		this.fileMp4_ = new p2p$.com.webp2p.tools.ts2mp4.FileHandler();
		this.initFnum_ = 0;
		this.metaData_ = null;
		this.nextSegmentId_ = 0;
		this.preTime_ = 0;
		this.preSegmentId_ = -1;
		this.playerContext_ = new p2p$.com.webp2p.core.player.Context();
		this.breakTimes_ = 0;
	},

	pause : function() {
		if (this.video_) {
			this.video_.pause();
		}
	},
	replay : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::replay ..."));
		this.seek(1);
	},

	seek : function(postion) {
	},

	getCurrentPosition : function() {
		if (this.video_) {
			if (this.macSafariPattern_) {
				if (this.playerContext_.playState_ != p2p$.com.webp2p.core.player.PLAY_STATES.PLAY) {
					return this.preSeekTime_;
				}
			}
			return this.video_.currentTime;
		}
		return null;
	},

	getDuration : function() {
		var dur = -1;
		var isNan = false;
		if (this.video_) {
			dur = this.video_.duration;
		}
		if (isNaN(dur)) {
			dur = -1;
			isNan = true;
		}
		if (this.duration_ != dur) {
			this.duration_ = dur;
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::getDuration ({0}),isNan({1})", dur, isNan));
		}

		return dur;
	}
});