var React = require('react');
var Content = require('./Content.jsx');

window.socket = io();

window.socket.on('joined', function (msg) {
  alert(JSON.stringify(msg));
});

window.socket.on('left', function (msg) {
  alert(JSON.stringify(msg));
});

var App = React.createClass({
  render: function() {
    return (
      <div>
        <Content />
      </div>
    );
  }
});

module.exports = App;
