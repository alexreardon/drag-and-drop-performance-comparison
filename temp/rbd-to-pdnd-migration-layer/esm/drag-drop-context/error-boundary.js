import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React, { useCallback, useEffect, useRef } from 'react';
import { bind } from 'bind-event-listener';
import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import { cancelDrag } from './cancel-drag';

/**
 * This component holds the actual error boundary logic.
 */
function ErrorBoundaryInner(_ref) {
  var children = _ref.children;
  var isDraggingRef = useRef(false);
  var handleWindowError = useCallback(function () {
    if (isDraggingRef.current) {
      cancelDrag(); // warning(`
      //   An error was caught by our window 'error' event listener while a drag was occurring.
      //   The active drag has been aborted.
      // `);
    } // TODO: handle RBDInvariant
    // const err: Error = event.error;
    // if (err instanceof RbdInvariant) {
    //   // Marking the event as dealt with.
    //   // This will prevent any 'uncaught' error warnings in the console
    //   event.preventDefault();
    //   if (process.env.NODE_ENV !== 'production') {
    //     error(err.message);
    //   }
    // }

  }, []);
  useEffect(function () {
    return combine(monitorForElements({
      onDragStart: function onDragStart() {
        isDraggingRef.current = true;
      },
      onDrop: function onDrop() {
        isDraggingRef.current = false;
      }
    }), bind(window, {
      type: 'error',
      listener: handleWindowError
    }));
  }, [handleWindowError]);
  return children;
}
/**
 * Cancels drags when errors occur.
 */
// We have to use a class component to create an error boundary
// eslint-disable-next-line @repo/internal/react/no-class-components


export var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  _inherits(ErrorBoundary, _React$Component);

  var _super = _createSuper(ErrorBoundary);

  function ErrorBoundary() {
    _classCallCheck(this, ErrorBoundary);

    return _super.apply(this, arguments);
  }

  _createClass(ErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(err) {
      // TODO: handle RBDInvariant
      // if (err instanceof RbdInvariant) {
      //   if (process.env.NODE_ENV !== 'production') {
      //     error(err.message);
      //   }
      //   this.setState({});
      //   return;
      // }
      // throwing error for other error boundaries
      throw err;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(ErrorBoundaryInner, {
        instanceId: this.props.instanceId
      }, this.props.children);
    }
  }]);

  return ErrorBoundary;
}(React.Component);