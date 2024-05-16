//Server setup
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const path = require("path");


//const cookieParser = require('cookie-parser');
//require('dotenv').config();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'views')));
app.set("view engine", "ejs");


app.use(cors());

//app.use(cookieParser());

app.get("/", (req, res) => {
  res.render(__dirname + "/views/index.ejs");
});

app.get("/moveStock", (req, res) => {
  res.render(__dirname + "/views/moveStock.ejs");
})

app.get("/prototype", (req, res) => {
  res.render(__dirname + "/views/prototype.ejs");
})

app.get("/predictions", (req, res) => {
  res.render(__dirname + "/views/predictions.ejs");
})

//Require routes
const stock = require('./routes/stock.routes');
app.use('/api/stock', stock);

var server = app.listen(port, function (error) {
  if (error) throw error;
  console.log("Express server listening on port, ", port);
});