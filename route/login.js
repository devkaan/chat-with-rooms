var express = require('express');
var router = express.Router();
const app = express();
const http = require("http").Server(app);
const bcrypt = require("bcrypt");
const saltRounds = 10;
var { User } = require("../models/models");

app.set("view engine", "ejs");
router.get('/login', (req, res) => {
    res.render(`login`)
})

router.post('/login', async (req, res) => {
    var username = req.body.username ?? ``;
    var userpass = req.body.userpass ?? ``;

    if (!username) {
        return res.json({
            message: "You should write a username.",
            error: 1,
        });
    } else if (!userpass) {
        return res.json({
            message: "You should write your password.",
            error: 1,
        });
    } else {
        let result = await User.findOne({ username });
        if (!result) {
            return res.json({
                message: `There is no user with this name.`,
                error: 1,
            });
        }
        let loginResult = await bcrypt.compare(userpass, result.userpass);

        if (loginResult) {
            req.session.username = result.username;
            req.session.userid = result.userid;
            
            return res.json({
                success: 1,
            });
        } else {
            return res.json({
                message: "Your password is wrong",
                error: 1,
            });
        }
    }
})
module.exports = router;