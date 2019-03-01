const express = require("express");


const PostController = require("../controllers/posts");

const checkAuth = require('../middleware/check-auth');  // dodaje se u middleware, posle puta ali pre logike
                                                        // prosledjujemo samo referncu na funkciju checkAuth, bez () jer ce je express izvrsiti
const extractFile = require('../middleware/file')
const router = express.Router();


router.post("", checkAuth, extractFile, PostController.createPost);

router.put("/:id", checkAuth, extractFile, PostController.updatePost);

router.get("", PostController.getPosts);

router.get("/:id", checkAuth, PostController.getPost)

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
