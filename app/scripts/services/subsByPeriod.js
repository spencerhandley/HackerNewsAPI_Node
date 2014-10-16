'use strict';
angular.module('hnlyticsApp')
.service('subsByPeriodService', function($firebase, $timeout, $http, getSubsService, $q, $rootScope){
	getSubsService.sub().then(function(data){
		
		var matchesYear = function(obj, year){
			return year === obj;
		};

		var matchesMonth = function(obj, month){
			return month === obj;
		};

		var matchesWeek = function(obj, week){
			return week === obj;
		};
			// SUBMISSIONS BY YEAR
		thisYearsSubs = _.filter(submissions, function(obj){
			var now = new Date();
			var year = now.getFullYear();
			var objDate = new Date(obj.time*1000);
			var objYear = objDate.getFullYear();
			return matchesYear(objYear, year);
		});
		lastYearsSubs = _.filter(submissions, function(obj){
			var now = new Date();
			var year = now.getFullYear()-1;
			var objDate = new Date(obj.time*1000);
			var objYear = objDate.getFullYear();
			return matchesYear(objYear, year);
		});

		// SUBMISSIONS BY MONTH
		thisMonthsSubs = _.filter(submissions, function(obj){
			var now = new Date();
			var month = now.getMonth();
			var objDate = new Date(obj.time*1000);
			var objMonths = objDate.getMonth();
			return matchesMonth(objMonths, month);
		});
		lastMonthsSubs = _.filter(submissions, function(obj){
			var now = new Date();
			var month = now.getMonth()-1;
			var objDate = new Date(obj.time*1000);
			var objMonths = objDate.getMonth();
			return matchesMonth(objMonths, month);
		});

		// SUBMISSIONS BY WEEK
		thisWeeksSubs = _.filter(submissions, function(obj){
			var now = new Date();
			var week = now.getWeek();
			var objDate = new Date(obj.time);
			var objWeek = objDate.getWeek();
			return matchesWeek(objWeek, week);
		});
		lastWeeksSubs = _.filter(submissions, function(obj){
			var now = new Date();
			var week = now.getWeek()-1;
			var objDate = new Date(obj.time);
			var objWeek = objDate.getWeek();
			return matchesWeek(objWeek, week);
		});

		thisYearsTot = thisYearsSubs.length;
		lastYearsTot = lastYearsSubs.length;
		thisMonthsTot = thisMonthsSubs.length;
		lastMonthsTot = lastMonthsSubs.length;
		thisWeeksTot = thisWeeksSubs.length;
		lastWeeksTot = lastWeeksSubs.length;
		// Difference between periods
		yearsDiff = thisYearsTot - lastWeeksTot / lastWeeksTot;
		monthsDiff = thisMonthsTot - lastMonthsTot / lastMonthsTot;
		weeksDiff =	thisWeeksTot - lastWeeksTot / lastWeeksTot;
	});

	return {
		thisYearsTot: thisYearsTot,
		lastYearsTot: lastYearsTot,
		thisMonthsTot: thisMonthsTot,
		lastMonthsTot: lastMonthsTot,
		thisWeeksTot: thisWeeksTot,
		lastWeeksTot: lastWeeksTot
		yearsDiff: yearsDiff,
		monthsDiff: monthsDiff,
		weeksDiff: weeksDiff
	}
});