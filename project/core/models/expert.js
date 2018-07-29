/* * ************************************************************ 
 * Date: 28 Jul, 2018
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file expert.js
 * *************************************************************** */



var model = require("./model");
var config = require("../../config").pg;

var types = model.types;
var table = config.pgschema+".expert";

var props = {
    name            : types.string,
    email           : types.string,
    phone           : types.string,
    location        : types.string,
    cvfile          : types.string,
    description     : types.string,
    industry        : types.string,
    skills          : types.json,
    cvtext          : types.string
};

class Expert extends model.Model{
    constructor(){
        super(table,props);
    }
}

module.exports = new Expert();