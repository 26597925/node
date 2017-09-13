p2p$.ns('com.webp2p.segmentmp4');
p2p$.com.webp2p.segmentmp4.Audio = JClass.extend_(
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
_maxTimestamp:0,
_firstTimestamp:-1,
_duration:0,

init: function()
{
this.reset();
},

reset: function()
{
this._state = 0;
this._adtsHeader = new p2p$.com.webp2p.segmentmp4.ByteArray(100);
this._needACHeader = true;	// need more than this, actually...
this._tags = [];
this._duration = 0;
this._maxTimestamp = 0;
this._firstTimestamp = -1;
this._audioInfo =
{
timeScale: 44100,
firstTimestamp:0,
lastTimestamp:0,
MaxBitrate:0,
AvgBitrate:0,
sampleDuration:0
};
},
get_pts:function(p1,p2,p3)
{
return ((p1 & 0x0e) *Math.pow(2,29)) + ((p2 & 0xfffe) << 14) + ((p3 & 0xfffe) >> 1);
},
getIncrForSRI: function( srIndex )
{
var rate = this._srMap[srIndex];
return Math.round(1024000.0*90/rate);	// t = 1/rate... 1024 samples/frame and srMap is in kHz
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
this._timestamp = pts;
this._haveNewTimestamp = true;
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
//			console.log("-->audio flush at state " + this._state.toString());
var current = this._tags[0];
var frameRate = {sum: 0, count: 0};
var duration = 0;
var dtsDiffs = [];
current.timestamp=current.timestamp*this._audioInfo.timeScale/90000;
var earlyTime = current.timestamp;
var maxTime = current.timestamp;
var maxBitrate = 0;
var size = current.data.length;
for (var i = 0, length = this._tags.length-1; i < length; i++) {
var next = this._tags[i + 1];
next.timestamp=next.timestamp*this._audioInfo.timeScale/90000;
if(next.timestamp<earlyTime)
{
earlyTime = next.timestamp;
}
if(next.timestamp>maxTime)
{
maxTime = next.timestamp;
}
var dtsDiff = next.timestamp - current.timestamp;
var bitrate = Math.round(current.data.length*this._audioInfo.timeScale/dtsDiff);
if(maxBitrate<bitrate)
{
maxBitrate=bitrate;
}
if (dtsDiff) {
dtsDiffs.push({sample_count: 1, sample_delta: dtsDiff});
duration += dtsDiff;
frameRate.sum += dtsDiff;
frameRate.count++;
} else {
dtsDiffs.length++;
}
current = next;
size+=current.data.length;
}
this._audioInfo.sampleDuration = Math.round(frameRate.sum / frameRate.count);
//			console.log(this._audioInfo.sampleDuration);
this._audioInfo.firstTimestamp = earlyTime;
this._audioInfo.duration = maxTime-earlyTime+this._audioInfo.sampleDuration;
this._audioInfo.MaxBitrate = maxBitrate;
this._audioInfo.AvgBitrate = Math.round(size*this._audioInfo.timeScale/this._audioInfo.duration);
//			console.log("audioTime:",this._audioInfo.firstTimestamp,this._audioInfo.duration,this._audioInfo.sampleDuration,this._audioInfo.MaxBitrate,this._audioInfo.AvgBitrate);
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
//				console.log("framelen "+this._frameLength.toString(2));
this._remaining = this._frameLength - 7;	// XXX crc issue?
//				console.log("remaining: "+this._remaining.toString());
// buffer fullness
break;

case 6:
this._state = 7;
dStart = packet.position;
this._audioData = new p2p$.com.webp2p.segmentmp4.ByteArray(2048);
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
this._audioInfo.sampleSize = 16;
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

if(this._remaining <= 0)
{
this._audioData.writeBytes(packet, dStart, packet.position - dStart);
this._state = 0;

tag = {};
tag.timestamp = this._audioTime;
this._audioTime += this._audioTimeIncr;
//					console.log("audio",this._audioTimeIncr);
tag.soundChannels = 'SOUND_CHANNELS_STEREO';
tag.soundFormat = 'SOUND_FORMAT_AAC';
tag.isAACSequenceHeader = false;
tag.soundRate = 'SOUND_RATE_44K'; // rather than what is reported
tag.soundSize = 'SOUND_SIZE_16BITS';
tag.data = this._audioData;
//tag.write(tagData); // unrolled out the vector for audio tags
//console.log("done");
this._tags.push(tag);

//					console.log("decode audio:",_comp,this._tags.length,this._duration,this._maxTimestamp,this._firstTimestamp);

}
break;
} // switch
} // while
}
});
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
p2p$.ns('com.webp2p.segmentmp4');

p2p$.com.webp2p.segmentmp4.ByteArray = JClass.extend_(
{
position: 0,
length: 0,
data: null,
autoIncrementSize: 1024,
className: 'WebP2P.ts2mp4.ByteArray',

init: function( size, writeable )
{
this.position = 0;
this.data = new Uint8Array(size);
this.length = writeable ? 0 : this.data.length;
},

bytesAvailable: function()
{
return this.data.length - this.position;
},

resize: function( size )
{
var newData = new Uint8Array(size);
for( var i = 0; i < size && i < this.length; i ++ )
{
newData[i] = this.data[i];
}
this.data = newData;
if( this.length > size ) this.length = size;
},

getByte: function( index )
{
return this.data[index];
},

readUnsignedByte: function()
{
if( this.position >= this.data.length ) return 0;
return this.data[this.position ++];
},

readUnsignedShort: function()
{
if( (this.position + 1) >= this.data.length ) return 0;
var value1 = this.data[this.position ++];
var value2 = this.data[this.position ++];
return (value1 << 8) + value2;
},

readUnsignedInt: function()
{
if( (this.position + 3) >= this.data.length ) return 0;
var value1 = this.data[this.position ++];
var value2 = this.data[this.position ++];
var value3 = this.data[this.position ++];
var value4 = this.data[this.position ++];
return (value1 << 24) + (value2 << 16) + (value3 << 8) + value4;
},

setByte: function( index, value )
{
this.data[index] = value;
},

writeByte: function( value )
{
this.writeUnsignedByte(value);
},

writeUnsignedByte: function( value )
{
this.position = Math.min(this.position, this.length);
if( this.data.length < this.position + 1 )
{
this.resize(this.data.length + Math.max(1, this.autoIncrementSize));
}
this.data[this.position ++] = value;
this.length = this.position;
},

writeUnsignedShort: function( value )
{
this.position = Math.min(this.position, this.length);
if( this.data.length < this.position + 2 )
{
this.resize(this.data.length + Math.max(2, this.autoIncrementSize));
}
this.data[this.position ++] = (value >> 8) & 0xff;
this.data[this.position ++] = value & 0xff;
this.length = this.position;
},

writeUnsignedInt: function( value )
{
this.position = Math.min(this.position, this.length);
if( this.data.length < this.position + 2 )
{
this.resize(this.data.length + Math.max(4, this.autoIncrementSize));
}
this.data[this.position ++] = (value >> 24) & 0xff;
this.data[this.position ++] = (value >> 16) & 0xff;
this.data[this.position ++] = (value >> 8) & 0xff;
this.data[this.position ++] = value & 0xff;
this.length = this.position;
},

writeBytes: function( bytes, start, size )
{
var byteSize = bytes.length || 0;
start = start || 0;
size = size || byteSize;

if( bytes.className == 'WebP2P.ts2mp4.ByteArray' )
{
bytes = bytes.data;
}

size = Math.min(size, byteSize - start);
if( start < 0 || size <= 0 ) return;

this.position = Math.min(this.position, this.length);
if( this.data.length < this.position + size )
{
this.resize(this.data.length + Math.max(size, this.autoIncrementSize));
}

var maxIndex = start + size;
this.data[this.position + size - 1] = 0;
for( var i = start; i < maxIndex && i < byteSize; i ++ )
{
this.data[this.position ++] = bytes[i];
}
this.length = this.position;
}
});
p2p$.ns("com.webp2p.segmentmp4");
p2p$.com.webp2p.segmentmp4.FregmentMp4Header = p2p$.com.webp2p.segmentmp4.BaseMp4.extend_({

init:function(params)
{
p2p$.apply(this,params);
},
toBuffer:function()
{
var bufferHeader = new Uint8Array(100000);
var offset = 0;
offset += this.writeFileType(bufferHeader, offset);
offset += this.writeFreeBlock(bufferHeader, offset);
offset += this.writeMovie(bufferHeader, offset);
return bufferHeader.subarray(0,offset);;
},
writeFileType: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "ftyp");
size += this.writeArrayString(buffer, offset + size, "isom"); // major brand
size += this.writeArrayUint32(buffer, offset + size, 0x1); // minor version
size += this.writeArrayString(buffer, offset + size, "msdhmsiximsg"); // compatible brands
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeSegmentType: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "styp");
size += this.writeArrayString(buffer, offset + size, "isom"); // major brand
size += this.writeArrayUint32(buffer, offset + size, 0x1); // minor version
size += this.writeArrayString(buffer, offset + size, "msdhmsiximsg"); // compatible brands
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeFreeBlock: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "free");
size += this.writeArrayString(buffer,offset+size,"this media decode by le.cloud");
size += this.writeArrayUint8(buffer,offset+size,0);
this.writeArrayUint32(buffer,offset,size);
return size;
},
writeMovie: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "moov");
size += this.writeMovieHeader(buffer, offset + size);
//		size += this.writeIodsBox(buffer,offset+size);
size += this.writeMovieExtendBox(buffer,offset+size);
size += this.writeTrack(buffer, offset + size, true);
size += this.writeTrack(buffer, offset + size, false);
this.writeArrayUint32(buffer, offset, size);
return size;
},

