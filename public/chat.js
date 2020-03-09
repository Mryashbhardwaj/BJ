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
  console.log("you are master now");
  alert("welcome master");
  isMaster = true;
}
function updateLib(data) {
  data.forEach((element) => {
    musicLibrary.innerHTML += `<lable onclick='play("${element}")'> # ${element}</lable><br><br>`;
  });
}
var initialised = false;
$.get("/filelist", function(data) {
  updateLib(data);
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
  updateLib(data.musicLibrary);
});
function setSong(song) {
  bjAudio.setAttribute("src", "music/" + song);
  nowPlaying.textContent = song;
}

function play(elementname) {
  if (isMaster) {
    console.log(elementname);
    setSong(elementname);
    socket.emit("changeSong", elementname);
    bjAudio.play();
  }
}
socket.on("chat", (data) => {
  output.innerHTML +=
    "<p><strong>" + data.handle + ": </strong>" + data.message + "</p>";
});
socket.on("feedback", (data) => {
  feedback.innerHTML = "<p><em>" + data.handle + " is typing ... </em></p>";
});
socket.on("initialise", (data) => {
  bjAudio.load();
  bjAudio.currentTime = data.progress;
  initialised = true;
  bjAudio.play();
});
socket.on("changeSong", (songName) => {
  bjAudio.load();
  setSong(songName);
  initialised = true;
  bjAudio.play();
});

// clear the typing feedback
setInterval(() => {
  feedback.innerHTML = "";
}, 3000);
