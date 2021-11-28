$.urlParam = function (name) {
  var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
    window.location.href
  );
  if (results == null) {
    return null;
  }
  return decodeURI(results[1]) || 0;
};

isclickedLogin = false;
$("#loginbtn").on("click", () => {
  if (!isclickedLogin) {
    isclickedLogin = true;
    url = "/admin/login";
    data = $("#loginform").serialize();
    $.post(url, data, (res) => {
      if (res.success == 1) {
        let url = `/admin/`;
        
        message = "Admin Login is Successfuly.";
        popup(message, "auto", "success", 1000);
        setTimeout(() => {
          if ($.urlParam("redirect")) {
            url = $.urlParam("redirect");
          }
          window.location.replace(`${location.origin}${url}`);
        }, 1000);
      } else if (res.error == 1) {
        message = res.message;
        popup(message, "auto", "warning", 4000);
      }
    });
    isclickedLogin = false;
  }
});

var x = location.pathname;
if (x == "/admin/login") {
  if ($.urlParam("l") == `false`) {
    message = `You should login for this.`;
    popup(message, "auto", "warning", 3500);
  }
}
