var express = require('express');
var router = express.Router();
const { notEndedMatch } = require('../lib/tools');

router.get('/', async function (req, res) {
  if (!req.session.username) res.redirect('/login?l=false');
  let x = await notEndedMatch(req.session.userid, res);
  if(!x) return res.render('index', { username: req.session.username });
})

module.exports = router;