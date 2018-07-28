/* * ************************************************************ 
 * 
 * Date: 8 May, 2015
 * version: 0.0.1
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file pg-session.js
 * *************************************************************** */

var models = require("./models");

module.exports = function (session) {

    var Store = session.Store;

    function PgStore (options) {
      var opts = options || {};
      Store.call(this, opts);
    }

    PgStore.prototype.__proto__ = Store.prototype;

    PgStore.prototype.get = function (sid, fn) {
        models.session.findOne( { s : { eq : sid }} ,function(err,data){
            if(err && err.message === 'not_found')
                fn(null,null);
            else 
                fn(err,data && data.hasOwnProperty("sess") ? data.sess : null);
        });
    };
  
    PgStore.prototype.set = function (sid, sess, fn) {
        models.session.update({sess : sess}, { s : { eq : sid }}, function(err,rowsUpdated){
            if(err || !rowsUpdated)
                models.session.insert( { s : sid,sess : sess},fn);
            else fn(null,rowsUpdated);
        });
    };

    PgStore.prototype.destroy = function (sid, fn) {
        models.session.remove({ s : { eq : sid }},function(err){
            if(fn) fn(err);
        });
    };

    PgStore.prototype.touch = function (sid, sess, fn) {
        models.session.update({sess : sess}, { s : { eq : sid }},fn);
    };
    return PgStore;
};