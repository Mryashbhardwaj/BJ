const express = require("express");
const socket = require("socket.io");
const formidable = require("formidable");
var fs = require("fs");
var socketConnection;
var musicLibrary = [];

var currentStatus = {
  song: "",
  time: 0,
  progress: 0
};
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
    var newpath = "public/music/" + files.filetoupload.name;
    fs.rename(oldpath, newpath, function(err) {
      res.write("File uploaded and moved!");
      res.end();
      musicLibrary.push(newFile);
      io.sockets.emit("libraryUpdate", { musicLibrary });
    });
  });
});

var server = app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});

var io = socket(server);

io.on("connection", function(socket) {
  // get Library Update
  console.log(socket);
  socketConnection = socket;
  socket.on("initialise", () => {
    socket.emit("initialise", currentStatus);
  });

  socket.on("chat", (data) => {
    console.log(data);
    io.sockets.emit("chat", data);
  });
  socket.on("pause", () => {
    socket.broadcast.emit("pause");
  });

  socket.on("changeSong", (status) => {
    console.log(status);
    currentStatus = status;
    socket.broadcast.emit("changeSong", status);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
});
