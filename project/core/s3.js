/* * ************************************************************ 
 * 
 * Date: 27 Nov, 2014
 * version: 0.0.1
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file s3.js
 * *************************************************************** */

var AWS = require("./AWS"); 
var conf = require("../conf");
var s3 = new AWS.S3(); 
var async = require("async");

exports.init = function(bucket,callback){
    if(!bucket) return callback(new Error("bucket name not configured"));
    s3.headBucket({Bucket: bucket},function(err,data){
        if(err){
            var params = {
                Bucket: bucket
            };
            s3.createBucket(params, function(err, data) {
                if(err) callback(new Error("Error creating bucket "+bucket+":"+err.message));
                else callback(err,true);
            });
        }else callback(err,true);
    });
};

exports.upload = function(bucket,url,data,type,callback){
    var params = {
        Bucket: bucket, /* required */
        Key: url, /* required */
        Body: data,
        ContentType: type
    };
  s3.putObject(params,function(err,data){
      callback(err,data);
  });
};
/**
 * If callback is not provided read stream is returned.
 * @param {string} url Object url
 * @param {Function} callback
 * @returns {stream}
 */
var getFile = function(bucket,url,callback){
    var params = {Bucket: bucket, Key: url};
    var call = s3.getObject(params);
    if(callback){
        call.on('success', function(response) {
            callback(null,response.data);
        }).on('error', function(err) {
            callback(err);
        });
    }
    call.send();
    if(!callback)  return call.createReadStream();
};
exports.getFile = getFile;

/**
 * Check if bucket has folder
 * @param {type} bucket
 * @param {type} folder
 * @param {type} callback
 */
var hasObject = function(bucket,folder,callback){
    var params = {Bucket: bucket, Key: folder};
    s3.headObject(params,function(err,data){
        callback(err,err ? false : data);
    });
};
exports.hasObject = hasObject

var listContent = function(bucket,folder,callback){
    var list = [];
    var params = { Bucket: bucket, /* required */ Prefix: folder };
    var getter = function(cb){
        s3.listObjects(params,function(err,res){
            if(res && res.Contents && res.Contents.length){
                list = list.concat(res.Contents);
                if(res.Contents.length === 1000){
                    params.Marker = list[list.length - 1].Key;
                    getter(cb);
                }else cb(err,list);
            }else cb(err,list);
        });
    };
    getter(callback);
};
exports.listContent = listContent;

var remove = function(bucket,file,callback){
    s3.deleteObject({
        Bucket: bucket, Key: file
    },callback);
};
exports.delete = remove;

var sync = function(bucket1, folder1, bucket2, folder2, callback){
    listContent(bucket1, folder1,function(err, list){
        if(err) return callback(err);
        listContent(bucket2,folder2,function(err,list2){
            if(err) return callback(new Error("Error reading source:"+err.message));
            if(!list.length) return callback(new Error("Source has no data"));
            var list2Keys = list2.map(function(l){ return l.Key; });
            var errorList = "";
            async.each(list,function(l,cb){
                var i = list2Keys.indexOf(l.Key);
                if(i === -1 || l.Size !== list2[i].Size){
                    s3.copyObject({
                        Bucket: bucket2,
                        CopySource: bucket1+"/"+l.Key,
                        Key: l.Key.replace(new RegExp("^"+folder1+"\/"), folder2+"/")
                    },function(err){
                        if(err) errorList += "\n"+err.message;
                        cb();
                    });
                }else cb();
            },function(err){
                if(errorList) callback(new Error(errorList));
                else callback();
            });
        });
    });
};
exports.sync = sync;

exports.listRawDataFiles = function(username,callback){
    listContent(conf.aws.bucket,conf.aws.rawData+"/"+username+"/",callback);
};

exports.deleteRawDataFile = function(filename,callback){
    remove(conf.aws.bucket,conf.aws.rawData+"/"+filename,callback);
};

exports.getRawDataFileInfo = function(filename,callback){
    hasObject(conf.aws.bucket,conf.aws.rawData+"/"+filename,callback);
};

exports.getRawDataFile = function(filename,callback){
    getFile(conf.aws.bucket,conf.aws.rawData+"/"+filename,callback);
};

exports.syncRawData = function(sourceBucket,sourceUsername,destUsername,callback){
    sync(sourceBucket,conf.aws.rawData+"/"+sourceUsername,conf.aws.bucket,conf.aws.rawData+"/"+destUsername,callback);
};

exports.s3 = s3;