var mongoose = require('mongoose');
var jobSchema = mongoose.Schema({
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
var Job = mongoose.model("Job", jobSchema)

module.exports = Job;