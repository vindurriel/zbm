var log, login, onUserChange;
$(document).ready(function() {
  $("#login").submit(function() {
    return login();
  });
  $("#div_register").hide();
  $("#div_pw").hide();
  $("#div_pw").css({
    'margin-left': '-100px',
    'opacity': 0
  });
  $("#div_register input").css({
    'margin-left': '-100px',
    'opacity': 0
  });
  return $.getJSON('/user/listJSON', function(users) {
    var name, o, sel, u, _i, _len;
    sel = $("#username")[0];
    for (_i = 0, _len = users.length; _i < _len; _i++) {
      u = users[_i];
      name = u.username;
      o = new Option(name, name, false, false);
      o.hasPassword = u.hasPassword;
      sel.options.add(o);
    }
    sel.options.add(new Option("新用户", "new", false, false));
    return sel.onchange = function() {
      return onUserChange(sel);
    };
  });
});
onUserChange = function(r) {
  var btn_login, btn_register, ease, p, sel, speed;
  sel = r.options[r.selectedIndex];
  p = $("#div_pw");
  speed = 'fast';
  ease = 'easeOutQuad';
  btn_register = $("#btn_register");
  btn_login = $("#btn_login");
  if (sel.value === "new") {
    p.stop().slideUp(speed, ease);
    $("#div_register").slideDown(speed, ease, function() {
      $("#div_register input").slideShow('0px', speed, ease);
      return $(".slide").slideShow('0px', speed, ease);
    });
  } else {
    $("#div_register input").slideHide('-100px', speed, ease);
    $(".slide").slideShow('-67px', speed, ease, function() {
      return $("#div_register").slideUp(speed, ease);
    });
  }
  if (!sel.hasPassword || sel.hasPassword === "false") {
    $("#password").val('');
    return p.stop().slideHide('-100px', speed, ease, function() {
      return p.slideUp(speed, ease);
    });
  } else {
    return p.stop().slideDown(speed, ease, function() {
      return p.slideShow('0px', speed, ease);
    });
  }
};
jQuery.fn.slideShow = function(offset, speed, ease, callback) {
  if (offset == null) {
    offset = '100px';
  }
  if (speed == null) {
    speed = 'fast';
  }
  if (ease == null) {
    ease = 'linear';
  }
  if (callback == null) {
    callback = function() {};
  }
  return this.animate({
    'margin-left': offset,
    'opacity': 1
  }, speed, ease, callback);
};
jQuery.fn.slideHide = function(offset, speed, ease, callback) {
  if (offset == null) {
    offset = '100px';
  }
  if (speed == null) {
    speed = 'fast';
  }
  if (ease == null) {
    ease = 'linear';
  }
  if (callback == null) {
    callback = function() {};
  }
  return this.animate({
    'margin-left': offset,
    'opacity': 0
  }, speed, ease, callback);
};
log = function(r) {
  alert(r);
  return $("#msg").text(r);
};
login = function() {
  var cmd, isLogin, p, u;
  if ($("#username").val() === "") {
    log("请选择用户名");
    return false;
  }
  isLogin = $("#div_register").css("display") === "none";
  cmd = isLogin ? "validate" : "new";
  u = isLogin ? $("#username").val() : $("#input_new_username").val();
  p = isLogin ? $("#password").val() : $("#input_new_password").val();
  $.post('/user/' + cmd, {
    'username': u,
    'password': p
  }, function(r) {
    var newname;
    if (r.indexOf("error") >= 0) {
      log(r);
      return false;
    }
    if (r.indexOf("created") >= 0) {
      newname = $("#input_new_username").val();
      $("#username")[0].options.add(new Option(newname, newname, true, true));
      $("#password").val($("#input_new_password").val());
    }
    return $("#login")[0].submit();
  });
  return false;
};