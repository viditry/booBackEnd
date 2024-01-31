const express = require('express');
const router = express.Router();
const userController = require('../controller/user');

router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);

module.exports = router;
