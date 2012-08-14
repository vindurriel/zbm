var SmoothScroll = function(targetId)
{
	//except ie and ios
	if (
		//WebKitDetect.isMobile() ||
		navigator.userAgent.toLowerCase().indexOf("msie") != -1 ||
		navigator.userAgent.toLowerCase().indexOf("android") != -1 ||
		navigator.userAgent.toLowerCase().indexOf("iphone") != -1 ||
		navigator.userAgent.toLowerCase().indexOf("ipad") != -1 ||
		navigator.userAgent.toLowerCase().indexOf('mac') != -1
	) return;
	
	
	
	var $target = $(targetId);
	var intervalFlag = false;
	var scrollIntervalFlag = false;
	var wheelIntervalFlag = false;
	var scrollId;
	var wheelId;
	var mouseDelta = 0;
	
	
	
	if($("#dummy").length == 0)
	{
		$("body").append('<div id="dummy"></div>');
	}
	$dummy = $("#dummy");

	
	
	
	$target.css({
		"position": "fixed",
		"top": 0
	});
	
	
	
	//------------------------------------
	// resize
	//------------------------------------
	
	var resizeHandler = function()
	{
		$dummy.height(Math.max($target.height(), $(window).height()));
	}
	$(window).resize(resizeHandler);
	resizeHandler();
	
	
	
	//------------------------------------
	// scroll
	//------------------------------------
	
	var scrollHandler = function()
	{
		$target.css("top", -$(window).scrollTop());
	}
	$(window).scroll(scrollHandler);
	scrollHandler();
	
	
	
	//------------------------------------
	// mouse wheel
	//------------------------------------
	
	$(window).mousewheel(function(e, delta)
	{
		e.preventDefault();
		mouseDelta = delta * -40;
		if(!wheelIntervalFlag)
		{
			wheelIntervalFlag = true;
			wheelId = setInterval(wheelIntervalHandler, 1000 / 50);
		}
	});
	
	
	
	var wheelIntervalHandler = function()
	{
		mouseDelta *= 0.85;
		
		if(Math.abs(mouseDelta) < 1)
		{
			clearInterval(wheelId);
			wheelIntervalFlag = false;
			mouseDelta = 1;
		}
		
		$(window).scrollTop($(window).scrollTop() + mouseDelta);
	}
}