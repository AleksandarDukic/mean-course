const Post = require('../models/post');

exports.createPost = (req, res, next) => {
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
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed!"
    })
  });
}

exports.updatePost = (req ,res, next) => {
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
  Post.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    post
  ).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: 'Update successful!' })
    } else {
      res.status(401).json({ message: 'Not authorized' })
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post!"
    })
  });
}

exports.getPosts = (req, res, next) => {
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
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
}

exports.getPost = (req, res, next) =>{
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    result => {       // req.params. Tu ide dinamicki parametar koji dodje gore posle ":" kao sto je ovde id
      if (result.n > 0) {
        res.status(200).json({ message: 'Deletion successful!' })
      } else {
        res.status(401).json({ message: 'Not authorized' })
      }
    }
  ).catch(error => {
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  });
}
