var express=require("express")
var appRouter=express.Router()
var obj=require("../Controller/userController")
  
appRouter.get("/signup",obj.dosignup)
module.exports=appRouter;