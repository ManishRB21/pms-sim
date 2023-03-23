const { expect } = require('chai');
const proxyquire = require('proxyquire');
const config = require('../util/config');

describe('command::checkout', () => {

  describe('test checkout command', () => {
    before(() => {
      config.set('cli.pms.host', 'TEST_HOST');
      config.delete('app.room');
    });

    it('test uri, method and body of checkout request', () => {
      const checkoutCommand = proxyquire('./checkout', {
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
        roomId: '201',
        isSwap: false,
      };

      return checkoutCommand(args).then(res => {
        expect(res.request.uri).to.equal('TEST_HOST/commands/events');
        expect(res.request.method).to.equal('post');
        expect(res.request.body.type).to.equal('checkout');
        expect(res.request.body.checkout.room).to.equal('201');
        expect(res.request.body.checkout.source.type).to.equal('live');
      });
    });

    it('test room id and swap of checkout request', () => {
      const checkoutCommand = proxyquire('./checkout', {
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
        roomId: '202',
        isSwap: true,
      };

      return checkoutCommand(args).then(res => {
        expect(res.request.body.checkout.room).to.equal('202');
        expect(res.request.body.checkout.source.type).to.equal('swap');
      });
    });

    it('test config data of checkout request', () => {
      config.set('app.room.202', {
        name: {
          full: 'TEST',
        },
        id: '202-1',
        folio: {},
      });

      const checkoutCommand = proxyquire('./checkout', {
        '../util/request': () => Promise.resolve({}),
      });

      const args = {
        roomId: '202',
        isSwap: true,
      };

      return checkoutCommand(args).then(() => {
        const actual = config.get('app.room.202');

        expect(actual).to.be.a('undefined');
      });
    });

    after(() => {
      config.delete('cli.pms.host');
      config.delete('app.room');
    });
  });
});
