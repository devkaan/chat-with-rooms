module.exports = async (req, res) => {
    const { User } = require("../../models/blogs");
    const { formatDate } = require("../../lib/tools");
    const fs = require("fs");
    var userpath = "forbidden/users/user";
    var postpath = "forbidden/posts/post";
    if (!req.session.adminusername) res.json({ status: 0});
    var getJSON = (fullpathname) => {
      return new Promise((resolve, reject) => {
        fs.readFile(fullpathname, (err, data) => {
          if (err) {
            reject(err); // calling `reject` will cause the promise to fail with or without the error passed as an argument
            return; // and we don't want to go any further
          }
          resolve(JSON.parse(data));
        });
      });
    };
    if (!req.body.notiftype)
      return res.json({ error: 1, message: `You should write a notiftype` });
    var new_userids = [];
    if (req.body.userids) {
      var userids = req.body.userids;
      new_userids = userids.split(",");
    }
    let filter = {};
    if (new_userids.length > 0) filter = { userid: new_userids };
    let notiftype = req.body.notiftype;
    let notifcontent = req.body.notifcontent;
    var allUsers = await User.find(filter);
    if (allUsers.length < 1 || !allUsers)
      return res.json({
        error: 1,
        message: `There is no user(s) with these id(s) [${new_userids}]. SEND_NOTIF_2`,
      });
    for (var i = 0; i < allUsers.length; i++) {
      let user = allUsers[i];
      if (!user) continue;
      // if (user.username == "kaan") continue;
      let fullPath = `${userpath}${user.userid}/notifications.json`;
      if (!fs.existsSync(fullPath)) {
        console.log(
          `USER_FILE_NOT_FOUND_1 username: ${user.username} => ${fullPath}`
        );
        continue;
      }
      let postFile; 
      try {
        postFile = await getJSON(fullPath);
      } catch (error) {
        console.log(`USER_FILE_NOT_FOUND_2 => ${fullPath}`);
        continue;
      }
      let nid = 1;
      if (postFile.length > 0) nid = postFile[0].nid + 1;
      let notifObj = {
        username: "Admin",
        nid,
        userid: null,
        ncode: notiftype,
        ncontent: notifcontent,
        ntime: new Date(),
        read: false,
      };
      postFile.unshift(notifObj);
      fs.writeFile(fullPath, JSON.stringify(postFile), (err) => { 
        if (err)
          return res.json({
            error: 1,
            message: `There is a problem with sending notif. SEND_NOTIF_1`,
          });
      });
      // if last user
      if (i + 1 == allUsers.length) {
        return res.json({
          success: 1,
          message: `Notifications sent successfuly.`,
        });
      }
    }
  };
  