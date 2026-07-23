export function errorHandler(err, req, res, next) {
  console.error('Error:', err)

  if (err.message?.includes('duplicate')) {
    return res.status(409).json({ error: 'Name already registered' })
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  })
}
