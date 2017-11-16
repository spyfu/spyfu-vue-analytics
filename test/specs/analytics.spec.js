const { expect } = require('chai');
const { factory } = require('spyfu-vue-factory');
const sinon = require('sinon');
const Plugin = require('../../');
const Vue = require('vue');

//
// factory
//
const mount = factory();

//
// tests
//
describe('spyfu-vue-analytics', () => {

    //
    // installation
    //
    describe('installation', () => {

        // uninstall our plugin before each test
        beforeEach(() => {
            delete Vue.prototype.$logEvent;
        });

        it('warns if installed without config object', () => {
            const warn = sinon.stub(console, 'warn');
            const VueConstructor = Object.create(Vue);

            VueConstructor.use(Plugin);

            expect(warn.called).to.be.true;
            expect(warn.lastCall.args[0]).to.include('Missing plugin configuration');

            warn.restore();
        });

        it('warns if installed without an "events" object', () => {
            const warn = sinon.stub(console, 'warn');
            const VueConstructor = Object.create(Vue);

            VueConstructor.use(Plugin, {});

            expect(warn.called).to.be.true;
            expect(warn.lastCall.args[0]).to.include(
                'Invalid configuration, "events" must be an object'
            );

            warn.restore();
        });
    });
});
