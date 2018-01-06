const apiRoute = new require("express").Router(),
	handlebars = require("express-handlebars");

module.exports = function() {
	console.log("api");
	
	// apiRoute.get("/api/*?", function(req, res, next) {
	// 	if (!req.path.match(/(\/\w+?\/.+$)/g)) {
	// 		return;
	// 	}
	// 	console.log("cur %s", req.path);
	// 	next();
	// });

	apiRoute.get("/api/*?", function(req, res) {
		res.status(200).json({ message: "Hello World", status: 200 });
	});

	return apiRoute;
}