var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var ActionTypes = Constants.ActionTypes;

module.exports = {
  loginUser: function(user) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.LOGIN_USER,
      user: user
    });
  }
}
