var React = require('react');
var RdioStore = require('../stores/RdioStore');
var ServerActionCreator = require('../actions/ServerActionCreator');

function getStateFromStores() {
  return {
    currentUser: RdioStore.currentUser()
  }
}

var Content = React.createClass({
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
          disabled={!!this.state.currentUser}
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
  }
});

module.exports = Content;
