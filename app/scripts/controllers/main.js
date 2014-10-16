'use strict';

/**
 * @ngdoc function
 * @name hnlyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp')
  .controller('MainCtrl', function ($scope, $firebase, $timeout, $sce, UserStatsService) {
	$scope.userName = 'pg' 
  	var ref = new Firebase('https://hacker-news.firebaseio.com/v0/');
  	var items = ref.child('item');
	var userRef = ref.child('user').child($scope.userName);
	var userSync = $firebase(userRef);
	var userObj = userSync.$asObject();
	var timesOfTheDay;
	$scope.current = 1
	$scope.setCurrent = function(val){
		$scope.current = val
	}
	$scope.inputUser;

	var injectData = function (user) {
		UserStatsService.results(user, $scope).then(function(data){
			timesOfTheDay = data.timesOfTheDay
			$scope.chart = {
			    labels : ["midnight", "1am", "2am", "3am", "4am", "5am", "6am","7am", "8am", "9am", "10am", "11am", "Noon", "1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"],
			    datasets : [
			        {
			            fillColor : "rgba(151,187,205,0)",
			            strokeColor : "#FF6600",
			            pointColor : "rgba(151,187,205,0)",
			            pointStrokeColor : "#e67e22",
			            data : timesOfTheDay
			        }
			    ], 
			};
			var dailyScores = [3,4,5,6,8,13,17,20,26,33,41,50,55,57,50,40,30,20,10,5,5,3,2,2]
			$scope.lastPostChart = {
			    labels : ["9/12", "9/13", "9/14", "9/15", "9/16", "9/17", "9/18","9/19", "9/20", "9/21", "9/22", "9/23", "9/24", "9/25","9/26","9/27","9/28","9/29","9/30","9/31","10/1","10/2","10/3","10/4"],
			    datasets : [
			        {
			            fillColor : "rgba(151,187,205,0)",
			            strokeColor : "#FF6600",
			            pointColor : "rgba(151,187,205,0)",
			            pointStrokeColor : "#e67e22",
			            data : dailyScores
			        }
			    ], 
			};
			$scope.lastPost = data.lastPost
			$scope.lastPostDate = moment(data.lastPost.time*1000).format("MMM Do YYYY")
			// $scope.lastPost.time = lastpostDate.toString()

			$scope.dgntData = [ 
				{
		            value: 30,
		            color:"#F7464A"
		        },
		        {
		            value : 50,
		            color : "#E2EAE9"
		        },
		        {
		            value : 100,
		            color : "#D4CCC5"
		        },
		        {
		            value : 40,
		            color : "#949FB1"
		        },
		        {
		            value : 120,
		            color : "#4D5360"
		        }

	        ];
			$scope.averageScore = data.average
			$scope.myChartOptions = {
		        // Boolean - Whether to animate the chart
		        animation: true,

		        // Number - Number of animation steps
		        animationSteps: 60
		    }
		    $scope.thisWeeksTot = data.thisWeeksTot;
			$scope.lastWeeksTot = data.lastWeeksTot;
			$scope.thisMonthsTot = data.thisMonthsTot;
			$scope.lastMonthsTot = data.lastMonthsTot;
			$scope.thisYearsTot = data.thisYearsTot;
			$scope.lastYearsTot = data.lastYearsTot;
			$scope.weeksDiff = data.weeksDiff;
			$scope.monthsDiff = data.monthsDiff;
			$scope.yearsDiff = data.yearsDiff;
		});	
	}
	injectData($scope.userName)
	$scope.pullUserData = function(inputUser){
		$scope.userName = inputUser;
		injectData(inputUser)
		userSync = $firebase(userRef);
		console.log($scope.userName)
		userRef = ref.child('user').child($scope.userName);
		userSync = $firebase(userRef);
		userObj = userSync.$asObject();
		setUserObj()

	}
			

    
	var setUserObj = function(){
		userObj.$loaded().then(function() {
			var created = new Date(userObj.created*1000);
			$scope.karma = userObj.karma;
			$scope.createdAt = created.getMonth().toString()+ '/' + created.getFullYear().toString();
			var div = document.createElement("div");
			div.innerHTML = userObj.about;
			var text = div.textContent || div.innerText || "";
			$scope.about =  _.unescape(text);
			$scope.submitted = userObj.submitted;

			var latestRef = items.child(userObj.submitted[0]);
			var latestSync = $firebase(latestRef);
			var latestObj = latestSync.$asObject();
			latestObj.$loaded().then(function(){
				$scope.latestPost = _.unescape(latestObj.text);
				var parent = $firebase(items.child(latestObj.parent)).$asObject();
				parent.$loaded().then(function(){
					$scope.latestParent = _.unescape(parent.text);
					// if is a comment, recursively find the parent story through the parents chain
				});
			});
		});
	};
	setUserObj()
});