writeMovieHeader: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "mvhd");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // creation time
size += this.writeArrayUint32(buffer, offset + size, 0); // modification time
size += this.writeArrayUint32(buffer, offset + size, this.video.info.timeScale); // time scale
//		console.log("time:",this.video.info.timeScale);
size += this.writeArrayUint32(buffer, offset + size, 0); // duration
size += this.writeArrayUint32(buffer, offset + size, 0x00010000); // rate
size += this.writeArrayUint16(buffer, offset + size, 0x0100); // volume
size += this.writeArrayUint16(buffer, offset + size, 0); // reserved
size += this.writeArrayUint32(buffer, offset + size, [0, 0]); // reserved
size += this.writeArrayUint32(buffer, offset + size, [0x00010000,0,0,0,0x00010000,0,0,0,0x40000000]); // unity matrix
size += this.writeArrayUint32(buffer, offset + size, [0,0,0,0,0,0]); // pre defined
size += this.writeArrayUint32(buffer, offset + size, 3); // next track id
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeIodsBox:function(buffer,offset)
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "iods");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint8(buffer, offset + size, 0x10);//tag id
size += this.writeArrayUint8(buffer, offset + size, 0x07);//length
size += this.writeArrayUint16(buffer, offset + size,0x004F); /* ObjectDescriptorID = 1 */
size += this.writeArrayUint8(buffer, offset + size, 0xFF);   /* ODProfileLevel */
size += this.writeArrayUint8(buffer, offset + size,0xFF);   /* sceneProfileLevel */
size += this.writeArrayUint8(buffer, offset + size,2);    /* audioProfileLevel */
size += this.writeArrayUint8(buffer, offset + size,1);    /* videoProfileLevel */
size += this.writeArrayUint8(buffer, offset + size,0xFF);   /* graphicsProfileLevel */
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeMovieExtendBox:function(buffer,offset)
{
var size = 8;
this.writeArrayString(buffer,offset+4,"mvex");
//		size += this.writeMovieExtendHeader(buffer,offset+size);
size += this.writeTrackExtend(buffer,offset+size,true);
size += this.writeTrackExtend(buffer,offset+size,false);
this.writeArrayUint32(buffer,offset,size);
return size;
},
writeMovieExtendHeader:function(buffer,offset)
{
var size = 8;
this.writeArrayString(buffer,offset+4,"mehd");
size += this.writeArrayUint32(buffer,offset+size,0);
size += this.writeArrayUint32(buffer,offset+size,0);//fregment_duration
//		console.log("-->duration:",this.video.info.duration);
this.writeArrayUint32(buffer,offset,size);
return size;
},
writeTrackExtend:function(buffer,offset,isVideo)
{
var size = 8;
this.writeArrayString(buffer,offset+4,"trex");
var info = isVideo?this.video.info:this.audio.info;
size += this.writeArrayUint32(buffer,offset+size,0);
size += this.writeArrayUint32(buffer,offset+size,isVideo ? 1 : 2);//track_ID;
size += this.writeArrayUint32(buffer,offset+size,1);//default_sample_description_index;
size += this.writeArrayUint32(buffer,offset+size,info.sampleDuration);//default_sample_duration;
//		console.log("header:",info.sampleDuration);
size += this.writeArrayUint32(buffer,offset+size,0);//default_sample_size;
size += this.writeArrayUint32(buffer,offset+size,isVideo ? 0x10000:0x0);//default_sample_flags
this.writeArrayUint32(buffer,offset,size);
return size;
},
writeTrack: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "trak");
size += this.writeTrackHeader(buffer, offset + size, isVideo);
size += this.writeEditBox(buffer, offset + size, isVideo);
size += this.writeMedia(buffer, offset + size, isVideo);
this.writeArrayUint32(buffer, offset, size);
return size;
},

writeTrackHeader: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "tkhd");
size += this.writeArrayUint32(buffer, offset + size, 0x1); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // creation time
size += this.writeArrayUint32(buffer, offset + size, 0); // modification time
size += this.writeArrayUint32(buffer, offset + size, isVideo ? 1 : 2); // track id
size += this.writeArrayUint32(buffer, offset + size, 0); // reserved
size += this.writeArrayUint32(buffer, offset + size, 0); // duration
size += this.writeArrayUint32(buffer, offset + size, [0, 0]); // reserved
size += this.writeArrayUint16(buffer, offset + size, 0); // layer
size += this.writeArrayUint16(buffer, offset + size, 0); // alternate group
size += this.writeArrayUint16(buffer, offset + size, isVideo ? 0 : 0x0100); // volume
size += this.writeArrayUint16(buffer, offset + size, 0); // reserved
size += this.writeArrayUint32(buffer, offset + size, [0x00010000,0,0,0,0x00010000,0,0,0,0x40000000]); // unity matrix
size += this.writeArrayUint32(buffer, offset + size, (this.width || 0) << 16); // width
size += this.writeArrayUint32(buffer, offset + size, (this.height || 0) << 16); // height
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeEditBox: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "edts");
size += this.writeEditListBox(buffer, offset + size, isVideo);
this.writeArrayUint32(buffer, offset, size);
return size;
},

