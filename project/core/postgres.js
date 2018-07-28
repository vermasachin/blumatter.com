/* ************************************************************* 
 * 
 * Date: Apr 20, 2014 
 * version: 1.0
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Description:   
 * Javascript file 
 * 
 * 
 * *************************************************************** */

var pg = require('pg');
var config = require('../config').pg;

const { Pool, Client } = require('pg');

var postgres = function(conf){
    if(!conf || !conf.pghost || !conf.pgport || !conf.pgdb || !conf.pgrole || !conf.pgpass)
        throw new Error("Missing required information from postgres config");
    this.conString = "postgresql://"+conf.pgrole+":"+conf.pgpass+"@"+conf.pghost+":"+conf.pgport+"/"+conf.pgdb;
    this.pool = new Pool({ connectionString: this.conString  });
};

/**
 *
 * @param {string} sql The sql to execute
 * @param {Object} params
 * @param {Function} callback callback(err,result)
 */
postgres.prototype.exec = function(sql,params,callback){
    this.getClient(function(err, client, done) {
        if(err) return callback(err);
        client.query(sql,params, function(errq, result) {
            callback(errq,result);
            done();
        });
    });
};

/**
 * 
 * @param {Function} callback callback(error,client)
 */
postgres.prototype.getClient = function(callback){
    this.pool.connect(callback);
};

/**
 * Select a single record
 * @param {string} sql The sql to execute
 * @param {Object} params
 * @param {Function} callback callback(err,row) 'row' is object with columns as properties
 */
postgres.prototype.select = function(sql,params,callback){
    this.exec(sql,params,function(err,res){
        if(err) callback(err,null);
        else{
            if(res.rows && res.rows.length)
                callback(err,res.rows[0]);
            else callback(new Error("not_found"),null);
        }
    });
};

/**
 * Select multiple records
 * @param {string} sql The sql to execute
 * @param {Object} params
 * @param {Function} callback callback(err,rows) 'rows' is an array of objects
 */
postgres.prototype.selectAll = function(sql,params,callback){
    this.exec(sql,params,function(err,res){
        if(err) callback(err,null);
        else{
            if(res.rows && res.rows.length)
                callback(err,res.rows);
            else callback(new Error("not_found"),null);
        }
    });
};

/* 
 * Insert operation, result is id if sql has "RETURNING id" appended at last, otherwise the inserted row.
 * @param {string} sql The sql to execute
 * @param {Object} params
 * @param {Function} callback callback(err,result)
 */
postgres.prototype.insert = function(sql,params,callback){
    this.exec(sql,params,function(err,res){
        if(err) callback(err,null);
        else{
            if(res.rowCount){
                if(res.rows.length && res.rows[0].id)
                    callback(err,res.rows[0].id);
                else
                    callback(err,res.rows);
            }
            else callback(new Error("insert_failed"),null);
        }
    });
};

/*
 * Update operation, callback result is row count of updated rows if successful.
 * @param {string} sql The sql to execute
 * @param {Object} params
 * @param {Function} callback callback(err,result)
 */
postgres.prototype.update = function(sql,params,callback){
    this.exec(sql,params,function(err,res){
        if(err) callback(err,null);
        else callback(err,res ? res.rowCount : 0);
    });
};

/*
 * Delete operation, callback result is row count of deleted rows if successful.
 * @param {string} sql The sql to execute
 * @param {Object} params
 * @param {Function} callback callback(err,result)
 */
postgres.prototype.delete = function(sql,params,callback){
    this.exec(sql,params,function(err,res){
        if(err) callback(err,null);
        else callback(err, res ? res.rowCount : 0);
    });
};

/*
 * @param {string} sql The sql to execute
 * @param {Object} params
 * @param {string} fieldname The field name to retrieve
 * @param {Function} callback callback(err,result)
 */
postgres.prototype.value = function(sql,params,fieldname,callback){
    this.exec(sql,params,function(err,res){
        if(err) callback(err,null);
        else{
            if(res.rows && res.rows[0] && res.rows[0].hasOwnProperty(fieldname))
                callback(err,res.rows[0][fieldname]);
            else callback(new Error("not_found"),null);
        }
    });
};

/**
 * Api Functions
 * 
 * begin(callback) : Begin the transaction
 * query(sql,params,callback) : Perform and operation in transaction
 * commit(callback): Commit the transaction
 * rollback(callback): Roll back the transaction
 * @param {pg} client
 * @param {Function} done
 */
var transaction = function(client,done){
    var rolledback = false;
    var begin = function(callback){
        client.query("BEGIN",callback);
    };
    var commit = function(callback){
        client.query("COMMIT",function(err,res){
            callback(err,res);
            if(err) rollback();
            else done();
        });
    };
    var rollback = function(){
        rolledback = true;
        client.query("ROLLBACK",function(err){
            done(err);
            if(err) console.error("Error rolling back:",err.message);
        });
    };
    var query = function(sql,params,callback){
        if(!rolledback)
            client.query(sql,params,function(err,res){
                callback(err,res);
                if(err)    rollback();
            });
        else callback(new Error("query after rollback!! this should be a bug. Did you ignore error from transaction?"));
    };
    this.begin = begin;
    this.commit = commit;
    this.exec = query;
    this.rollback = rollback;
};

transaction.prototype.constructor = transaction;

/**
 * 
 * @param {Function} callback callback(error,Transaction) Calls back with Transaction Object
 * which can be used to control a transaction lifecycle.
 */
postgres.prototype.getTransaction = function(callback){
    this.getClient(function(err,client,done){
        if(err) callback(err);
        else callback(null,new transaction(client,done));
    });
};

module.exports = function(conf){
    return new postgres(arguments.length?conf:config);
};