window.JSON = window.JSON || {};
window.URL = (window.URL || window.webkitURL || window.msURL || window.oURL);
window.RTCPeerConnection = (window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
window.RTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);
window.RTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription); // order is very important: "RTCSessionDescription" defined in Nighly but useless
window.ByteArray = function($_uInt8Array)
{

	this.length			= 0;
	this._position		= 0;
	this.uInt8Array	= new Uint8Array();
	if($_uInt8Array ){
		this.uInt8Array	= new Uint8Array($_uInt8Array);
	}
	this.writeBytes = function(bytes)
	{
			var tempByteArray = null;
			if(this.uInt8Array)
			{
				tempByteArray = new Uint8Array(this.uInt8Array.length+bytes.length);
				tempByteArray.set(this.uInt8Array,0);
				tempByteArray.set(bytes,this.uInt8Array.length);
			}else
			{
				tempByteArray = bytes;
			}
			this.uInt8Array = tempByteArray;
	};
	this.setBytes = function(int8)
	{
		this.position = 0;
		this.uInt8Array = int8;
	};
	
	this.readBytes = function(bytes, offset, length)
	{
		offset = offset || 0;
		length = length || this.uInt8Array.length;
		if(length===0)
		{
			length = this.uInt8Array.length;
		}
		if( (offset === 0 || (offset>0 && offset<bytes.uInt8Array.length ))&& 
			length>0 && 
			(this.position+length)<=this.uInt8Array.length)
		{
			var tempBytes0 = new Uint8Array(offset);
			tempBytes0 = bytes.uInt8Array.subarray(0, offset);
			
			var tempBytes1 = new Uint8Array(tempBytes0.length+length);
			var tempBytes2 = new Uint8Array(length);
			
			tempBytes2 = this.uInt8Array.subarray(this.position, length);			
			
			tempBytes1.set(tempBytes0);
			tempBytes1.set(tempBytes2,tempBytes0.length);
			bytes.uInt8Array = new Uint8Array(tempBytes1);
		}
		else
		{
			console.log("readBytes error");
		}
		
	};
	this.generationByteArray=function(int8)
	{
		this.position = 0;
		this.uInt8Array = int8;
	};
	
	this.clear = function()
	{
		this.position = 0;
		this.uInt8Array = new Uint8Array();
	};
	
	this.__defineGetter__("position", function(){
     return  this._position;
   });

   this.__defineSetter__("position", function(value){
	   this._position = value;
   });
   this.__defineGetter__("length", function(){
	   return this.uInt8Array.length;
   });
   this.__defineGetter__("bytesAvailable", function(){
	   return this.length-this._position;
   });

   this.__defineGetter__("ByteArray", function(){
	   return this.uInt8Array;
   });

};

JSON.stringify = JSON.stringify || function( obj )
{
	var t = typeof(obj);
	if( t != "object" || obj === null )
	{
		// simple data type
		if( t == "string" ) obj = '"' + obj + '"';
		return String(obj);
	}
	else
	{
		// recurse array or object
		var n, v, json = [], arr = (obj && obj.constructor == Array);
		for( n in obj )
		{
			v = obj[n];
			t = typeof(v);
			if( t == "string" ) v = '"' + v + '"';
			else if( t == "object" && v !== null ) v = JSON.stringify(v);
			json.push((arr ? "" : '"' + n + '":') + String(v));
		}
		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
};
