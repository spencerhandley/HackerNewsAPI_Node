'use strict';
angular.module('hnlyticsApp')
.service('getSubsService', function($firebase, $q, $rootScope){ 

	var ref = new Firebase('https://hacker-news.firebaseio.com/v0/');
	var items = ref.child('item');
	var userRef = ref.child('user').child('pg');
	var userSync = $firebase(userRef);
	var userObj = userSync.$asObject();
	var submissions = [];
	var stories = [];
	var comments = [];
	var getSubs = function(cb){
		userRef.child('submitted').once('value', function(submitted){
			var userSubmitted = submitted.val().slice(0, submitted.val().length/50)
			for (var i = 0; i < userSubmitted.length; i++) {
				(function(i){
					items.child(userSubmitted[i]).once('value', function(sub){
						if(i === userSubmitted.length-1){
							cb(submissions, stories, comments)
						}
						if(sub.child('type').val() === null){
							return;
						}
						if(sub.child('type').val() === "story"){
							submissions.push(sub.val());
							stories.push(sub.val());
						}
						if(sub.child('type').val() === "comment"){
							submissions.push(sub.val());
							comments.push(sub.val());
						} else{
							return
						}
					})
				})(i)
			};
		});
	}

	return {
		subs: function(){
			var deferred = $q.defer(); 
			getSubs(function(subs, stories, comments){
				$rootScope.$apply(function(){
	        		deferred.resolve(subs);
	       		});
	       	});
	       	return deferred.promise;
		}
	}
});