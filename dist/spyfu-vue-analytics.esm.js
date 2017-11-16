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
    }
};

export default index;
