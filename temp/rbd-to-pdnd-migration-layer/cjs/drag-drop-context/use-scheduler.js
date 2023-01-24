"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useScheduler = useScheduler;

var _react = require("react");

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

/**
 * Used to schedule callbacks inside of a `setTimeout(fn, 0)`.
 */
function useScheduler() {
  var queueRef = (0, _react.useRef)([]);
  var schedule = (0, _react.useCallback)(function (scheduledFunction) {
    var id = setTimeout(function () {
      // Takes the first item, removing it from the queue
      var item = queueRef.current.shift();
      (0, _tinyInvariant.default)(item, 'There was an item in the queue');
      (0, _tinyInvariant.default)(item.id === id && item.scheduledFunction === scheduledFunction, 'The item is the expected item'); // Call the function and remove it from the queue

      scheduledFunction();
    }, 0);
    queueRef.current.push({
      id: id,
      scheduledFunction: scheduledFunction
    });
  }, []);
  var flush = (0, _react.useCallback)(function () {
    while (queueRef.current.length > 0) {
      var item = queueRef.current.shift();
      (0, _tinyInvariant.default)(item, 'There was an item in the queue');
      clearTimeout(item.id);
      item.scheduledFunction();
    }
  }, []);
  return {
    schedule: schedule,
    flush: flush
  };
}