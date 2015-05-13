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
  var slide =  DCslides.model.getSlide(index);
  DCslides.model.slide = index;
};
