const express = require("express");
const router = express.Router();
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const port = process.env.PORT || 3000;
console.clear();
const session = require("express-session");
const path = require("path");
const fs = require("fs");
require("dotenv").config(); //process.env.
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// For parsing application/json
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  // console.log();
  next()
})
app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      ///
      // httpOnly: false, // minimize risk of XSS attacks by restricting the client from reading the cookie
      // secure: false, // only send cookie over https
      maxAge: 604800000, // set cookie expiry length in ms // 604800000 = 1 week
    },
  })
);

var database = require('./route/database');

var index = require('./route/index');
var login = require('./route/login');
var signup = require('./route/signup');
app.use(index);
app.use(login);
app.use(signup);
var addToMatchmaking = require('./route/addToMatchmaking');
app.use(addToMatchmaking);
var game = require('./route/game');
app.use(game);
var playGround = require('./route/playGround');
app.use(playGround);

let clientNo = 0;
var currentUsers = 0
io.on("connection", (socket) => {
  currentUsers++
  console.log(`One user joined. Current users: ${currentUsers}`);
  console.log(socket.id, "is joined!!\n");
  // clientNo++;
  // // socket.join(matchid);
  // if (clientNo > 2) {
  //     console.log('viewer');
  // }
  // else if (clientNo % 2 == 0) {
  //     console.log('first user');
  // }
  // else if (clientNo % 2 == 1) {
  //     console.log('second user');
  // }
  socket.on("guess", data => {
      console.log("guess =>", data);
  }) 
});

// http.listen(port, () => {
//   console.log(`http://localhost:${port}/`);
// });
server.listen(port, () => {
  console.log('Server listening at https://127.0.0.1:%d', port);
  console.log();
});