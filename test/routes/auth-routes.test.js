const request = require('supertest');
const app = require('../../routes/auth-routes');
const pool = require('../../db');

describe('POST /register', () => {
  let user;

  beforeEach(() => {
    // Generate a random username for each test
    user = {
      first_name: 'John',
      last_name: 'Doe',
      username: `user${Math.random().toString(36).substring(2, 15)}`,
      email: `user${Math.random().toString(36).substring(2, 15)}@example.com`,
      password: 'password123'
    };
  });

  afterAll(() => {
    pool.end();
  });

  test('should create a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send(user)
      .expect(200);

    expect(res.body.users).toBeDefined();
    expect(res.body.users.first_name).toBe(user.first_name);
    expect(res.body.users.last_name).toBe(user.last_name);
    expect(res.body.users.username).toBe(user.username);
    expect(res.body.users.email).toBe(user.email);
    expect(res.body.users.password).toBeUndefined();
  });
});
