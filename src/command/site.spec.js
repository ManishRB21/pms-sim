const { expect } = require('chai');
const config = require('../util/config');
const siteCommand = require('./site');

describe('command::site', () => {
  describe('test site command', () => {
    before(() => {
      config.set('app.pms.site', {
        id: 'TEST_SITE_ID',
        name: 'TEST_SITE_NAME',
        currency: 'USD',
      });
    });

    it('get current site config', () => {
      const actual = siteCommand({});
      const expected = {
        id: 'TEST_SITE_ID',
        name: 'TEST_SITE_NAME',
        currency: 'USD',
      };
      expect(actual).to.deep.equal(expected);
    });

    it('change site id and name', () => {
      const actual = siteCommand({
        id: 'TEST_CHANGE_SITE_ID',
        name: 'TEST_CHANGE_SITE_NAME',
        currency: 'KRW',
      });
      const expected = {
        id: 'TEST_CHANGE_SITE_ID',
        name: 'TEST_CHANGE_SITE_NAME',
        currency: 'KRW',
      };
      expect(actual).to.deep.equal(expected);
    });

    after(() => {
      config.delete('app.pms.site');
    });
  });
});
