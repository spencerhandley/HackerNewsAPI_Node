'use strict';
angular.module('hnlyticsApp')
.service('lastPostCommentsService', function($firebase, $http, getSubsService, $q){
	var lastPost = stories[0]

	var lastPostCommentDates = function(cb){
		var results = []
		function recurse(kids){
			for(var i = 0; i < kids.length ; i++){
				if(results.length < 1000){
				$http({
					method: "GET",
					url: "https://hacker-news.firebaseio.com/v0/item/"+ lastPost.kids[i] + ".json"
				}).then(function(data){
					results.push(data.data.time);
					if(data.data.kids && data.data.kids.length > 0){
						recurse(data.data.kids);
					}
					return;
				});
				}

			}
		};
		recurse(lastPost.kids);
		cb(results);
	}
	
	var sortedComments = lastPostCommentDates(function(results){
		var byDay = {}
		for (var i = 0; i < results.length; i++) {
			var date = new Date(results[i]*1000);
			var day = date.getDay();
			if(byDay[day]){
				byDay[day]++;
			} else {
				byDay[day] = 1;
			}
		};
		console.log(byDay)
		return byDay
	});
});