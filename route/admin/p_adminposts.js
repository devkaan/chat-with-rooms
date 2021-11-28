module.exports = async function (req, res) {
  const bcrypt = require("bcrypt");
  const saltRounds = 10;
  var { Admin, User, Post } = require("../../models/blogs");
  const { formatDate } = require("../../lib/tools");
  if (!req.session.adminusername) return res.json({ status: 0 });
  const fs = require("fs");
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
  var countObj = { users: 10000000, posts: 10000000, reports: 100000000 };
  var userpath = "forbidden/users/user";
  var postpath = "forbidden/posts/post";
  let postLimit = 25;
  let posts = await Post.find({}).limit(postLimit).select("-_id");
  let result = [];
  if (posts.length < 1)
    return res.json({ info: 1, message: `There is no post.` });
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (!post.userid) continue;
    let current_user = await User.findOne({ userid: post.userid })
      .limit(postLimit)
      .select("-_id");

    let postObj = {
      postid: post.postid,
      userid: post.userid,
      username: `deleted_user`,
      fullname: `deleted_user`,
      post: {
        attacments: "",
        article: "",
        counts: [null, null, null],
        createdAt: "null",
        updatedAt: "null",
        comment: "ENOENT: no such file."
      },
      verified: current_user.verified,
      suspend: current_user.suspend,
      visibility: current_user.visibility,
    };
    if (current_user.username) postObj.username = current_user.username;
    if (current_user.fullname) postObj.fullname = current_user.fullname;

    result.push(postObj);
    postfilepath = postpath + post.postid + ".json";
    try {
      postfile = await getJSON(postfilepath);
      postObj.post = {
        attacments: post.attacments,
        article: post.article,
        counts: [postfile.likes.c, postfile.dislikes.c, postfile.comments.c],
        createdAt: formatDate(post.createdAt, "timeago"),
        updatedAt: formatDate(post.updatedAt, "timeago"),
      };
    } catch (error) {
      let err =
        error.errno == -4058
          ? `Error: ENOENT: no such file or directory. ${postfilepath}`
          : `There is an other error EVENT_10`;
      console.log(err);
      if (i + 1 == posts.length) {
        return res.json({
          success: 1,
          result,
        });
      }
      continue;
    }
    if (i + 1 == posts.length) {
      return res.json({
        success: 1,
        result,
      });
    }
  }
};
