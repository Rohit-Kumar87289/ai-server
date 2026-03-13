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

 app.use("/user",userRoute)
 const {GoogleGenerativeAI}=require('@google/generative-ai')
 const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
 app.post("/chat", async(req,resp)=>{
    console.log("messsage " ,req.body.inputMessage)
    //console.log(process.env.GEMINI_API_KEY)
  try{
    const message=req.body.inputMessage;
    const model=genAI.getGenerativeModel({model: 'gemini-3-flash-preview',});
    const result=await model.generateContent(message)
    console.log(result.response.text())
     resp.json({status:true,reply:result.response.text()})  
} catch(err){
    console.log("error "+err.message)
    resp.json({status:false,error:"AI request failed"})
}
 })