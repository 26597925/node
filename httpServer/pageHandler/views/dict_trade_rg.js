hideAllPanel();

start_dictTrade_Page();

$("#dict_trade").click(function(){
	$("#dict_trade_panel").show();
});

$("#user_account_submit").click(
	dictTrade_clickHandler
);

$("#user_account_reset").click(
	dictTrade_clickHandler
);

