module.exports = function() {

	const mongoose = require("mongoose");
   const Schema = mongoose.Schema;

   const searchedSchema = new Schema({
      accessId: {
         type: Number,
         unique: true
      },
      searched: [{}] // push stringify object as item
   });

   // This creates our model from the above schema, using mongoose's model method
   const History = mongoose.model("History", searchedSchema);

   // Export the Note model
   return { History };
}