import warn from './utils/warn';

export default {
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
    },
};
