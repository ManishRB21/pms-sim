const { expect } = require('chai');
const _ = require('lodash');

const config = require('../util/config');
const roomCommand = require('./room');

const now = new Date();
const roomsMock = {
  '201': {
    name: {
      full: 'Mrs. Pearl Brooks',
    },
    id: '201-1',
    folio: {
      id: '201-1',
      balance: 10.99,
      status: 'open',
      items: [{
        id: 1,
        amount: 10.99,
        created: now.toISOString(),
        description: 'Movies',
        display: true,
      }],
      guestId: '201-1',
    },
  },
  '202': {
    name: {
      full: 'Mrs. Tom Smith',
    },
    id: '202-1',
    folio: {
      id: '202-1',
      balance: 5.19,
      status: 'open',
      items: [{
        id: 1,
        amount: 5.19,
        created: now.toISOString(),
        description: 'Popcorn',
        display: true,
      },{
        id: 2,
        amount: 10.99,
        created: now.toISOString(),
        description: 'Movies',
        display: true,
      }],
      guestId: '202-1',
    },
  },
};

describe('command::room', () => {
  describe('test room command', () => {
    beforeEach(() => {
      config.set('app.room', roomsMock);
    });

    it('get room list', () => {
      const args = {};

      return roomCommand(args).then(res => {
        expect(res).to.deep.equal(_.keys(roomsMock));
        return Promise.resolve();
      });
    });

    it('get room "201"\'s detail', () => {
      const args = {
        roomId: '201'
      };

      return roomCommand(args).then(res => {
        expect(res).to.deep.equal(_.get(roomsMock, '201'));
        return Promise.resolve();
      });
    });

    it('get room "202"\'s detail', () => {
      const args = {
        roomId: '202'
      };

      return roomCommand(args).then(res => {
        expect(res).to.deep.equal(_.get(roomsMock, '202'));
        return Promise.resolve();
      });
    });

    it('get room unknown room\'s detail', () => {
      const args = {
        roomId: '100'
      };

      return roomCommand(args).then(res => {
        expect(res).to.equal(false);
        return Promise.resolve();
      });
    });

    afterEach(() => {
      config.delete('app.room', {});
    })
  });
});
