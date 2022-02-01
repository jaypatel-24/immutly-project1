const { check, validationResult } = require('express-validator');
const validateUser = [
	check('email')
		.trim()
		.not()
		.isEmpty()
		.isEmail()
		.withMessage('Invalid email address!')
		.bail(),
	check('password')
		.trim()
		.not()
		.isEmpty()
		.isLength({ min: 4, max: 32 })
		.withMessage('Invalid password!'),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(422).json({ errors: errors.array() });
		next();
	},
];

module.exports = {
	validateUser,
};
