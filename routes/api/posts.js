const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const validatePostInput = require("../../validation/post");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// @route   GET api/posts/test
// @desc    Tests posts routes
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "POsts Work" }));

// @route   CREATE api/posts
// @desc    Create posts routes
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    console.log(req.body);
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

// @route   GET api/posts
// @desc    Get posts routes
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ noposts: "No posts found" }));
});

// @route   GET api/posts/:id
// @desc    Get posts routes
// @access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopost: "No post found" }));
});

// @route   DELETE api/posts
// @desc    Delete posts routes
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() != req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User is not authorized." });
          }

          post.remove().then(res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post." });
          } else {
            post.likes.unshift({ user: req.user.id });
            post.save().then(post => res.json(post));
          }
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "You cannot unlike one you didn't like" });
          } else {
            const removeIndex = post.likes
              .map(item => item.user.toString())
              .indexOf(req.user.id);

            post.likes.splice(removeIndex, 1);
            post.save().then(post => res.json(post));
          }
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to posts
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment of posts
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.comments.filter(
            comment =>
              (comment._id.toString() === req.params.comment_id.length) === 0
          )
        ) {
          return res.status(404).json({ nocomment: "No comment exists." });
        }
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
  }
);

module.exports = router;
