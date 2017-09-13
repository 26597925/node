/**
 * 
 */
rc$.ns("com.relayCore.player");
rc$.com.relayCore.player.Stream = JClass.extend_({
	config_:null,
	global_:null,
	manager_:null,
	myCamara_:null,
	channel_:null,
	channelManager_:null,
	cdnManager_:null,
	fetchTimer_:null,
	fectchInterval_ : 500,
	metaData_:null,
	mediaSource_:null,
	pictureHeight_:0,
	pictureWidth_:0,
	mediaOpened_:false,
	sourceBuffer_:null,
	sourceIdle_:false,
	sourceMime_:null,
	blockList_:[],
	videoEvents_:[],
	fileMp4_:null,

	preTime_:0,
	playNextVideo_:null,
	firstSeekPosition_:-1,
	preSegmentId_:-1,
	nextSegmentId_:-1,
	showDiscontinuity_:false,
	addedSegment_:null,
	
	onMediaSourceOpenBinded_:null,
	onMediaSourceEndedBinded_:null,
	onMediaSourceClosedBinded_:null,
	onMediaSourceErrorBinded_:null,
	onSourceUpdateEndBinded_:null,
	onSourceUpdateBinded_:null,
	onSourceUpdateStartBinded_:null,
	onSourceUpdateErrorBinded_:null,
	id_:"",
	tag_:"com::relayCore::player::Stream",
	
	init:function(mgr,id)
	{
		this.manager_ = mgr;
		this.id_ = id;
		this.config_ = rc$.com.relayCore.vo.Config;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.channel_ = this.manager_.channels_.getChannelById_(id);
		this.videoEvents_ = rc$.com.relayCore.player.PLAY_STATES.VideoEvents;
		this.fileMp4_ = new rc$.com.relayCore.channels.rotary.FileHandler();
		this.createVideo_();
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0} init",this.tag_));
	},
	start_:function()
	{
		this.actived_ = true;
		this.onLoop_();
		this.startTimer_();
	},
	createVideo_:function()
	{
		this.video_ = document.createElement("video");
		this.video_.setAttribute("width",400);
		this.video_.setAttribute("height",300);
		this.video_.setAttribute("autoplay","autoplay");
		this.addVideoEvent_(this.video_);
	},
	formatMimeTypeName_ : function(avcc, aac) {
		var typeName = 'video/mp2t; codecs="avc1.64001f"';
		if (avcc) {
			typeName = 'video/mp4; codecs="' + avcc + ', ' + aac + '"';
		}
		return typeName;
	},
	///播放
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
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Add media source failed: {0}",this.tag_, (e || "").toString()));
		}
		return media;
	},
	onMediaSourceOpen_ : function(evt) {
		if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
			return;
		}

		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onMediaSource open, {1} arguments", this.tag_,arguments.length));
		this.mediaOpened_ = true;
		this.addMediaSourceHeader_();
		this.playSegment_();
	},
	onMediaSourceEnded_ : function(evt) {
		if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onMediaSource end, {1} arguments,({2}),({3})",this.tag_, arguments.length, arguments[1], arguments[2]));
	},
	onMediaSourceClosed_ : function(evt) {
		if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onMediaSource close, {1} arguments", this.tag_,arguments.length));
		this.actived_ = false;
		this.mediaOpened_ = false;
	},
	onMediaSourceError_ : function(evt) {
		if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
			return;
		}
		P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onMediaSource error, {1} arguments",this.tag_, arguments.length));
		this.actived_ = false;
		this.mediaOpened_ = false;
	},
	addMediaSourceHeader_ : function() {
		var _b = false;
		var typeName = this.formatMimeTypeName_(this.config_.avccName_, this.config_.aacName_);
		var mediaDescriptions = "";
		if (this.mediaSource_ && !this.sourceBuffer_) {
			try {
				if (this.mediaSource_.sourceBuffers.length > 0) {
					return true;
				}

				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add media source header, type: {1}, medias: {2}",this.tag_, typeName, mediaDescriptions));
				this.sourceBuffer_ = this.mediaSource_.addSourceBuffer(typeName);
				this.sourceIdle_ = true;
				this.sourceMime_ = typeName;
				this.addSourceEvents_(this.sourceBuffer_);
				// this.addSourceBufferListEvent_();
				_b = true;
			} catch (err) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Add media source header, type: {1}, medias: {2}, error: {3}",tis.tag_, typeName,
						mediaDescriptions, err.toString()));
				this.clearMediaSource_();
				_b = false;
			}
		}
		return _b;
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
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Add source event failed: {1}",this.tag_, (e || "").toString()));
		}
	},

	removeSourceEvents_ : function(source) {
		try {
			source.removeEventListener('updateend', this.onSourceUpdateEndBinded_);
			source.removeEventListener('update', this.onSourceUpdateBinded_);
			source.removeEventListener('updatestart', this.onSourceUpdateStartBinded_);
			source.removeEventListener('error', this.onSourceUpdateErrorBinded_);
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Remove source event failed: {1}", this.tag_,(e || "").toString()));
		}
	},

	onSourceUpdateStart_ : function(evt) {
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
		P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::Source update start",this.tag_));
		this.sourceIdle_ = false;
	},

	onSourceUpdate_ : function(evt) {
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
		P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::Source updated",this.tag_));
	},

	onSourceUpdateEnd_ : function(evt) {
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
		this.sourceIdle_ = true;
		try {
			this.config_.bufferd_ = this.sourceBuffer_.buffered;
		} catch (err) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} buffered error ({1})", this.tag_,err));
		}

		var currenTime = this.video_.currentTime;
		if (this.config_.bufferd_ && this.config_.bufferd_.length > 0) {
			for ( var i = 0; i < this.config_.bufferd_.length; i++) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Source update finished, idx({1}), time({2}), range({3}, {4})",this.tag_, i, (currenTime || 0),
						this.config_.bufferd_.start(i), this.config_.bufferd_.end(i)));
			}
		}
	},

	onSourceUpdateError_ : function(evt) {
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
		P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Source update error:{0}", this.tag_,arguments.length));
	},
	startTimer_ : function() {
		this.onLoop_();
		if (this.fetchTimer_) {
			clearInterval(this.fetchTimer_);
		}
		this.fetchTimer_ = setInterval(this.onLoop_.bind(this), this.fectchInterval_);
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
		if (this.channel_.metaData_) {
			this.metaData_ = this.channel_.metaData_;
			this.pictureHeight_ = this.metaData_.pictureHeight_;
			this.pictureWidth_ = this.metaData_.pictureWidth_;
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getMetaData_: height={0},width={1}", this.pictureHeight_,this.pictureWidth_));
		}
	},
	getSegment_ : function() {
		if (this.blockList_.length >= 1) {
			return;
		}
		
		var tempBlock = this.getBlock_(this.nextSegmentId_);
		if(!tempBlock)
		{
			return;
		}
		if(this.addedSegment_&&this.addedSegment_.id_ == tempBlock.id_)
		{
//				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::segment({1}) has addIn wait next...",this.tag_,tempBlock.id_));
				this.nextSegmentId_ = tempBlock.nextId_;
				return;
		}

		var streamInfo = this.requestPlaySlice_(tempBlock.id_);
		if (!streamInfo) {
			var nowTime = new Date().getTime();
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::vtime({1}) requestSegment({2})",this.tag_,this.video_ ? this.video_.currentTime.toFixed(2) : 0, tempBlock.id_));
			return null;
		}
		this.preSegmentId_ = tempBlock.id_;
		this.nextSegmentId_ = tempBlock.nextId_;
		var _params={
				width : tempBlock.pictureWidth_ || 960,
				height : tempBlock.pictureHeight_ || 400,
				encode:this.config_.isEncode
		};
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::segment({1}),nextSegment({2}),Start change to mp4({3})",this.tag_,tempBlock.id_,this.nextSegmentId_,JSON.stringify(_params)));
		var info = this.getStreamInfo_(streamInfo.stream,_params,tempBlock);
		tempBlock.timestamp_ = info.start;
		this.blockList_.push({
			data : info.stream,
			block : tempBlock,
			mime : this.formatMimeTypeName_(this.config_.avccName_, this.config_.aacName_)
		});
	},
	getStreamInfo_:function(stream,params,block){
		var _stream = stream;
		var _start = 0;
		var startChangeTime = this.global_.getMilliTime_();
		if(this.fileMp4_)
		{
			_stream = this.fileMp4_.processFileSegment_(stream,params);
			this.config_.avccName_ = this.fileMp4_.getMediaStreamAvccName_();
			this.config_.aacName_ = this.fileMp4_.getMediaStreamAacName_();
			_start = this.fileMp4_.startTime;
			var endChangeTime = this.global_.getMilliTime_();
			P2P_ULOG_INFO(P2P_ULOG_FMT(
					"{0} turn to mp4, segmentid({0}), before({1}), after({2}),timeuse({3}),playtime({4}),nextSegmentId({5}),startTime({6}),params({7})",this.tag_,
					block.id_, stream.length, _stream.length, ((endChangeTime - startChangeTime) / 1000).toFixed(1),
					this.video_ ? this.video_.currentTime.toFixed(2) : 0, this.nextSegmentId_,_start,JSON.stringify(params)));
		}
		return {"stream":_stream,"start":_start};
	},
	requestPlaySlice_:function(id)
	{
		if (this.channel_ == null) {
			var responseDetails = "Channel Not Found";
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Request play slice {1}",this.tag_, responseDetails));
			return null;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Request play slice urgent segment id: {1}", this.tag_,id));
		var channelId_ = this.channel_.id_;
		var segment_ = this.channel_.metaData_.getSegmentById_(id);
		if(segment_ == null)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Request bucket_ of segment id: {1} not found!", this.tag_,id));
			return null;
		}
		var bucket_ = rc$.com.relayCore.channels.storage.Pool.getBucketById_(channelId_);
		if(bucket_ == null)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Request bucket_ channel({1}) not found!", this.tag_,channelId_));
			return null;
		}
		var storageId = this.channel_.metaData_.getSegmentStorageId_(id);
		var stream_ = bucket_.read(storageId,0);
		if(stream_ == -1)
		{
			return  null;
		}
		return {
			segment : segment_,
			stream : stream_
		};
	},
	getBlock_ : function(nextSegment) {
		if (!this.metaData_) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Meta data is null",this.tag_));
			return null;
		}
		for ( var n = 0; n < this.metaData_.segments_.length - 1; n++) {
			var segment = this.metaData_.segments_[n];
			var segment2 = this.metaData_.segments_[n + 1];
			segment.nextId_ = segment2.id_;
			if (n == this.metaData_.segments_.length - 2) {
				segment2.nextId_ = segment2.id_;
			}
		}
		
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (nextSegment == segment.id_) {
				return segment;
			}
			if (n == this.metaData_.segments_.length - 1) {
				P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::segment ({1}) not found,return default segment({2})",this.tag_, nextSegment,
						this.metaData_.segments_[0].id_));
			}
		}
		return this.metaData_.segments_[0];
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
		if (!this.config_.avccName_) {
			return;
		}
		this.calculateBufferLength_();
		if (!this.mediaSource_) {
			P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::Create media source ...",this.tag_));
			this.sourceBuffer_ = null;
			this.mediaSource_ = this.createMediaSource_();
			this.video_.src = window.URL.createObjectURL(this.mediaSource_);
		}
		if (!this.sourceBuffer_) {
			if (!this.mediaOpened_) {
				this.delayTime_++;
				if (this.delayTime_ > 500) {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Play segment with delay count({1})", this.tag_,this.delayTime_));
				}
				return;
			}
			this.addMediaSourceHeader_();
		}
		if (this.sourceBuffer_.updating) {
			return;
		}
		if(this.blockList_.length==0)
		{
			return;
		}
		var streamInfo = this.blockList_[0];
		if (streamInfo.block.index_ == 0) {
			this.isFirstSegment_ = true;
		}

		if (this.addedSegment_ && streamInfo.block.timestamp_ < this.addedSegment_.timestamp_) {
			if (!this.showDiscontinuity_) {
				if (streamInfo.block.discontinuity_) {
					this.showDiscontinuity_ = true;
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::discontinuity true, segment({1})", this.tag_,streamInfo.block.id_));
				} else {
					streamInfo.block.discontinuity_ = true;
					this.showDiscontinuity_ = true;
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::discontinuity false, segment({1})", this.tag_,streamInfo.block.id_));
				}
			}
		}

		if (streamInfo.block.discontinuity_ && !this.playNextVideo_ && this.lastDiscontinuitySegment_ != streamInfo.block.id_) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::playNextVideo",this.tag_));
			if (this.config_.bufferLength_ < 0.2 || this.playNextDelayTime_ > 5) {

				var offsetTime = ((streamInfo.block.timestamp_ || 0)) / 1000;

				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Start to play next video, buffer({0}), delay({1}), offset({2}), mime({3}, {4} => {5})",this.tag_,
						this.config_.bufferLength_.toFixed(3), this.playNextDelayTime_, offsetTime, streamInfo.mime == this.sourceMime_ ? "same"
								: "diff", this.sourceMime_, streamInfo.mime));

				// this.video_.pause();
				this.video_.currentTime = offsetTime;

				if (streamInfo.mime != this.sourceMime_) {
					// play next video
					this.clearMediaSource_();
					// this.removeSourceBuffer_();
					this.playNextVideo_ = true;
					this.isFirstSegment_ = true;
					this.config_.bufferd_ = null;
					this.config_.avccName_ = null;
					this.config_.aacName_ = null;
					this.blockList_ = [];
				} else if (this.sourceBuffer_.buffered.length > 0) {
					this.sourceBuffer_.remove(0, this.sourceBuffer_.buffered.end(this.sourceBuffer_.buffered.length - 1));
				}

				// this.removeVideoEvent_(this.video_);
				// this.video_ = null;

				this.preTime_ = 0;
				this.playNextDelayTime_ = 0;
				this.showDiscontinuity_ = false;
				this.addedSegment_ = null;
				this.config_.bufferLength_ = 0;
				this.lastDiscontinuitySegment_ = streamInfo.block.id_;
			} else {
				if (this.config_.bufferLength_ < 3) {
					this.playNextDelayTime_++;
				}
			}
			this.nextSegmentId_ = streamInfo.block.id_;
			return null;
		}
		if (this.blockList_.length <= 0 || this.config_.bufferLength_ >= this.config_.maxBufferLength) {
			return;
		}
		this.blockList_.shift();
		this.sourceBuffer_.appendBuffer(streamInfo.data);
		this.addedSegment_ = streamInfo.block;

		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add data success ,buffer length({1}),blockLength ({2}s), segmentId({3}), startTime({4}), timestamp({5}), discontinuity({6}), segment length ({7}), prev segment({8}), next segment({9})",this.tag_, this.config_.bufferLength_.toFixed(2), streamInfo.block.duration_ / 1000,
				streamInfo.block.id_, this.global_.getCurentTime_(streamInfo.block.startTime_ / 1000), streamInfo.block.timestamp_,
				streamInfo.block.discontinuity_, streamInfo.data.length, this.preSegmentId_, this.nextSegmentId_));
	},
	calculateBufferLength_ : function() {
		if (!this.video_) {
			return;
		}
		var _st = 0;
		var _ed = 0;
		this.preTime_ = this.video_.currentTime;
		this.config_.bufferLength_ = 0;
		if (!this.config_.bufferd_) {
			return;
		}
		var start_ = -1;
		var end_ = -1;
		var exit_ = false;
		var next_p = -1;
		for ( var i = 0; i < this.config_.bufferd_.length; i++) {
			_st = this.config_.bufferd_.start(i);
			_ed = this.config_.bufferd_.end(i);
			exit_ = true;
			if (this.isFirstSegment_) {
				this.config_.bufferLength_ = _ed - _st;
				this.isFirstSegment_ = false;
				this.video_.currentTime = Math.ceil(_st);
				this.onBufferEndAndOnPrepared_();
				this.video_.play();
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::play first segment seek to({1})",this.tag_, this.video_.currentTime.toFixed(1)));
				this.playNextVideo_ = null;
			} else {
				if(_st<1){_st = 0;}
				if(start_==-1)
				{
					start_ = _st;
					end_ = _ed;
				}
				else
				{
					if(_st - end_ < 1)
					{
						end_ = _ed;
					}
					else
					{
						start_ = _st;
						end_ = _ed;
					}
				}
				if(start_<=this.preTime_&&end_>=this.preTime_)
				{
					this.config_.bufferLength_=(end_-this.preTime_);
				}
				if(_st<=this.preTime_&&_ed>=this.preTime_)
				{
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::seekPos pre({1}),st({2}),ed({3}),length({4})",this.tag_,this.preTime_,_st,_ed,this.config_.bufferd_.length));
					exit_=true;
				}
				else if(_st - this.preTime_ < 1)
				{
					next_p = _st;
				}
			}
		}
//		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::seekPos buffer({0}),length({1}),exit({2})",this.playerContext_.bufferLength_,this.config_.bufferLength/2,exit_));
		if(this.config_.bufferLength_>this.config_.maxBufferLength/2&&!exit_)//存在buffer,但是没找到时间位置，需要跳跃buffer播放
		{
			this.video_.cuttentTime = next_p;
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::seekPos, current({1}), buffer({2}), exit_({3}))",this.tag_,this.preTime_, this.config_.bufferLength_, exit_));
		}
