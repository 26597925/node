p2p$.ns('com.webp2p.tools.ts2mp4');

p2p$.com.webp2p.tools.ts2mp4.Audio = CdeBaseClass.extend_({
	state_ : 0,
	haveNewTimestamp_ : false,
	audioTime_ : 0,
	audioTimeIncr_ : 0,
	profile_ : 0,
	sampleRateIndex_ : 0,
	channelConfig_ : 0,
	frameLength_ : 0,
	remaining_ : 0,
	adtsHeader_ : null,
	needACHeader_ : false,
	audioData_ : null,
	aacData_ : null,
	tags_ : null,
	audioInfo_ : null,
	srMap_ : [ 96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350 ],

	init : function() {
		this.reset();
	},

	reset : function() {
		this.state_ = 0;
		this.adtsHeader_ = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(100);
		this.needACHeader_ = true; // need more than this, actually...
		this.sampleRateIndex_ = 0;
		this.channelConfig_ = 0;
		this.tags_ = [];
		this.audioInfo_ = {
			index : 0,
			timeScale : 44100,
			duration : 0
		};
	},

	getPTS_ : function(p1, p2, p3) {
		return ((p1 & 0x0e) * Math.pow(2, 29)) + ((p2 & 0xfffe) << 14) + ((p3 & 0xfffe) >> 1);
	},

	getIncrForSRI_ : function(srIndex) {
		var rate = this.srMap_[srIndex];
		return 1024000.0 / rate; // t = 1/rate... 1024 samples/frame and srMap is in kHz
	},

	processES_ : function(pusi, packet, flush) {
		var value;
		if (pusi) {
			// start of a new PES packet
			// Start code prefix and packet ID.
			value = packet.readUnsignedInt_();
			packet.position -= 4;
			if (packet.readUnsignedInt_() != 0x1c0) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("tools::ts2mp4::Audio::PES start code not found or not AAC/AVC"));
				return;
			}
			// Ignore packet length and marker bits.
			packet.position += 3;
			// need PTS only
			var flags = (packet.readUnsignedByte_() & 0xc0) >> 6;
			// console.log("-->flags:",flags);
			if (flags != 0x02) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("tools::ts2mp4::Audio::No PTS in this audio PES packet, flags({0})", flags));
				return;
			}

			var length = packet.readUnsignedByte_();
			var p1 = packet.readUnsignedByte_();
			var p2 = packet.readUnsignedShort_();
			var p3 = packet.readUnsignedShort_();
			var pts = this.getPTS_(p1, p2, p3);

			this._timestamp = Math.round(pts / 90);
			this.haveNewTimestamp_ = true;
			// console.log("audio:",pts);
			length -= 5;
			// no comp time for audio
			// Skip other header data.
			packet.position += length;
		}

		value = 0;
		var tag = null;

		var dStart = 0;
		if (!flush) {
			dStart = packet.position;
		}

		if (flush) {
			// console.log("-->audio flush at state " + this.state_.toString());
		} else {
			while (packet.bytesAvailable_() > 0) {
				if (this.state_ < 7) {
					value = packet.readUnsignedByte_();
					this.adtsHeader_.setByte_(this.state_, value);
				}

				switch (this.state_) {
				case 0: // first 0xff of flags
					if (this.haveNewTimestamp_) {
						this.audioTime_ = this._timestamp;
						this.haveNewTimestamp_ = false;
					}

					if (value == 0xff) {
						this.state_ = 1;
					} else {
						// console.log("adts seek 0");
					}
					break;

				case 1: // final 0xf of flags, first nibble of flags
					if ((value & 0xf0) != 0xf0) {
						// console.log("adts seek 1");
						this.state_ = 0;
					} else {
						this.state_ = 2;
						// 1 bit always 1
						// 2 bits of layer, always 00
						// 1 bit of protection present
						this.crc_abs_ = value & 0x01;
					}
					break;

				case 2:
					this.state_ = 3;
					this.profile_ = (value >> 6) & 0x03;
					// console.log("AUDIO: raw " + value.toString(2));
					// console.log("AUDIO: profile " + this.profile_.toString(2));
					this.sampleRateIndex_ = (value >> 2) & 0x0f;
					this.audioTimeIncr_ = this.getIncrForSRI_(this.sampleRateIndex_);
					// console.log("AUDIO: sample rate index " + this.sampleRateIndex_ + ", time incr " + this.audioTimeIncr_);
					// if( this.audioTimeIncr_ > 0 ) this.audioInfo_.timeScale = this.audioTimeIncr_;
					// one private bit
					this.channelConfig_ = (value & 0x01) << 2; // first bit thereof
					break;

				case 3:
					this.state_ = 4;
					// console.log("raw "+value.toString(2));
					this.channelConfig_ += (value >> 6) & 0x03; // rest of channel config
					// orig/copy bit
					// home bit
					// copyright id bit
					// copyright id start
					this.frameLength_ = (value & 0x03) << 11; // bits 12 and 11 of the length
					break;

				case 4:
					this.state_ = 5;
					// console.log("raw "+value.toString(2));
					this.frameLength_ += (value) << 3; // bits 10, 9, 8, 7, 6, 5, 4, 3
					break;

				case 5:
					this.state_ = 6;
					// console.log("raw "+value.toString(2));
					this.frameLength_ += (value & 0xe0) >> 5;
					// console.log("framelen "+this.frameLength_.toString(2));
					this.remaining_ = this.frameLength_ - 7; // XXX crc issue?
					// console.log("remaining: "+this.remaining_.toString());
					// buffer fullness
					break;

				case 6:
					this.state_ = 7;
					dStart = packet.position;
					this.audioData_ = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(2048);
					// 6 more bits of buffer fullness
					// 2 bits number of raw data blocks in frame (add one to get count)
					if (this.needACHeader_) {
						tag = {};
						tag.timestamp = this.audioTime_;
						// tag.soundFormat = 'SOUND_FORMAT_AAC';
						// tag.soundChannels = 'SOUND_CHANNELS_STEREO';
						// tag.soundRate = 'SOUND_RATE_44K'; // rather than what is reported
						// tag.soundSize = 'SOUND_SIZE_16BITS';
						// tag.isAACSequenceHeader = true;
						// this.channelConfig_ = 2;
						// this.sampleRateIndex_ = 4;
						this.aacData_ = new Uint8Array(2);
						// this.aacData_ = new Uint8Array(5);

						// this.aacData_ = new Uint8Array((this.sampleRateIndex_ == 7) ? 7 : 2);
						this.aacData_[0] = (this.profile_ + 1) << 3;
						this.aacData_[0] |= this.sampleRateIndex_ >> 1;
						this.aacData_[1] = (this.sampleRateIndex_ & 0x01) << 7;
						this.aacData_[1] |= this.channelConfig_ << 3;
						// this.aacData_[2] = 0x56;
						// this.aacData_[3] = 0xe5;
						// this.aacData_[4] = 0;
						// if (this.sampleRateIndex_ == 7) {
						// var privateBytes = [ 0x56, 0xE5, 0xA5, 0x48, 0x80 ];
						// for ( var i = 0; i < privateBytes.length; i++) {
						// this.aacData_[i + 2] = privateBytes[i];
						// }
						// }
						this.audioInfo_.index = this.sampleRateIndex_;
						this.audioInfo_.channelCount = 2; // this.channelConfig_;
						this.audioInfo_.timeScale = this.srMap_[this.sampleRateIndex_] || 44100;
						this.audioInfo_.sampleSize = 16; // * this.audioInfo_.timeScale / 44100;

						// console.log('audio:profile_ is : ' + this.profile_);
						// console.log('audio:sampleRateIndex_ is : ' + this.sampleRateIndex_);
						// console.log('audio:channelConfig_ is : ' + this.channelConfig_);

						/*
						 * acHeader[0] = (this.profile_ + 1)<<3; acHeader[0] |= this.sampleRateIndex_ >> 1; acHeader[1] = (this.sampleRateIndex_ & 0x01) <<
						 * 7; acHeader[1] |= this.channelConfig_ << 3; acHeader.length = 2;
						 */
						this.adtsHeader_.length = 4;
						tag.data = this.adtsHeader_;
						this.needACHeader_ = false;

						// console.log("adding AC header of "+uint(this.adtsHeader_[0]).toString(16)+" "+uint(this.adtsHeader_[1]).toString(16)+"
						// "+uint(this.adtsHeader_[2]).toString(16)+" "+uint(this.adtsHeader_[3]).toString(16));
						// tag.write(tagData); // unroll out vector
						// this.tags_.push(tag);
					}
					break;

				case 7:
					if ((packet.length - dStart) >= this.remaining_) {
						packet.position += this.remaining_;
						this.remaining_ = 0;
					} else {
						var avail = packet.length - dStart;
						packet.position += avail;
						this.remaining_ -= avail;
						this.audioData_.writeBytes_(packet, dStart, packet.position - dStart);
					}

					if (this.remaining_ > 0) {
						//
					} else {
						this.audioData_.writeBytes_(packet, dStart, packet.position - dStart);
						this.state_ = 0;

						tag = {};
						tag.timestamp = this.audioTime_;
						// console.log("audio timestamp " + this.audioTime_.toString());
						this.audioTime_ += this.audioTimeIncr_;
						// tag.soundChannels = 'SOUND_CHANNELS_STEREO';
						// tag.soundFormat = 'SOUND_FORMAT_AAC';
						// tag.isAACSequenceHeader = false;
						// tag.soundRate = 'SOUND_RATE_44K'; // rather than what is reported
						// tag.soundSize = 'SOUND_SIZE_16BITS';
						tag.data = this.audioData_;
						// tag.write(tagData); // unrolled out the vector for audio tags
						// console.log("done");
						this.tags_.push(tag);
					}
					break;
				} // switch
			} // while
		}
	}
});