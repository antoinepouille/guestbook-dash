$(document).ready(function() {
  var headerTitleElement = $("#header h1");
  var entriesElement = $("#guestbook-entries");
  var formElement = $("#guestbook-form");
  var submitElement = $("#guestbook-submit");
  var entryContentElement = $("#guestbook-entry-content");
  var hostAddressElement = $("#guestbook-host-address");
  var usernameElement = $("#username")

  var appendGuestbookEntries = function(data) {
    entriesElement.empty();
    if(data !== null) {
      $.each(data, function(key, val) {
        var str = val.split("|")
        var entry = str[0]
        var svg = str[1]
        entriesElement.append("<p> <img width='25px' src='" + svg + "'> " + entry + "</p>");
      });
    }
  }

  var handleSubmission = function(e) {
    e.preventDefault();
    var name = usernameElement.val() || "Anonymous"
    var entryValue = entryContentElement.val()
    if (entryValue.length > 0) {
      entriesElement.append("<p>...</p>");
      $.getJSON("rpush/guestbook/" + name + "/" + entryValue, appendGuestbookEntries);
	  entryContentElement.val("")
    }
    return false;
  }

  // colors = purple, blue, red, green, yellow
  var colors = ["#549", "#18d", "#d31", "#2a4", "#db1"];
  var randomColor = colors[Math.floor(5 * Math.random())];
  (function setElementsColor(color) {
    headerTitleElement.css("color", color);
    entryContentElement.css("box-shadow", "inset 0 0 0 2px " + color);
    usernameElement.css("box-shadow", "inset 0 0 0 2px " + color);
    submitElement.css("background-color", color);
  })(randomColor);

  submitElement.click(handleSubmission);
  formElement.submit(handleSubmission);
  hostAddressElement.append(document.URL);

  usernameElement.keyup(function(e) {
    var regex = /^[a-zA-Z ]+$/;
    if (regex.test(this.value) !== true)
      this.value = this.value.replace(/[^a-zA-Z ]+/, '');
  });
  entryContentElement.keyup(function(e) {
    var regex = /^[a-zA-Z0-9 ]+$/;
    if (regex.test(this.value) !== true)
      this.value = this.value.replace(/[^a-zA-Z0-9 ]+/, '');
  });

  // Poll every second.
  (function fetchGuestbook() {
    $.getJSON("lrange/guestbook").done(appendGuestbookEntries).always(
      function() {
        setTimeout(fetchGuestbook, 1000);
      });
  })();
});
