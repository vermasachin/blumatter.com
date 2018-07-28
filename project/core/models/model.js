/* * ************************************************************ 
 * Date: 8 May, 2018
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file model.js
 * *************************************************************** */

var pg = require("../postgres")();
var errors = require("../errors.json");

var literals = {
    eq : '=',
    like : 'like',
    gt : '>',
    lt : '<',
    gte : '>=',
    lte : '<=',
    ne : "!=",
    similar : "SIMILAR TO"
};

var types = {
    'integer' : 'integer',
    'string' : 'string',
    'float' : 'float',
    'date' : 'date',
    'json' : 'json',
    'boolean' : 'boolean'
};
exports.types = types;

var checks = {
    integer : function(v){
        return v === null || !isNaN(parseInt(v));
    },
    string : function(v){
        return v === null || typeof v === 'string';
    },
    float : function(v){
        return v === null || !isNaN(parseFloat(v));
    },
    date : function(v){
        return v === null || !isNaN(Date.parse(v));
    },
    boolean : function(v){
        return v === null || typeof v === 'boolean' || v === 'true' || v === 'false';
    },
    json : function(v){
        if( v === null || typeof v === 'object')
            return true;
        if(typeof v === 'string'){
            try{
                var j = JSON.parse(v);
                return true;
            }catch(e){
                return false;
            }
        }else {
            return false;
        }
    }
};

class Model {
    constructor (tablename,props){
        this.table = tablename;
        this.props = props;
        this.pg = pg;
    }
    
    getCondSingle (field,match,pos){
        if(this.props.hasOwnProperty(field)){
            return field + " " + literals[match] + " $" + pos;
        }else throw new Error(errors.invalid_field_name+" - "+field);
    }
    
    getLiterals (cond){
        var list = [];
        for(var k in literals){
            if(cond.hasOwnProperty(k))
                list.push(k);
        }
        return list;
    }
    
    /**
     * Example of condition objects -
     * { prop : { eq : value } }
     * { prop : { like : value } }
     * { prop1 : {eq : value } , prop2 : { eq : value } }
     * { prop1 : {eq : value } , prop2 : { eq : value }, join : 'AND' }
     * { prop1 : {eq : value } , join : 'AND' , sub : {prop1 : {gt : value } , prop2 : { lt : value }, join : "OR" } }
     * 
     * @param {Object} cond
     * @param {integer} posstart
     * @param {boolean} sub
     * @returns {nm$_model.Model.getCond.modelAnonym$1|nm$_model.Model.getCond.modelAnonym$0}
     */
    getCond (cond,posstart, sub){
        sub = sub || false;
        cond.join = cond.join || "AND";
        let list = [], params = [], pos = posstart || 1;
        for(var k in cond){
            if(k !== 'join' && k !== 'sub' && k !== 'limit' && k !== 'offset' && k !== 'order' ){
                var ltlist = this.getLiterals(cond[k]);
                var condlist = [];
                for(var i=0;i<ltlist.length;i++){
                    condlist.push(this.getCondSingle(k,ltlist[i],pos++));
                    params.push(cond[k][ltlist[i]]);
                }
                var join = cond[k].join || "AND";
                list.push(condlist.join(" "+join+" "));
            }else if(k === 'sub'){
                var sub = this.getCond(cond[k],pos,true);
                list = [...list,sub.sql ? " ( " +sub.sql + " ) " : ""];
                params = [...params,...sub.params];
            }
        }
        if(!list.length){
            return {
                sql : "", params : []
            };
        }
        var sql = list.join(" "+(cond.join)+ " ");
        if(!sub){
            sql = "WHERE "+sql;
        }
        return { sql : " "+sql, params : params };
    }
    
