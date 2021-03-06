(function($) {
   "use strict"

   // override dimmer template
   $.fn.dimmer.settings.template = {
      dimmer: function() {
         return $('<div />')
            .attr('class', 'ui dimmer')
            .css({
               "display": "flex",
               "align-items": "center",
               "justify-content": "center",
            })
            .append(
               $("<i>").attr("class", "plus icon big olive __save")
            );
      }
   };

   $.fn.dimmer.settings.duration = {
      hide: 800
   }

   const header = $("#header"),
      main = $("#main"),
      body = $("#body").find("div"),
      btnShow = $("#show").find("i");

   // main.hide();
   main.addClass("hidden");

   const switchView = function(flag) {
      !flag && header.transition({
         animation: "scale",
         duration: 500,
         onComplete: () => {
            main.transition({
               animation: "fly up",
               duration: 2000,
               displayType: "flex"
            });
         }
      });

      !!flag && header.transition({
         animation: "scale",
         duration: 500,
         onComplete: () => {
            main.transition("scale")
         }
      });
   }

   const save = function(json) {
      return new Promise((resolve) => {
         $.ajax({
            url: "/api/save",
            method: "POST",
            data: json,
            traditional: true
         }).then((response) => {
            console.log(response);
            resolve(true);
         });
      });
   };

   const submit = function(form) {
      const query = {};
      $.map(form.serializeArray(), function(elem, index) {
         query[elem.name] = isNaN(elem.value) ? elem.value.toLowerCase() : parseInt(elem.value);
      });

      return new Promise((resolve) => {
         $.post("/scrap", query)
            .then((data) => {
               switchView(0);
               resolve(data);
            });
      });
   };

   const populatePage = function(data) {
      console.log(data);
      data.forEach((elem, index) => {
         $("#body>div").append(
            $(`<article id="${index}" class="ui transition column hidden" data-category="${elem.category}"></article>`)
            .html(`<div class="ui card">
                  <div class="content">
                     <div class="header">
                        <h3 data-href="${elem.link}">
                           ${elem.title}
                        </h3>
                     </div>
                     <div class="meta">
                        by ${elem.author}
                     </div>
                     <div class="ui divider"></div>
                     <p class="description">
                        ${elem.article}
                     </p>
                     <div datetime="${elem.datetime}" class="ui bottom attached olive label">
                        Posted on ${elem.time}
                     </div>
               </div>
            </div>`)
         );
      });
   }

   // trigger save button to show
   const dim = function(event) {
         $(this).dimmer("show");
      },
      undim = function(event) {
         $(this).dimmer("hide");
      };

   body
      .on("mouseover", ".card", dim)
      .on("mouseleave", ".card", undim)
      .on("click", "i.__save", function() {
         console.log($(this).closest("article"));
         const article = $(this).closest("article");
         save({
               link: article.find(".header>h3").data("href"),
               title: article.find(".header>h3").text().replace(/(\n\s+)/g, ""),
               article: article.find(".description").text().replace(/(\n\s+)/g, ""),
               author: article.find(".meta").text().replace("by ", "").replace(/(\n\s+)/g, ""),
               time: article.find(".label").text().replace("Posted on ", "").replace(/(\n\s+)/g, ""),
               datetime: article.find(".label").attr("datetime"),
               category: article.data("category")
            })
            .then((res) => {
               article.find(".card>.content").css({
                  "display": "flex",
                  "align-items": "center",
                  "justify-content": "center"
               }).html(`<div class="header">Saved</div>`);

               setTimeout(() => {
                  article.transition({
                     animation: "fade",
                     duration: 800
                  });
               }, 2100);
            });
      });

   $("#search_query").on("submit", async function(event) {
      event.preventDefault();
      body.empty(); // destroy previously scrapped data
      btnShow.addClass("hidden");

      // animate loading
      const button = $("button[type=\"submit\"]");
      button.addClass("loading");

      const data = await submit($(this));
      populatePage(data);

      // remove loading animation
      button.removeClass("loading");

      //animate creation
      setTimeout(() => {
         $("article").transition({
            animation: "scale",
            duration: 800,
            interval: 300
         });
      }, 2500);
   });

   $("#return").on("click", (event) => {
      switchView(event);
      btnShow.removeClass("hidden");
   });

   btnShow.on("click", () => {
      switchView(0);
   });

   $(".selection").dropdown();

   $(".checkbox").checkbox();

}(jQuery));