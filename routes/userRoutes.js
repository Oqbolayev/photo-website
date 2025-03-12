const express = require('express');
const { signup, login, getUsers } = require('../controllers/userController');
const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.post('/signup', signup);
userRouter.post('/login', login);

module.exports = userRouter;