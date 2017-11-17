# spyfu-vue-analytics

[![build status](https://img.shields.io/circleci/project/github/spyfu/spyfu-vue-analytics.svg)](https://circleci.com/gh/spyfu/spyfu-vue-analytics)
[![coverage](https://img.shields.io/codecov/c/github/spyfu/spyfu-vue-analytics.svg)](https://codecov.io/gh/spyfu/spyfu-vue-analytics)
[![dev dependencies](https://img.shields.io/david/dev/spyfu/spyfu-vue-analytics.svg)](https://david-dm.org/spyfu/spyfu-vue-analytics?type=dev)
[![npm](https://img.shields.io/npm/v/spyfu-vue-analytics.svg)](https://www.npmjs.com/package/spyfu-vue-analytics)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/spyfu/spyfu-vue-analytics/blob/master/LICENSE)

### Installation

This plugin enables easy logging of events to third party analytics providers.

```bash
# install with yarn
yarn add spyfu-vue-analytics

# or install with npm
npm install spyfu-vue-analytics
```

### Basic usage

Once the package is pulled in, you must instruct Vue to use it.

```js
import Analytics from 'spyfu-vue-analytics';
import Vue from 'vue';

Vue.use(Analytics, {
    events: {
        userSignup: {
            google: {
                // define any additional data to pass to the
                // google handler when this event happens.
            },
        },
    },
    handlers: {
        google(eventName, eventConfig, payload) {
            // log event to google analytics
        },
    },
    logPageView(route) {
        // log page view event
    },
});
```

Finally, when an event you care about happens, use the `$logEvent` function to call your handlers.

```js
// component.vue
export default {
    methods: {
        onUserSignup() {
            this.$logEvent('userSignup', payload);
        },
    },
};
```