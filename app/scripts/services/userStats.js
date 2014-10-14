'use strict';
angular.module('hnlyticsApp')
.service('UserStatsService', function($firebase, getSubsService, $q){
	var average, 
	thisYearsSubs, 
	lastYearsSubs, 
	thisMonthsSubs, 
	lastMonthsSubs, 
	thisWeeksSubs,
	lastWeeksSubs,
	thisYearsTot,
	lastYearsTot,
	thisMonthsTot,
	lastMonthsTot,
	thisWeeksTot,
	lastWeeksTot,
	yearsDiff,
	monthsDiff,
	weeksDiff,
	averageTimes,
	timesOfTheDay;

	getSubsService.subs().then(function(data){
		console.log("heeyyyy")
	})	
	timesOfTheDay = [5,4,6,3,2,6,5,4,3,3,6,8,4,3,5,7,4,5,2,8,5,4,5,5];
	var ref = new Firebase('https://hacker-news.firebaseio.com/v0/');
	var items = ref.child('item');
	var userRef = ref.child('user').child('pg');
	var userSync = $firebase(userRef);
	var userObj = userSync.$asObject();
	var submissions = [];
	var stories = [];
	var comments = [];

	var matchesYear = function(obj, year){
		var date = new Date(obj.time);
		var itemYear = date.getFullYear();
		return year === itemYear;
	};
	var matchesMonth = function(obj, month){
		var date = new Date(obj.time);
		var itemMonth = date.getMonth();
		return month === itemMonth;
	};
	var matchesWeek = function(obj, week){
		var date = new Date(obj.time);
		var itemWeek = date.getWeek();
		return week === itemWeek;
	};

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

	getSubs(function(subs, stories, comments){

		average = Math.round((function(){
			var totalPts = 0;
			for (var i = 0; i < subs.length; i++) {
				if(subs[i].score){
					totalPts += subs[i].score;
				} else if (submissions[i].kids){
					totalPts += subs[i].kids.length;
				}
			}
			return totalPts/subs.length;
		})());

		timesOfTheDay = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		var averageTimes = subs
		  .map(function(sub) {
		  	var subTime = new Date(sub.time*1000);
		    return subTime.getHours();
		  })
		  .reduce(function(last, now) {
		    var index = last[0].indexOf(now);
		    if (index === -1) {
		      last[0].push(now);
		      last[1].push(1);
		    } else {
		      last[1][index] += 1;
		    }

		    return last;
		  }, [[], []])
		  .reduce(function(last, now, index, context) {
		    var zip = [];
		    last.forEach(function(word, i) {
		      zip.push([word, context[1][i]]);
		    });
		    return zip;
		  });

		for (var i = 0; i < averageTimes.length; i++) {
		  	timesOfTheDay[averageTimes[i][0]]= averageTimes[i][1];
		};

		thisYearsSubs = _.filter(subs, function(obj){
			var now = new Date();
			var year = now.getFullYear();
			return matchesYear(obj, year);
		});
		lastYearsSubs = _.filter(subs, function(obj){
			var now = new Date();
			var year = now.getFullYear()-1;
			return matchesYear(obj, year);
		});
		thisMonthsSubs = _.filter(subs, function(obj){
			var now = new Date();
			var month = now.getMonth();
			return matchesMonth(obj, month);
		});
		lastMonthsSubs = _.filter(subs, function(obj){
			var now = new Date();
			var month = now.getMonth()-1;
			return matchesMonth(obj, month);
		});
		thisWeeksSubs = _.filter(subs, function(obj){
			var now = new Date();
			var week = now.getWeek();
			return matchesWeek(obj, week);
		});
		lastWeeksSubs = _.filter(subs, function(obj){
			var now = new Date();
			var week = now.getWeek()-1;
			return matchesWeek(obj, week);
		});

		thisYearsTot = thisYearsSubs.length;
		lastYearsTot = lastYearsSubs.length;
		thisMonthsTot = thisMonthsSubs.length;
		lastMonthsTot = lastMonthsSubs.length;
		thisWeeksTot = thisWeeksSubs.length;
		lastWeeksTot = lastWeeksSubs.length;

		yearsDiff = thisYearsTot - lastWeeksTot / lastWeeksTot;
		monthsDiff = thisMonthsTot - lastMonthsTot / lastMonthsTot;
		weeksDiff =	thisWeeksTot - lastWeeksTot / lastWeeksTot;

		
	});


	// get all subs look at type value and sort by story or comment
	// get total number of submissions last month and this month
	// get the same for last week and last year
	// compare both for activity difference
	// get latest post and attach it to scope
	return {
		average: average,
		submissions: submissions,
		comments: comments,
		thisYearsTot: thisYearsTot,
		lastYearsTot: lastYearsTot,
		thisMonthsTot: thisMonthsTot,
		lastMonthsTot: lastMonthsTot,
		thisWeeksTot: thisWeeksTot,
		lastWeeksTot: lastWeeksTot,
		yearsDiff: yearsDiff,
		monthsDiff: monthsDiff,
		weeksDiff: weeksDiff,
		timesOfTheDay: timesOfTheDay
	};
});

Date.prototype.getWeek = function (dowOffset) {
	/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

	    dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
	    var newYear = new Date(this.getFullYear(),0,1);
	    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
	    day = (day >= 0 ? day : day + 7);
	    var daynum = Math.floor((this.getTime() - newYear.getTime() - 
	    (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
	    var weeknum;
	    //if the year starts before the middle of a week
	    if(day < 4) {
	        weeknum = Math.floor((daynum+day-1)/7) + 1;
	        if(weeknum > 52) {
	            nYear = new Date(this.getFullYear() + 1,0,1);
	            nday = nYear.getDay() - dowOffset;
	            nday = nday >= 0 ? nday : nday + 7;
	            /*if the next year starts before the middle of
	              the week, it is week #1 of that year*/
	            weeknum = nday < 4 ? 1 : 53;
	        }
	    }
	    else {
	        weeknum = Math.floor((daynum+day-1)/7);
	    }
	    return weeknum;
	};