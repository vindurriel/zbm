globals={
	waypoint_options:{'offset':'100%'},
};
$(document).ready(function() {
	$win=$(window)
	$wrap=$("#wrapper")
	$menu=$("#div_menu")
	$order=$("#div_order")
	$toggle=$(".toggle")
	$("#toTop").hide();
	$win.scroll(function(){
		if($win.scrollTop()>100)
			$("#toTop").fadeIn();
		else
			$("#toTop").fadeOut();
	});

	globals.left_offset=$order.outerWidth()-$toggle.outerWidth();
	$order.css({'margin-left':-globals.left_offset});
	$menu.css({'margin-left':$('#order-toggle').outerWidth()});
	$order.hover(function(){
		if(this.flag===undefined || this.flag===false){
			$order.css({'margin-left':0})
			$toggle.css({'margin-left':globals.left_offset})
			$wrap.css({'margin-left':globals.left_offset});
			this.flag=true;
		}else{
			$order.css({'margin-left':-globals.left_offset})
			$wrap.css({'margin-left':'auto'});
			$toggle.css({'margin-left':'auto'});
			this.flag=false;
		}
	},
	function(){
		if(this.flag===undefined || this.flag===false){
			$order.css({'margin-left':0})
			$toggle.css({'margin-left':globals.left_offset})
			$wrap.css({'margin-left':globals.left_offset});
			this.flag=true;
		}else{
			$order.css({'margin-left':-globals.left_offset})
			$wrap.css({'margin-left':'auto'});
			$toggle.css({'margin-left':'auto'});
			this.flag=false;
		}
	})

	$win.resize(function(){
		var offset=-$("#div_order").outerWidth()+$("#order-toggle").outerWidth();
		$("#div_order").css({'margin-left':offset});
	})
	$.fn.masonry.isLoaded=false;

	showMenu();
	
	$("img").hide().load(function(){
		$(this).fadeIn('slow');
	});
	$('#more').waypoint(function(){loadMore();},globals.waypoint_options)
	.click(function(){loadMore();})
});


template={
	dish:'.dish-item>a.dish-a[href="javascript:void(0);" dishname="!name!" onclick="add_order(this)" tag="!price!" id="a!rowid!"]>'+
		'img.dish-pic[src="!imgpath!"]+p{!name!}+p{!price! 元}'+
		'+span.overlay[style="display:none"]'+
		'',
};
function showItem(items,container){
	container=container||'#tabcontent0';
	var len=items.length;
	var actualLen=0;
	for (var i = 0; i < len; i++, actualLen++) {
		var d=items[i];
		var dic={
			name:d.name,
			zid:d.zid,
			type:d.type,
			price:d.price,
			rowid:d.rowid,
			imgpath:d.imgsrc
		};
		var newEl=$.zen(template.dish,dic).css('padding-bottom',Math.random()*100);
		$(container).append(newEl);
		// $("last-child",container);
	}
	if(!actualLen)
	{
		$("#more").hide();
		return;
	}
	$(container).imagesLoaded(function(){
		if($.fn.masonry.isLoaded) {
			$(this).masonry('appended',$('.dish-item',$(this)).slice(-actualLen),true);
		} else {
			$(this).masonry({isAnimated:false});
			$.fn.masonry.isLoaded=true;
		}
		$('.overlay',container).show();
		$("#more").waypoint(globals.waypoint_options);
	});
}
function loadMore(len){
	len=len||15;
	$("#more").waypoint('remove');
	var items=new Array();
	for (var i = 0; i < len; i++) {
		if(!dishes.length)
			break;
		var d=dishes.shift();
		if(d.vendor!==1) continue;
		items.push(d);
	}
	showItem(items);
}
function showMenu(){
	for (var i = 0,len=vendors.length; i < len; i++) {
		var v=vendors[i];
		$(".Menubox").append($.zen('li.tab-header#tab!i!{!text!}',{'i':i,'text':v}));
		$("#contents").append($.zen('div.tab-content#tabcontent!i!',{'i':i}));
	};
}