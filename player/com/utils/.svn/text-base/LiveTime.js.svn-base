/**
 * 直播事件处理
 */
h5$.nameSpace("com.utils");
h5$.com.utils.LiveTime = {
		timeShift:0,
		startTime:0,
		setVideoStartTime:function(tsTime,videoTime)
		{
			this.startTime = Number(tsTime) - videoTime;
		},
		set serverTime(value)
		{
			this.timeShift = Number(value) - this.localTime;
		},
		get serverTime()
		{
			return this.localTime + this.timeShift;
		},
		get localTime()
		{
			return Math.floor((new Date()).getTime());
		}
};