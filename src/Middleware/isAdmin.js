function isAdmin(req, res, next) {
  const adminHeader = req.headers['admintoken']

  if (
    !adminHeader ||
    adminHeader !==
      'oNxM!sUSnF9as3UIqep!!NJhwROzfPd-9-vIRUkUmKDHNaf-!vUbbI!mz1Fa!kY/'
  ) {
    // Replace 'your-admin-secret-value' with a secret value only admins know
    return res.status(403).json({ error: 'Access denied. Admin only.' })
  }

  next() // If the header exists and matches the secret value, proceed to the route
}

module.exports = isAdmin
