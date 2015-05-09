var Dz = {
  views: {},
  notes: null,
  url: null,
  idx: 1
};

Dz.init = function() {
  this.startClock();
  this.loadIframes();
}

Dz.onkeydown = function(aEvent) {
  // Don't intercept keyboard shortcuts
  if (aEvent.altKey
    || aEvent.ctrlKey
    || aEvent.metaKey
    || aEvent.shiftKey) {
    return;
  }
  if ( aEvent.keyCode == 37 // left arrow
    || aEvent.keyCode == 38 // up arrow
    || aEvent.keyCode == 33 // page up
  ) {
    aEvent.preventDefault();
    this.back();
  }
  if ( aEvent.keyCode == 39 // right arrow
    || aEvent.keyCode == 40 // down arrow
    || aEvent.keyCode == 34 // page down
  ) {
    aEvent.preventDefault();
    this.forward();
  }
  if (aEvent.keyCode == 35) { // end
    aEvent.preventDefault();
    this.goEnd();
  }
  if (aEvent.keyCode == 36) { // home
    aEvent.preventDefault();
    this.goStart();
  }
  if (aEvent.keyCode == 32) { // space
    aEvent.preventDefault();
    this.toggleContent();
  }
}

Dz.onmessage = function(aEvent) {
  var argv = aEvent.data.split(" "), argc = argv.length;
  argv.forEach(function(e, i, a) { a[i] = decodeURIComponent(e) });
  if (argv[0] === "CURSOR" && argc === 2) {
    if (aEvent.source === this.views.present) {
      var cursor = argv[1].split(".");
      this.postMsg(this.views.present, "GET_NOTES");
      this.idx = ~~cursor[0];
      this.step = ~~cursor[1];
      $("#slideidx").innerHTML = argv[1];
      this.postMsg(this.views.future, "SET_CURSOR", this.idx + "." + (this.step + 1));
      if (this.views.remote)
        this.postMsg(this.views.remote, "SET_CURSOR", argv[1]);
    } else {
      $("#nextslideidx").innerHTML = +argv[1] < 0 ? "END" : argv[1];
    }
  }
  if (aEvent.source === this.views.present) {
    if (argv[0] === "NOTES" && argc === 2)
      $("#notes > #content").innerHTML = this.notes = argv[1];
    if (argv[0] === "REGISTERED" && argc === 3)
      $("#slidecount").innerHTML = argv[2];
  }
}

/* Get url from hash or prompt and store it */

Dz.getUrl = function() {
  var u = window.location.hash.split("#")[1];
  if (!u) {
    u = window.prompt("What is the URL of the slides?");
    if (u) {
      window.location.hash = u.split("#")[0];
      return u;
    }
    u = "<style>body{background-color:white;color:black}</style>";
    u += "<strong>ERROR:</strong> No URL specified.<br>";
    u += "Try<em>: " + document.location + "#yourslides.html</em>";
    u = "data:text/html," + encodeURIComponent(u);
  }
  return u;
}

Dz.loadIframes = function() {
  var present = $("#present iframe");
  var future = $("#future iframe");
  this.url = this.getUrl();
  present.src = future.src = this.url + '?autoplay=0';
  present.onload = future.onload = function() {
    var id = this.parentNode.id;
    Dz.views[id] = this.contentWindow;
    if (Dz.views.present && Dz.views.future) {
      Dz.postMsg(Dz.views.present, "REGISTER");
      Dz.postMsg(Dz.views.future, "REGISTER");
    }
  }
}

Dz.toggleContent = function() {
  if (this.views.remote)
    this.postMsg(this.views.remote, "TOGGLE_CONTENT");
}

Dz.onhashchange = function() {
  this.loadIframe();
}

Dz.back = function() {
  this.postMsg(this.views.present, "BACK");
}

Dz.forward = function() {
  this.postMsg(this.views.present, "FORWARD");
}

Dz.goStart = function() {
  this.postMsg(this.views.present, "START");
}

Dz.goEnd = function() {
  this.postMsg(this.views.present, "END");
}

Dz.setCursor = function(aCursor) {
  this.postMsg(this.views.present, "SET_CURSOR", aCursor);
}

Dz.popup = function() {
  this.views.remote = window.open(this.url + "#" + this.idx, 'slides', 'width=800,height=600,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
}

Dz.postMsg = function(aWin, aMsg) { // [arg0, [arg1...]]
  aMsg = [aMsg];
  for (var i = 2; i < arguments.length; i++)
    aMsg.push(encodeURIComponent(arguments[i]));
  aWin.postMessage(aMsg.join(" "), "*");
}

Dz.startClock = function() {
  var addZero = function(num) {
    return num < 10 ? '0' + num : num;
  }
  setInterval(function() {
    var now = new Date();
    $("#hours").innerHTML = addZero(now.getHours());
    $("#minutes").innerHTML = addZero(now.getMinutes());
    $("#seconds").innerHTML = addZero(now.getSeconds());
  }, 1000);
}

function init() {
  Dz.init();
  window.onkeydown = Dz.onkeydown.bind(Dz);
  window.onhashchange = Dz.loadIframes.bind(Dz);
  window.onmessage = Dz.onmessage.bind(Dz);
}

window.onload = init;
