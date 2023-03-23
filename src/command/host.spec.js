const { expect } = require('chai');
const config = require('../util/config');
const hostCommand = require('./host');

describe('command::host', () => {
  describe('test host command', () => {
    before(() => {
      config.set('app.pcn.1.host', 'https://127.0.0.1:60080');
      config.set('app.pcn.1.prefix', '/api');
      config.set('cli.pms.host', 'http://127.0.0.1:9890');
    });

    it('get current host config', () => {
      const actual = hostCommand({});
      const expected = {
        pcn: ['https://127.0.0.1:60080/api'],
        pms: 'http://127.0.0.1:9890',
      };
      expect(actual).to.deep.equal(expected);
    });

    after(() => {
      config.delete('app.pcn.1');
      config.delete('cli.pms.host');
    });
  });
});
