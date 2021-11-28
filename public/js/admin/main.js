function download(fileUrl, fileName) {
  var a = document.createElement("a");
  a.href = fileUrl;
  a.setAttribute("download", fileName);
  a.click();
}
function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}
bool = true;
if (window.location.pathname.startsWith("/admin/users")) {
  if (!bool) pass;
  bool = false;
  var postsdiv = $(".posts");
  url = "/admin/users";
  $.post(url, (res) => {
    if (res.success == 1) {
      var el = `<div class="table-responsive"><table class="table"><thead>
      <tr>
        <th>Username</th>
        <th>Userid</th>
        <th>Fullname</th>
        <th>Email</th>
        <th>Suspend</th>
        <th>Visibility</th>
        <th>Verified</th>
        <th>DeleteUser</th>
        <th>Biography</th>
        <th>Created at</th>
        <th>Updated at</th>
      </tr>
    </thead><tbody>`;
      result = res.result;
      result.forEach((user) => {
        let classname = "";
        user.verified ? (classname = "info") : "";
        user.suspend ? (classname = "warning") : "";
        user.verified && user.suspend ? (classname = "warninginfo") : "";
        el += `<tr class="${classname}">
        <td><span class="copy"><a href="/${user.username}">${
          user.username
        }</a></span></td>
        <td><span class="copy">${user.userid}</span></td>
        <td><span class="copy">${user.fullname}</span></td>
        <td><span class="copy">${user.email}</span></td>
        <td><span>${user.suspend}</span>
          <button type="button" class="btn btn-warning event" event="suspend" id="${
            user.userid
          }">Change</button
        </td>
        <td><span>${user.visibility}</span>
          <button type="button" class="btn btn-primary event" event="visibility" id="${
            user.userid
          }">Change</button
        </td>
        <td><span>${user.verified}</span>
          <button type="button" class="btn btn-info event" event="verified" id="${
            user.userid
          }">Change</button
        </td>
        <td><span>&nbsp;&nbsp;</span>
          <button type="button" class="btn btn-danger event" event="delete" id="${
            user.userid
          }">Delete</button
        </td>
        <td>${
          user.biography.length > 100
            ? user.biography.slice(0, 100) + `...`
            : user.biography
        }</td>
        <td>${user.createdAt}</td>
        <td>${user.updatedAt}</td>
      </tr>`;
      });
      el += `</tbody></table></div>`;
      postsdiv.append(el);
      var allCopybuttons = document.querySelectorAll(".copy");
      allCopybuttons.forEach((button) => {
        button.addEventListener("click", (e) => {
          copyToClipboard(button);
          message = `Successfully copied to clipboard.`;
          popup(message, "auto", "success", 3000);
        });
      });

      var allbuttons = document.querySelectorAll(".event");
      allbuttons.forEach((button) => {
        button.addEventListener("click", (e) => {
          adminEvent(e);
        });
      });
    } else if (res.error == 1) {
      message = res.message;
      popup(message, "auto", "warning", 4000);
    } else if (res.info == 1) {
      message = res.message;
      popup(message, "", "info");
    }
  });

  bool = true;
}

