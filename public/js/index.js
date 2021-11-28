verifiedTag =
  '<span class="verified" title="Verified account"><i class="far fa-check-circle"></i></span>';
new_saveTag = '<img src="/img/save.svg" alt="savetag">Save';
savedTag = '<img src="/img/saved.svg" alt="unsavetag">Unsave';
///////////////////////////////// gotopbtn ////////////////////////////
//Get the button
let tag = document.querySelector("html");
var goTopBtn = document.querySelector("#gotopbtn");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = () => {
  scrollFunction();
};
async function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}
function scrollFunction() {
  let limit = 200;
  if (tag.scrollTop > limit || document.documentElement.scrollTop > limit) {
    goTopBtn.style.visibility = "visible";
    goTopBtn.style.opacity = "1";
  } else {
    goTopBtn.style.visibility = "hidden";
    goTopBtn.style.opacity = "0";
  }
}
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  tag.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
/* // random cool bg (optional)
function randombgcolor() {
		var x = Math.floor(Math.random() * 256);
		var y = Math.floor(Math.random() * 256);
		var z = Math.floor(Math.random() * 256);
		var bgColor = "rgb(" + x + "," + y + "," + z + ",0.8)";
		document.getElementsByTagName('body')[0].style.background = bgColor;
}
setInterval(randombgcolor,1100);
*/

$(".more").on("click", (e) => {
  more(e.currentTarget);
});

function more(e) {
  postid = $(e).parent().parent().attr("data-post-id");
  opt = $("div[data-post-id=" + postid + "] .options");
  if (opt.css("display") == "none") {
    opt.show(300);
  } else {
    opt.hide(300);
  }
}

$(".like").on("click", (e) => {
  like(e.currentTarget);
});

function like(e) {
  postid = $(e).parent().parent().attr("data-post-id");
  url = `/like/${postid}/event/`;
  $.post(url, (res) => {
    c = $(".likes" + postid)[0];
    d = $(".dislikes" + postid)[0];
    f = $("div[data-post-id=" + postid + "] .dislike");
    if (res.status === 0) {
      let path = location.pathname.replace("/", "");
      let url = `/login?l=false&redirect=${path}`;
      window.location.replace(`${location.origin}${url}`);
    } else if (res.status == `liked`) {
      c.innerHTML = Number(c.textContent) + 1;
      e.src = "/img/arrow2.svg";
    } else if (res.status == `unliked`) {
      c.innerHTML = Number(c.textContent) - 1;
      e.src = "/img/arrow.svg";
    } else if (res.status === `liked_while_disliked`) {
      c.innerHTML = Number(c.textContent) + 1;
      d.innerHTML = Number(d.textContent) - 1;
      e.src = "/img/arrow2.svg";
      f.attr("src", "/img/arrow.svg");
    } else if (res.status == `error`) {
      message = res.message;
      popup(message, "auto", "error", 3000);
    }
  });
}
$(".dislike").on("click", (e) => {
  dislike(e.currentTarget);
});

function dislike(e) {
  postid = $(e).parent().parent().attr("data-post-id");
  url = `/dislike/${postid}/event/`;
  $.post(url, (res) => {
    d = $(".dislikes" + postid)[0];
    c = $(".likes" + postid)[0];
    f = $("div[data-post-id=" + postid + "] .like");
    if (res.status === 0) {
      let path = location.pathname.replace("/", "");
      let url = `/login?l=false&redirect=${path}`;
      window.location.replace(`${location.origin}${url}`);
    } else if (res.status === `disliked`) {
      d.innerHTML = Number(d.textContent) + 1;
      e.src = "/img/arrow2.svg";
    } else if (res.status === `undisliked`) {
      d.innerHTML = Number(d.textContent) - 1;
      e.src = "/img/arrow.svg";
    } else if (res.status === `disliked_while_liked`) {
      d.innerHTML = Number(d.textContent) + 1;
      c.innerHTML = Number(c.textContent) - 1;
      e.src = "/img/arrow2.svg";
      f.attr("src", "/img/arrow.svg");
    } else if (res.status == `error`) {
      message = res.message;
      popup(message, "auto", "error", 3000);
    }
  });
}

