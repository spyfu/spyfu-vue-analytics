const Plugin = require('../../');
const VueRouter = require('vue-router');
const sinon = require('sinon');
const { expect } = require('chai');
const { createLocalVue } = require('vue-test-utils');

//
// tests
//
describe('spyfu-vue-analytics', () => {

    let Vue;

    // create a local copy of the Vue constructor so we
    // can install the plugin multiple times in isolation
    beforeEach(() => {
        Vue = createLocalVue();
    });

    //
    // installation
    //
    describe('installation', () => {
        it('warns if installed without config object', () => {
            const warn = sinon.stub(console, 'warn');

            Vue.use(Plugin);

            expect(warn.called).to.be.true;
            expect(warn.lastCall.args[0]).to.include('Missing plugin configuration');

            warn.restore();
        });

        it('warns if installed without an "events" object', () => {
            const warn = sinon.stub(console, 'warn');

            Vue.use(Plugin, {});

            expect(warn.called).to.be.true;
            expect(warn.lastCall.args[0]).to.include(
                'Invalid configuration, "events" must be an object'
            );

            warn.restore();
        });

        it('warns if installed with an invalid "logPageView" function', () => {
            const warn = sinon.stub(console, 'warn');

            Vue.use(Plugin, { events: {}, logPageView: 'foo' });

            expect(warn.called).to.be.true;
            expect(warn.lastCall.args[0]).to.include(
                'Invalid configuration, "logPageView" must be a function'
            );

            warn.restore();
        })
    });

    //
    // usage
    //
    describe('usage', () => {
        it('logs page views', (done) => {
            const logPageView = sinon.stub();

            Vue.use(VueRouter);
            Vue.use(Plugin, { events: {}, logPageView })

            const vm = new Vue({
                router: new VueRouter(),
            });

            vm.$router.push({ query: { foo: 'bar' }});

            vm.$nextTick(() => {
                expect(logPageView.called).to.be.true;
                done();
            });
        });
    });
});
