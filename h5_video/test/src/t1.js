var obj = { 

x : 100, 

y : function(){ 

setTimeout( 

function(){ alert(this.x); }

, 2000); 

} 

}; 

obj.y(); 