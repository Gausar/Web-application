"use strict";

const mongoose = require("mongoose");

/**
 * Define the Mongoose Schema for a Comment.
 */
const commentSchema = new mongoose.Schema({

  comment: String,

  date_time: { type: Date, default: Date.now },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mentions: [ mongoose.Schema.Types.ObjectId ],
});

/**
 * Define the Mongoose Schema for a Photo.
 */
const photoSchema = new mongoose.Schema({
  // Name of the file containing the photo (in the project6/images directory).
  file_name: String,
  // The date and time when the photo was added to the database.
  date_time: { type: Date, default: Date.now },
  // The ID of the user who created the photo.
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Array of comment objects representing the comments made on this photo.
  comments: [commentSchema],
  //sharing_list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

/**
 * Create a Mongoose Model for a Photo using the photoSchema.
 */
const Photo = mongoose.model("Photo", photoSchema);
const Comment = mongoose.model('Comment', commentSchema);
/**
 * Make this available to our application.
 */
module.exports = Photo;
