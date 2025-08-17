const request = require('supertest');
const app = require('../../index');
const { getAuthToken } = require('../utils/testUtils');

describe('Jobs API', () => {
  let contractorToken;
  let otherRoleToken;
  let homeownerToken;

  beforeAll(() => {
    contractorToken = getAuthToken('contractor-1', ['CONTRACTOR']);
    otherRoleToken = getAuthToken('user-other', ['OTHER']);
    homeownerToken = getAuthToken('homeowner-1', ['HOMEOWNER']);
  });

  describe('POST /api/jobs', () => {
    const validJobData = {
      title: 'Electrical rewiring',
      description: 'Full 3-bedroom rewiring',
      location: 'Lagos',
      budget: 2000,
      requiredProfession: 'Electrician',
      estimatedDuration: 10,
      startDate: '2025-09-01',
      endDate: '2025-09-10'
    };

    test('should post a job by contractor', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${contractorToken}`)
        .send(validJobData);

      expect(res.statusCode).toBe(201);
      expect(res.body.job).toHaveProperty('id');
      expect(res.body.job.title).toBe('Electrical rewiring');
      expect(res.body.job.contractorId).toBe('contractor-1');
    });

    test('should reject if not contractor', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${homeownerToken}`)
        .send(validJobData);

      expect(res.statusCode).toBe(403);
    });

    test('should reject job posting without required fields', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${contractorToken}`)
        .send({ title: 'Incomplete Job' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Missing required fields');
    });

    test('should reject unauthenticated requests', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .send(validJobData);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/jobs/:jobId/apply', () => {
    let jobId;

    beforeAll(async () => {
      const jobRes = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${contractorToken}`)
        .send({
          title: 'Test Job for Application',
          description: 'A test job to verify application submission',
          location: 'Abuja',
          budget: 1500,
          requiredProfession: 'Plumber',
          estimatedDuration: 5,
          startDate: '2025-09-01',
          endDate: '2025-09-05'
        });

      jobId = jobRes.body.job.id;
    });

    const validApplicationData = {
      coverLetter: 'I can deliver in time',
      proposedRate: 45,
      estimatedStartDate: '2025-09-02',
      estimatedEndDate: '2025-09-05'
    };

    test('should submit application successfully', async () => {
      const res = await request(app)
        .post(`/api/jobs/${jobId}/apply`)
        .set('Authorization', `Bearer ${otherRoleToken}`)
        .send(validApplicationData);

      expect(res.statusCode).toBe(201);
      expect(res.body.application).toHaveProperty('id');
      expect(res.body.application.jobId).toBe(jobId);
      expect(res.body.application.status).toBe('PENDING');
    });

    test('should reject application from HOMEOWNER', async () => {
      const res = await request(app)
        .post(`/api/jobs/${jobId}/apply`)
        .set('Authorization', `Bearer ${homeownerToken}`)
        .send(validApplicationData);

      expect(res.statusCode).toBe(403);
    });

    test('should reject duplicate application', async () => {
      const res = await request(app)
        .post(`/api/jobs/${jobId}/apply`)
        .set('Authorization', `Bearer ${otherRoleToken}`)
        .send(validApplicationData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Already applied');
    });

    test('should reject application without required fields', async () => {
      const res = await request(app)
        .post(`/api/jobs/${jobId}/apply`)
        .set('Authorization', `Bearer ${otherRoleToken}`)
        .send({ coverLetter: 'Incomplete application' });

      expect(res.statusCode).toBe(400);
    });

    test('should reject unauthenticated requests', async () => {
      const res = await request(app)
        .post(`/api/jobs/${jobId}/apply`)
        .send(validApplicationData);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('PATCH /api/jobs/applications/:applicationId/decision', () => {
    let jobId;
    let applicationId;

    beforeAll(async () => {
      const jobRes = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${contractorToken}`)
        .send({
          title: 'Test Job for Decision',
          description: 'A test job to verify application decisions',
          location: 'Port Harcourt',
          budget: 2000,
          requiredProfession: 'Carpenter',
          estimatedDuration: 7,
          startDate: '2025-09-01',
          endDate: '2025-09-07'
        });

      jobId = jobRes.body.job.id;

      const applicationRes = await request(app)
        .post(`/api/jobs/${jobId}/apply`)
        .set('Authorization', `Bearer ${otherRoleToken}`)
        .send({
          coverLetter: 'I can deliver in time',
          proposedRate: 50,
          estimatedStartDate: '2025-09-02',
          estimatedEndDate: '2025-09-07'
        });

      applicationId = applicationRes.body.application.id;
    });

    test('should approve application successfully', async () => {
      const res = await request(app)
        .patch(`/api/jobs/applications/${applicationId}/decision`)
        .set('Authorization', `Bearer ${contractorToken}`)
        .send({ decision: 'APPROVED' });

      expect(res.statusCode).toBe(200);
      expect(res.body.application.status).toBe('APPROVED');
    });

    test('should reject decision from non-owner contractor', async () => {
      const otherContractorToken = getAuthToken('contractor-2', ['CONTRACTOR']);
      
      const res = await request(app)
        .patch(`/api/jobs/applications/${applicationId}/decision`)
        .set('Authorization', `Bearer ${otherContractorToken}`)
        .send({ decision: 'REJECTED' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Not authorized');
    });

    test('should reject invalid decision', async () => {
      const res = await request(app)
        .patch(`/api/jobs/applications/${applicationId}/decision`)
        .set('Authorization', `Bearer ${contractorToken}`)
        .send({ decision: 'INVALID_DECISION' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid decision');
    });

    test('should reject unauthenticated requests', async () => {
      const res = await request(app)
        .patch(`/api/jobs/applications/${applicationId}/decision`)
        .send({ decision: 'APPROVED' });

      expect(res.statusCode).toBe(401);
    });
  });
});
