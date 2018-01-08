const path = require("path"),
   fs = require("fs");

const models = {};

fs
   .readdirSync(__dirname)
   .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js');
   })
   .forEach((file) => {
      // !!file && require(path.join(__dirname, file))();
      const obj = require(path.join(__dirname, file))();
      for (let elem in obj) {
         models[elem] = obj[elem];
      }
   });

console.log(models);

module.exports = models;