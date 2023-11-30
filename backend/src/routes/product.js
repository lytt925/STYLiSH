const express = require("express");
const router = express.Router();
const { upload } = require('../middlewares/multerUpload')
const productController = require('../controllers/productController')
const validateProductInfo = require('../middlewares/validateProductInfo')

/**
 * @swagger
 * tags:
 *  name: Product
 *  description: Products API
*/

/**
 * @swagger
 * components:
 *   productEndpoint:
 *     tags:
 *       - Product
 *     description: "Get products in the specified category."
 *     parameters:
 *       - name: paging
 *         in: query
 *         description: "Paging for request next page."
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "OK"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ProductResponse'
 *       400:
 *         description: "Client Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ClientErrorResponse'
 *       500:
 *         description: "Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ServerErrorResponse'
 * 
 *   ProductResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: array
 *         items:
 *           $ref: '#/components/schemas/Product'
 *       next_paging:
 *         type: string
 *         nullable: true
 *         example: "2"
 *   SuccessResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 *         description: Success message
 *         example: "Product created successfully"
 *   ClientErrorResponse:
 *     type: object
 *     properties:
 *       error:
 *         type: string
 *         description: Error message for client error
 *         example: "Invalid parameter"
 * 
 *   ServerErrorResponse:
 *     type: object
 *     properties:
 *       error:
 *         type: string
 *         description: Error message for server error.
 *         example: "Internal Server Error"
 */

/**
 * @swagger
 * /products/all:
 *   get:
 *     tags:
 *       - Product
 *     summary: "Get products in all category."
 *     $ref: '#/components/productEndpoint'
*/
router.get("/all", productController.getProductsAll);


/**
 * @swagger
 * /products/women:
 *   get:
 *     tags:
 *       - Product
 *     summary: "Get all product in women category."
 *     $ref: '#/components/productEndpoint'
 */
router.get("/women", productController.getProductsForWomen);



/**
 * @swagger
 * /products/men:
 *   get:
 *     tags:
 *       - Product
 *     summary: "Get all products in men category."
 *     $ref: '#/components/productEndpoint'
 */
router.get("/men", productController.getProductsForMen);

/**
 * @swagger
 * /products/accessories:
 *   get:
 *     tags:
 *       - Product
 *     summary: "Get all product in accessories category."
 *     $ref: '#/components/productEndpoint'
 */
router.get("/accessories", productController.getProductsForAccessories);

/**
 * @swagger
 * /products/search:
 *   get:
 *     tags:
 *       - Product
 *     summary: "Search products by keyword"
 *     description: "Search products by keyword."
 *     parameters:
 *       - name: keyword
 *         in: query
 *         description: "Keyword for searching."
 *         required: true
 *         schema:
 *           type: string
 *         example: "洋裝"
 *       - name: paging
 *         in: query
 *         description: "Paging for requesting the next page."
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "OK"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ProductResponse'
 *       400:
 *         description: "Client Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ClientErrorResponse'
 *       500:
 *         description: "Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ServerErrorResponse'
 */
router.get("/search", productController.searchProductByKeyword);



/**
 * @swagger
 * /products/details:
 *   get:
 *     tags:
 *       - Product
 *     summary: "Get product detail by product id."
 *     description: "Get product detail by product id."
 *     parameters:
 *       - name: id
 *         in: query
 *         description: "Product id for searching."
 *         required: true
 *         schema:
 *           type: string
 *         example: 1234
 *     responses:
 *       200:
 *         description: "OK"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: "Client Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ClientErrorResponse'
 *       500:
 *         description: "Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ServerErrorResponse'
 */
router.get("/details", productController.getProductDetail);


/**
 * @swagger
 * /products/create:
 *   post:
 *     tags:
 *       - Product
 *     summary: Upload product informations and image files
 *     description: Upload a JSON object and image files.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productInfo
 *             properties:
 *               productInfo:
 *                 $ref: '#/components/schemas/Product'   
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary 
 *                 description: Product images
 *               main_image:
 *                 type: string
 *                 format: binary
 *                 description: Main product image
 *     responses:
 *       200:
 *         description: Successful upload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/SuccessResponse'
 *       400:
 *         description: "Client Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "File must be an image"
 *       500:
 *         description: "Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ServerErrorResponse'
*/
router.post('/create',
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'productInfo' },
    { name: 'main_image', maxCount: 1 }
  ]),
  validateProductInfo,
  productController.createProduct);

module.exports = router;