const express = require('express');
const user = require('../controllers/user');
const auth = require("../middlewares/auth");
const router = express.Router();

router.post('/create', user.create);
router.post('/login', user.login);
router.post('/verify', user.verify);
router.post('/logout', [auth], user.logout);
router.post('/reset-password', user.resetPassword);
router.post('/change-password', user.changePassword);

module.exports = router;
