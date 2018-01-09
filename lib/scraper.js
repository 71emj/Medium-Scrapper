const request = require("request"),
	cheerio = require("cheerio");

const MediumScrap = (category, limit) => {
   // need to work on category params
   const url = `https://medium.com/topic/${category}`;

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
               link: $(elem).find("h3").closest("a").attr("href"),
               title: $(elem).find("h3").text(),
               article: $(elem).find("h4").text(),
               author: $(elem).find("a.postMetaInline--author").text(),
               time: $(elem).find("time").text(),
               datetime: $(elem).find("time").attr("datetime"),
               category: category,
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