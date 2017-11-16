// mock a browser environment
require('browser-env')();

// turn off vue's production tip
const Vue = require('vue');
Vue.config.productionTip = false;
