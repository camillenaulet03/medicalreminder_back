const express = require('express');
const appointment = require('../controllers/appointment');
const auth = require("../middlewares/auth");
const router = express.Router();

/**
 * tags:
 *   - name: Appointment
 */

/**
 * @swagger
 * definitions:
 *   Appointment:
 *     properties:
 *       id_practitioner:
 *         type: integer
 *         example: 1
 *       id_patient:
 *         type: integer
 *         example: 2
 *       comment:
 *         type: string
 *         example: ""
 *       state:
 *         type: string
 *         example: pending
 *       start_time:
 *         type: string
 *         example: 2023-09-13 07:00:00
 *       end_time:
 *         type: string
 *         example: 2023-09-13 08:00:00
 *     required:
 *       - id_practitioner
 *       - id_patient
 *       - start_time
 *       - end_time
 */

/**
 * @swagger
 * /get-appointments:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Appointment
 *     description: Get all appointments of a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: id_user
 *         schema:
 *           type: integer
 *         description: Enter the id user 
 *     responses:
 *       200:
 *         description: OK
 *       403:
 *         description: Forbidden, you need the Bearer token
 *       default:
 *         description: Unexpected error
 *  
 */
router.get('/get-appointments', [auth], appointment.getAll);

/**
 * @swagger
 * /create-appointment:
 *   post:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Appointment
 *     description: Create a new appointment
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: appointment
 *         schema:
 *           $ref: '#/definitions/Appointment'
 *     responses:
 *       200:
 *         description: OK
 *       403:
 *         description: Forbidden, you need the Bearer token
 *       500:
 *         description: error
 *  
 */
router.post('/create-appointment', [auth], appointment.create);

/**
 * @swagger
 * /delete-appointment:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Appointment
 *     description: Get all appointments of a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: id_user
 *         schema:
 *           type: integer
 *         description: Enter the id user 
 *       - in: query
 *         name: id_appointment
 *         schema:
 *           type: integer
 *         description: Enter the id appointment 
 *     responses:
 *       200:
 *         description: OK
 *       403:
 *         description: Forbidden, you need the Bearer token
 *       default:
 *         description: Unexpected error
 *  
 */
router.delete('/delete-appointment', [auth], appointment.delete);

module.exports = router;
