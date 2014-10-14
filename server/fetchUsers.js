var mongoose = require('mongoose');
var _ = require('underscore')
var request = require('request');
var Promise = require('bluebird');
var User = require('./mongoose/models/user');
var Story = require('./mongoose/models/story');
var Comment = require('./mongoose/models/comment');


var fetchUsers = function(cb) {
	var users = [];
	Comment.find({}, function(err, comments){
		Story.find({}, function(err, stories){
			comments.forEach(function(comment){
				users.push(comment.by);
			};
			stories.forEach(function(story){
				users.push(story.by);
			});
			var uniqueUsersArr = _.unique(users)
			cb(uniqueUsersArr)
		});
	});
});

export.getUsers = function(){
	fetchUsers(function(users){
		users.forEach(function(username){
			request('https://hacker-news.firebaseio.com/v0/user/'+ username +'.json', function(err, response, body){
				var userItem = JSON.parse(body);
				var user = new User(userItem);
				user.save(function(err){
					if (err) throw err;
					console.log("USER SAVED", username);
				});
			});
		});
	});
};