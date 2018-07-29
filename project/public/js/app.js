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

app.service("user", ["$http", function($http){
    var user = null;
    
    $http(api.currentUser()).then(function(res){
        if(res.data && res.data.data){
            user = res.data.data;
        }
    });
    return {
        get : function(){
            return user;
        },
        set : function(data){
            user = data;
        }
    };
}]);

app.controller("userController", ["user",'$http','$scope','$state', function(user,$http,$scope,$state){
    $scope.user = null;
    
    $scope.$watch(function(){
        return user.get();
    },function(u){
        $scope.user = u;
    });
    
    $scope.logout = function(){
        $http(api.logout()).then(function(res){
            if(res.data && res.data.ok){
                user.set(null);
                $state.go("home");
            }
        });
    };
    
}]);

app.controller("home",["user",'$state','$scope',function(user,$state,$scope){
    $scope.$watch(function(){
        return user.get();
    },function(u){
        if(u && u.name){
            if(u.role === 'client'){
                $state.go("createProject");
            }else{
                $state.go("uploadCV");
            }
        }
    });
}]);

app.controller("login",["$scope",'$http','$state', 'user',function($scope,$http,$state,userSrv){
    $scope.name = "";
    $scope.error = "";
    
    $scope.login = function(){
        $scope.error = "";
        $http(api.login({name : $scope.name})).then(function(res){
            if(res.data && res.data.data && res.data.data.name){
                var user = res.data.data;
                userSrv.set(user);
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

app.controller("registerClient",["$scope",'$http','$state','user',function($scope,$http,$state,userSrv){
    $scope.name = "";
    $scope.email = "";
    $scope.phone = "";
    $scope.error = "";
    
    $scope.register = function(){
        $scope.error = "";
        $http(api.registerClient({
            name : $scope.name,
            email: $scope.email, 
            phone : $scope.phone
        })).then(function(res){
            if(res.data && res.data.ok){
                $http(api.login({name : $scope.name})).then(function(res){
                    if(res.data && res.data.data && res.data.data.name){
                        userSrv.set(res.data.data);
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


app.controller("registerExpert",["$scope",'$http','$state','user',function($scope,$http,$state,userSrv){
    $scope.name = "";
    $scope.email = "";
    $scope.phone = "";
    $scope.location = "";
    $scope.description = "";
    $scope.industry = "";
    $scope.skills = "";
    $scope.selectedSkills = [];
    
    $scope.industries = []; $scope.suggestedInd = [];
    $scope.skilllist = []; $scope.skillSuggest = [];
    
    $http(api.listIndustry()).then(function(res){
        $scope.industries = res.data;
    });
    
    $http(api.listJobCodes()).then(function(res){
        $scope.skilllist = res.data;
    });
    
    $scope.showIndustries = function(){
        $scope.suggestedInd = $scope.industries.filter(function(i, j){ return $scope.industry && i.name.match(new RegExp($scope.industry,'i'));}).slice(0,8);
    };
    $scope.selectIndustry = function(ind){
        $scope.industry = ind.name;
        $scope.suggestedInd = [];
    };
    $scope.showSkills = function(){
        var m = $scope.skills.match(/[a-zA-Z ]+$/), skill = m ? m[0] : "";
        $scope.skillSuggest = $scope.skilllist.filter(function(i, j){ return skill && i.name.match(new RegExp(skill,'i'));}).slice(0,8);
    };
    $scope.addSkill = function(skill){
        if($scope.selectedSkills.indexOf(skill.name) === -1){
            $scope.selectedSkills.push(skill.name);
        }
        $scope.skills = "";
        $scope.skillSuggest = [];
    };
    
    
    $scope.register = function(){
        $http(api.registerExpert({
            name : $scope.name,
            email : $scope.email,
            phone : $scope.phone,
            location : $scope.location,
            description : $scope.description,
            industry : $scope.industry,
            skills : $scope.selectedSkills
        })).then(function(res){
            if(res.data && res.data.ok){
                $http(api.login({name : $scope.name})).then(function(res){
                    if(res.data && res.data.data && res.data.data.name){
                        userSrv.set(res.data.data);
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
    $scope.selectedSkills = [];
    $scope.error = "";
    
    $scope.industries = []; $scope.suggestedInd = [];
    $scope.skilllist = []; $scope.skillSuggest = [];
    
    $http(api.listIndustry()).then(function(res){
        $scope.industries = res.data;
    });
    
    $http(api.listJobCodes()).then(function(res){
        $scope.skilllist = res.data;
    });
    
    $scope.showIndustries = function(){
        $scope.suggestedInd = $scope.industries.filter(function(i, j){ return $scope.industry && i.name.match(new RegExp($scope.industry,'i'));}).slice(0,8);
    };
    $scope.selectIndustry = function(ind){
        $scope.industry = ind.name;
        $scope.suggestedInd = [];
    };
    $scope.showSkills = function(){
        var m = $scope.skills.match(/[a-zA-Z ]+$/), skill = m ? m[0] : "";
        $scope.skillSuggest = $scope.skilllist.filter(function(i, j){ return skill && i.name.match(new RegExp(skill,'i'));}).slice(0,8);
    };
    $scope.addSkill = function(skill){
        if($scope.selectedSkills.indexOf(skill.name) === -1){
            $scope.selectedSkills.push(skill.name);
        }
        $scope.skills = "";
        $scope.skillSuggest = [];
    };
    
    $scope.register = function(){
        $scope.error = "";
        $http(api.createProject({
            name : $scope.name,
            brief : $scope.brief,
            industry : $scope.industry,
            skills : $scope.selectedSkills
        })).then(function(res){
            if(res.data && res.data.ok){
                $state.go("viewProject",{ "projectName" : $scope.name});
            }else{
                $scope.error = res.data.error;
            }
        });
    };
}]);

app.controller("viewProject",["$scope",'$http','$state','$stateParams',function($scope,$http,$state, $params){
    $scope.project = null;
    
    $scope.load = function(){
        $http(api.viewProject($params.projectName)).then(function(res){
            if(res.data && res.data.data){
                $scope.project = res.data.data;
                $http(api.listProjectExperts($scope.project.name)).then(function(res){
                    if(res.data && res.data.data){
                        $scope.experts = res.data.data;
                    }
                });
            }else{
                $scope.error = res.data.error;
            }
        });
    };
    $scope.load();
}]);

