import warn from './utils/warn';

const defaultModifier = (obj) => obj;

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
            if (typeof options.logPageView !== 'function') {
                warn('Invalid configuration, "logPageView" must be a function.');
            } else {
                Vue.mixin({
                    created() {
                        if (this.$root === this) {
                            this.$watch('$route', options.logPageView);
                        }
                    }
                });
            }
        }

        // and finally, attach our logEvent method to the Vue prototype
        Vue.prototype.$logEvent = (name, payload, modifierFn = defaultModifier) => this.logEvent(options, name, payload, modifierFn);
    },
    logEvent(options, name, payload, modifierFn) {
        const { events, handlers } = options;

        // make sure the given event exists
        if (typeof events[name] === 'undefined') {
            warn(`Unknown event "${name}".`);
        }

        // make sure the given event value is an object
        else if (typeof events[name] !== 'object') {
            warn(`Invalid configuration for "${name}" event, value must be an object.`);
        }

        // finally, call the given event handlers
        else {
            Object.keys(events[name]).forEach(key => {
                
                // make sure the given handler is defined
                if (typeof handlers[key] !== 'function') {
                    warn(`Missing "${key}" handler for event "${name}".`);
                }

                // otherwise call the given handler
                else {
                    const attrs = modifierFn(Object.assign({}, events[name][key]));

                    handlers[key](name, attrs, payload);
                }
            });
        }
    },
};
