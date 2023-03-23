const { expect } = require('chai');
const proxyquire = require('proxyquire');
const config = require('../util/config');

describe('command::pms', () => {

  describe('test pms command', () => {
    before(() => {
      config.delete('app.pms.status');
      config.set('cli.pms.host', 'TEST_HOST');
    });

    it('test uri, method and body of pms interface request', () => {
      const interfaceCommand = proxyquire('./pms', {
        '../util/request': (options) => {
          return Promise.resolve({
            request: options,
            body: {
              status: 'success',
            },
          });
        },
      });

      const args = {
        status: 'up',
      };

      return interfaceCommand(args).then(res => {
        expect(res.request.uri).to.equal('TEST_HOST/commands/events');
        expect(res.request.method).to.equal('post');
        expect(res.request.body.type).to.equal('status');
        expect(res.request.body.status.status).to.equal('up');
      });
    });

    it('test "down" status of interface request', () => {
      const interfaceCommand = proxyquire('./pms', {
        '../util/request': (options) => {
          return Promise.resolve({
            request: options,
            body: {
              status: 'success',
            },
          });
        },
      });

      const args = {
        status: 'down',
      };

      return interfaceCommand(args).then(res => {
        expect(res.request.body.status.status).to.equal('down');
      });
    });

    after(() => {
      config.delete('app.pms.status');
      config.delete('cli.pms.host');
    });
  });
});
