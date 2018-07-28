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
       
        $stateProvider.state('registerClient', {
            url : '/register-client',
            templateUrl : 'html/clientRegister.html'
        });
        
        $stateProvider.state('registerExpert', {
            url : '/register-expert',
            templateUrl : 'html/expertRegister.html'
        });
        
        $stateProvider.state('createProject', {
            url : '/create-project',
            templateUrl : 'html/createProject.html'
        });
        
        $stateProvider.state('listProjects', {
            url : '/list-projects',
            templateUrl : 'html/listProjects.html'
        });
        
        $stateProvider.state('viewProject', {
            url : '/view-project',
            templateUrl : 'html/viewProject.html'
        });
        
    }
]);