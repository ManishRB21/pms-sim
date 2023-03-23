const { expect } = require('chai');
const _ = require('lodash');

const config = require('../util/config');
const folioCommand = require('./folio');

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
      }],
      guestId: '202-1',
    },
  },
};

describe('command::folio', () => {
  describe('test folio command', () => {
    beforeEach(() => {
      config.set('app.room', roomsMock);
    });

    it('add folio item and check item exist on the config', () => {
      const args = {
        roomId: '201',
        account: '201-1',
        amount: 3.99,
        desc: 'TV Show',
      };

      return folioCommand(args).then(res => {
        const folio = _.get(config.get('app.room'), '201.folio');
        const item = folio.items.filter(i => i.amount === args.amount);

        expect(res).to.equal(true);
        expect(folio.balance).to.equal(14.98);
        expect(_.pick(item[0], ['amount', 'description'])).to.deep.equal({
          amount: args.amount,
          description: args.desc,
        });
        return Promise.resolve();
      });
    });

    it('add folio item with wrong room id', () => {
      const args = {
        roomId: '100',
        account: '100-1',
        amount: 3.99,
        desc: 'TV Show',
      };

      return folioCommand(args)
        .then(res => {
          expect(res).to.equal(false);
          return Promise.resolve();
        });
    });

    it('add folio item with wrong account id', () => {
      const args = {
        roomId: '201',
        account: '201-2',
        amount: 3.99,
        desc: 'TV Show',
      };

      return folioCommand(args)
        .then(res => {
          expect(res).to.equal(false);
          return Promise.resolve();
        });
    });

    afterEach(() => {
      config.delete('app.room');
    });
  });
});
