var socket = io.connect("http://" + window.location.host);

// query dom
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var btn = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var bjAudio = document.getElementById("bjAudio");
var form = document.getElementById("musicSubmit");
var songtitle = document.getElementById("songtitle");
var nowPlaying = document.getElementById("nowPlaying");
var musicLibrary = document.getElementById("musicLibrary");

var files = [];
var isMaster = false;
var lag = 0;
bjAudio.controls = true;

form.addEventListener(
  "submit",
  function(ev) {
    var oOutput = document.getElementById(uploadresponse),
      oData = new FormData(form);

    oData.append("CustomField", "This is some extra data");

    var oReq = new XMLHttpRequest();
    oReq.open("POST", "fileupload", true);
    oReq.onload = function(oEvent) {
      if (oReq.status == 200) {
        oOutput.innerHTML = "Uploaded!";
        setTimeout(() => {
          oOutput.innerHTML = "";
        }, 1000);
      } else {
        oOutput.innerHTML =
          "Error " +
          oReq.status +
          " occurred when trying to upload your file.<br />";
      }
    };

    oReq.send(oData);
    ev.preventDefault();
  },
  false
);
function setSong(song) {
  bjAudio.setAttribute("src", "music/" + song);
  nowPlaying.textContent = song;
}
function getTime() {
  const time = new Date();
  return time.getTime();
}
function beMaster() {
  console.log("you are master now");
  alert("welcome master");
  isMaster = true;
  bjAudio.controls = true;
}
function sync() {
  if (isMaster) {
    socket.emit("sync", { time: getTime() });
  }
}

function play(elementname) {
  if (isMaster) {
    setSong(elementname);
    initialised = true;
    bjAudio.play();
  }
}
function updateLib(data) {
  data.forEach((element, index) => {
    musicLibrary.innerHTML += `<lable onclick='play("${element}")'> ${index +
      1}.) ${element}</lable><br><br>`;
  });
}

var initialised = false;
$.get("/filelist", function(data) {
  updateLib(data);
});

socket.on("sync", (data) => {
  lag = getTime() - data.time;
  console.log("lag->", lag);
});
function joinParty() {
  socket.emit("initialise", {});
}
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
  if (isMaster) {
    socket.emit("changeSong", {
      song: bjAudio.getAttribute("src").slice(6),
      time: getTime(),
      progress: bjAudio.currentTime
    });
  }
};

bjAudio.onpause = () => {
  if (isMaster) {
    socket.emit("pause", {});
  }
};

// listen for events
socket.on("libraryUpdate", (data) => {
  musicLibrary.innerHTML = "";
  updateLib(data.musicLibrary);
});
socket.on("pause", () => {
  bjAudio.pause();
});

socket.on("chat", (data) => {
  output.innerHTML +=
    "<p><strong>" + data.handle + ": </strong>" + data.message + "</p>";
});
socket.on("feedback", (data) => {
  feedback.innerHTML = "<p><em>" + data.handle + " is typing ... </em></p>";
});
function syncSong(status) {
  setSong(status.song);
  console.log(status);
  var temp = status.progress + Math.floor(getTime() - status.time) / 1000;
  bjAudio.currentTime = temp;
  // console.log(bjAudio.currentTime);
}

socket.on("initialise", (status) => {
  syncSong(status);
  initialised = true;
  bjAudio.play();
});

socket.on("changeSong", (status) => {
  syncSong(status);
  initialised = true;
  bjAudio.play();
});

// clear the typing feedback
setInterval(() => {
  feedback.innerHTML = "";
}, 3000);
