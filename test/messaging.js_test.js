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

module('Messaging');

QUnit.test('Messaging exists', function(assert) {
  assert.equal(
    typeof window.DCslides.messaging,
    'object',
    'Module is an object.'
  );
});

QUnit.test('Triggers an event', function(assert) {
  assert.equal(
    typeof window.DCslides.messaging.sendEvent,
    'function',
    'Method exists'
  );
  assert.equal(
    typeof window.DCslides.messaging.event_source,
    'object',
    'Event source exists'
  );

  var triggered = false;
  window.DCslides.messaging.event_source.on('foo', function() {
    triggered = true;
  });
  window.DCslides.messaging.sendEvent('foo');
  assert.strictEqual(
    triggered,
    true,
    'Triggers an event'
  );
});

QUnit.test('Sends a message', function(assert) {
  assert.equal(
    typeof window.DCslides.messaging.message,
    'function',
    'Method exists'
  );
});

