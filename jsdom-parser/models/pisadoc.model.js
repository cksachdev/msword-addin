const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var pisaSchema = new Schema({}, { strict: false, timestamps: { createdAt: 'created_at' } });
var pisaModel = mongoose.model('pisa', pisaSchema);
module.exports = pisaModel;
