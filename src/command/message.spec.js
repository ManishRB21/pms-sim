const { expect } = require('chai');
const proxyquire = require('proxyquire');
const config = require('../util/config');

describe('command::message', () => {

  describe('test message command', () => {
    before(() => {
      config.set('cli.pms.host', 'TEST_HOST');
    });

    it('test uri, method and body of message request', () => {
      const messageCommand = proxyquire('./message', {
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
        text: 'Hello world!',
      };

      return messageCommand(args).then(res => {
        expect(res.request.uri).to.equal('TEST_HOST/commands/events');
        expect(res.request.method).to.equal('post');
        expect(res.request.body.type).to.equal('popup');
        expect(res.request.body.popup.room).to.equal('201');
        expect(res.request.body.popup.message).to.equal('Hello world!');
      });
    });

    it('test room id and message of message request', () => {
      const messageCommand = proxyquire('./message', {
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
        text: 'Good morning!',
      };

      return messageCommand(args).then(res => {
        expect(res.request.body.popup.room).to.equal('202');
        expect(res.request.body.popup.message).to.equal('Good morning!');
      });
    });

    after(() => {
      config.delete('cli.pms.host');
    });
  });
});
