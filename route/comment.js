const express = require('express');
const commentsController = require('../controller/comment');
const router = express.Router();

router.post('/comments', commentsController.postComment);
router.get('/comments', commentsController.getComments);
router.patch('/comments/:id/like', commentsController.likeComment);
router.patch('/comments/:id/unlike', commentsController.unlikeComment);

module.exports = router;
