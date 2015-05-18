window.DCslides = window.DCslides || {};

window.DCslides.messaging = {
  messages: [],
  broadcasts: [],

  message: function(message) {
    this.messages.push(message);
  },

  broadcast: function(message) {
    this.broadcasts.push(message);
  },

  _clear: function() {
    this.messages = [];
  }
};
