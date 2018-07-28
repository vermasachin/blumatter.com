/* * ************************************************************ 
 * Date: 28 Jul, 2018
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file client.js
 * *************************************************************** */


var model = require("./model");
var config = require("../../config").pg;

var types = model.types;
var table = config.pgschema+".client";

var props = {
    email      :     types.string,
    name       :     types.string,
    phone      :     types.string
};

class Client extends model.Model{
    constructor(){
        super(table,props);
    }
}

module.exports = new Client();