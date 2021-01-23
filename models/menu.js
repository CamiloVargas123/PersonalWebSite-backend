const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = Schema({
    title: String,
    url: String,
    order: Number,
    active: Boolean
});

module.exports = mongoose.model("Menu", menuSchema);