$(document).ready(function() {
  var cont, tpl1, tpl2, user, userid, vendor, vendorid;
  cont = $('#main');
  if (!(typeof data !== "undefined" && data !== null)) {
    alert('data not found');
    return;
  }
  tpl1 = "h1{!vendorname! 共!sum!元}+aside{!contact!}+!for:dishes!article{!qty! !unit! !dishname!}";
  tpl2 = "h1{!username! 共!sum!元}+!for:dishes!article{!qty! !unit! !dishname!}";
  for (vendorid in data.vendors) {
    vendor = data.vendors[vendorid];
    $.zen(tpl1, vendor).appendTo(cont);
  }
  for (userid in data.users) {
    user = data.users[userid];
    $.zen(tpl2, user).appendTo(cont);
  }
});