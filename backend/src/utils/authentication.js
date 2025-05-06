const jwt          = require('jsonwebtoken');
const { tokeDao }     = require('../dao/tokenDao');
const {userDao} = require('../dao/userDao')

module.exports = async function authenticateToken(req, res, next) {
  const user_token = req.headers.authorization || '';

  if (!user_token) return res.status(401).json({ message: '缺少 token' });

  // try {
    // 验签
    const JWT_SECRET = await tokeDao.getTokenRecord("token1");

    const payload = jwt.verify(user_token, JWT_SECRET);

    req.user = { id: payload.sub, username: payload.username };

    const exists_result = userDao.existsUser(payload.sub);
    if(exists_result){
        console.log(exists_result);
        next();
    }
    throw new Error("User doesn't exist")
  // } catch (err) {
  //   return res.status(403).json({ message: 'Token invalid' });
  // }
};