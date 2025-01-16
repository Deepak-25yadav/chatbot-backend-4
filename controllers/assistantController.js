
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

 const createAssistant = async (req, res) => {
  try {
    const assistant = await client.beta.assistants.create({
      name: "Math tutor",
      instructions: "You are a personal math tutor. Write and run code to answer math questions",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview",
    });
    console.log("assistant==",assistant);
    res.status(200).json({ assistant_id: assistant.id, assistant });
  } catch (error) {
    console.error("Error creating assistant:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {createAssistant}