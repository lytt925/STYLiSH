const { check, validationResult } = require('express-validator');

// Validation middleware for the Product object
const validateProductInfo = [
  (req, res, next) => {
    // Check if productInfo is a valid JSON
    try {
      const productInfo = JSON.parse(req.body.productInfo);
      req.body.productInfo = productInfo; // Store the parsed JSON for later use
      next();
    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON in productInfo' });
    }
  },
  check('productInfo.category').isString(),
  check('productInfo.title').isString(),
  check('productInfo.description').isString(),
  check('productInfo.price').isFloat(),
  check('productInfo.texture').isString(),
  check('productInfo.wash').isString(),
  check('productInfo.place').isString(),
  check('productInfo.note').isString(),
  check('productInfo.story').isString(),
  check('productInfo.colors').isArray(),
  check('productInfo.sizes').isArray(),
  check('productInfo.variants').isArray(),
  check('productInfo.colors.*.name').isString(),
  check('productInfo.colors.*.code').isHexColor(),
  check('productInfo.variants.*.color_code').isHexColor(),
  check('productInfo.variants.*.size').isString(),
  check('productInfo.variants.*.stock').isInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateProductInfo;
