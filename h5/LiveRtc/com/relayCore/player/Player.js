/**
 * edit by chenzhaofei
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
    parseMessage : function(){
        if(this.players.channel && this.players.ssrc.length<1) {
            this.channel = this.players.channel;
            this.setParams();
        }
        if(this.players.channel && this.players.ssrc && this.players.ssrc.length >0){
            this.searchSSRC();
            this.commander();
        }
    },
    searchSSRC : function(){
        var c = [];
        var n = [];
        var t = [];
        var m = {"bp":"","stream":[],id:0,aid:0,bid:0};
        for(var k = 0; k < this.players.ssrc.length; k++){
            for(var l = 0; l < this.streams.length; l++){
                for(var h = 0; h < this.streams[l].label.length; h++){
                    if(this.streams[l].label[h].split(":")[1] == this.players.ssrc[k]){
                        c.push(this.streams[l].bp);
                    }
                }
            }
        }
        for(var i = 0; i < c.length; i++) {
            if (n.indexOf(c[i]) == -1){
                n.push(c[i]);
            }
        }
        for(var z = 0; z < n.length; z++) {
            m.bp = n[z];
            for(var e = 0; e < this.streams.length; e++) {
                if(n[z] == this.streams[e].bp){
                    m.stream = this.streams[e].stream;
                }
            }
            t.push(m);
        }
        this.updateSSRC = t;
    },
    commander : function(){
        var addHas = [];
        var playing = [];
        var delHas = [];
        var update;
        var aid;
        var bid;
        var aindex;
        var bindex;
        if(this.maxIndex<=this.updateSSRC.length){
            update = this.updateSSRC.slice(0,this.maxIndex);
        }else{
            update = this.updateSSRC;
        }
        if(this.playIndex.length<1){
            addHas = update;
            //首次加载逻辑，有个bug需要TODO
            for(var k = 0; k < addHas.length; k++){
                if(this.index_.length>0){
                    addHas[k].id = this.index_.shift();
                    addHas[k].aid = 0;
                    addHas[k].bid = 0;
                    this.playIndex.push(addHas[k]);
                    this.addVideo(addHas[k]);
                }else{}
            }
        }else {
            for (var p = 0; p < this.playIndex.length; p++) {
                for (var u = update.length-1; u >= 0; u--) {
                    if (update[u].bp == this.playIndex[p].bp) {
                        update.splice(u,1);
                    } else {
                        delHas.push(this.playIndex[p]);
                    }
                }
            }
            addHas = update;
            for (var d = 0; d < delHas.length; d++) {
                for (var g = this.playIndex.length-1; g >= 0; g--) {
                    if(this.playIndex[g].id == delHas[d].id) {
                        this.index_.push(this.playIndex[g].id);
                        if (this.playIndex[g].aid == 0 && this.playIndex[g].bid != 0) {
                            for(var y = this.playIndex.length-1; y >= 0; y--){
                                if (this.playIndex[y].id == this.playIndex[g].bid){
                                    this.playIndex[y].aid = 0;
                                    this.playIndex.splice(g,1);
                                    this.removeVideo(delHas[d]);
                                    break;
                                }
                            }
                        } else if (this.playIndex[g].aid != 0 && this.playIndex[g].bid == 0) {
                            for(var q = this.playIndex.length-1; q >= 0; q--){
                                if (this.playIndex[q].id == this.playIndex[g].aid){
                                    this.playIndex[q].bid = 0;
                                    this.playIndex.splice(g,1);
                                    this.removeVideo(delHas[d]);
                                    break;
                                }
                            }
                        } else if (this.playIndex[g].aid == 0 && this.playIndex[g].bid == 0) {
                            this.playIndex.splice(g,1);
                            this.removeVideo(delHas[d]);
                        }else{
                            for(var t = this.playIndex.length-1; t >= 0; t--){
                                if (this.playIndex[t].id == this.playIndex[g].aid){
                                    aid = t;
                                    aindex = g;
                                    this.removeVideo(delHas[d]);
                                    continue;
                                }
                                if (this.playIndex[t].id == this.playIndex[g].bid){
                                    bid = t;
                                    bindex = g;
                                    this.removeVideo(delHas[d]);
                                    continue;
                                }
                            }
                            this.playIndex[aid].bid = this.playIndex[bid].id;
                            this.playIndex[bid].aid = this.playIndex[aid].id;
                            this.playIndex.splice(aindex,1);
                            this.playIndex.splice(bindex,1);

                        }
                    }
                }
            }
            addHas = update;
            for (var a = 0; a < addHas.length; a++) {
                addHas[a].id = this.index_.shift();
                if(this.playIndex.length == 0){
                    addHas[a].aid = 0;
                    addHas[a].bid = 0;
                }else if(this.playIndex.length == 1){
                    addHas[a].aid = 0;
                    this.playIndex[0].aid = addHas[a].id;
                    addHas[a].bid = 0;
                }else if(this.playIndex.length > 1){
                    addHas[a].aid = this.playIndex[this.playIndex-1].id;
                    this.playIndex[this.playIndex-1].bid = addHas[a].id;
                    addHas[a].bid = this.playIndex[this.playIndex.length-2].id;
                    this.playIndex[this.playIndex.length-2].aid = addHas[a].id;
                }
                this.playIndex.push(addHas[a]);
                this.addVideo(addHas[a]);
            }
        }
    },
    newVideo : function(addID){
        this.temple = "";
        var s = window.URL.createObjectURL(addID.stream[0]);
        this.temple = '<div id="v-in' + addID.id + '" class="v-in v-in-animation"><video id="remoteVideo' + addID.id + '" src="'+s+'" class="video" autoplay></video></div>';
        this.getEByID("video-out").append(this.temple);
    },
    addVideo : function(addID){
        this.newVideo(addID);
        //$("#v-in").removeClass("v-in-animation");
        //$(".v-in-animation").velocity({left: 0}, {duration: 900, easing: [280, 27]});
        //$(".v-out").velocity({left: "-1%"}, {delay: 200, duration: 700, easing: [280, 27]});
        //this.getEByID("remoteVideo").play();
    },
    removeVideo : function(delId){
        $("#v-in"+delId.id).velocity({top:-78,width:-10,height:-10}, 300,function(){
            $("#v-in"+delId.id).remove();
        });
        if (this.playIndex.length <= 1) {

        }else if(this.playIndex.length > 1){
            $("#v-in"+delId.aid).velocity({left:0}, {duration :300 });
            $("#v-in"+delId.bid).velocity({left:0}, {duration :300 });
        }
    },
    //以下为接受流数据的方法，其中方法名末尾带_的为回调方法
    addStream_ : function(event){
        var me = this;
        var v  = event.stream.getVideoTracks();
        var a = event.stream.getAudioTracks();
        me.bindEvent(event.stream,"addtrack",me.addTrack_.bind(me));
        me.bindEvent(event.stream,"removetrack",me.removeTrack_.bind(me));
        me.parseStream(v,a);
        me.newStream();
    },
    removeStream_ : function(event){
        var me = this;
        //先卸载此stream上的事件
        if(event.stream && event.stream.onaddtrack){
            me.removeEvent(event.stream,"addtrack",me.addTrack_.bind(me));
        }
        if(event.stream && event.stream.onremovetrack){
            me.removeEvent(event.stream,"removetrack",me.removeTrack_.bind(me));
        }
        var vt = event.stream.getVideoTracks();
        var at = event.stream.getAudioTracks();
        me.removeStream(vt,at);
        me.newStream();
    },
    addTrack_ : function(event){
        var me = this;
        me.parseTrack(event.track,event.track.kind);
        me.newStream();
    },
    removeTrack_ : function(event){
        var me = this;
        me.removeTrack(event.track,event.track.kind);
        me.newStream();
    },
    removeStream : function(vts,ats){
        var me = this;
        for(var i = 0;i<vts.length;i++){
            me.removeTrack(vts[i],"video");
        }
        for(var j = 0;j<ats.length;j++){
            me.removeTrack(ats[i],"audio");
        }
    },
    removeTrack : function(track,type){
        var me = this;
        if(me.index != me.streams.length){
            return;
        }
        for(var i = 0;i<this.streams.length;i++) {
            if (track.label.split(":")[2] == this.streams[i].bp) {
                if (type && type == "video") {
                    for (var h = 0;h<this.streams.vtracks.length;h++) {
                        if(this.streams.vtracks[h].label.split(":")[1] == track.label.split(":")[1]){
                            this.streams[i].vtracks.splice(h, 1);
                            break;
                        }
                    }
                } else if (type && type == "audio") {
                    for (var j = 0;j<this.streams.atracks.length;j++) {
                        if(this.streams.vtracks[j].label.split(":")[1] == track.label.split(":")[1]){
                            this.streams[i].atracks.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        }
    },
    parseStream : function(vt,at){
        var me = this;
        if((vt && at) && (vt.length>=0 || at.length>=0)){
            for(var i = 0;i<vt.length;i++){
                me.parseTrack(vt[i],"video");
                console.log("【统计流】一共有"+me.streams.length+"路流");
            }
            for(var j = 0;j<at.length;j++) {
                me.parseTrack(at[j],"audio");
                console.log("【统计流】一共有"+me.streams.length+"路流");
            }
        }else{}
    },
    newStream : function(){
        var me = this;
        var c = [];
        if(me.index != me.streams.length){
            console.log("【error】index和streams.length不一致");
            return false;
        }
        for(var f = 0;f<me.index;f++){
            for(var l = 0;l<me.streams[f].vtracks.length;l++){
                if (c.indexOf(me.streams[f].vtracks[l]) == -1){
                    c.push(me.streams[f].vtracks[l]);
                }
            }
            me.streams[f].vtracks = c;
            c.splice(0, c.length);
            for(var g = 0;g<me.streams[f].atracks.length;g++){
                if (c.indexOf(me.streams[f].atracks[g]) == -1){
                    c.push(me.streams[f].atracks[g]);
                }
            }
            me.streams[f].atracks = c;
            c.splice(0, c.length);
            for(var s = 0;s<me.streams[f].label.length;s++){
                if (c.indexOf(me.streams[f].label[s]) == -1){
                    c.push(me.streams[f].label[s]);
                }
            }
            me.streams[f].label = c;
            c.splice(0, c.length);
        }
        for(var q = 0;q<me.streams.length;q++) {
            var varr = me.streams[q].vtracks;
            var aarr = me.streams[q].atracks;
            me.streams[q].stream = [];
            me.streams[q].stream.push(new webkitMediaStream(varr.concat(aarr)));
            console.log("【创建流完整】以下是流信息(完整)：");
            console.log(me.streams);
        }
        me.commander();
    },
    parseTrack : function(track,type){
        console.log("【收集track信息】现在的track是："+track+"，track的类型为："+track.kind+"，track的label为："+track.label);
        var me = this;
        var t = {"bp":"","label":[],"vtracks":[],"atracks":[],"stream":[]};
        if(!track.label.split(":")[2]){
            return false;
        }
        var len = me.streams.length;
        if (len == 0) {
            me.index += 1;
            t.bp = track.label.split(":")[2];
            t.label.push(track.label);
            if(type && type == "video"){
                t.vtracks.push(track);
            }else if(type && type == "audio"){
                t.atracks.push(track);
            }
            me.streams.push(t);
            return true;
        }
        for(var w = 0;w<len;w++) {
            for(var gg = 0;gg<me.streams[w].label.length;gg++){
                if(me.streams[w].label[gg].split(":")[1] == track.label.split(":")[1]){
                    return false;
                }
            }
            if ((me.streams[w].bp == track.label.split(":")[2])) {
                if(type && type == "video"){
                    me.streams[w].label.push(track.label);
                    me.streams[w].vtracks.push(track);
                }else if(type && type == "audio"){
                    me.streams[w].label.push(track.label);
                    me.streams[w].atracks.push(track);
                }
                me.index += 0;
                return true;
            }
        }
        me.index += 1;
        t.bp = track.label.split(":")[2];
        t.label.push(track.label);
        if(type && type == "video"){
            t.vtracks.push(track);
        }else if(type && type == "audio"){
            t.atracks.push(track);
        }
        me.streams.push(t);
        return true;
    },
    //返回dom对象
    getEByID : function(id){
        return document.getElementById(id);
    },
    //返回dom数组
    getEByClass : function(className){
        return document.getElementsByClassName(className)[0];
    },
    //绑定事件
    bindEvent : function(obj,type,func){
        if(obj.attachEvent){
            obj.attachEvent("on"+type,func);
        }else{
            obj.addEventListener(type,func,false);
        }
    },
    //卸载事件
    removeEvent : function(obj,type,func){
        if(obj.detachEvent){
            obj.detachEvent("on"+type,func);
        }else{
            obj.removeEventListener(type,func,false);
        }
    },
    consoleLog : function(){
        console.log("现在有"+this.streams.length+"路流，播放中的有"+this);
    }
});
