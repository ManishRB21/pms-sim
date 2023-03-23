const { expect } = require('chai');
const proxyquire = require('proxyquire');
const config = require('../util/config');

describe('command::checkin', () => {
  describe('test checkin command', () => {
    beforeEach(() => {
      config.set('cli.pms.host', 'TEST_HOST');
      config.delete('app.room');
    });

    it('test uri, method and body of checkin request', () => {
      const checkinCommand = proxyquire('./checkin', {
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
        name: 'Miss Della Flores',
        isSwap: false,
      };

      return checkinCommand(args).then(res => {
        expect(res.request.uri).to.equal('TEST_HOST/commands/events');
        expect(res.request.method).to.equal('post');
        expect(res.request.body.type).to.equal('checkin');
        expect(res.request.body.checkin.room).to.equal('201');
        expect(res.request.body.checkin.source.type).to.equal('live');
      });
    });

    it('test room id and swap of checkin request', () => {
      const checkinCommand = proxyquire('./checkin', {
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
        name: 'Mrs. Louise Mills',
        isSwap: true,
      };

      return checkinCommand(args).then(res => {
        expect(res.request.body.checkin.room).to.equal('202');
        expect(res.request.body.checkin.source.type).to.equal('swap');
      });
    });

    it('test config data of checkin request', () => {
      const checkinCommand = proxyquire('./checkin', {
        '../util/request': () => Promise.resolve({}),
      });

      const args = {
        roomId: '202',
        name: 'Dr. John Smith',
        isSwap: true,
      };

      return checkinCommand(args).then(() => {
        const actual = config.get('app.room.202');

        expect(actual.id).to.equal('202-1');
        expect(actual.name.full).to.not.be.a('null');
        expect(actual.name.full).to.equal('Dr. John Smith');
        expect(actual.name.prefix).to.equal('Dr.');
        expect(actual.name.first).to.equal('John');
        expect(actual.name.last).to.equal('Smith');
      });
    });

    it('test checkin command with name w/o prefix', () => {
      const checkinCommand = proxyquire('./checkin', {
        '../util/request': () => Promise.resolve({}),
      });

      const args = {
        roomId: '202',
        name: 'John Smith',
        isSwap: true,
      };

      return checkinCommand(args).then(() => {
        const actual = config.get('app.room.202');

        expect(actual.id).to.equal('202-1');
        expect(actual.name.full).to.not.be.a('null');
        expect(actual.name.full).to.equal('John Smith');
        expect(actual.name.prefix).to.be.a('null');
        expect(actual.name.first).to.equal('John');
        expect(actual.name.last).to.equal('Smith');
      });
    });

    it('test checkin command with name w/o prefix, first', () => {
      const checkinCommand = proxyquire('./checkin', {
        '../util/request': () => Promise.resolve({}),
      });

      const args = {
        roomId: '202',
        name: 'Smith',
        isSwap: true,
      };

      return checkinCommand(args).then(() => {
        const actual = config.get('app.room.202');

        expect(actual.id).to.equal('202-1');
        expect(actual.name.full).to.not.be.a('null');
        expect(actual.name.full).to.equal('Smith');
        expect(actual.name.prefix).to.be.a('null');
        expect(actual.name.first).to.be.a('null');
        expect(actual.name.last).to.equal('Smith');
      });
    });

    afterEach(() => {
      config.delete('cli.pms.host');
      config.delete('app.room');
    });
  });
});
