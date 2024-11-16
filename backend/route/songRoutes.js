const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const songController = require('../controller/songController');
router
  .route('/')
  .get(songController.getSongs)
  .post(protect, songController.createSong);
router.route('/:id').get(songController.getSongById);
router
  .route('/:id/users')
  .put(protect, songController.getMySongById)
  .put(protect, songController.updateMySong)
  .delete(protect, songController.deleteSong);
router.route('/:id/comments', protect, songController.commentSong);
module.exports = router;
