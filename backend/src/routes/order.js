const express = require("express");
const router = express.Router();
const { authenticateTokenMiddleware } = require('../middlewares/jwtAuthentication')
const validateCheckout = require('../middlewares/validateCheckout');
const orderController = require("../controllers/orderController");

/**
 * @swagger
 * tags:
 *  name: Order
 *  description: Order API
*/

/**
 * @swagger
 * /order/checkout:
 *   post:
 *     summary: Create a new order.
 *     tags:
 *       - Order
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prime:
 *                 type: string
 *                 description: Prime Key from TapPay
 *               order:
 *                 type: object
 *                 properties:
 *                   shipping:
 *                     type: string
 *                   payment:
 *                     type: string
 *                   subtotal:
 *                     type: number
 *                     description: Price excluded Freight Fee
 *                   freight:
 *                     type: number
 *                     description: Freight Fee
 *                   total:
 *                     type: number
 *                     description: Final Price
 *                   recipient:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       email:
 *                         type: string
 *                       address:
 *                         type: string
 *                       time:
 *                         type: string
 *                         enum:
 *                           - morning
 *                           - afternoon
 *                           - anytime
 *                   list:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Product ID
 *                         name:
 *                           type: string
 *                           description: Product Name
 *                         price:
 *                           type: number
 *                           description: Product Unit Price
 *                         color:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               description: Product Variant Color Name
 *                             code:
 *                               type: string
 *                               description: Product Variant Color HexCode
 *                         size:
 *                           type: string
 *                           description: Product Variant Size
 *                         qty:
 *                           type: integer
 *                           description: Quantity
 *           example:
 *             prime: "Enter your TapPay prime key here"
 *             order:
 *               shipping: "delivery"
 *               payment: "credit_card"
 *               subtotal: 1234
 *               freight: 14
 *               total: 1300
 *               recipient:
 *                 name: "Luke"
 *                 phone: "0987654321"
 *                 email: "luke@gmail.com"
 *                 address: "市政府站"
 *                 time: "morning"
 *               list:
 *                 - id: "1234"
 *                   name: "厚實毛呢格子外套"
 *                   price: 2200.00
 *                   color:
 *                     name: "深藍"
 *                     code: "334455"
 *                   size: "S"
 *                   qty: 1
 *                 - id: "1234"
 *                   name: "厚實毛呢格子外套"
 *                   price: 2200.00
 *                   color:
 *                     name: "白色"
 *                     code: "FFFFFF"
 *                   size: "M"
 *                   qty: 3
 *                 - id: "2345"
 *                   name: "時尚牛仔外套"
 *                   price: 1699.00
 *                   color:
 *                     name: "綠色"
 *                     code: "00FF00"
 *                   size: "L"
 *                   qty: 1           
 *     responses:
 *       200:
 *         description: Ordered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     number: 
 *                       type: string
 *                       description: Order number
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
*/
router.post('/checkout', [authenticateTokenMiddleware, ...validateCheckout], orderController.checkoutOrder);

module.exports = router;