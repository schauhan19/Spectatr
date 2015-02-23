/** @jsx React.DOM */
/* global document, window */
var React = require('react/addons'),
  domready = require('domready');

var Spectatr = React.createClass({
  render: function () {
    return (
      <div className="container">
        <h1> {this.props.title} </h1>
      </div>
    );
  }
});

domready(function () {
  window.React = React;
  React.render(<Spectatr title='Spectatr' />, document.body);
});