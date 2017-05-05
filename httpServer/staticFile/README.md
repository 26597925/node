# web server
<pre>
http://legacy.datatables.net/usage/columns
https://datatables.net/release-datatables/examples/ajax/null_data_source.html

show create table tableName;
show create table node_distri_dl_other;

SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'database_name'
AND table_name = 'table_name' ;

$('.checkbox').click(function() {
  if ($(this).is(':checked')) {
    // Do stuff
  }
});


<p>
label

<label style="color: red; font-size: 80%;">(*注：只有选择了账户才能选择交易策略)</label>
</p>

<p>
input
$('<input></input>',{type:"button",id:"user_account_add",name:"",value:"新增"}).appendTo(td);
$('<input type="button" id="user_account_add" name="" value="新增">')
$(
    '<input type="button" value="删除" ' +
    'onclick="handler('+
        param1+','+
        param2+', '+
        param3+
    ')"; ></input>'
)
$("some selector").click({param1: "Hello", param2: "World"}, cool_function);

// in your function, just grab the event object and go crazy...
function cool_function(event){
    alert(event.data.param1);
    alert(event.data.param2);
}
</p>

<p>
css
var input = $( "form input:radio" )
    .wrap( "<span></span>" )
    .parent()
    .css({
        background: "yellow",
        border: "3px red solid"
    });

$( "div" )
    .text( "my text" )
    .css( "color", "red" );
</p>

<p>
click
$("#policy").click(this.nvgPolicyClick)


disabled
div.prop("disabled", true );
div.prop('disabled', false);
</p>

<p>
select
set:$("#select").val(-1);
get:$("#select").val();
var select = $('<select></select>',{
    id:'id',
    name:"name"
});

select.append(
    "<option  value='-1'>请选择</option>"
);

select.change(function() {
     var name = $("#order_select1 option:selected").text();
     console.log("name",this.value,name);
});

select.click(handler_select);
// console.log(">>>>>>>>>>",this.value,$(this).find("option:selected").text() );
var handler_select = function(){
    var obj = $("#order_select2 option:selected");
    var name = obj.text();
    var key_value = obj.val();
}

//.append($('<input type="text" id="policy_stopDate" class="datepicker"></input>'));
// $("#policy_stopDate").datepicker();
// if(oojs$.matchYMD(item[this.policy_list_head[i][0]],2)){
// 	$("#policy_stopDate").datepicker('setDate',new Date(item[this.policy_list_head[i][0]]));
// }else{
//     $("#policy_stopDate").datepicker('setDate',new Date());
// }
// $("#policy_stopDate").text($("#policy_stopDate").datepicker('getDate'));
</p>
</pre>


