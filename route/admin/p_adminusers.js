module.exports = async function p_login(req, res, User) {
  const bcrypt = require("bcrypt");
  const saltRounds = 10;
  var { Admin, User } = require("../../models/blogs");
  if (!req.session.adminusername) return res.json({ status: 0 });
  let userLimit = 25;
  let users = await User.find({}).limit(userLimit).select("-userpass -_id");
  return res.json({
    success: 1,
    result: users,
  });
};
