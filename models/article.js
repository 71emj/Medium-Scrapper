module.exports = function() {

	const mongoose = require("mongoose");
   const Schema = mongoose.Schema;

   const articleSchema = new Schema({
      title: String,
      article: String,
      notes: [{
         type: Schema.Types.ObjectId,
         ref: "Note"
      }],
      createdAt: {
      	type: Date,
      	default: Date.now
      }
   });

   // This creates our model from the above schema, using mongoose's model method
   const Article = mongoose.model("Article", articleSchema);

   // Export the Note model
   return { Article };
}