bool = true;
if (window.location.pathname.startsWith("/admin/posts")) {
  if (!bool) pass;
  bool = false;
  var postsdiv = $(".posts");
  url = "/admin/posts";
  $.post(url, (res) => {
    if (res.success == 1) {
      var el = `<div class="table-responsive"><table class="table"><thead>
      <tr>
        <th>Delete</th>
        <th>Postid</th>
        <th>Userid</th>
        <th>Username</th>
        <th>Fullname</th>
        <th>Attachments</th>
        <th>Article</th>
        <th>Counts</th>
        <th>Created at</th>
        <th>Updated at</th>
        <th>UserVerified</th>
        <th>UserSuspend</th>
        <th>PostVisibility</th>
      </tr>
    </thead><tbody>`;
      result = res.result;
      console.log(result);
      result.forEach((item) => {
        let classname = "";
        item.verified ? (classname = "info") : "";
        item.suspend ? (classname = "warning") : "";
        item.verified && item.suspend ? (classname = "warninginfo") : "";
        let likes = item.post.counts[0],
          dislikes = item.post.counts[1],
          comments = item.post.counts[2];
        el += `<tr class="${classname}">
                  <td><button type="button" class="btn btn-danger event" event="deletepost" id="${
                    item.postid
                  }">Delete Post</button</td>
                  <td><span class="copy">${item.postid}</span></td>
                  <td><span class="copy">${item.userid}</span></td>
                  <td><span><a href="/${item.username}">${item.username}</a></span></td>
                  <td><span class="copy">${item.fullname}</span></td>
                  <td><span>${item.post.attacments}</span></td>
                  <td style="min-width:100px"><span>${item.post.article}</span></td>
                  <td style="min-width:100px" class="${item.post.comment ? 'danger' : ''}">${item.post.comment}<span></span></td>
                  <td><span style="min-width:110px">${likes} likes<br>${dislikes} dislikes<br>${comments} comments </span></td>
                  <td>${item.post.createdAt}</td>
                  <td>${item.post.updatedAt}</td>
                  <td><span class="copy">${item.verified}</span></td>
                  <td><span class="copy">${item.suspend}</span></td>
                  <td><span class="copy">${item.visibility}</span></td>
              </tr>`;
      });
      el += `</tbody></table></div>`;
      postsdiv.append(el);
      var allCopybuttons = document.querySelectorAll(".copy");
      allCopybuttons.forEach((button) => {
        button.addEventListener("click", (e) => {
          copyToClipboard(button);
          message = `Successfully copied to clipboard.`;
          popup(message, "auto", "success", 3000);
        });
      });

      var allbuttons = document.querySelectorAll(".event");
      allbuttons.forEach((button) => {
        button.addEventListener("click", (e) => {
          adminEvent(e);
        });
      });
    } else if (res.error == 1) {
      message = res.message;
      popup(message, "auto", "warning", 4000);
    } else if (res.info == 1) {
      message = res.message;
      popup(message, "", "info");
    }
  });

  bool = true;
}
function adminEvent(e) {
  let prev = e.currentTarget.previousElementSibling;
  let event = e.currentTarget.getAttribute("event");
  let id = e.currentTarget.getAttribute("id");
  console.log(event, id, prev);

  let url = "/admin/event";
  data = {
    event,
    id,
  };
  $.post(url, data, (res) => {
    if (res.status === 0) {
      let path = location.pathname.replace("/", "");
      let url = `admin/login?l=false&redirect=${path}`;
      window.location.replace(`${location.origin}${url}`);
    } else if (res.error == 1) {
      let message = res.message;
      popup(message, "auto", "danger", 3000);
    } else if (res.success === 1) {
      let className = ``;
      switch (event) {
        case `suspend`:
          className = "warning";
          break;
        case `verified`:
          className = "info";
          break;

        default:
          break;
      }
      if (event != `visibility`) {
        if (prev.textContent == `true`) {
          prev.innerHTML = `false`;
          e.target.parentNode.parentNode.classList.remove(className);
          e.target.parentNode.parentNode.classList.remove("warninginfo");
        } else {
          prev.innerHTML = `true`;
          e.target.parentNode.parentNode.classList.add(className);
        }
      }
      console.log(e.target.parentNode.parentNode);
      console.log(e.target.parentNode.parentNode.classList);
    } else if (res.delete == 1) {
      e.target.parentNode.parentNode.remove();
      let message = res.message;
      popup(message, "auto", "success", 3000);
    }
  });
}

var notifBool = true;
if (window.location.pathname.startsWith("/admin/sendnotif")) {
  let button = document.querySelector("#sendnotifbtn");
  button.addEventListener("click", (e) => {
    if (notifBool) {
      notifBool = false;
      let url = "/admin/sendnotif";
      let data = $("#sendnotifform").serialize();
      $.post(url, data, (res) => {
        if (res.status === 0) {
          let path = location.pathname.replace("/", "");
          let url = `/admin/login?l=false&redirect=${path}`;
          window.location.replace(`${location.origin}${url}`);
        } else if (res.info === 1) {
          let message = res.message;
          popup(message, "auto", "info", 3000);
        } else if (res.error === 1) {
          let message = res.message;
          popup(message, "auto", "danger", 3000);
        } else if (res.success === 1) {
          let message = res.message;
          popup(message, "auto", "success", 3000);
        }
        notifBool = true;
      });
    }
  });
}