writeEditListBox: function( buffer, offset, isVideo )
{
var size = 8;
var media = isVideo ? this.video : this.audio;
//		console.log("_dis",_dis);
this.writeArrayString(buffer, offset + 4, "elst");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
if(isVideo)
{
var _dis = 0;//Math.round((videoStartTime-audioStartTime)/90/40)*90*40;
//			console.log("dis->",_dis);
size += this.writeArrayUint32(buffer, offset + size, 1); // entry count
size += this.writeArrayUint32(buffer, offset + size, 0); // segment duration
size += this.writeArrayUint32(buffer, offset + size, 0); // media time
size += this.writeArrayUint16(buffer, offset + size, 1); // media rate integer
size += this.writeArrayUint16(buffer, offset + size, 0); // media rate fraction
}
else
{
size += this.writeArrayUint32(buffer, offset + size, 1); // entry count
size += this.writeArrayUint32(buffer, offset + size, 0); // segment duration
size += this.writeArrayUint32(buffer, offset + size, 0); // media time
size += this.writeArrayUint16(buffer, offset + size, 1); // media rate integer
size += this.writeArrayUint16(buffer, offset + size, 0); // media rate fraction
}
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeMedia: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "mdia");
size += this.writeMediaHeader(buffer, offset + size, isVideo);
size += this.writeMediaHandlerRef(buffer, offset + size, isVideo);
size += this.writeMediaInformation(buffer, offset + size, isVideo);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeMediaHeader: function( buffer, offset, isVideo )
{
var size = 8;
var info = isVideo ? this.video.info : this.audio.info;
this.writeArrayString(buffer, offset + 4, "mdhd");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // creation time
size += this.writeArrayUint32(buffer, offset + size, 0); // modification time
size += this.writeArrayUint32(buffer, offset + size, info.timeScale); // time scale
size += this.writeArrayUint32(buffer, offset + size, 0); // duration
size += this.writeArrayUint16(buffer, offset + size, 0x55C4); // language and pack und
size += this.writeArrayUint16(buffer, offset + size, 0); // pre defined
this.writeArrayUint32(buffer, offset, size);
//		console.log("header:mdhd->",info.timeScale);
return size;
},
writeMediaHandlerRef: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "hdlr");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // pre defined
size += this.writeArrayString(buffer, offset + size, isVideo ? "vide" : "soun"); // handler type
size += this.writeArrayUint32(buffer, offset + size, [0, 0, 0]); // reserved
size += this.writeArrayString(buffer, offset + size, isVideo ? "VideoHandler" : "SoundHandler"); // name
size += this.writeArrayUint8(buffer, offset + size, 0); // end of name
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeMediaInformation: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "minf");
if( isVideo )
{
size += this.writeVideoMediaHeader(buffer, offset + size);
}
else
{
size += this.writeAudioMediaHeader(buffer, offset + size);
}
size += this.writeDataInformation(buffer, offset + size, isVideo);
size += this.writeSampleTable(buffer, offset + size, isVideo);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeVideoMediaHeader: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "vmhd");
size += this.writeArrayUint32(buffer, offset + size, 0x1); // full box version and flags
size += this.writeArrayUint16(buffer, offset + size, 0); // graphics mode
size += this.writeArrayUint16(buffer, offset + size, [0,0,0]); // opcolors
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeAudioMediaHeader: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "smhd");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint16(buffer, offset + size, 0); // balance
size += this.writeArrayUint16(buffer, offset + size, 0); // reserved
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeDataInformation: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "dinf");
size += this.writeDataReference(buffer, offset + size, isVideo);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeDataReference: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "dref");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size,1); // entry count
size += this.writeDataInfoUrl(buffer, offset + size, isVideo);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeDataInfoUrl: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "url ");
size += this.writeArrayUint32(buffer, offset + size, 0x1); // full box version and flags
// empty location as same file
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeSampleTable: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "stbl");
size += this.writeSampleDescription(buffer, offset + size, isVideo);
size += this.writeSampleTimestamp(buffer, offset + size, isVideo);
size += this.writeSampleToChunk(buffer, offset + size, isVideo);
size += this.writeSampleSize(buffer, offset + size, isVideo);

size += this.writeChunkOffset(buffer, offset + size, isVideo);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeSampleDescription: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "stsd");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 1); // entry count
if( isVideo )
{
size += this.writeVisualSampleEntry(buffer, offset + size);
}
else
{
size += this.writeAudioSampleEntry(buffer, offset + size);
}
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeVisualSampleEntry: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "avc1");
size += this.writeArrayUint8(buffer, offset + size, [0,0,0,0,0,0]); // reserved
size += this.writeArrayUint16(buffer, offset + size, 1); // data reference index
size += this.writeArrayUint16(buffer, offset + size, 0); // pre defined
size += this.writeArrayUint16(buffer, offset + size, 0); // reserved
size += this.writeArrayUint32(buffer, offset + size, [0,0,0]); // pre defined
size += this.writeArrayUint16(buffer, offset + size, this.width); // width
size += this.writeArrayUint16(buffer, offset + size, this.height); // height
size += this.writeArrayUint32(buffer, offset + size, 0x00480000); // horiz resolution
size += this.writeArrayUint32(buffer, offset + size, 0x00480000); // vert resolution
size += this.writeArrayUint32(buffer, offset + size, 0); // reserved
size += this.writeArrayUint16(buffer, offset + size, 1); // frame count
for( var i = 0; i < 32; i ++ )
{
size += this.writeArrayUint8(buffer, offset + size, 0); // 32 bytes padding name
}
size += this.writeArrayUint16(buffer, offset + size, 0x0018); // depth
size += this.writeArrayUint16(buffer, offset + size, 0xffff); // pre defined
size += this.writeAVCDecoderConfiguration(buffer, offset + size);
//		size += this.writeAVCDecoderBuffersize(buffer, offset + size);
//		console.log("header:avc1->",this.width,this.height);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeAVCDecoderConfiguration: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "avcC");
//		console.log("avcc:",this.video.avcc);
if( this.video.avcc )
{
size += this.writeArrayBuffer(buffer, offset + size, this.video.avcc);
//			size += this.writeArrayUint32(buffer, offset + size,0xfcf8f800);
}
else
{
//			var sequences = [0x67,0x42,0xC0,0x15,0xD9,0x41,0xE0,0x8E,0x9A,0x80,0x80,0x80,0xA0,0x00,0x00,0x03,0x00,0x20,0x00,0x00,0x03,0x03,0xD1,0xE2,0xC5,0xCB];
var sequences = [0x67,0x42,0xC0,0x0D,0xD9,0x81,0x41,0xFB,0x0E,0x10,0x00,0x00,0x3E,0x90,0x00,0x0E,0xA6,0x08,0xF1,0x42,0xA6,0x80];
size += this.writeArrayUint8(buffer, offset + size, 1); // configuration version
size += this.writeArrayUint8(buffer, offset + size, 0x42); // profile indication => baseline
size += this.writeArrayUint8(buffer, offset + size, 0xC0); // profile compatibility
size += this.writeArrayUint8(buffer, offset + size, 0x0D); // level indication
size += this.writeArrayUint8(buffer, offset + size, 0xFF); // length size minus one
size += this.writeArrayUint8(buffer, offset + size, 0xE1); // num of sequence parameter sets
size += this.writeArrayUint16(buffer, offset + size, sequences.length); // sequence size
size += this.writeArrayUint8(buffer, offset + size, sequences); // sequence
size += this.writeArrayUint8(buffer, offset + size, 1); // num of picture parameter sets
size += this.writeArrayUint16(buffer, offset + size, 5); // picture size
size += this.writeArrayUint8(buffer, offset + size, [0x68,0xC9,0x23,0xC8]); // picture
}
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeAVCDecoderBuffersize:function(buffer,offset)
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "btrt");
size += this.writeArrayUint32(buffer, offset + size, 0x4E82); // buffersize
size += this.writeArrayUint32(buffer, offset + size, 0x030660); // maxbitrate
size += this.writeArrayUint32(buffer, offset + size, 0x0185d0); // avgbitrate
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeAudioSampleEntry: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "mp4a");
size += this.writeArrayUint8(buffer, offset + size, [0,0,0,0,0,0]); // reserved
size += this.writeArrayUint16(buffer, offset + size, 1); // data reference index
size += this.writeArrayUint32(buffer, offset + size, [0,0]); // reserved
size += this.writeArrayUint16(buffer, offset + size,  this.audio.info.channelCount || 2); // channel count
size += this.writeArrayUint16(buffer, offset + size, this.audio.info.sampleSize || 16); // sample size
size += this.writeArrayUint16(buffer, offset + size, 0); // pre defined
size += this.writeArrayUint16(buffer, offset + size, 0); // reserved
size += this.writeArrayUint32(buffer, offset + size, this.audio.info.timeScale << 16); // sample rate
size += this.writeAudioDecoderConfiguration(buffer, offset + size);
//		console.log("header:mp4a->",this.audio.info.channelCount,this.audio.info.sampleSize,this.audio.info.timeScale);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeAudioDecoderConfiguration: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "esds"); // Element Stream Descriptors
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeAudioEsDescriptionTag(buffer, offset + size); // unknown
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeAudioEsDescriptionTag: function( buffer, offset )
{
var size = 0;
size += this.writeArrayUint8(buffer, offset + size, 0x03); // tag
size += this.writeArrayUint8(buffer, offset + size, 0); // datasize
size += this.writeArrayUint16(buffer, offset + size, 0); // ESID 10
size += this.writeArrayUint8(buffer, offset + size, 0); // Stream Dependence Flag:1, URL Flag:1, OCR Stream Flag: 1, Stream Priority: 5
size += this.writeAudioDecodeConfigDescriptionTag(buffer, offset + size);
size += this.writeAudioSlConfigDescriptionTag(buffer, offset + size);
this.writeArrayUint8(buffer, offset + 1, size - 2);
return size;
},

