$(document).ready ->
	$("#login").submit ()->
		login()
	$("#div_register").hide()
	$("#div_pw").hide()
	$("#div_pw").css({'margin-left':'-100px','opacity':0})
	$("#div_register input").css({'margin-left':'-100px','opacity':0})
	$.getJSON '/user/listJSON', (users)->
		# $("msg").innerText=s
		# users=eval("("+s+")")
		sel=$("#username")[0]
		for u in users
			name=u.username
			o=new Option name,name,false,false
			o.hasPassword=u.hasPassword
			sel.options.add(o)
		sel.options.add(new Option("新用户","new",false,false))
		sel.onchange= -> onUserChange(sel)
onUserChange=(r)->
	sel=r.options[r.selectedIndex]
	p=$("#div_pw")
	speed='fast'
	ease='easeOutQuad'
	btn_register=$("#btn_register")
	btn_login=$("#btn_login")
	if sel.value=="new"
		p.stop().slideUp speed,ease 
		$("#div_register").slideDown speed,ease,->
			$("#div_register input").slideShow '0px',speed,ease 
			$(".slide").slideShow '0px',speed,ease 
	else
		$("#div_register input").slideHide '-100px',speed,ease 
		$(".slide").slideShow '-67px',speed,ease,->
			$("#div_register").slideUp(speed,ease)
	if not sel.hasPassword or sel.hasPassword=="false"
		$("#password").val ''
		p.stop().slideHide '-100px',speed,ease,->
			p.slideUp speed,ease
	else
		p.stop().slideDown speed,ease,->
			p.slideShow('0px',speed,ease)
jQuery.fn.slideShow = (offset='100px',speed='fast',ease='linear',callback=->)->
	return this.animate {'margin-left':offset,'opacity':1},speed,ease,callback 
jQuery.fn.slideHide = (offset='100px',speed='fast',ease='linear',callback=->)->
	return this.animate {'margin-left':offset,'opacity':0},speed,ease,callback 
log=(r)->
	alert r
	$("#msg").text(r)
login = -> 
	if $("#username").val()=="" 
		log("请选择用户名")
		return false
	isLogin = $("#div_register").css("display")=="none"
	cmd=if isLogin then "validate" else "new"		
	u = if isLogin then $("#username").val() else $("#input_new_username").val()
	p = if isLogin then $("#password").val() else $("#input_new_password").val()
	$.post '/user/'+cmd,{'username':u,'password':p },(r)->
		if(r.indexOf("error")>=0)
			log(r) 
			return false
		if  r.indexOf("created")>=0 
			newname=$("#input_new_username").val()
			$("#username")[0].options.add(new Option(newname,newname,true,true))
			$("#password").val($("#input_new_password").val())
		$("#login")[0].submit()
	return false