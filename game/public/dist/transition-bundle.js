(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ComponentLoader Class
 *
 * Instantiates JavaScript Classes when their name is found in the DOM using attribute data-component=""
 *
 */
var ComponentLoader = function () {

	/**
  * Constructor for the ComponentLoader
  * @class
  * @public
  * @param {Object} components - Optional collection of available components: {componentName: classDefinition}
  * @param {Node} context - Optional DOM node to search for components. Defaults to document.
  */
	function ComponentLoader() {
		var components = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, ComponentLoader);

		var defaults = {
			contextEl: document,
			prefix: ''

			// TODO use prefix
		};this.options = _extends({}, defaults, options);

		this.initializedComponents = {};
		this.numberOfInitializedComponents = 0;
		this.components = {};
		this.topics = {};
		this.register(components);
	}

	/**
  * Add component(s) to collection of available components
  * @public
  * @param {Object} components - Collection of components: {componentName: classDefinition}
  */


	_createClass(ComponentLoader, [{
		key: 'register',
		value: function register() {
			var _this = this;

			var components = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			Object.keys(components).forEach(function (componentName) {
				_this.components[componentName] = components[componentName];
			});
		}

		/**
   * Remove component from collection of available components
   * @public
   * @param {String} componentName - Name of the component to remove
   */

	}, {
		key: 'unregister',
		value: function unregister(componentName) {
			delete this.components[componentName];
		}

		/**
   * Mediator functionality.
   * Stores the topic and callback given by the component.
   * for further reference.
   * @param  {String} topic      Topic string
   * @param  {Function} callback Callback function that would be triggered.
   * @param  {Function} context  Class instance which owns the callback
   */

	}, {
		key: 'subscribe',
		value: function subscribe(topic, callback, context) {

			// Is this a new topic?
			if (!this.topics.hasOwnProperty(topic)) {
				this.topics[topic] = [];
			}

			// Store the subscriber callback
			this.topics[topic].push({ context: context, callback: callback });
		}

		/**
   * Mediator functionality.
   * Removes the stored topic and callback given by the component.
   * @param  {String}   topic    Topic string
   * @param  {Function} callback Callback function that would be triggered.
   * @param  {Function} context  Class instance which owns the callback
   * @return {Boolean}           True on success, False otherwise.
   */

	}, {
		key: 'unsubscribe',
		value: function unsubscribe(topic, callback, context) {
			// Do we have this topic?
			if (!this.topics.hasOwnProperty(topic)) {
				return false;
			}

			// Find out where this is and remove it
			for (var i = 0, len = this.topics[topic].length; i < len; i++) {
				if (this.topics[topic][i].callback === callback) {
					if (!context || this.topics[topic][i].context === context) {
						this.topics[topic].splice(i, 1);
						return true;
					}
				}
			}

			return false;
		}

		/**
   * [publish description]
   * @param  {[type]} topic [description]
   * @return {[type]}       [description]
   */

	}, {
		key: 'publish',
		value: function publish(topic) {
			// Check if we have subcribers to this topic
			if (!this.topics.hasOwnProperty(topic)) {
				return false;
			}

			// don't slice on arguments because it prevents optimizations in JavaScript engines (V8 for example)
			// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments
			// https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
			var args = new Array(arguments.length - 1);
			for (var i = 0; i < args.length; ++i) {
				args[i] = arguments[i + 1]; // remove first argument
			}

			// Loop through them and fire the callbacks
			for (var _i = 0, len = this.topics[topic].length; _i < len; _i++) {
				var subscription = this.topics[topic][_i];
				// Call it's callback
				if (subscription && subscription.callback) {
					subscription.callback.apply(subscription.context, args);
				}
			}

			return true;
		}

		/**
   * Scan the DOM, initialize new components and destroy removed components.
   * @public
   * @param {Object} data - Optional data object to pass to the component constructor
   */

	}, {
		key: 'scan',
		value: function scan() {
			var _this2 = this;

			var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var activeComponents = {},
			    elements = this.options.contextEl.querySelectorAll('[data-' + this.options.prefix + 'component]');

			[].forEach.call(elements, function (el) {
				_this2._scanElement(el, activeComponents, data);
			});

			if (this.numberOfInitializedComponents > 0) this.cleanUp_(activeComponents);
		}

		/**
   * Find all components registered on a specific DOM element and initialize them if new
   * @private
   * @param {Element} el - DOM element to scan for components
   * @param {Object} activeComponents - All componentIds currently found in the DOM
   * @param {Object} data - Optional data object to pass to the component constructor
   */

	}, {
		key: '_scanElement',
		value: function _scanElement(el, activeComponents, data) {
			var _this3 = this;

			// check of component(s) for this DOM element already have been initialized
			var elementId = el.getAttribute('data-' + this.options.prefix + 'component-id');

			if (!elementId) {
				// give unique id so we can track it on next scan
				elementId = this._generateUUID();
				el.setAttribute('data-' + this.options.prefix + 'component-id', elementId);
			}

			// find the name of the component instance
			var componentList = el.getAttribute('data-' + this.options.prefix + 'component').match(/\S+/g);
			componentList.forEach(function (componentName) {

				var componentId = componentName + '-' + elementId;
				activeComponents[componentId] = true;

				// check if component not initialized before
				if (!_this3.initializedComponents[componentId]) {
					_this3._initializeComponent(componentName, componentId, el, data);
				}
			});
		}

		/**
   * Call constructor of component and add instance to the collection of initialized components
   * @private
   * @param {String} componentName - Name of the component to initialize. Used to lookup class definition in components collection.
   * @param {String} componentId - Unique component ID (combination of component name and element ID)
   * @param {Element} el - DOM element that is the context of this component
   * @param {Object} data - Optional data object to pass to the component constructor
   */

	}, {
		key: '_initializeComponent',
		value: function _initializeComponent(componentName, componentId, el, data) {
			var component = this.components[componentName];

			if (typeof component !== 'function') {
				window.console && window.console.warn && window.console.warn('ComponentLoader: unknown component \'' + componentName + '\'');
			}

			var instance = new component(el, data, this);

			this.initializedComponents[componentId] = instance;
			this.numberOfInitializedComponents++;
		}

		/**
   * Call destroy() on a component instance and remove it from the collection of initialized components
   * @private
   * @param {String} componentId - Unique component ID used to find component instance
   */

	}, {
		key: '_destroyComponent',
		value: function _destroyComponent(componentId) {
			var instance = this.initializedComponents[componentId];
			if (instance && typeof instance.destroy === 'function') instance.destroy();

			// safe to delete while object keys while loopinghttp://stackoverflow.com/questions/3463048/is-it-safe-to-delete-an-object-property-while-iterating-over-them
			delete this.initializedComponents[componentId];
			this.numberOfInitializedComponents--;
		}

		/**
   * Destroy inaitialized components that no longer are active
   * @private
   * @param {Object} activeComponents - All componentIds currently found in the DOM
   */

	}, {
		key: 'cleanUp_',
		value: function cleanUp_() {
			var _this4 = this;

			var activeComponents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			Object.keys(this.initializedComponents).forEach(function (componentId) {
				if (!activeComponents[componentId]) {
					_this4._destroyComponent(componentId);
				}
			});
		}

		/**
   * Generates a rfc4122 version 4 compliant unique ID
   * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
   * @private
   */

	}, {
		key: '_generateUUID',
		value: function _generateUUID() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0,
				    v = c == 'x' ? r : r & 0x3 | 0x8;
				return v.toString(16);
			});
		}
	}]);

	return ComponentLoader;
}();

