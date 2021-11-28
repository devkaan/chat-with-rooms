var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
var { User } = require("../models/models");

router.get('/signup', (req, res) => {
  res.render("signup")
})

router.post('/signup', async (req, res) => {
  var {
    createAlternativeUsername,
    createFolders,
    getAndIncreaseCount,
    isForbiddenUsername,
  } = require("../lib/tools.js");
  var unameReg = /^\w+$/;
  var fnameReg = /^[a-zA-Z0-9 ğüşöçİĞÜŞÖÇ]+$/; // with spaace
  var bioReg = /^[a-zA-Z0-9ğüşöçİĞÜŞÖÇ!@#$₺€%^&*() _+"'-]+$/; // with space
  var emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var patt = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  username = req.body.username.trim().toLowerCase() || null;
  userpass = req.body.userpass.trim() || null;
  fullname = req.body.fullname.trim() || null;
  email = req.body.email.trim().toLowerCase() || null;

  if (!emailReg.test(String(email)))
    return res.json({
      message: "Please enter a valid email, for example: example@mail.com",
      error: 1,
    });
  else if (!fullname) return res.json({ message: "Please write a name", error: 1 });
  else if (fullname.length < 2)
    return res.json({ message: "Fullname must be minimum 2 character", error: 1 });
  else if (!fnameReg.test(fullname))
    return res.json({
      message: "Allowed characters for fullname: A-Za-z0-9_çıüğöşİĞÜÖŞÇ",
      error: 1,
    });
  else if (!username)
    return res.json({ message: "Please write an username.", error: 1 });
  else if (username.length < 4)
    return res.json({ message: "Username must be minimum 4 character.", error: 1 });
  else if (isForbiddenUsername(username))
    return res.json({ message: "You can not use this username.", error: 1 });
  else if (!unameReg.test(username))
    return res.json({
      message: "Allowed characters for username: A-Za-z0-9_",
      error: 1,
    });
  // create function for forbidden usernames: ataturk etc...
  let u = await User.findOne({ username });
  if (u) {
    return res.json({
      message: "Username is exist try something else.",
      error: 1,
      alternatives: await createAlternativeUsername(username, 4),
    });
  } else if (isForbiddenUsername(username))
    return res.json({ message: "You can not use this username.", error: 1 });
  else if (!userpass)
    return res.json({ message: "You should write a password", error: 1 });
  else if (userpass.length < 6)
    return res.json({ message: "Password must be minimum 6 character.", error: 1 });
  else {
    userpass = await bcrypt.hash(userpass, saltRounds);
    userObj = {
      email,
      fullname,
      username,
      userpass,
      suspend: false,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // // return

    const user = new User(userObj)
      .save()
      .then(async (result) => {
        if (!result) {
          return res.json({
            message: "Sign up is not successfuly, please try again.",
            error: 1,
          });
        } else {
          var userCount = await getAndIncreaseCount("userCount");
          userCount
            ? (userObj.userid = Number(userCount.users))
            : (userObj.userid = countObj.users);
          return res.json({ success: 1 });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.json({
          message: "Sign up is not successfuly, please try again later.",
          error: 1,
        });
      });
  }
})

module.exports = router;