var express=require('express')
var userRoute=require('./Route/userRoute')
var dotenv=require('dotenv')
var cors=require('cors')
dotenv.config();
console.log(process.env.SEC_KEY)
var app=express();
app.use(cors())
app.use(express.urlencoded(true));
app.listen(2004,(()=>{
    console.log("server started ***********")
}))
app.get("/",((req,resp)=>{
    resp.send("welcome rohit")
}))

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use("/user", userRoute);

app.post("/chat", async (req, resp) => {
  //console.log("Message received: ", req.body.inputMessage);
  
  try {
    const message = req.body.inputMessage;
    const chatHistory = req.body.chatHistory; // <-- Pull the raw history string out of the incoming payload
       console.log("yes----")
    if (!message) {
      return resp.status(400).json({ status: false, error: "Message prompt is required." });
    }
    
    // Kept exactly as requested
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
    
    let formattedHistory = [];

    // If chat history exists, parse it and structure it into Gemini's format
    if (chatHistory) {
      const parsedHistory = JSON.parse(chatHistory);
      
      formattedHistory = parsedHistory
        .slice(0, -1) // Skip the last item because it matches our current inputMessage variable
        .filter(msg => msg.text && !msg.text.startsWith('data:image')) // Filter out image payloads
        .map(msg => {
          return {
            role: msg.isBot ? "model" : "user", // "model" for AI, "user" for Human prompts
            parts: [{ text: msg.text }]
          };
        });
    }

    // 1. Initialize a multi-turn chat instance injecting the history logs
    const chatSession = model.startChat({
      history: formattedHistory
    });

    // 2. Send the current message context within this running history loop
    const result = await chatSession.sendMessage(message);
    const replyText = result.response.text();
    
    console.log(replyText);
    
    // Sending the text directly. Gemini inherently outputs rich markdown formatting.
    resp.json({ 
      status: true, 
      reply: replyText 
    });  
  } catch (err) {
    console.error("error: " + err.message);
    resp.status(500).json({ status: false, error: "AI request failed" });
  }
});