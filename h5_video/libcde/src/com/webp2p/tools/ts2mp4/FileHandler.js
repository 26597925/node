p2p$.ns('com.webp2p.tools.ts2mp4');

p2p$.com.webp2p.tools.ts2mp4.FileHandler = CdeBaseClass.extend_({
	syncFound_ : false,
	pmtPid_ : 0,
	audioPid_ : 0,
	videoPid_ : 0,
	audioPes_ : null,
	videoPes_ : null,
	startTime_ : null,
	specialTypePrefix_ : [ "sm-" ],
	specialType : [ "sm-n9002", "sm-g9008w" ],
	init : function() {
		this.audioPes_ = new p2p$.com.webp2p.tools.ts2mp4.Audio();
		this.videoPes_ = new p2p$.com.webp2p.tools.ts2mp4.Video();
	},

	beginProcessFile_ : function(seek, seekTime) {
		this.syncFound_ = false;
	},

	inputBytesNeeded_ : function() {
		if (this.syncFound_) {
			return 187;
		} else {
			return 1;
		}
	},

	// 分析188字节第一个为0x47
	/**
	 * @params
	 * @input 解码数据
	 * @params 参数
	 * @fragmentSquenceNumber ts编号
	 * @encode 是否需要解码
	 */
	processFileSegment_ : function(input, params, fragmentSequenceNumber, encode) {
		var _usedBytes = 0;
		var _startTime;
		this.startTime_ = null;
		this.audioPes_.reset();
		this.videoPes_.reset();
		while (_usedBytes < input.length) {
			if (!this.syncFound_) {
				if (_usedBytes + 1 > input.length) {
					return null;
				}
				if (input[_usedBytes++] == 0x47) {
					this.syncFound_ = true;
				}
			} else {
				if (_usedBytes + 187 > input.length) {
					return null;
				}
				this.syncFound_ = false;
				var packet = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(input.subarray(_usedBytes, _usedBytes + 187));
				_startTime = this.processPacket_(packet, encode);
				if (_startTime !== null && this.startTime_ === null) {
					this.startTime_ = _startTime;
				}
				if (!encode && this.startTime_ !== null)// 如果不需要解码，只需计算出ts的开始时间即可
				{
					break;
				}
				_usedBytes += 187;
			}
		}
		if (!encode) {
			return input;// 无需解码
		}

		this.flushFileSegment_(input);

		/**
		 * var base64String = this.base64Uint8Array_(this.videoPes_.h264Data_.data); var xhr = new XMLHttpRequest(); xhr.open('POST', '/saveBase64AsH264'); var
		 * params = "data=" + encodeURIComponent(base64String); xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); xhr.send(params);
		 * return;
		 */

		var handlerOptions = {
			video : {
				info : this.videoPes_.videoInfo_,
				avcc : this.videoPes_.avccData_,
				items : this.videoPes_.tags_,
			},
			audio : {
				info : this.audioPes_.audioInfo_,
				aac : this.audioPes_.aacData_,
				items : this.audioPes_.tags_
			},
			fragmentSequenceNumber_ : fragmentSequenceNumber || 0,
			start : 0,
		};

		p2p$.com.webp2p.core.utils.Utils.apply(handlerOptions.video.info, params || {});
		if (params) {
			if (params.duration) {
				handlerOptions.audio.info.duration = Math.floor(params.duration * handlerOptions.audio.info.timeScale / 1000);
				var frameRate = Math.ceil(handlerOptions.audio.info.duration / handlerOptions.audio.items.length);
				handlerOptions.audio.info.duration = frameRate * handlerOptions.audio.items.length;
			}
			if (params.start) {
				handlerOptions.start = params.start;
			}
		}

		var mp4Handler = new p2p$.com.webp2p.tools.ts2mp4.ToMP4(handlerOptions);// Mp4Handler(handlerOptions);
		var data = mp4Handler.toBuffer();
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
			var env = p2p$.com.webp2p.core.supernode.Enviroment;
			if (env.getOSType_() == "Android") {
				for ( var i = 0; i < this.specialTypePrefix_.length; i++) {
					var prefix = this.specialTypePrefix_[i];
					if (p2p$.com.webp2p.core.common.String.startsWith_(env.getDeviceType_(), prefix)) {
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
		// name = 'mp4a.40.' + ((aac[0] >> 3) & 0x1f).toString(16);
		return name;
	},

	getMediaInfoDescriptions_ : function() {
		return 'audio<sri:' + this.audioPes_.sampleRateIndex_ + ', profile:' + this.audioPes_.profile_ + ', channel:' + this.audioPes_.channelConfig_ + '>';
	},

	base64Uint8Array_ : function(bytes) {
		var base64 = '';
		var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
		var byteLength = bytes.byteLength;
		var byteRemainder = byteLength % 3;
		var mainLength = byteLength - byteRemainder;
		var a, b, c, d;
		var chunk;

		// Main loop deals with bytes in chunks of 3
		for ( var i = 0; i < mainLength; i = i + 3) {
			// Combine the three bytes into a single integer
			chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

			// Use bit masks to extract 6-bit segments from the triplet
			a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
			b = (chunk & 258048) >> 12; // 258048 = (2^6 - 1) << 12
			c = (chunk & 4032) >> 6; // 4032 = (2^6 - 1) << 6
			d = chunk & 63; // 63 = 2^6 - 1

			// Convert the raw binary segments to the appropriate ASCII encoding
			base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
		}

		// Deal with the remaining bytes and padding
		if (byteRemainder == 1) {
			chunk = bytes[mainLength];
			a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
			// Set the 4 least significant bits to zero
			b = (chunk & 3) << 4; // 3 = 2^2 - 1
			base64 += encodings[a] + encodings[b] + '==';
		} else if (byteRemainder == 2) {
			chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
			a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
			b = (chunk & 1008) >> 4; // 1008 = (2^6 - 1) << 4
			// Set the 2 least significant bits to zero
			c = (chunk & 15) << 2; // 15 = 2^4 - 1
			base64 += encodings[a] + encodings[b] + encodings[c] + '=';
		}

		return base64;
	},

	endProcessFile_ : function(input) {
		return null;
	},

	// 分析187字节
	processPacket_ : function(packet) {
		// decode rest of transport stream prefix (after the 0x47 flag byte)

		// top of second byte
		var value = packet.readUnsignedByte_();
		// var tei = Boolean(value & 0x80); // error indicator
		var pusi = Boolean(value & 0x40); // payload unit start indication
		// var tpri = Boolean(value & 0x20); // transport priority indication

		// bottom of second byte and all of third
		value <<= 8;
		value += packet.readUnsignedByte_();

		var pid = value & 0x1fff; // packet ID

		// fourth byte
		value = packet.readUnsignedByte_();
		// var scramblingControl = (value >> 6) & 0x03; // scrambling control bits
		var hasAF = Boolean(value & 0x20); // has adaptation field
		var hasPD = Boolean(value & 0x10); // has payload data
		// var ccount = value & 0x0f; // continuty count

		// technically hasPD without hasAF is an error, see spec

		if (hasAF) {
			// process adaptation field
			var afLen = packet.readUnsignedByte_();

			// don't care about flags
			// don't care about clocks here
			packet.position += afLen; // skip to end
		}

		if (hasPD) {
			return this.processES_(pid, pusi, packet);
		}
		return null;
	},

	processES_ : function(pid, pusi, packet) {
		if (pid === 0) // PAT
		{
			if (pusi) {
				this.processPAT_(packet);
			}
		} else if (pid == this.pmtPid_) {
			if (pusi) {
				this.processPMT_(packet);
			}
		} else if (pid == this.audioPid_) {
			this.audioPes_.processES_(pusi, packet);
		} else if (pid == this.videoPid_) {
			return this.videoPes_.processES_(pusi, packet);
		}
		return null; // ignore all other pids
	},

	processPAT_ : function(packet) {
		var pointer = packet.readUnsignedByte_();
		var tableID = packet.readUnsignedByte_();

		var sectionLen = packet.readUnsignedShort_() & 0x03ff; // ignoring misc and reserved bits
		var remaining = sectionLen;

		packet.position += 5; // skip tsid + version/cni + sec# + last sec#
		remaining -= 5;

		while (remaining > 4) {
			packet.readUnsignedShort_(); // program number
			this.pmtPid_ = packet.readUnsignedShort_() & 0x1fff; // 13 bits
			remaining -= 4;
			// return; // immediately after reading the first pmt ID, if we don't we get the LAST one
		}

		// and ignore the CRC (4 bytes)
	},

	processPMT_ : function(packet) {
		var pointer = packet.readUnsignedByte_();
		var tableID = packet.readUnsignedByte_();

		if (tableID != 0x02) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("tools::ts2mp4::FileHandler::PAT pointed to PMT that isn't PMT"));
			return; // don't try to parse it
		}
		var sectionLen = packet.readUnsignedShort_() & 0x03ff; // ignoring section syntax and reserved
		var remaining = sectionLen;

		packet.position += 7; // skip program num, rserved, version, cni, section num, last section num, reserved, PCR PID
		remaining -= 7;

		var piLen = packet.readUnsignedShort_() & 0x0fff;
		remaining -= 2;

		packet.position += piLen; // skip program info
		remaining -= piLen;

		while (remaining > 4) {
			var type = packet.readUnsignedByte_();
			var pid = packet.readUnsignedShort_() & 0x1fff;
			var esiLen = packet.readUnsignedShort_() & 0x0fff;
			remaining -= 5;

			packet.position += esiLen;
			remaining -= esiLen;

			switch (type) {
			case 0x1b: // H.264 video
				this.videoPid_ = pid;
				break;
			case 0x0f: // AAC Audio / ADTS
				this.audioPid_ = pid;
				break;
			// need to add MP3 Audio (3 & 4)
			default:
				P2P_ULOG_INFO(P2P_ULOG_FMT("tools::ts2mp4::FileHandler::Unsupported typeh {0} in PMT", type.toString(16)));
				break;
			}
		}

		// and ignore CRC
	},

	flushFileSegment_ : function(input) {
		this.videoPes_.processES_(false, null, true);
		this.audioPes_.processES_(false, null, true);
	}
});