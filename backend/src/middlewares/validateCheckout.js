const { check, validationResult } = require('express-validator');

validateCheckout = [
  (req, res, next) => {
    if (!req.is('application/json')) {
      return res.status(400).json({ error: "Expects 'application/json'" });
    }
    next();
  },
  check('prime').notEmpty().isString(),
  check('order.shipping').notEmpty().withMessage('Shipping is not provided').isIn(['delivery']), // Add more shipping options if necessary
  check('order.payment').notEmpty().withMessage('Payment is not provided').isIn(['credit_card']), // Add more payment options if necessary
  check('order.subtotal').notEmpty().isNumeric(),
  check('order.freight').notEmpty().isNumeric(),
  check('order.total').notEmpty().withMessage('Total amount is not provided').isNumeric(),
  check('order.recipient.name').notEmpty().withMessage('Name is not provided').isString(),
  check('order.recipient.phone').notEmpty().withMessage('Phone is not provided').isString(),
  check('order.recipient.email').notEmpty().withMessage('Email is not provided').isEmail(),
  check('order.recipient.address').notEmpty().isString(),
  check('order.recipient.time').isIn(['morning', 'afternoon', 'anytime']), // Add more time options if necessary
  check('order.list.*.id').isString(),
  check('order.list.*.name').isString(),
  check('order.list.*.price').isNumeric(),
  check('order.list.*.color.name').isString(),
  check('order.list.*.color.code').isString().isHexColor(),
  check('order.list.*.size').isString(),
  check('order.list.*.qty').custom((value, { req }) => {
    if (!Number.isInteger(value) || value <= 0)
      throw new Error('Quantity must be an postive integer.');
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]

module.exports = validateCheckout;