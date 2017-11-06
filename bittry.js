var SEC = 1000;
var MIN = SEC * 60;
var HOUR = MIN * 60;
var ICON_BTC = "&#579;";
var ICON_USD = "&#36;";
var ICON_TRY = "&#8378;";
var URL = "http://apilayer.net/api/live?access_key=";
var KEY = "YOUR_ACCESS_KEY"; // Available at https://currencylayer.com/documentation
var existingResult;
var i;

$(document).ready(function () 
{
	i = 1;
	getBtcTry();
});

$(".disab, .enab").click(function() 
{
	$(this).toggleClass("disab enab");

	var a=0,b=0,c=0;
	if($('#btn1').hasClass('enab')) a=1;
	if($('#btn2').hasClass('enab')) b=1;
	if($('#btn3').hasClass('enab')) c=1;

	setPageTitle(a,b,c);
});

function getUsdTry() 
{
	if(i == 1) {
		//console.log("Generate new USD/TRY rate.");
		return $.getJSON(URL + KEY + "&currencies=TRY", function(result) {
			existingResult = result;
		});
	}
	else {
		//console.log("Use existing USD/TRY rate.");
		return $.when(existingResult);
	}
}

function getBtcUsd() 
{
	// Get by using Bitfinex api
	return $.getJSON("https://api.bitfinex.com/v2/ticker/tBTCUSD");
}

function getBtcTry() 
{
	if(i > ((30*MIN)/(10*SEC))) i=1;

	getUsdTry().then(function(result1) {
		var usdTry = parseFloat(result1.quotes.USDTRY).toFixed(3);
		//var clock = getClock();
		//console.log(usdTry + "\t\tUSD/TRY\t\t" + clock);
		$('#info1').html(usdTry);
		return usdTry;
	}).then(function(usdTry) {
		getBtcUsd().then(function(result2) {
			var btcUsd = parseFloat(result2[6]).toFixed(0);
			//var clock = getClock();
			//console.log(btcUsd + "\t\tBTC/USD\t\t" + clock);
			$('#info2').html(btcUsd);
			return { usdTry : usdTry, btcUsd : btcUsd };
		}).then(function(result3) {
			var btcTry = parseFloat(result3.usdTry * result3.btcUsd).toFixed(0);
			//var clock = getClock();
			//console.log(btcTry + "\t\tBTC/TRY\t\t" + clock);
			$('#info3').html(btcTry);

			var a=0,b=0,c=0;
			if($('#btn1').hasClass('enab')) a=1;
			if($('#btn2').hasClass('enab')) b=1;
			if($('#btn3').hasClass('enab')) c=1;
			//console.log("a=" + a + " b=" + b + " c=" + c);

			setPageTitle(a,b,c);
		});
	});

	i++;
	setTimeout(getBtcTry, 5*SEC);
}

function getClock() 
{
		var t = new Date($.now());
		var h = ('0' + t.getHours()).slice(-2);
		var m = ('0' + t.getMinutes()).slice(-2);
		var s = ('0' + t.getSeconds()).slice(-2);
		var clock = h+":"+m+":"+s;
		return clock;
}

function setPageTitle(a,b,c) 
{
	if(a+b+c == 0)
		document.title = "Bittry";

	else {
		var s1 = parseFloat($("#info1").text()).toFixed(2);
		var s2 = $("#info2").text();
		var s3 = $("#info3").text();
		var title = "";

		if(c==1) {
			s1 += " | ";
			s2 += " | ";
		}
		else if(b==1) {
			s1 += " | ";
		}

		if(a == 1) title += s1;
		if(b == 1) title += s2;
		if(c == 1) title += s3;

		document.title = title;
	}
}