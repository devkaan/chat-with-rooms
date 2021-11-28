$(window).on("beforeunload", () => {
  // $('.posts').empty() // delete all posts before reload
});

function share(e) {
  $(".share-div").addClass("share-active");
  $(".options").hide(200);
  protocol = window.location.protocol === "http:" ? "https:" : "https:";
  link = protocol + "//" + window.location.hostname + "/post/" + postid;
  text = "Hey%2C%20you%20should%20see%20this%20post%0A";
  $(".link-cont .link").html(link);
  $(".link-cont .link").attr("title", link);
  $(".facebook").attr(
    "href",
    "https://www.facebook.com/sharer/sharer.php?u=" +
      "https://www.youtube.com/watch?v=74LAYoqo0p4"
  );
  $(".twitter").attr(
    "href",
    "https://twitter.com/intent/tweet?url=" + link + "&text=" + text
  );
  $(".whatsapp").attr("href", "https://wa.me/?text=" + text + "" + link);
  $(".pinterest").attr(
    "href",
    "https://pinterest.com/pin/create/button/?url=" +
      link +
      "&media=&description=" +
      text
  );
  $(".linkedin").attr(
    "href",
    "https://www.linkedin.com/shareArticle?mini=true&url=" +
      link +
      "&title=&summary=" +
      text +
      "&source="
  );
  $(".signal").attr("href", "signal://send?text=" + text + link);
  $(".mail").attr(
    "href",
    "mailto:info@example.com?&subject=" + text + "&body=" + link
  );
}
e = true;
$(window).on("scroll", function () {
  if (
    $(window).scrollTop() + $(window).height() >=
    $(document).height() - 500
  ) {
    getpost();
  }
});
$(window).on("load", () => {
  getpost();
});

var sj = true;
var verifiedTag =
  '<span class="verified" title="Verified account"><i class="far fa-check-circle"></i></span>';
var hiddenTag =
  '<span class="hidden" title="Hidden post, just you can see this post"><i class="far fa-eye-slash"></i></span>';
// bannerTag = '<div class="banner"><a href="https://tr.link/ref/devkaan"><img src="//cdn.tr.link/img/728x90.png" title="Para Kazanmak İçin Tıkla Kayıt OL" /></a></div>'
var shareTag =
  '<a class="share" title="Share post" href="javascript:void(0)"><img src="/img/share.svg" alt="share">Share</a>';
var reportTag =
  '<a class="report" title="Report post" href="javascript:void(0)"><img src="/img/report.svg" alt="report">Report</a>';
var saveTag =
  '<a class="save" title="Save post" href="javascript:void(0)"><img src="/img/save.svg" alt="save">Save</a>';
var deleteTag =
  '<a class="del" title="Delete post" href="javascript:void(0)"><img src="/img/delete.svg" alt="delete">Delete</a>';
var bannerTag = "";

