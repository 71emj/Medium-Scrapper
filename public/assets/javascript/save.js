function Main($, articleNotes) {
   "use strict";

   const renderCategory = function() {
      let obj = {};
      
      $("#category").find(".item").each((i, elem) => {
         if (obj[elem.innerHTML]) {
            $(elem).remove();
            return;
         }
         obj[elem.innerHTML] = true;
         const text = elem.innerHTML.trim();
         elem.innerHTML = text.replace(/[a-z]/i, text[0].toUpperCase());
      });
   }

   const modalContent = function(card, notes) {
      return new Promise((resolve) => {
         // console.log(card.find("p").text());
         const articleId = card.closest("article").data("id"),
            relatedNote = notes[articleId];

         console.log(articleId);
         console.log(relatedNote);

         const modalBody = $(".ui.modal"),
            title = card.find(".header").text(),
            author = card.closest("article").data("author"),
            link = card.closest("article").data("href"),
            content = card.find(".description").text();

         // empty notes first 
         $.each(modalBody.find(".__note"), (i, elem) => {
            emptyNote(elem);
         });

         relatedNote.forEach((elem) => {
            createEntry(elem);
         });

         modalBody
            .attr("data-curid", articleId)
            .find("h1").text(title).end()
            .find("#link").attr("href", link).end()
            .find("#author").text(`by ${author}`).end()
            .find("#text").text(content);

         resolve(modalBody);
      });
   }

   const newNote = function(that) {
      that.before(
         $(`<section class="ui segment __note form">
            <div class="ui grid">
               <div class="ui ten wide computer eight wide tablet sixteen wide mobile column">
                  <div class="field">
                     <textarea rows="3" placeholder="Add a note..."></textarea>
                  </div>
               </div>
               <div class="ui six wide computer eight wide tablet sixteen wide mobile column">
                  <button class="ui tiny right floated button __discard">
                     Discard
                  </button>
                  <button class="ui tiny right floated primary button __create">
                     Save
                  </button>
               </div>
            </div>
         </section>`)
      );
   };

   const deleteNote = function(that) {
      return new Promise((resolve) => {
         const articleNote = {
            articleid: $(".ui.modal").data("curid"),
            noteid: that.data("id")
         }

         $.ajax({
            url: "/api/notes/delete",
            method: "DELETE",
            data: articleNote
         }).then((response) => {
            console.log(response); // delete from object as well
            resolve({ that: that, id: that.data("id") });
         });
      });
   }

   const emptyNote = function(that) {
      $(that).remove();
   };

   const createNote = function(section) {
      return new Promise((resolve) => {
         const content = {
            articleId: $(".ui.modal").attr("data-curid"),
            content: section.find("textarea").val()
         };

         $.post("/api/notes", content).then((response) => {
            console.log(response); // new notes 
            resolve(response);
         });
      })
   };

   const createEntry = function(data) {
      const firstRef = $("#note_container").children().eq(0);
      firstRef.before(
         $(`<section class="ui segment __note form" data-id="${data._id}">
            <div class="ui grid">
               <div class="ui twelve wide computer column">
                  ${data.content}
               </div>
               <span class="ui four wide computer right aligned column __delete">
                  <i class="trash outline large icon"></i>
               </span>
            </div>
         </section>`)
      );
   };

   const delArticle = function(articleId) {
      return new Promise((resolve) => {
         $.ajax({
            url: `/api/saved/delete?articleid=${articleId}`,
            method: "DELETE",
         }).then((res) => {
            console.log(res);
            resolve(res);
         });
      });
   };

   renderCategory();

   $("article .card").on("click", function() {
      modalContent($(this).closest(".card"), articleNotes)
         .then((modalBody) => {
            console.log(modalBody.attr("data-curid"));

            modalBody
               .modal('setting', 'transition', "fade up")
               .modal("show");
         });
   });

   $("#add").on("click", function() {
      newNote($(this));
   });

   $(".ui.modal")
      .on("click", "#del", function() {
         const modalBody = $(".ui.modal"),
            articleId = modalBody.attr("data-curid");

         console.log(articleId);
         delArticle(articleId).then((res) => {
            $(`[data-curid="${articleId}"]`).remove();
            modalBody.modal("hide");
         });
      })
      .on("click", ".__delete", function() {
         deleteNote($(this).closest("section.__note"))
            .then((resolve) => {
               resolve.that.remove();
               console.log(resolve.id);

               articleNotes[$(".ui.modal").attr("data-curid")].forEach((elem, index, array) => {
                  if (elem._id === resolve.id) {
                     array.splice(index, 1);
                  }
               });
            });
      })
      .on("click", ".__discard", function() {
         $(this).closest("section.__note").remove();
      })
      .on("click", ".__create", function() {
         createNote($(this).closest("section"))
            .then((data) => {
               $(this).closest("section.__note").remove();
               createEntry(data);
               // console.log(data.content);

               articleNotes[$(".ui.modal").attr("data-curid")].push(data);
               console.log($(".ui.modal").data("curid"));
               console.log($(".ui.modal").attr("data-curid"));
            });
      });

   $(".dropdown")
   	.dropdown()
   	.on("click", ".item", function() {
   		const selCat = $(this).attr("data-category");
			console.log("This is Sel", selCat);   		
   		if (selCat === "default") {
   			const cards = $("article.__trigger");
   			cards.removeClass("hidden");
   			return;
   		}

   		$("article.__trigger").each((i, elem) => {
   			const target = $(elem);

   			if (target.attr("data-category") !== selCat && !target.hasClass("hidden")) {
   				console.log(target.attr("data-category"));
   				target.transition("fade");
   			} else if (target.attr("data-category") === selCat) {
   				target.hasClass("hidden") && target.transition("fade");
   			}
   		});
   	});
};