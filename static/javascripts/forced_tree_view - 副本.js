var r=document;

r.w = 1280,
r.h = 800,

r.diag = d3.svg.diagonal().projection(function(d) {
  return [d.x, d.y];
});
r.ctrlPressed = false;
r.altPressed = false;
r.shiftPressed = false;
Array.prototype.remove = function(b) {
  var a = this.indexOf(b);
  if (a >= 0) {
    this.splice(a, 1);
    return true;
  }
  return false;
};

function cacheIt(e) {
  r.ctrlPressed = e.ctrlKey;
  r.altPressed = e.altKey;
  r.shiftPressed = e.shiftKey;
}
document.onkeydown = cacheIt;
document.onkeyup = cacheIt;

r.vis = d3.select("body").insert("svg:svg", "#tip")
  .attr("width", r.w)
  .attr("height", r.h)
  .attr("pointer-events", "all")
  .append('svg:g')
  .call(d3.behavior.zoom().on("zoom", redraw))
  .append('svg:g');

r.vis.append('svg:rect')
  .attr('width', r.w)
  .attr('height', r.h)
  .attr('fill', 'none');

function redraw() {
  console.log("here", d3.event.translate, d3.event.scale);
  r.vis.attr("transform",
    "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
}
function draw(json) {
  root = json;
  root.fixed = true;
  root.x = r.w / 2;
  root.y = r.h / 2 - 80;
  r.force = d3.layout.force()
    .on("tick", tick)
    .charge(function(d) {
    return d._children ? -d.size / 50 : -80;
  })
    .linkDistance(function(d) {
    return d.target._children ? 100 : 50;
  })
    .size([r.w, r.h - 160]);
  update();
}


function update() {
  r.vis.selectAll(".node").remove();
  var nodes = flatten(root),
    links = d3.layout.tree().links(nodes);

  // Update the links…
  r.link = r.vis.selectAll(".link")
    .data(links, function(d) {
    return d.target.id;
  });

  // Enter any new links.
  r.link.enter().insert("path", ".node")
    .attr("class", "link")
  // Exit any old links.
  r.link.exit().remove();


  // Update the nodes…
  // Enter any new nodes.
  r.node = r.vis.selectAll(".node")
    .data(nodes, function(d) {
    return d.id;
  }).enter().append("g")
    .attr("class", "node")
    .on("click", click)
    .call(r.force.drag);

  r.node.append("circle")
    .attr("cx", function(d) {
    return 0;
  })
    .attr("cy", function(d) {
    return 0;
  })
    .attr("r", getR)
    .style("fill", color)
    .style("stroke-width", stroke_width)
    .transition().attr("r", getR);

  r.node.append("title")
    .text(function(d) {
    return d.name
  });

  r.node.filter(function(d) {
    return d.isSelected;
  })
    .append("image")
    .attr("x", function(d) {
    return -1.2 * 32 * getR(d) / 15.0;
  })
    .attr("y", function(d) {
    return -1.2 * 32 * getR(d) / 15.0;
  })
    .attr("width", function(d) {
    return 1.2 * 64 * getR(d) / 15.0;
  })
    .attr("height", function(d) {
    return 1.2 * 64 * getR(d) / 15.0;
  })
    .attr("xlink:href", "/static/images/loader.gif");
  // .attr("class","spin");
  // .append("text")
  // .attr("dx", 12)
  // .attr("dy", ".35em")
  // .style("font-size",function(d){return getR(d);  })
  // .style("font-weight","light")
  // .text(function(d) { return d.name });

  r.force.nodes(nodes)
    .links(links)
    .start();
}

function getR(d) {
  var x = d.level;
  if (x > 4) x = 4;
  return 15 - x * 3;

}

function tick() {

  r.link.attr("x1", function(d) {
    return d.source.x;
  })
    .attr("y1", function(d) {
    return d.source.y;
  })
    .attr("x2", function(d) {
    return d.target.x;
  })
    .attr("y2", function(d) {
    return d.target.y;
  })
    .attr("d", r.diag);
  r.node.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
  // node.attr("cx", function(d) {
  //   return d.x;
  // })
  //   .attr("cy", function(d) {
  //   return d.y;
  // });
}

// Color leaf nodes orange, and packages white or blue.
r.colors = ["#000088", "#4678a4", "#53b1e3", "#ade2e6", "#aaaaff"];

function color(d) {
  return r.colors[d.level % 5];
  // return d._children ? "#ff0000" : d.children ? "#000000" : "#aaddff";
}

function stroke_width(d) {
  return d.isSelected ? "2px" : ".5px";
}
// Toggle children on click.

function click(d) {
  if (r.ctrlPressed) {
    if (!d.children) d.children = []
    d.children.push({
      name: "new node",
      size: 1
    });
  } else if (r.shiftPressed) {
    if (d.parent) {
      d.parent.children.remove(d);
    }
  } else if (r.altPressed) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
  } else {
    if (d.isSelected === undefined)
      d.isSelected = false;
    d.isSelected = !d.isSelected;
  }
  update();
}

// Returns a list of all nodes under the root.

function flatten(root) {
  var nodes = [],
    i = 0;
  function recurse(node, level, parent) {
    node.level = level;
    node.parent = parent;
    if (node.children)
      node.size = node.children.reduce(function(p, v) {
        return p + recurse(v, level + 1, node);
      }, 0);
    // if (!node.id) 
    node.id = ++i;
    nodes.push(node);
    return node.size;
  }

  root.size = recurse(root, 0, null);
  return nodes;
}

d3.json("/static/javascripts/flare.json", draw);