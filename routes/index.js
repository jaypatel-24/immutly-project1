const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validation = require('../middleware/validation');
const isAuthenticated = require('../middleware/auth');

router.post(
	'/user/register',
	validation.validateUser,
	userController.registerPOST
);
router.post('/user/login', validation.validateUser, userController.loginPOST);
router.post('/user/logout', userController.logout);
router.get('/user/profile', isAuthenticated, userController.profile);
router.post('/user/logout', isAuthenticated, userController.logout);

/**
 * @desc   GET /
 * @route  /
 */
router.get('/', (req, res) => {
	return res.send('Welcome to project1');
});

module.exports = router;
