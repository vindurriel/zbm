// Generated by CoffeeScript 1.4.0
var cacheIt, click, color, draw, getLinkName, getR, highlight, r, redraw, save, tick, update;

cacheIt = function(e) {
  r.ctrlPressed = e.ctrlKey;
  r.altPressed = e.altKey;
  return r.shiftPressed = e.shiftKey;
};

redraw = function() {
  return r.vis.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
};

draw = function(json) {
  r.nodes = json.nodes;
  r.links = json.links;
  r.root = json.nodes[0];
  r.root.fixed = false;
  r.highlights.push("n_" + r.root.name);
  r.root.x = r.w / 2;
  r.root.y = r.h / 2 - 80;
  r.force = d3.layout.force().on("tick", tick).charge(function(d) {
    if (d.type === "referData") {
      return -20;
    } else {
      return -200;
    }
  }).linkDistance(function(d) {
    if (d.target.type === "referData") {
      return 20;
    }
    return d.target.name.length * 10 + d.source.name.length * 5;
  }).size([r.w, r.h - 160]);
  return update();
};

getLinkName = function(source, target) {
  return "" + source.name + "->" + target.name;
};

update = function() {
  var x, _i, _j, _len, _len1, _ref, _ref1;
  r.vis.selectAll(".node").remove();
  _ref = r.nodes;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    x = _ref[_i];
    if (!(r.hNode[x.name] != null)) {
      r.hNode[x.name] = x;
    }
  }
  _ref1 = r.links;
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    x = _ref1[_j];
    if (!(x.name != null)) {
      x.name = getLinkName(x.source, x.target);
    }
    if (!(r.hLink[x.name] != null)) {
      r.hLink[x.name] = x;
    }
  }
  r.link = r.vis.selectAll(".link").data(r.links).style("stroke-width", function(d) {
    if (r.highlights.indexOf("l_" + d.name) >= 0) {
      return "2px";
    } else {
      return "0.5px";
    }
  }).style("opacity", function(d) {
    if (r.highlights.indexOf("l_" + d.name) >= 0) {
      return 1.0;
    } else {
      return 0.2;
    }
  });
  r.link.enter().insert("line", ".node").attr("class", "link").style("stroke-width", "1px").style("opacity", "0.2");
  r.link.exit().remove();
  r.node = r.vis.selectAll(".node").data(r.nodes).enter().append("g").attr("class", "node").call(r.force.drag).on("click", click);
  r.node.append("circle").attr("cx", 0).attr("cy", 0).style("opacity", function(d) {
    if (r.highlights.indexOf("n_" + d.name) >= 0) {
      return 1;
    } else {
      return .2;
    }
  }).attr("r", getR).style("stroke-width", function(d) {
    if (r.highlights.indexOf("n_" + d.name) >= 0) {
      return "2px";
    } else {
      return "1px";
    }
  }).style("fill", color).transition().attr("r", getR);
  r.node.append("title").text(function(d) {
    return d.name;
  });
  r.node.append("text").attr("class", "notclickable desc").style("opacity", function(d) {
    if (r.highlights.indexOf("n_" + d.name) >= 0) {
      return 1;
    } else {
      return 0;
    }
  }).attr("dx", function(d) {
    return getR(d);
  }).text(function(d) {
    if (d.type === "referData") {
      return "";
    }
    return d.name;
  });
  r.node.filter(function(d) {
    return d.isSelected;
  }).append("image").attr("x", function(d) {
    return -1.2 * 32 * getR(d) / 15.0;
  }).attr("y", function(d) {
    return -1.2 * 32 * getR(d) / 15.0;
  }).attr("width", function(d) {
    return 1.2 * 64 * getR(d) / 15.0;
  }).attr("height", function(d) {
    return 1.2 * 64 * getR(d) / 15.0;
  }).attr("xlink:href", "/static/images/loader.gif");
  return r.force.nodes(r.nodes).links(r.links).start();
};

getR = function(d) {
  var x;
  if (d.type === "referData") {
    return 5;
  }
  return 15;
  x = d.level;
  if (x > 4) {
    x = 4;
  }
  return 15 - x * 3;
};

tick = function() {
  r.link.attr("x1", function(d) {
    return d.source.x;
  }).attr("y1", function(d) {
    return d.source.y;
  }).attr("x2", function(d) {
    return d.target.x;
  }).attr("y2", function(d) {
    return d.target.y;
  });
  return r.node.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
};

color = function(d) {
  var i;
  i = r.colors.indexOf(d.type);
  if (i >= 0) {
    return r.palette(i + 1);
  }
  return r.palette(0);
};

