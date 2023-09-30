const express = require("express");
const Post = require("../models/post");
const router = express.Router();

const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }

    cb(error, "backend/images/");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    const finalFileName = name + "-" + Date.now() + "." + ext; // Define finalFileName here
    cb(null, finalFileName); // Use finalFileName in the callback
  },
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Both title and content are required." });
    }

    const post = new Post({
      title: title,
      content: content,
      imagePath: url + "/backend/images/" + req.file.filename,
    });

    post.save().then((createdPost) => {
      res.status(201).json({
        message: "Post added Successfully",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    });
  }
);

router.get("", (req, res, next) => {
  Post.find().then((documents) => {
    console.log(documents);
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: documents,
    });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Successfully deleted" });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.put("/:id", (req, res, next) => {
  Post.updateOne({ _id: req.params.id }, req.body).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Update successful!" });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

module.exports = router;
