const professionalService = require('../../services/professionalService');
const professionalRepository = require('../../repositories/professionalRepository');
const userRepository = require('../../repositories/userRepository');

jest.mock('../../repositories/professionalRepository');
jest.mock('../../repositories/userRepository');

describe('Professional Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerOrUpdateProfessionalProfile', () => {
    const userId = 'user-1';
    const validData = {
      profession: 'Electrician',
      location: 'Lagos',
      availability: true,
      hourlyRate: 50,
      experience: 5,
      skills: ['wiring', 'troubleshooting'],
      bio: 'Experienced and reliable'
    };

    const userWithOtherRole = { id: userId, roles: ['OTHER'] };
    const userWithContractorRole = { id: userId, roles: ['CONTRACTOR'] };

    test('should create profile for OTHER role user', async () => {
      userRepository.findUserById.mockResolvedValue(userWithOtherRole);
      professionalRepository.findByUserId.mockResolvedValue(null);
      professionalRepository.create.mockResolvedValue({ id: 'prof-1', userId, ...validData });

      const result = await professionalService.registerOrUpdateProfessionalProfile(userId, validData);

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(professionalRepository.create).toHaveBeenCalledWith({ userId, ...validData });
      expect(result).toHaveProperty('id', 'prof-1');
    });

    test('should allow CONTRACTOR to create profile too', async () => {
      userRepository.findUserById.mockResolvedValue(userWithContractorRole);
      professionalRepository.findByUserId.mockResolvedValue(null);
      professionalRepository.create.mockResolvedValue({ id: 'prof-1', userId, ...validData });

      const result = await professionalService.registerOrUpdateProfessionalProfile(userId, validData);

      expect(result.id).toBe('prof-1');
    });

    test('should update existing profile', async () => {
      userRepository.findUserById.mockResolvedValue(userWithOtherRole);
      professionalRepository.findByUserId.mockResolvedValue({ id: 'prof-1', userId, profession: 'Plumber', location: 'Abuja', availability: true });
      professionalRepository.update.mockResolvedValue({ id: 'prof-1', userId, ...validData });

      const result = await professionalService.registerOrUpdateProfessionalProfile(userId, validData);

      expect(professionalRepository.update).toHaveBeenCalledWith('prof-1', validData);
      expect(result.profession).toBe('Electrician');
    });

    test('should reject when user not found', async () => {
      userRepository.findUserById.mockResolvedValue(null);

      await expect(professionalService.registerOrUpdateProfessionalProfile(userId, validData)).rejects.toThrow('User not found');
    });

    test('should validate required fields', async () => {
      userRepository.findUserById.mockResolvedValue(userWithOtherRole);

      await expect(professionalService.registerOrUpdateProfessionalProfile(userId, { profession: 'Plumber' })).rejects.toThrow('profession, location are required');
    });
  });

  describe('searchProfessionals', () => {
    test('should search by profession, location and availability', async () => {
      const filters = { profession: 'Electrician', location: 'Lagos', availability: true };
      professionalRepository.search.mockResolvedValue([{ id: 'prof-1' }]);

      const result = await professionalService.searchProfessionals(filters);

      expect(professionalRepository.search).toHaveBeenCalledWith(filters);
      expect(result).toEqual([{ id: 'prof-1' }]);
    });

    test('should allow partial filters', async () => {
      professionalRepository.search.mockResolvedValue([]);

      const result = await professionalService.searchProfessionals({ location: 'Abuja' });

      expect(professionalRepository.search).toHaveBeenCalledWith({ location: 'Abuja' });
      expect(result).toEqual([]);
    });
  });
});
