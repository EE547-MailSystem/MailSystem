const jwt          = require('jsonwebtoken');
const { getTokenRecord } = require('../dynamoTokenDao');
const { tokeDao }     = require('../dao/tokenDao');
const {userDao} = require('../dao/userDao')

module.exports = async function authenticateToken(req, res, next) {
  const auth = req.headers.authorization || '';
//   const token = auth.split(' ')[1];
  try{
    user_token = userDao.getTokenRecord()
  }catch(err){
    return res.status(403).json({ message: 'invalid user name' });
  }

  if (!token) return res.status(401).json({ message: '缺少 token' });

  try {
    // 验签
    const JWT_SECRET = tokeDao.getTokenRecord("token1");

    const payload = jwt.verify(token, JWT_SECRET);

    req.user = { id: payload.sub, username: payload.username };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token 无效或已过期' });
  }
};