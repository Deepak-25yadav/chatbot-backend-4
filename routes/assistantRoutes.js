
const express = require("express");
const {createAssistant} = require("../controllers/assistantController.js")

const assistantRouter = express.Router();

assistantRouter.get('/create', createAssistant);

module.exports = assistantRouter;
