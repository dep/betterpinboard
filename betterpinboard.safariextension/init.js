$(document).ready(function() {
  if (window.location.href.match("pinboard.in")) {
    safari.self.tab.dispatchMessage("init", "rename")
    safari.self.tab.dispatchMessage("init", "keyboard")
    safari.self.tab.dispatchMessage("init", "pretty")
  }
});

function answer(msg) {
  if (msg.message == "rename") {
    init_rename();
  } else if (msg.message == "keyboard") {
    init_keyboard();
  } else if (msg.message == "pretty") {
    $("body").addClass("prettify");
  }
}

safari.self.addEventListener("message", answer, false);
