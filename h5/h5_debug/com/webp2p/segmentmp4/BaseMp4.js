p2p$.ns('com.webp2p.segmentmp4');

p2p$.com.webp2p.segmentmp4.BaseMp4 = JClass.extend_({
	width:0,
	height:0,
	video:null,
	audio:null,
	writeArrayBuffer: function( to, offset, from )
	{
		var i;
		if( from.className == 'WebP2P.ts2mp4.ByteArray' )
		{
			for(i = 0; i < from.length; i ++ )
			{
				to[offset + i] = from.getByte(i);
			}
		}
		else
		{
			for(i = 0; i < from.length; i ++ )
			{
				to[offset + i] = from[i];
			}
		}
		return from.length;
	},
	
	writeArrayString: function( to, offset, from )
	{
		for( var i = 0; i < from.length; i ++ )
		{
			to[offset + i] = from.charCodeAt(i);
		}
		return from.length;
	},
	
	writeArrayUint8: function( to, offset, from )
	{
		var position = offset;
		if( Object.prototype.toString.call(from) == '[object Array]' )
		{
			for( var i = 0; i < from.length; i ++ )
			{
				position += this.writeArrayUint8(to, position, from[i]);
			}
		}
		else
		{
			to[position ++] = from & 0xff;
		}
		return position - offset;
	},

	writeArrayUint16: function( to, offset, from )
	{
		var position = offset;
		if( Object.prototype.toString.call(from) == '[object Array]' )
		{
			for( var i = 0; i < from.length; i ++ )
			{
				position += this.writeArrayUint16(to, position, from[i]);
			}
		}
		else
		{
			to[position ++] = (from >> 8) & 0xff;
			to[position ++] = from & 0xff;
		}
		return position - offset;
	},
	
	writeArrayUint32: function( to, offset, from )
	{
		var position = offset;
		if( Object.prototype.toString.call(from) == '[object Array]' )
		{
			for( var i = 0; i < from.length; i ++ )
			{
				position += this.writeArrayUint32(to, position, from[i]);
			}
		}
		else
		{
			to[position ++] = (from >> 24) & 0xff;
			to[position ++] = (from >> 16) & 0xff;
			to[position ++] = (from >> 8) & 0xff;
			to[position ++] = from & 0xff;
		}
		return position - offset;
	}
});
