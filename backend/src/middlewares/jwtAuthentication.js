const jwt = require('jsonwebtoken');

const authenticateTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).send({ error: "access token not found" })
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenPayload) => {
    if (err) {
      console.log(err)
      return res.status(403).send({ error: "invalid access token" })
    }
    req.tokenPayload = tokenPayload
    next()
  })
}

exports.authenticateTokenMiddleware = authenticateTokenMiddleware;