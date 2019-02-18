const express = require("express");
const multer = require('multer');
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');  // dodaje se u middleware, posle puta ali pre logike
                                                        // prosledjujemo samo referncu na funkciju checkAuth, bez () jer ce je express izvrsiti
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images"); // put relativan u odnosu na server.js ---- cb je mesto gde multer upisuje
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post(
  "",
  checkAuth,
  multer({storage: storage}).single("image"),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");           // req.protocol vraca ili http ili https
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,              // file property stvara multer kao i filename
      creator: req.userData.userId
    });
  post.save().then(createdPost => {                               // createdPost je rezultat tj. napravljeni Post()
    res.status(201).json({
      message: 'Post added succesfully',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  });
});

router.put(
  "/:id",
  checkAuth,
  multer({storage: storage}).single("image"),
  (req ,res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
     _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if (result.nModified > 0) {
      res.status(200).json({ message: 'Update successful!' })
    } else {
    res.status(401).json({ message: 'Not authorized' })
    }
  });
});

router.get("",(req, res, next) => {
  // console.log(req.query);              // sa req.query vadimo iz url-a informaciju posle "?"
  const pageSize = +req.query.pagesize;    // .pagesize mi biramo ime. to su query parameters  // izvod iz query parametra je uvek string
  const currentPage = +req.query.page;     // a program hoce broj, a to radimo ako dodamo + ispred
  const postQuery = Post.find();          // Post.find() se poziva tek kada se pozove .then(() => {});
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize*(currentPage - 1))   // skip() je mongoose funkcija
      .limit(pageSize);
    }
  postQuery
    .then(documents => {
      fetchedPosts = documents;            // broj postova // ne moramo da chainujemo jos jedan then block jer ako je vec u then bloku
      return Post.count()                 // stvorice se novi "promise" i njegov rezultat ce se automatski slusati
    })                                     // moramo da storujemo dokumenta
    .then(count => {
     res.status(200).json({
       message: "Posts fetched sccessfully",
       posts: fetchedPosts,
       maxPosts: count
      })
    })
});


router.get("/:id", checkAuth, (req, res, next) =>{
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found'});
    }
  })
})

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => { // req.params. Tu ide dinamicki parametar koji dodje gore posle ":" kao sto je ovde id
    if (result.n > 0) {
      res.status(200).json({ message: 'Deletion successful!' })
    } else {
    res.status(401).json({ message: 'Not authorized' })
    }
  });
});

module.exports = router;
