p2p$.ns('com.webp2p.segmentmp4');

p2p$.com.webp2p.segmentmp4.Video = JClass.extend_(
{
	_nalData: null,
	_vTag: null,
	_vTagData: null,
	_scState: null,
	_tags: null,
	_avccData: null,
	_videoInfo: null,
	_pts:0,
	_dts:0,
	_compositionTime:0,
	init: function()
	{
		this.reset();
	},
	
	reset: function()
	{
		this._scState = 0;
		this._nalData = new p2p$.com.webp2p.segmentmp4.ByteArray(1024);
		this._vTag = null;
		this._vTagData = null;
		this._tags = [];
		this._avccData = null;
		this._pts=0;
		this._dts=0;
		this._compositionTime=0;
		this._videoInfo = 
		{
			timeScale: 1000,
			simpleSize:0,
			duration: 0,
			firstTimestamp:-1,
			lastTimestamp:-1,
			sampleDuration:0
		};
	},
	get_pts:function(p1,p2,p3)
	{
		return ((p1 & 0x0e) *Math.pow(2,29)) + ((p2 & 0xfffe) << 14) + ((p3 & 0xfffe) >> 1);
	},

	processES: function( pusi, packet, flush)
	{
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
			this._pts = Math.round(this.get_pts(p1,p2,p3)*this._videoInfo.timeScale/90000);
			length -= 5;
			if(flags == 0x03)
			{
				p1 = packet.readUnsignedByte();
				p2 = packet.readUnsignedShort();
				p3 = packet.readUnsignedShort();
				this._dts = Math.round(this.get_pts(p1,p2,p3)*this._videoInfo.timeScale/90000);
				this._compositionTime =  Math.round(this._pts-this._dts);
				length -= 5;
			}
			else if(flags == 0x02)
			{
				this._dts = this._pts;
				this._compositionTime = 0;
			}
			// Skip other header data.
			packet.position += length;
		}
		var dStart = 0;
		if(!flush) dStart = packet.position;	// assume that the copy will be from start-of-data

		var nals = [];
		var nal = null;
		
		if(flush)
		{
			nal = new p2p$.com.webp2p.segmentmp4.H264Nalu(this._nalData); // full length to end, don't need to trim last 3 bytes
			if(nal.NALtype() !== 0)
			{
				nals.push(nal); // could inline this (see below)	
//				console.log("-->pushed one flush nal of type " + nal.NALtype());
			}
			this._nalData = new p2p$.com.webp2p.segmentmp4.ByteArray(1024);
		}
		else while(packet.bytesAvailable() > 0)
		{
			var value = packet.readUnsignedByte();
			
			// finding only 3-byte start codes is ok as trailing zeros are ignored in most (all?) cases
//			console.log("# "+value.toString(16) + "  at st "+this._scState.toString());
			// unperf
			// this._nalData.writeByte(value);	// in the future we will performance-fix this by keeping indexes and doing block copies, for now we want it to work at all
			switch(this._scState)
			{
			case 0:
				if(value === 0x00)
				{
					this._scState = 1;
				}
				break;
			case 1:
				if(value === 0x00){
					this._scState = 2;
				}
				else
				{
					this._scState = 0;
				}	
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
						nal = new p2p$.com.webp2p.segmentmp4.H264Nalu(this._nalData);
						if(nal.NALtype() !== 0)
						{
							//console.log("F NAL TYPE "+nal.NALtype().toString());
							nals.push(nal); // could inline this as well, rather than stacking and processing later in the function	
						}
					}
					else
					{
//						console.log("-->length too short! = " + this._nalData.length);
					}
					this._nalData = new p2p$.com.webp2p.segmentmp4.ByteArray(1024); // and start collecting into the next one
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
			tag.timestamp = this._pts;
			tag.pts = this._pts;
			tag.dts = this._dts;
			tag.isKeyFrame = true;
			tag.codecID = 'CODEC_ID_AVC';
			tag.frameType = 'FRAME_TYPE_KEYFRAME';
			tag.avcPacketType = 'AVC_PACKET_TYPE_SEQUENCE_HEADER';
			
			var avcc = new p2p$.com.webp2p.segmentmp4.ByteArray(1024);
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
//					console.log("-->zero-length vtag"); // can't happen if we are writing the AUDs in
					if(avccTag) console.log(" avccts "+avccTag.timestamp.toString()+" vtagts " + this._vTag.timestamp.toString());
				}
				
				if(this._vTag && this._vTagData.length > 0)
				{
					this._vTag.data = this._vTagData; // set at end (see below)
					this._tags.push(this._vTag);
					this._videoInfo.duration = this._pts;
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
				this._vTag.timestamp = this._pts;
				this._vTag.pts = this._pts;
				this._vTag.dts = this._dts;
				this._vTag.avcCompositionTimeOffset = this._compositionTime;
				this._vTagData = new p2p$.com.webp2p.segmentmp4.ByteArray(1024); // we assemble the nalus outside, set at end
				this._vTagData.writeUnsignedInt(nal.length());
				this._vTagData.writeBytes(nal.NALdata()); // start with this very NAL, an AUD (XXX not sure this is needed)	
			}
			else if(nal.NALtype() != 7 && nal.NALtype() != 8)
			{
				if(this._vTag === null)
				{
//					console.log("-->needed to create vtag");
					this._vTag = {};
					this._vTagData = new p2p$.com.webp2p.segmentmp4.ByteArray(1024); // we assemble the nalus outside, set at end
					this._vTag.codecID = 'CODEC_ID_AVC';
					this._vTag.frameType = 'FRAME_TYPE_INTER'; // adjust to keyframe later
					this._vTag.avcPacketType = 'AVC_PACKET_TYPE_NALU';
					this._vTag.timestamp = this._pts;
					this._vTag.pts = this._pts;
					this._vTag.dts = this._dts;
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
			if(this._vTag && this._vTagData.length > 0)
			{
				this._vTag.data = this._vTagData; // set at end (see below)
				this._tags.push(this._vTag);

				var current = this._tags[0];
				var earlyTime = current.dts;
				var maxTime = current.dts;
				
				for (var i = 0, length = this._tags.length - 1; i < length; i++) {
					
					var next = this._tags[i + 1];
					if(next.dts<earlyTime)
					{
						earlyTime = next.dts;
					}
					if(next.dts>maxTime)
					{
						maxTime = next.dts;
					}
					current = next;
				}
				this._videoInfo.sampleDuration = Math.ceil((maxTime-earlyTime)/(this._tags.length-1));
				this._videoInfo.firstTimestamp = earlyTime;
				this._videoInfo.lastTimestamp = maxTime;
				this._videoInfo.duration = this._videoInfo.lastTimestamp+this._videoInfo.sampleDuration;//this._videoInfo.sampleDuration*this._tags.length;
				if(avccTag)
				{
					avccTag.timestamp = this._vTag.timestamp;
					avccTag = null;
				}
			}
			this._vTag = null; // can't start new one, don't have the info
		}
		return this._dts;
	}
});
