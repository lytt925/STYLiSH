/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - category
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: The product ID.
 *         category:
 *           type: string
 *           description: The category of the product.
 *         title:
 *           type: string
 *           description: The title of the product.
 *         description:
 *           type: string
 *           description: The description of the product.
 *         price:
 *           type: number
 *           format: double
 *           description: The price of the product.
 *         texture:
 *           type: string
 *           description: The texture of the product.
 *         wash:
 *           type: string
 *           description: Washing instructions for the product.
 *         place:
 *           type: string
 *           description: The place of origin for the product.
 *         note:
 *           type: string
 *           description: Additional notes about the product.
 *         story:
 *           type: string
 *           description: The story or background information about the product.
 *         colors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The color code.
 *               name:
 *                 type: string
 *                 description: The color name.
 *           description: The available colors for the product.
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *           description: The available sizes for the product.
 *         variants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               color_code:
 *                 type: string
 *                 description: The color code of the variant.
 *               size:
 *                 type: string
 *                 description: The size of the variant.
 *               stock:
 *                 type: integer
 *                 description: The stock quantity for the variant.
 *           description: The available variants of the product.
 *         main_image:
 *           type: string
 *           format: uri
 *           description: The URL of the main product image.
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *             description: URLs of additional product images.
 *       example:
 *         id: 1234
 *         category: "men"
 *         title: "厚實毛呢格子外套"
 *         description: "高抗寒素材選用，保暖也時尚有型"
 *         price: 2200
 *         texture: "棉、聚脂纖維"
 *         wash: "手洗（水溫40度"
 *         place: "韓國"
 *         note: "實品顏色以單品照為主"
 *         story: "你絕對不能錯過的超值商品"
 *         colors:
 *           - code: "334455"
 *             name: "深藍"
 *           - code: "FFFFFF"
 *             name: "白色"
 *         sizes:
 *           - "S"
 *           - "M"
 *         variants:
 *           - color_code: "334455"
 *             size: "S"
 *             stock: 5
 *           - color_code: "334455"
 *             size: "M"
 *             stock: 10
 *           - color_code: "FFFFFF"
 *             size: "S"
 *             stock: 0
 *           - color_code: "FFFFFF"
 *             size: "M"
 *             stock: 2
 *         main_image: "https://stylish.com/main.jpg"
 *         images:
 *           - "https://stylish.com/0.jpg"
 *           - "https://stylish.com/1.jpg"
 *           - "https://stylish.com/2.jpg"
 */



/**
 * @swagger
 * /products/men:
 *   get:
 *     tags:
 *       - Product
 *     $ref: '#/components/productEndpoint'
 */

/**
 * @swagger
 * components:
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
 */