writeAudioDecodeConfigDescriptionTag: function( buffer, offset )
{
var size = 0;
size += this.writeArrayUint8(buffer, offset + size, 0x04); // tag
size += this.writeArrayUint8(buffer, offset + size, 0); // size
size += this.writeArrayUint8(buffer, offset + size, 0x40); // Object Type Id
size += this.writeArrayUint8(buffer, offset + size, 0x14); // Stream Type = 0x05 << 2
size += this.writeArrayUint8(buffer, offset + size, [0,0,0]); // Buffer Size DB
size += this.writeArrayUint32(buffer, offset + size, 0); // Max Bitrate
size += this.writeArrayUint32(buffer, offset + size, 0); // Avg Bitrate
size += this.writeAudioDecodeSpecificDescriptionTag(buffer, offset + size);
//		console.log("header:mp4a->",this.audio.info.MaxBitrate,this.audio.info.AvgBitrate);
this.writeArrayUint8(buffer, offset + 1, size - 2);
return size;
},

writeAudioDecodeSpecificDescriptionTag: function( buffer, offset )
{
var size = 0;
size += this.writeArrayUint8(buffer, offset + size, 0x05); // tag
size += this.writeArrayUint8(buffer, offset + size, 0); // size
//size += this.writeArrayUint8(buffer, offset + size, [0x13,0x88,0x56,0xE5,0xA5,0x48,0x80]);
if( this.audio.aac ) size += this.writeArrayBuffer(buffer, offset + size, this.audio.aac); // info
else size += this.writeArrayUint16(buffer, offset + size, 0x0102); // info
this.writeArrayUint8(buffer, offset + 1, size - 2);
return size;
},

writeAudioSlConfigDescriptionTag: function( buffer, offset )
{
//		console.log("video:06");
var size = 0;
size += this.writeArrayUint8(buffer, offset + size, 0x06); // tag
size += this.writeArrayUint8(buffer, offset + size, 0); // size
size += this.writeArrayUint8(buffer, offset + size, 0x02); // predefined
//size += this.writeArrayUint8(buffer, offset + size, 0); // flags
this.writeArrayUint8(buffer, offset + 1, size - 2);
return size;
},
writeSampleTimestamp: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "stts");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // entry count
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeSampleToChunk: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "stsc");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // entry count
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeSampleSize: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "stsz");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // sample size
size += this.writeArrayUint32(buffer, offset + size, 0); //
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeChunkOffset: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "stco");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // entry count
this.writeArrayUint32(buffer, offset, size);
return size;
},
});
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
p2p$.ns("com.webp2p.segmentmp4");
p2p$.com.webp2p.segmentmp4.SegmentMp4 = p2p$.com.webp2p.segmentmp4.BaseMp4.extend_({
movieBoxSize:0,
dataSize: 0,
videoDataOffset: 0,
videoDataSize: 0,
audioDataOffset: 0,
autioDataSize: 0,
videoMoofoffset:[],
audioMoofoffset:[],
reference_size:[],
segmentIndex:0,

init:function(params)
{
p2p$.apply(this,params);
},
toBuffer:function()
{
this.movieBoxSize = (this.video.items.length + this.audio.items.length) * 8 + 12000;
this.dataSize = 0;
var i,item;
for(i = 0; i < this.video.items.length; i ++ )
{
item = this.video.items[i];
this.dataSize += item.data.length;
}
this.videoDataSize = this.dataSize;
for(i = 0; i < this.audio.items.length; i ++ )
{
item = this.audio.items[i];
this.dataSize += item.data.length;
}
this.autioDataSize = this.dataSize - this.videoDataSize;
var bufferData = new Uint8Array(this.movieBoxSize + this.dataSize);
var offset = 0;
offset += this.writeSegmentType(bufferData, offset);
offset += this.writeSegementIndex(bufferData, offset);
//offset += this.writeMovie(bufferData, offset);
moofstart = offset;//segement开始位置
offset += this.writeMoiveFragment(bufferData, offset);
this.videoDataOffset = offset+8;
this.audioDataOffset = this.videoDataOffset + this.videoDataSize;
for(i=0;i<this.videoMoofoffset.length;i++)
{
//			console.log("video->offset:",this.videoMoofoffset[i],this.videoDataOffset-moofstart);
this.writeArrayUint32(bufferData, this.videoMoofoffset[i],this.videoDataOffset-moofstart);
}
for(i=0;i<this.audioMoofoffset.length;i++)
{
//			console.log("video->offset:",this.audioMoofoffset[i],this.audioDataOffset-moofstart);
this.writeArrayUint32(bufferData, this.audioMoofoffset[i],this.audioDataOffset-moofstart);
}
offset += this.writeMediaData(bufferData, offset);
for(i=0;i<this.reference_size.length;i++)
{
//			console.log("video->offset:",this.reference_size[i],offset-moofstart);
this.writeArrayUint32(bufferData, this.reference_size[i],offset-moofstart);
}
return  bufferData.subarray(0,offset);
},
writeSegmentType: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "styp");
size += this.writeArrayString(buffer, offset + size, "isom"); // major brand
size += this.writeArrayUint32(buffer, offset + size, 0x1); // minor version
size += this.writeArrayString(buffer, offset + size, "msdhmsiximsg"); // compatible brands
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeMovie: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "moov");
size += this.writeMovieHeader(buffer, offset + size);
//		size += this.writeIodsBox(buffer,offset+size);
size += this.writeMovieExtendBox(buffer,offset+size);
size += this.writeTrack(buffer, offset + size, true);
size += this.writeTrack(buffer, offset + size, false);
this.writeArrayUint32(buffer, offset, size);
return size;
},

