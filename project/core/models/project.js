/* * ************************************************************ 
 * Date: 28 Jul, 2018
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file project.js
 * *************************************************************** */

var model = require("./model");
var config = require("../../config").pg;

var types = model.types;
var table = config.pgschema+".project";

var props = {
    name            : types.string,
    brief           : types.string,
    industry        : types.string,
    skills          : types.json
};

class Project extends model.Model{
    constructor(){
        super(table,props);
    }
}

module.exports = new Project();