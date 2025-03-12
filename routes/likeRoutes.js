const express = require('express');
const { likes } = require('../controllers/likeController');
const likeRouter = express.Router();

likeRouter.post('/', likes);

module.exports = likeRouter;