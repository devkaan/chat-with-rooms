var express = require('express');
var router = express.Router();
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { Match } = require('../models/models')

router.get('/game', function (req, res) {
    if (!req.session.username) res.redirect('/login?l=false');
    res.redirect('/')
});


router.get('/game/:matchid', async function (req, res) {
    //   if(!req.session.username) res.redirect('/login?l=false');
    let gameMode = 2;
    let matchid = req.params.matchid;
    const onlyAgainstComputer = true;
    if (!onlyAgainstComputer) {
        let match = await Match.findOne({ matchid })
        gameMode = match.gamemode;
    }
    

    let randomMatch = await Match.findOne({});
    console.log('random =>', randomMatch, "random matchid", matchid);
    return res.render(`game`, { matchid, gameMode, onlyAgainstComputer })
})

module.exports = router;