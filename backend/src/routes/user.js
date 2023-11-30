const express = require("express");
const router = express.Router();
const { signupValidation } = require('../middlewares/validateSignup')
const { contentTypeValidation } = require('../middlewares/validateContentType')
const { authenticateTokenMiddleware } = require('../middlewares/jwtAuthentication')
const userController = require("../controllers/userController");

/**
 * @swagger
 * tags:
 *  name: User
 *  description: User API
*/


/**
 * @swagger
 * /user/signup:
 *   post:
 *     tags:
 *       - User
 *     summary: Create a new user
 *     description: Create a new user using name, email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User name (only English letters and digits)
 *                 example: stylishtest
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: example@gmail.com
 *               password:
 *                 type: string
 *                 description: The user's password should be at least 8 digits long and contain at least one uppercase letter, one lowercase letter, and one digit.
 *                 example: "1qaz@WSX"
 *     responses:
 *       200:
 *         description: Successful signup
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                       description: Access token
 *                     access_expired:
 *                       type: string
 *                       description: Access token expired time
 *                     user:
 *                       type: object
 *                       properties:
 *                          id:
 *                            type: integer
 *                            description: User id
 *                          provider: 
 *                            type: string
 *                            description: Authentication provider
 *                          name:
 *                            type: string
 *                            description: User name
 *                          email:
 *                            type: string
 *                            description: User email
 *                          picture:
 *                            type: string
 *                            description: User picture
 *       400:
 *         description: "Client Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Client message
 *                   example: Invalid name
 *       500:
 *         description: "Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ServerErrorResponse'
 */
router.post('/signup', [contentTypeValidation, signupValidation], userController.signupUser);


/**
 * @swagger
 * /user/signin:
 *   post:
 *     tags:
 *       - User
 *     summary: Signin a user
 *     description: Signin a user using name, email and password or access stylish token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             oneOf:
 *               - required: [provider, email, password]
 *                 properties:
 *                   provider:
 *                     type: string
 *                     description: Authentication provider
 *                     example: native
 *                   email:
 *                     type: string
 *                     description: User email
 *                     example: example@gmail.com
 *                   password:
 *                     type: string
 *                     description: User password
 *               - required: [provider, token]
 *                 properties:
 *                   provider:
 *                     type: string
 *                     description: Authentication provider
 *                     example: Google
 *                   token:
 *                     type: string
 *                     description: Access token
 *                     example: <access_token>
 *     responses:
 *       200:
 *         description: Successful signup
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                       description: Access token
 *                     access_expired:
 *                       type: string
 *                       description: Access token expired time
 *                     user:
 *                       type: object
 *                       properties:
 *                          id:
 *                            type: integer
 *                            description: User id
 *                          provider: 
 *                            type: string
 *                            description: Authentication provider
 *                          name:
 *                            type: string
 *                            description: User name
 *                          email:
 *                            type: string
 *                            description: User email
 *                          picture:
 *                            type: string
 *                            description: User picture
 *       400:
 *         description: "Client Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Client Error Message
 *                   example: Invalid email
 *       500:
 *         description: "Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ServerErrorResponse'
 */


router.post('/signin', contentTypeValidation, userController.signinUser);



/**
 * @swagger
 * /user/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user profile
 *     description: Get the user profile using access token
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Get user profile successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     provider: 
 *                       type: string
 *                       description: Authentication provider
 *                     name:
 *                       type: string
 *                       description: User name
 *                     email:
 *                       type: string
 *                       description: User email
 *                     picture:
 *                       type: string
 *                       description: User picture
 *       400:
 *         description: "Client Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: client error message
 *                   example: Invalid token
 *       500:
 *         description: "Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ServerErrorResponse'
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/profile', authenticateTokenMiddleware, userController.getUserProfile);

module.exports = router;