$(".send").on("click", (e) => {
  send(e.currentTarget);
});

var commentBool = false;
function send(e) {
  if (commentBool) return;
  commentBool = true;
  postid = $(e).parent().parent().parent().attr("data-post-id");
  message = $("div[data-post-id=" + postid + "] input[type=text]").val() || "";
  url = `/comment/${postid}/event/`;
  c = $("div[data-post-id=" + postid + "] .comments");
  if (message.length < 1) return;
  data = { message };
  commentcount = $("div[data-post-id=" + postid + "] .c");
  $.post(url, data, (res) => {
    input = $("div[data-post-id=" + postid + "] input[type=text]");
    if (res.status === 0) {
      let path = location.pathname.replace("/", "");
      let url = `/login?l=false&redirect=${path}`;
      window.location.replace(`${location.origin}${url}`);
    } else if (res.success === 1) {
      commentBool = false;
      let outputUsername = res.username;
      if (res.isverified) outputUsername = res.username + verifiedTag;
      var comment = `<hr><div class="comment"><span class="uname"><a href="/${res.username}">${outputUsername}</a></span><span class="cmsg">${res.message}</span><span class="cdate">${res.date}</span></div>`;
      $(commentcount).html(Number($(commentcount).text()) + 1);
      c.append(comment);
      input.val("");
    } else if (res.error === 1) {
      message = res.message;
      popup(message, "auto", "danger", 3000);
    }
  });
}

$.urlParam = function (name) {
  var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
    window.location.href
  );
  if (results == null) {
    return null;
  }
  return decodeURI(results[1]) || 0;
};
// if ($.urlParam("status") == "ok") {
//   Swal.fire({
//     icon: "success",
//     title: "Success!",
//     text: "Updated successfuly.",
//   });
// }

$(".follow").on("click", (e) => {
  follow(e.currentTarget);
});

function follow(e) {
  username = $(e).data("username");
  f1 = document.querySelector(".pfollowers");
  f2 = document.querySelector(".pfollowings");
  url = `/${username}/follow/`;
  $.post(url, (res) => {
    if (res.status === 0) {
      let path = window.location.pathname.replace("/", "");
      window.location.href = `login?l=false&redirect=${path}`;
    } else if (res.status === `followed`) {
      $(".follow").html("Unfollow");
      f1.innerHTML = Number(f1.textContent) + 1;
    } else if (res.status === `unfollowed`) {
      f1.innerHTML = Number(f1.textContent) - 1;
      $(".follow").html("Follow");
    } else if (res.status === `error`) {
      Swal.fire({ icon: "error", title: "Oops...", text: res.message });
    }
  });
}

$(".del").on("click", (e) => {
  del(e.currentTarget);
});

function del(e) {
  val = $(e).parent().parent().parent().parent().attr("data-post-id");
  url = "/delete/" + val;
  $.post(url, (res) => {
    if (res.status === 0) {
      message = `Some errors while delete`;
      popup(message, "popup", "danger");
    } else if (res.status === 1) {
      $("div[data-post-id=" + val + "]")
        .removeAttr("data-post-id")
        .remove();
      message = `Post deleted successfuly`;
      popup(message, "auto", "success", 5000);
    } else if (res.status === 2) {
      message = `Unauthorized process!`;
      popup(message, "popup", "danger");
    }
  });
}

$(".save").on("click", (e) => {
  save(e.currentTarget);
});

function save(e) {
  val = $(e).parent().parent().parent().parent().attr("data-post-id");
  url = "/save/" + val;
  $.post(url, (res) => {
    if (res.status === 0) {
      let path = location.pathname.replace("/", "");
      let url = `/login?l=false&redirect=${path}`;
      window.location.replace(`${location.origin}${url}`);
    } else if (res.status === 1) {
      $(e).html(savedTag);
    } else if (res.status === 2) {
      $(e).html(new_saveTag);
    } else if (res.status === 3) {
      message = res.message;
      popup(message, "auto", "danger", 3000);
    } else {
      message = `I dont't know but something happened`;
      popup(message, "auto", "danger", 3000);
    }
  });
}

