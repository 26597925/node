p2p$.ns('com.webp2p.tools.ts2mp4');

p2p$.com.webp2p.tools.ts2mp4.Video = CdeBaseClass.extend_({
	nalData_ : null,
	vTag_ : null,
	vTagData_ : null,
	scState_ : null,
	tags_ : null,
	avccData_ : null,
	videoInfo_ : null,
	h264Data_ : null,
	timestamp_ : 0,
	compositionTime_ : 0,

	init : function() {
		this.reset();
	},

	reset : function() {
		this.scState_ = 0;
		this.nalData_ = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(1024);
		this.vTag_ = null;
		this.vTagData_ = null;
		this.tags_ = [];
		this.avccData_ = null;
		this.videoInfo_ = {
			width : 640,
			height : 352,
			timeScale : 1000,
			duration : 0
		};
		this.timestamp_ = 0;
		this.compositionTime_ = 0;
		// this.h264Data_ = new WebP2P.ts2mp4.ByteArray(100);
	},

	getPTS_ : function(p1, p2, p3) {
		return ((p1 & 0x0e) * Math.pow(2, 29)) + ((p2 & 0xfffe) << 14) + ((p3 & 0xfffe) >> 1);
	},

	processES_ : function(pusi, packet, flush) {
		// if( packet ) this.h264Data_.writeBytes_(packet, packet.position, packet.length - packet.position);
		var i = 0;
		if (pusi) {
			// start of a new PES packet
			if (packet.readUnsignedInt_() != 0x1e0) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("tools::ts2mp4::Video::PES start code not found or not AAC/AVC"));
			}
			// Ignore packet length and marker bits.
			packet.position += 3;
			// Need PTS and DTS
			var flags = (packet.readUnsignedByte_() & 0xc0) >> 6;
			if (flags != 0x03 && flags != 0x02) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("tools::ts2mp4::Video::Video PES packet without PTS cannot be decoded, flags: {0}", flags));
			}
			// Check PES header length
			var length = packet.readUnsignedByte_();
			var p1 = packet.readUnsignedByte_();
			var p2 = packet.readUnsignedShort_();
			var p3 = packet.readUnsignedShort_();
			var pts = this.getPTS_(p1, p2, p3);

			// console.log("time:",p1,(p1 & 0x0e),(p1 & 0x0e) << 29);

			this.timestamp_ = Math.round(pts / 90);
			length -= 5;
			if (flags == 0x03) {
				p1 = packet.readUnsignedByte_();
				p2 = packet.readUnsignedShort_();
				p3 = packet.readUnsignedShort_();
				var dts = this.getPTS_(p1, p2, p3);

				// this.timestamp_ = Math.round(dts / 90);
				this.compositionTime_ = this.timestamp_ - Math.round(dts / 90);
				// console.log("-->video--pts " + pts.toString() + " dts " + dts.toString() + " comp " + this.compositionTime_.toString() + " stamp "
				// + this.timestamp_.toString() + " total " + (this.compositionTime_ + this.timestamp_).toString());
				length -= 5;
			} else {
				// this.timestamp_ = Math.round(pts / 90);
				this.compositionTime_ = 0;
			}
			// console.log("--->flags:",flags,",ct=",this.compositionTime_);

			// Skip other header data.
			packet.position += length;
		}
		var dStart = 0;
		if (!flush) {
			dStart = packet.position; // assume that the copy will be from start-of-data
		}

		var nals = [];
		var nal = null;

		if (flush) {
			nal = new p2p$.com.webp2p.tools.ts2mp4.H264NALU(this.nalData_); // full length to end, don't need to trim last 3 bytes
			if (nal.NALtype() !== 0) {
				nals.push(nal); // could inline this (see below)
				// console.log("-->pushed one flush nal of type " + nal.NALtype());
			}
			this.nalData_ = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(1024);
		} else {
			while (packet.bytesAvailable_() > 0) {
				var value = packet.readUnsignedByte_();

				// finding only 3-byte start codes is ok as trailing zeros are ignored in most (all?) cases
				// console.log("# "+value.toString(16) + " at st "+this.scState_.toString());
				// unperf
				// this.nalData_.writeByte_()value); // in the future we will performance-fix this by keeping indexes and doing block copies, for now we want it
				// to work at all
				switch (this.scState_) {
				case 0:
					if (value === 0x00) {
						this.scState_ = 1;
					}
					break;
				case 1:
					if (value === 0x00) {
						this.scState_ = 2;
					} else {
						this.scState_ = 0;
					}
					break;
				case 2:
					if (value === 0x00) // more than 2 zeros... no problem
					{
						// state stays at 2
						// console.log("ex zero");
						break;
					} else if (value == 0x01) {
						// perf
						this.nalData_.writeBytes_(packet, dStart, packet.position - dStart);
						dStart = packet.position;
						// at this point we have the NAL data plus the *next* start code in nalData_
						// unless there was no previous NAL in which case nalData_ is either empty or has the leading zeros, if any
						if (this.nalData_.length > 4) // require >1 byte of payload
						{
							this.nalData_.length -= 3; // trim off the 0 0 1 (might be one more zero, but in H.264 that's ok)
							nal = new p2p$.com.webp2p.tools.ts2mp4.H264NALU(this.nalData_);
							if (nal.NALtype() !== 0) {
								// console.log("F NAL TYPE "+nal.NALtype().toString());
								nals.push(nal); // could inline this as well, rather than stacking and processing later in the function
							}
						} else {
							// console.log("-->length too short! = " + this.nalData_.length);
						}
						this.nalData_ = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(1024); // and start collecting into the next one
						this.scState_ = 0; // got one, now go back to looking
						break;
					} else {
						// console.log("0, 0,... " + value.toString());
						this.scState_ = 0; // go back to looking
						break;
					}
					// notreached
					break;
				default:
					// shouldn't ever get here
					this.scState_ = 0;
					break;
				} // switch scState_
			} // while bytesAvailable
		}

		if (!flush && packet.position - dStart > 0) {
			this.nalData_.writeBytes_(packet, dStart, packet.position - dStart);
		}

		var spsNAL = null;
		var ppsNAL = null;
		// find SPS + PPS if we can
		for (i = 0; i < nals.length; i++) {
			nal = nals[i];
			switch (nal.NALtype()) {
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

		var tag = null; // :FLVTagVideo;
		var avccTag = null; // :FLVTagVideo = null;

		// note that this breaks if the sps and pps are in different segments that we process

		if (spsNAL && ppsNAL) {
			var spsLength = spsNAL.length();
			var ppsLength = ppsNAL.length();

			tag = {};
			tag.timestamp = this.timestamp_;
			tag.isKeyFrame = true;
			// tag.codecId = 'CODEC_ID_AVC';
			// tag.frameType = 'FRAME_TYPE_KEYFRAME';
			// tag.avcPacketType = 'AVC_PACKET_TYPE_SEQUENCE_HEADER';

			var avcc = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(1024);
			avcc.writeByte_(0x01); // avcC version 1
			// profile, compatibility, level
			avcc.writeBytes_(spsNAL.NALdata(), 1, 3);
			avcc.writeByte_(0xff); // 111111 + 2 bit NAL size - 1
			avcc.writeByte_(0xe1); // number of SPS
			avcc.writeByte_(spsLength >> 8); // 16-bit SPS byte count
			avcc.writeByte_(spsLength);
			avcc.writeBytes_(spsNAL.NALdata(), 0, spsLength); // the SPS
			avcc.writeByte_(0x01); // number of PPS
			avcc.writeByte_(ppsLength >> 8); // 16-bit PPS byte count
			avcc.writeByte_(ppsLength);
			avcc.writeBytes_(ppsNAL.NALdata(), 0, ppsLength);
			this.avccData_ = avcc;
			this.deocodeSps_(spsNAL.NALdata(), 0, spsLength);

			tag.data = avcc;
			// this.tags_.push(tag);
			avccTag = tag;
		}

		for (i = 0; i < nals.length; i++) {
			nal = nals[i];
			// console.log(" NAL TYPE "+nal.NALtype().toString());

			if (nal.NALtype() == 9) // AUD - should read the flags in here too, perhaps
			{
				// close the last vTag_ and start a new one
				if (this.vTag_ && this.vTagData_.length === 0) {
					// console.log("-->zero-length vtag"); // can't happen if we are writing the AUDs in
					if (avccTag) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("tools::ts2mp4::Video::Avccts " + avccTag.timestamp.toString() + " vtagts "
								+ this.vTag_.timestamp.toString()));
					}
				}

				if (this.vTag_ && this.vTagData_.length > 0) {
					this.vTag_.data = this.vTagData_; // set at end (see below)
					this.tags_.push(this.vTag_);
					this.videoInfo_.duration = this.videoInfo_.timeScale * this.timestamp_ / 1000;
					if (avccTag) {
						avccTag.timestamp = this.vTag_.timestamp;
						avccTag = null;
					}
				}
				this.vTag_ = {};
				// this.vTag_.codecId = 'CODEC_ID_AVC';
				// this.vTag_.frameType = 'FRAME_TYPE_INTER'; // adjust to keyframe later
				// this.vTag_.avcPacketType = 'AVC_PACKET_TYPE_NALU';
				this.vTag_.timestamp = this.timestamp_;
				this.vTag_.avccTimeOffset = this.compositionTime_;
				this.vTagData_ = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(1024); // we assemble the nalus outside, set at end
				this.vTagData_.writeUnsignedInt_(nal.length());
				this.vTagData_.writeBytes_(nal.NALdata()); // start with this very NAL, an AUD (XXX not sure this is needed)
			} else if (nal.NALtype() != 7 && nal.NALtype() != 8) {
				if (this.vTag_ === null) {
					// console.log("-->needed to create vtag");
					this.vTag_ = {};
					this.vTagData_ = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(1024); // we assemble the nalus outside, set at end
					// this.vTag_.codecId = 'CODEC_ID_AVC';
					// this.vTag_.frameType = 'FRAME_TYPE_INTER'; // adjust to keyframe later
					// this.vTag_.avcPacketType = 'AVC_PACKET_TYPE_NALU';
					this.vTag_.timestamp = this.timestamp_;
					this.vTag_.avccTimeOffset = this.compositionTime_;
				}

				if (nal.NALtype() == 5) // is this correct code?
				{
					this.vTag_.isKeyFrame = true;
					// this.vTag_.frameType = 'FRAME_TYPE_KEYFRAME';
				}
				this.vTagData_.writeUnsignedInt_(nal.length());
				this.vTagData_.writeBytes_(nal.NALdata());
			}
		}

		if (flush) {
			// console.log(" *** VIDEO FLUSH CALLED");
			if (this.vTag_ && this.vTagData_.length > 0) {
				this.vTag_.data = this.vTagData_; // set at end (see below)
				this.tags_.push(this.vTag_);
				this.videoInfo_.duration = this.videoInfo_.timeScale * this.timestamp_ / 1000;
				if (avccTag) {
					avccTag.timestamp = this.vTag_.timestamp;
					avccTag = null;
				}
				// console.log("flushing one vtag");
			}
			this.vTag_ = null; // can't start new one, don't have the info
		}
		return this.timestamp_;
	},

	deocodeSps_ : function(buffer, offset, size) {
	}
});