//		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Calculate buffer, current({0}), pre({1}), buffer({2}), pre segment({3}), next segment({4})",this.video_.currentTime, this.preTime_, this.playerContext_.bufferLength_, this.preSegmentId_, this.nextSegmentId_));
	},
	onBufferEndAndOnPrepared_ : function() {
//		if (this.config_.videoStatus_ == rc$.com.relayCore.player.VIDEO_STATUS.loadstart) {
//			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Video can play",this.tag_));
//			this.config_.videoStatus_ = rc$.com.relayCore.player.VIDEO_STATUS.canplay;
//			if (this.wrapper_.onbufferend) {
//				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video event onVideoCanPlay bufferend"));
//				this.wrapper_.onbufferend();
//			}
//			if (!this.firstOnPrepared_ && this.wrapper_.onprepared) {
//				// throw the onprepared event at first play only
//				this.firstOnPrepared_ = true;
//				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video event onVideoCanPlay onprepared"));
//				this.wrapper_.onprepared();
//			} else {
//				// error,replay
//				this.video_.play();
//			}
//		}
	},
	addVideoEvent_ : function(video) {
		var _me = this;
		for ( var i = 0; i < this.videoEvents_.length; i++) {
//			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add video event, type({1})", this.tag_,this.videoEvents_[i]));
			try {
				video.addEventListener(this.videoEvents_[i], function(evt) {
					_me.videoStatusHandler_(evt);
				});
			} catch (e) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Add video event failed, type({1}), error({2})", this.tag_,this.videoEvents_[i], (e || "none").toString()));
			}
		}
	},
	removeVideoEvent_ : function(video) {
		var me = this;
		for ( var i = 0; i < this.videoEvents_.length; i++) {
			try {
				video.removeEventListener(this.videoEvents_[i], function(evt) {
					me.videoStatusHandler_(evt);
				});
			} catch (e) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Remove video event failed, type({1}), error({2})",this.tag_, this.videoEvents_[i], (e || "none").toString()));
			}
		}
	},

	videoStatusHandler_ : function(evt) {
		var _type = evt.type;
//		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Video status handler, type({1})", this.tag_,_type));
		switch (_type) {
		case "abort":
			break;
		case "canplay":
			break;
		case "canplaythrough":
			// this.onCanPlayThrough_();
			break;
		case "durationchange":
			break;
		case "emptied":
			break;
		case "ended":
			// this.onEnded_();
			break;
		case "error":
			break;
		case "loadeddata":
			break;
		case "loadedmetadata":
			// this.onVideoLoadedMetaData_();
			break;
		case "loadstart":
			break;
		case "pause":
			break;
		case "play":
			break;
		case "playing":
			// this.onVideoPlaying_();
			break;
		case "progress":
//			console.log(this.stream_.getVideoTracks (),this.stream_.getAudioTracks ());
			break;
		case "ratechange":
			break;
		case "seeked":
			break;
		case "seeking":
			break;
		case "stalled":
			break;
		case "suspend":
			break;
		case "timeupdate":
			break;
		case "volumechange":
			break;
		case "waiting":
			// this.onVideoWaiting_(evt);
			break;
		}
	},
});