p2p$.ns('com.webp2p.core.player');

p2p$.com.webp2p.core.player.VIDEO_STATUS = {
	loadstart : 'loadstart',
	loadeddata : 'loadeddata',
	canplay : 'canplay',
	seeking : 'seeking',
	seeked : 'seeked',
	breakstart : 'breakstart',
	breakend : 'breakend',
	replay : 'replay'
};

p2p$.com.webp2p.core.player.PLAY_STATES = {
	status : 'IDE',
	IDE : 'IDE',
	PLAY : 'PLAY',
	PLAYING : 'PLAYING',
	PAUSE : 'PAUSE',
	RESUME : 'RESUME',
	SEEKING : 'SEEKING',
	SEEKED : 'SEEKED',

	VideoEvents : // events
	[ "abort",// 当音频/视频的加载已放弃时
	"canplay",// 当浏览器可以播放音频/视频时
	"canplaythrough",// 当浏览器可在不因缓冲而停顿的情况下进行播放时
	"durationchange",// 当音频/视频的时长已更改时
	"emptied",// 当目前的播放列表为空时
	"empty", "ended",// 当目前的播放列表已结束时
	"error",// 当在音频/视频加载期间发生错误时
	"loadeddata",// 当浏览器已加载音频/视频的当前帧时
	"loadedmetadata",// 当浏览器已加载音频/视频的元数据时
	"loadstart",// 当浏览器开始查找音频/视频时
	"pause",// 当音频/视频已暂停时
	"play",// 当音频/视频已开始或不再暂停时
	"playing",// 当音频/视频在已因缓冲而暂停或停止后已就绪时
	"progress",// 当浏览器正在下载音频/视频时
	"ratechange",// 当音频/视频的播放速度已更改时
	"seeked",// 当用户已移动/跳跃到音频/视频中的新位置时
	"seeking",// 当用户开始移动/跳跃到音频/视频中的新位置时
	"stalled",// 当浏览器尝试获取媒体数据，但数据不可用时
	"suspend",// 当浏览器刻意不获取媒体数据时
	"timeupdate",// 当目前的播放位置已更改时
	"volumechange",// 当音量已更改时
	"waiting" ]
};

p2p$.com.webp2p.core.player.Context = CdeBaseClass.extend_({
	isEncode_ : false,
	metaDataType_ : 0,
	avccName_ : null,
	aacName_ : null,
	bufferd_ : null,
	bufferLength_ : 0,
	playState_ : "PLAY",
	buffers_ : null,
	currentPlayTime_ : 0,
	videoStatus_ : "",
	lastCurrentTime_ : -1,

	init : function() {
		this.playType_ = -1;
		this.isEncode_ = false;
		this.metaDataType_ = -1;
		this.avccName_ = null;
		this.aacName_ = null;
		this.bufferd_ = null;
		this.bufferLength_ = 0;
		this.playState_ = "PLAY";
		this.buffers_ = [];
		this.currentPlayTime_ = 0;
		this.videoStatus_ = "";
		this.lastCurrentTime_ = -1;
	}
});