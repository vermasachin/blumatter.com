/* * ************************************************************ 
 * Date: 17 May, 2016
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file ApiClient.js
 * *************************************************************** */


var http = require("http");

/**
 * Config should have properties - host, port
 * @param {Object} config
 * @returns {Con}
 */
var Con = function(config){
    var self = this;
    this.conf = config || {"host" : "localhost", "port" : 3000};
    this.headers = {
        value: {},
        add : function(header,value){
            self.headers.value[header] = value; return self;
        },
        remove: function(header){
            if(self.headers.value.hasOwnProperty(header))
                delete self.headers.value[header];
            return self;
        },
        clear: function(){
            self.headers.value = {}; return self;
        },
        get: function(header){
            return self.headers.value[header];
        }
    };    
};

Con.prototype.request = function(route,method,data,callback){
    var self = this;
    if(route.match(new RegExp("^http:\/\/"+self.conf.host)))
        route = route.replace(new RegExp("^http:\/\/"+self.conf.host),'');
    var opts = {
        host: self.conf.host, port: self.conf.port, method: method ,path: route, headers: {}
    };
    if(method === 'POST' && data)
        opts.headers['Content-Type'] = 'application/json';
    if(Object.keys(self.headers.value).length){
        for(var k in self.headers.value)
            opts.headers[k] = self.headers.value[k];
    }
    var req = http.request(opts,function(res){
        var data = "";
        res.on('data',function(d){
            data += d;
        }).on("end",function(){
            var r = null;
            try{
                var r = JSON.parse(data);
            }catch(e){
                r= data;
            }
            var header = res.headers;
            if(header.hasOwnProperty('set-cookie')){
                self.headers.add('Cookie',header['set-cookie']);
            };
            callback(null,res.statusCode,res.headers,r);
        });
    }).on("error",function(err){
        callback(err);
    });
    if(method === 'POST' && data)
        req.write(JSON.stringify(data));
    req.end();
};

Con.prototype.constructor = Con;

/**
 * @param {Object} config
 * @returns {Client}
 */
var Client = function(config){
    this.io = new Con(config);
    this.conf = config;
    if(!this.conf) this.conf = {};
    if(!this.conf.host) this.conf.host = "";
    if(!this.conf.port) this.conf.port = "";
};

Client.prototype.call = function(test,callback){
    this.io.headers.add("Content-Type","application/json");
    this.io.request(test.url,test.method || 'GET',test.data || "",function(err,status,headers,res){
        if(err) return callback(err);
        if(test.status && parseInt(status) !== test.status){
            return callback(new Error('wrong status, expected '+test.status+", received: "+status),res);
        }
        callback(null,res);
    });
};
Client.prototype.constructor = Client;

module.exports = Client;
