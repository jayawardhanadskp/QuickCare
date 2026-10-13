// Allow only the given roles, e.g. allowRoles('admin', 'doctor')
const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have access to this' });
  }
  next();
};

module.exports = allowRoles;
