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
            templateUrl : 'html/home.html'
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
            url : '/view-project/:projectName',
            templateUrl : 'html/viewProject.html'
        });
        
        $stateProvider.state('uploadCV', {
            url : '/uploadCV',
            templateUrl : 'html/uploadCV.html'
        });
        
    }
]);

app.controller("login",["$scope",'$http','$state',function($scope,$http,$state){
    $scope.name = "";
    
    $scope.login = function(){
        $http(api.login({name : $scope.name})).then(function(res){
            if(res.data && res.data.data && res.data.data.name){
                var user = res.data.data;
                if(user.role === 'client'){
                    $state.go("createProject");
                }else{
                    $state.go("uploadCV");
                }
            }else{
                $scope.error = res.data.error;
            }
        });
    };
}]);

app.controller("registerClient",["$scope",'$http','$state',function($scope,$http,$state){
    $scope.name = "";
    $scope.email = "";
    $scope.phone = "";
    
    $scope.register = function(){
        $http(api.registerClient({
            name : $scope.name,
            email: $scope.email, 
            phone : $scope.phone
        })).then(function(res){
            if(res.data && res.data.data && res.data.ok){
                $http(api.login({name : $scope.name})).then(function(res){
                    if(res.data && res.data.data && res.data.data.name){
                        $state.go("createProject");
                    }else{
                        $scope.error = res.data.error;
                    }
                });
            }else{
                $scope.error = res.data.error;
            }
        });
    };
}]);


app.controller("registerExpert",["$scope",'$http','$state',function($scope,$http,$state){
    $scope.name = "";
    $scope.email = "";
    $scope.phone = "";
    $scope.location = "";
    $scope.cvfile = "";
    $scope.description = "";
    $scope.industry = "";
    $scope.skills = "";
    
    $scope.register = function(){
        $http(api.registerExpert({
            name : $scope.name,
            email : $scope.email,
            phone : $scope.phone,
            location : $scope.location,
            cvfile : $scope.cvfile,
            description : $scope.description,
            industry : $scope.industry,
            skills : $scope.skills
        })).then(function(res){
            if(res.data && res.data.data && res.data.ok){
                $http(api.login({name : $scope.name})).then(function(res){
                    if(res.data && res.data.data && res.data.data.name){
                        $state.go("uploadCV");
                    }else{
                        $scope.error = res.data.error;
                    }
                });
            }else{
                $scope.error = res.data.error;
            }
        });
    };
}]);

app.controller("createProject",["$scope",'$http','$state',function($scope,$http,$state){
    $scope.name = "";
    $scope.brief = "";
    $scope.industry = "";
    $scope.skills = "";
    
    $scope.register = function(){
        $http(api.createProject({
            name : $scope.name,
            brief : $scope.brief,
            industry : $scope.industry,
            skills : $scope.skills
        })).then(function(res){
            if(res.data && res.data.data && res.data.ok){
                $http(api.login({name : $scope.name})).then(function(res){
                    if(res.data && res.data.ok){
                        $state.go("/view-project/"+$scope.name);
                    }else{
                        $scope.error = res.data.error;
                    }
                });
            }else{
                $scope.error = res.data.error;
            }
        });
    };
}]);

