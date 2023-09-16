const express = require('express');
const appointment = require('../controllers/appointment');
const auth = require("../middlewares/auth");
const router = express.Router();

router.get('/get-appointments', [auth], appointment.getAll);
router.post('/create-appointment', [auth], appointment.create);
router.delete('/delete-appointment', [auth], appointment.delete);

module.exports = router;
