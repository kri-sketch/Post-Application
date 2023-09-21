const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postsRoute = require("./routes/posts");

const app = express();

mongoose
  .connect(
    "mongodb+srv://ksharmadatascience:krishnaSharma123@cluster0.tiivi1l.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection Failed");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoute);

module.exports = app;

module;
