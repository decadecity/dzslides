/*global markdown:false, $$:false */

/*{{{{ dzslides core
#
#
#     __  __  __       .  __   ___  __
#    |  \  / /__` |    | |  \ |__  /__`
#    |__/ /_ .__/ |___ | |__/ |___ .__/ core :€
#
#
# The following block of code is not supposed to be edited.
# But if you want to change the behavior of these slides,
# feel free to hack it!
#
*/

var Dz = {
  remoteWindows: [],
  idx: -1, // Global state. Current slide
  step: 0, // Global state. Current fragment
  html: null,
  slides: null,
  progressBar : null,
  params: {
    autoplay: "1"
  }
};

Dz.init = function() {
  $('body').addClass('loaded');
  this.slides = $('.slides > section');
  this.progressBar = $('#progress-bar');
  this.html = $('html')[0];
  this.setupParams();
  this.onhashchange();
  this.onresize();
  this.setupView();
  if (typeof this.sortAllFragments === 'function') {
    this.sortAllFragments();
  }
};

Dz.setupParams = function() {
  var p = window.location.search.substr(1).split('&');
  p.forEach(function(e, i, a) {
    var keyVal = e.split('=');
    Dz.params[keyVal[0]] = decodeURIComponent(keyVal[1]);
  });
// Specific params handling
  if ((+this.params.autoplay) === 'false') { //????
    $$.forEach($$("video"), function(v){
      v.controls = true;
    });
  }
};

Dz.onkeydown = function(aEvent) {
  // Don't intercept keyboard shortcuts
  if (aEvent.altKey
    || aEvent.ctrlKey
    || aEvent.metaKey
    || aEvent.shiftKey) {
    return;
  }
  if ( aEvent.keyCode === 37 // left arrow
    || aEvent.keyCode === 38 // up arrow
    || aEvent.keyCode === 33 // page up
  ) {
    aEvent.preventDefault();
    this.back();
  }
  if ( aEvent.keyCode === 39 // right arrow
    || aEvent.keyCode === 40 // down arrow
    || aEvent.keyCode === 34 // page down
  ) {
    aEvent.preventDefault();
    this.forward();
  }
  if (aEvent.keyCode === 35) { // end
    aEvent.preventDefault();
    this.goEnd();
  }
  if (aEvent.keyCode === 36) { // home
    aEvent.preventDefault();
    this.goStart();
  }
  if (aEvent.keyCode === 32) { // space
    aEvent.preventDefault();
    this.toggleContent();
  }
  if (aEvent.keyCode === 70) { // f
    aEvent.preventDefault();
    this.goFullscreen();
  }
  if (aEvent.keyCode === 79) { // o
    aEvent.preventDefault();
    this.toggleView();
  }
};

Dz.setupView = function() {
  document.body.addEventListener("click", function ( e ) {
    if (!Dz.html.classList.contains("view")) {
      return;
    }
    if (!e.target || e.target.nodeName !== "SECTION") {
      return;
    }

    Dz.html.classList.remove("view");
    Dz.setCursor(Dz.slides.indexOf(e.target) + 1);
  }, false);
};

/* Adapt the size of the slides to the window */

Dz.onresize = function() {
  var container = $('#container');
  var sx = container.width() / window.innerWidth;
  var sy = container.height() / window.innerHeight;
  var transform = 'scale(' + (1/Math.max(sx, sy)) + ')';

  $('.scaled').each(function() {
    var el = $(this)[0];
    el.style.MozTransform = transform;
    el.style.WebkitTransform = transform;
    el.style.OTransform = transform;
    el.style.msTransform = transform;
    el.style.transform = transform;
  });
};

Dz.getCurrentSlide = function() {
  return $('.slides > section[aria-selected]');
};

Dz.getNotes = function(aIdx) {
  var slides = $('.slides > section:nth-of-type(' + aIdx + ')');
  var notes = slides.find('.notes');
  return notes.length ? notes.html() : '';
};