writeMovieHeader: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "mvhd");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // creation time
size += this.writeArrayUint32(buffer, offset + size, 0); // modification time
size += this.writeArrayUint32(buffer, offset + size, this.video.info.timeScale); // time scale
//		console.log("time:",this.video.info.timeScale);
size += this.writeArrayUint32(buffer, offset + size, 0); // duration
size += this.writeArrayUint32(buffer, offset + size, 0x00010000); // rate
size += this.writeArrayUint16(buffer, offset + size, 0x0100); // volume
size += this.writeArrayUint16(buffer, offset + size, 0); // reserved
size += this.writeArrayUint32(buffer, offset + size, [0, 0]); // reserved
size += this.writeArrayUint32(buffer, offset + size, [0x00010000,0,0,0,0x00010000,0,0,0,0x40000000]); // unity matrix
size += this.writeArrayUint32(buffer, offset + size, [0,0,0,0,0,0]); // pre defined
size += this.writeArrayUint32(buffer, offset + size, 3); // next track id
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeIodsBox:function(buffer,offset)
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "iods");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint8(buffer, offset + size, 0x10);//tag id
size += this.writeArrayUint8(buffer, offset + size, 0x07);//length
size += this.writeArrayUint16(buffer, offset + size,0x004F); /* ObjectDescriptorID = 1 */
size += this.writeArrayUint8(buffer, offset + size, 0xFF);   /* ODProfileLevel */
size += this.writeArrayUint8(buffer, offset + size,0xFF);   /* sceneProfileLevel */
size += this.writeArrayUint8(buffer, offset + size,2);    /* audioProfileLevel */
size += this.writeArrayUint8(buffer, offset + size,1);    /* videoProfileLevel */
size += this.writeArrayUint8(buffer, offset + size,0xFF);   /* graphicsProfileLevel */
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeMovieExtendBox:function(buffer,offset)
{
var size = 8;
this.writeArrayString(buffer,offset+4,"mvex");
//		size += this.writeMovieExtendHeader(buffer,offset+size);
size += this.writeTrackExtend(buffer,offset+size,true);
size += this.writeTrackExtend(buffer,offset+size,false);
this.writeArrayUint32(buffer,offset,size);
return size;
},
writeMovieExtendHeader:function(buffer,offset)
{
var size = 8;
this.writeArrayString(buffer,offset+4,"mehd");
size += this.writeArrayUint32(buffer,offset+size,0);
size += this.writeArrayUint32(buffer,offset+size,0);//fregment_duration
//		console.log("-->duration:",this.video.info.duration);
this.writeArrayUint32(buffer,offset,size);
return size;
},
writeTrackExtend:function(buffer,offset,isVideo)
{
var size = 8;
this.writeArrayString(buffer,offset+4,"trex");
var info = isVideo?this.video.info:this.audio.info;
size += this.writeArrayUint32(buffer,offset+size,0);
size += this.writeArrayUint32(buffer,offset+size,isVideo ? 1 : 2);//track_ID;
size += this.writeArrayUint32(buffer,offset+size,1);//default_sample_description_index;
size += this.writeArrayUint32(buffer,offset+size,info.sampleDuration);//default_sample_duration;
//		console.log("header:",info.sampleDuration);
size += this.writeArrayUint32(buffer,offset+size,0);//default_sample_size;
size += this.writeArrayUint32(buffer,offset+size,isVideo ? 0x10000:0x0);//default_sample_flags
this.writeArrayUint32(buffer,offset,size);
return size;
},
writeTrack: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "trak");
size += this.writeTrackHeader(buffer, offset + size, isVideo);
size += this.writeEditBox(buffer, offset + size, isVideo);
size += this.writeMedia(buffer, offset + size, isVideo);
this.writeArrayUint32(buffer, offset, size);
return size;
},

writeTrackHeader: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "tkhd");
size += this.writeArrayUint32(buffer, offset + size, 0x1); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // creation time
size += this.writeArrayUint32(buffer, offset + size, 0); // modification time
size += this.writeArrayUint32(buffer, offset + size, isVideo ? 1 : 2); // track id
size += this.writeArrayUint32(buffer, offset + size, 0); // reserved
size += this.writeArrayUint32(buffer, offset + size, 0); // duration
size += this.writeArrayUint32(buffer, offset + size, [0, 0]); // reserved
size += this.writeArrayUint16(buffer, offset + size, 0); // layer
size += this.writeArrayUint16(buffer, offset + size, 0); // alternate group
size += this.writeArrayUint16(buffer, offset + size, isVideo ? 0 : 0x0100); // volume
size += this.writeArrayUint16(buffer, offset + size, 0); // reserved
size += this.writeArrayUint32(buffer, offset + size, [0x00010000,0,0,0,0x00010000,0,0,0,0x40000000]); // unity matrix
size += this.writeArrayUint32(buffer, offset + size, (this.width || 0) << 16); // width
size += this.writeArrayUint32(buffer, offset + size, (this.height || 0) << 16); // height
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeEditBox: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "edts");
size += this.writeEditListBox(buffer, offset + size, isVideo);
this.writeArrayUint32(buffer, offset, size);
return size;
},

writeEditListBox: function( buffer, offset, isVideo )
{
var size = 8;
var media = isVideo ? this.video : this.audio;
this.writeArrayString(buffer, offset + 4, "elst");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
if(isVideo)
{
var _dis = 0;//Math.round((videoStartTime-audioStartTime)/90/40)*90*40;
//			console.log("dis->",_dis);
size += this.writeArrayUint32(buffer, offset + size, 1); // entry count
size += this.writeArrayUint32(buffer, offset + size, 0); // segment duration
size += this.writeArrayUint32(buffer, offset + size, 0); // media time
size += this.writeArrayUint16(buffer, offset + size, 1); // media rate integer
size += this.writeArrayUint16(buffer, offset + size, 0); // media rate fraction
}
else
{
size += this.writeArrayUint32(buffer, offset + size, 1); // entry count
size += this.writeArrayUint32(buffer, offset + size, 0); // segment duration
size += this.writeArrayUint32(buffer, offset + size, 0); // media time
size += this.writeArrayUint16(buffer, offset + size, 1); // media rate integer
size += this.writeArrayUint16(buffer, offset + size, 0); // media rate fraction
}
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeMedia: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "mdia");
size += this.writeMediaHeader(buffer, offset + size, isVideo);
size += this.writeMediaHandlerRef(buffer, offset + size, isVideo);
size += this.writeMediaInformation(buffer, offset + size, isVideo);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeMediaHeader: function( buffer, offset, isVideo )
{
var size = 8;
var info = isVideo ? this.video.info : this.audio.info;
this.writeArrayString(buffer, offset + 4, "mdhd");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // creation time
size += this.writeArrayUint32(buffer, offset + size, 0); // modification time
size += this.writeArrayUint32(buffer, offset + size, info.timeScale); // time scale
size += this.writeArrayUint32(buffer, offset + size, 0); // duration
size += this.writeArrayUint16(buffer, offset + size, 0x55C4); // language and pack und
size += this.writeArrayUint16(buffer, offset + size, 0); // pre defined
this.writeArrayUint32(buffer, offset, size);
//		console.log("header:mdhd->",info.timeScale);
return size;
},
writeMediaHandlerRef: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "hdlr");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // pre defined
size += this.writeArrayString(buffer, offset + size, isVideo ? "vide" : "soun"); // handler type
size += this.writeArrayUint32(buffer, offset + size, [0, 0, 0]); // reserved
size += this.writeArrayString(buffer, offset + size, isVideo ? "VideoHandler" : "SoundHandler"); // name
size += this.writeArrayUint8(buffer, offset + size, 0); // end of name
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeMediaInformation: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "minf");
if( isVideo )
{
size += this.writeVideoMediaHeader(buffer, offset + size);
}
else
{
size += this.writeAudioMediaHeader(buffer, offset + size);
}
size += this.writeDataInformation(buffer, offset + size, isVideo);
size += this.writeSampleTable(buffer, offset + size, isVideo);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeVideoMediaHeader: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "vmhd");
size += this.writeArrayUint32(buffer, offset + size, 0x1); // full box version and flags
size += this.writeArrayUint16(buffer, offset + size, 0); // graphics mode
size += this.writeArrayUint16(buffer, offset + size, [0,0,0]); // opcolors
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeAudioMediaHeader: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "smhd");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint16(buffer, offset + size, 0); // balance
size += this.writeArrayUint16(buffer, offset + size, 0); // reserved
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeDataInformation: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "dinf");
size += this.writeDataReference(buffer, offset + size, isVideo);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeDataReference: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "dref");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size,1); // entry count
size += this.writeDataInfoUrl(buffer, offset + size, isVideo);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeDataInfoUrl: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "url ");
size += this.writeArrayUint32(buffer, offset + size, 0x1); // full box version and flags
// empty location as same file
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeSampleTable: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "stbl");
size += this.writeSampleDescription(buffer, offset + size, isVideo);
size += this.writeSampleTimestamp(buffer, offset + size, isVideo);
size += this.writeSampleToChunk(buffer, offset + size, isVideo);
size += this.writeSampleSize(buffer, offset + size, isVideo);

