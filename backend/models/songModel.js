const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: {
      type: String,
      required: true,
    },
    text: { type: String, required: true, maxlength: 300 },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    artist: { type: String, required: true, trim: true },
    album: { type: String, trim: true },
    genre: { type: String, trim: true },
    releaseDate: { type: Date },
    thumbnail: {
      type: String,
      required: true, // URL or path to the thumbnail image
    },
    audio: {
      type: String,
      required: true, // URL or path to the audio file
    },
    duration: {
      type: Number, // Song duration in seconds
      required: true,
    },
    comments: [commentSchema],
    playCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked the song
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` fields
);

module.exports = mongoose.model('Song', songSchema);
