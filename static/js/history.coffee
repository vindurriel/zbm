tpl_time='b{!time!}'
tpl_dish='p{!qty! !unit! !name!}'
$(document).ready ->
	cont=$('#wrapper')
	for time,dishes of data
		cont.append($.zen(tpl_time,{time:parseTime(time)}))
		for dish in dishes
			$.zen(tpl_dish,{
				name:dish.name,
				qty:dish.qty,
				unit:dish.unit
			}).appendTo(cont)
parseTime=(s)->
	s=s.split("-")
	if s[-1]=="0" 
		s[-1]="中午"
	else
		s[-1]="晚上"
	if s[1][0]=="0"
		s[1]=s[1][1..]
	if s[2][0]=="0"
		s[2]=s[2][1..]
	s= "#{s[0]}年#{s[1]}月日"