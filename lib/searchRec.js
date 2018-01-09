const dataBase = require("../models");

const initRecord = (i) => {
   dataBase.History.create({ accessId: i, searched: [] }).then((data) => {
      console.log("||||=======================|||||||| %s", data);
      return data;
   });
};

const update = (json) => {
   dataBase.History.findOneAndUpdate({ accessId: 0 }, {
      $push: { "searched": json }
   }).then((data) => {
      console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH %s", data);
      return data;
   });
};

// the indicator is a fail safe when database is deleted during server running (this will avoid )
module.exports = function(json, indicator = 0) {
   return new Promise((resolve) => {
      if (json) {
         return resolve(update(json));
      }
      
      dataBase.History.findOne({ accessId: 0 }).then((data) => {
         if (data) {
            resolve(data);
         } else {
            resolve(initRecord(indicator));
         }
      });
   });
}