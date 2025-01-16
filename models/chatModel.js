
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    assistantId: { type: String, required: true },
    threadId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chatMessages: [
      {
        role: { type: String, enum: ['user', 'assistant'], required: true },
        message: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
