const express = require('express');
const user = require('../controllers/user');
const auth = require("../middlewares/auth");
const router = express.Router();

router.post('/create', user.create);
router.post('/login', user.login);
router.post('/logout', [auth], user.logout);

module.exports = router;
