cat utils/Process.js utils/BrowserUtils.js utils/ParseUrl.js utils/PlayStates.js utils/prototype.js > utils.js
cat p2p/data/Clip.js p2p/data/Block.js p2p/data/BlockList.js p2p/data/GroupList.js p2p/data/Piece.js > data.js
cat p2p/loaders/BaseHttpLoad.js p2p/loaders/CDNLoader.js p2p/loaders/M3u8Loader.js p2p/loaders/GslbLoader.js p2p/loaders/LoadManager.js p2p/loaders/ParseM3U8.js p2p/loaders/p2ploader/DataConvert.js p2p/loaders/p2ploader/P2PCluster.js p2p/loaders/p2ploader/Selector.js p2p/loaders/p2ploader/Signalling.js p2p/loaders/p2ploader/WSLoader.js p2p/loaders/p2ploader/WSPipe.js p2p/loaders/p2ploader/RTCLoader.js p2p/loaders/p2ploader/Peer.js > loaders.js
cat p2p/manager/DataManager.js p2p/stream/H5Stream.js p2p/statics/Statics.js p2p/vo/Config.js p2p/vo/InitData.js p2p/statics/ProcessReport.js p2p/statics/StaticsElement.js > main.js
cat p2p/ts2mp4/Audio.js p2p/ts2mp4/ByteArray.js p2p/ts2mp4/FileHandler.js p2p/ts2mp4/h264nalu.js p2p/ts2mp4/ToMP4.js p2p/ts2mp4/Video.js > ts2mp4.js
cat utils.js data.js main.js loaders.js ts2mp4.js >../../public/js/video.js