exports.default = ComponentLoader;
},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Component Base Class
 * 
 * Sets all arguments passed in to constructor from ComponentLoader
 *
 * Exposes pub/sub methods for triggering events to other components
 *
 */
var Component = function () {
	_createClass(Component, [{
		key: 'defaultData',


		/**
   * Return optional default values for DOM data attributes
   * 
   * @protected
   */
		value: function defaultData() {
			return {
				// camelCased list of data attribute keys and default values
				// myParam: 'myDefaultValue' <- data-my-param="myOverrideValue"
			};
		}

		/**
   * Constructor for the Component
   *
   * Call `super(...arguments);` in the base class constructor
   *
   * @public
   * @param {Node} context - DOM node that contains the component markup
   * @param {Object} data - Optional data object from ComponentLoader.scan()
   * @param {Object} mediator - instance of ComponentLoader for pub/sub
   */

	}]);

	function Component() {
		_classCallCheck(this, Component);

		this.el = arguments[0];
		if (typeof jQuery !== 'undefined') this.$el = jQuery(this.el);
		this.data = arguments[1];
		this.__mediator = arguments[2];

		this._configureData();
	}

	/**
  * Parses the DOM for all data attributes, converts them to camelCase,
  * and applies defaults before storing them in `this.data`
  * 
  * Order of importance of data is as follows:
  * 1. Data passed to constructor using ComponentLoader.scan({})
  * 2. DOM data attributes
  * 3. defaulData() 
     *
  * I.e:
  *  - defaultData() will always be applied if 1) or 2) does not overide the key
  *  - Any data passed to `scan()` will win over DOM attributes or defaultData with same key
  * 
  * @private
  */


	_createClass(Component, [{
		key: '_configureData',
		value: function _configureData() {
			var DOMData = {};
			this.el && this.el.attributes && [].forEach.call(this.el.attributes, function (attr) {
				if (attr && attr.name && /^data-/.test(attr.name)) {
					var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
						return $1.toUpperCase();
					});
					DOMData[camelCaseName] = attr.value;
				}
			});
			// extend defaults
			this.data = (0, _objectAssign2.default)(this.defaultData ? this.defaultData() : {}, DOMData, this.data);
		}

		/**
   * Shorthand for binding multiple functions to `this` in one go
   * @param {...String} functionName Variable number of function names to bind to this context.
   * @protected
   */

	}, {
		key: 'bind',
		value: function bind() {
			for (var i = 0; i < arguments.length; i++) {
				var funcName = arguments[i];
				this[funcName] = this[funcName].bind(this);
			}
		}

		/**
   * Publish an event for other components
   * @protected
   * @param {String} topic - Event name
   * @param {Object} data - Optional params to pass with the event
   */

	}, {
		key: 'publish',
		value: function publish() {
			var _mediator;

			(_mediator = this.__mediator).publish.apply(_mediator, arguments);
		}

		/**
   * Subscribe to an event from another component
   * @protected
   * @param {String} topic - Event name
   * @param {Function} callback - Function to bind
   */

	}, {
		key: 'subscribe',
		value: function subscribe(topic, callback) {
			this.__mediator.subscribe(topic, callback, this);
		}

		/**
   * Unsubscribe from an event from another component
   * @protected
   * @param {String} topic - Event name
   * @param {Function} callback - Function to unbind
   */

	}, {
		key: 'unsubscribe',
		value: function unsubscribe(topic, callback) {
			this.__mediator.unsubscribe(topic, callback, this);
		}

		/**
   * Utility method for triggering the ComponentLoader to scan the markup for new components
   * @protected
   * @param {Object} data - Optional data to pass to the constructor of any Component initialized by this scan
   */

	}, {
		key: 'scan',
		value: function scan(data) {
			this.__mediator.scan(data);
		}

		/**
   * Utility method for defering a function call
   * @protected
   * @param {Function} callback - Function to call
   * @param {Number} ms - Optional ms to delay, defaults to 17ms (just over 1 frame at 60fps)
   */

	}, {
		key: 'defer',
		value: function defer(callback) {
			var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 17;

			setTimeout(callback, ms);
		}

		/**
   * Called by ComponentLoader when component is no longer found in the markup
   * usually happens as a result of replacing the markup using AJAX
   *	
   * Override in subclass and make sure to clean up event handlers etc
   *
   * @protected
   */

	}, {
		key: 'destroy',
		value: function destroy() {}
	}]);

	return Component;
}();

