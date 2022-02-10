import jwt from'jsonwebtoken';
// middelware for jwt token
export const authorize = (req, res, next)=>{
  let token = req.header('AUTH_TOKEN')
  //console.log(token)
  if(!token) return res.status(401).send({message:'Access Denied'})
  token = token.replace(/^Bearer\s+/, "");
  //console.log(token)
  
  try{
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    //console.log(verified)
    //console.log("ver")
    next()
  }catch(err){
    let d = {
      message: 'Invalid token'
    }
    res.status(400).send(d)
  }
}

export const is_admin = (req,res, next)=>{
  console.log(req.body)
  next()
}