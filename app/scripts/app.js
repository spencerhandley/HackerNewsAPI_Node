'use strict';

/**
 * @ngdoc overview
 * @name hnlyticsApp
 * @description
 * # hnlyticsApp
 *
 * Main module of the application.
 */
angular
  .module('hnlyticsApp', [
    'firebase',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'

  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/realtime', {
        templateUrl: 'views/realtime.html',
        controller: 'RealtimeCtrl'
      })
      .when('/latest', {
        templateUrl: 'views/latest.html',
        controller: 'AboutCtrl'
      })
       .when('/lifetime', {
        templateUrl: 'views/lifetime.html',
        controller: 'AboutCtrl'
      })
      .when('/global', {
        templateUrl: 'views/global.html',
        controller: 'AboutCtrl'
      })
      .when('/polls', {
        templateUrl: 'views/polls.html',
        controller: 'AboutCtrl'
      })
      .when('/comments', {
        templateUrl: 'views/comments.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
