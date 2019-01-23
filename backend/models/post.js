const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, requred: true },
  imagePath: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema); // collection name plural, lower case of the name of the model -> posts
