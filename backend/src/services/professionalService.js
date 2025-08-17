const professionalRepository = require('../repositories/professionalRepository');
const userRepository = require('../repositories/userRepository');

const registerOrUpdateProfessionalProfile = async (userId, data) => {
	const user = await userRepository.findUserById(userId);
	if (!user) {
		throw new Error('User not found');
	}

	const { profession, location, availability, hourlyRate, experience, skills, bio } = data || {};
	if (!profession || !location) {
		throw new Error('profession, location are required');
	}

	const payload = {
		profession: String(profession).trim(),
		location: String(location).trim(),
		availability: availability !== undefined ? Boolean(availability) : true,
		hourlyRate: hourlyRate !== undefined ? Number(hourlyRate) : undefined,
		experience: experience !== undefined ? Number(experience) : undefined,
		skills: Array.isArray(skills) ? skills : [],
		bio: bio || undefined
	};

	const existing = await professionalRepository.findByUserId(userId);
	if (existing) {
		return await professionalRepository.update(existing.id, payload);
	}
	return await professionalRepository.create({ userId, ...payload });
};

const searchProfessionals = async (filters) => {
	const { profession, location, availability } = filters || {};
	const clean = {};
	if (profession) clean.profession = profession;
	if (location) clean.location = location;
	if (availability !== undefined) clean.availability = Boolean(availability);
	return await professionalRepository.search(clean);
};

module.exports = {
	registerOrUpdateProfessionalProfile,
	searchProfessionals
};
