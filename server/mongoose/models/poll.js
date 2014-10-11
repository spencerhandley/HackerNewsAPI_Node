var mongoose = require('mongoose');
var pollSchema = mongoose.Schema({
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
var Poll = mongoose.model("Poll", pollSchema)

module.exports = Poll;


