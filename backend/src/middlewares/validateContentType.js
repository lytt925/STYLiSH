const contentTypeValidation = (req, res, next) => {
  if (!req.is('application/json')) {
    return res.status(400).json({ error: "Expects 'application/json'" });
  }
  next();
};

exports.contentTypeValidation = contentTypeValidation;