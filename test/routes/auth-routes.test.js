import app from '../../routes/auth-routes'
import request from 'supertest'

describe('POST /register', () => {
  test('should create a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        first_name: 'John',
        last_name: 'Doe',
        username: 'jdoe',
        email: 'jdoe@example.com',
        password: 'password123'
      })
      .expect(200);

    expect(res.body.users.first_name).toBe('John');
    expect(res.body.users.last_name).toBe('Doe');
    expect(res.body.users.username).toBe('jdoe');
    expect(res.body.users.email).toBe('jdoe@example.com');
    expect(res.body.users.password).not.toBe('password123');
  });

  
});
