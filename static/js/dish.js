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
		$order.css({'margin-left':0})
		$toggle.css({'margin-left':globals.left_offset})
		$wrap.css({'margin-left':globals.left_offset});
	},
	function(){
		$order.css({'margin-left':-globals.left_offset})
		$wrap.css({'margin-left':'auto'});
		$toggle.css({'margin-left':'auto'});
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

	loadOrder();
});


template={
	dish:'.dish-item>a.dish-a[href="javascript:void(0);" dishname="!name!" dishprice="!price!" id="a!rowid!"]>'+
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

function add_order(id,qty)
{
	qty=qty||1;
	if (!id || id=="") return false;
	if($("#l"+id).length>0) {
		var qtySel=$("#s"+id);
		qtySel.val((parseInt(qtySel.val())+qty).toString());
	}
	else{
		$("#order").append(createItem(id,qty));
		var count=$("#order").children().size();
		$("#count").text(count);
	}
	getSum();
}
function createItem(id,qty)
{
	var a=$('#a'+id);
	if(!a.length)	return "";
	var twenty=[];
	for (var i = 1; i <= 20; i++) {
	 	twenty.push(i);
	};
	var dic={
		'price':a.attr('dishprice'),
		'id':id,
		'name':a.attr('dishname'),
		'twenty':twenty,
	};
	var res=$.zen('dl#l!id![price="!price!"]{!name! X}',dic)
		.append($.zen('select#s!id!.qty>!for:twenty!option[value=!value!]{!value!}',dic))
		.append($.zen('input.button.del[type="button" value="删除"]'))
	$(".del" ,res).click(function(){
		var p=this.parentNode;
		p.parentNode.removeChild(p);
		count.innerText=$("#order")[0].children.length;
		getSum();
	});
	$(".qty" ,res).change(function(){
		getSum()
	}).val(qty);
	return res;
}

function getSum()
{
	var sum=0;
	$("#order").children().each(function(){
		var x=$(this);
		sum+=parseFloat(x.attr('price'))*parseInt($(".qty",x).val());
	});
	$("#sum").text(sum);
}
function changeQty(r)
{
	var id=r.id.replace("t","l");
	$("#"+id)[0].children[0].innerText=r.value;
	getSum();
}
function order(){
	var result=[];
	var c=$("#order")[0].children;
	for (var i =0;i<c.length;i++)
	{
		var x=c[i];
		result.push({
			dishid:x.id.substring(1),
			qty:x.children[0].value
		});
	}
	asdf=result;
	$.post('/order',{'order':JSON.stringify(result)},function(r){
		$.growlUI('',r);
	});
}
function loadOrder()
{
	$('.dish-a').click(function(){
		add_order(this.id.substring(1));
	});
	var url="/order"
	$.get(url,function(r){
		if(r.indexOf('error')==0){
			$.growlUI('ERROR',r);
			return;
		}
		var orders=eval('(' + r + ')');
		for (var i = 0,len=orders.length; i < len; i++) {
			var x=orders[i];
			add_order(x.dishid,parseInt(x.qty));
		};
	});
}