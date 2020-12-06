const express = require("express");
const multer = require("multer");

const userRouter = express.Router();

const User = require("../models/user");

//**********************using multer as a image middleware to store images**************** */

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "src/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

//********** calling post request ***************** */

userRouter.post(
  "/create-user",
  multer({ storage: storage }).single("image"),
  (req, res) => {
    console.log(req.body);
    const url = req.protocol + "://" + req.get("host");
    console.log(url);
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      imagePath: url + "/images/" + req.file.filename,
    });
    user
      .save()
      .then((data) => {
        console.log(data);
        res.status(201).json({
          message: "added successfully",
          post: data,
        });
      })
      .catch((err) => {
        return res.json({
          error: err,
        });
      });
  }
);

//*********listing the get Requests********************
userRouter.get("/get-users", (req, res, next) => {
  User.find()
    .then((documents) => {
      if (!documents) {
        return res.status(404).json({ message: "no user found" });
      }
      res.status(200).json({
        message: "fetched successfully",
        users: documents,
      });
    })
    .catch((err) => {
      return res.json({
        error: err,
      });
    });
});

module.exports = userRouter;
