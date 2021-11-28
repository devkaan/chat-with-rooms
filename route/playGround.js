var express = require('express');
var router = express.Router();
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { Match } = require('../models/models');

router.get('/play', async function (req, res) {
    if (!req.session.username) res.redirect('/login?l=false');
    const username = req.session.username;
    const userid = req.session.userid;
    let match = await Match.findOne({ 
        users: { $regex: userid },
        gameEnd: false
    });
    // console.log("playground.js match =>",match);
    if(!match){
        res.redirect('/');
    }
    const onlyAgainstComputer = match.onlyAgainstComputer;
    if(onlyAgainstComputer){
        
    }

    res.render('playGround', {data: {
        matchInfo: match,
        username: username
    }});
});


module.exports = router;