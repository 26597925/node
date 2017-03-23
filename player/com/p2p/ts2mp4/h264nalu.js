h5$.nameSpace('com.p2p.ts2mp4');
h5$.com.p2p.ts2mp4.H264NALU = h5$.createClass(
{
	data: null,
	
	__ctor:function ( source )
	{
		this.data = source;
	},
	
	NALtype: function()
	{
		return this.data.getByte(0) & 0x1f;
	},
	
	length: function()
	{
		return this.data.length;
	},
	
	NALdata: function()
	{
		return this.data;
	}
});