const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const path = require("path");


// app.use(express.static(path.join(__dirname, "src")));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/chat/*", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  const default_room = "some room"
  socket.join(default_room)
  socket.on("send-message", (message, room, socketid) => {
    console.log(`ROOMS: `,socket.rooms);
    if(!room){
      socket.broadcast.emit("receive-message", message, room, socketid)
    } else{
      io.to(room).emit("joined-to-channel", socketid)
      io.to(room).emit("receive-message", message, room, socketid)
    }
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
