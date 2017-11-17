'use strict';

// utility function to log warnings
var warn = function (msg) {
    console.warn('[SpyfuVueAnalytics] ' + msg);
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var index = {
    install: function install(Vue) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


        // options must be provided
        if (options === null) {
            warn('Missing plugin configuration.');
        }

        // make sure an events object was provided
        else if (_typeof(options.events) !== 'object' || Array.isArray(options.events)) {
                warn('Invalid configuration, "events" must be an object.');
            }

            // log page views if a function was passed in
            else if (typeof options.logPageView !== 'undefined') {
                    if (typeof options.logPageView !== 'function') {
                        warn('Invalid configuration, "logPageView" must be a function.');
                    } else {
                        Vue.mixin({
                            created: function created() {
                                if (this.$root === this) {
                                    this.$watch('$route', options.logPageView);
                                }
                            }
                        });
                    }
                }

        // and finally, attach our logEvent method to the Vue prototype
        Vue.prototype.$logEvent = function (name, payload) {
            return _this.logEvent(options, name, payload);
        };
    },
    logEvent: function logEvent(options, name, payload) {
        var events = options.events,
            handlers = options.handlers;

        // make sure the given event exists

        if (typeof events[name] === 'undefined') {
            warn('Unknown event "' + name + '".');
        }

        // make sure the given event value is an object
        else if (_typeof(events[name]) !== 'object') {
                warn('Invalid configuration for "' + name + '" event, value must be an object.');
            }

            // finally, call the given event handlers
            else {
                    Object.keys(events[name]).forEach(function (key) {

                        // make sure the given handler is defined
                        if (typeof handlers[key] !== 'function') {
                            warn('Missing "' + key + '" handler for event "' + name + '".');
                        }

                        // otherwise call the given handler
                        else {
                                handlers[key](name, events[name][key], payload);
                            }
                    });
                }
    }
};

module.exports = index;
