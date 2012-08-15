var parseTime, tpl_dish, tpl_time;
tpl_time = 'b{!time!}';
tpl_dish = 'p{!qty! !unit! !name!}';
$(document).ready(function() {
  var cont, dish, dishes, time, _results;
  cont = $('#wrapper');
  _results = [];
  for (time in data) {
    dishes = data[time];
    cont.append($.zen(tpl_time, {
      time: parseTime(time)
    }));
    _results.push((function() {
      var _i, _len, _results2;
      _results2 = [];
      for (_i = 0, _len = dishes.length; _i < _len; _i++) {
        dish = dishes[_i];
        _results2.push($.zen(tpl_dish, {
          name: dish.name,
          qty: dish.qty,
          unit: dish.unit
        }).appendTo(cont));
      }
      return _results2;
    })());
  }
  return _results;
});
parseTime = function(s) {
  s = s.split("-");
  if (s[-1] === "0") {
    s[-1] = "中午";
  } else {
    s[-1] = "晚上";
  }
  if (s[1][0] === "0") {
    s[1] = s[1].slice(1);
  }
  if (s[2][0] === "0") {
    s[2] = s[2].slice(1);
  }
  return s = "" + s[0] + "年" + s[1] + "月日";
};