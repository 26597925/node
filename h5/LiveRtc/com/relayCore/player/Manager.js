/**
 * edit by chenzhaofei 2016-12-6
 */
rc$.ns("com.relayCore.player");
rc$.com.relayCore.player.Manager=JClass.extend_({
	connectedPeer : null,
    players : null,
    streams : [],
    playIndex : [],
    nossrc : [],
    channel : "",
    updateSSRC : [],
    maxIndex : 4,
    temple : "",
    channelRequest : null,
    channelClose : null,
    index_ : [],
    index : 0,
    //初始化方法，对象new的时候制定调用
    init : function(){
        var me = this;
        setTimeout(function(){
            me.getParams(JSON.stringify({
                channel: 'channel',
                ssrc: []
            }));
        }, 1500);

        for(var u = 1; u <= this.maxIndex; u++){
            this.index_.push(u);
        }
    },
    /*
     *
     *
     *
     *
     * 对外接口 start
     *
     *
     *
     *
     */
    //给peerBuilder的回调接口
    addPeer : function(peer){
        var me = this;
        me.bindEvent(peer,"addstream",me.addStream_.bind(me));
        me.bindEvent(peer,"removestream",me.removeStream_.bind(me));
    },
    //从peerBuilder获取peer
    getPeer : function(peer){
        this.connectedPeer = peer;
    },
    //获取数据接口
    getParams : function(json_){
        this.players = JSON.parse(json_);
        //解析通知消息
        this.parseMessage();
    },
    //把数据输出接口
    setParams : function(){
        this.channelClose();
        this.channelRequest(this.channel);
    },

    onChannelRequest : function(callback){
        this.channelRequest = callback;
    },

    onChannelClose : function(callback){
        this.channelClose = callback;
    },

    /*
     *
     *
     *
     *对外接口 end
     *
     *
     *
     */
});