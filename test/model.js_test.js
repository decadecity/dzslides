/* jshint qunit:true */
/*
  ======== A Handy Little QUnit Reference ========
  http://docs.jquery.com/QUnit

  Test methods:
    expect(numAssertions)
    stop(increment)
    start(decrement)
  Test assertions:
    ok(value, [message])
    equal(actual, expected, [message])
    notEqual(actual, expected, [message])
    deepEqual(actual, expected, [message])
    notDeepEqual(actual, expected, [message])
    strictEqual(actual, expected, [message])
    notStrictEqual(actual, expected, [message])
    raises(block, [expected], [message])
*/

module('Model');

QUnit.test( 'Model exists', function(assert) {
  assert.equal(
    typeof window.DCslides.model,
    'object',
    'Module is an object.'
  );
});

QUnit.test('Has an array of slides', function(assert) {
  assert.ok(
    Array.isArray(window.DCslides.model.slides),
    'Slides is an array.'
  );
});

QUnit.test('Has the current slide index', function(assert) {
  assert.equal(
    typeof window.DCslides.model.slide,
    'number',
    'Current slide is a number.'
  );
});

QUnit.test('Has the current fragment index', function(assert) {
  assert.equal(
    typeof window.DCslides.model.fragment,
    'number',
    'Current fragment is a number.'
  );
});

QUnit.test('Get a slide by index', function(assert) {
  window.DCslides.model.slides = [];
  assert.throws(
    function() { window.DCslides.model.getSlide(0); },
    'Throws an error if no slides.'
  );

  window.DCslides.model.slides = [1, 2, 3];
  assert.throws(
    function() { window.DCslides.model.getSlide(-1); },
    'Throws an error if slide below range.'
  );
  assert.throws(
    function() { window.DCslides.model.getSlide(3); },
    'Throws an error if slide above range.'
  );
  assert.throws(
    function() { window.DCslides.model.getSlide('invalid'); },
    'Throws an error if slide is invalid.'
  );
  assert.strictEqual(
    window.DCslides.model.getSlide(2),
    3,
    'Gets slide by index'
  );

});

QUnit.test('Get the current slide', function(assert) {
  assert.equal(
    typeof window.DCslides.model.getCurrentSlide,
    'function',
    'Method exists.'
  );

  var test_slide = { 'test_slide': true };
  window.DCslides.model.slides = [
    test_slide
  ];
  assert.deepEqual(
    window.DCslides.model.getCurrentSlide(),
    test_slide,
    'Correctly retrieves the current slide.'
  );
});

QUnit.test('Get the terminal slides', function(assert) {
  assert.equal(
    typeof window.DCslides.model.getFirstSlide,
    'function',
    'Method exists.'
  );
  assert.equal(
    typeof window.DCslides.model.getLastSlide,
    'function',
    'Method exists.'
  );

  var first_slide = { 'first_slide': true };
  var last_slide = { 'last_slide': true };
  window.DCslides.model.slides = [
    first_slide,
    last_slide
  ];
  assert.deepEqual(
    window.DCslides.model.getFirstSlide(),
    first_slide,
    'Correctly retrieves the first slide.'
  );
  assert.deepEqual(
    window.DCslides.model.getLastSlide(),
    last_slide,
    'Correctly retrieves the last slide.'
  );
});

QUnit.test('Set the current slide', function(assert) {
  assert.strictEqual(typeof window.DCslides.model.setSlide, 'function', 'Method exists.');

  window.DCslides.model.slide = 0;
  var first_slide = { 'first_slide': true };
  var second_slide = { 'second_slide': true };
  window.DCslides.model.slides = [
    first_slide,
    second_slide
  ];
  window.DCslides.model.setSlide(1);
  assert.deepEqual(
    window.DCslides.model.getCurrentSlide(),
    second_slide,
    'Correctly sets the first slide.'
  );

  assert.throws(
    function() { window.DCslides.model.setSlide('invalid'); },
    'Throws an error if slide is invalid.'
  );
});

QUnit.test('Gets the progresss', function(assert) {
  assert.strictEqual(
    typeof window.DCslides.model.getProgress,
    'function',
    'Method exists.'
  );

  window.DCslides.model.slides = new Array(10);
  window.DCslides.model.slide = 0;
  assert.strictEqual(
    window.DCslides.model.getProgress(),
    0,
    'Calculates progress at start'
  );
  window.DCslides.model.slide = 9;
  assert.strictEqual(
    window.DCslides.model.getProgress(),
    100,
    'Calculates progress at end'
  );
  window.DCslides.model.slide = 3;
  assert.strictEqual(
    window.DCslides.model.getProgress(),
    1/3 * 100,
    'Calculates progress at one third'
  );
});

QUnit.test('Moves forward', function(assert) {
  assert.strictEqual(
    typeof window.DCslides.model.forward,
    'function',
    'Method exists.'
  );

  window.DCslides.model.slide = 0;
  window.DCslides.model.fragment = 0;
  window.DCslides.model.slides = [
    { 'fragments': 0 }
  ];
  window.DCslides.model.forward();
  assert.strictEqual(
    window.DCslides.model.slide,
    0,
    "Doesn't advance slide when there's only one slide."
  );

  window.DCslides.model.slide = 0;
  window.DCslides.model.fragment = 1;
  window.DCslides.model.slides = [
    { 'fragments': 0 },
    { 'fragments': 0 }
  ];
  window.DCslides.model.forward();
  assert.strictEqual(
    window.DCslides.model.slide,
    1,
    'Advances slide'
  );
  assert.strictEqual(
    window.DCslides.model.fragment,
    0,
    'Resets fragment'
  );

  /*window.DCslides.model.forward();
  assert.strictEqual(
    window.DCslides.model.fragment,
    1,
    'Advances fragment'
  );*/
});
