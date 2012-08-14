

function createAjaxObject()  
    {  
        var ajax;  
        try   
        {  
            ajax= new ActiveXObject("Msxml2.XMLHTTP");  
        }  
        catch(e)  
        {  
            try  
            {  
                ajax = new ActiveXObject("Microsoft.XMLHTTP");  
            }    
            catch(e)  
            {  
                 ajax = new XMLHttpRequest();  
            }    
        }    
        return ajax;  
    } 
function deleteUser()  
{  
	ok=confirm("确认删除当前用户?")
	if(!ok) return;
	ajax=createAjaxObject()
    if(ajax)
    {
        var url="validate.py?cmd=deluser";  
		url=encodeURI(url);
        ajax.open("GET",url,true);  
        ajax.onreadystatechange =function () {  
			if(4==ajax.readyState) {  
			        r=ajax.responseText;
			        log(r);
			        if(r.indexOf("error")==0)
			        {
			        	alert(r);
			        	return;
			        }
					if (r.indexOf("deleted")>=0)
					{
						window.location="logout.py";
					}
				}     
			};  
        ajax.send(null); 
    }  
	return false;
}  

function getCookie(name)//取cookies函数        
{
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
     if(arr != null) return unescape(arr[2]); 
     return null;

}

function login()  
{  
	if($("#username").val()=="")
	{
		log("请选择用户名");
		return false;		
	}
	ajax=createAjaxObject()
    if(ajax)
    {
    	var isLogin=$("#div_register").css("display")=="none";
       	var cmd=isLogin?"validate":"newuser";
    	var username=isLogin?$("#username").val():$("#input_new_username").val();
    	var password=isLogin?$("#password").val():$("#input_new_password").val();
        var url="validate.py?cmd="+cmd+"&username="+username+"&password="+password;  
		url=encodeURI(url);
        ajax.open("GET",url,true);  
        ajax.onreadystatechange =login_r;
        ajax.send(null); 
    }  
	return false;
}  
function login_r()  
{   
    if(4==ajax.readyState)  
    {  
        var r=ajax.responseText;
        if(r.indexOf("error")==0)
        {
        	log(r);
        	return;
        }
		if (r.indexOf("created")>=0)
		{
			var newname=$("#input_new_username").val();
			//it won't work setting username's value directly.
			$("#username")[0].options.add(new Option(newname,newname,true,true));
			$("#password").val($("#input_new_password").val());
		}
		$("#login")[0].submit();
    }     
}  
// function $(id)
// {
// 	return document.getElementById(id);
// }
function loadUsers()
{
	$("#div_register").hide();
	$("#div_pw").hide();
	$("#div_pw").css({'margin-left':'-100px','opacity':0});
	$("#div_register input").css({'margin-left':'-100px','opacity':0});
	//$("#btn_register").hide();
	jQuery.fn.slideIn= function(offset,speed,ease,callback){
		offset=offset||'100px';
		speed=speed||'fast';
		ease=ease||'linear';
		callback=callback||function(){};
		return this.animate({'margin-left':offset,'opacity':1},speed,ease,callback);
	};
	jQuery.fn.slideOut= function(offset,speed,ease,callback){
		offset=offset||'100px';
		speed=speed||'fast';
		ease=ease||'linear';
		callback=callback||function(){};
		return this.animate({'margin-left':offset,'opacity':0},speed,ease,callback);
	};
	ajax=createAjaxObject()
	if(ajax)
	{     
		ajax.open("GET","loadUsers.py",true);  
		ajax.onreadystatechange =loadUsers_r;    
		ajax.send(null);  
	}  
}
function loadUsers_r()  
{   
	if(4==ajax.readyState)  
	{
		var s=ajax.responseText;
		//$("msg").innerText=s;
		var users=eval('('+s+')');
		//var users=eval("("+s+")");
		var sel=$("#username")[0];

		for(var i=0;i<users.length;i++)
		{
			u=users[i];
			name=u.username;
			var o=new Option(name,name,false,false);
			o.hasPassword=u.hasPassword;
			sel.options.add(o);
		}
		sel.options.add(new Option("新用户","new",false,false));
		sel.onchange= function() {onUserChange(sel)};
	}     
}    
function onUserChange(r)
{
	sel=r.options[r.selectedIndex];
	var p=$("#div_pw");
	var speed='fast';
	var ease='easeOutQuad';
	var btn_register=$("#btn_register");
	var btn_login=$("#btn_login");
	if(sel.value=="new")
	{
		p.stop().slideUp(speed,ease);
		$("#div_register").slideDown(speed,ease,function(){
			$("#div_register input").slideIn('0px',speed,ease);
			$(".slide").slideIn('0px',speed,ease,true);
		});
	}
	else
	{
		$("#div_register input").slideOut('-100px',speed,ease);
		$(".slide").slideIn('-67px',speed,ease,function(){

			$("#div_register").slideUp(speed,ease);
		});
		// btn_login.animate({'margin-left':0,'opacity':1},speed,ease);
		// btn_register.animate({'margin-left':500,'opacity':0},speed,ease,function(){
		// 	btn_register.hide();
		// 	$("#div_register").slideUp(speed,ease);
		// });
	}
	if(!sel.hasPassword || sel.hasPassword=="false")
	{
		$("#password").val();
		p.stop().slideOut('-100px',speed,ease,function(){
			p.slideUp(speed,ease);
		});

	}
	else
	{
		p.stop().slideDown(speed,ease,function(){
			p.slideIn('0px',speed,ease);
		});
	}
}


