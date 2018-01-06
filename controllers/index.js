const util = require("util"),
	path = require("path"),
   fs = require("fs");

module.exports = function() {
	const controllers = new Array;

   fs
      .readdirSync(__dirname)
      .filter(file => {
         return (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js');
      })
      .forEach((file) => {
         // !!file && require(path.join(__dirname, file))();
         controllers.push(require(path.join(__dirname, file))());
      });

   console.log("controllers ready");
   console.log(controllers);
   return controllers;
}