rc$.ns("com.relayCore.broadcast");
rc$.com.relayCore.broadcast.Types = {
TypePeer:1,
TypeChannel:2,
TypeSSRC:3,
RemoteID:4
};
rc$.com.relayCore.broadcast.BroadCast = {
selectPeerId_:-1,
selectSSRCId_:-1,
peers_:null,
ssrcs_:null,
colors_:{
normal:"#eeeeee",
has:"#9A0316",
del:"#cccccc",
insert:"#67000D",
},
init_:function(_a)
{
var b_ = document.getElementById(_a);
if(b_)
{
var b1_ ="<form class=\"form-inline\">" +
"<div class=\"form-group\">" +
"<select type=\"select\" class=\"form-control\" id=\"serve-type\">" +
"<option>sourcing</option>" +
"<option>serving</option>" +
"</select>" +
"<input type=\"text\" class=\"form-control\" id=\"serving\" placeholder=\"输入SSRC\">" +
"<button type=\"button\" class=\"btn btn-info input-group-addon\" onclick=\"openServing()\">open</button>" +
"<button type=\"button\" class=\"btn btn-info\" onclick=\"stopServing()\">stop</button>" +
"</div>" +
"</form>";
var b2_ = "<form class=\"form-inline\">" +
"<div class=\"form-group\">" +
"<select type=\"select\" class=\"form-control\" id=\"message-type\">" +
"<option>80</option>" +
"<option>77</option>" +
"</select>" +
"<input type=\"text\" class=\"form-control\" id=\"ssrcId\" placeholder=\"SSRCID\">" +
"<input type=\"text\" class=\"form-control\" id=\"message\" placeholder=\"消息内容\">" +
"<button type=\"button\" class=\"btn btn-info\" onclick=\"sending()\">send</button>" +
"</div>" +
"</form>";
var b3_=
[
{id:"remoteId",content:"<h4>RelayCoreID：</h4>"}
,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{name:"title",content:"Peer节点列表："}]}]},tbody:{id:"peer"}}}
,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{name:"title",content:"SSRC资源列表："}]}]},tbody:{id:"ssrc"}}}
,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{name:"title",id:"ssrcDetail",content:"资源加载情况"}]}]},tbody:{id:"ssrc_layer"}}}
,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{content:"操作"}]}]},tbody:{tr:[{td:[{content:b1_}]},{td:[{content:b2_}]}]}}}
];
for(var i=0;i<b3_.length;i++)
{
b_.appendChild(this.createModule_(b3_[i]));
}
}
},
createModule_:function(_a)
{
var b_ = document.createElement("div");
if(_a.hasOwnProperty("name"))
{
b_.className = _a.name;
}
if(_a.hasOwnProperty("id"))
{
b_.setAttribute("id",_a.id);
}
if(_a.hasOwnProperty("content"))
{
b_.innerHTML = _a.content;
}
if(_a.hasOwnProperty("table"))
{
var b1_,b2_,b3_,b4_,b5_,b6_;
b1_ = document.createElement("table");
if(_a.table.hasOwnProperty("name"))
{
b1_.className = _a.table.name;
}
b_.appendChild(b1_);
if(_a.table.hasOwnProperty("thead"))
{
b2_ = document.createElement("thead");
b1_.appendChild(b2_);
if(_a.table.thead.hasOwnProperty("name"))
{
b2_.className = _a.table.b2_.name;
}
if(_a.table.thead.hasOwnProperty("id"))
{
b2_.setAttribute("id",_a.table.b2_.id);
}
if(_a.table.thead.hasOwnProperty("tr"))
{
for(var i=0;i<_a.table.thead.tr.length;i++)
{
b3_ = document.createElement("tr");
b2_.appendChild(b3_);
if(_a.table.thead.tr[i].hasOwnProperty("th"))
{
for(var j=0;j<_a.table.thead.tr[i].th.length;j++)
{
b4_ = document.createElement("th");
b3_.appendChild(b4_);
if(_a.table.thead.tr[i].th[j].hasOwnProperty("name"))
{
b4_.className = _a.table.thead.tr[i].th[j].name;
}
if(_a.table.thead.tr[i].th[j].hasOwnProperty("id"))
{
b4_.setAttribute("id",_a.table.thead.tr[i].th[j].id);
}
if(_a.table.thead.tr[i].th[j].hasOwnProperty("content"))
{
b4_.innerHTML = _a.table.thead.tr[i].th[j].content;
}
}
}
}
}
}
if(_a.table.hasOwnProperty("tbody"))
{
b5_ = document.createElement("tbody");
b1_.appendChild(b5_);
if(_a.table.tbody.hasOwnProperty("name"))
{
b5_.className = _a.table.tbody.name;
}
if(_a.table.tbody.hasOwnProperty("id"))
{
b5_.setAttribute("id",_a.table.tbody.id);
}
if(_a.table.tbody.hasOwnProperty("tr"))
{
for(var i=0;i<_a.table.tbody.tr.length;i++)
{
b3_ = document.createElement("tr");
b5_.appendChild(b3_);
if(_a.table.tbody.tr[i].hasOwnProperty("td"))
{
for(var j=0;j<_a.table.tbody.tr[i].td.length;j++)
{
b6_ = document.createElement("td");
b3_.appendChild(b6_);
if(_a.table.tbody.tr[i].td[j].hasOwnProperty("name"))
{
b6_.className = _a.table.tbody.tr[i].td[j].name;
}
if(_a.table.tbody.tr[i].td[j].hasOwnProperty("id"))
{
b6_.setAttribute("id",_a.table.tbody.tr[i].td[j].id);
}
if(_a.table.tbody.tr[i].td[j].hasOwnProperty("content"))
{
b6_.innerHTML = _a.table.tbody.tr[i].td[j].content;
}
}
}
}
}

}
}
return b_;
},
broad_:function(_a)
{
var b_ = _a.type;
switch(b_)
{
case rc$.com.relayCore.broadcast.Types.TypePeer:
this.updatePeer_(_a.data);
break;
case rc$.com.relayCore.broadcast.Types.TypeChannel:
this.updataChannel_(_a.data);
break;
case rc$.com.relayCore.broadcast.Types.TypeSSRC:
this.updateSSRC_(_a.data);
break;
case rc$.com.relayCore.broadcast.Types.RemoteID:
var b1_ = document.getElementById("remoteId");
if(b1_){
b1_.innerHTML = "<h4>RelayCoreID："+_a.data+"</h4>";
}
break;
default:
break;
}
},
updatePeer_:function(_a)
{
if(!this.peers_)
{
this.peers_ = new rc$.com.relayCore.utils.Map();
}
var b_ = document.getElementById("peer");
if(!b_)
{
return;
}
var b1_,b2_;
switch(_a.type)
{
case "add":
b2_ = _a.peer;
b1_ = b2_.peerId_;
if(!this.peers_.find(b1_))
{
this.peers_.set(b1_,b2_);
tr_ = document.createElement("tr");
tr_.className = "peerItem";
tr_.setAttribute("id",b1_);
var b3_ = "<td><b_ onclick=\"rc$.com.relayCore.broadcast.BroadCast.showDes_('"+b1_+"')\"><span class=\"glyphicon glyphicon-plus\"></span>"+(b2_.fromServer_?"【主动】":"【被动】")+b1_+"<span class=\"ng\">（"+b2_.channel_.ng_+"-"+b2_.channel_.negPacket_.ngId_+"）"+"</span></b_></td>";
tr_.innerHTML = b3_;
b_.appendChild(tr_);
}
break;
case "remove":
b1_ = _a.id;
if(this.peers_.find(b1_))
{
this.peers_.remove(b1_);
var b4_ = document.getElementById(b1_);
b_.removeChild(b4_);
}
break;
}
},
updateSSRC_:function(_a)
{
if(!this.ssrcs_)
{
this.ssrcs_ = new rc$.com.relayCore.utils.Map();
}
var b_ = document.getElementById("ssrc");
if(!b_)
{
return;
}
var b1_,b2_,b3_,b4_;
switch(_a.type)
{
case "add":
b2_ = _a.ssrc;
b1_ = b2_.id+":"+b2_.level;
if(!this.ssrcs_.find(b1_))
{
this.ssrcs_.set(b1_,b2_);
b4_ = document.createElement("tr");
b4_.className = "ssrcItem";
b4_.setAttribute("id",b1_);
b3_ = "<td><div onclick=\"rc$.com.relayCore.broadcast.BroadCast.showChannel_('"+b1_+"')\"><span class=\"glyphicon glyphicon-plus\"></span>【"+b2_.level+"】"+b2_.id+"</div></td>";
b4_.innerHTML = b3_;
b_.appendChild(b4_);
}
break;
case "remove":
b1_ = _a.id;
if(this.ssrcs_.find(b1_))
{
this.ssrcs_.remove(b1_);
var b5_ = document.getElementById(b1_);
div.removeChild(b5_);
}
break;
}
},
showChannel_:function(_a)
{
var b_ = document.getElementById(_a);
if(b_)
{
var b1_,b2_,b3_,b4_,b5_,b6_,b7_,b8_,b9_,b10_,b11_,b12_,b13_,b14_,b15_,b16_,b17_,b18_,b19_,b20_,b21_,b22_;
if(this.selectSSRCId_!=-1)
{
b2_ = document.getElementById(this.selectSSRCId_);
if(b2_)
{
b1_ = b2_.firstChild;
while(b1_.childNodes.length>1)
{
b1_.removeChild(b1_.childNodes[b1_.childNodes.length-1]);
}
}
}
b1_ = b_.firstChild;
while(b1_.childNodes.length>1)
{
b1_.removeChild(b1_.childNodes[b1_.childNodes.length-1]);
}
if(this.selectSSRCId_==_a)
{
this.selectSSRCId_ = -1;
return;
}
this.selectSSRCId_=_a;
b3_ = this.ssrcs_.get(_a);
this.showDetail_();
b4_ = b3_.layers_;
if(!b4_)
{
return;
}
b5_ = b3_.ssrcChannel_.dataChannels_;

for(var i=0;i<b4_.length;i++)
{
b22_ = b4_.elements_[i].key;
b13_ = b4_.elements_[i].value;
b16_ = b13_.channelId_;
b18_ = b13_.syncChannels_;
b17_ = b13_.unsyncChannels_;
b14_ = b13_.cachePacket_.get(80);
b15_ = b13_.cachePacket_.get(77);
b6_ = document.createElement("table");
b6_.className="table table-condensed";
b1_.appendChild(b6_);
b7_ = document.createElement("thead");
b11_ = document.createElement("tr");
b9_ = document.createElement("th");
b9_.innerHTML = "<span class=\"layer\">层："+b22_+"</span>";
b11_.appendChild(b9_);
b7_.appendChild(b11_);
b6_.appendChild(b7_);
b8_ = document.createElement("tbody");
b6_.appendChild(b8_);

if(b18_.length>0)
{
b11_ = document.createElement("tr");
b11_.className = "danger";
b12_ = document.createElement("td");
b12_.innerHTML = "已同步：";
b11_.appendChild(b12_);
b8_.appendChild(b11_);

for(var j=0;j<b18_.length;j++)
{
b20_ = b18_[j];
b10_="";
if(!b5_.find(b20_))
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("com::relayCore::broadcast::BroadCast id({1})不存在了",b20_));
continue;
}
b19_ = b5_.get(b20_);
b21_ = String.fromCharCode(b19_.syncStatus_);
if(b19_.label_.indexOf("@VIR")==-1)
{
b10_="<span>[<span class=\"status-"+b21_+"\" id="+b20_+"-status>"+b21_+"</span>]"+(b16_==b20_?"【主】":"【副】")+b19_.label_+"::"+b20_+"</span><span id="+b20_+"-message></span>";
}
else
{
b10_="<span>[<span class=\"status-"+b21_+"\" id="+b20_+"-status>"+b21_+"</span>]"+(b16_==b20_?"【主】":"【副】")+"[虚]"+b19_.label_+"::"+b20_+"</span><span id="+b20_+"-message></span>";
}
b11_ = document.createElement("tr");
b11_.className = "info";
b12_ = document.createElement("td");
b12_.innerHTML = b10_;
b11_.appendChild(b12_);
b8_.appendChild(b11_);
}
}
if(b17_.length>0)
{
b11_ = document.createElement("tr");
b11_.className = "danger";
b12_ = document.createElement("td");
b12_.innerHTML = "需同步：";
b11_.appendChild(b12_);
b8_.appendChild(b11_);
for(var j=0;j<b17_.length;j++)
{
b20_ = b17_[j];
b10_="";
if(!b5_.find(b20_))
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("com::relayCore::broadcast::BroadCast id({1})不存在了",b20_));
continue;
}
b19_ = b5_.get(b20_);
b21_ = String.fromCharCode(b19_.syncStatus_);
if(b19_.label_.indexOf("@VIR")==-1)
{
b10_="<span>[<span class=\"status-"+b21_+"\" id="+b20_+"-status>"+b21_+"</span>]"+b19_.label_+"::"+b20_+"</span><span id="+b20_+"-message></span>";
}
else
{
b10_="<span>[<span class=\"status-"+b21_+"\" id="+b20_+"-status>"+b21_+"</span>][虚]"+b19_.label_+"::"+b20_+"</span><span id="+b20_+"-message></span>";
}
b11_ = document.createElement("tr");
b11_.className = "warning";
b12_ = document.createElement("td");
b12_.innerHTML = b10_;
b11_.appendChild(b12_);
b8_.appendChild(b11_);
}
}
}
}
},
showDes_:function(_a)
{
var b_ = document.getElementById(_a);
if(b_)
{
var b1_,b2_,b3_,b4_,b5_,b6_,b7_,b8_,b9_,b10_,b11_,b12_;
if(this.selectPeerId_!=-1)
{
b3_ = document.getElementById(this.selectPeerId_);
if(b3_)
{
b1_ = b3_.firstChild;
while(b1_.childNodes.length>1)
{
b1_.removeChild(b1_.childNodes[b1_.childNodes.length-1]);
}
}
}
b1_ = b_.firstChild;
while(b1_.childNodes.length>1)
{
b1_.removeChild(b1_.childNodes[b1_.childNodes.length-1]);
}
if(this.selectPeerId_==_a)
{
this.selectPeerId_=-1;
return;
}
this.selectPeerId_=_a;
b2_ = this.peers_.get(_a);
b4_ = b2_.fromServer_?0:1;
b11_ = b2_.channel_.negPacket_.unsynced_;
b12_ = b2_.channel_.negPacket_.synced_;
b8_ = document.createElement("table");
b8_.className="table table-condensed";
b1_.appendChild(b8_);
b6_ = document.createElement("tbody");
b8_.appendChild(b6_);
if(b12_.length>0)
{
b9_ = document.createElement("tr");
b9_.className = "danger";
b10_ = document.createElement("td");
b10_.innerHTML = "同步：";
b9_.appendChild(b10_);
b6_.appendChild(b9_);
for(i=0;i<b12_.length;i++)
{
b5_=(b4_+b12_[i].mappedId)%2;
b7_="<span>【"+(b5_==0?"已同步":"需同步")+"】"+b12_[i].id+":"+b12_[i].mappedId+":"+b12_[i].spc+"</span>";
b9_ = document.createElement("tr");
b9_.className = "info";
b10_ = document.createElement("td");
b10_.innerHTML = b7_;
b9_.appendChild(b10_);
b6_.appendChild(b9_);
}
}
if(b11_.length>0)
{
b9_ = document.createElement("tr");
b9_.className =  "danger";
b10_ = document.createElement("td");
b10_.innerHTML = "未同步：";
b9_.appendChild(b10_);
b6_.appendChild(b9_);
for(i=0;i<b11_.length;i++)
{
b5_=(b4_+b11_[i].mappedId)%2;
var b7_="<span>【"+(b5_==0?"已同步":"需同步")+"】"+b11_[i].id+":"+b11_[i].mappedId+":"+b11_[i].spc+"</span>";
b9_ = document.createElement("tr");
b9_.className = "warning";
b10_ = document.createElement("td");
b10_.innerHTML = b7_;
b9_.appendChild(b10_);
b6_.appendChild(b9_);
}
}
}
},
showDetail_:function()
{
var container_ = document.getElementById("ssrc_layer");
var sid_ = container_.getAttribute("sid");
if(sid_ == this.selectSSRCId_)
{
return;
}
var title_ = document.getElementById("ssrcDetail");
if(title_)
{
title_.innerHTML="资源："+this.selectSSRCId_;
}
container_.setAttribute("sid",this.selectSSRCId_);
while(container_.childNodes.length>0)
{
container_.removeChild(container_.firstChild);
}
var ssrc_ = this.ssrcs_.get(this.selectSSRCId_);
var layers_ = ssrc_.layers_;
var item_,table_,thead_,tbody_,th_,tr_,td_,layer_,key_,p_,m_,span_,br_,color_;
tr_ = document.createElement("tr");
td_ = document.createElement("td");
tr_.appendChild(td_);
container_.appendChild(tr_);
item_ = td_;

for(var i=0;i<layers_.length;i++)
{
key_ = layers_.elements_[i].key;
layer_ = layers_.elements_[i].value;
p_ = layer_.cachePacket_.get(80);
m_ = layer_.cachePacket_.get(77);
u_ = layer_.cachePacket_.get(85);
n_ = layer_.cachePacket_.get(78);
t_ = layer_.cachePacket_.get(84);
q_ = layer_.cachePacket_.get(81);
table_ = document.createElement("table");
table_.className="table table-condensed";
item_.appendChild(table_);
thead_ = document.createElement("thead");
tr_ = document.createElement("tr");
th_ = document.createElement("th");
th_.innerHTML = "<span class=\"layer\">层："+key_+"</span>";
tr_.appendChild(th_);
thead_.appendChild(tr_);
table_.appendChild(thead_);
tbody_ = document.createElement("tbody");
table_.appendChild(tbody_);
tr_ = document.createElement("tr");
tbody_.appendChild(tr_);
td_ = document.createElement("td");
td_.innerHTML="<span id=\""+this.selectSSRCId_+":"+key_+"\"><span>P["+(p_?p_.successTotal_:0)+"/"+(p_?p_.total_:0)+"]</span><span>N["+(n_?n_.total_:0)+"]</span><span>Q["+(q_?q_.total_:0)+"]</span><span>L["+layer_.loss_+"]</span><span>T["+(t_?t_.total_:0)+"]</span></span>";
tr_.appendChild(td_);
if(key_==0)
{
td_.innerHTML="<span id=\""+this.selectSSRCId_+":"+key_+"\"><span>M["+(m_?m_.successTotal_:0)+"/"+(m_?m_.successTotal_:0)+"]</span><span>U["+(u_?u_.total_:0)+"]</span><span>Q["+(q_?q_.total_:0)+"]</span><span>L["+layer_.loss_+"]</span></span>";
continue;
}
tr_ = document.createElement("tr");
tbody_.appendChild(tr_);
td_ = document.createElement("td");
tr_.appendChild(td_);
for(var j=0;j<256;j++)
{
span_ = document.createElement("span");
span_.className="p-units";
span_.setAttribute("id",this.selectSSRCId_+":"+key_+":p:"+j);
span_.setAttribute("title",j);
color_ = this.colors_.normal;
if(p_&&p_.data&&p_.data.get(j))
{
color_ = this.colors_.has;
}
span_.style.backgroundColor=color_;
td_.appendChild(span_);
}
}
},

