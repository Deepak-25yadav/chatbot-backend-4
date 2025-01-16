
const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require('./config/dbConfig.js');
const authRouter = require('./routes/authRoutes.js');
const threadRouter = require("./routes/threadRoutes.js")
const assistantRouter = require("./routes/assistantRoutes.js")
const cors= require("cors");
const chatRouter = require('./routes/chatRoutes.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors())

app.use('/api/auth', authRouter);
app.use('/api/thread',threadRouter);
app.use('/api/assistant',assistantRouter)
app.use('/api/chat', chatRouter); 


// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  dbConnect();
});

