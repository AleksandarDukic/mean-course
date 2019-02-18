const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, requred: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , requred: true }    // creator trazen u db-i

});

module.exports = mongoose.model('Post', postSchema); // collection name plural, lower case of the name of the model -> posts
