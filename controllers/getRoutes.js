const pageRoute = new require("express").Router(),
   scraper = require("../lib/scraper.js"),
   dataBase = require("../models"),
   handlebars = require("handlebars");

handlebars.registerHelper("json", function(obj) {
   console.log("Helper is running ", obj);
   return new handlebars.SafeString(JSON.stringify(obj));
});

module.exports = function() {
   console.log("get");

   pageRoute.all("/*?", function(req, res, next) {
      if (!!req.path.match(/(\/\w+?\/.+$)/g)) {
         return;
      }
      console.log(req.path);
      next();
   });

   pageRoute.get("/saved", function(req, res) {

      const saved = dataBase.Article;
      console.log("this is saved %s", saved);

      saved
         .find({})
         .populate("notes")
         .then((results) => {
            console.log("this is the results %s", results);
            const resArr = Array.from(results),
               notes = {};
            // console.log(resArr);
            for (let elem of results) {
               notes[elem._id] = elem.notes;
            }
            // res.status(200).json(notes);
            res.status(200).render("saved", { data: resArr, notes: notes });
         })
         .catch(console.error.bind(console));

   });

   pageRoute.get("/*?", function(req, res) {
      res.status(200).render("index");
   });

   pageRoute.post("/scrap", async function(req, res) {

      console.log(req.body);

      scraper(req.body.topic, req.body.limit).then((data) => {
         res.status(200).json(data);
      }).catch((err) => {
      	res.status(404).send(err);
      });

   });

   return pageRoute;
}