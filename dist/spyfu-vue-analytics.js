(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueAnalytics = factory());
}(this, (function () { 'use strict';

// utility function to log warnings
var warn = function (msg) {
    console.warn('[SpyfuVueAnalytics] ' + msg);
};

var index = {
    install(Vue, options = null) {

        // options must be provided
        if (options === null) {
            warn('Missing plugin configuration.');
        }

        // make sure an events object was provided
        else if (typeof options.events !== 'object' || Array.isArray(options.events)) {
                warn('Invalid configuration, "events" must be an object.');
            }

            // log page views if a function was passed in
            else if (typeof options.logPageView !== 'undefined') {
                    if (typeof options.logPageView === 'function') {
                        Vue.mixin({
                            created() {
                                if (this.$root === this) {
                                    this.$watch('$route', options.logPageView);
                                }
                            }
                        });
                    } else {
                        warn('Invalid configuration, "logPageView" must be a function.');
                    }
                }
    }
};

return index;

})));