click = function(d) {
  var name, type, url, x, _i, _len, _ref;
  if (r.shiftPressed) {
    if (d === r.root) {
      alert("不能删除根节点");
      r.shiftPressed = false;
      return;
    }
    highlight(d);
    _ref = r.highlights;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      type = x[0];
      name = x.slice(2);
      if (type === "l") {
        r.links.remove(r.hLink[name]);
      } else if (name === d.name || r.hNode[name].type === "referData") {
        r.nodes.remove(r.hNode[name]);
        blacklist.push(name);
      }
    }
  } else if (r.altPressed) {
    save().done(function() {
      return window.open("/model/" + d.name, "_self");
    });
    return;
  } else if (r.ctrlPressed) {
    if (d.type === "referData") {
      window.open(d.url != null ? d.url : d.name);
      return;
    }
    if ((d.isSelected != null) && d.isSelected === true) {
      d.isSelected = false;
    } else {
      d.isSelected = true;
    }
    if (!d.isSelected) {
      return;
    }
    url = "/search/" + d.name;
    d3.json(url, function(data) {
      var i, key, source, target, _j, _len1;
      source = r.hNode[d.name];
      if (!(source != null)) {
        return;
      }
      i = 0;
      for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
        x = data[_j];
        if (r.blacklist.indexOf(x.name) >= 0) {
          continue;
        }
        if (x.type === "referData") {
          if (!(r.hNode[x.name] != null)) {
            key = getLinkName(source, x);
            r.nodes.push(x);
            r.links.push({
              "source": source,
              "target": x,
              "name": key
            });
          }
        } else {
          target = x;
          if (!(r.hNode[x.name] != null)) {
            if (i === 5) {
              continue;
            }
            r.nodes.push(x);
            i += 1;
          } else {
            target = r.hNode[x.name];
          }
          key = getLinkName(source, target);
          if (!(r.hLink[key] != null)) {
            r.links.push({
              "source": source,
              "target": target,
              "name": key
            });
          }
        }
      }
      d.isSelected = false;
      return update();
    });
  } else {
    highlight(d);
  }
  return update();
};

highlight = function(d) {
  var duo, l, sname, tname, _results;
  r.highlights = [];
  r.highlights.push("n_" + d.name);
  _results = [];
  for (l in r.hLink) {
    duo = l.split("->");
    sname = duo[0], tname = duo[1];
    if (d.name === sname) {
      highlights.push("l_" + l);
      _results.push(highlights.push("n_" + r.hNode[tname].name));
    } else if (d.name === tname) {
      highlights.push("l_" + l);
      _results.push(highlights.push("n_" + r.hNode[sname].name));
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

save = function() {
  var res, x, _i, _j, _len, _len1, _ref, _ref1;
  res = {
    "name": r.root.name,
    "nodes": [],
    "links": []
  };
  _ref = r.nodes;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    x = _ref[_i];
    res.nodes.push({
      "name": x.name,
      "value": x.value,
      "index": x.index,
      "type": x.type,
      "url": x.url
    });
  }
  _ref1 = r.links;
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    x = _ref1[_j];
    res.links.push({
      "name": x.name,
      "source": x.source.index,
      "target": x.target.index
    });
  }
  res = JSON.stringify(res);
  return $.ajax({
    "url": "/model",
    "type": "POST",
    "contentType": "json",
    "data": res
  });
};

r = typeof exports !== "undefined" && exports !== null ? exports : this;

r.highlights = [];

r.hNode = {};

r.hLink = {};

r.w = $(this).width();

r.h = $(this).height();

r.ctrlPressed = false;

r.altPressed = false;

r.shiftPressed = false;

r.blacklist = [];

Array.prototype.remove = function(b) {
  var a;
  a = this.indexOf(b);
  if (a >= 0) {
    this.splice(a, 1);
    return true;
  }
  return false;
};

document.onkeydown = cacheIt;

document.onkeyup = cacheIt;

r.vis = d3.select("#container").append("svg:svg").attr("width", r.w).attr("height", r.h).attr("viewBox", "0 0 " + r.w + " " + r.h).attr("pointer-events", "all").attr("preserveAspectRatio", "XMidYMid").append("svg:g").call(d3.behavior.zoom().on("zoom", redraw)).append("svg:g");

$(document).ready(function() {
  $("#btn_tip").click(function() {
    return $("#tip").slideToggle(200);
  });
  $("#btn_save").click(function() {
    return save().done(function() {
      return alert("保存完成");
    }).fail(function(d, e) {
      return alert(e);
    });
  });
  return $.getJSON("/model/load/" + document.title, function(d) {
    if (!d || (d.error != null)) {
      return draw({
        "nodes": [
          {
            "name": document.title
          }
        ],
        "links": []
      });
    } else {
      return draw(d);
    }
  });
});

r.vis.append("svg:rect").attr("width", r.w).attr("height", r.h).attr("fill", "none");

r.palette = d3.scale.category10();

r.colors = ["baiduBaikeCrawler", "hudongBaikeCrawler", "referData"];
