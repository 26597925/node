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