$("#textarea").on("keyup", function () {
  $("#count").text("Characters left: " + (500 - $(this).val().length));
});

$("#update").on("click", (e) => {
  update(e.currentTarget);
});

function update(e) {
  $.post("/edit/", $("#updateform").serialize(), (res) => {
    $(e).attr("disabled", "disabled");
    $(".msg").empty();
    i = $("input[type=text][name=username]");
    adiv = $("div.alts").empty();
    var y = $(window).scrollTop();
    if (res.status === 0) {
      let path = location.pathname.replace("/", "");
      let url = `/login?l=false&redirect=${path}`;
      window.location.replace(`${location.origin}${url}`);
    } else if (res.success === 1) {
      try {
        var tag_username = document.querySelector(`.username`);
        var tag_fullname = document.querySelector(`.fullname`);
        var tag_biography = document.querySelector(`.biography`);
        res.username ? (tag_username.innerHTML = res.username) : null;
        res.fullname ? (tag_fullname.innerHTML = res.fullname) : null;
        res.biography ? (tag_biography.innerHTML = res.biography) : null;
      } catch (error) {
        console.log("GET_ELEMENT_ERROR");
      }

      message = res.message;
      popup(message, "auto", "success", 3000);
      let counter = 5;
      let interval = setInterval(function () {
        counter--;
        $(e).html("Update in (" + counter + "s)");
        if (counter == 0) {
          $(e).removeAttr("disabled");
          $(e).html("Update");
          clearInterval(interval);
        }
      }, 1000);
    } else if (res.error === 1) {
      message = res.message;
      popup(message, "auto", "danger", 4500);
      let counter = 5;
      let interval = setInterval(function () {
        counter--;
        $(e).html("Update in (" + counter + "s)");
        if (counter == 0) {
          $(e).removeAttr("disabled");
          $(e).html("Update");
          clearInterval(interval);
        }
      }, 1000);
      if (res.alternatives.length > 0) {
        let alts = res.alternatives;
        f = true;
        message = res.message;
        popup(message, "auto", "danger", 4500);

        let counter = 5;
        let interval = setInterval(function () {
          counter--;
          $(e).html("Update in (" + counter + "s)");
          if (counter == 0) {
            $(e).removeAttr("disabled");
            $(e).html("Update");
            clearInterval(interval);
          }
        }, 1000);
        alts.forEach((alt) => {
          if (alt !== null) {
            if (f) {
              f = false;
              adiv.append("Some alternatives: ");
            }
            a = '<span class="alt">' + alt + "</span>";
            adiv.append(a);
          }
        });
        $(".alt").on("click", (e) => {
          i.val(e.currentTarget.textContent); // i => input
        });
        $(e).removeAttr("disabled");
      }
    } else if (res.suspend === 1) {
      message = res.message;
      popup(message, "", "warning", 3000);
    }
  });
}

$("#postbtn").on("click", (e) => {
  $(".slideToCart").css("transform", "translate(50px, 50px)");
  addpost(e.currentTarget);
});

