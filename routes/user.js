const express = require('express');
const user = require('../controllers/user');
const auth = require("../middlewares/auth");
const router = express.Router();

/**
 * tags:
 *   - name: User Auth
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
*         description: Check your sms code and get the user token
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


router.post('/logout', [auth], user.logout);
router.post('/reset-password', user.resetPassword);
router.post('/change-password', user.changePassword);
router.post('/change-role', user.changeRole);
router.get('/patients', [auth], user.getPatients);
router.get('/user', [auth], user.getUser);
router.get('/user-by-email', [auth], user.getUserByEmail);
router.post('/share-calendar', user.shareCalendar);
router.get('/shared-users', user.getSharedUsers);

module.exports = router;
