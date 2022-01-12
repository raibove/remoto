import jwt from'jsonwebtoken';
// middelware for jwt token
export const authorize = (req, res, next)=>{
  const token = req.header('AUTH_TOKEN')
  if(!token) return res.status(401).send('Access Denied')

  try{
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    console.log(verified)
    next()
  }catch(err){
    let d = {
      message: 'Invalid token'
    }
    res.status(400).send(d)
  }
}