function addpost(e) {
  $.post("/post/", $("#postform").serialize(), (res) => {
    $(e).attr("disabled", "disabled");
    $(".msg").empty().hide();
    var y = $(window).scrollTop();
    var counter = 5;
    if (res.status === 0) {
      $(e).attr("disabled", "disabled");
      let path = location.pathname.replace("/", "");
      let url = `/login?l=false&redirect=${path}`;
      window.location.replace(`${location.origin}${url}`);
    } else if (res.success == 1) {
      message = `Successfuly added post.`;
      popup(message, "auto", "success", 3000);
      var interval = setInterval(function () {
        $(e).html("Post again in (" + counter + "sec)");
        if (counter == 0) {
          $(e).removeAttr("disabled");
          $(e).html("Post");
          clearInterval(interval);
        }
        counter--;
      }, 1000);
      $("#postform")[0].reset();
      $(".sendpost").removeClass("active");
    } else if (res.error === 1) {
      message = res.message;
      popup(message, "auto", "danger", 3000);
      var interval = setInterval(function () {
        $(e).html("Post in (" + counter + "s)");
        if (counter == 0) {
          $(e).removeAttr("disabled");
          $(e).html("Post");
          clearInterval(interval);
        }
        counter--;
      }, 1000);
    } else if (res.suspend === 1) {
      message = res.message;
      popup(message, "auto", "warning", 3000);
    } else {
    }
  });
}
function report(e) {
  postid = $(e).parent().parent().parent().parent().attr("data-post-id");
  url = "/" + postid + "/report/";
  isrepoted = true;
  if (isrepoted) {
    isrepoted = false;
    $.post(url, (res) => {
      if (res.status === 0) {
        let path = location.pathname.replace("/", "");
        let url = `/login?l=false&redirect=${path}`;
        window.location.replace(`${location.origin}${url}`);
      } else if (res.status === 1) {
        message = `Successfuly reported.`;
        popup(message, "auto", "success", 3000);
        isrepoted = false;
      } else if (res.status === 2) {
        message = "You are already reported.";
        popup(message, "auto", "warning", 3000);
        isrepoted = false;
      } else if (res.status === 3) {
        message = "There is an error. Please try again later";
        popup(message, "auto", "danger", 3000);
      }
    });
  }
}

var xhr = "";

function getNotif() {
  var res;
  var xhr = $.ajax({
    type: "POST",
    url,
    success: (res) => {
      n_loading.hide();
      // // return
      if (res.status === 0) {
        let path = location.pathname.replace("/", "");
        let url = `/login?l=false&redirect=${path}`;
        window.location.replace(`${location.origin}${url}`);
      } else if (res.status === 1 || res.status == 2) {
        notifs = res.result;
        if (notifs.length > 0) {
          var limit = 12;
          try {
            notifs.forEach((notif, index) => {
              username = notif.username;
              username =
                username.length > limit
                  ? username.substring(0, limit) + ".."
                  : username;
              let readStatus = !notif.read ? `notread` : ``;
              let notifcontent = ``;
              switch (notif.ncode) {
                case `like`:
                  t = `<li class="${readStatus}"><a title="${username} liked your post." href="/post/${notif.postid}"><i class="fas fa-heart"></i><b>${username}</b>liked your post. </a><span class="ntime">${notif.ntime}</span></li>`;
                  ntag.append(t);
                  break;
                case `follow`:
                  t = `<li class="${readStatus}"><a title="Go to ${username}\'s profile" href="/${username}"><i class="fas fa-user-plus"></i><b>${username}</b>started to follow you</a><span title="" class="ntime">${notif.ntime}</span></li>`;
                  ntag.append(t);
                  break;
                case `comment`:
                  t = `<li class="${readStatus}"><a title="${username} commented to your post." href="/post/${notif.postid}"><i class="fas fa-comment"></i><b>${username}</b> commented: <span class="commenttext">${notif.commenttext}</span></a><span class="ntime">${notif.ntime}</span></li>`;
                  ntag.append(t);
                  break;

                case `info`: //?????????????????????????????????????
                  ncontent = notif.ncontent;
                  t = `<li class="${readStatus} info"><a href="javascript:void(0)"><b>${notif.username}</b>${ncontent}</a><span class="ntime">${notif.ntime}</span></li>`;
                  ntag.append(t);
                  break;
                case `danger`: //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                  ncontent = notif.ncontent;
                  t = `<li class="${readStatus} danger"><a href="javascript:void(0)"><b>${notif.username}</b>${ncontent}</a><span class="ntime">${notif.ntime}</span></li>`;
                  ntag.append(t);
                  break;
                case `warning`: //***********************************
                  ncontent = notif.ncontent;
                  t = `<li class="${readStatus} warning"><a href="javascript:void(0)"><b>${notif.username}</b>${ncontent}</a><span class="ntime">${notif.ntime}</span></li>`;
                  ntag.append(t);
                  break;
                case `update`: //***********************************
                  ncontent = notif.ncontent;
                  t = `<li class="${readStatus} success"><a href="javascript:void(0)"><b>${notif.username}</b>${ncontent}</a><span class="ntime">${notif.ntime}</span></li>`;
                  ntag.append(t);
                  break;
              }
            });
          } catch (error) {
            t = `<li><a href="" onclick="location.reload()">There is an error please refresh the page</a><br>err: ${error}</li>`;
            ntag.append(t);
          }
        } else {
          t = `<li><a href="javascript:void(0)">You have no notification, yet..<i class="far fa-frown-open"></i></a></li>`;
          ntag.append(t);
        }
      } else if (res.status === 3) {
        n_loading.hide();
        message =
          res.message +
          ' Please <a href="javascript:void(0)" onclick="location.reload()">refresh the page.</a>';
        popup(message, "popup", "danger");
      }
    },
    error: (e) => {},
  });
}

