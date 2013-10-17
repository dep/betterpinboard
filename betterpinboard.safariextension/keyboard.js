var key_active = "";
var active_bookmark = "";
var first_bookmark = "";
var last_bookmark = "";

function init_keyboard() {
  active_class = "selected_bookmark"
  $(".bookmark").parent().addClass("bookmark_parent");
  refresh_bookmarks();
  first_bookmark.addClass(active_class);

  $(".bookmark_parent").click(function() {
    $(".bookmark_parent").removeClass(active_class);
    $(this).addClass(active_class);
  });

  $("body").live("keypress", function(event) {
    code = event.keyCode;
    active_bookmark = $(".selected_bookmark");
    prev_bookmark = active_bookmark.prevAll("div.bookmark_parent").filter(':visible:first');
    next_bookmark = active_bookmark.nextAll("div.bookmark_parent").filter(':visible:first');

    if (document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA") {
      /* n or ] */
      if (code == "110" || code == "93") {
        if (active_bookmark.length > 0) {
          if (next_bookmark.find(".bookmark").length > 0) {
            next_bookmark.addClass(active_class);
            active_bookmark.removeClass(active_class);
          } else {
            first_bookmark.addClass(active_class);
            active_bookmark.removeClass(active_class);
          }
        } else {
          first_bookmark.addClass(active_class);
        }
        scroll_to($(".selected_bookmark").first());
      /* p or [ */
      } else if (code == "112" || code == "91") {
        if (active_bookmark.length > 0) {
          if (prev_bookmark.find(".bookmark").length > 0) {
            prev_bookmark.addClass(active_class);
            active_bookmark.removeClass(active_class);
          } else {
            last_bookmark.addClass(active_class);
            active_bookmark.removeClass(active_class);
          }
        } else {
          first_bookmark.addClass(active_class);
        }
        scroll_to($(".selected_bookmark").first());
      /* h - hide clutter */
      } else if (code == "104") {
        if ($("body").hasClass("minified")) {
          $("body").removeClass("minified");
          scroll_to(active_bookmark);
        } else {
          $("body").addClass("minified");
          scroll_to(active_bookmark);
        }
      /* s */
      } else if (code == "115") {
        active_bookmark.find(".star span").trigger("click");
      /* # */
      } else if (code == "35" && event.shiftKey == true) {
        active_bookmark.slideUp();
        active_bookmark.find(".confirm a").trigger("click");
        /* Pinboard hides the node, but we're going to delete it
         * so as not to screw up our back/forth navigation */
        setTimeout("finish_delete()", 250);
      /* x */
      } else if (code == "120") {
        active_bookmark.find(".mark_read").trigger("click");
      /* add note */
      } else if (code == "78" && event.shiftKey == true) {
        if ($("#top_menu").length > 0) {
          $("#top_menu a").each(function() {
            if ($(this).html() == "add note") {
              window.location.href = $(this).attr("href");
            }
          });
        } else {
          window.location.href = "http://pinboard.in/note/add";
        }
      /* add url */
      } else if (code == "43" && event.shiftKey == true) {
        $("#top_menu a").each(function() {
          if ($(this).html() == "add url") {
            window.location.href = $(this).attr("href");
          }
        });
      /* esc */
      } else if (code == "27") {
      }
    }
  });

  $("body").live("keyup", function(event) {
    code = event.keyCode;
    console.log(code);

    if (document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA") {
      /* go to */
      if (code == "71") {
        key_active = code;
      /* go to all */
      } else if (code == "65") {
        window.location.href = "http://pinboard.in/";
      /* Go to starred items */
      } else if (code == "56") {
        $(".user_navbar a").each(function() {
          if ($(this).html() == "starred" && key_active) {
            window.location.href = $(this).attr("href");
          }
        });
      /* Go to private items */
      } else if (code == "80") {
        $(".user_navbar a").each(function() {
          if ($(this).html() == "private" && key_active) {
            window.location.href = $(this).attr("href");
          }
        });
      /* Go to Notes */
      } else if (code == "87" && key_active) {
        var user_id = get_user_id();
        window.location.href = "http://pinboard.in/u:" + user_id + "/from:notes";
      /* Tag Leap */
      } else if (code == "76" && key_active) {
        $("#bookmarks").append("<div class='special_modal' id='leap'><input type='text' placeholder='tag1,tag2,tag3'></div>");
        $("#leap input").focus();
        $("#nextprev, #bulk_edit_options").remove();
        $("#leap input").keyup(function(event) {
          event.preventDefault();
          if (event.keyCode == 13) {
            var user_id = get_user_id();
            var tag_array = $(this).val().split(",");
            var final_url = "";
            for (var x = 0; x < tag_array.length; x++) {
              final_url = final_url + "/t:" + tag_array[x];
            }
            window.location.href = "http://pinboard.in/u:" + user_id + final_url;
          } else if (event.keyCode == 27) {
            $("#leap").remove();
          }
        });
      } else {
        key_active = null;
      }

      /* Enter/shift-enter */
      if (code == "13" || (code == "13" && event.shiftKey == true)) {
        if (active_bookmark.hasClass("editing")) {
          active_bookmark.removeClass("editing");
        } else {
          url = active_bookmark.find(".bookmark_title").attr("href");

          if(url) {
            /* shift-enter */
            if (event.shiftKey == true) {
              safari.self.tab.dispatchMessage("pin_url",url)
            /* enter */
            } else {
              window.location.href = url;
            }
          }
        }
      /* v */
      } else if (code == "86") {
        url = active_bookmark.find(".cached").attr("href");

        if(url) {
          /* shift-enter */
          if (event.shiftKey == true) {
            safari.self.tab.dispatchMessage("pin_url","http://pinboard.in" + url)
          /* enter */
          } else {
            window.location.href = url;
          }
        }
      /* e */
      } else if (code == "69") {
        if (active_bookmark.length > 0) {
          active_bookmark.find(".edit").trigger("click");
          active_bookmark.addClass("editing");
          active_bookmark.find(".url").focus();
        } else if ($(".note_last_updated").length > 0) {
          /* we must be on the notes page */
          window.location.href = "http://notes.pinboard.in" + $(".note_last_updated a").attr("href");
        }
      /* t */
      } else if (code == "84") {
        active_bookmark.find(".edit").trigger("click");
        active_bookmark.addClass("editing");
        active_bookmark.find(".tags").focus();
      /* Bookmark Type-ahead */
      } else if (code == "220") {
        $("#bookmarks").append("<div class='special_modal' id='type_ahead'><input type='text' placeholder='Show bookmarks matching this string'></div>");
        var modal = $("#type_ahead");
        var modal_input = modal.find("input");
        if (event.shiftKey == true) {
          modal.addClass("exclude");
          modal_input.attr("placeholder", "Hide bookmarks matching this string");
        }
        $("#nextprev, #bulk_edit_options").remove();
        modal_input.focus();
        modal_input.keyup(function(event) {
          event.preventDefault();
          if (event.keyCode == 27 || event.keyCode == 13) {
            modal.remove();
            active_bookmark.removeClass(active_class);
            first_bookmark = $("body").find("div.bookmark_parent").filter(':visible:first');
            last_bookmark = $("body").find("div.bookmark_parent").filter(':visible:last');
            active_bookmark = $("body").find("div.bookmark_parent").filter(':visible:first');
            active_bookmark.addClass(active_class);
            scroll_to(active_bookmark);
          } else {
            $("#bookmarks .bookmark_title").each(function() {
              self = $(this);
              if (modal_input.val().length > 0) {
                  if (self.html().toLowerCase().match(modal_input.val().toLowerCase())) {
                    if (modal.hasClass("exclude")) {
                      self.parents(".bookmark_parent").hide();
                    } else {
                      self.parents(".bookmark_parent").show();
                    }
                  } else {
                    if (modal.hasClass("exclude")) {
                      self.parents(".bookmark_parent").show();
                    } else {
                      self.parents(".bookmark_parent").hide();
                    }
                  }
              } else {
                self.parents(".bookmark_parent").show();
              }
            });
            scroll_to($("body").find("div.bookmark_parent").filter(':visible:first'));
          }
        });
      /* c */
      } else if (code == "67") {
        if (active_bookmark.find(".copy_bookmark").length > 0) {
          active_bookmark.find(".copy_bookmark").remove();
        } else {
          url = active_bookmark.find(".bookmark_title").attr("href");
          if(url) {
            active_bookmark.find(".bookmark").append("<div class='copy_bookmark'><input disabled='disabled' type='text'></div>");
            $(".copy_bookmark input").val(url);
            $(".copy_bookmark input").select();
            $(".copy_bookmark").show();
          }
        }
      }
    } else {
      if (code == "13" && document.activeElement.tagName == "INPUT") {
        $("input.submit").trigger("click");
        $(".bookmark_parent").removeClass("editing");
      } else if (code == 27) {
        $(".bookmark_parent").removeClass("editing");
      }
    }
  });

  $("#overlay_shortcuts table").after("<div id='advanced_shortcuts' class='general'><strong>Pinboard.in Better Shortcuts:</strong><br><br><strong>Navigation</strong><br>n or ] = next bookmark/note<br>p or [ = previous bookmark/note<br>+ = add new URL<br>shift-n = add a new note<br>g then * = go to starred<br>g then p = go to private<br>g then l = leap to a new tag (comma separated)<br>g then w = go to written notes<br><br><strong>Selected Bookmark/Note</strong><br>e = edit<br>t = edit tags<br>s = toggle star<br># = delete<br>x = mark as read (done)<br>[enter] or o = open selected<br>[shift-enter] = open selected in a new tab<br>v = open cached version<br>shift-v = open cached version in new tab<br>c (then cmd-c) = copy selected bookmark/note url<br><br><strong>Others</strong><br>h = toggle hiding of clutter (minify view)<br>\\ = enter 'type-ahead' mode<br>shift-\\ = enter 'filter out' mode");
}

function finish_delete() {
  $(".selected_bookmark").each(function() {
    $(this).replaceWith($('<span style="display:none">' + $(this).html() + '</span>'))
    if(prev_bookmark.length < 1) {
      $("body").find("div.bookmark_parent").first().addClass("selected_bookmark");
    } else {
      prev_bookmark.addClass("selected_bookmark");
    }
    refresh_bookmarks();
  });
}
function scroll_to(bookmark) {
  if (bookmark.length > 0) {
    $('html, body').animate({scrollTop: bookmark.offset().top-150}, 100);
  }
}
function refresh_bookmarks() {
  first_bookmark = $("body").find("div.bookmark_parent").first();
  last_bookmark = $("body").find("div.bookmark_parent").last();
}

function get_user_id() {
  return window.location.pathname.split("u:")[1].split("/")[0];
}
