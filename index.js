'use strict';

var React = require('react');
var CodeMirror;

// adapted from:
// https://github.com/facebook/react/blob/master/docs/_js/live_editor.js#L16

// also used as an example:
// https://github.com/facebook/react/blob/master/src/browser/ui/dom/components/ReactDOMInput.js

var IS_MOBILE = typeof navigator === 'undefined' || (
  navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
);

if (!IS_MOBILE) {
  CodeMirror = require('codemirror');
}

var CodeMirrorEditor = React.createClass({
  getInitialState: function() {
    return { isControlled: this.props.value != null };
  },

  propTypes: {
    value: React.PropTypes.string,
    defaultValue: React.PropTypes.string,
    style: React.PropTypes.object,
    className: React.PropTypes.string,
    onChange: React.PropTypes.func
  },

  componentDidMount: function() {
    var isTextArea = this.props.forceTextArea || IS_MOBILE;
    if (!isTextArea) {
      this._editor =
        CodeMirror.fromTextArea(this.refs.editor.getDOMNode(), this.props);
      this._editor.on('change', this._handleChange);
    }
  },

  componentDidUpdate: function() {
    if (this._editor) {
      if (this.props.value != null) {
        if (this._editor.getValue() !== this.props.value) {
          this._editor.setValue(this.props.value);
        }
      }
    }
  },

  _handleChange: function() {
    if (this._editor) {
      var value = this._editor.getValue();

      if (value !== this.props.value) {
        this.props.onChange && this.props.onChange({target: {value: value}});

        if (this._editor.getValue() !== this.props.value) {
          if (this.state.isControlled) {
            this._editor.setValue(this.props.value);
          } else {
            this.props.value = value;
          }
        }
      }
    }
  },

  render: function() {
    var editor = React.createElement('textarea', {
      ref: 'editor',
      value: this.props.value,
      readOnly: this.props.readOnly,
      defaultValue: this.props.defaultValue,
      onChange: this.props.onChange,
      style: this.props.textAreaStyle,
      className: this.props.textAreaClassName || this.props.textAreaClass
    });

    return React.createElement('div', {
      style: this.props.style,
      className: this.props.className
    }, editor);
  }
});

module.exports = CodeMirrorEditor;
