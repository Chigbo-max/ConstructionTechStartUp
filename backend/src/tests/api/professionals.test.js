const request = require('supertest');
const app = require('../../index');
const { getAuthToken } = require('../utils/testUtils');

describe('Professionals API', () => {
  let otherRoleToken;
  let contractorToken;
  let homeownerToken;

  beforeAll(() => {
    otherRoleToken = getAuthToken('user-other', ['OTHER']);
    contractorToken = getAuthToken('contractor-1', ['CONTRACTOR']);
    homeownerToken = getAuthToken('homeowner-1', ['HOMEOWNER']);
  });

  describe('POST /api/professionals/profile', () => {
    const validProfileData = {
      profession: 'Electrician',
      location: 'Lagos',
      availability: true,
      hourlyRate: 50,
      experience: 5,
      skills: ['wiring', 'troubleshooting'],
      bio: 'Experienced and reliable'
    };

    test('should create profile for OTHER role user', async () => {
      const res = await request(app)
        .post('/api/professionals/profile')
        .set('Authorization', `Bearer ${otherRoleToken}`)
        .send(validProfileData);

      expect(res.statusCode).toBe(201);
      expect(res.body.profile).toHaveProperty('id');
      expect(res.body.profile.profession).toBe('Electrician');
      expect(res.body.profile.location).toBe('Lagos');
    });

    test('should allow CONTRACTOR to create profile', async () => {
      const res = await request(app)
        .post('/api/professionals/profile')
        .set('Authorization', `Bearer ${contractorToken}`)
        .send(validProfileData);

      expect(res.statusCode).toBe(201);
      expect(res.body.profile).toHaveProperty('id');
    });

    test('should reject HOMEOWNER from creating profile', async () => {
      const res = await request(app)
        .post('/api/professionals/profile')
        .set('Authorization', `Bearer ${homeownerToken}`)
        .send(validProfileData);

      expect(res.statusCode).toBe(403);
    });

    test('should reject profile creation without required fields', async () => {
      const res = await request(app)
        .post('/api/professionals/profile')
        .set('Authorization', `Bearer ${otherRoleToken}`)
        .send({ profession: 'Plumber' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('profession, location are required');
    });

    test('should reject unauthenticated requests', async () => {
      const res = await request(app)
        .post('/api/professionals/profile')
        .send(validProfileData);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/professionals/search', () => {
    test('should search by profession', async () => {
      const res = await request(app)
        .get('/api/professionals/search?profession=Electrician');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('professionals');
    });

    test('should search by location', async () => {
      const res = await request(app)
        .get('/api/professionals/search?location=Lagos');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('professionals');
    });

    test('should search by availability', async () => {
      const res = await request(app)
        .get('/api/professionals/search?availability=true');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('professionals');
    });

    test('should search with multiple filters', async () => {
      const res = await request(app)
        .get('/api/professionals/search?profession=Electrician&location=Lagos&availability=true');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('professionals');
    });

    test('should return empty array when no results', async () => {
      const res = await request(app)
        .get('/api/professionals/search?profession=NonExistentProfession');

      expect(res.statusCode).toBe(200);
      expect(res.body.professionals).toEqual([]);
    });
  });
});
