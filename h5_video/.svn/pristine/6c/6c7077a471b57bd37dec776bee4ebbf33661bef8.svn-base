function isCdePlayerSupport() {
	var mediaType = {
		mediasource : false,
		mp4 : false,
		ts : false
	};
	try {
		var TestMediaSource = window.MediaSource || window.WebKitMediaSource;
		if (!!!TestMediaSource) {
		} else {
			mediaType.mediasource = true;
			mediaType.mp4 = TestMediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
			mediaType.ts = TestMediaSource.isTypeSupported('video/mp2t; codecs="avc1.42E01E,mp4a.40.2"');
		}
	} catch (e) {
	}
	return mediaType.mediasource && (mediaType.ts || mediaType.mp4);
}
