h5$.nameSpace('com.p2p.ts2mp4');
h5$.com.p2p.ts2mp4.Audio = h5$.createClass(
{
	_state: 0,
	_haveNewTimestamp: false,
	_audioTime: 0,
	_audioTimeIncr: 0,
	_profile: 0,
	_sampleRateIndex: 0,
	_channelConfig: 0,
	_frameLength: 0,
	_remaining: 0,
	_adtsHeader: null,
	_needACHeader: false,
	_audioData: null,
	_aacData: null,
	_tags: null,
	_audioInfo: null,
	_srMap: [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350],
	
	__ctor: function()
	{
		this.reset();
	},
	
	reset: function()
	{
		this._state = 0;
		this._adtsHeader = new h5$.com.p2p.ts2mp4.ByteArray(100);
		this._needACHeader = true;	// need more than this, actually... 
		this._tags = [];
		this._audioInfo = 
		{
			timeScale: 44100,
			duration: 0
		};
	},
	get_pts:function(p1,p2,p3)
	{
		return ((p1 & 0x0e) *Math.pow(2,29)) + ((p2 & 0xfffe) << 14) + ((p3 & 0xfffe) >> 1);
	},
	getIncrForSRI: function( srIndex )
	{
		var rate = this._srMap[srIndex];
		return 1024000.0/rate;	// t = 1/rate... 1024 samples/frame and srMap is in kHz
	},
	
	processES: function( pusi, packet, flush)
	{
		var value;
		if(pusi)
		{
			// start of a new PES packet			
			// Start code prefix and packet ID.			
			value = packet.readUnsignedInt();
			packet.position -= 4;
			if( packet.readUnsignedInt() != 0x1c0 )
			{
				throw "PES start code not found or not AAC/AVC";
			}
			// Ignore packet length and marker bits.
			packet.position += 3;
			// need PTS only
			var flags = (packet.readUnsignedByte() & 0xc0) >> 6;
//			console.log("-->flags:",flags);
			if( flags != 0x02 )
			{ 
				throw "No PTS in this audio PES packet";
			}

			var length = packet.readUnsignedByte();
			var p1 = packet.readUnsignedByte();
			var p2 = packet.readUnsignedShort();
			var p3 = packet.readUnsignedShort();
			var pts = this.get_pts(p1,p2,p3);

			this._timestamp = Math.round(pts/90);
			this._haveNewTimestamp = true;
//			console.log("audio:",pts);
			length -= 5;
			// no comp time for audio
			// Skip other header data.
			packet.position += length;
		}
	
		value = 0;
		var tag = null;
		
		var dStart = 0;
		if(!flush)
		{
			dStart = packet.position;
		}
		
		if(flush)
		{
			console.log("-->audio flush at state " + this._state.toString());
		}
		else while(packet.bytesAvailable() > 0)
		{			
			if(this._state < 7)
			{
				value = packet.readUnsignedByte();
				this._adtsHeader.setByte(this._state, value);
			}
				
			switch(this._state)
			{
			case 0: // first 0xff of flags
				if(this._haveNewTimestamp)
				{
					this._audioTime = this._timestamp;
					this._haveNewTimestamp = false;
				}
					
				if(value == 0xff)
				{
					this._state = 1;
				}
				else
				{
					//console.log("adts seek 0");
				}
				break;
				
			case 1: // final 0xf of flags, first nibble of flags
				if((value & 0xf0) != 0xf0)
				{
					//console.log("adts seek 1");
					this._state = 0;
				}
				else
				{
					this._state = 2;
					// 1 bit always 1
					// 2 bits of layer, always 00
					// 1 bit of protection present
				}
				break;
				
			case 2:
				this._state = 3;
				this._profile = (value >> 6) & 0x03;
				//console.log("raw "+value.toString(2));
				//console.log("profile "+_profile.toString(2));
				this._sampleRateIndex = (value >> 2) & 0x0f;
				//console.log("sample rate index "+this._sampleRateIndex);
				this._audioTimeIncr = this.getIncrForSRI(this._sampleRateIndex);
				//if( this._audioTimeIncr > 0 ) this._audioInfo.timeScale = this._audioTimeIncr;
				// one private bit
				this._channelConfig = (value & 0x01) << 2; // first bit thereof
				break;
				
			case 3:
				this._state = 4;
				//console.log("raw "+value.toString(2));
				this._channelConfig += (value >> 6) & 0x03; // rest of channel config
				// orig/copy bit
				// home bit
				// copyright id bit
				// copyright id start
				this._frameLength = (value & 0x03) << 11; // bits 12 and 11 of the length
				break;
				
			case 4:
				this._state = 5;
				//console.log("raw "+value.toString(2));
				this._frameLength += (value) << 3; // bits 10, 9, 8, 7, 6, 5, 4, 3
				break;
				
			case 5:
				this._state = 6;
				//console.log("raw "+value.toString(2));
				this._frameLength += (value & 0xe0) >> 5;
				//console.log("framelen "+this._frameLength.toString(2));
				this._remaining = this._frameLength - 7;	// XXX crc issue?
				//console.log("remaining: "+this._remaining.toString());
				// buffer fullness
				break;
				
			case 6:
				this._state = 7;
				dStart = packet.position;
				this._audioData = new h5$.com.p2p.ts2mp4.ByteArray(2048);
				// 6 more bits of buffer fullness
				// 2  bits number of raw data blocks in frame (add one to get count)				
				if(this._needACHeader)
				{
					tag = {};
					tag.timestamp = this._audioTime;
					tag.soundFormat = 'SOUND_FORMAT_AAC';
					tag.soundChannels = 'SOUND_CHANNELS_STEREO';
					tag.soundRate = 'SOUND_RATE_44K'; // rather than what is reported
					tag.soundSize = 'SOUND_SIZE_16BITS';
					tag.isAACSequenceHeader = true;
					
					this._aacData = new Uint8Array((this._sampleRateIndex == 7) ? 7 : 2);
					this._aacData[0] = (this._profile + 1) << 3;
					this._aacData[0] |= this._sampleRateIndex >> 1;
					this._aacData[1] = (this._sampleRateIndex & 0x01) << 7;
					this._aacData[1] |= this._channelConfig << 3;
					if( this._sampleRateIndex == 7 )
					{
						var privateBytes = [0x56,0xE5,0xA5,0x48,0x80];
						for( var i = 0; i < privateBytes.length; i ++ )
						{
							this._aacData[i + 2] = privateBytes[i];
						}
					}
					this._audioInfo.channelCount =  2; //this._channelConfig;
					this._audioInfo.timeScale = this._srMap[this._sampleRateIndex] || 44100;
					this._audioInfo.sampleSize = 16; // * this._audioInfo.timeScale / 44100;

					//console.log('_profile is : ' + this._profile);
					//console.log('_sampleRateIndex is : ' + this._sampleRateIndex);
					//console.log('_channelConfig is : ' + this._channelConfig);
				
					/*
					acHeader[0] = (this._profile + 1)<<3;
					acHeader[0] |= this._sampleRateIndex >> 1;
					acHeader[1] = (this._sampleRateIndex & 0x01) << 7;
					acHeader[1] |= this._channelConfig << 3;
					acHeader.length = 2;
					*/
					this._adtsHeader.length = 4;
					tag.data = this._adtsHeader;
					this._needACHeader = false;
					
					//console.log("adding AC header of "+uint(this._adtsHeader[0]).toString(16)+" "+uint(this._adtsHeader[1]).toString(16)+" "+uint(this._adtsHeader[2]).toString(16)+" "+uint(this._adtsHeader[3]).toString(16));
					//tag.write(tagData); // unroll out vector
					//this._tags.push(tag);
				}
				break;
				
			case 7:
				if((packet.length - dStart) >= this._remaining)
				{
					packet.position += this._remaining;
					this._remaining = 0;
				}
				else
				{
					var avail = packet.length - dStart;
					packet.position += avail;
					this._remaining -= avail;
					this._audioData.writeBytes(packet, dStart, packet.position-dStart);
				}

				if(this._remaining > 0)
				{
					//
				}
				else
				{
					this._audioData.writeBytes(packet, dStart, packet.position - dStart);
					this._state = 0;
					
					tag = {};
					tag.timestamp = this._audioTime;
					//console.log("audio timestamp " + this._audioTime.toString());
					this._audioTime += this._audioTimeIncr;
					tag.soundChannels = 'SOUND_CHANNELS_STEREO';
					tag.soundFormat = 'SOUND_FORMAT_AAC';
					tag.isAACSequenceHeader = false;
					tag.soundRate = 'SOUND_RATE_44K'; // rather than what is reported
					tag.soundSize = 'SOUND_SIZE_16BITS';
					tag.data = this._audioData;
					//tag.write(tagData); // unrolled out the vector for audio tags
					//console.log("done");
					this._tags.push(tag);
				}
				break;
			} // switch
		} // while
	}
});