var mongoose = require('mongoose');
var polloptSchema = mongoose.Schema({
	by: String,
	hnId: Number,
	score: Number,
	title: String, 
	type: String, 
	url: String,
	dead: Boolean,
	parent: String,
	parts: Array,
	deleted: String,
	kids: Array, 
	time: Number
})
var Pollopt = mongoose.model("Pollopt", polloptSchema)

module.exports = Pollopt;


