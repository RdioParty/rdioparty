var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var ServerActionCreator = require('../actions/ServerActionCreator');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _currentUser;
var _currentRoom;

var RdioStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  currentUser: function() {
    return _currentUser;
  }
});

RdioStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;
  switch(action.type) {
    case ActionTypes.LOGIN_USER:
      _currentUser = action.user;
      window.socket.emit('identify', _currentUser.key);
      RdioStore.emitChange();
      break;
    case ActionTypes.CREATE_ROOM:
      _currentRoom = action.name;
      window.socket.emit('join', _currentRoom);
      RdioStore.emitChange();
      break;
  }
});

module.exports = RdioStore;
