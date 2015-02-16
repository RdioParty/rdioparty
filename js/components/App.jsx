var React = require('react');
var Content = require('./Content.jsx');

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
