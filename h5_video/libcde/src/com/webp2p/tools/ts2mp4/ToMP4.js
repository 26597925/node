p2p$.ns('com.webp2p.tools.ts2mp4');

p2p$.com.webp2p.tools.ts2mp4.ToMP4 = CdeBaseClass.extend_({
	type : 0,
	audio : null,
	video : null,
	start : 0,
	dataSize : 0,
	fileData : null,
	fileType : true,
	config : null,

	// private members
	movieBoxSize_ : 0,
	dataOffset : 0,
	videoDataOffset_ : 0,
	videoDataSize_ : 0,
	audioDataOffset_ : 0,
	autioDataSize_ : 0,
	fragmentSequenceNumber_ : 0,
	moofPos_ : 0,
	videoOffsetPos_ : [],
	audioOffsetPos_ : [],
	videoMoofOffset_ : [],
	audioMoofOffset_ : [],

	init : function(configer) {
		if (Object.prototype.toString.call(configer) == '[object Object]') {
			for ( var name in configer) {
				// console.log(name,":",configer[name]);
				this[name] = configer[name];
			}
		}
		// this.config = h5$.com.p2p.vo.Config;
	},

	toBuffer : function() {
		var moofstart = 0;
		this.videoOffsetPos_ = [];
		this.audioOffsetPos_ = [];
		this.videoMoofOffset_ = [];
		this.audioMoofOffset_ = [];
		this.type = 0;
		this.dataSize = 0;
		this.movieBoxSize_ = (this.video.items.length + this.audio.items.length) * 8 + 2000;
		this.dataOffset = this.movieBoxSize_;
		var i;
		var item;
		for (i = 0; i < this.video.items.length; i++) {
			item = this.video.items[i];
			this.dataSize += item.data.length;
		}
		this.videoDataSize_ = this.dataSize;
		for (i = 0; i < this.audio.items.length; i++) {
			item = this.audio.items[i];
			this.dataSize += item.data.length;
		}
		this.autioDataSize_ = this.dataSize - this.videoDataSize_;
		this.fileData = new Uint8Array(this.dataOffset + this.dataSize);
		var offset = 0;
		// console.log("-->fragmentNumber=",this.fragmentSequenceNumber_);
		if (this.fragmentSequenceNumber_ === 0) {
			offset += this.writeFileType_(this.fileData, offset);
			offset += this.writeFreeBlock_(this.fileData, offset);
		} else {
			offset += this.writeMediaType_(this.fileData, offset);
		}
		offset += this.writeMovie_(this.fileData, offset);
		moofstart = offset;
		offset += this.writeMoiveFragment_(this.fileData, offset);
		this.videoDataOffset_ = offset + 8;
		this.audioDataOffset_ = this.videoDataOffset_ + this.videoDataSize_;
		for (i = 0; i < this.videoOffsetPos_.length; i++) {
			this.writeArrayUint32_(this.fileData, this.videoOffsetPos_[i], this.videoDataOffset_);
		}
		for (i = 0; i < this.audioOffsetPos_.length; i++) {
			this.writeArrayUint32_(this.fileData, this.audioOffsetPos_[i], this.audioDataOffset_);
		}
		for (i = 0; i < this.videoMoofOffset_.length; i++) {
			this.writeArrayUint32_(this.fileData, this.videoMoofOffset_[i], this.videoDataOffset_ - moofstart);
		}
		for (i = 0; i < this.audioMoofOffset_.length; i++) {
			this.writeArrayUint32_(this.fileData, this.audioMoofOffset_[i], this.audioDataOffset_ - moofstart);
		}
		var _len = this.writeMediaData_(this.fileData, offset);
		// if(this.lastid)
		// {
		// _len += this.writeRandom_(this.fileData, _len);
		// }
		var _filedata = new Uint8Array();
		_filedata = this.fileData.subarray(0, _len);
		// console.log("-->offset:",this.videoDataOffset_,"this.dataSize=",this.dataSize,",filesize=",this.fileData.length,",after=",_filedata.length);
		return _filedata;
	},

	writeArrayBuffer_ : function(to, offset, from) {
		var i;
		if (from.className == 'WebP2P.ts2mp4.ByteArray') {
			for (i = 0; i < from.length; i++) {
				to[offset + i] = from.getByte_(i);
			}
		} else {
			for (i = 0; i < from.length; i++) {
				to[offset + i] = from[i];
			}
		}
		return from.length;
	},

	writeArrayString_ : function(to, offset, from) {
		for ( var i = 0; i < from.length; i++) {
			to[offset + i] = from.charCodeAt(i);
		}
		return from.length;
	},

	writeArrayUint8_ : function(to, offset, from) {
		var position = offset;
		if (Object.prototype.toString.call(from) == '[object Array]') {
			for ( var i = 0; i < from.length; i++) {
				position += this.writeArrayUint8_(to, position, from[i]);
			}
		} else {
			to[position++] = from & 0xff;
		}
		return position - offset;
	},

	writeArrayUint16_ : function(to, offset, from) {
		var position = offset;
		if (Object.prototype.toString.call(from) == '[object Array]') {
			for ( var i = 0; i < from.length; i++) {
				position += this.writeArrayUint16_(to, position, from[i]);
			}
		} else {
			to[position++] = (from >> 8) & 0xff;
			to[position++] = from & 0xff;
		}
		return position - offset;
	},

	writeArrayUint32_ : function(to, offset, from) {
		var position = offset;
		if (Object.prototype.toString.call(from) == '[object Array]') {
			for ( var i = 0; i < from.length; i++) {
				position += this.writeArrayUint32_(to, position, from[i]);
			}
		} else {
			to[position++] = (from >> 24) & 0xff;
			to[position++] = (from >> 16) & 0xff;
			to[position++] = (from >> 8) & 0xff;
			to[position++] = from & 0xff;
		}
		return position - offset;
	},

	writeFileType_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "ftyp");
		size += this.writeArrayString_(buffer, offset + size, "isom"); // major brand
		size += this.writeArrayUint32_(buffer, offset + size, 1); // minor version
		size += this.writeArrayString_(buffer, offset + size, "isommp42avc1"); // compatible brands
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMediaType_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "styp");
		size += this.writeArrayString_(buffer, offset + size, "isom"); // major brand
		size += this.writeArrayUint32_(buffer, offset + size, 1); // minor version
		size += this.writeArrayString_(buffer, offset + size, "isommp42avc1"); // compatible brands
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeFreeBlock_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "free");
		size += this.writeArrayString_(buffer, offset + size, "IsoMedia File Produced with GPAC 0.5.1-DEV-rev5528");
		size += this.writeArrayUint8_(buffer, offset + size, 0);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	// moovbox，这个box中不包含具体媒体数据，但包含本文件中所有媒体数据的宏观描述信息，moov box下有mvhd和trak box
	writeMovie_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "moov");
		size += this.writeMovieHeader_(buffer, offset + size);
		if (this.type === 0) {
			size += this.writeMovieExtendBox_(buffer, offset + size);
		}
		size += this.writeTrack_(buffer, offset + size, true);
		size += this.writeTrack_(buffer, offset + size, false);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMovieHeader_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "mvhd");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, Math.round(new Date().getTime() / 1000) + 2082844800); // creation time
		size += this.writeArrayUint32_(buffer, offset + size, Math.round(new Date().getTime() / 1000) + 2082844800); // modification time
		size += this.writeArrayUint32_(buffer, offset + size, this.video.info.timeScale); // time scale
		size += this.writeArrayUint32_(buffer, offset + size, this.type == 1 ? this.video.info.duration : 0); // Math.max(this.video.info.duration,
		// this.audio.info.duration)); // duration
		size += this.writeArrayUint32_(buffer, offset + size, 0x00010000); // rate
		size += this.writeArrayUint16_(buffer, offset + size, 0x0100); // volume
		size += this.writeArrayUint16_(buffer, offset + size, 0); // reserved
		size += this.writeArrayUint32_(buffer, offset + size, [ 0, 0 ]); // reserved
		size += this.writeArrayUint32_(buffer, offset + size, [ 0x00010000, 0, 0, 0, 0x00010000, 0, 0, 0, 0x40000000 ]); // unity matrix
		size += this.writeArrayUint32_(buffer, offset + size, [ 0, 0, 0, 0, 0, 0 ]); // pre defined
		size += this.writeArrayUint32_(buffer, offset + size, 3); // next track id
		this.writeArrayUint32_(buffer, offset, size);
		// console.log("-->mvhd:timescale-->",this.video.info.timeScale,",duration-->",this.video.info.duration);
		return size;
	},

	writeMovieExtendBox_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "mvex");
		size += this.writeMovieExtendHeader_(buffer, offset + size);
		size += this.writeTrack_Extend_(buffer, offset + size, true);
		size += this.writeTrack_Extend_(buffer, offset + size, false);
		// size += this.writeTrackPrograme_(buffer,offset+size,true);
		// size += this.writeTrackPrograme_(buffer,offset+size,false);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMovieExtendHeader_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "mehd");
		size += this.writeArrayUint32_(buffer, offset + size, 0);
		size += this.writeArrayUint32_(buffer, offset + size, this.fragmentSequenceNumber_);// fregment_duration
		// console.log("-->duration:",this.video.info.duration);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTrack_Extend_ : function(buffer, offset, isVideo) {
		var media = isVideo ? this.video : this.audio;
		// var dur = media.info.duration;// /media.items.length;
		var samplesize = isVideo ? this.videoDataSize_ : this.autioDataSize_;
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "trex");
		size += this.writeArrayUint32_(buffer, offset + size, 0);
		size += this.writeArrayUint32_(buffer, offset + size, isVideo ? 1 : 2);// track_ID;
		size += this.writeArrayUint32_(buffer, offset + size, 1);// default_sample_description_index;
		size += this.writeArrayUint32_(buffer, offset + size, Math.ceil(media.info.duration / media.items.length));// default_sample_duration;
		size += this.writeArrayUint32_(buffer, offset + size, Math.ceil(samplesize / media.items.length));// default_sample_size;
		size += this.writeArrayUint32_(buffer, offset + size, isVideo ? 0x10000 : 0x0);// default_sample_flags
		// console.log("-->trex:","dur=",Math.ceil(media.info.duration/media.items.length),",size=",Math.ceil(samplesize/media.items.length));
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTrackPrograme_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "trep");
		size += this.writeArrayUint32_(buffer, offset + size, 0);
		size += this.writeArrayUint32_(buffer, offset + size, isVideo ? 1 : 2);// track_ID;
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTrack_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "trak");
		size += this.writeTrack_Header_(buffer, offset + size, isVideo);
		// if(isVideo && this.type==0)
		// {
		// size += this.writeEditBox_(buffer, offset + size, isVideo);
		// }
		size += this.writeMedia_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeEditBox_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "edts");
		size += this.writeEditListBox_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeEditListBox_ : function(buffer, offset, isVideo) {
		var size = 8;
		var info = isVideo ? this.video.info : this.audio.info;
		this.writeArrayString_(buffer, offset + 4, "elst");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, 1); // entry count
		size += this.writeArrayUint32_(buffer, offset + size, info.duration); // segment duration
		size += this.writeArrayUint32_(buffer, offset + size, 0); // media time
		size += this.writeArrayUint16_(buffer, offset + size, 1); // media rate integer
		size += this.writeArrayUint16_(buffer, offset + size, 0); // media rate fraction
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTrack_Header_ : function(buffer, offset, isVideo) {
		var size = 8;
		var info = isVideo ? this.video.info : this.audio.info;
		this.writeArrayString_(buffer, offset + 4, "tkhd");
		size += this.writeArrayUint32_(buffer, offset + size, 0x1); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, Math.round(new Date().getTime() / 1000) + 2082844800); // creation time
		size += this.writeArrayUint32_(buffer, offset + size, Math.round(new Date().getTime() / 1000) + 2082844800); // modification time
		size += this.writeArrayUint32_(buffer, offset + size, isVideo ? 1 : 2); // track id
		size += this.writeArrayUint32_(buffer, offset + size, 0); // reserved
		size += this.writeArrayUint32_(buffer, offset + size, this.type == 1 ? info.duration : 0); // duration
		size += this.writeArrayUint32_(buffer, offset + size, [ 0, 0 ]); // reserved
		size += this.writeArrayUint16_(buffer, offset + size, 0); // layer
		size += this.writeArrayUint16_(buffer, offset + size, 0); // alternate group
		size += this.writeArrayUint16_(buffer, offset + size, isVideo ? 0 : 0x0100); // volume
		size += this.writeArrayUint16_(buffer, offset + size, 0); // reserved
		size += this.writeArrayUint32_(buffer, offset + size, [ 0x00010000, 0, 0, 0, 0x00010000, 0, 0, 0, 0x40000000 ]); // unity matrix
		size += this.writeArrayUint32_(buffer, offset + size, (info.width || 0) << 16); // width
		size += this.writeArrayUint32_(buffer, offset + size, (info.height || 0) << 16); // height
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMedia_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "mdia");
		size += this.writeMediaHeader_(buffer, offset + size, isVideo);
		size += this.writeMediaHandlerRef_(buffer, offset + size, isVideo);
		size += this.writeMediaInformation_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMediaHeader_ : function(buffer, offset, isVideo) {
		var size = 8;
		var info = isVideo ? this.video.info : this.audio.info;
		this.writeArrayString_(buffer, offset + 4, "mdhd");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, Math.round(new Date().getTime() / 1000) + 2082844800); // creation time
		size += this.writeArrayUint32_(buffer, offset + size, Math.round(new Date().getTime() / 1000) + 2082844800); // modification time
		size += this.writeArrayUint32_(buffer, offset + size, info.timeScale); // time scale
		size += this.writeArrayUint32_(buffer, offset + size, this.type == 1 ? info.duration : 0); // duration
		size += this.writeArrayUint16_(buffer, offset + size, 0x55C4); // language and pack und
		size += this.writeArrayUint16_(buffer, offset + size, 0); // pre defined
		this.writeArrayUint32_(buffer, offset, size);
		// console.log("-->",info.timeScale,",",info.duration);
		return size;
	},

	writeMediaHandlerRef_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "hdlr");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, 0); // pre defined
		size += this.writeArrayString_(buffer, offset + size, isVideo ? "vide" : "soun"); // handler type
		size += this.writeArrayUint32_(buffer, offset + size, [ 0, 0, 0 ]); // reserved
		size += this.writeArrayString_(buffer, offset + size, isVideo ? "VideoHandler" : "SoundHandler"); // name
		size += this.writeArrayUint8_(buffer, offset + size, 0); // end of name
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMediaInformation_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "minf");
		if (isVideo) {
			size += this.writeVideoMediaHeader_(buffer, offset + size);
		} else {
			size += this.writeAudioMediaHeader_(buffer, offset + size);
		}
		size += this.writeDataInformation_(buffer, offset + size, isVideo);
		size += this.writeSampleTable_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeVideoMediaHeader_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "vmhd");
		size += this.writeArrayUint32_(buffer, offset + size, 0x1); // full box version and flags
		size += this.writeArrayUint16_(buffer, offset + size, 0); // graphics mode
		size += this.writeArrayUint16_(buffer, offset + size, [ 0, 0, 0 ]); // opcolors
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeAudioMediaHeader_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "smhd");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint16_(buffer, offset + size, 0); // balance
		size += this.writeArrayUint16_(buffer, offset + size, 0); // reserved
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeDataInformation_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "dinf");
		size += this.writeDataReference_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeDataReference_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "dref");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, 1); // entry count
		size += this.writeDataInfoUrl_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeDataInfoUrl_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "url ");
		size += this.writeArrayUint32_(buffer, offset + size, 0x1); // full box version and flags
		// empty location as same file
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeSampleTable_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "stbl");
		size += this.writeSampleDescription_(buffer, offset + size, isVideo);
		size += this.writeSampleTimestamp_(buffer, offset + size, isVideo);
		// if(isVideo )
		// {
		// size += this.writeSyncSample_(buffer, offset + size);
		// }
		size += this.writeSampleToChunk_(buffer, offset + size, isVideo);
		size += this.writeSampleSize_(buffer, offset + size, isVideo);
		size += this.writeChunkOffset_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeSyncSample_ : function(buffer, offset) {
		var syncEntries = [];
		var i;
		var item;
		for (i = 0; i < this.video.items.length; i++) {
			item = this.video.items[i];
			item.sampleNumber = i + 1;
			if (item.isKeyFrame) {
				syncEntries.push(item);
			}
		}

		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "stss");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, syncEntries.length); // entry count
		for (i = 0; i < syncEntries.length; i++) {
			item = syncEntries[i];
			size += this.writeArrayUint32_(buffer, offset + size, item.sampleNumber); // sample number
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeSampleDescription_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "stsd");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, 1); // entry count
		if (isVideo) {
			size += this.writeVisualSampleEntry_(buffer, offset + size);
		} else {
			size += this.writeAudioSampleEntry_(buffer, offset + size);
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeVisualSampleEntry_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "avc1");
		size += this.writeArrayUint8_(buffer, offset + size, [ 0, 0, 0, 0, 0, 0 ]); // reserved
		size += this.writeArrayUint16_(buffer, offset + size, 1); // data reference index
		size += this.writeArrayUint16_(buffer, offset + size, 0); // pre defined
		size += this.writeArrayUint16_(buffer, offset + size, 0); // reserved
		size += this.writeArrayUint32_(buffer, offset + size, [ 0, 0, 0 ]); // pre defined
		size += this.writeArrayUint16_(buffer, offset + size, this.video.info.width); // width
		size += this.writeArrayUint16_(buffer, offset + size, this.video.info.height); // height
		size += this.writeArrayUint32_(buffer, offset + size, 0x00480000); // horiz resolution
		size += this.writeArrayUint32_(buffer, offset + size, 0x00480000); // vert resolution
		size += this.writeArrayUint32_(buffer, offset + size, 0); // reserved
		size += this.writeArrayUint16_(buffer, offset + size, 1); // frame count
		for ( var i = 0; i < 32; i++) {
			size += this.writeArrayUint8_(buffer, offset + size, 0); // 32 bytes padding name
		}
		size += this.writeArrayUint16_(buffer, offset + size, 0x0018); // depth
		size += this.writeArrayUint16_(buffer, offset + size, 0xffff); // pre defined
		size += this.writeAVCDecoderConfiguration_(buffer, offset + size);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeAVCDecoderConfiguration_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "avcC");
		if (this.video.avcc) {
			size += this.writeArrayBuffer_(buffer, offset + size, this.video.avcc);
			// size += this.writeArrayUint32_(buffer, offset + size,0xfcf8f800);
		} else {
			var sequences = [ 0x67, 0x42, 0xC0, 0x15, 0xD9, 0x41, 0xE0, 0x8E, 0x9A, 0x80, 0x80, 0x80, 0xA0, 0x00, 0x00, 0x03, 0x00, 0x20, 0x00, 0x00, 0x03,
					0x03, 0xD1, 0xE2, 0xC5, 0xCB ];
			size += this.writeArrayUint8_(buffer, offset + size, 1); // configuration version
			size += this.writeArrayUint8_(buffer, offset + size, 0x42); // profile indication => baseline
			size += this.writeArrayUint8_(buffer, offset + size, 0xC0); // profile compatibility
			size += this.writeArrayUint8_(buffer, offset + size, 21); // level indication
			size += this.writeArrayUint8_(buffer, offset + size, 0xFF); // length size minus one
			size += this.writeArrayUint8_(buffer, offset + size, 0xE1); // num of sequence parameter sets
			size += this.writeArrayUint16_(buffer, offset + size, sequences.length); // sequence size
			size += this.writeArrayUint8_(buffer, offset + size, sequences); // sequence
			size += this.writeArrayUint8_(buffer, offset + size, 1); // num of picture parameter sets
			size += this.writeArrayUint16_(buffer, offset + size, 4); // picture size
			size += this.writeArrayUint8_(buffer, offset + size, [ 0x68, 0xC9, 0x23, 0xC8 ]); // picture
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeAudioSampleEntry_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "mp4a");
		size += this.writeArrayUint8_(buffer, offset + size, [ 0, 0, 0, 0, 0, 0 ]); // reserved
		size += this.writeArrayUint16_(buffer, offset + size, 1); // data reference index
		size += this.writeArrayUint32_(buffer, offset + size, [ 0, 0 ]); // reserved
		size += this.writeArrayUint16_(buffer, offset + size, this.audio.info.channelCount || 2); // channel count
		size += this.writeArrayUint16_(buffer, offset + size, this.audio.info.sampleSize || 16); // sample size
		size += this.writeArrayUint16_(buffer, offset + size, 0); // pre defined
		size += this.writeArrayUint16_(buffer, offset + size, 0); // reserved
		size += this.writeArrayUint32_(buffer, offset + size, this.audio.info.timeScale << 16); // sample rate
		size += this.writeAudioDecoderConfiguration_(buffer, offset + size);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeAudioDecoderConfiguration_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "esds"); // Element Stream Descriptors
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeAudioEsDescriptionTag_(buffer, offset + size); // unknown
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeAudioEsDescriptionTag_ : function(buffer, offset) {
		var size = 0;
		size += this.writeArrayUint8_(buffer, offset + size, 0x03); // tag
		// size += this.writeArrayUint8_(buffer, offset + size, [ 0x80, 0x80, 0x80, 0 ]); // size
		size += this.writeArrayUint8_(buffer, offset + size, 0); // size
		size += this.writeArrayUint16_(buffer, offset + size, 10); // ESID
		size += this.writeArrayUint8_(buffer, offset + size, 0); // Stream Dependence Flag:1, URL Flag:1, OCR Stream Flag: 1, Stream Priority: 5
		size += this.writeAudioDecodeConfigDescriptionTag_(buffer, offset + size);
		size += this.writeAudioSlConfigDescriptionTag_(buffer, offset + size);
		// this.writeArrayUint8_(buffer, offset + 4, size - 5);
		this.writeArrayUint8_(buffer, offset + 1, size - 2);
		return size;
	},

	writeAudioDecodeConfigDescriptionTag_ : function(buffer, offset) {
		var size = 0;
		size += this.writeArrayUint8_(buffer, offset + size, 0x04); // tag
		// size += this.writeArrayUint8_(buffer, offset + size, [ 0x80, 0x80, 0x80, 0 ]); // size
		size += this.writeArrayUint8_(buffer, offset + size, 0); // size
		size += this.writeArrayUint8_(buffer, offset + size, 0x40); // Object Type Id
		size += this.writeArrayUint8_(buffer, offset + size, 0x14); // Stream Type = 0x05 << 2
		size += this.writeArrayUint8_(buffer, offset + size, [ 0, 0, 0 ]); // Buffer Size DB
		size += this.writeArrayUint32_(buffer, offset + size, this.autioDataSize_ * 8000 / this.audio.info.duration); // Max Bitrate
		size += this.writeArrayUint32_(buffer, offset + size, this.autioDataSize_ * 8000 / this.audio.info.duration); // Avg Bitrate
		size += this.writeAudioDecodeSpecificDescriptionTag_(buffer, offset + size);
		// this.writeArrayUint8_(buffer, offset + 4, size - 5);
		this.writeArrayUint8_(buffer, offset + 1, size - 2);
		return size;
	},

	writeAudioDecodeSpecificDescriptionTag_ : function(buffer, offset) {
		var size = 0;
		size += this.writeArrayUint8_(buffer, offset + size, 0x05); // tag
		// size += this.writeArrayUint8_(buffer, offset + size, [ 0x80, 0x80, 0x80, 0 ]); // size
		size += this.writeArrayUint8_(buffer, offset + size, 0); // size
		// size += this.writeArrayUint8_(buffer, offset + size, [0x13,0x88,0x56,0xE5,0xA5,0x48,0x80]);
		if (this.audio.aac) {
			size += this.writeArrayBuffer_(buffer, offset + size, this.audio.aac); // info
		} else {
			size += this.writeArrayUint16_(buffer, offset + size, 0x1210); // info
		}
		// this.writeArrayUint8_(buffer, offset + 4, size - 5);
		this.writeArrayUint8_(buffer, offset + 1, size - 2);
		return size;
	},

	writeAudioSlConfigDescriptionTag_ : function(buffer, offset) {
		var size = 0;
		size += this.writeArrayUint8_(buffer, offset + size, 0x06); // tag
		// size += this.writeArrayUint8_(buffer, offset + size, [ 0x80, 0x80, 0x80, 0 ]); // size
		size += this.writeArrayUint8_(buffer, offset + size, 0); // size
		size += this.writeArrayUint8_(buffer, offset + size, 0x02); // predefined
		// size += this.writeArrayUint8_(buffer, offset + size, 0); // flags
		// this.writeArrayUint8_(buffer, offset + 4, size - 5);
		this.writeArrayUint8_(buffer, offset + 1, size - 2);
		return size;
	},

	writeSampleTimestamp_ : function(buffer, offset, isVideo) {
		var size = 8;
		var media = isVideo ? this.video : this.audio;
		// var start = media.start;
		this.writeArrayString_(buffer, offset + 4, "stts");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		if (this.type == 1) {
			size += this.writeArrayUint32_(buffer, offset + size, 1); // entry count
			size += this.writeArrayUint32_(buffer, offset + size, media.items.length); // sample count
			size += this.writeArrayUint32_(buffer, offset + size, Math.ceil(media.info.duration / media.items.length)); // sample delta
		} else {
			size += this.writeArrayUint32_(buffer, offset + size, 0); // entry count
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeSampleToChunk_ : function(buffer, offset, isVideo) {
		var size = 8;
		var media = isVideo ? this.video : this.audio;
		this.writeArrayString_(buffer, offset + 4, "stsc");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		if (this.type == 1) {
			size += this.writeArrayUint32_(buffer, offset + size, 1); // entry count
			size += this.writeArrayUint32_(buffer, offset + size, 1); // first chunk
			size += this.writeArrayUint32_(buffer, offset + size, media.items.length); // samples per chunk
			size += this.writeArrayUint32_(buffer, offset + size, 1); // sample description index
		} else {
			size += this.writeArrayUint32_(buffer, offset + size, 0); // entry count
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeSampleSize_ : function(buffer, offset, isVideo) {
		var size = 8;
		var media = isVideo ? this.video : this.audio;
		this.writeArrayString_(buffer, offset + 4, "stsz");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, 0); // sample size
		if (this.type == 1) {
			size += this.writeArrayUint32_(buffer, offset + size, media.items.length); // sample count
			for ( var i = 0; i < media.items.length; i++) {
				var item = media.items[i];
				size += this.writeArrayUint32_(buffer, offset + size, item.data.length); // entry size
			}
		} else {
			size += this.writeArrayUint32_(buffer, offset + size, 0); //
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeChunkOffset_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "stco");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		if (this.type == 1) {
			size += this.writeArrayUint32_(buffer, offset + size, 1); // entry count
			if (isVideo) {
				this.videoOffsetPos_.push(offset + size);
			} else {
				this.audioOffsetPos_.push(offset + size);
			}
			size += this.writeArrayUint32_(buffer, offset + size, 0); // chunk offset
		} else {
			size += this.writeArrayUint32_(buffer, offset + size, 0); // entry count
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMoiveFragment_ : function(buffer, offset) {
		this.moofPos_ = offset;
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "moof");
		size += this.writeMoiveFragmentHeader_(buffer, offset + size);
		if (this.type === 0) {
			size += this.writeTraf_(buffer, offset + size, true);
			size += this.writeTraf_(buffer, offset + size, false);
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMoiveFragmentHeader_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "mfhd");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, this.fragmentSequenceNumber_++); // sequence number
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTraf_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "traf");
		size += this.writeTrafHeader_(buffer, offset + size, isVideo);
		size += this.writeTrafDT_(buffer, offset + size, isVideo);
		size += this.writeTrunHeader_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTrafHeader_ : function(buffer, offset, isVideo) {
		var size = 8;
		// var info = isVideo ? this.video.info : this.audio.info;
		// var msize = isVideo ? this.videoDataSize_ : this.audioDataSize;
		this.writeArrayString_(buffer, offset + 4, "tfhd");
		/**
		 * 0x000001 base-data-offset-present 0x000002 sample-description-index-present 0x000008 default-sample-duration-present 0x000010
		 * default-sample-size-present 0x000020 default-sample-flags-present 0x010000 duration-is-empty 0x020000 default-base-is-moof
		 */
		size += this.writeArrayUint32_(buffer, offset + size, 0x020000); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, isVideo ? 1 : 2); // track id
		// size += this.writeArrayUint32_(buffer, offset + size, 0);//;
		// isVideo ? this.videoOffsetPos_.push(offset + size) : this.audioOffsetPos_.push(offset + size);
		// size += this.writeArrayUint32_(buffer, offset + size, 0);//base_data_offset;
		// if(!isVideo){
		// size += this.writeArrayUint32_(buffer, offset + size, 0x02000000);
		// }
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTrafDT_ : function(buffer, offset, isVideo) {
		var size = 8;
		var media = isVideo ? this.video : this.audio;

		this.writeArrayString_(buffer, offset + 4, "tfdt");
		size += this.writeArrayUint32_(buffer, offset + size, 0);
		// 提取第一片时间
		// media.items.sort(function(a,b){return a.timestamp-b.timestamp;});
		var newItems = media.items.concat();
		newItems.sort(function(a, b) {
			return a.timestamp - b.timestamp;
		});
		var timestamp = newItems[0].timestamp;
		var dttime = Math.ceil(timestamp * media.info.timeScale / 1000);
		size += this.writeArrayUint32_(buffer, offset + size, dttime);// sum duration
		// console.log("*toMp4:ts--time:",media.items[0].timestamp,dttime);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTrunHeader_ : function(buffer, offset, isVideo) {
		var size = 8;
		var media = isVideo ? this.video : this.audio;
		var i;
		var item;
		this.writeArrayString_(buffer, offset + 4, "trun");
		/*
		 * flags说明： 0x000001:data-offset-present 0x000004:first-sample-flags-present; this over-rides the default flags for the first sample only. This makes it
		 * possible to record a group of frames where the first is a key and the rest are difference frames, without supplying explicit flags for every sample.
		 * If this flag and field are used, sample-flags shall not be present. 0x000100 sample-duration-present: 标示每一个sample有他自己的时长, 否则使用默认值. 0x000200
		 * sample-size-present：每个sample拥有大小，否则使用默认值 0x000400 sample-flags-present：每个sample有他自己的标志，否则使用默认值 0x000800 sample-composition-time-offsets-present;
		 * 每个sample 有一个composition time offset
		 */
		if (isVideo) {
			size += this.writeArrayUint32_(buffer, offset + size, 0xe05);// flags//offset ,s-size
			size += this.writeArrayUint32_(buffer, offset + size, media.items.length); // sample count
			this.videoMoofOffset_.push(offset + size);// position
			size += this.writeArrayUint32_(buffer, offset + size, 0); // dat-offset
			size += this.writeArrayUint32_(buffer, offset + size, 0x02000000); // first-sample-flag//
			// var dur = Math.ceil(media.info.duration / media.items.length);
			for (i = 0; i < media.items.length; i++) {
				item = media.items[i];
				// console.log("-->time:",i,":",item.timestamp,",offset:",item.avccTimeOffset);
				// size += this.writeArrayUint32_(buffer, offset + size, dur); // sample_size
				size += this.writeArrayUint32_(buffer, offset + size, item.data.length); // sample_size
				if (item.isKeyFrame === true) {
					// console.log("-->key:",item.frameType,"|",item.timestamp);
					size += this.writeArrayUint32_(buffer, offset + size, 0x02000000);
				} else {
					size += this.writeArrayUint32_(buffer, offset + size, 0x10000);
				}
				size += this.writeArrayUint32_(buffer, offset + size, item.avccTimeOffset);
			}
		} else {
			size += this.writeArrayUint32_(buffer, offset + size, 0x201);// flags//offset ,s-size
			size += this.writeArrayUint32_(buffer, offset + size, media.items.length); // sample count
			this.audioMoofOffset_.push(offset + size);// position
			size += this.writeArrayUint32_(buffer, offset + size, 0); // dat-offset
			// size += this.writeArrayUint32_(buffer, offset + size, 0); // first-sample-flag//
			for (i = 0; i < media.items.length; i++) {
				item = media.items[i];
				// console.log("size:",item.data.length);
				// if(this.start<0)
				// {
				// if(i<media.items.length-1)
				// {
				// dur = Math.ceil((media.items[i+1].timestamp - media.items[i].timestamp)*media.info.timeScale/1000);
				// }
				// else
				// {
				// dur = Math.ceil(media.info.duration+(media.items[0].timestamp-media.items[i-1].timestamp)*media.info.timeScale/1000);
				// }
				// // console.log("-->time:",media.items[i].timestamp,",dur:",dur,"|",media.info.duration);
				// size += this.writeArrayUint32_(buffer, offset + size, dur); // sample_duration
				// }
				size += this.writeArrayUint32_(buffer, offset + size, item.data.length); // sample_size
			}
		}
		this.writeArrayUint32_(buffer, offset, size);
		// console.log("--->trun:","|count:",media.items.length,"|dur:",this.audio.info.duration,"-",dur);
		return size;
	},

	writeMediaData_ : function(buffer, offset) {
		offset += this.writeArrayUint32_(buffer, offset, this.dataSize + 8);
		offset += this.writeArrayString_(buffer, offset, "mdat");
		var i, item;
		for (i = 0; i < this.video.items.length; i++) {
			item = this.video.items[i];
			item.dataOffset = offset;
			offset += this.writeArrayBuffer_(buffer, offset, item.data);
		}
		for (i = 0; i < this.audio.items.length; i++) {
			item = this.audio.items[i];
			item.dataOffset = offset;
			offset += this.writeArrayBuffer_(buffer, offset, item.data);
		}
		return offset;
	},

	writeRandom_ : function(buffer, offset) {
		// console.log("-->增加文件最后标志！");
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "mfra");
		// size += this.writeRandomTrack_(buffer, offset + size, true);
		// size += this.writeRandomTrack_(buffer, offset + size, false);
		size += this.writeRandomOffset_(buffer, offset, size);
		// this.writeArrayUint32_(buffer, offset + size, size);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeRandomTrack_ : function(buffer, offset, isVideo) {
		var size = 8;
		var media = isVideo ? this.video : this.audio;
		var dttime = Math.ceil(media.items[0].timestamp * media.info.timeScale / 1000);
		offset += this.writeArrayString_(buffer, offset + 4, "tfra");
		size += this.writeArrayUint32_(buffer, offset + size, 0);// version
		size += this.writeArrayUint32_(buffer, offset + size, isVideo ? 1 : 2);// trackid
		size += this.writeArrayUint32_(buffer, offset + size, 0);// size traf
		size += this.writeArrayUint32_(buffer, offset + size, 1);// trun size
		size += this.writeArrayUint32_(buffer, offset + size, dttime);
		size += this.writeArrayUint32_(buffer, offset + size, this.moofPos_);
		size += this.writeArrayUint8_(buffer, offset + size, 0x01);// trafnum
		size += this.writeArrayUint8_(buffer, offset + size, 0x01);// trunnum
		size += this.writeArrayUint8_(buffer, offset + size, media.items.length);// trafnum
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeRandomOffset_ : function(buffer, offset, size2) {
		var size = 8;
		offset += size2;
		this.writeArrayString_(buffer, offset + 4, "mfro");
		size += this.writeArrayUint32_(buffer, offset + size, 0);// version
		size += this.writeArrayUint32_(buffer, offset + size, size2 + 16);// size
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	}
});