/* * ************************************************************ 
 * Date: 28 Oct, 2017
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file routes.js
 * *************************************************************** */


var assert = require("assert");

var client = {
    name : "Google", email : "admin@gmail.com", phone : "12345"
};
var expert = {
    name : "Shani", email : "satyashani@gmail.com", phone : "54321", 
    location  : "katni", description : "This is a test", industry : "Computer Software",
    skills : ["Accounting"]
};
var project = {
    name : "Blumatter",
    brief : "This is a test",
    industry : "Computer Software",
    skills : ['Accounting']
};
module.exports = {
    host : 'localhost', port : '3000',
    routes : {
        createClient : {
            url : "/client", method : "POST",  tests : [
                {
                    test : function(actual){
                        assert.equal(actual.hasOwnProperty('ok'),true);
                        assert.equal(actual.ok,true);
                    },
                    data : client,
                    status : 200
                }
            ]
        },
        createExpert : {
            url : "/expert", method : "POST",  tests : [
                {
                    test : function(actual){
                        assert.equal(actual.hasOwnProperty('ok'),true);
                        assert.equal(actual.ok,true);
                    },
                    data : expert,
                    status : 200
                }
            ]
        },
        loginExpert : {
            url : "/login", method : "POST",  tests : [
                {
                    test : function(actual){
                        assert.equal(actual.hasOwnProperty('ok'),true);
                        assert.equal(actual.ok,true);
                    },
                    data : expert,
                    status : 200
                }
            ]
        },
        currentUserExpert : {
            url : "/me", method : "GET", tests : [
                {
                    test : function(actual){
                        assert.equal(actual.hasOwnProperty('ok'),true);
                        assert.equal(actual.ok,true);
                    },
                    status : 200
                }
            ]
        },
        logoutExpert : {
            url : "/logout", method : "GET", tests : [
                {
                    test : function(actual){
                        assert.equal(actual.hasOwnProperty('ok'),true);
                        assert.equal(actual.ok,true);
                    },
                    status : 200
                }
            ]
        },
        loginClient : {
            url : "/login", method : "POST", tests : [
                {
                    test : function(actual){
                        assert.equal(actual.hasOwnProperty('ok'),true);
                        assert.equal(actual.ok,true);
                    },
                    data : client, 
                    status : 200
                }
            ]
        },
        currentUserClient : {
            url : "/me", method : "GET", tests : [
                {
                    test : function(actual){
                        assert.equal(actual.hasOwnProperty('ok'),true);
                        assert.equal(actual.ok,true);
                    },
                    status : 200
                }
            ]
        },
        createProject : {
            url : "/project", method : "POST", tests : [
                {
                    test : function(actual){
                        assert.equal(actual.hasOwnProperty('ok'),true);
                        assert.equal(actual.ok,true);
                    },
                    data : project, 
                    status : 200
                }
            ]
        },
        viewProject : {
            url : "/project/"+project.name, method : "GET" , tests : [
                {
                    test : function(actual){
                        assert.equal(actual.hasOwnProperty('data'),true);
                        assert.equal(actual.data.name,project.name,true);
                    },
                    status : 200
                }
            ]
        },
        logoutClient : {
            url : "/logout", method : "GET", tests : [
                {
                    test : function(actual){
                        assert.equal(actual.hasOwnProperty('ok'),true);
                        assert.equal(actual.ok,true);
                    },
                    status : 200
                }
            ]
        },
        listProjectExperts : {
            url : "/experts/"+project.name, method : "GET", tests : [
                {
                    test : function(actual){
                        assert.equal(actual.hasOwnProperty('data'),true);
                    },
                    status : 200
                }
            ]
        }
    }
};