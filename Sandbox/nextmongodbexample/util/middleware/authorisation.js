function authorisation(role) {
  return function (req, res, next) {
    const requiredLevel = role; //"admin";
    //console.log(req.user.roles);
    const userLevels = req.user.roles;

    if (!userLevels.includes(requiredLevel))
      return res.status(403).send("Access denied"); // Forbidden

    next();
  };
}
module.exports = authorisation;
