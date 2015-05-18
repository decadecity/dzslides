var DCslides = window.DCslides || {};
DCslides.model = DCslides.model || {};

// List of the slides in the presentation.
DCslides.model.slides = DCslides.model.slides || [];

// The current slide index.
DCslides.model.slide = 0;

// The current fragment index.
DCslides.model.fragment = 0;

DCslides.model.getSlide = function(index) {
  if (!DCslides.model.slides.hasOwnProperty(index)) {
    throw new Error('Index "' + index + '" invalid');
  }
  return DCslides.model.slides[index];
};

DCslides.model.getCurrentSlide = function() {
  return DCslides.model.getSlide(DCslides.model.slide);
};

DCslides.model.getFirstSlide = function() {
  return DCslides.model.getSlide(0);
};

DCslides.model.getLastSlide = function() {
  return DCslides.model.getSlide(DCslides.model.slides.length - 1);
};

DCslides.model.getProgress = function() {
  var current = DCslides.model.slide;
  var max = DCslides.model.slides.length - 1;
  return current / max * 100;
};

DCslides.model.forward = function() {
  var slide_fragments = DCslides.model.getCurrentSlide();
  if (DCslides.model.fragment >= slide_fragments) {
    // No more fragments so next slide.
    var new_slide = DCslides.model.slide + 1;
    try {
      DCslides.model.getSlide(new_slide);
      DCslides.model.slide = new_slide;
      DCslides.model.fragment = 0;
    } catch(e) {
      /* pass */
      return;
    }
  } else {
    DCslides.model.fragment += 1;
  }
  DCslides.model.setCursor();
};

DCslides.model.backward = function() {
  var slide_fragments = DCslides.model.getCurrentSlide();
  if (DCslides.model.fragment > 0) {
    DCslides.model.fragment -= 1;
  } else if (DCslides.model.slide > 0) {
    DCslides.model.slide -= 1;
    DCslides.model.fragment = DCslides.model.getCurrentSlide();
  }

  DCslides.model.setCursor();
};

DCslides.model.getCursor = function() {
  return [DCslides.model.slide, DCslides.model.fragment];
};

DCslides.model.setCursor = function(slide, fragment) {
  var old_cursor = DCslides.model.getCursor();
  if (typeof slide === 'undefined') {
    slide = DCslides.model.slide;
  }
  if (typeof fragment === 'undefined') {
    fragment = DCslides.model.fragment;
  }
  try {
    var slide_fragments = DCslides.model.getSlide(slide);
    DCslides.model.slide = slide;
    if (fragment >= 0 && fragment <= slide_fragments) {
      DCslides.model.fragment = fragment;
    } else {
      DCslides.model.fragment = 0;
    }
  } catch(e) {
    DCslides.model.slide = 0;
    DCslides.model.fragment = 0;
  }
  var new_cursor = DCslides.model.getCursor();
  if (new_cursor[0] !== old_cursor[0] || new_cursor[1] !== old_cursor[1]) {
    // Trigger event.
    DCslides.messaging.message('cursor_change');
  }
};