size += this.writeChunkOffset(buffer, offset + size, isVideo);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeSampleDescription: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "stsd");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 1); // entry count
if( isVideo )
{
size += this.writeVisualSampleEntry(buffer, offset + size);
}
else
{
size += this.writeAudioSampleEntry(buffer, offset + size);
}
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeVisualSampleEntry: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "avc1");
size += this.writeArrayUint8(buffer, offset + size, [0,0,0,0,0,0]); // reserved
size += this.writeArrayUint16(buffer, offset + size, 1); // data reference index
size += this.writeArrayUint16(buffer, offset + size, 0); // pre defined
size += this.writeArrayUint16(buffer, offset + size, 0); // reserved
size += this.writeArrayUint32(buffer, offset + size, [0,0,0]); // pre defined
size += this.writeArrayUint16(buffer, offset + size, this.width); // width
size += this.writeArrayUint16(buffer, offset + size, this.height); // height
size += this.writeArrayUint32(buffer, offset + size, 0x00480000); // horiz resolution
size += this.writeArrayUint32(buffer, offset + size, 0x00480000); // vert resolution
size += this.writeArrayUint32(buffer, offset + size, 0); // reserved
size += this.writeArrayUint16(buffer, offset + size, 1); // frame count
for( var i = 0; i < 32; i ++ )
{
size += this.writeArrayUint8(buffer, offset + size, 0); // 32 bytes padding name
}
size += this.writeArrayUint16(buffer, offset + size, 0x0018); // depth
size += this.writeArrayUint16(buffer, offset + size, 0xffff); // pre defined
size += this.writeAVCDecoderConfiguration(buffer, offset + size);
//		size += this.writeAVCDecoderBuffersize(buffer, offset + size);
//		console.log("header:avc1->",this.width,this.height);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeAVCDecoderConfiguration: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "avcC");
//		console.log("avcc:",this.video.avcc);
if( this.video.avcc )
{
size += this.writeArrayBuffer(buffer, offset + size, this.video.avcc);
//			size += this.writeArrayUint32(buffer, offset + size,0xfcf8f800);
}
else
{
//			var sequences = [0x67,0x42,0xC0,0x15,0xD9,0x41,0xE0,0x8E,0x9A,0x80,0x80,0x80,0xA0,0x00,0x00,0x03,0x00,0x20,0x00,0x00,0x03,0x03,0xD1,0xE2,0xC5,0xCB];
var sequences = [0x67,0x42,0xC0,0x0D,0xD9,0x81,0x41,0xFB,0x0E,0x10,0x00,0x00,0x3E,0x90,0x00,0x0E,0xA6,0x08,0xF1,0x42,0xA6,0x80];
size += this.writeArrayUint8(buffer, offset + size, 1); // configuration version
size += this.writeArrayUint8(buffer, offset + size, 0x42); // profile indication => baseline
size += this.writeArrayUint8(buffer, offset + size, 0xC0); // profile compatibility
size += this.writeArrayUint8(buffer, offset + size, 0x0D); // level indication
size += this.writeArrayUint8(buffer, offset + size, 0xFF); // length size minus one
size += this.writeArrayUint8(buffer, offset + size, 0xE1); // num of sequence parameter sets
size += this.writeArrayUint16(buffer, offset + size, sequences.length); // sequence size
size += this.writeArrayUint8(buffer, offset + size, sequences); // sequence
size += this.writeArrayUint8(buffer, offset + size, 1); // num of picture parameter sets
size += this.writeArrayUint16(buffer, offset + size, 5); // picture size
size += this.writeArrayUint8(buffer, offset + size, [0x68,0xC9,0x23,0xC8]); // picture
}
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeAVCDecoderBuffersize:function(buffer,offset)
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "btrt");
size += this.writeArrayUint32(buffer, offset + size, 0x4E82); // buffersize
size += this.writeArrayUint32(buffer, offset + size, 0x030660); // maxbitrate
size += this.writeArrayUint32(buffer, offset + size, 0x0185d0); // avgbitrate
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeAudioSampleEntry: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "mp4a");
size += this.writeArrayUint8(buffer, offset + size, [0,0,0,0,0,0]); // reserved
size += this.writeArrayUint16(buffer, offset + size, 1); // data reference index
size += this.writeArrayUint32(buffer, offset + size, [0,0]); // reserved
size += this.writeArrayUint16(buffer, offset + size,  this.audio.info.channelCount || 2); // channel count
size += this.writeArrayUint16(buffer, offset + size, this.audio.info.sampleSize || 16); // sample size
size += this.writeArrayUint16(buffer, offset + size, 0); // pre defined
size += this.writeArrayUint16(buffer, offset + size, 0); // reserved
size += this.writeArrayUint32(buffer, offset + size, this.audio.info.timeScale << 16); // sample rate
size += this.writeAudioDecoderConfiguration(buffer, offset + size);
//		console.log("header:mp4a->",this.audio.info.channelCount,this.audio.info.sampleSize,this.audio.info.timeScale);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeAudioDecoderConfiguration: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "esds"); // Element Stream Descriptors
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeAudioEsDescriptionTag(buffer, offset + size); // unknown
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeAudioEsDescriptionTag: function( buffer, offset )
{
var size = 0;
size += this.writeArrayUint8(buffer, offset + size, 0x03); // tag
size += this.writeArrayUint8(buffer, offset + size, 0); // datasize
size += this.writeArrayUint16(buffer, offset + size, 0); // ESID 10
size += this.writeArrayUint8(buffer, offset + size, 0); // Stream Dependence Flag:1, URL Flag:1, OCR Stream Flag: 1, Stream Priority: 5
size += this.writeAudioDecodeConfigDescriptionTag(buffer, offset + size);
size += this.writeAudioSlConfigDescriptionTag(buffer, offset + size);
this.writeArrayUint8(buffer, offset + 1, size - 2);
return size;
},

writeAudioDecodeConfigDescriptionTag: function( buffer, offset )
{
var size = 0;
size += this.writeArrayUint8(buffer, offset + size, 0x04); // tag
size += this.writeArrayUint8(buffer, offset + size, 0); // size
size += this.writeArrayUint8(buffer, offset + size, 0x40); // Object Type Id
size += this.writeArrayUint8(buffer, offset + size, 0x14); // Stream Type = 0x05 << 2
size += this.writeArrayUint8(buffer, offset + size, [0,0,0]); // Buffer Size DB
size += this.writeArrayUint32(buffer, offset + size, 0); // Max Bitrate
size += this.writeArrayUint32(buffer, offset + size, 0); // Avg Bitrate
size += this.writeAudioDecodeSpecificDescriptionTag(buffer, offset + size);
//		console.log("header:mp4a->",this.audio.info.MaxBitrate,this.audio.info.AvgBitrate);
this.writeArrayUint8(buffer, offset + 1, size - 2);
return size;
},

writeAudioDecodeSpecificDescriptionTag: function( buffer, offset )
{
var size = 0;
size += this.writeArrayUint8(buffer, offset + size, 0x05); // tag
size += this.writeArrayUint8(buffer, offset + size, 0); // size
//size += this.writeArrayUint8(buffer, offset + size, [0x13,0x88,0x56,0xE5,0xA5,0x48,0x80]);
if( this.audio.aac ) size += this.writeArrayBuffer(buffer, offset + size, this.audio.aac); // info
else size += this.writeArrayUint16(buffer, offset + size, 0x0102); // info
this.writeArrayUint8(buffer, offset + 1, size - 2);
return size;
},

writeAudioSlConfigDescriptionTag: function( buffer, offset )
{
//		console.log("video:06");
var size = 0;
size += this.writeArrayUint8(buffer, offset + size, 0x06); // tag
size += this.writeArrayUint8(buffer, offset + size, 0); // size
size += this.writeArrayUint8(buffer, offset + size, 0x02); // predefined
//size += this.writeArrayUint8(buffer, offset + size, 0); // flags
this.writeArrayUint8(buffer, offset + 1, size - 2);
return size;
},
writeSampleTimestamp: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "stts");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // entry count
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeSampleToChunk: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "stsc");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // entry count
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeSampleSize: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "stsz");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // sample size
size += this.writeArrayUint32(buffer, offset + size, 0); //
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeChunkOffset: function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "stco");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, 0); // entry count
this.writeArrayUint32(buffer, offset, size);
return size;
},

