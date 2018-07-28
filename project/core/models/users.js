/* * ************************************************************ 
 * Date: 6 Jun, 2018
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file user.js
 * *************************************************************** */

var model = require("./model");
var config = require("../../config").pg;

var types = model.types;
var table = config.pgschema+".users";

var props = {
    email      :     types.string,
    name       :     types.string,
    role       :     types.string
};

class Users extends model.Model{
    constructor(){
        super(table,props);
    }
    
    validate (name, callback){
        this.findOne({ name : {eq : name }}, function(err,user){
            if(err || !user){
                callback(err);
            }else{
                callback(null, user);
            }
        });
    }
}

module.exports = new Users();