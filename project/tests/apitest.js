/* * ************************************************************ 
 * Date: 28 Oct, 2017
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file apitest.js
 * *************************************************************** */

var clientClass = require("./ApiClient");
var routes = require("./routes");

var client = new clientClass({host : routes.host, port : routes.port});

var assert = require("assert");
var async = require("async");

describe("routes",function(){
    async.eachSeries(Object.keys(routes.routes),function(k,cb){
        var r = routes.routes[k];
        
        describe("# "+r.method+" "+r.url,function(){
             r.tests.forEach(function(t,i){
                 it(t.desc || "No Description, index - "+i,function(done){
                    client.call({
                        url : r.url, method : r.method, data : t.data || null, status : t.status || null
                    },function(err,res){
                        t.test(res);
                        done();
                    });
                 });
             });
        });
        
        cb();
    });
});