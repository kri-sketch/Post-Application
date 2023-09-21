const express = require("express");
const Post = require("../models/post");
const router = express.Router();

router.post("", (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ message: "Both title and content are required." });
  }

  const post = new Post({
    title: title,
    content: content,
  });

  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added Successfully",
      postId: createdPost._id,
    });
  });
});

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
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  });
});

module.exports = router;
