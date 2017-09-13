path="$( cd "$( dirname "$0" )" && pwd )"
function encode()
{
	file=""
	fileName=$1
	rm -f $fileName
	all_=($@)
	unset all_[0]
	cat ${all_[@]} > $fileName
}
cd $path
encode com.relayCore.utils.js utils/JClass.js utils/NameSpace.js utils/Global.js utils/Log.js utils/String.js utils/Utils.js utils/Map.js utils/Number.js utils/Url.js utils/HttpDownLoader.js  utils/LogPipDefault.js
encode com.relayCore.webrtc.js webrtc/Manager.js webrtc/Peer.js webrtc/Channel.js webrtc/packets/NegPacket.js webrtc/packets/BytesPacket.js webrtc/PacketProcess.js webrtc/MetaChannel.js
encode com.relayCore.ssrcs.js ssrcs/SSRC.js ssrcs/Layer.js ssrcs/CacheData.js ssrcs/Manager.js ssrcs/Channel.js ssrcs/VirtualChannel.js
encode com.relayCore.vo.js vo/Config.js statics/Statics.js
encode com.relayCore.controller.js controller/LMPN.js
encode com.relayCore.websocket.js websocket/Manager.js websocket/Session.js websocket/QueryPeer.js websocket/Peer.js
encode com.relayCore.broadcast.js broadcast/BroadCast.js

rm -f LiveRTC.js LiveRTC2.js
cat com.relayCore.utils.js com.relayCore.broadcast.js com.relayCore.webrtc.js com.relayCore.vo.js com.relayCore.ssrcs.js com.relayCore.controller.js com.relayCore.websocket.js > LiveRTC.js
cat com.relayCore.utils.js com.relayCore.broadcast.js com.relayCore.webrtc.js com.relayCore.vo.js com.relayCore.ssrcs.js com.relayCore.controller.js > LiveRTC2.js
rm -f com.relayCore.utils.js com.relayCore.broadcast.js com.relayCore.webrtc.js com.relayCore.vo.js com.relayCore.ssrcs.js com.relayCore.controller.js com.relayCore.websocket.js 
cd ../../../

cp -R LiveRtc/ ../Tomcat/webapps/Live/ 
cp -R LiveRtc/com/ ../git/rtc/lmpn-h5/com/
cp -R LiveRtc/com/relayCore/LiveRTC2.js /Users/letv/Documents/Tomcat/webapps/App/public/js/LiveRTC.js