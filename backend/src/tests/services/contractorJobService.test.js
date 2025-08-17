const contractorJobService = require('../../services/contractorJobService');
const contractorJobRepository = require('../../repositories/contractorJobRepository');
const jobApplicationRepository = require('../../repositories/jobApplicationRepository');
const userRepository = require('../../repositories/userRepository');
const professionalRepository = require('../../repositories/professionalRepository');
const notificationService = require('../../services/notificationService');

jest.mock('../../repositories/contractorJobRepository');
jest.mock('../../repositories/jobApplicationRepository');
jest.mock('../../repositories/userRepository');
jest.mock('../../repositories/professionalRepository');
jest.mock('../../services/notificationService');

describe('Contractor Job Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('postJob', () => {
    const contractorId = 'contractor-1';
    const contractorUser = { id: contractorId, roles: ['CONTRACTOR'] };

    const validJob = {
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
      userRepository.findUserById.mockResolvedValue(contractorUser);
      contractorJobRepository.create.mockResolvedValue({ id: 'job-1', contractorId, ...validJob, status: 'OPEN' });

      const result = await contractorJobService.postJob(contractorId, validJob);

      expect(userRepository.findUserById).toHaveBeenCalledWith(contractorId);
      expect(contractorJobRepository.create).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 'job-1');
    });

    test('should reject if not contractor', async () => {
      userRepository.findUserById.mockResolvedValue({ id: 'user-1', roles: ['HOMEOWNER'] });

      await expect(contractorJobService.postJob(contractorId, validJob)).rejects.toThrow('Only contractors can post jobs');
    });

    test('should validate required fields', async () => {
      userRepository.findUserById.mockResolvedValue(contractorUser);

      await expect(contractorJobService.postJob(contractorId, { title: 'x' })).rejects.toThrow('Missing required fields');
    });
  });

  describe('applyForJob', () => {
    const jobId = 'job-1';
    const professionalId = 'prof-1';
    const contractorId = 'contractor-1';

    const application = {
      coverLetter: 'I can deliver in time',
      proposedRate: 45,
      estimatedStartDate: '2025-09-02',
      estimatedEndDate: '2025-09-10'
    };

    const job = { id: jobId, contractorId, status: 'OPEN' };

    test('should submit application and notify contractor', async () => {
      contractorJobRepository.findById.mockResolvedValue(job);
      professionalRepository.findById.mockResolvedValue({ id: professionalId, userId: 'user-p', location: 'Lagos', profession: 'Electrician', availability: true });
      jobApplicationRepository.findByJobAndProfessional.mockResolvedValue(null);
      jobApplicationRepository.create.mockResolvedValue({ id: 'app-1', jobId, professionalId, status: 'PENDING' });
      notificationService.createNotificationForUser = jest.fn().mockResolvedValue(undefined);

      const result = await contractorJobService.applyForJob({ jobId, professionalId, ...application });

      expect(jobApplicationRepository.create).toHaveBeenCalled();
      expect(notificationService.notifyJobApplicationReceived).toHaveBeenCalledWith({ contractorId, jobId, professionalId: professionalId });
      expect(result).toHaveProperty('id', 'app-1');
    });

    test('should reject duplicate application', async () => {
      contractorJobRepository.findById.mockResolvedValue(job);
      jobApplicationRepository.findByJobAndProfessional.mockResolvedValue({ id: 'app-1' });

      await expect(contractorJobService.applyForJob({ jobId, professionalId, ...application })).rejects.toThrow('Already applied');
    });

    test('should reject when job not open', async () => {
      contractorJobRepository.findById.mockResolvedValue({ ...job, status: 'COMPLETED' });

      await expect(contractorJobService.applyForJob({ jobId, professionalId, ...application })).rejects.toThrow('Job not open for applications');
    });
  });

  describe('decideOnApplication', () => {
    const appId = 'app-1';
    const contractorId = 'contractor-1';

    test('should approve application and notify professional', async () => {
      jobApplicationRepository.findById.mockResolvedValue({ id: appId, jobId: 'job-1', professionalId: 'prof-1', contractorId, status: 'PENDING' });
      jobApplicationRepository.updateStatus.mockResolvedValue({ id: appId, status: 'APPROVED' });

      const result = await contractorJobService.decideOnApplication({ applicationId: appId, contractorId, decision: 'APPROVED' });

      expect(jobApplicationRepository.updateStatus).toHaveBeenCalledWith(appId, 'APPROVED');
      expect(notificationService.notifyJobApplicationDecision).toHaveBeenCalledWith({ professionalId: 'prof-1', jobId: 'job-1', decision: 'APPROVED' });
      expect(result.status).toBe('APPROVED');
    });

    test('should reject when not owner contractor', async () => {
      jobApplicationRepository.findById.mockResolvedValue({ id: appId, jobId: 'job-1', professionalId: 'prof-1', contractorId: 'other', status: 'PENDING' });

      await expect(contractorJobService.decideOnApplication({ applicationId: appId, contractorId, decision: 'REJECTED' })).rejects.toThrow('Not authorized');
    });
  });
});
