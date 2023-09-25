const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  console.log(req, 'req yo')
  const token = req.headers['authorization']
  console.log(token, 'token bro')

  if (!token) return res.status(403).send({ message: 'No token provided.' })
  console.log('token area', token)

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).send({ message: 'Failed to authenticate token.' })

    next()
  })
}
module.exports = verifyToken
