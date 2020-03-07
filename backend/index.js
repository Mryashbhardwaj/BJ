const express = require("express");
const socket = require("socket.io");

const app = express();

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use(express.static("public"));

const server = app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});

// socket setup

const io = socket(server);

io.on("connection", function(socket) {
  console.log("made scoket connection ");
});
