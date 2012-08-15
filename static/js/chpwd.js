var log;
log = function(msg) {
  return $("#msg").text(msg);
};
$(document).ready(function() {
  $(cancel).click(function() {
    return f.submit();
  });
  return $(f).submit(function() {
    var data;
    if (reppass.value !== newpass.value) {
      log("两次密码输入不相等");
    } else if (newpass.value === oldpass.value) {
      log("新旧密码相等，请修改");
    } else {
      data = {
        'newpass': newpass.value,
        'password': oldpass.value
      };
      $.post('/chpwd', data, function(r) {
        if (r.indexOf('error') >= 0) {
          log(r);
          return;
        }
        alert("密码已修改");
        return f.submit();
      });
    }
    return false;
  });
});