    getTailSql (cond){
        var sql = " ",orders = [];
        if(cond.hasOwnProperty('order')){
            sql += " ORDER BY ";
            if(cond.order.length){
                cond.order.forEach(function(o){
                    for(var k in o){
                        orders.push(k + " " + o[k]);
                    }
                });
            }else{
                for(var k in cond.order){
                    orders.push(k + " " + cond.order[k]);
                }
            }
            sql += orders.join(",");
        }
        if(cond.hasOwnProperty('limit')){
            sql += " LIMIT "+cond.limit;
        }
        if(cond.hasOwnProperty('offset')){
            sql += " OFFSET "+cond.offset;
        }
        return sql;
    }
    
    /**
     * 
     * @param {object} data { field : <value> , ...}
     * @param {function} callback
     */
    insert (data,callback) {
        let fields = [],params = [],holders = [];
        for (let k in data){
            if(this.props.hasOwnProperty(k)){
                if(!checks[this.props[k]] (data[k]) ){
                    return callback(new Error(errors.invalidDataFormat + " in field "+k));
                }
                fields.push(k);
                params.push(data[k]);
                holders.push("$"+params.length);
            }
        }
        let fieldStr = fields.join(","), holderStr = holders.join(",");
        let sql = "INSERT INTO "+this.table+" ("+fieldStr+") VALUES ("+holderStr+")";
        pg.insert(sql,params,callback); 
    }
    
    /**
     * 
     * @param {object} cond
     * @param {string} view optional, view name to use
     * @param {functions} callback
     */
    findOne ( cond, view, callback){
        cond = cond || {};
        cond.limit = 1;
        var cb = typeof view === 'string' ? callback : view;
        try{
            var t = typeof view === 'string' ? view : this.table;
            var cnd = this.getCond(cond);
            var sql = "SELECT * FROM "+t+ cnd.sql + this.getTailSql(cond);
        }catch(e){
            return cb(e);
        }
        pg.select(sql,cnd.params,cb);
    }
   
    /**
     * 
     * @param {object} cond
     * @param {string} view optional, view name to use
     * @param {functions} callback
     */
    find (cond, view,callback){
        var cb = typeof view === 'string' ? callback : view;
        try{
            var t = typeof view === 'string' ? view : this.table;
            var cnd = this.getCond(cond);
            var sql = "SELECT * FROM "+t+ cnd.sql + this.getTailSql(cond);
        }catch(e){
            return cb(e);
        }
        pg.selectAll(sql,cnd.params,cb);
    }
    
    /**
     * 
     * @param {object} fields
     * @param {object} cond
     * @param {string} view optional, view name to use
     * @param {functions} callback
     */
    findFields ( fields ,cond, view,callback){
        var cb = typeof view === 'string' ? callback : view;
        try{
            var t = typeof view === 'string' ? view : this.table;
            var cnd = this.getCond(cond);
            var sql = "SELECT "+fields.join(",")+" FROM "+t+ cnd.sql + this.getTailSql(cond);
        }catch(e){
            return cb(e);
        }
        pg.selectAll(sql,cnd.params,cb);
    }
    
    remove (cond,callback){
        try{
            var cnd = this.getCond(cond);
            var sql = "DELETE FROM "+this.table+cnd.sql;
            pg.delete(sql,cnd.params,callback);
        }catch(e){
            callback(e);
        }
    }
    
    update (data, cond,callback){
        let updates = [],params = [];
        for (let k in data){
            if(this.props.hasOwnProperty(k)){
                if(!checks[this.props[k]] (data[k]) ){
                    return callback(new Error(errors.invalidDataFormat  + " in field "+k));
                }
                if(this.props[k] === types.json){
                    params.push(JSON.stringify(data[k]));
                }else{
                    params.push(data[k]);
                }
                updates.push(k + " = $" +params.length);
            }
        }
        let sql = "UPDATE "+this.table+" SET "+updates.join(",");
        try{
            let cnd = this.getCond(cond,params.length+1);
            sql += cnd.sql;
            params = [...params,...cnd.params];
            pg.update(sql,params,callback); 
        }catch(e){
            callback(e);
        }
    }
}

exports.Model = Model;