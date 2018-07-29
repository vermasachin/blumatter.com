/* * ************************************************************ 
 * Date: 28 Jul, 2018
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file index.js
 * *************************************************************** */



var models = require("../core/models/");
var industry = require("../core/data/industry");
var jobcodes = require("../core/data/jobcodes");
var fs = require("fs");
var path = require("path");
var multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
          cb(null, 'cv/');
    },
    filename: function (req, file, cb) {
          var ext = file.mimetype.indexOf("pdf") > -1 ? 'pdf' : 'docx';
          cb(null, file.fieldname + '-' + req.session.user.name+"."+ext);
    }
});
var upload = multer({ storage: storage });
var cvUpload = upload.fields([{ name: 'cv', maxCount: 1 }]);


var home = function(req,res){
    var fullpath = path.resolve("./public/html/index.html");
    fs.createReadStream(fullpath).pipe(res);
};

var createClient = function(req,res){
    models.client.findOne({ name : {eq : req.body.name} }, function(err){
        if(err && err.message === 'not_found'){
            models.client.insert({
                name : req.body.name, email : req.body.email, phone : req.body.phone
            },function(err,row){
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
                description : req.body.description,
                industry : req.body.industry,
                skills : JSON.stringify(req.body.skills)
            },function(err,result){
                res.json({ok : !err, error : err ? err.message : null});
            });
        }else{
            res.json({ok : false, error : "Account exists already"});
        }
    });
};

var createProject = function(req,res){
    models.project.findOne({name : {eq : req.body.name}}, function(err,project){
        if(err && err.message === 'not_found'){
            models.project.insert({
                name    : req.body.name,
                brief   : req.body.brief,
                industry  : req.body.industry,
                skills   : JSON.stringify(req.body.skills)
            },function(err,rows){
                res.json({ok : !err,error : err ? err.message : null});
            });
        }else{
            res.json({ok : false, error : "Account exists already"});
        }
    });
};

var viewProject = function(req,res){
    models.project.findOne({name : {eq : req.params.projectname}},function(err,project){
        res.json({ok : !err, data : project || null});
    });
};

var getExperts = function(req,res){
    models.project.findOne({name : {eq : req.params.projectname}},function(err,project){
        models.expert.find({ industry : {eq : project.industry}},function(err,experts){
            res.json({ok : !err, data : experts});
        });
    });
};

var login = function(req,res){
    models.users.findOne({name : {eq : req.body.name}},function(err,user){
        req.session.user = user;
        req.session.save();
        res.json({ok : !err, data : user || null, error : err ? err.message : null});
    });
};

var logout = function(req,res){
    req.session.destroy(function(){
        res.json({ok : true});
    });
};

var currentUser = function(req,res){
    res.json({ok : true, data : req.session && req.session.user ? req.session.user : null});
};

var upload = function(req,res){
    models.expert.update({cvfile : req.files['cv'][0].path}, {name : { eq : req.session.user.name}},function(err){
        res.json({ok : true});
    });
};

var listIndustry = function(req,res){
    res.json(industry);
};

var listJobCodes = function(req,res){
    res.json(jobcodes);
};

exports.addRoutes = function(app){
    app.get("/",home);
    app.get("/me",currentUser);
    
    app.post("/client", createClient);
    app.post('/expert', createExpert);
    app.post('/project', createProject);
    app.get('/project/:projectname', viewProject);
    app.post("/login",login);
    app.get("/logout",logout);
    app.post("/uploadcv",cvUpload,upload);
    app.get("/industry",listIndustry);
    app.get("/jobcodes",listJobCodes);
    app.get("/experts/:projectname",getExperts);
};