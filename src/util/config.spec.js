const { expect } = require('chai');
const config = require('./config');

describe('util::config', () => {
  describe('test config function', () => {
    before(() => {
      config.set('test.bar.baz', true);
    });

    it('get config from file', () => {
      const actual = config.get('test.foo');
      const expected = 'bar';
      expect(actual).to.equal(expected);
    });

    it('set config and get', () => {
      expect(config.get('test.bar.baz')).to.equal(true);
    });

    after(() => {
      config.delete('test.bar');
    });
  });
});
