const express = require("express");
const socket = require("socket.io");
const app = express();
app.use(express.static("public"));

// routes
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});

var server = app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});

var io = socket(server);

io.on("connection", function(socket) {
  console.log(socket.id);
  console.log("made scoket connection");

  socket.on("initialise", (data) => {
    console.log("initi ");
    socket.emit("initialise", { init: "yash" });
  });

  socket.on("chat", (data) => {
    console.log(data);
    io.sockets.emit("chat", data);
  });

  socket.on("feedback", (data) => {
    console.log(data);
    socket.broadcast.emit("feedback", data);
  });
});
