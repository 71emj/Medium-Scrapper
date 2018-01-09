const path = require("path"),
   fs = require("fs");

module.exports = function() {
	const random = (limit) => {
		return Math.floor(Math.random() * limit);
	};

	console.log("starts");

	const imgs = new Array();

   fs
      .readdirSync(path.join(__dirname, "../public/assets/image"))
      .filter(file => {
         return !!file.match(/background/);
      })
      .forEach((file) => {
         console.log(file);
         imgs.push(file);
      });

   return imgs[random(imgs.length)];
}