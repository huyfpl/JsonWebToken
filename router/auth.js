const authController = require('../controllers/authcontroller');
const middwarecontroller = require('../controllers/middwarecontroller');
const router = require('express').Router();
// register
router.post('/register',authController.registerUser);
// login
router.post('/login',authController.loginUser);
// refresh token
router.post('/refresh_token',authController.refreshToken);
// logout
router.post('/logout',middwarecontroller.verifyToken, authController.logoutUser);

module.exports = router;