exports.default = Component;
},{"object-assign":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _componentLoader = require('./component-loader.js');

var _componentLoader2 = _interopRequireDefault(_componentLoader);

var _component = require('./component.js');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Component = _component2.default;
exports.default = _componentLoader2.default;
},{"./component-loader.js":1,"./component.js":2}],4:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],5:[function(require,module,exports){
"use strict";

var demo_conversation = {
  conversation: [{
    dialogue_step: 1,
    text: "Hey, could you send me the CVs of all the current employees? The algorithm cannot do anything without the raw data...",
    answer_choice: [{
      text: "How will the algorithm work?",
      response: "The algorithm will analyze a lot of CV samples (the CVs of all the people working at this company!) and try to figure out how a successful employee looks like - in numbers! "
    }, {
      text: "Sure, makes sense.",
      response: "Great! "
    }]
  }, {
    dialogue_step: 2,
    text: "And here’s the cool part: most of the CVs fed to the algorithm are of the people you hired - so the program I wrote will essentially try to replicate your hiring strategy!",
    answer_choice: [{
      text: "The program will think the way I do??",
      response: "Thinking is a strong word, the program is not even close to thinking, it’s just really good at finding patterns in the data I give to it."
    }, {
      text: "Sounds too good to be true.",
      response: "That’s why machine learning is getting so much hype these days!"
    }]
  }, {
    dialogue_step: 3,
    text: "What matters is that the hiring algorithm will hire people just like you would, but at a much faster pace! Your role now is to sit back and supervise the algorithm.",
    answer_choice: [{
      text: "OK"
    }]
  }]
};
module.exports = demo_conversation;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _componentLoaderJs = require("component-loader-js");

var Conversation = _interopRequireWildcard(require("../../assets/demo-conversation-text.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

// publishing custom event to any registered listener
var ChoiceButton =
/*#__PURE__*/
function (_Component) {
  _inherits(ChoiceButton, _Component);

  function ChoiceButton() {
    var _this;

    _classCallCheck(this, ChoiceButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ChoiceButton).apply(this, arguments));
    _this._step = parseInt(_this.el.dataset.step);
    _this._replica = _this.el.closest(".replica");
    _this._textContainer = _this.el.querySelector(".choiceButton");
    _this._onBtnClick = _this._onBtnClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._hideBtn = _this._hideBtn.bind(_assertThisInitialized(_assertThisInitialized(_this)));

    _this.el.addEventListener('click', function (e) {
      return _this._onBtnClick(e);
    });

    _this.subscribe('hide-other-choice', _this._hideBtn);

    return _this;
  }

  _createClass(ChoiceButton, [{
    key: "_onBtnClick",
    // on button click 
    value: function _onBtnClick(e) {
      // add 'chosen' styling to the button
      e.target.classList.add('choiceButton--chosen'); // hide the other choice button

      this.publish('hide-other-choice', this._step); // show next replica

      var choiceButtonResponse = this._getChoiceResponse(this._step, this._textContainer.innerHTML);

      this.publish('reveal-next-replica', {
        choice_response: choiceButtonResponse,
        step: this._step + 1
      });
    } // hide the unchosen button

  }, {
    key: "_hideBtn",
    value: function _hideBtn(conversation_step) {
      if (this._step === conversation_step && !this._textContainer.classList.contains('choiceButton--chosen')) {
        this.el.classList.add('is-inactive');
      }

      ;
    } // get response text to a given choice

  }, {
    key: "_getChoiceResponse",
    value: function _getChoiceResponse(step, text) {
      return Conversation.conversation[step].answer_choice.find(function (choice) {
        return choice.text === text;
      }).response;
    }
  }]);

  return ChoiceButton;
}(_componentLoaderJs.Component);

exports.default = ChoiceButton;

},{"../../assets/demo-conversation-text.js":5,"component-loader-js":3}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _componentLoaderJs = require("component-loader-js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

// publishing custom event to any registered listener
var Replica =
/*#__PURE__*/
function (_Component) {
  _inherits(Replica, _Component);

  function Replica() {
    var _this;

    _classCallCheck(this, Replica);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Replica).apply(this, arguments));
    _this._step = parseInt(_this.el.dataset.step);
    _this._revealReplica = _this._revealReplica.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._textContainer = _this.el.querySelector(".replica__paragraph");

    _this.subscribe('reveal-next-replica', _this._revealReplica);

    return _this;
  }

  _createClass(Replica, [{
    key: "_revealReplica",
    value: function _revealReplica(data) {
      if (this._step === data.step) {
        this._textContainer.innerHTML = data.choice_response + this._textContainer.innerHTML;
        this.el.classList.remove('is-inactive');
      }
    }
  }]);

  return Replica;
}(_componentLoaderJs.Component);

exports.default = Replica;

},{"component-loader-js":3}],8:[function(require,module,exports){
"use strict";

var _componentLoaderJs = _interopRequireDefault(require("component-loader-js"));

var _choiceButton = _interopRequireDefault(require("../../components/choice-button/choice-button"));

var _replica = _interopRequireDefault(require("../../components/replica/replica"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var componentLoader = new _componentLoaderJs.default({
  ChoiceButton: _choiceButton.default,
  Replica: _replica.default
});
componentLoader.scan();

},{"../../components/choice-button/choice-button":6,"../../components/replica/replica":7,"component-loader-js":3}]},{},[8]);
