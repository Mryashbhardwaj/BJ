var socket = io.connect("http://" + window.location.host);

// query dom
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var btn = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");

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

socket.emit("initialise", {});

// listen for events
socket.on("chat", (data) => {
  output.innerHTML +=
    "<p><strong>" + data.handle + ":</strong>" + data.message + "</p>";
});
socket.on("feedback", (data) => {
  feedback.innerHTML = "<p><em>" + data.handle + " is typing ... </em></p>";
});
socket.on("initialise", (data) => {
  // feedback.innerHTML = "<p><em>" + data.handle + " is typing ... </em></p>";
  console.log(data);
});

// clear the typing feedback
setInterval(() => {
  feedback.innerHTML = "";
}, 3000);
