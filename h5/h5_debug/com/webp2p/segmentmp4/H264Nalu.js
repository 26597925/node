p2p$.ns('com.webp2p.segmentmp4');
p2p$.com.webp2p.segmentmp4.H264Nalu = JClass.extend_(
{
	data: null,
	
	init:function ( source )
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
