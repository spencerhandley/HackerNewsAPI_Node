angular.module('hnlyticsApp')
.directive("leftNav", function($rootScope){
	return {
		restrict: 'EA',
		scope: {},
		controller: function($scope){
			console.log($scope)
			$scope.current = 1
			$scope.setCurrent = function(val){
				console.log(val)
				$scope.current = val
			}
		},
		link: function(scope, ele, attrs){
			console.log(ele)
		}

	}
})