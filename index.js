const express = require("express");
const socket = require("socket.io");
const formidable = require("formidable");
var fs = require("fs");
var socketConnection;
var musicLibrary = [];

// read files in music library when server on
fs.readdir("public/music", (err, list) => {
  musicLibrary = list;
  console.log(musicLibrary);
});

const app = express();
app.use(express.static("public"));

// routes
app.get("/filelist", (req, res) => {
  res.send(musicLibrary);
});
app.post("/fileupload", (req, res) => {
  var form = new formidable.IncomingForm();
  var newFile;
  form.parse(req, function(err, fields, files) {
    var oldpath = files.filetoupload.path;
    newFile = files.filetoupload.name;
    console.log(newFile);
    var newpath = "public/music/" + files.filetoupload.name;
    fs.rename(oldpath, newpath, function(err) {
      res.write("File uploaded and moved!");
      res.end();
    });
  });
  console.log(newFile);
  musicLibrary.push(newFile);
  socketConnection.emit("libraryUpdate", { musicLibrary });
});

var server = app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});

var io = socket(server);

io.on("connection", function(socket) {
  // get Library Update
  socketConnection = socket;
  socket.on("initialise", (data) => {
    var time = new Date();
    socket.emit("initialise", {
      nowPlaying: "sample.mp3",
      servertime: time.getTime(),
      progress: 23
    });
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
