
const Chat = require('../models/chatModel.js');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


async function waitForRunCompletion(threadId, runId) {
  let runStatus;
  do {
    const runResult = await client.beta.threads.runs.retrieve(threadId, runId);
    runStatus = runResult.status;
    console.log("Run status:", runStatus);
    if (runStatus === "completed") {
      return runResult;
    } else if (runStatus === "failed") {
      throw new Error("Run failed to complete.");
    }
    await new Promise((resolve) => setTimeout(resolve, 2000)); 
  } while (runStatus !== "completed");
}


const createMessage = async (req, res) => {
  const { assistantId, threadId, userMessage } = req.body;
  const userId = req.user.id; 

  console.log("Received request body:", req.body);

  if (!assistantId || !threadId || !userMessage) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    let chat = await Chat.findOne({ threadId, userId });

    if (chat) {
    chat.chatMessages.push({ role: "user", message: userMessage });

      const message = await client.beta.threads.messages.create(threadId, {
        role: "user",
        content: userMessage,
      });

      const run = await client.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        instructions: "Address the user as Leon",
      });
       
      const completedRun = await waitForRunCompletion(threadId, run.id);

      const messages = await client.beta.threads.messages.list(threadId);
      const allMessage = messages.data.map((msg) => ({
        role: msg.role,
        message: msg.content[0].text.value,
      }));



    console.log("allMessage[0] 💁‍♂️💁‍♂️",allMessage[0])
    chat.chatMessages.push(allMessage[0]);

      
      await chat.save();
      res.status(200).json({ allMessage: chat.chatMessages }); 
    } else {
      
      

      
      const message = await client.beta.threads.messages.create(threadId, {
        role: "user",
        content: userMessage,
      });

      const run = await client.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        instructions: "Address the user as Leon",
      });

      const completedRun = await waitForRunCompletion(threadId, run.id);

      const messages = await client.beta.threads.messages.list(threadId);
      const allMessage = messages.data.map((msg) => ({
        role: msg.role,
        message: msg.content[0].text.value,
      }));
     
      console.log("allMessage[0] ✈️✈️ >>", allMessage[0])
      
      if(allMessage[0]){
        const newChat = new Chat({
            assistantId,
            threadId,
            userId,
            chatMessages: [
              { role: "user", message: userMessage },
              { role: "assistant", message: allMessage[0].message } 
            ]
          });
         
          console.log("newChat >> ",newChat)
    
          await newChat.save();
          res.status(200).json({ allMessage: newChat.chatMessages }); 
    
    

      }
    

      
    }
  } catch (error) {
    console.error("Error in create-message:", error);
    res.status(500).json({ error: error.message });
  }
};





const getMessages = async (req, res) => {
  const { threadId } = req.params; 
  const userId = req.user.id; 

  try {
    
    const chat = await Chat.findOne({ threadId, userId });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    
    res.status(200).json({ allMessage: chat.chatMessages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createMessage, getMessages };
