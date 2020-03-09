const express = require("express");
const socket = require("socket.io");
const formidable = require("formidable");
var fs = require("fs");

var musicLibrary = [];

// read files in music library when server on
fs.readdir("public/music", (err, list) => {
  musicLibrary = list;
  console.log(musicLibrary);
});

const app = express();
app.use(express.static("public"));

// routes
app.post("/fileupload", (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var oldpath = files.filetoupload.path;
    var newpath = "public/music/" + files.filetoupload.name;
    fs.rename(oldpath, newpath, function(err) {
      if (err) throw err;
      res.write("File uploaded and moved!");
      res.end();
    });
  });
});

var server = app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});

var io = socket(server);

io.on("connection", function(socket) {
  // get Library Update

  socket.emit("libraryUpdate", {
    nowPlaying: "sample.mp3",
    // servertime: time.getTime(),
    progress: 23
  });
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
