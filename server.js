const DEBUG = true;

const http = require("http"),
   util = require("util"),
   log = require("morgan"),
   path = require("path"),
   request = require("request"),
   bodyParser = require("body-parser"),
   handlebars = require("express-handlebars"),
   mongoose = require("mongoose"),
   recordInit = require("./lib/data_record.js"),
   express = require("express");

const app = express(),
   server = http.createServer(app);

app.engine(".hbs", handlebars({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(log("dev"));
app.use(bodyParser.urlencoded({ extend: false }));
app.use(bodyParser.json());

// statics html, semantic ui, custom assets
app.use(express.static(path.join(__dirname, "/public")));
app.use("/dist", express.static(path.join(__dirname, "/semantic/dist")));
app.use("/assets", express.static(path.join(__dirname, "/public/assets")));

// loading all controllers in
app.all("*", require("./controllers"));

server.listen(process.env.PORT || 8000, (err) => {
   if (err) {
      throw err;
   }

   console.log("server listening on %s", server.address().port);

   mongoose.Promise = Promise;
   mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/mediumScrapDb")
      .then(() => {
         recordInit();
      })
      .catch((err) => {
         throw err;
      }); // if err theoratically i can switch to a different database or attempt to restart the connection

});

// before closing server
server.on("close", (callback) => {
   console.log("server closing");
   callback();
});

process.on('SIGINT', function() {
   server.close();
});

// nodemon...not working atm
process.once('SIGUSR2', function() {
   server.close(function() {
      gracefulShutdown(function() {
         process.kill(process.pid, 'SIGUSR2');
      });
   });
});