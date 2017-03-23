h5$.nameSpace("com.p2p.data");
h5$.com.p2p.data.Clip = h5$.createClass
({
	/**时间戳*/
	timestamp: -1,
	/**数据块的字节*/
	size: -1,
	/**数据块播放时长*/
	duration: -1,
	/**groupID*/
	groupID: '',
	/**文件名*/
	name: "",
	url_ts: '',
	
	/**块校验码*/
	block_checkSum: '',
	
	sequence: 0,
	pieceTotal: 0,
	
	width: 0,
	height: 0,
	totalDuration: 0,
	
	discontinuity: 0,
	
	/**总字节偏移量*/
	offsize: 0,
	
	/**片校验码*/
	pieceInfoArray:[],
	nextID: -1
});
