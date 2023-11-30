const { Router } = require('express')
const productRouter = require('./product.js')
const userRouter = require('./user.js')
const orderRouter = require('./order.js')


const router = Router();

/**
 * @swagger
 * /healthcheck:
 *  get:
 *    description: Define a route for healthcheck
 *    responses:
 *       200:
 *         description: Success
 */
router.get('/healthcheck', (req, res) => {
  res.send('OK')
})

router.use('/products', productRouter)
router.use('/user', userRouter)
router.use('/order', orderRouter)


module.exports = router;
