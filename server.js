//Server setup
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const path = require("path");

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

//const cookieParser = require('cookie-parser');
//require('dotenv').config();

app.use(express.json());

app.use(express.static("views"));
app.set("view engine", "ejs");

app.use(cors());

//app.use(cookieParser());

app.get("/", (req, res) => {
  res.render(__dirname + "/views/index.ejs");
});

var server = app.listen(port, function (error) {
  if (error) throw error;
  console.log("Express server listening on port, ", port);
});