function log(msg)
{
	$("#msg").text(msg);
}
function add_order(a)
{
	var id=a.id;
	if (!id || id=="") return false;
	id=id.replace('a','l');
	if($("#"+id).length>0) {
		var v=$("#"+id)[0].children[0].value;
		$("#"+id)[0].children[0].value=(parseInt(v)+1).toString();
	}
	else{
		var price=a.getAttribute('tag');
		if (!price) return false;
		var item=createItem(id,$(a).attr("dishname"),price);
		$("#order")[0].appendChild(item);
		var count=$("#order")[0].children.length;
		$("#count")[0].innerText=count;
	}
	getSum();
}
function createItem(id,text,price)
{
		var x=document.createElement('dl');
		x.id=id;
		x.tag=price;
		var qty=document.createElement('select');
		qty.id=id.replace("l","s");
		for (var i=1;i<21;i++)
		{
			var o=document.createElement("option");
			o.value=i;
			o.innerText=i;
			qty.appendChild(o);
		}
		qty.onchange=function ()
		{
			getSum();
		}
		x.innerText=text+' X '
		x.appendChild(qty);
		del=document.createElement("input")
		del.type="button";
		del.value="删除";
		$(del).addClass("button");
		del.onclick=function ()
		{
			var p=this.parentNode;
			p.parentNode.removeChild(p);
			count.innerText=$("#order")[0].children.length;
			getSum();
		}
		x.appendChild(del);
		return x;
}
function getSum()
{
	var sum=0;
	var c=$("#order")[0].children;
	for (var i =0;i<c.length;i++){
		var x=c[i];
		sum+=parseFloat(x.tag)*parseInt(x.children[0].value);
	}
	$("#sum").text(sum);
}
function changeQty(r)
{
	var id=r.id.replace("t","l");
	$("#"+id)[0].children[0].innerText=r.value;
	getSum();
}
function order()
{
	var result="";
	var c=$("#order")[0].children;
	for (var i =0;i<c.length;i++)
	{
		var x=c[i];
		result+=","+x.id.substring(1)+","+x.children[0].value;
	}
	result=result.substring(1);
	$("#o").val(result);

	ajax=createAjaxObject()
	if(ajax)
	{     
		var url="order.py?u="+u.value+"&o="+result;
		ajax.open("GET",url,true);  
		ajax.onreadystatechange =order_r;    
		ajax.send(null);  
	}  
}
function order_r()
{
        if(4==ajax.readyState)  
        {  
            r=ajax.responseText;
			if (r)
				{
					$.growlUI('',r);
				}
        }     
}
function loadOrder()
{
	$('.dish').click(function(){
		add_order(this);
	})
	ajax=createAjaxObject()
	if(ajax)
	{   
		var url="loadOrder.py?u="+u.value;
		ajax.open("GET",url,true);  
		ajax.onreadystatechange =loadOrder_r;    
		ajax.send(null);  
	}  
}
function loadOrder_r()
{
	if(4==ajax.readyState)  
	{  
		var r=ajax.responseText;
		if (r!="false")
			{
				var orders=eval("("+r+")");
				for (var x in orders)
				{
					var a=$("#a"+x)[0];
					add_order(a);
					var s=$("#s"+x)[0];
					s.value=orders[x];
				}
				getSum();

			}
	}     
}
function checkPwd()
{
	if (reppass.value!=newpass.value)
	{
		log("两次密码输入不相等");
	}
	else if (newpass.value==oldpass.value)
	{
		log("新旧密码相等，请修改");
	}
	else{
		ajax=createAjaxObject()
		if(ajax)
		{     
		   var url="validate.py?cmd=changepass&newpass="+newpass.value+"&password="+oldpass.value;
			ajax.open("GET",url,true);  
			ajax.onreadystatechange =checkPwd_r;   
			ajax.send(null); 
		}  
	}
	return false;
}
    function checkPwd_r()  
    {   
        if(4==ajax.readyState)  
        {  
            r=ajax.responseText;
			if (r.indexOf('error')==0)
				{
					log(r);
					//log("原密码不正确或用户未登录");
				}
			else 
			{
				alert("密码已修改");
				f.submit();
			}
        }     
    }  
	function quit()
	{
	window.location="main.py";
	}
	function printf(p)
	{
		if(p==1)
			{
			ajax=createAjaxObject()
			if(ajax)
			{     
			   var url="print.py";
				ajax.open("GET",url,true);  
				ajax.onreadystatechange =function()
				{
					if(4==ajax.readyState)
					{
					
					alert(ajax.responseText);
					window.opener=null;   
					//window.opener=top;   
					window.open("","_self");   
					window.close();  
					}
				}
				ajax.send(null); 
			}  
		}
		else
		{
			window.opener=null;   
			//window.opener=top;   
			window.open("","_self");   
			window.close();  
		}
	
	}
	function feedback(){alert("面谈")}
	function lock(l)
	{
		if (l==1) var r=confirm("操作将使所有用户的订单变为只读状态，请确认所有用户都完成了订餐");
		if (r==true || l==0)
		{
			ajax=createAjaxObject()
			if(ajax)
			{     
			   var url="lock.py?lock="+l;
				ajax.open("GET",url,true);  
				ajax.onreadystatechange =function(){}
				ajax.send(null); 
			}
		}
	}