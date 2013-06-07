$(function() {
	$("input").focus(function(){
		$(this).prev().css({"background-size":"35%"});
	});
	$("input").focusout(function(){
		$(this).prev().css({"background-size":"30%"});
	});
});