const { expect } = require('chai');
const SuperTest = require('supertest');
const config = require('../util/config');

const app = require('../app');
const request = SuperTest.agent(app);

describe('api::subscriptions', () => {
  const now = new Date();
  const subscriptionMock = {
    id: 1,
    name: 'PCN_TEST',
    host: 'TEST_HOST',
    prefix: '/test/prefix',
    created: now.toISOString(),
    updated: now.toISOString(),
  };

  describe('test get subscription api', () => {
    before(() => {
      config.set(`app.pcn.${subscriptionMock.id}`, subscriptionMock);
    });

    it('get subscription will return success', () => {
      return request.get('/api/pms/v2/subscriptions/1')
        .expect(200)
        .then(res => {
          const data = res.body.data;

          expect(res.body.status).to.equal('success');
          expect(data.id).to.equal(1);
          expect(data.host).to.equal('TEST_HOST');
          expect(data.prefix).to.equal('/test/prefix');
          return Promise.resolve();
        });
    });

    it('get subscription with specific id will return success', () => {
      return request.get('/api/pms/v2/subscriptions/2')
        .expect(200)
        .then(res => {
          const data = res.body.data;

          expect(res.body.status).to.equal('success');
          expect(data.id).to.be.undefined;
          return Promise.resolve();
        });
    });

    after(() => {
      config.set('app.pcn', {});
    });
  });

  describe('test post subscription api', () => {
    beforeEach(() => {
      config.set('app.pcn', {});
      config.set('app.pms.subscriptionId', 1);
    });

    it('post subscription will return success', () => {
      return request.post('/api/pms/v2/subscriptions')
        .send({
          name: 'TEST_PCN',
          callbackUri: 'https://pcn_host:63000/api/v2/events/pms',
        })
        .expect(201)
        .then(res => {
          const data = res.body.data;
          const subscription = config.get('app.pcn.1');

          expect(res.body.status).to.equal('success');
          expect(data.id).to.equal(1);
          expect(data.name).to.equal('TEST_PCN');
          expect(data.host).to.equal('https://pcn_host:63000');
          expect(data.prefix).to.equal('/api/v2/events/pms');

          expect(subscription.id).to.equal(1);
          expect(subscription.name).to.equal('TEST_PCN');
          expect(subscription.host).to.equal('https://pcn_host:63000');
          expect(subscription.prefix).to.equal('/api/v2/events/pms');
          return Promise.resolve();
        });
    });

    it('post subscription with another uri will return success', () => {
      return request.post('/api/pms/v2/subscriptions')
        .send({
          name: 'PCN',
          callbackUri: 'http://test_host:8080/events',
        })
        .expect(201)
        .then(res => {
          const data = res.body.data;
          const subscription = config.get('app.pcn.1');

          expect(res.body.status).to.equal('success');
          expect(data.id).to.equal(1);
          expect(data.name).to.equal('PCN');
          expect(data.host).to.equal('http://test_host:8080');
          expect(data.prefix).to.equal('/events');

          expect(subscription.id).to.equal(1);
          expect(subscription.name).to.equal('PCN');
          expect(subscription.host).to.equal('http://test_host:8080');
          expect(subscription.prefix).to.equal('/events');
          return Promise.resolve();
        });
    });

    it('post subscription with no name will return success', () => {
      return request.post('/api/pms/v2/subscriptions')
        .send({
          callbackUri: 'http://test_host:8080/events',
        })
        .expect(201)
        .then(res => {
          const data = res.body.data;
          const subscription = config.get('app.pcn.1');

          expect(res.body.status).to.equal('success');
          expect(data.name).to.equal('pcn');

          expect(subscription.name).to.equal('pcn');
          return Promise.resolve();
        });
    });

    it('post subscription with no host will return success', () => {
      return request.post('/api/pms/v2/subscriptions')
        .send({
          callbackUri: '/events',
        })
        .expect(201)
        .then(res => {
          const data = res.body.data;
          const subscription = config.get('app.pcn.1');

          expect(res.body.status).to.equal('success');
          expect(data.host).to.equal('https://127.0.0.1:60080');
          expect(data.prefix).to.equal('/events');

          expect(subscription.host).to.equal('https://127.0.0.1:60080');
          expect(subscription.prefix).to.equal('/events');
          return Promise.resolve();
        });
    });

    it('post subscription with no prefix will return success', () => {
      return request.post('/api/pms/v2/subscriptions')
        .send({
          callbackUri: 'https://pcn_host:63000',
        })
        .expect(201)
        .then(res => {
          const data = res.body.data;
          const subscription = config.get('app.pcn.1');

          expect(res.body.status).to.equal('success');
          expect(data.host).to.equal('https://pcn_host:63000');
          expect(data.prefix).to.equal('/api/v2/events/pms');

          expect(subscription.host).to.equal('https://pcn_host:63000');
          expect(subscription.prefix).to.equal('/api/v2/events/pms');
          return Promise.resolve();
        });
    });

    afterEach(() => {
      config.set('app.pcn', {});
    });
  });

  describe('test put subscription api', () => {
    beforeEach(() => {
      config.set('app.pcn', {});
    });

    it('put subscription will return success', () => {
      return request.put('/api/pms/v2/subscriptions/1')
        .send({
          name: 'TEST_PCN',
          callbackUri: 'https://pcn_host:63000/api/v2/events/pms',
        })
        .expect(200)
        .then(res => {
          const data = res.body.data;
          const subscription = config.get('app.pcn.1');

          expect(res.body.status).to.equal('success');
          expect(data.id).to.equal(1);
          expect(data.name).to.equal('TEST_PCN');
          expect(data.host).to.equal('https://pcn_host:63000');
          expect(data.prefix).to.equal('/api/v2/events/pms');

          expect(subscription.id).to.equal(1);
          expect(subscription.name).to.equal('TEST_PCN');
          expect(subscription.host).to.equal('https://pcn_host:63000');
          expect(subscription.prefix).to.equal('/api/v2/events/pms');
          return Promise.resolve();
        });
    });

    it('put subscription with another uri will return success', () => {
      return request.put('/api/pms/v2/subscriptions/1')
        .send({
          name: 'PCN',
          callbackUri: 'http://test_host:8080/events',
        })
        .expect(200)
        .then(res => {
          const data = res.body.data;
          const subscription = config.get('app.pcn.1');

          expect(res.body.status).to.equal('success');
          expect(data.id).to.equal(1);
          expect(data.name).to.equal('PCN');
          expect(data.host).to.equal('http://test_host:8080');
          expect(data.prefix).to.equal('/events');

          expect(subscription.id).to.equal(1);
          expect(subscription.name).to.equal('PCN');
          expect(subscription.host).to.equal('http://test_host:8080');
          expect(subscription.prefix).to.equal('/events');
          return Promise.resolve();
        });
    });

    it('put subscription with no name will return success', () => {
      return request.put('/api/pms/v2/subscriptions/1')
        .send({
          callbackUri: 'http://test_host:8080/events',
        })
        .expect(200)
        .then(res => {
          const data = res.body.data;
          const subscription = config.get('app.pcn.1');

          expect(res.body.status).to.equal('success');
          expect(data.name).to.equal('pcn');

          expect(subscription.name).to.equal('pcn');
          return Promise.resolve();
        });
    });

    it('put subscription with no host will return success', () => {
      return request.put('/api/pms/v2/subscriptions/1')
        .send({
          callbackUri: '/events',
        })
        .expect(200)
        .then(res => {
          const data = res.body.data;
          const subscription = config.get('app.pcn.1');

          expect(res.body.status).to.equal('success');
          expect(data.host).to.equal('https://127.0.0.1:60080');
          expect(data.prefix).to.equal('/events');

          expect(subscription.host).to.equal('https://127.0.0.1:60080');
          expect(subscription.prefix).to.equal('/events');
          return Promise.resolve();
        });
    });

    it('put subscription with no prefix will return success', () => {
      return request.put('/api/pms/v2/subscriptions/1')
        .send({
          callbackUri: 'https://pcn_host:63000',
        })
        .expect(200)
        .then(res => {
          const data = res.body.data;
          const subscription = config.get('app.pcn.1');

          expect(res.body.status).to.equal('success');
          expect(data.host).to.equal('https://pcn_host:63000');
          expect(data.prefix).to.equal('/api/v2/events/pms');

          expect(subscription.host).to.equal('https://pcn_host:63000');
          expect(subscription.prefix).to.equal('/api/v2/events/pms');
          return Promise.resolve();
        });
    });

    afterEach(() => {
      config.set('app.pcn', {});
    });
  });

  describe('test delete subscription api', () => {
    beforeEach(() => {
      config.set(`app.pcn.${subscriptionMock.id}`, subscriptionMock);
    });

    it('delete subscription will return success', () => {
      return request.delete('/api/pms/v2/subscriptions/1')
        .expect(200)
        .then(res => {
          const subscription = config.get('app.pcn.1');

          expect(res.body.status).to.equal('success');
          expect(res.body.data).to.equal(1);

          expect(subscription).to.be.undefined;
          return Promise.resolve();
        });
    });

    it('delete subscription with another id will return success', () => {
      return request.delete('/api/pms/v2/subscriptions/2')
        .expect(200)
        .then(res => {
          const subscription = config.get('app.pcn.2');

          expect(res.body.status).to.equal('success');
          expect(res.body.data).to.equal(2);

          expect(subscription).to.be.undefined;
          return Promise.resolve();
        });
    });

    afterEach(() => {
      config.set('app.pcn', {});
    });
  });
});
