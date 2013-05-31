cacheIt = (e) ->
  r.ctrlPressed = e.ctrlKey
  r.altPressed = e.altKey
  r.shiftPressed = e.shiftKey
redraw = ->
  r.vis.attr "transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")"
draw = (json) ->
  r.nodes= json.nodes
  r.links= json.links
  r.root = json.nodes[0]
  r.root.fixed = false
  r.highlights.push "n_"+r.root.name
  r.root.x = r.w / 2
  r.root.y = r.h / 2 - 80
  r.force = d3.layout.force().on("tick", tick).charge(-200)
  .linkDistance (d)->
     d.target.name.length*10+d.source.name.length*5
  .size([r.w, r.h - 160])
  update()
getLinkName= (source,target)->
  return "#{source.name}->#{target.name}"
update = ->
  r.vis.selectAll(".node").remove()
  # r.vis.selectAll(".link").remove()
  for x in r.nodes
    if not r.hNode[x.name]?
      r.hNode[x.name]=x
  for x in r.links
    if not x.name?
      x.name=getLinkName x.source, x.target
    if not r.hLink[x.name]?
      r.hLink[x.name]=x
  # Update the links…
  r.link = r.vis.selectAll(".link").data(r.links)
  .style "stroke-width", (d) ->
    if r.highlights.indexOf("l_"+d.name)>=0 then "2px" else "0.5px" 
  
  # Enter any new links.
  r.link.enter()
  .insert("line", ".node")
  .attr("class","link")
  .attr "stroke-width", (d) ->
    if r.highlights.indexOf("l_"+d.name)>=0 then "2px" else "0.5px" 

  # Exit any old links.
  r.link.exit().remove()
  
  r.node = r.vis.selectAll(".node")
  .data(r.nodes)
  .enter()
  .append("g")
  .attr("class", "node").call(r.force.drag)
  .on("click", click)

  r.node.append("circle")
  .attr("cx",0)
  .attr("cy",0)
  .attr("r", getR)
  .style "stroke-width", (d) ->
    if r.highlights.indexOf("n_"+d.name)>=0 then "2px" else "0.5px" 
  .style("fill", color).transition().attr "r", getR
  r.node.append("title")
    .text (d) ->
      d.name
  r.node.append("text")
  .attr("class","notclickable")
  .style "font-size", (d) ->
    return "1em"
  .style "opacity", (d) ->
    if r.highlights.indexOf("n_"+d.name)>=0 then 1 else 0
  .attr "dx", (d) ->
    getR(d)
  .text (d) ->
    d.name

  r.node.filter((d) ->
    d.isSelected
  ).append("image").attr("x", (d) ->
    -1.2 * 32 * getR(d) / 15.0
  ).attr("y", (d) ->
    -1.2 * 32 * getR(d) / 15.0
  ).attr("width", (d) ->
    1.2 * 64 * getR(d) / 15.0
  ).attr("height", (d) ->
    1.2 * 64 * getR(d) / 15.0
  ).attr "xlink:href", "/static/images/loader.gif"

  r.force.nodes(r.nodes).links(r.links).start()
getR = (d) ->
  if  d.type=="referData" or d.type=="expandRead"
    return 2
  return 15
  x = d.level
  x = 4  if x > 4
  15 - x * 3
tick = ->
  r.link.attr("x1", (d) ->
    d.source.x
  ).attr("y1", (d) ->
    d.source.y
  ).attr("x2", (d) ->
    d.target.x
  ).attr("y2", (d) ->
    d.target.y
  )

  r.node.attr "transform", (d) ->
    "translate(" + d.x + "," + d.y + ")"
    
# Color leaf nodes orange, and packages white or blue.
color = (d) ->
  i=r.colors.indexOf(d.type)
  if i>=0
    return r.palette(i+1)
  return r.palette(0)
click = (d) ->
	if r.shiftPressed
    if d==r.root
      alert "不能删除根节点"
      r.shiftPressed=false
      return
    highlight d
    for x in r.highlights
      type=x[0]
      name=x[2..]
      if type=="l"
        r.links.remove r.hLink[name]
      else if name==d.name
        r.nodes.remove r.hNode[name]
        blacklist.push name
	else if r.altPressed
		if d.children
			d._children = d.children
			d.children = null
		else
			d.children = d._children
			d._children = null
	else if r.ctrlPressed
    if d.type=="expandRead" or d.type=="referData"
      window.open if d.url? then d.url else d.name
      return
    if d.isSelected? and d.isSelected==true
    	d.isSelected= false
    else 
    	d.isSelected = true
    if not d.isSelected
    	return
    url= "/search/#{d.name}"
    d3.json url , (data) ->
    	i=0
    	source=r.hNode[d.name]
    	if not source?
    		return
    	for x in data
    		target=x
    		if not r.hNode[x.name]?  and r.blacklist.indexOf(x.name)==-1
    			r.nodes.push x
    			i+=1
    		else
    			target=r.hNode[x.name]
    		key= getLinkName source,target
    		if not r.hLink[key]?			
    			r.links.push {"source":source,"target":target,"value":1,"name":key}
    		if i==5 then break
    	d.isSelected= false
    	update()
	else
		highlight d
	update()
highlight = (d)->
  r.highlights= []
  r.highlights.push "n_"+d.name
  for l of r.hLink
    duo=l.split("->")
    [sname,tname]= duo
    if d.name==sname
      highlights.push "l_"+l
      highlights.push "n_"+r.hNode[tname].name
    else if d.name==tname
      highlights.push "l_"+l
      highlights.push "n_"+r.hNode[sname].name
save = ->
  res=
    "name":r.root.name,
    "nodes":[],
    "links":[],
  for x in r.nodes
    res.nodes.push 
      "name":x.name,
      "value":x.value,
      "index":x.index,
      "type":x.type
  for x in r.links
    res.links.push
      "name":x.name,
      "source":x.source.index,
      "target":x.target.index,
  res=JSON.stringify res
  console.log res
  jQuery.post "/model", res, (d)->
    alert("保存完成")
  ,"json"
r = exports ? this
r.highlights=[]
r.hNode={}
r.hLink={}
r.w = $(this).width()
r.h = $(this).height()
r.ctrlPressed = false
r.altPressed = false
r.shiftPressed = false
r.blacklist= []
Array::remove = (b) ->
  a = @indexOf(b)
  if a >= 0
    @splice a, 1
    return true
  false
document.onkeydown = cacheIt
document.onkeyup = cacheIt
r.vis = d3.select("#container")
  .append("svg:svg")
  .attr("width", r.w)
  .attr("height", r.h)
  .attr("viewBox","0 0 #{r.w} #{r.h}")
  .attr("pointer-events", "all")
  .attr("stroke","black")
  .attr("preserveAspectRatio","XMidYMid")
  .append("svg:g")
  .call(d3.behavior.zoom()
  .on("zoom", redraw))
  .append("svg:g")
$(document).ready ->
  $("#btn_save").click save
  $.getJSON "/model/load/#{document.title}", (d)->
    if not d or d.error?
      draw {"nodes":[{"name":document.title}],"links":[]}
    else
      draw d
r.vis.append("svg:rect").attr("width", r.w).attr("height", r.h).attr "fill", "none"
r.palette= d3.scale.category10()
r.colors =[
   "baiduBaikeCrawler",
   "expandRead",
   "hudongBaikeCrawler",
   "referData"
]

# d3.json "/static/javascripts/graph.json", draw

