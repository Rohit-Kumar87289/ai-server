function dosignup(req,resp){
   console.log("signed up successfully  "+req.query.email)
   resp.send("signed up successfully  "+req.query.email+"  "+req.query.psw)
}

module.exports ={dosignup}