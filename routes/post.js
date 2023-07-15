const router = require("express").Router();
const {
  createPost,
  allPosts,
  getPostBySlug,
  getPostByAuthor,
  updatePost,
  deletePost,
} = require("../controllers/post");
const isLoggedin = require("../middlewares/isLoggedIn");

router.get("/posts", allPosts);
router.post("/create-post", isLoggedin, createPost);
router.get("/posts/author", getPostByAuthor);
router.get("/posts/:slug", getPostBySlug);
router.put("/posts/:slug", isLoggedin, updatePost);
router.delete("/posts/:slug", isLoggedin, deletePost);

module.exports = router;
