var expect = require('chai').expect;
var request = require('supertest');
var app = require('../index');
var mongoose = require('mongoose')
var agent = request.agent(app);
var dropMongooseDB = require('./drop_mongoose_db.js')

before(function(done) {
  dropMongooseDB(done)
});

describe('GET /profile', function() {
  it('should redirect to /auth/login if not logged in', function(done) {
    request(app).get('/profile')
    .expect('Location', '/auth/login')
    .expect(302, done);
  });

  it('should return a 200 response if logged in', function(done) {
    agent.post('/auth/signup')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      email: 'my@user.co',
      name: 'Brian',
      password: 'password'
    })
    .expect(302)
    .expect('Location', '/')
    .end(function(error, res) {
      if (error) {
        done(error);
      } else {
        agent.get('/profile')
        .expect(200, done);
      }
    });
  });
});
