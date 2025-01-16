
const express = require('express');
const { createMessage, getMessages } = require('../controllers/chatController.js');
const userVerify = require('../middleware/userVerify.js'); 

const chatRouter = express.Router();


chatRouter.post('/create-message', userVerify, createMessage);


chatRouter.get('/messages/:threadId', userVerify, getMessages);

module.exports = chatRouter;
