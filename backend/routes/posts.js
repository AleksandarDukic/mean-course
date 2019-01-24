const express = require("express");
const multer = require('multer');
const Post = require('../models/post');

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
    cb(error, "backend/images");         // put relativan u odnosu na server.js ---- cb je mesto gde multer upisuje
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post(
  "",
  multer({storage: storage}).single("image"),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");           // req.protocol na vraca ili http ili https
    //console.log(req.get("host"));   Probaj da nadjes ovaj log, u db-u izgleda da je localhost:3000
    const post = new Post({
     title: req.body.title,
     content: req.body.content,
     imagePath: url + "/images/" + req.file.filename              // file property stvara multer kao i filename
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
      imagePath: imagePath
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    res.status(200).json({ message: 'Update successful!' })
  });
});

router.get("",(req, res, next) => {
  // console.log(req.query);              // sa req.query vadimo iz url-a informaciju posle "?"
  const pageSize = +req.query.pagesize;    // .pagesize mi biramo ime. to su query parameters  // izvod iz query parametra je uvek string
  const currentPage = +req.query.page;     // a program hoce broj, at radimo ako dodamo + ispred
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


router.get("/:id", (req, res, next) =>{
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found'});
    }
  })
})

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: "Post deteletd"});         // req.params. Tu ide dinamicki parametar koji dodje gore posle ":" kao sto je ovde id
  });
});

module.exports = router;