updataChannel_:function(_a)
{
if(!this.ssrcs_)
{
return;
}
if(this.selectSSRCId_ == _a)
{
this.selectSSRCId_ = -1;
this.showChannel_(_a);
}
},
channelMessage_:function(_a,_a1,_a2)
{
var b_;

switch(_a1)
{
case "neg":
b_ = document.getElementById(_a);
if(b_)
{
b_.firstChild.firstChild.childNodes[2].innerHTML = "（"+_a2.ng+"-"+_a2.ngseq+"）";
}
if(_a==this.selectPeerId_)
{
this.selectPeerId_ = -1;
this.showDes_(_a);
}
break;
case "syncStatus":
b_ = document.getElementById(_a+"-status");
if(b_)
{
b_.className = "status-"+String.fromCharCode(_a2);
b_.innerHTML = String.fromCharCode(_a2);
}
break;
case "send":
if(_a2==75||_a2==107)
{
break;
}
b_ = document.getElementById(_a+"-message");
if(b_)
{
b_.innerHTML = "【发送"+(_a2==0?"协商":String.fromCharCode(_a2))+"】";
}
break;
case "receive":
if(_a2==75||_a2==107)
{
break;
}
b_ = document.getElementById(_a+"-message");
if(b_)
{
b_.innerHTML = "【接受"+(_a2==0?"协商":String.fromCharCode(_a2))+"】";
}
break;
case "layer-message":
b_ = document.getElementById(_a);
if(b_)
{
if(_a2.type==80)
{
b_.firstChild.innerHTML="P["+_a2.success+"/"+_a2.total+"]";
}
else if(_a2.type==77)
{
b_.firstChild.innerHTML="M["+_a2.success+"/"+_a2.total+"]";
}
else if(_a2.type==85)
{
b_.childNodes[1].innerHTML="U["+_a2.total+"]";
}
else if(_a2.type==81)
{
b_.childNodes[2].innerHTML="Q["+_a2.total+"]";
}
else if(_a2.type==78)
{
b_.childNodes[1].innerHTML="N["+_a2.total+"]";
}
else if(_a2.type==84)
{
b_.childNodes[4].innerHTML="T["+_a2.total+"]";
}
}
break;
case "loss":
b_ = document.getElementById(_a);
if(b_)
{
b_.childNodes[3].innerHTML="T["+_a2.total+"]";
}
break;
case "P":
var b1_ = _a+":p:"+_a2.num;
b_ = document.getElementById(b1_);
if(b_)
{
var b2_ = this.colors_.normal;
switch(_a2.type)
{
case "add":
b2_ = this.colors_.has;
break;
case "remove":
b2_ = this.colors_.del;
break;
case "insert":
b2_ = this.colors_.insert;
break;
}
b_.style.backgroundColor = b2_;
}
break;
}
},
};
