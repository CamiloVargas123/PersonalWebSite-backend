const express = require('express');
// const bodyParser = require('body-parser'); se puede usar otra forma
const app = express();

const {API_VERSION} = require('./config');

// Load rutings =====
const authRoutes = require('./routers/auth');
const userRoutes = require('./routers/user');
const menuRoutes = require('./routers/menu');

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Configure header HTTP ====
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
})

// Router basic ===
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);

module.exports = app;