writeSegementIndex: function( buffer, offset )
{
var size = 8;
var reference_count = 1;
var timescale=this.video.info.timeScale;
var startTime=this.video.info.firstTimestamp;
var dur=this.video.info.duration;
this.writeArrayString(buffer, offset + 4, "sidx");
size += this.writeArrayUint32(buffer, offset + size,0); //  version
size += this.writeArrayUint32(buffer, offset + size,1); //  referenceid
size += this.writeArrayUint32(buffer, offset + size,timescale); //timescale
size += this.writeArrayUint32(buffer, offset + size,startTime);//earlist_presenttation_time
size += this.writeArrayUint32(buffer, offset + size,0);//firstoffset
size += this.writeArrayUint32(buffer, offset + size,reference_count);//reference_count
this.reference_size=[];
for(var i=0;i<reference_count;i++)
{
this.reference_size.push(offset+size);
size += this.writeArrayUint32(buffer, offset + size,0);//referenced_size
size += this.writeArrayUint32(buffer, offset + size,dur); // duration
size += this.writeArrayUint32(buffer, offset + size,0x80000000); // duration
}
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeMoiveFragment: function( buffer, offset )
{
this.moofpos=offset;
var size = 8;
this.writeArrayString(buffer, offset + 4, "moof");
size += this.writeMoiveFragmentHeader(buffer, offset + size);
size += this.writeTraf(buffer, offset + size, true);
size += this.writeTraf(buffer, offset + size, false);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeMoiveFragmentHeader: function( buffer, offset )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "mfhd");
size += this.writeArrayUint32(buffer, offset + size, 0); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, this.segmentIndex); // sequence number
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeTraf:function( buffer, offset, isVideo )
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "traf");
size += this.writeTrafHeader(buffer, offset + size, isVideo);
size += this.writeTrafdt(buffer, offset + size,isVideo);
size += this.writeTrunHeader(buffer, offset + size, isVideo);
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeTrafHeader:function(buffer, offset, isVideo)
{
var size = 8;
this.writeArrayString(buffer, offset + 4, "tfhd");
/**
* 0x000001 base-data-offset-present
* 0x000002 sample-description-index-present
* 0x000008 default-sample-duration-present
* 0x000010 default-sample-size-present
* 0x000020 default-sample-flags-present
* 0x010000 duration-is-empty
* 0x020000 default-base-is-moof
* */
size += this.writeArrayUint32(buffer, offset + size, 0x020000); // full box version and flags
size += this.writeArrayUint32(buffer, offset + size, isVideo ? 1 : 2); // track id
this.writeArrayUint32(buffer, offset, size);
return size;
},
writeTrafdt:function(buffer, offset, isVideo)
{
var size = 8;
var info=isVideo?this.video.info:this.audio.info;
var startTime = info.firstTimestamp;
//		if(!isVideo)
//		{
//			if(this.segmentIndex==0)
//			{
//				if(info.firstTimestamp/info.timeScale>1)//首个音频往后推迟0.08秒
//				{
//					startTime = (this.video.info.firstTimestamp/this.video.info.timeScale+0.8)*info.timeScale;
//					console.log(this.segmentIndex,startTime);
//				}
//			}
//		}
//		startTime=this.video.info.firstTimestamp*info.timeScale/this.video.info.timeScale;
this.writeArrayString(buffer, offset + 4, "tfdt");
size += this.writeArrayUint32(buffer, offset + size, 0);
size += this.writeArrayUint32(buffer, offset + size,startTime);//sum duration
this.writeArrayUint32(buffer, offset, size);
// P2P_ULOG_INFO(P2P_ULOG_FMT("segmentmp4::segmentmp4::tfdt video({0}),startTime({1}),dur({2}),end({3}),lastTime({4})",isVideo,startTime/info.timeScale,info.duration*1000/info.timeScale,(info.firstTimestamp+info.duration)/info.timeScale,info.lastTimestamp/info.timeScale));
return size;
},
writeTrunHeader:function(buffer, offset, isVideo)
{
var size = 8;
var media = isVideo ? this.video : this.audio;
var i;
var item;
this.writeArrayString(buffer, offset + 4, "trun");
/*flags说明：
* 0x000001:data-offset-present
* 0x000004:first-sample-flags-present; this over-rides the default flags for the first sample only. This
makes it possible to record a group of frames where the first is a key and the rest are difference frames, without supplying explicit flags for every sample. If this flag and field are used, sample-flags shall not be present.
* 0x000100 sample-duration-present: 标示每一个sample有他自己的时长, 否则使用默认值.
* 0x000200 sample-size-present：每个sample拥有大小，否则使用默认值
* 0x000400 sample-flags-present：每个sample有他自己的标志，否则使用默认值
* 0x000800 sample-composition-time-offsets-present; 每个sample 有一个composition time offset
* */
if(isVideo)
{
size += this.writeArrayUint32(buffer, offset + size, 0xa05);//flags
size += this.writeArrayUint32(buffer, offset + size, media.items.length); // sample count
this.videoMoofoffset=[];
this.videoMoofoffset.push(offset+size);//position
size += this.writeArrayUint32(buffer, offset + size,0); //dat-offset
size += this.writeArrayUint32(buffer, offset + size, 0); // first-sample-flag
for(i = 0; i < media.items.length; i ++ )
{
item = media.items[i];
size += this.writeArrayUint32(buffer, offset + size, item.data.length); // sample_size
size += this.writeArrayUint32(buffer, offset + size, item.avcCompositionTimeOffset);
}
}
else
{
size += this.writeArrayUint32(buffer, offset + size, 0x201);//flags
size += this.writeArrayUint32(buffer, offset + size, media.items.length); // sample count
this.audioMoofoffset=[];
this.audioMoofoffset.push(offset+size);//position
size += this.writeArrayUint32(buffer, offset + size,0); //dat-offset
//			size += this.writeArrayUint32(buffer, offset + size, 0); // first-sample-flag
for(i = 0; i < media.items.length; i ++ )
{
item = media.items[i];
size += this.writeArrayUint32(buffer, offset + size, item.data.length); // sample_size
}
}
this.writeArrayUint32(buffer, offset, size);
//		console.log("--->trun:","|count:",media.items.length,"|dur:",this.audio.info.duration,"-",dur);
return size;
},
writeMediaData: function( buffer, offset )
{
var size = 0;
size += this.writeArrayUint32(buffer, offset, this.dataSize + 8);
size += this.writeArrayString(buffer, offset+size, "mdat");
var i,item;
for(i = 0; i < this.video.items.length; i ++ )
{
item = this.video.items[i];
item.dataOffset = offset;

size += this.writeArrayBuffer(buffer, offset+size, item.data);
}
for(i = 0; i < this.audio.items.length; i ++ )
{
item = this.audio.items[i];
item.dataOffset = offset;
size += this.writeArrayBuffer(buffer, offset+size, item.data);
}
return size;
}
});
p2p$.ns('com.webp2p.segmentmp4');

