const jwt = require('jsonwebtoken');
const  tokenDao = require('../dao/tokenDao');
const userDao = require('../dao/userDao')

module.exports = async function authenticateToken(req, res, next) {
  const user_token = req.headers.authorization || '';

  if (!user_token){
    console.log({ message: 'token lacked' });
  }
  
  try {
    // 验签
    const JWT_SECRET = await tokenDao.getTokenRecord("token1");

    const payload = jwt.verify(user_token, JWT_SECRET.secret);

    req.user = { id: payload.sub, type: payload.username };

    const exists_result = await userDao.existsUser(payload.sub);
    if(exists_result){
        console.log(exists_result);
        next();
    }
    else{
      throw new Error("User doesn't exist");
    }
  } catch (err) {
    return res.status(403).json({ message: 'Token invalid' });
  }
};