Dz.onmessage = function(aEvent) {
  var argv = aEvent.data.split(" "),
      argc = argv.length;

  argv.forEach(function(e, i, a) {
    a[i] = decodeURIComponent(e);
  });

  var win = aEvent.source;
  if (argv[0] === "REGISTER" && argc === 1) {
    this.remoteWindows.push(win);
    this.postMsg(win, "REGISTERED", document.title, this.slides.length);
    this.postMsg(win, "CURSOR", this.idx + "." + this.step); // Global state.
    return;
  }
  if (argv[0] === "BACK" && argc === 1) {
    this.back();
  }
  if (argv[0] === "FORWARD" && argc === 1) {
    this.forward();
  }
  if (argv[0] === "START" && argc === 1) {
    this.goStart();
  }
  if (argv[0] === "END" && argc === 1) {
    this.goEnd();
  }
  if (argv[0] === "TOGGLE_CONTENT" && argc === 1) {
    this.toggleContent();
  }
  if (argv[0] === "SET_CURSOR" && argc === 2) {
    window.location.hash = "#" + argv[1];
  }
  if (argv[0] === "GET_CURSOR" && argc === 1) {
    this.postMsg(win, "CURSOR", this.idx + "." + this.step); // Global state.
  }
  if (argv[0] === "GET_NOTES" && argc === 1) {
    this.postMsg(win, "NOTES", this.getNotes(this.idx)); // Global state.
  }
};

