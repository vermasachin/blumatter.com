/* * ************************************************************ 
 * 
 * Date: 15 Mar, 2015
 * version: 0.0.1
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   Get aws instance with key and secret
 * Javascript file AWS.js
 * *************************************************************** */


var AWS = require('aws-sdk'); 
var conf = require("../config");

AWS.config.update({region: conf.aws.region || 'us-east-1' });
module.exports = AWS;