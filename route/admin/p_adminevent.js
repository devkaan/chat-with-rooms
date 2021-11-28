module.exports = async function p_login(req, res, User) {
  const fs = require("fs");
  var { Admin, User, Post } = require("../../models/blogs");
  var { deleteFolderRecursive } = require("../../lib/tools");
  var userpath = "forbidden/users/user";
  var postpath = "forbidden/posts/post";
  if (!req.session.adminusername) return res.json({ status: 0 });
  if (!req.body.event) {
    let message = `Event is not defined`;
    return res.json({ error: 1, message });
  } else if (!req.body.id) {
    let message = `Id is not defined`;
    return res.json({ error: 1, message });
  }
  var id = req.body.userid;
  var event = req.body.event;
  let filter = { userid: id };
  let update = {};
  let user = ``;
  let message = ``;
  var fullPath = ``;
  switch (event) {
    case `suspend`:
      user = await User.findOne(filter);
      if (!user) {
        message = `The user you are looking for could not be found. EVENT_2`;
        return res.json({ error: 1, message });
      }
      update = { suspend: true };
      if (user.suspend) update = { suspend: false };
      break;
    case `visibility`:
      user = await User.findOne(filter);
      if (!user) {
        message = `The user you are looking for could not be found. EVENT_2`;
        return res.json({ error: 1, message });
      }
      update = { visibility: true };
      if (user.visibility) update = { visibility: false };
      break;
    case `verified`:
      user = await User.findOne(filter);
      if (!user) {
        message = `The user you are looking for could not be found. EVENT_2`;
        return res.json({ error: 1, message });
      }
      update = { verified: true };
      if (user.verified) update = { verified: false };
      break;
    case `delete`:
      user = await User.findOne(filter);
      if (!user) {
        message = `The user you are looking for could not be found. EVENT_2`;
        return res.json({ error: 1, message });
      }
      try {
        let user = await User.deleteOne(filter);
      } catch (error) {
        console.log(`EVENT_3 ERROR => `, error);
        return res.json({
          error: 1,
          message: `There is an error while posting. Please try again later. EVENT_3`,
        });
      }
      fullPath = `${userpath}${user.userid}`;
      await deleteFolderRecursive(fullPath);
      return res.json({
        delete: 1,
        message: `User deleted successfuly.`,
      });
      break;
    case `deletepost`:
      id = req.body.id;
      filter = { postid: id };
      let post;
      try {
        post = await Post.deleteOne(filter);
      } catch (error) {
        console.log(`EVENT_5 ERROR => `, error);
        return res.json({
          error: 1,
          message: `There is an error while deleting post. Please try again later. EVENT_5`,
        });
      }
      fullPath = `${postpath}${id}.json`;
      fs.unlink(fullPath, (err) => {
        if (err) console.log(err);
      });
      return res.json({
        delete: 1,
        message: `Post deleted successfuly.`,
      });
      break;

    default:
      return res.json({ error: 1, message: `Event is not defined. EVENT_4` });
      break;
  }
  let user2 = await User.findOneAndUpdate(filter, update);
  if (!user2)
    return res.json({
      error: 1,
      message: `There is an error while updating the user. EVENT_1`,
    });
  return res.json({
    success: 1,
  });
};
