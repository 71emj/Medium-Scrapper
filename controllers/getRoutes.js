const pageRoute = new require("express").Router(),
	scraper = require("../lib/scraper.js"),
	handlebars = require("express-handlebars");

module.exports = function() {
	console.log("get");

	pageRoute.get("/*?", function(req, res, next) {
		if (!!req.path.match(/(\/\w+?\/.+$)/g)) {
			return;
		}
		console.log(req.path);
		next();
	});

	pageRoute.get("/*?", function(req, res) {
		
		res.status(200).render("index");
	});

	pageRoute.post("/scrap", async function(req, res) {

		console.log(req.body);

		scraper(req.body.topic, req.body.limit).then((data) => {
			res.status(200).json(data);	
		});
		
	});

	return pageRoute;
}