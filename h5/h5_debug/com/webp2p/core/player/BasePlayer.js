p2p$.ns('com.webp2p.core.player');
p2p$.com.webp2p.core.player.BasePlayer = JClass.extend_({
	kNoFirstSeek : -1,
	kFirstSeekInit : 0,
	kFirstSeekWaitDownLoadSegment : 1,
	kFirstSeekDownLoadSegmentOk : 2,
	kFirstSeekStatusDone : 3,
	errorReplayTime_:0,
	firstSeekPosition_ : 0,
	
	firstPlayTime_:-1,//执行playing时间
	firstAddDataTime_:-1,//喂第一块数据时间
	firstPlayingTime_:-1,//执行playing时间
	seekingTime_:-1,//开始seek时间
	seekedTime_:-1,//seek用时
	rangeDalay_:0,
	stream_ : null,
	delayTime_:0,
	wrapper_ : null,
	url_ : "",
	urgentSegment_ : 0,
	mediaSource_ : null,
	mediaOpened_ : false,
	fectchInterval_ : 200,
	channel_ : null,
	video_ : null,
	blockList_ : null,
	sourceBuffer_ : null,
	sourceIdle_ : true,
	sourceMime_ : null,
	toMp4_ : null,
	initFnum_ : 0,
	fetchTimer_ : null,
	metaData_ : null,
	nextSegmentId_ : 0,
	playerContext_ : null,
	preTime_ : 0,
	preSegmentId_ : "",
	breakTimes_ : 0,
    bufferTimes_ : 0,
	macSafariPattern_ : false,
	videoDuration_ : 0,
	actived_ : false,
	maxErrorTimes_ : 0,
	duration_ : 0,
	global_:null,
	strings_:null,
	config_:null,
	videoStatus_:null,
	playerStatus_:null,
	tag_:"com::webp2p::core::player::BasePlayer",

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
		this.strings_ = p2p$.com.common.String;
		this.global_ = p2p$.com.common.Global;
		this.config_ = p2p$.com.selector.Config;
		this.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS;
		this.playerStatus_ = p2p$.com.webp2p.core.player.PLAY_STATES;
		this.toMp4_ = null;

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
		this.channel_.setPlayer_(this);
		this.url_ = url;
		this.stream_ = stream;
		this.video_ = video;
		this.actived_ = true;
		this.mediaOpened_ = false;

		var mediaType = p2p$.com.selector.Enviroment.getMediaType_();
		if (mediaType.mediasource) {
			if (mediaType.ts&&this.config_.encode==0) {
				this.macSafariPattern_ = true;
				this.playerContext_.isEncode_ = false;
			} else if (mediaType.mp4) {
				this.toMp4_ = new p2p$.com.webp2p.segmentmp4.ToMp4();
				this.playerContext_.isEncode_ = true;
			}
		}
		this.firstPlayTime_=this.global_.getMilliTime_();
		this.addVideoEvents_(this.video_);
		this.startTimer_();
		this.sendStatus_({type:"PLAYER.INIT"})
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
	},
	getBlock_:function()
	{
		return true;
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
	},

	getMetaData_ : function() {
		if ((this.channel_.metaData_ && this.channel_.metaData_.p2pGroupId_) || (this.channel_.metaData_ && this.channel_.onMetaCompleteCode_ == 302)) {
			this.metaData_ = this.channel_.metaData_;
			this.pictureHeight_ = this.metaData_.pictureHeight_;
			this.pictureWidth_ = this.metaData_.pictureWidth_;
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getMetaData_: height={1},width={2}",this.tag_,this.pictureHeight_,this.pictureWidth_));
		}
	},

	refreshUrgentSegment_ : function(segmentId) {
		if (!this.playerContext_.bufferd_) {
			return;
		}
		var vtime = this.video_.currentTime;
		if (vtime > 1) {
            var segment = this.getSegmentByVideoTime_(vtime);
            if (segment) {
                this.urgentSegment_ = segment.id_;
                if(this.nextSegmentId_>0&&this.nextSegmentId_<this.urgentSegment_)
                {
                    P2P_ULOG_WARNING(P2P_ULOG_FMT("{0} nextSegmentId({1}) need change for urgentSegment({2})",this.tag_,this.nextSegmentId_,this.urgentSegment_));
                    this.nextSegmentId_ = this.urgentSegment_+1;
                }
                return;
            }
        }
		this.urgentSegment_ = segmentId;
	},
	getSegmentByVideoTime_ : function(time) {
		time = time * 1000;
		var temp = null;
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.timestamp_ <= time && time <= (segment.timestamp_ + segment.duration_)) {
				temp = segment;
			}
		}
		return temp;
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
				this.urgentSegment_ = this.nextSegmentId_;
				this.preSeekTime_ = this.firstSeekPosition_;
			} else {
			}
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getSegment({1}) seekPosition({2})",this.tag_,this.nextSegmentId_, this.firstSeekPosition_));
		}

		var tempBlock = this.getBlock_(this.nextSegmentId_);
		if (!tempBlock) {
			if (this.nextSegmentId_ != -1) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getSegment({1}) return({2})",this.tag_,this.nextSegmentId_, tempBlock));
			}
			return;
		}
		this.refreshUrgentSegment_(tempBlock.id_);
		var streamInfo = this.stream_.requestPlaySlice_(this.channel_.getId_(), tempBlock.id_, this.urgentSegment_);

		if (!streamInfo || !streamInfo.stream) {
			var nowTime = new Date().getTime();
			if (!this.lastSegmentFailedLogTime_ || (this.lastSegmentFailedLogTime_ + 10000) < nowTime) {
				this.lastSegmentFailedLogTime_ = nowTime;
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::vtime({1}) requestSegment({2}) stream({3}) urgentSegment({4})",this.tag_,this.video_ ? this.video_.currentTime.toFixed(2) : 0, tempBlock.id_, (streamInfo.stream != null), this.urgentSegment_));
			}
			return null;
		}
		this.preSegmentId_ = tempBlock.id_;
		this.nextSegmentId_ = tempBlock.nextId_;
		if(this.nextSegmentId_!=(this.preSegmentId_+1))
		{
            P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::getSegment nextSegment mable error! preId({1}),next({2})",this.tag_,this.preSegmentId_,this.nextSegmentId_));
		}
		var _params={
				width : tempBlock.pictureWidth_ || 960,
				height : tempBlock.pictureHeight_ || 400,
				segmentIndex:this.initFnum_,
				encode:this.playerContext_.isEncode_
		};
		var info = this.getStreamInfo_(streamInfo.stream,_params,tempBlock);
		tempBlock.timestamp_ = info.start;
		this.initFnum_++;
		this.blockList_.push({
			data : info.stream,
			block : tempBlock,
			mime : this.formatMimeTypeName_(this.playerContext_.avccName_, this.playerContext_.aacName_)
		});
	},
	getStreamInfo_:function(stream,params,block){
		var _stream = stream;
		var _start = block.startTime_;
		var startChangeTime = this.global_.getMilliTime_();
		if(this.toMp4_)
		{
			_stream = this.toMp4_.processFileSegment_(stream,params);
			this.playerContext_.avccName_ = this.toMp4_.getMediaStreamAvccName_();
			this.playerContext_.aacName_ = this.toMp4_.getMediaStreamAacName_();
			_start = this.toMp4_.startTime;
			var endChangeTime = this.global_.getMilliTime_();
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0} turn to mp4, segmentid({1}), before({2}), after({3}),timeuse({4}),playtime({5}),nextSegmentId({6}),startTime({7}),params({8})",this.tag_,block.id_, stream.length, _stream.length, ((endChangeTime - startChangeTime) / 1000).toFixed(1),this.video_ ? this.video_.currentTime.toFixed(2) : 0, this.nextSegmentId_,_start,JSON.stringify(params)));
		}
		return {"stream":_stream,"start":_start};
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
		if (!this.video_) {
            return;
        }
		var _st = 0;
		var _ed = 0;
		this.preTime_ = this.video_.currentTime;
		this.playerContext_.bufferLength_ = 0;
		if (!this.playerContext_.bufferd_) {
			return;
		}
		var start_ = -1;
		var end_ = -1;
		for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
			_st = this.playerContext_.bufferd_.start(i);
			_ed = this.playerContext_.bufferd_.end(i);

			if (this.isFirstSegment_) {
				this.playerContext_.bufferLength_ = _ed - _st;
				this.isFirstSegment_ = false;
				if (this.onErrorReplay_) {
					this.onErrorReplay_ = false;
					if (_st <= this.errorReplayTime_ && this.errorReplayTime_ <= _ed) {
						this.video_.currentTime = this.errorReplayTime_;
					} else {
                        this.video_.currentTime = _st;
                    }
				}
				if(this.macSafariPattern_){
					this.resetSeekTo_=Math.ceil(_st*1000)/1000;
                    this.video_.currentTime = this.resetSeekTo_;
				}
				if(this.playerContext_.metaDataType_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive){
					this.video_.currentTime = _st;
					this.onBufferEndAndOnPrepared_();
					this.video_.play();
                    this.playNextVideo_ = null;
				}
			} else {
				if(start_==-1)
				{
					start_ = _st;
					end_ = _ed;
				}
				else
				{
					if(_st - end_ < 1)//小于1秒内的不连贯buffer属于误差范围，归为一个buffer长度
					{
						end_ = _ed;
					}
					else
					{
						start_ = _st;
						end_ = _ed;
					}
				}
				if(this.preTime_<start_&&start_<1){
                    this.playerContext_.bufferLength_=(end_-start_);
                    continue;
				}
				if(this.preTime_&&start_<=this.preTime_&&end_>=this.preTime_)
				{
					this.playerContext_.bufferLength_=(end_-this.preTime_);
                    continue;
				}
			}
		}
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
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::createMediaSource...",this.tag_));
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
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Add media source failed: {1}",this.tag_,(e || "").toString()));
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
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::remove sourcebuffer failed: {1}",this.tag_,(e || "").toString()));
		}
	},

	clearMediaSource_ : function() {
		this.mediaOpened_ = false;
		if (!this.mediaSource_) {
			return;
		}

		try {
			if (this.sourceBuffer_) {
				if(this.mediaSource_.readyState=="open"){
					this.sourceBuffer_.abort();
					this.mediaSource_.removeSourceBuffer(this.sourceBuffer_);
				}
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
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Clear media source failed: {1}",this.tag_,(e || "").toString()));
		}
	},

	formatMimeTypeName_ : function(avcc, aac) {
		var typeName = 'video/mp2t; codecs="avc1.64001f"';
		if (avcc) {
			if (this.playerContext_.isEncode_) {
				typeName = 'video/mp4; codecs="' + avcc + ', ' + aac + '"';
			} else {
				typeName = 'video/mp2t; codecs="' + avcc + '"';
			}
		}
		return typeName;
	},
	addMediaSourceHeader_ : function() {
		var _b = false;
		var typeName = this.formatMimeTypeName_(this.playerContext_.avccName_, this.playerContext_.aacName_);
		var mediaDescriptions = "";
		if (this.mediaSource_) {
			if(!this.sourceBuffer_)
				{
					try {
						if (this.mediaSource_.sourceBuffers.length > 0) {
							return true;
						}
						P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add media source header, type: {1}, medias: {2}",this.tag_,typeName, mediaDescriptions));
						this.sourceBuffer_ = this.mediaSource_.addSourceBuffer(typeName);
						this.sourceIdle_ = true;
						this.sourceMime_ = typeName;
						this.addSourceEvents_(this.sourceBuffer_);
						_b = true;
					} catch (err) {
						P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Add media source header, type: {1}, medias: {2}, error: {3}",this.tag_,typeName,mediaDescriptions, err.toString()));
						this.clearMediaSource_();
						_b = false;
					}
				}
		}
		return _b;
	},

	onMediaSourceOpen_ : function(evt) {
		if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
			return;
		}

		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onMediaSource open, {1} arguments",this.tag_,arguments.length));
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
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onMediaSource end, {1} arguments,({2}),({3})",this.tag_,arguments.length, arguments[1], arguments[2]));
	},

	onMediaSourceClosed_ : function(evt) {
		if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onMediaSource close, {1} arguments",this.tag_,arguments.length));
		this.actived_ = false;
		this.mediaOpened_ = false;
	},

	onMediaSourceError_ : function(evt) {
		if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
			return;
		}
		P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onMediaSource error, {1} arguments",this.tag_,arguments.length));
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
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::removesourcebuffer...",this.tag_));
	},

	onAddSourceBuffer_ : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onAddSourceBuffer...",this.tag_));
	},

	addSourceEvents_ : function(source) {
		try {

			this.onSourceUpdateEndBinded_ = this.onSourceUpdateEnd_.bind(this);
			this.onSourceUpdateBinded_ = this.onSourceUpdate_.bind(this);
			this.onSourceUpdateStartBinded_ = this.onSourceUpdateStart_.bind(this);
			this.onSourceUpdateErrorBinded_ = this.onSourceUpdateError_.bind(this);

			source.addEventListener('updateend', this.onSourceUpdateEndBinded_);
			source.addEventListener('update', this.onSourceUpdateBinded_);
			source.addEventListener('updatestart', this.onSourceUpdateStartBinded_);
			source.addEventListener('error', this.onSourceUpdateErrorBinded_);
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Add source event failed: {1}",this.tag_,(e || "").toString()));
		}
	},

	removeSourceEvents_ : function(source) {
		try {
			source.removeEventListener('updateend', this.onSourceUpdateEndBinded_);
			source.removeEventListener('update', this.onSourceUpdateBinded_);
			source.removeEventListener('updatestart', this.onSourceUpdateStartBinded_);
			source.removeEventListener('error', this.onSourceUpdateErrorBinded_);
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Remove source event failed: {1}",this.tag_,(e || "").toString()));
		}
	},

	onSourceUpdateStart_ : function(evt) {
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
		// P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Source update start",this.tag_));
		this.sourceIdle_ = false;
	},

	onSourceUpdate_ : function(evt) {
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
//		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Source onUpdate",this.tag_));
	},

	onSourceUpdateEnd_ : function(evt) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Source updatedEnd",this.tag_));
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
		this.sourceIdle_ = true;
		if (this.firstSeekStatus_ != undefined && this.firstSeekStatus_ == this.kFirstSeekWaitDownLoadSegment) {
			this.video_.currentTime = this.preSeekTime_;
			this.firstSeekStatus_ = this.kFirstSeekDownLoadSegmentOk;
		}
		
		try {
			if(this.sourceBuffer_){
				this.playerContext_.bufferd_ = this.sourceBuffer_.buffered;
			}
			else
			{
				this.playerContext_.bufferd_ = null;
			}
		} catch (err) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} buffered error ({1})",this.tag_,err));
		}

		var currenTime = this.video_.currentTime;
		var ranges_=[];
		if (this.playerContext_.bufferd_ && this.playerContext_.bufferd_.length > 0) {
			for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
				ranges_.push([this.playerContext_.bufferd_.start(i),this.playerContext_.bufferd_.end(i)]);
			}
            this.sendStatus_({"type":"VIDEO.BUFFER.RANGE","range":ranges_,"dur":this.getDuration_(),"time":currenTime});
		}
	},

	onSourceUpdateError_ : function(evt) {
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
		this.removeSourceEvents_(this.sourceBuffer_);
        this.sendStatus_({"type":"VIDEO.PLAY.ERROR","code":50001,"info":"update Source error!"});
	},

	addVideoEvents_ : function(video) {
		var events = this.playerStatus_.VideoEvents;
		this.videoStatusHandlerBinded_ = this.videoStatusHandler_.bind(this);
		for ( var i = 0; i < events.length; i++) {
			try {
				video.addEventListener(events[i], this.videoStatusHandlerBinded_);
			} catch (e) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Add video event({1}) failed: {2}",this.tag_,events[i], (e || "").toString()));
			}
		}
	},

	removeVideoEvents_ : function(video) {
		var events = this.playerStatus_.VideoEvents;
		for ( var i = 0; i < events.length; i++) {
			try {
				video.removeEventListener(events[i], this.videoStatusHandlerBinded_);
			} catch (e) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Remove video event({1}) failed: {2}",this.tag_,events[i], (e || "").toString()));
			}
		}
	},

	videoStatusHandler_ : function(evt) {
		if (!this.video_ || this.video_ != evt.target) {
			return;
		}

		var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
		var type = evt.type;
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
			this.onEnded_();
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
        this.sendStatus_({type:"VIDEO.PLAY.START"});
		this.playerContext_.videoStatus_ = this.videoStatus_.loadstart;
	},

	onLoadedData_ : function() {
        this.sendStatus_({type:"VIDEO.PLAY.LOAD"});
        this.playerContext_.videoStatus_ = this.videoStatus_.loadeddata;
	},

	onVideoLoadedMetaData_ : function() {
		this.videoDuration_ = this.video_.duration ? this.video_.duration.toFixed(1) : 0;
        this.sendStatus_({type:"VIDEO.META.INFO",info:{dur:this.videoDuration_}});
	},

	onVideoTimeUpdate_ : function() {
		this.errorTimes_ = 0;
	},

	onVideoSeeking_ : function() {
        var time = this.video_.currentTime ? this.video_.currentTime : 0;
        if(this.preTime_ == time)
		{
			return;
		}
        this.preSeekTime_ = time;
		this.sendStatus_({type:"VIDEO.PLAY.SEEKING",pause:this.video_.paused});
		this.seekingTime_=this.global_.getMilliTime_();
		this.playerContext_.videoStatus_ = this.videoStatus_.seeking;
		this.seek2(this.preSeekTime_);
	},

	onVideoSeeked_ : function() {
        var time = this.video_.currentTime ? this.video_.currentTime : 0;
		this.playerContext_.videoStatus_ = this.videoStatus_.seeked;
        this.seekedTime_ = this.global_.getMilliTime_();
        var params={};
        params["utime"]=this.seekedTime_-this.seekingTime_;
        params["pos"]=time;
        this.sendStatus_({type:"VIDEO.PLAY.SEEKED",params:params,pause:this.video_.paused});
		if (!this.video_.paused) {
			this.onVideoPlay_();
			return;
		}
		this.video_.play();
	},
	onVideoPuase_ : function() {
        this.playerContext_.videoStatus_ = this.videoStatus_.pause;
        this.sendStatus_({type:"VIDEO.PLAY.PAUSE"});
    },
	onVideoPlay_ : function() {
        if(this.playerContext_.videoStatus_ == this.videoStatus_.pause){
            this.sendStatus_({type:"VIDEO.PLAY.RESUME"});
        }
	},
	onVideoWaiting_ : function() {
	},
	onVideoCanPlay_ : function() {
        if (this.playerContext_.videoStatus_ == this.videoStatus_.loadeddata) {
            this.playerContext_.videoStatus_ = this.videoStatus_.canplay;
            if (this.firstSeekTime_) {
                this.video_.currentTime = this.firstSeekTime_;
            }
        }
	},
	onCanPlayThrough_ : function() {
	},
	onVideoPlaying_ : function() {
        this.playerContext_.videoStatus_ == this.videoStatus_.playing;
		if(this.firstPlayingTime_==-1)
		{
			this.firstPlayingTime_=this.global_.getMilliTime_();
			this.sendStatus_({"type":"VIDEO.PLAY.FIRST","init":this.firstPlayTime_,"meta":this.channel_.channelOpenedTime_,"add":this.firstAddDataTime_,"playing":this.firstPlayingTime_})
			return;
		}
        this.sendStatus_({type:"VIDEO.PLAY.PLAYING"});
	},

	onBufferEndAndOnPrepared_ : function() {
		if (this.playerContext_.videoStatus_ == this.videoStatus_.loadstart) {
			this.playerContext_.videoStatus_ = this.videoStatus_.canplay;
			if (!this.firstOnPrepared_) {
				// throw the onprepared event at first play only
				this.firstOnPrepared_ = true;
                this.sendStatus_({type:"VIDEO.PLAY.PREPARED"});
			} else {
				this.video_.play();
			}
		}
	},

	onEnded_ : function(from) {
		var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
		this.sendStatus_({type:"VIDEO.PLAY.END"});
	},

	onError_ : function() {
		var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
		var code = -100;
		if (this.video_ && this.video_.error) {
			code = this.video_.error.code;
		}
		this.actived_ = false;
		var nowTime = new Date().getTime();
		if (nowTime - this.lastErrorTime_ >= 4000) {
			this.lastErrorTime_ = nowTime;
			return true;
		}
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
		code += 10000;
        this.sendStatus_({type:"VIDEO.PLAY.ERROR",code:code,info:info});
		return false;
	},

	stop_ : function() {
		this.actived_ = false;
		this.stopFetchTimer_();
		this.clearMediaSource_();
		if (this.video_) {
			this.video_.pause();
			this.removeVideoEvents_(this.video_);
			// this.video_ = null;
		}

		this.blockList_ = [];
		this.toMp4_ = null;
		this.initFnum_ = 0;
		this.metaData_ = null;
		this.nextSegmentId_ = 0;
		this.preTime_ = 0;
		this.preSegmentId_ = -1;
		this.playerContext_ = new p2p$.com.webp2p.core.player.Context();
		this.breakTimes_ = 0;
		this.bufferTimes_ = 0;
	},

	pause_ : function() {
		if (this.video_) {
			this.video_.pause();
		}
	},
	replay_ : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::replay ...",this.tag_));
		this.seek_(1);
	},

	seek_ : function(postion) {
	},
	getCurrentBuffered_ : function() {
		var buffer = -1;
		return buffer;
	},
	getCurrentPosition_ : function() {
		if (this.video_) {
			return this.video_.currentTime;
		}
		return 0;
	},

	getDuration_ : function() {
		var dur = -1;
		if(this.playerContext_.metaDataType_== p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod)
		{
			dur = this.channel_.metaData_.totalDuration_ / 1000;
		}
		return dur;
	},
	sendStatus_:function(params)
	{
		if(this.channel_){
			this.channel_.sendStatus_(params,true);
		}
		this.wrapper_.sendStatus_(params);
	}
});
