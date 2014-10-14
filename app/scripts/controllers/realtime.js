'use strict';

/**
 * @ngdoc function
 * @name hnlyticsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp')
  .controller('RealtimeCtrl', function ($scope, $firebase, $http) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.thing = 'stuff';
    $http({
    	method: 'GET',
    	url: 'http://localhost:9000/stories'
    })
    .then(function(stories){
    	console.log(stories.data);
    	$scope.stories = stories.data;
    })
    .catch(function(err){
    	console.error(err);
    });


  });
