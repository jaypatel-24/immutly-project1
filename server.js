const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');

// load config
dotenv.config({ path: './config/config.env' });

// connect to database
connectDB();

const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/', require('./routes/index'));

app.listen(PORT, () =>
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
	)
);
