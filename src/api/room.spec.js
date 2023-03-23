const { expect } = require('chai');
const SuperTest = require('supertest');
const config = require('../util/config');

const app = require('../app');
const request = SuperTest.agent(app);

const roomsMock = {
  '201': {
    name: {
      full: 'Mrs. Pearl Brooks',
    },
    id: '201-1',
    folio: {},
  },
  '202': {
    name: {
      full: 'Mrs. Tom Smith',
    },
    id: '202-1',
    folio: {},
  },
};

describe('api::rooms', () => {
  describe('test rooms api', () => {
    before(() => {
      config.set('app.room', roomsMock);
    });

    it('get room 201 will return a guest details', () => {
      return request.get('/api/pms/v2/rooms/201')
        .expect(200)
        .then(res => {
          expect(res.body.status).to.equal('success');

          const data = res.body.data;
          expect(data.id).to.equal('201');
          expect(data.guests[0].name.full).to.equal('Mrs. Pearl Brooks');
          return Promise.resolve();
        });
    });

    it('get room 202 will return a guest details', () => {
      return request.get('/api/pms/v2/rooms/202')
        .expect(200)
        .then(res => {
          expect(res.body.status).to.equal('success');

          const data = res.body.data;
          expect(data.id).to.equal('202');
          expect(data.guests[0].name.full).to.equal('Mrs. Tom Smith');
          return Promise.resolve();
        });
    });

    it('get room empty room will return an unoccupied error', () => {
      return request.get('/api/pms/v2/rooms/100')
        .expect(200)
        .then(res => {
          expect(res.body.status).to.equal('success');
          expect(res.body.data).to.deep.equal({
            guests: [],
          });
          return Promise.resolve();
        });
    });

    it('get room with invalid room number will return error', () => {
      return request.get('/api/pms/v2/rooms/INVALID_ROOM')
        .expect(400)
        .then(res => {
          expect(res.body).to.deep.equal({
            error: {
              message: 'Bad Request',
              statusCode: 400,
            },
            status: 'error',
          });
          return Promise.resolve();
        });
    });

    after(() => {
      config.delete('app.room');
    });
  });
});
