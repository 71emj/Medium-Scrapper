const apiRoute = new require("express").Router(),
   searchRecord = require("../lib/searchRec.js"),
   dataBase = require("../models");

module.exports = function() {
   console.log("api");

   apiRoute.all("/api/*?", function(req, res, next) {
      if (!req.path.match(/(\/\api?\/.+$)/g)) {
         return;
      }
      console.log("cur %s", req.path);
      next();
   });

   apiRoute.post("/api/save", function(req, res) {
      console.log(req.body);

      dataBase.Article
         .create(req.body)
         .then((result) => {
            res.status(200).send("success");
            // console.log(JSON.stringify(req.body));

            searchRecord(/*JSON.stringify(req.body)*/req.body.link).then((data) => {
               // console.log(data);
            });
         }).catch(console.error.bind(console));
   });

   apiRoute.post("/api/notes", function(req, res) {
      console.log(req.body);
      // res.send("hello");

      dataBase.Note
         .create(req.body)
         .then((result) => {
            console.log(result);

            return dataBase.Article.findOneAndUpdate({ _id: req.body.articleId }, {
               $push: { notes: result._id }
            }, { new: true });
         })
         .then((article_body) => {
            const lastIndex = article_body.notes.length - 1;
            return dataBase.Note.findOne({ _id: article_body.notes[lastIndex] });
         })
         .then((data) => {
            console.log(data);

            res.status(200).json(data);
         }).catch(console.error.bind(console));
   });

   apiRoute.delete("/api/notes/delete", function(req, res) {
      console.log(req.body);
      // res.send("hello");

      dataBase.Note
         .deleteOne({ _id: req.body.noteid })
         .then((result) => {
            console.log(result);

            return dataBase.Article.findOneAndUpdate({ _id: req.body.articleid }, {
               $pull: { notes: req.body.noteid }
            });
         })
         .then((data) => {
            console.log(data);

            // res.status(200).json(data.notes);
            res.status(200).send("deleted");
         }).catch(console.error.bind(console));
   });

   apiRoute.delete("/api/saved/delete", function(req, res) {
      console.log(req.query["articleid"]);

      dataBase.Article
         .deleteOne({ _id: req.query["articleid"] })
         .then((result) => {
            console.log(result);

            return dataBase.Note.remove({ articleId: req.query["articleid"] });
         })
         .then((data) => {
            console.log(data);

            // res.status(200).json(data.notes);
            res.status(200).send("deleted");
         }).catch(console.error.bind(console));
   });

   return apiRoute;
}