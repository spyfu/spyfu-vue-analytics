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
    // can install plugins multiple times in isolation
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

        it('warns when an unknown event is logged', () => {
            const warn = sinon.stub(console, 'warn');

            Vue.use(Plugin, { events: {}  });

            const vm = new Vue();
            vm.$logEvent('whatever');

            expect(warn.called).to.be.true;
            expect(warn.lastCall.args[0]).to.include('Unknown event "whatever"');
            warn.restore();
        });

        it('warns when an event is invalid', () => {
            const warn = sinon.stub(console, 'warn');

            Vue.use(Plugin, {
                events: {
                    whatever: false,
                },
            });

            const vm = new Vue();
            vm.$logEvent('whatever');
    
            expect(warn.called).to.be.true;
            expect(warn.lastCall.args[0]).to.include('Invalid configuration for "whatever" event, value must be an object.');
            warn.restore();
        });

        it('warns when an event\'s handler is not defined', () => {
            const warn = sinon.stub(console, 'warn');

            Vue.use(Plugin, {
                events: {
                    whatever: {
                        foo: null,
                    },
                },
                handlers: {
                    // omitting the foo handler
                },
            });

            const vm = new Vue();

            vm.$logEvent('whatever');

            expect(warn.called).to.be.true;
            expect(warn.lastCall.args[0]).to.include('Missing "foo" handler for event "whatever"');
        });

        it('calls correct handler when events are logged', () => {
            const payload = {};
            const fooWhatever = {};
            const barWhatever = {};
            const fooHandler = sinon.stub();
            const barHandler = sinon.stub();

            Vue.use(Plugin, {
                events: {
                    whatever: {
                        foo: fooWhatever,
                        bar: barWhatever,
                    },
                },
                handlers: {
                    foo: fooHandler,
                    bar: barHandler,
                },
            });

            const vm = new Vue();

            vm.$logEvent('whatever', payload);

            expect(fooHandler.called).to.be.true;
            expect(fooHandler.lastCall.args[0]).to.equal('whatever');
            expect(fooHandler.lastCall.args[1]).to.equal(fooWhatever);
            expect(fooHandler.lastCall.args[2]).to.equal(payload);
            
            expect(barHandler.called).to.be.true;
            expect(barHandler.lastCall.args[0]).to.equal('whatever');
            expect(barHandler.lastCall.args[1]).to.equal(barWhatever);
            expect(barHandler.lastCall.args[2]).to.equal(payload);
        });
    });
});
