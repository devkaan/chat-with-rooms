var express = require('express');
var router = express.Router();
const { Match, Count } = require('../models/models');
const { getAndIncreaseCount, notEndedMatch } = require('../lib/tools');

router.get('/matchmaking', function (req, res) {
    if (!req.session.username) res.redirect('/login?l=false');
    res.render('index');
})
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

router.post('/matchmaking', async function (req, res) {
    var onlyAgainstComputer = true;
    if (!req.session.username) res.redirect('/login?l=false');
    const username = req.session.username;
    const userid = req.session.userid;

    let notEndedMatch = await notEndedMatch(userid,res);
    if (!notEndedMatch) return res.json({ data: { status: 2 } });d
    // return


    var gameMode = req.body.gameMode;
    const personMode = req.body.personMode;
    if (!gameMode) gameMode = 2;
    if (personMode == "againstComputer") onlyAgainstComputer = true; // 22nd line for who can change the value of radio button of client side.

    let matchid = 1;
    let counts = await getAndIncreaseCount('gameCount');
    // return;
    if (counts.gameCount) matchid = counts.gameCount;

    let matchObj = {
        matchid: matchid,
        users: userid + ";",
        gameMode: gameMode,
        gameEnd: false,
        winner: null,
        onlyAgainstComputer: onlyAgainstComputer,
        createdAt: Date.now(),
    }
    let match = new Match(matchObj).save().catch((err) => {
            console.log("\nSTART_MATCH_ERROR =>\n", err);
        });
    let data = {
        success: true
    }
    return res.json({ data: data })
})

module.exports = router;