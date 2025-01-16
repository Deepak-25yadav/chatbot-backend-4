const dotenv = require("dotenv");
const OpenAI = require("openai");
const Thread = require("../models/threadModel.js")

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



 const createThread = async (req, res) => {
  const userId = req.user.id;  
  console.log("req in createThread function 💁‍♂️💁‍♂️",req)
  console.log("req.user.id ✈️✈️",req.user.id)

  try {
    
    const thread = await client.beta.threads.create();
    
    
    const newThread = new Thread({
      threadId: thread.id,
      userId,
    });

    await newThread.save();  

    console.log("newThread >>",newThread);

    res.status(200).json({ thread: newThread });
  } catch (error) {
    console.error("Error creating thread:", error);
    res.status(500).json({ error: error.message });
  }
};

 const getThreadsByUser = async (req, res) => {
  const userId = req.user.id;  

  try {
    
    const threads = await Thread.find({ userId }).sort({ updatedAt: -1 });
    console.log("get all threads 👌👌",threads)
    res.status(200).json({ threads });
  } catch (error) {
    console.error("Error retrieving threads:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {createThread,getThreadsByUser}