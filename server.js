var express=require('express')
var userRoute=require('./Route/userRoute')
var dotenv=require('dotenv')
var cors=require('cors')
dotenv.config();
var fileuploader=require("express-fileupload");

console.log(process.env.SEC_KEY)
var app=express();
app.use(cors())

app.use(express.urlencoded(true));
app.use(express.json())
app.use(fileuploader());

app.listen(2004,(()=>{
    console.log("server started")
}))
app.use("/user", userRoute);
app.get("/",((req,resp)=>{
    resp.send("welcome rohit")
}))

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



app.post("/chat", async (req, resp) => {
  console.log("++++++++++++++++++")
  try {
    const message = req.body.inputMessage;
    
    if (!message) {
      return resp.status(400).json({ status: false, error: "Message prompt is required." });
    }
    
    // Kept exactly as requested
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
    
    // Generates a content response based strictly on the current input message only
    const result = await model.generateContent(message);
    const replyText = result.response.text();
    
    resp.json({ 
      status: true, 
      reply: replyText 
    });   
  } catch (err) {
    console.error("error: " + err.message);
    resp.status(500).json({ status: false, error: "AI request failed" });
  }
});


app.post("/image",(req,resp)=>{
  console.log("******")
  console.log(req.body)
})