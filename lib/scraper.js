const request = require("request"),
	cheerio = require("cheerio");

const MediumScrap = (category, limit) => {
   // need to work on category params
   const url = !!category ? `https://medium.com/topic/${category}` : "https://medium.com/topic/technology";

   return new Promise(resolve => {
      request(url, (err, response, body) => {
         if (err) {
            throw err;
         }

         console.log(response.statusCode);
         // console.log(body);
         const $ = cheerio.load(body);
         const articleSet = new Array();

         $(".u-borderBox.js-sectionItem").each((i, elem) => {
            articleSet.push({
               title: $(elem).find("h3").text(),
               article: $(elem).find("h4").text(),
               image: $(elem).find("a").attr("href")
            });
         });

         const random = (limit) => {
            return Math.floor(Math.random() * limit);
         }

         resolve(articleSet.splice(random(articleSet.length - limit), limit));
      });
   })
}

module.exports = MediumScrap;