module.exports = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role.name)) {
      return res.status(403).json({ msg: "Access denied" });
    }
    next();
  };
};
