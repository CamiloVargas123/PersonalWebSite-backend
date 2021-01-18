const express = require('express');
const UserController = require('../controllers/user');
const md_auth = require("../middleware/authenticated");
const user = require('../models/user');

const api = express.Router();

api.post('/sign-up', UserController.signUp);
api.post('/sign-in', UserController.signIn);
api.get('/get-users', [md_auth.ensureAuth], UserController.getUsers);
api.get('/get-users-active', [md_auth.ensureAuth], UserController.getUsersActive);

module.exports = api;