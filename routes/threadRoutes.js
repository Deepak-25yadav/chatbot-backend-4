const express = require("express");
const {createThread, getThreadsByUser} = require("../controllers/threadController.js");
const userVerify = require("../middleware/userVerify.js")


 const threadRouter = express.Router();


threadRouter.get('/create', userVerify, createThread);


threadRouter.get('/user', userVerify, getThreadsByUser);


module.exports = threadRouter;
