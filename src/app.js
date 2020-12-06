const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

//route config
const userRoute = require("./routes/user");

const PORT = 3000;
//connectiong to the database
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://anand:BmeOyUYgPrXBRUfh@cluster0.p4wby.mongodb.net/user-registration?retryWrites=true",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

//creating app with express
const app = express();

//parsing the incoming data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, useNewUrlParser: true }));

//image config
app.use("/images", express.static(path.join(__dirname, "images")));

//setting the CORS policy of headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH,OPTIONS"
  );
  next();
});

// calling api
app.use("/api", userRoute);

app.listen(PORT, () => {
  console.log(`server is running on post :${PORT}`);
});
