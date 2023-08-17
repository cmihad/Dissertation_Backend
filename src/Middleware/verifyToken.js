const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  const token = req.headers['authorization']

  if (!token) return res.status(403).send({ message: 'No token provided.' })
  console.log('token area', token)

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).send({ message: 'Failed to authenticate token.' })

    next()
  })
}
module.exports = verifyToken
