var socket = io.connect("http://" + window.location.host);

// query dom
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var btn = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var bjAudio = document.getElementById("bjAudio");
var musicSubmit = document.getElementById("musicSubmit");
var songtitle = document.getElementById("songtitle");
var nowPlaying = document.getElementById("nowPlaying");
var musicLibrary = document.getElementById("musicLibrary");

var isMaster = false;
function beMaster() {
  isMaster = true;
}

var initialised = false;
$.get("/filelist", function(data) {
  data.forEach((element) => {
    musicLibrary.innerHTML += "<lable>" + element + "</lable><br>";
  });
});

// emiting events
btn.addEventListener("click", (event) => {
  console.log("called click");
  socket.emit("chat", {
    message: message.value,
    handle: handle.value
  });
  message.value = "";
});

message.addEventListener("keypress", function() {
  console.log("keypress");
  socket.emit("feedback", {
    handle: handle.value
  });
});
bjAudio.onplay = () => {
  if (!initialised) {
    socket.emit("initialise", {});
    bjAudio.pause();
  }
};

// listen for events
socket.on("libraryUpdate", (data) => {
  musicLibrary.innerHTML = "";
  data.musicLibrary.forEach((element) => {
    musicLibrary.innerHTML += "<lable>" + element + "</lable><br>";
  });
});
socket.on("chat", (data) => {
  output.innerHTML +=
    "<p><strong>" + data.handle + ": </strong>" + data.message + "</p>";
});
socket.on("feedback", (data) => {
  feedback.innerHTML = "<p><em>" + data.handle + " is typing ... </em></p>";
});
socket.on("initialise", (data) => {
  bjAudio.load();
  //   var time = new Date();
  //   console.log(data.servertime);
  //   console.log(time.getTime());
  //   var lag = time.getTime() - data.servertime;
  //   console.log(data.progress);
  bjAudio.currentTime = data.progress;
  initialised = true;
  bjAudio.play();
});

// clear the typing feedback
setInterval(() => {
  feedback.innerHTML = "";
}, 3000);
