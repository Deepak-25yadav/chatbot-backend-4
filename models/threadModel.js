
const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema(
  {
    threadId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread
