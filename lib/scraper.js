const request = require("request"),
   searchRecord = require("./data_record.js"),
   cheerio = require("cheerio");

const MediumScrap = (category, limit) => {
   // need to work on category params
   const url = `https://medium.com/topic/${category}`;

   return new Promise((resolve, reject) => {
      request(url, (err, response, body) => {
         if (err) {
            reject(err);
         }

         console.log(response.statusCode);
         // console.log(body);
         const $ = cheerio.load(body);
         const articleSet = new Array();
         const compare = (link, i) => {
            return new Promise((resolve) => {
               searchRecord(null, i).then((data) => {
                  if (!data.searched) {
                     return false;
                  }
                  const recordObj = data.searched.reduce((obj, cur, index) => {
                     obj[cur] = index;
                     return obj;
                  }, {});

                  // console.log(recordObj);
                  // console.log("------------------");
                  console.log(recordObj.hasOwnProperty(link));

                  resolve(recordObj.hasOwnProperty(link));
               });
            });
         };

         const filter = (array) => {
            return new Promise((resolve) => {
               resolve(array.filter(async(elem, i) => {
                  return await compare(elem.link, i);
               }));
            });
         };

         const random = (limit) => {
            return Math.floor(Math.random() * limit);
         };

         $(".u-borderBox.js-sectionItem").each((i, elem) => {
            articleSet.push({
               link: $(elem).find("h3").closest("a").attr("href"),
               title: $(elem).find("h3").text(),
               article: $(elem).find("h4").text(),
               author: $(elem).find("a.postMetaInline--author").text(),
               time: $(elem).find("time").text(),
               datetime: $(elem).find("time").attr("datetime"),
               category: category
            });
         });


         filter(articleSet).then((trimObj) => {
            console.log("article length %s", articleSet.length);
            console.log("article length %s", trimObj.length);
            resolve(trimObj.splice(random(trimObj.length - limit), limit));
         });
      });
   })
}

module.exports = MediumScrap;