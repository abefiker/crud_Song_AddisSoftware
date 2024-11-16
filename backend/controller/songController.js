const Song = require('../models/songModel');
const asyncHandler = require('../middleware/asyncHandler');

// Create a new song
exports.createSong = asyncHandler(async (req, res) => {
  const {
    title,
    artist,
    album,
    genre,
    releaseDate,
    thumbnail,
    audio,
    duration,
  } = req.body;

  // Validate required fields
  if (!title || !artist || !thumbnail || !audio || !duration) {
    return res.status(400).json({
      success: false,
      message: 'All required fields must be provided.',
    });
  }

  // Create a new song document
  const song = new Song({
    title,
    artist,
    album,
    genre,
    releaseDate,
    thumbnail, // Firebase URL for thumbnail
    audio, // Firebase URL for audio
    duration, // Duration in seconds
    user: req.user._id, // Assuming user ID is sent with the request, e.g., through JWT
  });

  // Save the song to the database
  const createdSong = await song.save();

  res.status(201).json({
    success: true,
    data: createdSong,
  });
});

exports.getSongs = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGE_SIZE;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const count = await Song.countDocuments({ ...keyword });

  const songs = await Song.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ songs, page, pages: Math.ceil(count / pageSize) });
});

exports.getSongById = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) {
    res.status(404);
    throw new Error('Resource not found');
  } else {
    res.status(200).json({ success: true, data: song });
  }
});
// @desc    Get all songs created by the logged-in user
// @route   GET /api/songs/mine
// @access  Private
exports.getMySongs = asyncHandler(async (req, res) => {
  const songs = await Song.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    count: songs.length,
    data: songs,
  });
});
// @desc    Get a specific song created by the logged-in user
// @route   GET /api/songs/mine/:id
// @access  Private
exports.getMySongById = asyncHandler(async (req, res) => {
  const song = await Song.findOne({ _id: req.params.id, user: req.user._id });

  if (!song) {
    res.status(404);
    throw new Error(
      'Song not found or you are not authorized to view this song'
    );
  }

  res.status(200).json({
    success: true,
    data: song,
  });
});
// @desc    Update a song created by the logged-in user
// @route   PUT /api/songs/mine/:id
// @access  Private
exports.updateMySong = asyncHandler(async (req, res) => {
  const {
    title,
    artist,
    album,
    genre,
    releaseDate,
    thumbnail,
    audio,
    duration,
  } = req.body;

  const song = await Song.findOne({ _id: req.params.id, user: req.user._id });

  if (!song) {
    res.status(404);
    throw new Error(
      'Song not found or you are not authorized to update this song'
    );
  }

  // Update fields only if they are provided in the request body
  if (title) song.title = title;
  if (artist) song.artist = artist;
  if (album) song.album = album;
  if (genre) song.genre = genre;
  if (releaseDate) song.releaseDate = releaseDate;
  if (thumbnail) song.thumbnail = thumbnail;
  if (audio) song.audio = audio;
  if (duration) song.duration = duration;

  const updatedSong = await song.save();

  res.status(200).json({
    success: true,
    data: updatedSong,
  });
});

exports.commentSong = asyncHandler(async (req, res) => {
  const { text } = req.body;

  // Validate input
  if (!text || text.trim() === '') {
    res.status(400);
    throw new Error('Comment text cannot be empty');
  }

  // Find the song by ID
  const song = await Song.findById(req.params.id);

  if (!song) {
    res.status(404);
    throw new Error('Song not found');
  }

  // Optional: Check if the user already commented (if restriction is required)
  const alreadyCommented = song.comments.find(
    (comment) => comment.user.toString() === req.user._id.toString()
  );

  if (alreadyCommented) {
    res.status(400);
    throw new Error('You have already commented on this song');
  }

  // Create new comment object
  const comment = {
    user: req.user._id,
    name: req.user.name,
    text,
  };

  // Add comment to the song's comments array
  song.comments.push(comment);

  // Save the updated song
  await song.save();

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    comment,
    totalComments: song.comments.length,
  });
});
