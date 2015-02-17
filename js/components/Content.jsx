var React = require('react/addons');
var RdioStore = require('../stores/RdioStore');
var ServerActionCreator = require('../actions/ServerActionCreator');
var API = require('../utils/web-api');

function getStateFromStores() {
  return {
    currentUser: RdioStore.currentUser()
  }
}

var Content = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    RdioStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    RdioStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div id='Content'>
        <input
          type='button'
          value='login'
          onClick={this._clickLogin}
          hidden={!!this.state.currentUser}
        />
        <input
          type='text'
          valueLink={this.linkState('roomName')}
          hidden={!!!this.state.currentUser}
        />
        <input
          type='button'
          value='create room'
          onClick={this._clickCreateRoom}
          hidden={!!!this.state.currentUser}
        />
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  },

  _clickLogin: function() {
    R.authenticate(function(authenticated) {
      if (authenticated) {
        ServerActionCreator.loginUser(R.currentUser.attributes);
      }
    });
  },

  _clickCreateRoom: function() {
    API.createRoom(this.state.roomName);
  }
});

module.exports = Content;
