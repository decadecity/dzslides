/* istanbul ignore next */
var DCslides = window.DCslides || {};
DCslides.messaging = DCslides.messaging || {};

DCslides.messaging.event_source = $('<div id="event_source"/>');

DCslides.messaging.sendEvent = function(event) {
  event = '' + event;
  DCslides.messaging.event_source.trigger(event);
};

DCslides.messaging.message = function(message) {

};
