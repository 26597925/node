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
	init_:function(_containerId)
	{
		var container_ = document.getElementById(_containerId);
		//创建面板
		if(container_)
		{
			//添加css到页面
			var form1_ ="<form class=\"form-inline\">" +
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
			var form2_ = "<form class=\"form-inline\">" +
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
			var porter_=
				[
				 {id:"remoteId",content:"<h4>RelayCoreID：</h4>"}
				 ,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{name:"title",content:"Peer节点列表："}]}]},tbody:{id:"peer"}}}
				 ,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{name:"title",content:"SSRC资源列表："}]}]},tbody:{id:"ssrc"}}}
				 ,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{name:"title",id:"ssrcDetail",content:"资源加载情况"}]}]},tbody:{id:"ssrc_layer"}}}
				 ,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{content:"操作"}]}]},tbody:{tr:[{td:[{content:form1_}]},{td:[{content:form2_}]}]}}}
			             ];
			for(var i=0;i<porter_.length;i++)
			{
				container_.appendChild(this.createModule_(porter_[i]));
			}
		}
	},
	createModule_:function(_params)
	{
		var div_ = document.createElement("div");
		if(_params.hasOwnProperty("name"))
		{
			div_.className = _params.name;
		}
		if(_params.hasOwnProperty("id"))
		{
			div_.setAttribute("id",_params.id);
		}
		if(_params.hasOwnProperty("content"))
		{
			div_.innerHTML = _params.content;
		}
		if(_params.hasOwnProperty("table"))
		{
			var table_,thead_,tr_,th_,tbody_,td_;
			table_ = document.createElement("table");
			if(_params.table.hasOwnProperty("name"))
			{
				table_.className = _params.table.name;
			}
			div_.appendChild(table_);
			if(_params.table.hasOwnProperty("thead"))
			{
				thead_ = document.createElement("thead");
				table_.appendChild(thead_);
				if(_params.table.thead.hasOwnProperty("name"))
				{
					thead_.className = _params.table.thead_.name;
				}
				if(_params.table.thead.hasOwnProperty("id"))
				{
					thead_.setAttribute("id",_params.table.thead_.id);
				}
				if(_params.table.thead.hasOwnProperty("tr"))
				{
					for(var i=0;i<_params.table.thead.tr.length;i++)
					{
						tr_ = document.createElement("tr");
						thead_.appendChild(tr_);
						if(_params.table.thead.tr[i].hasOwnProperty("th"))
						{
							for(var j=0;j<_params.table.thead.tr[i].th.length;j++)
							{
								th_ = document.createElement("th");
								tr_.appendChild(th_);
								if(_params.table.thead.tr[i].th[j].hasOwnProperty("name"))
								{
									th_.className = _params.table.thead.tr[i].th[j].name;
								}
								if(_params.table.thead.tr[i].th[j].hasOwnProperty("id"))
								{
									th_.setAttribute("id",_params.table.thead.tr[i].th[j].id);
								}
								if(_params.table.thead.tr[i].th[j].hasOwnProperty("content"))
								{
									th_.innerHTML = _params.table.thead.tr[i].th[j].content;
								}
							}
						}
					}
				}	
			}
			if(_params.table.hasOwnProperty("tbody"))
			{
				tbody_ = document.createElement("tbody");
				table_.appendChild(tbody_);
				if(_params.table.tbody.hasOwnProperty("name"))
				{
					tbody_.className = _params.table.tbody.name;
				}
				if(_params.table.tbody.hasOwnProperty("id"))
				{
					tbody_.setAttribute("id",_params.table.tbody.id);
				}
				if(_params.table.tbody.hasOwnProperty("tr"))
				{
					for(var i=0;i<_params.table.tbody.tr.length;i++)
					{
						tr_ = document.createElement("tr");
						tbody_.appendChild(tr_);
						if(_params.table.tbody.tr[i].hasOwnProperty("td"))
						{
							for(var j=0;j<_params.table.tbody.tr[i].td.length;j++)
							{
								td_ = document.createElement("td");
								tr_.appendChild(td_);
								if(_params.table.tbody.tr[i].td[j].hasOwnProperty("name"))
								{
									td_.className = _params.table.tbody.tr[i].td[j].name;
								}
								if(_params.table.tbody.tr[i].td[j].hasOwnProperty("id"))
								{
									td_.setAttribute("id",_params.table.tbody.tr[i].td[j].id);
								}
								if(_params.table.tbody.tr[i].td[j].hasOwnProperty("content"))
								{
									td_.innerHTML = _params.table.tbody.tr[i].td[j].content;
								}
							}
						}
					}
				}
				
			}
		}
		return div_;
	},
	broad_:function(_message)
	{
		var type_ = _message.type;
		switch(type_)
		{
		case rc$.com.relayCore.broadcast.Types.TypePeer:
			this.updatePeer_(_message.data);
			break;
		case rc$.com.relayCore.broadcast.Types.TypeChannel:
			this.updataChannel_(_message.data);
			break;
		case rc$.com.relayCore.broadcast.Types.TypeSSRC:
			this.updateSSRC_(_message.data);
			break;
		case rc$.com.relayCore.broadcast.Types.RemoteID:
			var idv_ = document.getElementById("remoteId");
			if(idv_){
				idv_.innerHTML = "<h4>RelayCoreID："+_message.data+"</h4>";
			}
			break;
		default:
			break;
		}
	},
	updatePeer_:function(_params)
	{
		if(!this.peers_)
		{
			this.peers_ = new rc$.com.relayCore.utils.Map();
		}
		var div = document.getElementById("peer");
		if(!div)
		{
			return;
		}
		var key_,peer_;
		switch(_params.type)
		{
		case "add":
			peer_ = _params.peer;
			key_ = peer_.peerId_;
			if(!this.peers_.find(key_))
			{
				this.peers_.set(key_,peer_);
				tr_ = document.createElement("tr");
				tr_.className = "peerItem";
				tr_.setAttribute("id",key_);
				var str_ = "<td><div onclick=\"rc$.com.relayCore.broadcast.BroadCast.showDes_('"+key_+"')\"><span class=\"glyphicon glyphicon-plus\"></span>"+(peer_.fromServer_?"【主动】":"【被动】")+key_+"<span class=\"ng\">（"+peer_.channel_.ng_+"-"+peer_.channel_.negPacket_.ngId_+"）"+"</span></div></td>";
				tr_.innerHTML = str_;
				div.appendChild(tr_);
			}
			break;
		case "remove":
			key_ = _params.id;
			if(this.peers_.find(key_))
			{
				this.peers_.remove(key_);
				var dc_ = document.getElementById(key_);
				div.removeChild(dc_);
			}
			break;
		}
	},
	updateSSRC_:function(_params)
	{
		if(!this.ssrcs_)
		{
			this.ssrcs_ = new rc$.com.relayCore.utils.Map();
		}
		var div_ = document.getElementById("ssrc");
		if(!div_)
		{
			return;
		}
		var key_,ssrc_,str_,tr_;
		switch(_params.type)
		{
		case "add":
			ssrc_ = _params.ssrc;
			key_ = ssrc_.id+":"+ssrc_.level;
			if(!this.ssrcs_.find(key_))
			{
				this.ssrcs_.set(key_,ssrc_);
				tr_ = document.createElement("tr");
				tr_.className = "ssrcItem";
				tr_.setAttribute("id",key_);
				str_ = "<td><div onclick=\"rc$.com.relayCore.broadcast.BroadCast.showChannel_('"+key_+"')\"><span class=\"glyphicon glyphicon-plus\"></span>【"+ssrc_.level+"】"+ssrc_.id+"</div></td>";
				tr_.innerHTML = str_;
				div_.appendChild(tr_);
			}
			break;
		case "remove":
			key_ = _params.id;
			if(this.ssrcs_.find(key_))
			{
				this.ssrcs_.remove(key_);
				var dc_ = document.getElementById(key_);
				div_.removeChild(dc_);
			}
			break;
		}
	},
	showChannel_:function(_id)
	{
		var container_ = document.getElementById(_id);
		if(container_)
		{
			var items_,tmp_,ssrc_,mylayers_,channels_,table_,thead_,tbody_,th_,str_,tr_,td_,layer_,p_,m_,cid_,unsync_,sync_,channel_,id_,status_,key_;
			if(this.selectSSRCId_!=-1)
			{
				//删除上一个
				tmp_ = document.getElementById(this.selectSSRCId_);
				if(tmp_)
				{
					items_ = tmp_.firstChild;
					while(items_.childNodes.length>1)
					{
						items_.removeChild(items_.childNodes[items_.childNodes.length-1]);
					}
				}
			}
			items_ = container_.firstChild;
			while(items_.childNodes.length>1)
			{
				items_.removeChild(items_.childNodes[items_.childNodes.length-1]);
			}
			if(this.selectSSRCId_==_id)
			{
				this.selectSSRCId_ = -1;
				return;
			}
			this.selectSSRCId_=_id;
			ssrc_ = this.ssrcs_.get(_id);
			//显示详细信息
			this.showDetail_();
			mylayers_ = ssrc_.layers_;
			if(!mylayers_)
			{
				return;
			}
			channels_ = ssrc_.ssrcChannel_.dataChannels_;

			for(var i=0;i<mylayers_.length;i++)
			{
				key_ = mylayers_.elements_[i].key;
				layer_ = mylayers_.elements_[i].value;
				cid_ = layer_.channelId_;
				sync_ = layer_.syncChannels_;
				unsync_ = layer_.unsyncChannels_;
				p_ = layer_.cachePacket_.get(80);
				m_ = layer_.cachePacket_.get(77);
				table_ = document.createElement("table");
				table_.className="table table-condensed";
				items_.appendChild(table_);
				thead_ = document.createElement("thead");
				tr_ = document.createElement("tr");
				th_ = document.createElement("th");
				th_.innerHTML = "<span class=\"layer\">层："+key_+"</span>";
				tr_.appendChild(th_);
				thead_.appendChild(tr_);
				table_.appendChild(thead_);
				tbody_ = document.createElement("tbody");
				table_.appendChild(tbody_);
				
				if(sync_.length>0)
				{
					tr_ = document.createElement("tr");
					tr_.className = "danger";
					td_ = document.createElement("td");
					td_.innerHTML = "已同步：";
					tr_.appendChild(td_);
					tbody_.appendChild(tr_);
					
					for(var j=0;j<sync_.length;j++)
					{
						id_ = sync_[j];
						str_="";
						if(!channels_.find(id_))
						{
							P2P_ULOG_WARNING(P2P_ULOG_FMT("com::relayCore::broadcast::BroadCast id({1})不存在了",id_));
							continue;
						}
						channel_ = channels_.get(id_);
						status_ = String.fromCharCode(channel_.syncStatus_);
						if(channel_.label_.indexOf("@VIR")==-1)
						{
							str_="<span>[<span class=\"status-"+status_+"\" id="+id_+"-status>"+status_+"</span>]"+(cid_==id_?"【主】":"【副】")+channel_.label_+"::"+id_+"</span><span id="+id_+"-message></span>";
						}
						else
						{
							str_="<span>[<span class=\"status-"+status_+"\" id="+id_+"-status>"+status_+"</span>]"+(cid_==id_?"【主】":"【副】")+"[虚]"+channel_.label_+"::"+id_+"</span><span id="+id_+"-message></span>";
						}
						tr_ = document.createElement("tr");
						tr_.className = "info";
						td_ = document.createElement("td");
						td_.innerHTML = str_;
						tr_.appendChild(td_);
						tbody_.appendChild(tr_);
					}
				}
				if(unsync_.length>0)
				{
					tr_ = document.createElement("tr");
					tr_.className = "danger";
					td_ = document.createElement("td");
					td_.innerHTML = "需同步：";
					tr_.appendChild(td_);
					tbody_.appendChild(tr_);
					for(var j=0;j<unsync_.length;j++)
					{
						id_ = unsync_[j];
						str_="";
						if(!channels_.find(id_))
						{
							P2P_ULOG_WARNING(P2P_ULOG_FMT("com::relayCore::broadcast::BroadCast id({1})不存在了",id_));
							continue;
						}
						channel_ = channels_.get(id_);
						status_ = String.fromCharCode(channel_.syncStatus_);
						if(channel_.label_.indexOf("@VIR")==-1)
						{
							str_="<span>[<span class=\"status-"+status_+"\" id="+id_+"-status>"+status_+"</span>]"+channel_.label_+"::"+id_+"</span><span id="+id_+"-message></span>";
						}
						else
						{
							str_="<span>[<span class=\"status-"+status_+"\" id="+id_+"-status>"+status_+"</span>][虚]"+channel_.label_+"::"+id_+"</span><span id="+id_+"-message></span>";
						}
						tr_ = document.createElement("tr");
						tr_.className = "warning";
						td_ = document.createElement("td");
						td_.innerHTML = str_;
						tr_.appendChild(td_);
						tbody_.appendChild(tr_);
					}
				}
			}
		}
	},
	showDes_:function(_id)
	{
		var container_ = document.getElementById(_id);
		if(container_)
		{
			var items_,peer_,tmp_,from_,level_,tbody_,str_,table_,tr_,td_,unsyncs_,syncs_;
			if(this.selectPeerId_!=-1)
			{
				//删除上一个
				tmp_ = document.getElementById(this.selectPeerId_);
				if(tmp_)
				{
					items_ = tmp_.firstChild;
					while(items_.childNodes.length>1)
					{
						items_.removeChild(items_.childNodes[items_.childNodes.length-1]);
					}
				}
			}
			items_ = container_.firstChild;
			while(items_.childNodes.length>1)
			{
				items_.removeChild(items_.childNodes[items_.childNodes.length-1]);
			}
			if(this.selectPeerId_==_id)
			{
				this.selectPeerId_=-1;
				return;
			}
			this.selectPeerId_=_id;
			peer_ = this.peers_.get(_id);
			from_ = peer_.fromServer_?0:1;
			unsyncs_ = peer_.channel_.negPacket_.unsynced_;
			syncs_ = peer_.channel_.negPacket_.synced_;
			table_ = document.createElement("table");
			table_.className="table table-condensed";
			items_.appendChild(table_);
			tbody_ = document.createElement("tbody");
			table_.appendChild(tbody_);
			if(syncs_.length>0)
			{
				tr_ = document.createElement("tr");
				tr_.className = "danger";
				td_ = document.createElement("td");
				td_.innerHTML = "同步：";
				tr_.appendChild(td_);
				tbody_.appendChild(tr_);
				for(i=0;i<syncs_.length;i++)
				{
					level_=(from_+syncs_[i].mappedId)%2;
					str_="<span>【"+(level_==0?"已同步":"需同步")+"】"+syncs_[i].id+":"+syncs_[i].mappedId+":"+syncs_[i].spc+"</span>";
					tr_ = document.createElement("tr");
					tr_.className = "info";
					td_ = document.createElement("td");
					td_.innerHTML = str_;
					tr_.appendChild(td_);
					tbody_.appendChild(tr_);
				}
			}
			if(unsyncs_.length>0)
			{
				tr_ = document.createElement("tr");
				tr_.className =  "danger";
				td_ = document.createElement("td");
				td_.innerHTML = "未同步：";
				tr_.appendChild(td_);
				tbody_.appendChild(tr_);
				for(i=0;i<unsyncs_.length;i++)
				{
					level_=(from_+unsyncs_[i].mappedId)%2;
					var str_="<span>【"+(level_==0?"已同步":"需同步")+"】"+unsyncs_[i].id+":"+unsyncs_[i].mappedId+":"+unsyncs_[i].spc+"</span>";
					tr_ = document.createElement("tr");
					tr_.className = "warning";
					td_ = document.createElement("td");
					td_.innerHTML = str_;
					tr_.appendChild(td_);
					tbody_.appendChild(tr_);
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
		//清空内容
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
			//detail
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
			//P
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
//				if((j+1)%64==0&&j!=254)
//				{
//					br_ = document.createElement("br");
//					td_.appendChild(br_);
//				}
			}
		}
	},
	
	updataChannel_:function(_id)
	{
		if(!this.ssrcs_)
		{
			return;
		}
		if(this.selectSSRCId_ == _id)
		{
			this.selectSSRCId_ = -1;
			this.showChannel_(_id);
		}
	},
	channelMessage_:function(_id,_key,_value)
	{
		var item_;
		
		switch(_key)
		{
		case "neg":
			item_ = document.getElementById(_id);
			if(item_)
			{
				item_.firstChild.firstChild.childNodes[2].innerHTML = "（"+_value.ng+"-"+_value.ngseq+"）";
			}
			if(_id==this.selectPeerId_)
			{
				this.selectPeerId_ = -1;
				this.showDes_(_id);
			}
			break;
		case "syncStatus":
			item_ = document.getElementById(_id+"-status");
			if(item_)
			{
				item_.className = "status-"+String.fromCharCode(_value);
				item_.innerHTML = String.fromCharCode(_value);
			}
			break;
		case "send":
			if(_value==75||_value==107)
			{
				break;
			}
			item_ = document.getElementById(_id+"-message");
			if(item_)
			{
				console.log("发送",_value,String.fromCharCode(_value));
				item_.innerHTML = "【发送"+(_value==0?"协商":String.fromCharCode(_value))+"】";
			}
			break;
		case "receive":
			if(_value==75||_value==107)
			{
				break;
			}
			item_ = document.getElementById(_id+"-message");
			if(item_)
			{
				item_.innerHTML = "【接受"+(_value==0?"协商":String.fromCharCode(_value))+"】";
			}
			break;
		case "layer-message":
			item_ = document.getElementById(_id);
			if(item_)
			{
				if(_value.type==80)
				{
					item_.firstChild.innerHTML="P["+_value.success+"/"+_value.total+"]";
				}
				else if(_value.type==77)
				{
					item_.firstChild.innerHTML="M["+_value.success+"/"+_value.total+"]";
				}
				else if(_value.type==85)
				{
					item_.childNodes[1].innerHTML="U["+_value.total+"]";
				}
				else if(_value.type==81)
				{
					item_.childNodes[2].innerHTML="Q["+_value.total+"]";
				}
				else if(_value.type==78)
				{
					item_.childNodes[1].innerHTML="N["+_value.total+"]";
				}
				else if(_value.type==84)
				{
					if(item_.childNodes.length>4)
					{
						item_.childNodes[4].innerHTML="T["+_value.total+"]";
					}
				}
			}
			break;
		case "loss":
			item_ = document.getElementById(_id);
			if(item_)
			{
				item_.childNodes[3].innerHTML="T["+_value.total+"]";
			}
			break;
		case "P":
			var tmpId_ = _id+":p:"+_value.num;
			item_ = document.getElementById(tmpId_);
			if(item_)
			{
				var color_ = this.colors_.normal;
				switch(_value.type)
				{
				case "add":
					color_ = this.colors_.has;
					break;
				case "remove":
					color_ = this.colors_.del;
					break;
				case "insert":
					color_ = this.colors_.insert;
					break;
				}
				item_.style.backgroundColor = color_;
			}
			break;
		}
	},
};
