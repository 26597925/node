var unit_string = function ()
{
	this.trim = function(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}

	this.ltrim = function(str) {
		return str.replace(/(^\s*)/g, "");
	}

	this.rtrim = function(str) {
		return str.replace(/(\s*$)/g, "");
	}

	this.test=function()
	{
		console.log(this.trim("\t start\t end \t"));
		console.log(this.ltrim("\t start\t end \t"));
		console.log(this.rtrim("\t start\t end \t"));
	}
}

module.exports = new unit_string();
//test-----------------------------------------------
// var unit_string = require("./unit_string.js");
// unit_string.test();