function getpost() {
  var y = $(window).scrollTop();
  var adlimit = 4;
  var url = $(location).attr("pathname") + "/getpost/";
  if ($(location).attr("pathname") == "/") url = "/";
  else if ($(location).attr("pathname") == "/explore") url = "/explore";
  l = $(".loading");
  if (sj) {
    sj = false;
    l.show(300);
    $.post(url, (res) => {
      if (res.more === 1) sj = true;
      // for profile page
      if (res.success === 1 || res.success === 2) {
        try {
          r = res.result;
          r.forEach((current_item, index) => {
            // if ((index + 1) === adlimit) {
            //   adlimit = 0
            //   $('.posts').append(bannerTag)
            // }
            let comment = ``;
            let counts = current_item.post.counts;
            let is_liked = current_item.is_liked;
            let is_disliked = current_item.is_disliked;
            let postid = current_item.postid;
            var buttons;
            if (res.success === 1) {
              buttons = shareTag + reportTag + saveTag;
            } else if (res.success === 2) {
              buttons =
                shareTag +
                saveTag +
                (current_item.is_me ? (reportTag + deleteTag) : "");
            }
            if (current_item.last_comment) {
              comment = `<div class="comment"><span class="uname"><a href="/${
                current_item.last_comment.username
              }">${current_item.last_comment.username}${
                current_item.last_comment.isverified ? verifiedTag : ""
              }</a></span><span class="cmsg">${
                current_item.last_comment.message
              }</span><span class="cdate">${
                current_item.last_comment.date
              }</span></div>`;
            }
            let d = new Date(current_item.post.createdAt);
            let h = d.getHours();
            let m = d.getMinutes();
            h = h <= 9 ? "0" + h : h;
            m = m <= 9 ? "0" + m : m;
            let dd = `${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${h}:${m}`;
            // `+ ((lnd[index][0]) ? `<img class="like" src="/img/arrow2.svg" alt="">` : `<img class="like" src="/img/arrow.svg" alt="">`) + `
            // `+ ((lnd[index][1]) ? `<img class="dislike" src="/img/arrow2.svg" alt="">` : `<img class="dislike" src="/img/arrow.svg" alt="">`) + `
            a =
              `<div class="post"  style="display: none;" data-post-id="` +
              postid +
              `"><div class="header">
            <div class="user">
              <img class="lazyload" data-src="/img/80x80.jpg" alt="user profile">
              <div class="u">
              <a href="/${current_item.username}">${current_item.username}${
                current_item.is_verified_user ? verifiedTag : ""
              }</a>
            <div class="pdate">${dd}</div>
              </div>
            </div>
            <div class="more">
              <i class="fas fa-ellipsis-h"></i>
            </div>
            <div class="options">
              <div class="arrow"> </div>
              <div>
              ${buttons}
              </div>
            </div>
          </div>
          <div class="article">
            <p class="ptext">
            ${current_item.post.article}
            </p>
            <div class="pmedia" style="display: none;">
              <img class="lazyload" src="" alt="post img">
            </div>
          </div>
          <div class="buttons">
          
          ${
            is_liked
              ? '<img class="like" src="/img/arrow2.svg" alt="button">'
              : '<img class="like" src="/img/arrow.svg" alt="button">'
          }
    ${
      is_disliked
        ? '<img class="dislike" src="/img/arrow2.svg" alt="button">'
        : '<img class="dislike" src="/img/arrow.svg" alt="button">'
    }
          </div>

          <div class="buttons">
            <span class="likes${postid}">
            ${counts[0]}
            </span>
            <span class="slash">/</span>
            <span class="dislikes` +
              postid +
              `">
            ${counts[1]}
            </span>
          </div>
          <span class="commentcount"><span class="c">
          ${Number(counts[2])}</span>comment(s)
          </span>
          <div class="comments">${comment}</div>
        
          <div class="sendcomment">
          <a class="moreCommentBtn" id="moreCommentBtn">Load more comment(s)</a>
            <form onsubmit="return false">
              <input type="text" name="comment" placeholder="Write comment..">
              <button type="button" class="send">Send</button>
            </form>
          </div>
          </div>`;

            // profile page
            $(".posts").append(a);
            f = ".post[data-post-id=" + postid + "]";
            $(f).show(400);
            b = $(".post .options");
            $(f + " .like").on("click", (e) => {
              like(e.currentTarget);
            });
            $(f + " .more").on("click", (e) => {
              more(e.currentTarget);
            });
            $(f + " .dislike").on("click", (e) => {
              dislike(e.currentTarget);
            });
            $(f + " .send").on("click", (e) => {
              send(e.currentTarget);
            });
            $(f + " .moreCommentBtn").on("click", (e) => {
              let message = "Coming soon.";
              popup(message, "auto", "info", 2000);
            });
            
            $(f + " .report").on("click", (e) => {
              $(".report-div").addClass("report-active");
              $(".report-div .postid").html(postid);
              $(".options").hide(200);
            }); 
            if (res.success === 2) {
              $(f + " .del").on("click", (e) => {
                del(e.currentTarget);
              });
              $(f + " .visibility").on("click", (e) => {
                console.log("soon");
              });
            }
            $(f + " .save").on("click", (e) => {
              save(e.currentTarget);
            });

            $(f + " .share").on("click", () => {
              share(e);
            });
          });
        } catch (error) {
          let message = `Upload post error, Please refresh the page.`;
          let element = `<span class="padding margin info">${message}</span>`;
          $(".posts").append(element);
        }
      } else if (res.info === 1) {
        let element = `<span class="padding margin info">${res.message}</span>`;
        $(".posts").append(element);
      } else if (res.suspend === 1) {
        let element = `<span class="padding margin warning">${res.message}</span>`;
        $(".posts").append(element);
      } else if (res.error === 1) {
        let element = `<span class="padding margin danger">${res.message}</span>`;
        $(".posts").append(element);
      } else {
        let element =
          '<span class="padding margin danger">There is an critical error. Please tell me this error <a href="mailto:abdikaangrbz@gmail.com">at here</a></span>';
        $(".posts").append(element);
      }
      /* message = `Your account has been temporarily suspended. <a href="/faq/questionid" style="color: inherit">Why?</a>`;
        $(".posts").append(
          '<div style="margin-top:30px; padding: 10px 7px; font-size: 19px" class="warning">' +
            message +
            "</div>"
        ); */

      // $(window).scrollTop(y + 150);
      l.hide();
    });
  }
}
