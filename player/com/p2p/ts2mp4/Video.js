h5$.nameSpace('com.p2p.ts2mp4');

h5$.com.p2p.ts2mp4.Video = h5$.createClass(
{
	_nalData: null,
	_vTag: null,
	_vTagData: null,
	_scState: null,
	_tags: null,
	_avccData: null,
	_videoInfo: null,
	_h264Data: null,
	
	__ctor: function()
	{
		this.reset();
	},
	
	reset: function()
	{
		this._scState = 0;
		this._nalData = new h5$.com.p2p.ts2mp4.ByteArray(1024);
		this._vTag = null;
		this._vTagData = null;
		this._tags = [];
		this._avccData = null;
		this._videoInfo = 
		{
			width: 960,
			height: 540,
			timeScale: 1000,
			duration: 0
		};
		//this._h264Data = new WebP2P.ts2mp4.ByteArray(100);
	},
	get_pts:function(p1,p2,p3)
	{
		return ((p1 & 0x0e) *Math.pow(2,29)) + ((p2 & 0xfffe) << 14) + ((p3 & 0xfffe) >> 1);
	},
	processES: function( pusi, packet, flush)
	{
		//if( packet ) this._h264Data.writeBytes(packet, packet.position, packet.length - packet.position);
		var i;
		if(pusi)
		{
			// start of a new PES packet			
			if(packet.readUnsignedInt() != 0x1e0)
			{
				throw "PES start code not found or not AAC/AVC";
			}
			// Ignore packet length and marker bits.
			packet.position += 3;
			// Need PTS and DTS
			var flags = (packet.readUnsignedByte() & 0xc0) >> 6;		
			if(flags != 0x03 && flags != 0x02)
			{
				throw "video PES packet without PTS cannot be decoded";
			}
			// Check PES header length
			var length = packet.readUnsignedByte();
			var p1 = packet.readUnsignedByte();
			var p2 = packet.readUnsignedShort();
			var p3 = packet.readUnsignedShort();
			var pts = this.get_pts(p1,p2,p3);
				
//			console.log("time:",p1,(p1 & 0x0e),(p1 & 0x0e) << 29);
	
			this._timestamp = Math.round(pts/90);
			length -= 5;
			if(flags == 0x03)
			{
				p1 = packet.readUnsignedByte();
				p2 = packet.readUnsignedShort();
				p3 = packet.readUnsignedShort();
				var dts = this.get_pts(p1,p2,p3);
					
//				this._timestamp = ;
				this._compositionTime =  this._timestamp-Math.round(dts/90);
//				console.log("-->video--pts "+pts.toString()+" dts "+dts.toString()+" comp "+this._compositionTime.toString() +" stamp "+this._timestamp.toString() +" total "+(this._compositionTime+this._timestamp).toString());
				length -= 5;
			}
			else
			{
				this._compositionTime = 0;
			}
//			console.log("--->flags:",flags,",ct=",this._compositionTime);

			// Skip other header data.
			packet.position += length;
		}
		var dStart = 0;
		if(!flush) dStart = packet.position;	// assume that the copy will be from start-of-data

		var nals = [];
		var nal = null;
		
		if(flush)
		{
			nal = new h5$.com.p2p.ts2mp4.H264NALU(this._nalData); // full length to end, don't need to trim last 3 bytes
			if(nal.NALtype() !== 0)
			{
				nals.push(nal); // could inline this (see below)	
				console.log("-->pushed one flush nal of type " + nal.NALtype());
			}
			this._nalData = new h5$.com.p2p.ts2mp4.ByteArray(1024);
		}
		else while(packet.bytesAvailable() > 0)
		{
			var value = packet.readUnsignedByte();
			
			// finding only 3-byte start codes is ok as trailing zeros are ignored in most (all?) cases
			//console.log("# "+value.toString(16) + "  at st "+this._scState.toString());
			// unperf
			// this._nalData.writeByte(value);	// in the future we will performance-fix this by keeping indexes and doing block copies, for now we want it to work at all
			switch(this._scState)
			{
			case 0:
				if(value === 0x00)
					this._scState = 1;
				break;
			case 1:
				if(value === 0x00)
					this._scState = 2;
				else
					this._scState = 0;
				break;
			case 2:
				if(value === 0x00)	// more than 2 zeros... no problem
				{
					// state stays at 2
					//console.log("ex zero");
					break;
				}
				else if(value == 0x01)
				{
					// perf
					this._nalData.writeBytes(packet, dStart, packet.position-dStart);
					dStart = packet.position;
					// at this point we have the NAL data plus the *next* start code in _nalData
					// unless there was no previous NAL in which case _nalData is either empty or has the leading zeros, if any
					if(this._nalData.length > 4) // require >1 byte of payload
					{
						this._nalData.length -= 3; // trim off the 0 0 1 (might be one more zero, but in H.264 that's ok)
						nal = new h5$.com.p2p.ts2mp4.H264NALU(this._nalData);
						if(nal.NALtype() !== 0)
						{
							//console.log("F NAL TYPE "+nal.NALtype().toString());
							nals.push(nal); // could inline this as well, rather than stacking and processing later in the function	
						}
					}
					else
					{
						console.log("-->length too short! = " + this._nalData.length);
					}
					this._nalData = new h5$.com.p2p.ts2mp4.ByteArray(1024); // and start collecting into the next one
					this._scState = 0; // got one, now go back to looking
					break;
				}
				else
				{
					// console.log("0, 0,... " + value.toString());
					this._scState = 0; // go back to looking
					break;
				}
				// notreached
				break;
			default:
				// shouldn't ever get here
				this._scState = 0;
				break;
			} // switch _scState
		} // while bytesAvailable
		
		if(!flush && packet.position-dStart > 0)
			this._nalData.writeBytes(packet, dStart, packet.position-dStart);
				
		var spsNAL = null;
		var ppsNAL = null;
		// find  SPS + PPS if we can
		for(i = 0; i < nals.length; i ++ )
		{
			nal = nals[i];
			switch(nal.NALtype())
			{
			case 7:
				spsNAL = nal;
				break;
			case 8:
				ppsNAL = nal;
				break;
			default:
				break;
			}
		}

		var tag = null; //:FLVTagVideo;
		var avccTag = null; //:FLVTagVideo = null;
					
		// note that this breaks if the sps and pps are in different segments that we process
		
		if(spsNAL && ppsNAL)
		{
			var spsLength = spsNAL.length();
			var ppsLength = ppsNAL.length();
			
			tag = {};
			tag.timestamp = this._timestamp;
			tag.isKeyFrame = true;
			tag.codecID = 'CODEC_ID_AVC';
			tag.frameType = 'FRAME_TYPE_KEYFRAME';
			tag.avcPacketType = 'AVC_PACKET_TYPE_SEQUENCE_HEADER';
			
			var avcc = new h5$.com.p2p.ts2mp4.ByteArray(1024);
			avcc.writeByte(0x01); // avcC version 1
			// profile, compatibility, level
			avcc.writeBytes(spsNAL.NALdata(), 1, 3);
			avcc.writeByte(0xff); // 111111 + 2 bit NAL size - 1
			avcc.writeByte(0xe1); // number of SPS
			avcc.writeByte(spsLength >> 8); // 16-bit SPS byte count
			avcc.writeByte(spsLength);
			avcc.writeBytes(spsNAL.NALdata(), 0, spsLength); // the SPS
			avcc.writeByte(0x01); // number of PPS
			avcc.writeByte(ppsLength >> 8); // 16-bit PPS byte count
			avcc.writeByte(ppsLength);
			avcc.writeBytes(ppsNAL.NALdata(), 0, ppsLength);
			this._avccData = avcc;
			this.deocodeSps(spsNAL.NALdata(), 0, spsLength);
			
			tag.data = avcc;
			//this._tags.push(tag);
			avccTag = tag;
		}

		for(i = 0; i < nals.length; i ++ )
		{
			nal = nals[i];
			//console.log("   NAL TYPE "+nal.NALtype().toString());
			
			if(nal.NALtype() == 9)	// AUD -  should read the flags in here too, perhaps
			{
				// close the last _vTag and start a new one
				if(this._vTag && this._vTagData.length === 0)
				{
					console.log("-->zero-length vtag"); // can't happen if we are writing the AUDs in
					if(avccTag) console.log(" avccts "+avccTag.timestamp.toString()+" vtagts " + this._vTag.timestamp.toString());
				}
				
				if(this._vTag && this._vTagData.length > 0)
				{
					this._vTag.data = this._vTagData; // set at end (see below)
					this._tags.push(this._vTag);
					this._videoInfo.duration = this._videoInfo.timeScale * this._timestamp / 1000;
					if(avccTag)
					{
						avccTag.timestamp = this._vTag.timestamp;
						avccTag = null;
					}
				}
				this._vTag = {};
				this._vTag.codecID = 'CODEC_ID_AVC';
				this._vTag.frameType = 'FRAME_TYPE_INTER'; // adjust to keyframe later
				this._vTag.avcPacketType = 'AVC_PACKET_TYPE_NALU';
				this._vTag.timestamp = this._timestamp;
				this._vTag.avcCompositionTimeOffset = this._compositionTime;
				this._vTagData = new h5$.com.p2p.ts2mp4.ByteArray(1024); // we assemble the nalus outside, set at end
				this._vTagData.writeUnsignedInt(nal.length());
				this._vTagData.writeBytes(nal.NALdata()); // start with this very NAL, an AUD (XXX not sure this is needed)	
			}
			else if(nal.NALtype() != 7 && nal.NALtype() != 8)
			{
				if(this._vTag === null)
				{
					console.log("-->needed to create vtag");
					this._vTag = {};
					this._vTagData = new h5$.com.p2p.ts2mp4.ByteArray(1024); // we assemble the nalus outside, set at end
					this._vTag.codecID = 'CODEC_ID_AVC';
					this._vTag.frameType = 'FRAME_TYPE_INTER'; // adjust to keyframe later
					this._vTag.avcPacketType = 'AVC_PACKET_TYPE_NALU';
					this._vTag.timestamp = this._timestamp;
					this._vTag.avcCompositionTimeOffset = this._compositionTime;
				}
				
				if(nal.NALtype() == 5) // is this correct code?
				{
					this._vTag.isKeyFrame = true;
					this._vTag.frameType = 'FRAME_TYPE_KEYFRAME';
				}
				this._vTagData.writeUnsignedInt(nal.length());
				this._vTagData.writeBytes(nal.NALdata());
			}
		}
		
		if(flush)
		{
//			console.log(" *** VIDEO FLUSH CALLED");
			if(this._vTag && this._vTagData.length > 0)
			{
				this._vTag.data = this._vTagData; // set at end (see below)
				this._tags.push(this._vTag);
				this._videoInfo.duration = this._videoInfo.timeScale * this._timestamp / 1000;
				if(avccTag)
				{
					avccTag.timestamp = this._vTag.timestamp;
					avccTag = null;
				}
//				console.log("flushing one vtag");
			}
			this._vTag = null; // can't start new one, don't have the info
		}
		return this._timestamp;
	},
	
	deocodeSps: function( buffer, offset, size )
	{
	}
});