Dz.toggleContent = function() {
  // If a Video is present in this new slide, play it.
  // If a Video is present in the previous slide, stop it.
  var slide = Dz.getCurrentSlide();
  if (slide.length) {
    var video = slide.find("video");
    // Don't know if this works
    if (video.length) {
      if (video.ended || video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  }
};

Dz.setCursor = function(aIdx, aStep) {
  // If the user change the slide number in the URL bar, jump
  // to this slide.
  aStep = (aStep !== 0 && typeof aStep !== "undefined") ? "." + aStep : ".0";
  window.location.hash = "#" + aIdx + aStep;
};

Dz.onhashchange = function() {
  var cursor = window.location.hash.split("#"),
      newidx = 1,
      newstep = 0;
  if (cursor.length === 2) {
    newidx = parseInt(cursor[1].split(".")[0], 10);
    newstep = parseInt(cursor[1].split(".")[1], 10);
    var fragments = $(Dz.slides[newidx - 1]).data('dc-fragments');
    if (newstep > fragments) {
      newstep = 0;
      newidx++;
    }
  }
  this.setProgress(newidx, newstep);
  if (newidx !== this.idx) { // Global state.
    this.setSlide(newidx);
  }
  if (newstep !== this.step) { // Global state.
    this.setIncremental(newstep);
  }
  for (var i = 0; i < this.remoteWindows.length; i++) {
    this.postMsg(this.remoteWindows[i], "CURSOR", this.idx + "." + this.step);
  }
};

Dz.back = function() {
  if (this.idx === 1 && this.step === 0) { // Global state.
    return;
  }
  if (this.step === 0) { // Global state.
    this.setCursor(this.idx - 1, $(this.slides[this.idx - 2]).data('dc-fragments'));
  } else {
    this.setCursor(this.idx, this.step - 1); // Global state.
  }
};

Dz.forward = function() {
   // Global state.
  if (this.idx >= this.slides.length &&
      this.step >= $(this.slides[this.idx - 1]).data('dc-fragments')) {
      return;
  }
   // Global state.
  if (this.step >= $(this.slides[this.idx - 1]).data('dc-fragments')) {
    this.setCursor(this.idx + 1, 0); // Global state.
  } else {
    this.setCursor(this.idx, this.step + 1); // Global state.
  }
};

Dz.goStart = function() {
  this.setCursor(1, 0);
};

Dz.goEnd = function() {
  var lastIdx = this.slides.length;
  var lastStep = $(this.slides[this.idx - 1]).data('dc-fragments');
  this.setCursor(lastIdx, lastStep);
};

Dz.toggleView = function() {
  this.html.classList.toggle("view");

  if (this.html.classList.contains("view")) {
    $("section[aria-selected]")[0].scrollIntoView(true);
  }
};

Dz.setSlide = function(aIdx) {
  this.idx = aIdx; // Global state.
  var old = $("section[aria-selected]");
  var next = $("section:nth-of-type("+ this.idx +")");
  var video;
  if (old.length) {
    old.removeAttr('aria-selected');
    video = old.find("video");
    if (video.length) {
      video[0].pause();
    }
  }
  if (next.length) {
    next.attr("aria-selected", "true");
    if (this.html.classList.contains("view")) {
      next.scrollIntoView();
    }
    video = next.find("video");
    if (video.length && +this.params.autoplay) {
      video[0].play();
    }
  } else {
    // That should not happen
    this.idx = -1; // Global state.
    // console.warn("Slide doesn't exist.");
  }
  Dz.sendEvent('SLIDE_CHANGE');
};

/**
 * Navigates through fragments within a slide.
 *
 * @param aStep {int} Fragment index to navigate to.
 */
Dz.setIncremental = function(aStep) {
  // Here be off by one errors.
  this.step = aStep; // Global state.
  Dz.navigateFragment(aStep - 1);
};

Dz.goFullscreen = function() {
  var html = this.html[0],  // Global state.
      requestFullscreen = html.requestFullscreen || html.requestFullScreen || html.mozRequestFullScreen || html.webkitRequestFullScreen;
  if (requestFullscreen) {
    requestFullscreen.apply(html);
  }
};

Dz.setProgress = function(aIdx, aStep) {
  var slide = $("section:nth-of-type("+ aIdx +")");
  if (!slide.length) {
    return;
  }
  var steps = slide.data('dc-fragments'),
      slideSize = 100 / (this.slides.length - 1),
      stepSize = slideSize / steps;
  this.progressBar.css({'width': ((aIdx - 1) * slideSize + aStep * stepSize) + '%'});
};

Dz.postMsg = function(win, message) { // [arg0, [arg1...]]
  message = [message];
  for (var i = 2; i < arguments.length; i++) {
    message.push(encodeURIComponent(arguments[i]));
  }
  win.postMessage(message.join(" "), "*");
};

/**
 * Sends an event to `document` which allows other areas
 * to bind in order to register functionality.
 *
 * @param type {string} Type of event.
 * @param data {mixed} Data to be bound to the event.
 */
Dz.sendEvent = function(type, data) {
  // This isn't using new CustomEvent('keydown') due to a webkit bug in phantom.
  // https://github.com/ariya/phantomjs/issues/11289
  data = {
    'detail': data
  };
  if (window.CustomEvent) {
    document.dispatchEvent(new window.CustomEvent(type, data));
  } else {
    var evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
    evt.initCustomEvent(type, false, false, data);
    document.dispatchEvent(evt);
  }
};

/**
 * Converts all items within the target with a `data-markdown` flag
 * from md to HTML.
 *
 * @param target {jQuery element list} Area within which to search.
 */
Dz.convertMarkdown = function(target) {
  if (typeof markdown === 'undefined' || typeof markdown.toHTML !== 'function') {
    return;
  }
  target.find('[data-markdown]').each(function() {
    var content = markdown.toHTML($(this).html());
    $(this).html(content);
    $(this).removeAttr('data-markdown');
  });
};

function init() {
  Dz.convertMarkdown($(document));
  Dz.init();
  window.onkeydown = Dz.onkeydown.bind(Dz);
  window.onresize = Dz.onresize.bind(Dz);
  window.onhashchange = Dz.onhashchange.bind(Dz);
  window.onmessage = Dz.onmessage.bind(Dz);
}

$(window).on('load', init);
