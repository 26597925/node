path="$( cd "$( dirname "$0" )" && pwd )"
cd $path
echo "改变路径$path"
cat Judge.js LoadScript.js Message.js Sysparam.js Selector.js ../player/vo/Config.js > ../../js/playerSelector.js
cat ../common/Global.js ../common/Log.js ../common/LogPipDefault.js ../common/Map.js ../common/String.js ../common/Url.js > ../common/common.js
cat ../utils/JClass.js ../utils/NameSpace.js ../common/common.js ../h5server/h5P2PServer.js ../loaders/HttpDownLoader.js > ../../js/H5.js

cd ../webp2p 
cat core/common/Enum.js core/common/Module.js core/common/Md5.js core/common/Number.js > core.common.js
cat logic/base/Manager.js logic/base/Channel.js logic/live/Channel.js logic/vod/Channel.js logic/base/Peer.js logic/base/StatData.js > logic.js
cat core/storage/Bucket.js core/storage/MemoryBucket.js core/storage/Pool.js > core.storage.js
cat core/player/BasePlayer.js core/player/VodPlayer.js core/player/Creator.js core/player/LivePlayer.js > core.player.js
cat core/supernode/Bitmap.js core/supernode/Context.js core/supernode/MetaData.js core/supernode/Enviroment.js core/supernode/MetaSegment.js core/supernode/MetaPiece.js > core.supernode.js
cat core/entrance/VideoStream.js > core.entrance.js

cat protocol/base/Manager.js protocol/base/Message.js protocol/base/Pool.js protocol/base/Session.js > protocol.base.js
cat protocol/cdn/Manager.js protocol/cdn/DrmCrypto.js protocol/cdn/RequestRange.js protocol/cdn/Session.js > protocol.cdn.js
cat protocol/webrtc/Manager.js protocol/webrtc/Packet.js protocol/webrtc/Peer.js protocol/webrtc/Session.js > protocol.webrtc.js
cat protocol/websocket/Manager.js protocol/websocket/Peer.js protocol/websocket/Session.js > protocol.websocket.js

cat protocol.base.js protocol.cdn.js protocol.webrtc.js protocol.websocket.js > protocol.js
cat ../utils/Utils.js tools/collector/ClientBase.js tools/collector/ClientStage.js tools/collector/ClientTraffic.js tools/collector/ReportClient.js tools/collector/SupportSession.js tools/console/AllStatus.js tools/console/Channel.js tools/console/Index.js tools/console/IpHelper.js > tools.js
cat SegmentMp4/Audio.js SegmentMp4/Video.js SegmentMp4/BaseMp4.js SegmentMp4/ByteArray.js SegmentMp4/FileHandler.js SegmentMp4/FregmentMp4Header.js SegmentMp4/H264NALU.js SegmentMp4/SegmentMp4.js > mp42ts.js

cd ../player

cat BasePlayer.js MediaPlayer.js Context.js ../webp2p/logic.js ../webp2p/protocol.js ../webp2p/core.entrance.js ../webp2p/core.supernode.js ../webp2p/core.common.js ../webp2p/core.player.js ../webp2p/core.storage.js ../webp2p/mp42ts.js ../webp2p/tools.js > ../../js/lib.mp4.js

cat BasePlayer.js MediaPlayer.js Context.js ../webp2p/logic.js ../webp2p/protocol.js ../webp2p/core.entrance.js ../webp2p/core.supernode.js ../webp2p/core.common.js ../webp2p/core.player.js ../webp2p/core.storage.js  ../webp2p/tools.js > ../../js/lib.ts.js

cat BasePlayer.js SystemPlayer.js Context.js> ../../js/lib.js


