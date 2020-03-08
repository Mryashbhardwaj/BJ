function dodrop(event)
{
  var dt = event.dataTransfer;
  var files = dt.files;

  var count = files.length;
  output("File Count: " + count + "\n");

    for (var i = 0; i < files.length; i++) {
      output(" File " + (i+1)  + " : " + files[i].name + " " + files[i].size + "\n");
    }
}

function output(text)
{
  document.getElementById("output").textContent += text;
  //dump(text);
}