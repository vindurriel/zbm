props="name price type unit vendor zid".split(' ');
$(document).ready(function() {
	$().UItoTop({'text':'返回顶端', easingType: 'easeOutQuart','min':100 });
	$('.confirm-edit').click(confirmEdit);
	$.get("dish.py",function(data){showDishes(data)});
});
function edit()
{
	var id=$(this).closest(".dish-item").attr('id');
	curItem=dishes[id];
	showItem(curItem);
}
function confirmEdit()
{
	if(!curItem)return;
	var x=curItem;
	var data={'id':curItem.rowid};
	for (var i = 0; i < props.length; i++) {
		var val=$("#edit-"+props[i]).val();
		data[props[i]]=val;
	};
	$.post("dish.py",data,function(d){
		if(d.indexOf('error')==0){
			$('#msg').text(d);
			return;
		}
		for (var i = 0; i < props.length; i++) {
			var val=data[props[i]];
			$("#"+data.id+" .prop-"+props[i]).text(val);
		}
		$.growlUI('已更新'); 
	});
	curItem=null;
}
curItem=null;
change={}
function showItem(x){
	var table=$("#table-edit");
	table.empty();
	for (var j = 0; j <props.length; j++) {
		var key=props[j];
		var val=x[key];
		table.append(showAttr(key,val));
	}
	
	$.blockUI({
		message:$("#div-edit"),
		css:{
				border: 'none',
				width:'100%',
				left:'0px',
				padding: '15px', 
				backgroundColor: '#fff', 
				'-webkit-border-radius': '5px', 
				'-moz-border-radius': '10px', 
				opacity: .8, 
		}
	});
	$('.blockOverlay').click($.unblockUI); 
}
dishes={};
dd=null;
function showDishes(data){
	data=data.replace(/None/g,'null')
	dd=eval(data);
	for(var i=0;i<dd.length;i++) {
		var d=dd[i];
		dishes[d.rowid]=d;
		$("#menu").append("<tr class='dish-item' id='"+d.rowid+"'></tr>")
		var tr=$("#menu tr:last")
		for (var j = 0; j <props.length; j++) {
			var p=props[j];
			var val=d[p];
			tr.append("<td class='prop-"+p+"'>"+val+"</td>")
		}
	}
	$("#menu tr").append("<td>"+"<input type='button' class='editbtn button' value='edit'></td>")
	$(".editbtn").click(edit);
	var head="";
	for (var j = 0; j <props.length; j++) {
			var p=props[j];
			head+="<td>"+p+"</td>";
		}
	head="<tr>"+head+"</tr>";
	$("#menu").prepend(head);
	$('tr:odd').css({'background-color': '#ddd'});
}
t_attr='<tr><td class="attr-key" width="50%">$key</td><td width="50%"><input class="attr-val"  value="$val" id="edit-$key"></input></td></tr>'
function showAttr(key,val){
	var html=t_attr
		.replace(/\$key/g,key)
		.replace(/\$val/g,val);
	return html;
}