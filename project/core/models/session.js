/* * ************************************************************ 
 * Date: 28 Jul, 2018
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file session.js
 * *************************************************************** */



    
var model = require("./model");
var config = require("../../config").pg;

var types = model.types;
var table = config.pgschema+".session";
var props = {
    s        :   types.string,
    sess     :   types.json
};


class Session extends model.Model{
    constructor(){
        super(table,props);
    }
}

module.exports = new Session();