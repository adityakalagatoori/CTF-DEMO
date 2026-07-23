export function adminAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  const password = authHeader?.split(' ')[1]

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  next()
}
