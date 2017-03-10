'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var angular = _interopDefault(require('angular'));

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function NotificationProvider() {
    var _this = this;

    // Defaults config
    this.defaultConfig = {};

    // Requite keys
    this.requiredKeys = [];

    /**
     * Sanitize configuration parameters
     * 
     * @param {object} an `object` of params to sanitize
     * @return {object} an sanitize version of the params
     */
    var sanitizeConfigParams = function sanitizeConfigParams(params) {
        if (!(params instanceof Object)) {
            throw new TypeError('Invalid argument: `config` must be an `Object`.');
        }

        // Extend default configuration.
        var config = angular.extend({}, _this.defaultConfig, params);

        // Check if all required keys are set.
        _this.requiredKeys.forEach(function (key) {
            if (!config[key]) {
                throw new Error('Missing parameter: ' + key + '.');
            }
        });

        return config;
    };

    /**
     * Configure
     * 
     * @param {object} params - An `object` of params to extend.
     */
    this.configure = function (params) {
        _this.defaultConfig = sanitizeConfigParams(params);
    };

    /**
     * The provider
     */
    this.$get = function ($window, $rootScope, $q) {
        var Notification = function () {
            function Notification(config) {
                classCallCheck(this, Notification);

                this.config = config;

                this.isSupported = !!$window.Notification;
            }

            createClass(Notification, [{
                key: 'show',
                value: function show(title, options) {

                    if (!$window.Notification) return false;

                    this.title = title;
                    this.options = options;

                    // Events cache.
                    this._events = [];

                    if ($window.Notification.permission === 'granted') {
                        return this.createNotification();
                    } else if ($window.Notification.permission !== 'denied') {
                        this.requestPermission().then(createNotification);
                    }
                }

                /**
                 * Create the notification.
                 */

            }, {
                key: 'createNotification',
                value: function createNotification() {
                    var _this2 = this;

                    // Extend options with default provider options.
                    this.options = angular.extend({
                        focusWindowOnClick: true
                    }, this.config || {}, this.options);

                    // Create a base notification.
                    try {
                        this.baseNotification = new $window.Notification(this.title, this.options);
                    } catch (error) {
                        return;
                    }

                    // Close notification after specified delay.
                    if (this.options.delay) setTimeout(angular.bind(this, this.close), this.options.delay);

                    // Focus window on click.
                    if (this.options.focusWindowOnClick) this.$on('click', function (e) {
                        return $window.focus();
                    });

                    // Re-bind events.
                    this._events.forEach(function (args) {
                        _this2.$on.apply(_this2, toConsumableArray(args));
                    });

                    // Reset events.
                    this._events = [];
                }
            }, {
                key: 'requestPermission',
                value: function requestPermission() {
                    return $q(function (resolve, reject) {
                        if (!$window.Notification) return reject();

                        $window.Notification.requestPermission(function (permission) {
                            // Persist permission.
                            $window.Notification.permission = $window.Notification.permission || permission;
                            resolve($window.Notification.permission);
                        });
                    });
                }

                /**
                 * Close the notification.
                 */

            }, {
                key: 'close',
                value: function close() {
                    if (this.baseNotification) this.baseNotification.close();
                }

                /**
                 * Listen on event of a given type.
                 * Supported events are:
                 * 
                 * - error
                 * - show
                 * - click
                 * - close
                 *
                 * @param {String} name
                 * @param {Function} listener
                 */

            }, {
                key: '$on',
                value: function $on(name, listener) {
                    // If the notification is not ready, we cache the event.
                    if (!this.baseNotification) return this._events.push([name, listener]);

                    this.baseNotification.addEventListener(name, applyListener);

                    function applyListener() {
                        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                            args[_key] = arguments[_key];
                        }

                        $rootScope.$apply(function () {
                            listener.apply(undefined, args);
                        });
                    }

                    // Return the deregistration function.
                    return function $off() {
                        this.baseNotification.removeListener(event, applyListener);
                    };
                }
            }]);
            return Notification;
        }();

        return new Notification(this.defaultConfig);
    };

    this.$get.$inject = ['$window', '$rootScope', '$q'];
}

/**
 * Dependencies.
 */
var ngModule = angular.module('ngDesktopNotifications', []).provider('desktopNotification', NotificationProvider).name;

module.exports = ngModule;
//# sourceMappingURL=ng-desktop-notifications.js.map
