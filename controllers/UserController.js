const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * @desc POST /register
 * @route /register
 */

const registerPOST = async (req, res) => {
	try {
		//return res.send('post register');

		const { email, password } = req.body;

		if (email === undefined || password === undefined) {
			return res.status(400).json({
				error: 'email or password is missing',
			});
		}

		const user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				error: 'conflict! : email is already in use',
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		const newUser = new User({
			email,
			password: hashedPassword,
		});
		const createdUser = await newUser.save();
		return res.status(201).json({
			message: 'user created',
			data: createdUser,
		});
	} catch (error) {
		return res.status(500).json({
			error: error.message,
		});
	}
};

/**
 * @desc   POST /login
 * @route  /login
 */
const loginPOST = async (req, res) => {
	const { email, password } = req.body;
	try {
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				error: 'user not found',
			});
		}
		//return res.send(user);
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({
				error: 'invalid password',
			});
		}

		// create jwt token

		const tokenObj = { email: user.email };
		const token = jwt.sign(tokenObj, process.env.ACCESS_TOKEN_SECRET);

		user = await User.findOneAndUpdate({ email }, { $set: { token } });
		return res
			.status(200)
			.json({ message: 'User Logged in successfully', data: user });
	} catch (error) {
		return res.status(500).json({
			error: error.message,
		});
	}
};

/**
 * @desc  GET /profile
 * @route /profile
 */
const profile = async (req, res) => {
	try {
		const { email } = req.user;
		console.log(email);
		const user = await User.findOne({ email });
		return res.status(200).json({
			message: 'User profile',
			data: user,
		});
	} catch (error) {
		return res.status(500).json({
			error: error.message,
		});
	}
};

/**
 * @desc  POST /logout
 * @route /logout
 */
const logout = (req, res) => {
	try {
		const { email } = req.user;
		const user = User.findOneAndUpdate({ email }, { $set: { token: '' } });
		return res.status(200).json({
			message: 'User logged out successfully',
			data: user,
		});
	} catch (error) {
		return res.status(500).json({
			error: error.message,
		});
	}
};

module.exports = {
	registerPOST,
	loginPOST,
	logout,
	profile,
};
