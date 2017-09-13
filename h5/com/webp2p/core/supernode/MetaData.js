p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.DATA_VERIFY_METHOD = {
	kDataVerifyMethodDefault : 0,
	kDataVerifyMethodCrc32 : 1
};

p2p$.com.webp2p.core.supernode.MetaData = JClass.extend_({
	type_ : 0,
	hlsMode_ : false,
	directMetaMode_ : false,
	rangeParamsSupported_ : false,
	version_ : "",
	allowCache_ : "",
	targetDuration_ : 0,
	programId_ : "",
	programeType_ : "",
	programVersion_ : "",
	programDateTime_ : "",
	p2pGroupId_ : "",
	localMetaContent_ : "",
	mediaSequence_ : 0,
	lastReceiveSpeed_ : 0,
	pictureWidth_ : 0,
	pictureHeight_ : 0,
	// totalTnLength_;
	// totalPnLength_;
	// totalSegmentCount_;
	directCount_ : 0,
	moreUrlCount_ : 0,
	p2pPieceCount_ : 0,
	verifyMethod_ : 0,
	totalDuration_ : 0,
	directDuration_ : 0,
	createTime_ : 0,
	updateTime_ : 0,
	urgentSegmentId_ : 0,
	dataSize_ : 0,
	totalGapDuration_ : 0,

	taskId_ : "",
	storageId_ : "",
	channelUrl_ : "",
	sourceUrl_ : "",
	finalUrl_ : "",
	sourceServer_ : "",
	morePrimaryUrls_ : null,
	segments_ : null,

	tn2SegmentIndexMap_ : null,
	pn2SegmentIndexMap_ : null,
	
	strings_:null,
	global_:null,

	init : function() {
		this.segments_ = [];
		this.tn2SegmentIndexMap_ = new p2p$.com.common.Map();
		this.pn2SegmentIndexMap_ = new p2p$.com.common.Map();
		this.strings_ = p2p$.com.common.String;
		this.global_ = p2p$.com.common.Global;
		this.type_ = p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod;
		this.hlsMode_ = true;
		this.directMetaMode_ = false;
		this.rangeParamsSupported_ = true; // default support for rstart, rend params
		this.verifyMethod_ = p2p$.com.webp2p.core.supernode.DATA_VERIFY_METHOD.kDataVerifyMethodDefault;
		this.tidy();
	},
	// readBigUnsignedInteger( const char *data );

	tidy : function() {
		this.targetDuration_ = 0;
		this.pictureWidth_ = 0;
		this.pictureHeight_ = 0;
		// totalTnLength_ = 0;
		// totalPnLength_ = 0;
		// totalSegmentCount_ = 0;
		this.directCount_ = 0;
		this.moreUrlCount_ = 0;
		this.p2pPieceCount_ = 0;
		this.totalDuration_ = 0;
		this.directDuration_ = 0;
		this.mediaSequence_ = 0;
		this.lastReceiveSpeed_ = 0;
		this.updateTime_ = 0;
		this.createTime_ = this.global_.getMilliTime_();
		this.urgentSegmentId_ = -1;
		this.dataSize_ = 0;
		this.totalGapDuration_ = 0;

		this.version_ = "";
		this.programId_ = "";
		this.programVersion_ = "";
		this.p2pGroupId_ = "";
		this.segments_ = [];
		this.localMetaContent_ = "";
		this.tn2SegmentIndexMap_.clear();
		this.pn2SegmentIndexMap_.clear();
	},
	fork : function() {
		var result = new p2p$.com.webp2p.core.supernode.MetaData();
		for ( var n in this) {
			result[n] = this[n];
		}
		return result;
	},
	load : function(values, elapsedTime, needBuildIndexes) {
		this.tidy();
		this.hlsMode_ = true;
		this.moreUrlCount_ = 0;

		var lines = values.split("\n");
		var maxPieceId = 0;
		var nonDirectCount = 0;
		var lastSegment = new p2p$.com.webp2p.core.supernode.MetaSegment();
		lastSegment.m3u8LoadTime_ = elapsedTime;
		var needMoreUrls = (this.directMetaMode_ || p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive == this.type_);
		if (needMoreUrls) {
			lastSegment.moreMediaUrls_ = [];
		}
		this.updateTime_ = this.global_.getMilliTime_();
		for ( var n = 0; n < lines.length; n++) {
			// if (n == 100) break;
			var line = lines[n];
			line = this.strings_.trim(line);
			if ("" == line) {
				continue;
			}
			if (line[0] != '#') {
				if (lastSegment.id_ < 0 || (this.directMetaMode_ && this.type_ != p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive)) {
					lastSegment.id_ = this.segments_.length;
				}

				if (this.directMetaMode_ && lastSegment.directMode_) {
					lastSegment.p2pDisabled_ = true;
				}
				lastSegment.pictureHeight_ = this.pictureHeight_;
				lastSegment.pictureWidth_ = this.pictureWidth_;
				lastSegment.url_ = line;
				lastSegment.mediaUrl_ = this.strings_.getAbsoluteUrlIfNeed_(lastSegment.url_, this.finalUrl_);
				lastSegment.playUrl_ = lastSegment.formatPlayUrl_(this.storageId_);

				if (lastSegment.pieces_.length == 0) {
					// no pieces
					var pieceItem = new p2p$.com.webp2p.core.supernode.MetaPiece();
					pieceItem.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;
					pieceItem.id_ = (lastSegment.id_ > 0) ? lastSegment.id_ : this.segments_.length;
					lastSegment.piecePnCount_++;
					pieceItem.size_ = 0;
					pieceItem.checksum_ = 0;
					pieceItem.offset_ = lastSegment.size_;
					pieceItem.index_ = lastSegment.pieces_.length;
					lastSegment.p2pDisabled_ = true;
					lastSegment.size_ += pieceItem.size_;
					lastSegment.pieces_.push(pieceItem);
				}

				if (lastSegment.startTime_ <= 0) {
					lastSegment.startTime_ = this.totalDuration_;
				}
				if (this.type_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod
						|| this.type_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeDownload) {
					lastSegment.startTimeActual_ = this.totalDuration_;
				} else {
					lastSegment.startTimeActual_ = lastSegment.startTime_;
				}
				if (needMoreUrls) {
					if (lastSegment.moreMediaUrls_ && lastSegment.moreMediaUrls_[0]) {
						this.moreUrlCount_ = 1;
					}
					if (lastSegment.moreMediaUrls_ && lastSegment.moreMediaUrls_[1]) {
						this.moreUrlCount_ = 2;
					}
				}

				this.segments_.push(lastSegment);
				this.p2pPieceCount_ += (lastSegment.pieceTnCount_ + lastSegment.piecePnCount_);
				this.totalDuration_ += lastSegment.duration_;
				this.dataSize_ += lastSegment.size_;
				if (lastSegment.directMode_ && nonDirectCount <= 0) {
					this.directCount_++;
					this.directDuration_ += lastSegment.duration_;
				} else {
					nonDirectCount++;
				}

				lastSegment = new p2p$.com.webp2p.core.supernode.MetaSegment();
				lastSegment.m3u8LoadTime_ = elapsedTime;
				if (this.directMetaMode_ || needMoreUrls) {
					lastSegment.moreMediaUrls_ = [];
				}
				continue;
			}
			var pos = 0, linKey = "", linValue = "";
			if ((pos = line.indexOf(":")) == -1) {
				linKey = line;
			} else {
				linKey = (pos > 0) ? line.substr(0, pos) : "";
				linValue = ((pos + 1) < line.length) ? line.substr(pos + 1) : "";
			}
			linKey = this.strings_.trim(linKey);
			linValue = this.strings_.trim(linValue);

			if (this.strings_.compareTo_(linKey, "#EXT-X-VERSION", true) == 0) {
				this.version_ = linValue;
			} else if (this.strings_.compareTo_(linKey, "#EXT-X-ALLOW-CACHE", true) == 0) {
				this.allowCache_ = linValue;
			} else if (this.strings_.compareTo_(linKey, "#EXT-X-TARGETDURATION", true) == 0) {
				this.targetDuration_ = this.strings_.parseNumber_(linValue, 0);
			} else if (this.strings_.compareTo_(linKey, "#EXT-X-MEDIA-SEQUENCE", true) == 0) {
				this.mediaSequence_ = this.strings_.parseNumber_(linValue, 0);
			} else if (this.strings_.compareTo_(linKey, "#EXT-X-PROGRAM-DATE-TIME", true) == 0) {
				this.programDateTime_ = linValue;
			} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-M3U8-TYPE", true) == 0) {
				this.programeType_ = linValue;
			} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-M3U8-VER", true) == 0) {
				this.programVersion_ = linValue;
			} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-PROGRAM-ID", true) == 0) {
				this.programId_ = linValue;
				lastSegment.programId_ = linValue;
				lastSegment.beginOfMeta_ = true;
			} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-PIC-WIDTH", true) == 0) {
				this.pictureWidth_ = this.strings_.parseFloat(linValue, 0);
			} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-PIC-HEIGHT", true) == 0) {
				this.pictureHeight_ = this.strings_.parseFloat(linValue, 0);
			} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-DIRECT", true) == 0) {
				lastSegment.directMode_ = this.strings_.parseNumber_(linValue, 0) ? true : false;
			} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-PATH1", true) == 0 && lastSegment.moreMediaUrls_ != null) {
				lastSegment.moreMediaUrls_[0] = linValue;
			} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-PATH2", true) == 0 && lastSegment.moreMediaUrls_ != null) {
				lastSegment.moreMediaUrls_[1] = linValue;
			} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-AD-MONITOR-URL", true) == 0) {
				lastSegment.advertMonitorUrl_ = linValue;
			}

			if (this.strings_.compareTo_(linKey, "#EXT-LETV-START-TIME", true) == 0) {
				lastSegment.startTime_ = this.strings_.parseFloat(linValue, 0) * 1000;
			} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-SEGMENT-ID", true) == 0) {
				lastSegment.id_ = this.strings_.parseNumber_(linValue, 0);
			} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-CKS", true) == 0) {

				// speed up method
				var pieceItem = new p2p$.com.webp2p.core.supernode.MetaPiece();
				linValue = this.strings_.makeUpper_(linValue);
				var position = linValue.indexOf("TN=");
				var pieceTag = linValue.substr(position);
				if (-1 != position) {
					pieceItem.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
					pieceItem.id_ = this.strings_.parseNumber_(pieceTag.substring(3, pieceTag.indexOf("&")));

					position = linValue.indexOf("KEY=");
					pieceTag = linValue.substr(position);
					if (-1 != position) {
						pieceItem.key_ = this.strings_.parseNumber_(pieceTag.substring(4, pieceTag.indexOf("&")));
					}

					lastSegment.pieceTnCount_++;
				} else {
					pieceItem.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;
					position = linValue.indexOf("PN=");
					pieceTag = linValue.substr(position);
					if (-1 != position) {
						pieceItem.id_ = this.strings_.parseNumber_(pieceTag.substring(3, pieceTag.indexOf("&")));
					}
					lastSegment.piecePnCount_++;
				}
				position = linValue.indexOf("SZ=");
				pieceTag = linValue.substr(position);
				if (-1 != position) {
					pieceItem.size_ = this.strings_.parseNumber_(pieceTag.substring(3, pieceTag.indexOf("&")));
				}

				position = linValue.indexOf("CKS=");
				pieceTag = linValue.substr(position);
				if (-1 != position) {
					pieceItem.checksum_ = this.strings_.parseNumber_(pieceTag.substring(4));
				}

				// P2P_ULOG_INFO("pieceItem.checksum_:"+pieceItem.checksum_ +",pieceItem.size_:"+pieceItem.size_+",sum:"+(pieceItem.checksum_+pieceItem.size_));
				pieceItem.offset_ = lastSegment.size_;
				pieceItem.index_ = lastSegment.pieces_.length;
				lastSegment.size_ += pieceItem.size_;
				lastSegment.pieces_.push(pieceItem);
				this.maxPieceId = Math.max(maxPieceId, pieceItem.id_);
			} else if (this.strings_.compareTo_(linKey, "#EXT-X-DISCONTINUITY", true) == 0) {
				lastSegment.discontinuity_ = true;
				P2P_ULOG_TRACE("core::supernode::MetaData Segment is #EXT-X-DISCONTINUITY id(" + lastSegment.id_ + "), start time(" + lastSegment.startTime_
						+ ")");
			} else if (this.strings_.compareTo_(linKey, "#EXTINF", true) == 0) {
				lastSegment.duration_ = (this.strings_.parseFloat(linValue, 0) * 1000);
				// P2P_ULOG_INFO("parseResult:"+this.strings_.parseFloat(linValue, 0)+",lastSegment.duration_:"+lastSegment.duration_
				// +",linval="+linValue);
			}

		}
		if (needBuildIndexes) {
			this.buildIndexes_();
		}

		// default
		if (!(this.programId_ == "")) {//生成gid
			this.p2pGroupId_ = this.programId_ + this.programVersion_ + p2p$.com.selector.Module.kP2pVersion;
		}
		return true;
	},

	loadHeaders_ : function(url, cheaders, checksumData) {
	},

	buildIndexes_ : function() {
		this.tn2SegmentIndexMap_.clear();
		this.pn2SegmentIndexMap_.clear();
		this.segments_.sort(function(item1, item2) {
			return item1.id_ - item2.id_;
		});

		this.p2pPieceCount_ = 0;
		this.totalDuration_ = 0;
		for ( var n = 0; n < this.segments_.length; n++) {
			var segment = this.segments_[n];
			segment.index_ = n;
			this.totalDuration_ += segment.duration_;
			if (segment.p2pDisabled_) {
				continue;
			}

			this.p2pPieceCount_ += segment.pieces_.length;
			for ( var k = 0; k < segment.pieces_.length; k++) {
				var piece = segment.pieces_[k];
				var indexMap = (p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn == piece.type_) ? this.tn2SegmentIndexMap_
						: this.pn2SegmentIndexMap_;
				// indexMap[piece.id_] = segment.index_;
				indexMap.set(piece.id_, segment.index_, false);
			}
		}
	},

	updateMetaCache_ : function(endTime, endList, localMode) {
	},

	combineWith_ : function(other, reloaded, groupChanged) {
		var modifyCount = 0;
		var newSegmentCount = 0;
		var maxSegmentId = 0;
		var newSegments = [];
		if (groupChanged) {
			this.version_ = other.version_;
			this.mediaSequence_ = other.mediaSequence_;
			this.pictureWidth_ = other.pictureWidth_;
			this.pictureHeight_ = other.pictureHeight_;
		}

		for ( var k = 0; k < this.segments_.length; k++) {
			var item = this.segments_[k];
			maxSegmentId = maxSegmentId > item.id_ ? maxSegmentId : item.id_;
		}

		for ( var n = 0; n < other.segments_.length; n++) {
			var segment = other.segments_[n];
			var exists = false;
			var existsIndex = 0;
			for ( var k = 0; k < this.segments_.length; k++) {
				var item = this.segments_[k];
				if (item.startTime_ > 0) {
					if (item.id_ == segment.id_) {
						existsIndex = k;
						exists = true;
						break;
					}
				} else if (item.url_ == segment.url_) {
					existsIndex = k;
					exists = true;
					break;
				}
			}

			if (exists) {
				if (reloaded) {
					var existsSegment = this.segments_[existsIndex];
					var backupSegment = existsSegment;
					existsSegment = segment;
					existsSegment.url_ = backupSegment.url_;
					existsSegment.mediaUrl_ = backupSegment.mediaUrl_;
					existsSegment.playUrl_ = backupSegment.playUrl_;
					existsSegment.advertMonitorUrl_ = backupSegment.advertMonitorUrl_;
					existsSegment.advertMonitorReported_ = backupSegment.advertMonitorReported_;
					existsSegment.pictureWidth_ = backupSegment.pictureWidth_;
					existsSegment.pictureHeight_ = backupSegment.pictureHeight_;
					modifyCount++;
				}
				continue;
			}
			newSegments.push(segment.id_);
			this.segments_.push(segment);
			var newSegment = this.segments_[this.segments_.length - 1];
			if (this.p2pGroupId_ == "") {
				// standrad meta
				newSegment.id_ = (segment.startTime_ > 0) ? (newSegment.startTime_ / 1000) : (++maxSegmentId);
				if (segment.pieces_.length == 1) {
					newSegment.pieces_[0].id_ = segment.id_;
				}
			}
			this.p2pPieceCount_ += segment.pieces_.length;
			newSegmentCount++;
			modifyCount++;
		}

		if (modifyCount > 0) {
			this.buildIndexes_();
		}

		return {
			newSegmentCount_ : newSegmentCount,
			newSegments_ : newSegments
		};
	},

	combineSameGroup_ : function(other) {
		if (other.segments_.length == 0) {
			return 0;
		}

		var newSegmentCount = 0;
		var maxSegmentId = 0;
		var newSegments = [];
		var endIndex = other.segments_.length - 1;
		for (; endIndex >= 0; endIndex--) {
			var item = other.segments_[endIndex];
			if (item.beginOfMeta_) {
				break;
			}
		}

		if (endIndex <= 0) {
			return 0;
		}

		for ( var n = 0; n < endIndex; n++) {
			var segment = other.segments_[n];
			var exists = false;
			for ( var k = 0; k < this.segments_.length; k++) {
				var item = this.segments_[k];
				if (item.startTime_ > 0) {
					if (item.id_ == segment.id_) {
						exists = true;
						break;
					}
				} else if (item.url_ == segment.url_) {
					exists = true;
					break;
				}
			}

			if (exists) {
				continue;
			}
			newSegments.push(segment.id_);
			this.segments_.push(segment);
			var newSegment = this.segments_[this.segments_.length - 1];
			if (!this.p2pGroupId_) {
				// standrad meta
				newSegment.id_ = (segment.startTime_ > 0) ? (newSegment.startTime_ / 1000) : (++maxSegmentId);
				if (segment.pieces_.length == 1) {
					newSegment.pieces_[0].id_ = segment.id_;
				}
			}
			this.p2pPieceCount_ += segment.pieces_.length;
			newSegmentCount++;
		}

		if (newSegmentCount > 0) {
			this.buildIndexes_();
		}
		return {
			newSegmentCount_ : newSegmentCount,
			newSegments_ : newSegments
		};
	},

	duplicateExistsFrom_ : function(other) {
	},

	markAllSegmentP2pDisabled_ : function() {
		for ( var n = 0; n < this.segments_.length; n++) {
			var item = this.segments_[n];
			item.p2pDisabled_ = true;
		}
	},

	updateSegmentTimeGap_ : function() {
	},

	resetReceiveTags_ : function() {
	},

	parseChecksum_ : function(pieceSize, checksums, checksumData) {
	},

	verifyPiece_ : function(piece, data, size) {
		switch (this.verifyMethod_) {
		case p2p$.com.webp2p.core.supernode.DATA_VERIFY_METHOD.kDataVerifyMethodCrc32:
			return piece.verifyWithCrc32_(data, size);
		default:
			return piece.verify(data, size);
		}
	},

	getLocalMetaContent_ : function() {
		return this.localMetaContent_;
	},

	getSegmentStorageId_ : function(segmentId) {
		return this.strings_.format("channel://{0}//{1}", this.storageId_, segmentId);
	},

	getSegmentIndexById_ : function(id) {
		for ( var n = 0; n < this.segments_.length; n++) {
			var item = this.segments_[n];
			if (item.id_ == id) {
				return n;
			}
		}
		return -1;
	},

	getSegmentIndexByPieceId_ : function(type, id) {
		var indexMap = (p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn == type) ? this.tn2SegmentIndexMap_ : this.pn2SegmentIndexMap_;
		var value = indexMap.get(id);
		return (value != null ? value : -1);
	},

	getSegmentById_ : function(id) {
		var segment = null;
		for ( var n = 0; n < this.segments_.length; n++) {
			var item = this.segments_[n];
			if (item.id_ == id) {
				segment = item;
				break;
			}
		}
		return segment;
	},

	getDataSize_After_ : function(msId) {
	},
	getAllStatus_ : function(startSegmentId, maxDuration, params, result) {
		var incompleleOnly = params.get("incompleteOnly");
		result["updateTime"] = this.updateTime_;
		result["segmentCount"] = this.segments_.length;
		result["directCount"] = this.directCount_;
		result["pieceCount"] = this.tn2SegmentIndexMap_.length + this.pn2SegmentIndexMap_.length;
		result["tnPieceCount"] = this.tn2SegmentIndexMap_.length;
		result["pnPieceCount"] = this.pn2SegmentIndexMap_.length;
		result["p2pGroupId"] = this.p2pGroupId_;
		result["directDuration"] = this.directDuration_;
		result["targetDuration"] = this.targetDuration_;
		result["totalGapDuration"] = this.totalGapDuration_;
		result["segmentFirstId"] = (this.segments_.length > 0) ? this.segments_[0].id_ : 0;
		result["segmentLastId"] = (this.segments_.length > 0) ? this.segments_[this.segments_.length - 1].id_ : 0;
		result["rangeParamsSupported"] = this.rangeParamsSupported_;
		result["verifyMethod"] = this.verifyMethod_;
		var segmentDisplayCount = 0;
		var segmentDisplayDuration = 0;
		var segmentCompletedCount = 0;
		var segmentCompletingCount = 0;
		var resultSegments = result["segments"] = [];
		for ( var n = 0, j = 0; n < this.segments_.length; n++) {
			var segment = this.segments_[n];
			if (incompleleOnly && segment.completedTime_ > 0) {
				continue;
			}
			if (startSegmentId >= 0 && segment.id_ < startSegmentId) {
				continue;
			}
			if (maxDuration > 0 && segmentDisplayDuration >= maxDuration * 1000) {
				break;
			}
			var resultSegmentsStatus = resultSegments[j++] = {};
			segment.getAllStatus_(resultSegmentsStatus);

			segmentDisplayCount++;
			segmentDisplayDuration += segment.duration_;
			if (segment.completedTime_ > 0) {
				segmentCompletedCount++;
			} else if (segment.completedPieceCount_ > 0) {
				segmentCompletingCount++;
			}
		}
		result["segmentDisplayCount"] = segmentDisplayCount;
		result["segmentDisplayDuration"] = segmentDisplayDuration;
		result["segmentCompletedCount"] = segmentCompletedCount;
		result["segmentCompletingCount"] = segmentCompletingCount;
	}
});