var timeout, searchTimeout;
function search_runFunc() {
  var delay = 100;
  searchTimeout = setTimeout(search, delay);
}
function notif_runFunc() {
  var delay = 100;
  timeout = setTimeout(getNotif, delay);
}

function clearFunc(timeout) {
  clearTimeout(timeout);
  timeout = ``;
}

var searchBool = true;
let resultsContainer = $(".results-container");
let results = $(".results");
let gif = $(`.searchloading`);
$("#search").on("keyup", async (e) => {
  clearFunc(searchTimeout);
  let value = $("#search").val().trim().toLowerCase();
  gif.show();
  if (value.length > 1) {
    if (searchBool) {
      searchBool = false;
      search(value);
    }
    resultsContainer.addClass(`r_active`);
  } else {
    resultsContainer.removeClass(`r_active`);
    return;
  }
});
$(".searchbtn").on("click", async (e) => {
  if (e.key === `Enter`) {
    console.log(e.key);
  }
  clearFunc(searchTimeout);
  let value = $("#search").val().trim().toLowerCase();
  gif.show();

  if (value.length > 1) {
    if (searchBool) {
      searchBool = false;
      search(value);
    }
    resultsContainer.addClass(`r_active`);
  } else {
    resultsContainer.removeClass(`r_active`);
    return;
  }
});

function search(string) {
  let url = "/search";
  let value = $("#search").val().trim().toLowerCase();
  gif.show();
  data = {
    searchData: value,
  };
  results.hide();
  gif.show();
  $.post(url, data, (res) => {
    if (res.status === 0) {
      let path = location.pathname.replace("/", "");
      let url = `/login?l=false&redirect=${path}`;
      window.location.replace(`${location.origin}${url}`);
    } else if (res.success === 1) {
      gif.hide();
      results.empty();
      results.show();
      searchBool = true;
      res.users.forEach((user) => {
        let el = `<div class="res-user"><a href="/${user.username}" class="res-userlink" title="Go to ${user.username}'s Sekiz Profile"><img class="res-userprofile" src="/img/profile2.jpg" /><div><div class="res-username">${user.username}</div><div class="res-fullname">${user.fullname}</div></div></a></div>`;
        results.append(el);
      });
    } else if (res.info === 1) {
      gif.hide();
      results.show();
      searchBool = true;
      results.html(res.message);
    }
  });
}
let is_clicked_notif = false;
$(".notif").on("click", (e) => {
  url = "/notif/";
  n_loading = $(".notifloading");
  ntag = $(".notifications ul");
  $(".notifications").toggleClass("active");
  $(".notifications ul").empty();
  $(".notifloading").show(10);
  if (!is_clicked_notif) {
    is_clicked_notif = true;
    notif_runFunc();
    $(".notread").removeClass("notread");
  } else {
    is_clicked_notif = false;
    clearFunc(timeout);
  }

  $(".ncount").hide(100);
});

