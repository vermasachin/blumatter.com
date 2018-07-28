/* * ************************************************************ 
 * Date: 28 Jul, 2018
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file app.js
 * *************************************************************** */


var app = angular.module('blumatter',[ 'ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {
            url : '/',
            controller : 'init',
            template : "<div></div>"
        });
        $stateProvider.state("rooterror",{
            url : "/error/:type/:title/:message",
            templateUrl : "html/rooterror.html",
            controller : function($state,$stateParams,$scope,view){
                view.message($scope,$stateParams.type,$stateParams.title,$stateParams.message);
            }
        });
        
        $stateProvider.state('login', {
            url : '/login',
            templateUrl : 'html/login.html'
        });
        
        $stateProvider.state('logout', {
            url : '/logout',
            controller : "logout"
        });
       
        // Admin access only
        $stateProvider.state('users', {
            url : '/users',
            templateUrl : 'html/users.html'
        });
        
        // Admin access only, save other user profile
        $stateProvider.state('users.username.update', {
            url : '/users/:username/update',
            templateUrl : 'html/userUpdate.html'
        });
        
    }
]);