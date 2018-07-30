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

var pdf = require('pdf-parse');

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
    if(!req.body.name || !req.body.email){
        return res.json({ok : false, error : "Invalid name/email"});
    }
    models.client.findOne({ name : {eq : req.body.name} }, function(err){
        if(err && err.message === 'not_found'){
            models.client.insert({
                name : req.body.name, email : req.body.email, phone : req.body.phone
            },function(err,row){
                res.json({ok : !err, error : err ? err.message : null});
            });
        }else{
            res.json({ok : false, error : "Client exists already"});
        }
    });
};

var createExpert = function(req,res){
    if(!req.body.name || !req.body.email){
        return res.json({ok : false, error : "Invalid name/email"});
    }
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
    if(!req.body.name || !req.body.brief || !req.body.industry){
        return res.json({ok : false, error : "Invalid input"});
    }
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
            experts = experts || [];
            // Select only those with at least one matching skill
            var filter1 = experts.filter(function(expert){
                var matchingSkills = 0;
                project.skills.forEach(function(sk){
                    if(expert.skills.indexOf(sk) > -1){
                        matchingSkills++;
                    }
                });
                expert.matchingSkills = matchingSkills;
                return matchingSkills;
            });
            filter1.sort(function(a,b){ return b.matchingSkills - a.matchingSkills;});
            
            // Select only those with some match in brief and cv
            var filter2 = filter1.filter(function(expert){
                var matches = 0, briefarr = [], cvarr = [];
                if(!project.brief || !expert.cvtext){
                    return matches;
                }
                briefarr = project.brief.replace(/(\n+| +|\t+)/g," ").replace(/\./g,"").split(" ");
                cvarr = expert.cvtext.replace(/(\n+| +|\t+)/g," ").replace(/\./g,"").split(" ");
                briefarr.forEach(function(sk){
                    if(cvarr.indexOf(sk) > -1){
                        matches++;
                    }
                });
                expert.matchingWords = matches;
                return matches;
            });
            filter2.sort(function(a,b){ return b.matchingWords - a.matchingWords;});
            
            res.json({ok : !err, data : filter2});
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
    var file = req.files['cv'][0];
    var ext = file.mimetype.indexOf("pdf") > -1 ? 'pdf' : 'docx';
    fs.readFile(file.path,function(err,data){
        if(!err && ext === 'pdf'){
            pdf(data).then(function(data){
                models.expert.update({cvfile : file.path, cvtext : data.text}, {name : { eq : req.session.user.name}},function(err){
                    res.json({ok : true});
                });
            }).catch(function(error){
                models.expert.update({cvfile : file.path}, {name : { eq : req.session.user.name}},function(err){
                    res.json({ok : true});
                });
            });
        }else{
            if(err){
                console.log(err.message, 'error reading cv file');
            }
            models.expert.update({cvfile : file.path}, {name : { eq : req.session.user.name}},function(err){
                res.json({ok : true});
            });
        }
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