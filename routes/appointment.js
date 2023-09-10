const express = require('express');
const appointment = require('../controllers/appointment');
const auth = require("../middlewares/auth");
const router = express.Router();

router.post('/create-appointment', [auth], appointment.create);

module.exports = router;
