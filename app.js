const express = require('express');
// const bodyParser = require('body-parser'); se puede usar otra forma
const app = express();

const {API_VERSION} = require('./config');

// Load rutings =====
const authRoutes = require('./routers/auth');
const userRoutes = require('./routers/user');

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Configure header HTTP ====


// Router basic ===
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);

module.exports = app;
