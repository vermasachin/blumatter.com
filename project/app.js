/* * ************************************************************ 
 * Date: 28 Jul, 2018
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file app.js
 * *************************************************************** */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var config = require("./config");

// ******* Node Lib     ************ //
var http = require('http');
var app = express();

// Session setup
var session = require('express-session');
var pgsession = require("./core/pg-session")(session);
app.use(session({
    secret: "xraySecret",resave: false,saveUninitialized:true,
    cookie: { maxAge: (2) * 86400000 },
    store: new pgsession({})
}));

app.use(require('morgan')('dev'));

// ******* Xray Routes  ************ //
var router = require("./api/");

// all environments
app.set('port', config.xrf.port);
app.set('views', './public/html');
app.enable('strict routing');
app.use(express.static(path.join(__dirname, 'public'),{ maxAge: 31557600000 }));

app.use(bodyParser.text());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.addRoutes(app);

app.listen(app.get('port'), function(){});