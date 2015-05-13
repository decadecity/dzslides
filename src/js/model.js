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

DCslides.model.setSlide = function(index) {
  DCslides.model.getSlide(index);
  DCslides.model.slide = index;
};

DCslides.model.getProgress = function() {
  var current = DCslides.model.slide;
  var max = DCslides.model.slides.length - 1;
  return current / max * 100;
};

DCslides.model.forward = function() {
  var slide_fragments = DCslides.model.getCurrentSlide();
  if (DCslides.model.fragment >= slide_fragments) {
    var new_slide = DCslides.model.slide + 1;
    try {
      DCslides.model.getSlide(new_slide);
      DCslides.model.slide = new_slide;
      DCslides.model.fragment = 0;
      return;
    } catch(e) {
      /* pass */
      return;
    }
  } else {
    DCslides.model.fragment += 1;
  }
};

DCslides.model.setCursor = function(slide, fragment) {
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

};
