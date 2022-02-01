const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function isAuthenticated(req, res, next) {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		req.user = decodedToken;
		next();
	} catch {
		res.status(401).json({
			error: 'Invalid request!',
		});
	}
}

module.exports = isAuthenticated;
