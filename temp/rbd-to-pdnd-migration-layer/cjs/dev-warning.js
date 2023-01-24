"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormattedMessage = exports.error = void 0;
exports.log = log;
exports.warning = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

// This file has been copied from `react-beautiful-dnd`
// <https://github.com/atlassian/react-beautiful-dnd/blob/v13.1.1/src/dev-warning.js>
var isProduction = process.env.NODE_ENV === 'production'; // not replacing newlines (which \s does)

var spacesAndTabs = /[ \t]{2,}/g;
var lineStartWithSpaces = /^[ \t]*/gm; // using .trim() to clear the any newlines before the first text and after last text

var clean = function clean(value) {
  return value.replace(spacesAndTabs, ' ').replace(lineStartWithSpaces, '').trim();
};

var getDevMessage = function getDevMessage(message) {
  return clean("\n  %creact-beautiful-dnd\n\n  %c".concat(clean(message), "\n\n  %c\uD83D\uDC77\u200D This is a development only message. It will be removed in production builds.\n"));
};

var getFormattedMessage = function getFormattedMessage(message) {
  return [getDevMessage(message), // title (green400)
  'color: #00C584; font-size: 1.2em; font-weight: bold;', // message
  'line-height: 1.5', // footer (purple300)
  'color: #723874;'];
};

exports.getFormattedMessage = getFormattedMessage;
var isDisabledFlag = '__react-beautiful-dnd-disable-dev-warnings';

function log(type, message) {
  var _console;

  // no warnings in production
  if (isProduction) {
    return;
  } // manual opt out of warnings
  // @ts-expect-error


  if (typeof window !== 'undefined' && window[isDisabledFlag]) {
    return;
  } // eslint-disable-next-line no-console


  (_console = console)[type].apply(_console, (0, _toConsumableArray2.default)(getFormattedMessage(message)));
}

var warning = log.bind(null, 'warn');
exports.warning = warning;
var error = log.bind(null, 'error');
exports.error = error;