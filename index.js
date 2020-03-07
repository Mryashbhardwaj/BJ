const express = require("express");
const app = express();

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use(express.static("public"));

app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});
