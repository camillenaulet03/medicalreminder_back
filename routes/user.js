const express = require('express');
const user = require('../controllers/user');
const auth = require("../middlewares/auth");
const router = express.Router();

/**
 * @swagger
 * securityDefinitions:
 *   Bearer:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 *     description: >-
 *       Enter the token with the `Bearer: ` prefix, e.g. "Bearer abcde12345".
 */

/**
 * tags:
 *   - name: User Auth
 *   - name: User
 */

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       first_name:
 *         type: string
 *         example: John
 *       last_name:
 *         type: string
 *         example: Doe
 *       phone:
 *         type: string
 *         example: 0645483029
 *       email:
 *         type: string
 *         example: john.doe@yopmail.com
 *       password:
 *         type: string
 *         example: superSecretPassword1234
 *       missed_appointments:
 *         type: integer
 *         example: 0
 *       id_role:
 *         type: integer
 *         example: 5
 *     required:
 *       - first_name
 *       - last_name
 *       - phone
 *       - email
 *       - password
 *       - missed_appointments
 *       - id_role
 */

/**
 * @swagger
 * /create:
 *   post:
 *     tags:
 *       - User Auth
 *     description: Create user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses: 
 *       200 :
 *         description: OK
 *       default:
 *         description: Unexpected error
 *         
 */
router.post('/create', user.create);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - User Auth
 *     description: Log the user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login user
 *         description: Receive an sms to get a code for the authentifaction
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses: 
 *       200 :
 *         description: Return id user and you received a code by sms that you need to check in route /verify 
 *       401 : 
 *         description: Invalid identifiers
 *       default:
 *         description: Unexpected error
 *         
 */
router.post('/login', user.login);

/**
* @swagger
* /verify:
*   post:
*     tags:
*       - User Auth
*     description: Get token user
*     produces:
*       - application/json
*     parameters:
*       - in: body
*         name: verify user
*         description: Enter the id user and the sms code 
*         schema:
*           type: object
*           required:
*             - id
*             - phone
*           properties:
*             id:
*               type: integer
*             phone:
*               type: integer
*     responses: 
*       200 :
*         description: Return user token and his role
*       default:
*         description: Unexpected error
*/
router.post('/verify', user.verify);

/**
* @swagger
* /logout:
*   post:
*     security:
*       - Bearer: []
*     tags:
*       - User Auth
*     description: Expire the token
*     produces:
*       - application/json
*     parameters:
*       - in: body
*         description: send the id user
*         schema:
*           type: object
*           required:
*             - id
*           properties:
*             id:
*               type: integer
*     responses: 
*       200 :
*         description: OK
*       default:
*         description: Unexpected error
*/
router.post('/logout', [auth], user.logout);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     tags:
 *       - User Auth
 *     description: Send a email to reset the password
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *     responses: 
 *       200 :
 *         description: OK
 *       default:
 *         description: Unexpected error
 *         
 */
router.post('/reset-password', user.resetPassword);

/**
 * @swagger
 * /change-password:
 *   post:
 *     tags:
 *       - User Auth
 *     description: Reset the password
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         schema:
 *           type: object
 *           required:
 *             - id
 *             - password
 *           properties:
 *             id:
 *               type: integer
 *             password:
 *               type: string
 *     responses: 
 *       200 :
 *         description: OK
 *       default:
 *         description: Unexpected error
 *         
 */
router.post('/change-password', user.changePassword);

router.post('/change-role', user.changeRole);

/**
 * @swagger
 * /patients:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - User 
 *     description: get patients 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: Enter the id of the practitioner 
 *     responses: 
 *       200 :
 *         description: OK
 *       403:
 *         description: Forbidden, you need the Bearer token
 *       default:
 *         description: Unexpected error
 *         
 */
router.get('/patients', [auth], user.getPatients);

/**
 * @swagger
 * /user:
 *   get:
 *     security:
*        - Bearer: []
 *     tags:
 *       - User 
 *     description: get patients 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: Enter the user id
 *     responses: 
 *       200 :
 *         description: OK
 *       403:
 *         description: Forbidden, you need the Bearer token
 *       default:
 *         description: Unexpected error
 *         
 */
router.get('/user', [auth], user.getUser);

/**
 * @swagger
 * /user-by-email:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - User 
 *     description: get a user with his email 
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: integer
 *         description: Enter the user email
 *     responses: 
 *       200 :
 *         description: OK
 *       403:
 *         description: Forbidden, you need the Bearer token
 *       default:
 *         description: Unexpected error
 *         
 */
router.get('/user-by-email', [auth], user.getUserByEmail);

router.post('/share-calendar', user.shareCalendar);
router.get('/shared-users', user.getSharedUsers);

module.exports = router;
