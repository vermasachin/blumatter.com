/* * ************************************************************ 
 * Date: 28 Jul, 2018
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file index.js
 * *************************************************************** */



var async = require("async");
var models = require("../models/");
var fs = require("fs");


var home = function(req,res){
    fs.createReadStream("../public/html/index.html").pipe(res);
};

var createClient = function(req,res){
    models.client.findOne({ name : {eq : req.body.name} }, function(err){
        if(err && err.message === 'not_found'){
            models.client.insert({
                name : req.body.name, email : req.body.email, phone : req.body.phone
            },function(err,res){
                res.json({ok : !err, error : err ? err.message : null});
            });
        }else{
            res.json({ok : false, error : "Client found already"});
        }
    });
};

var createExpert = function(req,res){
    models.expert.findOne({ name : {eq : req.body.name} }, function(err){
        if(err && err.message === 'not_found'){
            models.expert.insert({
                name : req.body.name,
                email : req.body.email,
                phone : req.body.phone,
                location : req.body.location,
                description : req.body.desc,
                industry : req.body.industry,
                skills : req.body.skills
            },function(err,res){
                res.json({ok : !err, error : err ? err.message : null});
            });
        }else{
            res.json({ok : false, error : "Account exists already"});
        }
    });
};
name            : types.string,
    brief           : types.string,
    industry        : types.string,
    skills          : types.json
var createProject = function(req,res){
    
}

exports.addRoutes = function(app){
    app.get("/",home);
    
    app.post("/client", createClient);
    app.post('/expert', createExpert);
    app.post('/project', createProject);
    app.post("/login",login);
    app.get("/logout",logout);
};