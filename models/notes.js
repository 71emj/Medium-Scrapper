module.exports = function() {

	const mongoose = require("mongoose");
   const Schema = mongoose.Schema;

   const noteSchema = new Schema({
      content: String,
      createdAt: {
      	type: Date,
      	default: Date.now
      }
   });

   // This creates our model from the above schema, using mongoose's model method
   const Note = mongoose.model("Note", noteSchema);

   // Export the Note model
   return { Note: Note };
}