let per = Notification.permission;
if (per !== "denied" && per !== `granted`) Notification.requestPermission();
var checkNewNotifBool = true;
function checkNewNotif(time) {
  if (checkNewNotifBool) {
    setTimeout(() => {
      checkNewNotifBool = false;
      url = `/checknotif/`;
      $.post(url, (res) => {
        if (res.status === 0) {
          let path = location.pathname.replace("/", "");
          let url = `/login?l=false&redirect=${path}`;
          window.location.replace(`${location.origin}${url}`);
        } else if (res.status === 2) {
          let ncount = document.querySelector(`.ncount`);
          ncount.style.display = `block`;
          ncount.innerHTML = res.result.count;
          let notif = res.result.notif;
          var username = notif.username;
          let message = ``;
          let body = ``;
          switch (notif.ncode) {
            case `like`:
              body = `New message from Sekiz!`;
              message = `${username} liked your post`;
              break;
            case `follow`:
              body = `New message from Sekiz!`;
              message = `${username} started to follow you`;
              break;
            case `comment`:
              body = `New message from Sekiz!`;
              message = `${username} commented: ${notif.ncontent}`;
              break;
            default:
              body = `${username} ${notif.ncode.toUpperCase()}`;
              message = `${username} ${notif.ncode.toUpperCase()}`;
              body = notif.ncontent;
              break;
          }
          let per = Notification.permission;
          if (per === "granted") {
            if (
              !getCookie("nid") ||
              (getCookie("nid") && getCookie("nid") != notif.nid)
            ) {
              setCookie("nid", notif.nid);
              const greeting = new Notification(`${message}`, {
                body,
              });
            }
          } else if (per !== "denied") {
            Notification.requestPermission();
          }
        }
        setTimeout(() => {
          checkNewNotifBool = true;
        }, time);
      });
    }, time);
  }
}
checkNewNotif(5 * 1000);
let time = 40 * 1000;
setInterval(async () => {
  checkNewNotif(time);
}, time);
// function stopSearch(searchTimeout) {
//   clearTimeout(searchTimeout)
// }
function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}
$(".copy-btn").on("click", () => {
  copyToClipboard(".link");
  message = `Successfully copied to clipboard.`;
  popup(message, "auto", "success", 3000);
});

$(".share").on("click", () => {
  $(".share-div").addClass("share-active");
});
$(".share-close", ".share-div").on("click", () => {
  $(".share-div").removeClass("share-active");
});

$(".report").on("click", () => {
  $(".report-div").addClass("report-active");
});

report_click = false;
$(".report-btn").on("click", (e) => {
  if (!report_click) {
    report_click = true;
    tag = e.currentTarget;
    reportnumber = $(tag).attr("data-report-number");
    reporttext = $(tag).text();
    postid = $(".report-div .postid").text();

    url = "/" + postid + "/report";
    data = {
      reportnumber,
      reporttext,
    };
    $.post(url, data, (res) => {
      if (res.status === 0) {
        let path = location.pathname.replace("/", "");
        let url = `/login?l=false&redirect=${path}`;
        window.location.replace(`${location.origin}${url}`);
      } else if (res.status === 1) {
        message = `Successfuly reported. Your reportid: ` + res.reportid;
        popup(message, "popup", "info");
      } else if (res.status === 2) {
        message = res.message;
        popup(message, "auto", "danger", 3000);
      }
      report_click = false;
    });
  }
});

$(".report-close", ".report-div").on("click", () => {
  $(".report-div").removeClass("report-active");
});

function setCookie(c_name, value, exdays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value =
    escape(value) + (exdays == null ? "" : "; expires=" + exdate.toUTCString());
  document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == c_name) {
      return unescape(y);
    }
  }
}
if (!getCookie("cookieStatus")) {
  $(".cookie").addClass("cookie-active");
}
$(".cookie-btn").on("click", () => {
  setCookie("cookieStatus", true, 99999);
  $(".cookie").removeClass("cookie-active");
});

$(".moreCommentBtn").on("click", (e) => {
  let message = "Coming soon.";
  popup(message, "auto", "info", 2000);
});
