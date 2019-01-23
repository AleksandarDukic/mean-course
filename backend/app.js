const path = require('path');
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");

const app = express();

mongoose.connect("mongodb+srv://max:iJmfNTc6lmHHADQZ@cluster0-e5iof.mongodb.net/node-angular?retryWrites=true")
  .then(() => {
    console.log('Connected to database!')
  })
  .catch(() => {
    console.log('Connection failed');
  })


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join("backend/images")));    // omogucavamo slobodan poziv na /images, koristimi paket path da bi bilo bezbedno da radi na svakoj masini


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
})

app.use("/api/posts", postsRoutes);

module.exports = app;

// USER: max PASSWORD: iJmfNTc6lmHHADQZ
