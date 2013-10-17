function init_rename() {
  /* In the site */
  if ($("#top_menu").length > 0) {
    $(".user_navbar a, table label, label[for='pin_edit_toread'], .mark_read").each(function() {
      if ($(this).html() == "read" || $(this).html() == "mark as read") {
        $(this).html("done");
      } else if ($(this).html() == "unread" || $(this).html() == "to read") {
        $(this).html("to do");
      }
    });
  /* Bookmarklet */
  } else if ($("#popup_header").length > 0) {
    $("label").each(function() {
      if ($(this).html() == "read later") {
        $(this).html("to do");
      }
    });
  }
}