p2p$.com.webp2p.segmentmp4.ToMp4 = JClass.extend_(
{
syncFound: false,
pmtPID: 0,
audioPID: 0,
videoPID: 0,
audioPes_: null,
videoPes_: null,
startTime:null,
specialTypePrefix_ : [ "sm-" ],
header:null,//转封装的header头同视频只封装一次
tag_:"com::webp2p::segmentmp4.File",

init : function() {
this.audioPes_ = new p2p$.com.webp2p.segmentmp4.Audio();
this.videoPes_ = new p2p$.com.webp2p.segmentmp4.Video();
},
//分析188字节第一个为0x47
/**
* @params
* @input 解码数据
* @params 参数
* @fragmentSquenceNumber ts编号
* @encode 是否需要解码
*/
processFileSegment_: function(input, params)
{
var _usedBytes = 0;
var _startTime;
this.startTime = null;
this.audioPes_.reset();
this.videoPes_.reset();
var encode = params["encode"]!=null ? params["encode"] : true;
var width = params["width"] ? params["width"] : 1600;
var height = params["height"] ? params["height"] : 900;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::encode={1}",this.tag_,encode));
while(_usedBytes < input.length )
{
if(!this.syncFound)
{
if(_usedBytes + 1 > input.length ) return null;
if(input[_usedBytes ++] == 0x47) this.syncFound = true;
}
else
{
if(_usedBytes + 187 > input.length ) return null;
this.syncFound = false;
var packet = new p2p$.com.webp2p.segmentmp4.ByteArray(input.subarray(_usedBytes, _usedBytes + 187));
_startTime = this.processPacket(packet,encode);
if(_startTime !== null&&this.startTime === null)
{
this.startTime = _startTime;
}
if(!encode&&this.startTime!==null)//如果不需要解码，只需计算出ts的开始时间即可
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::startTime({1})",this.tag_,this.startTime));
break;
}
_usedBytes += 187;
}
}
if(!encode) return input;//无需解码
this.flushFileSegment();

var handlerOptions = {video:{info: this.videoPes_._videoInfo,avcc: this.videoPes_._avccData,items: this.videoPes_._tags},audio:{info: this.audioPes_._audioInfo,aac: this.audioPes_._aacData,items: this.audioPes_._tags},width:width,height:height,segmentIndex:0};

p2p$.apply(handlerOptions, params || {});
var mp4Handler = new p2p$.com.webp2p.segmentmp4.SegmentMp4(handlerOptions);
var segmentHeader;
var data = mp4Handler.toBuffer(handlerOptions);
if(this.header==null)
{
segmentHeader = new p2p$.com.webp2p.segmentmp4.FregmentMp4Header(handlerOptions);
this.header=segmentHeader.toBuffer();
}
if(handlerOptions.segmentIndex==0)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::init Data",this.tag_));
var tempByteArray = new Uint8Array(this.header.length + data.length);
tempByteArray.set(this.header, 0);
tempByteArray.set(data, this.header.length);
data=tempByteArray;
}
return data;
},
getMediaStreamAvccName_ : function() {
var avcc = this.videoPes_.avccData_;
if (!avcc) {
return "avc1.64001f";
}
var name = 'avc1.';
for ( var i = 0; i < 3; i++) {
var byteValue = avcc.getByte_(i + 1).toString(16);
if (byteValue.length < 2) {
byteValue = ('0' + byteValue);
}
name += byteValue;
}
return name;
},

getMediaStreamAacName_ : function() {
var index = this.audioPes_.sampleRateIndex_;
var channelConfig = this.audioPes_.channelConfig_;
var profile = 5;
switch (index) {
case 4:
profile = 2;
break;
case 7:
profile = 5;
break;
default:
profile = 5;
break;
}
if (channelConfig == 1) {
var env = p2p$.com.selector.Enviroment;
if (env.getOSType_() == "Android") {
for ( var i = 0; i < this.specialTypePrefix_.length; i++) {
var prefix = this.specialTypePrefix_[i];
if (env.getDeviceType_().substring(0,prefix.length)==prefix) {
profile = 2;
}
}
}
}
return 'mp4a.40.' + profile;
},

getMediaStreamAacName2_ : function() {
var aac = this.audioPes_.aacData_;
var name = 'mp4a.40.2';
if (!aac) {
return name;
}
name = 'mp4a.40.' + ((aac[0] >> 3) & 0x1f).toString(16);
return name;
},

getMediaInfoDescriptions_ : function() {
return 'audio<sri:' + this.audioPes_.sampleRateIndex_ + ', profile:' + this.audioPes_.profile_ + ', channel:' + this.audioPes_.channelConfig_ + '>';
},

base64Uint8Array: function( bytes )
{
var base64    = '';
var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var byteLength    = bytes.byteLength;
var byteRemainder = byteLength % 3;
var mainLength    = byteLength - byteRemainder;
var a, b, c, d;
var chunk;

// Main loop deals with bytes in chunks of 3
for (var i = 0; i < mainLength; i = i + 3)
{
// Combine the three bytes into a single integer
chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

// Use bit masks to extract 6-bit segments from the triplet
a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
b = (chunk & 258048)   >> 12; // 258048 = (2^6 - 1) << 12
c = (chunk & 4032)     >>  6; // 4032 = (2^6 - 1) << 6
d = chunk & 63;               // 63 = 2^6 - 1

// Convert the raw binary segments to the appropriate ASCII encoding
base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
}

// Deal with the remaining bytes and padding
if (byteRemainder == 1)
{
chunk = bytes[mainLength];
a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
// Set the 4 least significant bits to zero
b = (chunk & 3)   << 4; // 3 = 2^2 - 1
base64 += encodings[a] + encodings[b] + '==';
}
else if (byteRemainder == 2)
{
chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
b = (chunk & 1008)  >>  4; // 1008 = (2^6 - 1) << 4
// Set the 2 least significant bits to zero
c = (chunk & 15)    <<  2; // 15 = 2^4 - 1
base64 += encodings[a] + encodings[b] + encodings[c] + '=';
}

return base64;
},

endProcessFile: function( input )
{
return null;
},
//分析187字节
processPacket: function(packet)
{
// decode rest of transport stream prefix (after the 0x47 flag byte)

// top of second byte
var value = packet.readUnsignedByte();
var tei = Boolean(value & 0x80);	// error indicator
var pusi = Boolean(value & 0x40);	// payload unit start indication
var tpri = Boolean(value & 0x20);	// transport priority indication

// bottom of second byte and all of third
value <<= 8;
value += packet.readUnsignedByte();

var pid = value & 0x1fff;	// packet ID

// fourth byte
value = packet.readUnsignedByte();
var scramblingControl = (value >> 6) & 0x03;	// scrambling control bits
var hasAF = Boolean(value & 0x20);	// has adaptation field
var hasPD = Boolean(value & 0x10);	// has payload data
var ccount = value & 0x0f;		// continuty count

// technically hasPD without hasAF is an error, see spec

if(hasAF)
{
// process adaptation field
var afLen = packet.readUnsignedByte();

// don't care about flags
// don't care about clocks here
packet.position += afLen;	// skip to end
}

if(hasPD)
{
return this.processES(pid, pusi, packet);
}
return null;
},

processES: function( pid, pusi, packet)
{
if(pid === 0)	// PAT
{
if(pusi) this.processPAT(packet);
}
else if(pid == this.pmtPID)
{
if(pusi) this.processPMT(packet);
}
else if(pid == this.audioPID)
{
this.audioPes_.processES(pusi, packet);
}
else if(pid == this.videoPID)
{
return this.videoPes_.processES(pusi, packet);
}
return null;	// ignore all other pids
},

processPAT: function( packet )
{
var pointer = packet.readUnsignedByte();
var tableID = packet.readUnsignedByte();

var sectionLen = packet.readUnsignedShort() & 0x03ff; // ignoring misc and reserved bits
var remaining = sectionLen;

packet.position += 5; // skip tsid + version/cni + sec# + last sec#
remaining -= 5;

while(remaining > 4)
{
packet.readUnsignedShort(); // program number
this.pmtPID = packet.readUnsignedShort() & 0x1fff; // 13 bits
remaining -= 4;
//return; // immediately after reading the first pmt ID, if we don't we get the LAST one
}

// and ignore the CRC (4 bytes)
},

processPMT: function( packet )
{
var pointer = packet.readUnsignedByte();
var tableID = packet.readUnsignedByte();

if (tableID != 0x02)
{
return; // don't try to parse it
}
var sectionLen = packet.readUnsignedShort() & 0x03ff; // ignoring section syntax and reserved
var remaining = sectionLen;

packet.position += 7; // skip program num, rserved, version, cni, section num, last section num, reserved, PCR PID
remaining -= 7;

var piLen = packet.readUnsignedShort() & 0x0fff;
remaining -= 2;

packet.position += piLen; // skip program info
remaining -= piLen;

while(remaining > 4)
{
var type = packet.readUnsignedByte();
var pid = packet.readUnsignedShort() & 0x1fff;
var esiLen = packet.readUnsignedShort() & 0x0fff;
remaining -= 5;

packet.position += esiLen;
remaining -= esiLen;

switch(type)
{
case 0x1b: // H.264 video
this.videoPID = pid;
break;
case 0x0f: // AAC Audio / ADTS
this.audioPID = pid;
break;
// need to add MP3 Audio  (3 & 4)
default:
console.log("unsupported type " + type.toString(16) + " in PMT");
break;
}
}

// and ignore CRC
},

flushFileSegment: function()
{
this.videoPes_.processES(false, null, true);
this.audioPes_.processES(false, null, true);
}
});
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
