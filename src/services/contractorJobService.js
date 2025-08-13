const contractorJobRepository = require('../repositories/contractorJobRepository');
const jobApplicationRepository = require('../repositories/jobApplicationRepository');
const userRepository = require('../repositories/userRepository');
const professionalRepository = require('../repositories/professionalRepository');
const notificationService = require('../services/notificationService');

const postJob = async (contractorId, data) => {
	const contractor = await userRepository.findUserById(contractorId);
	if (!contractor || !contractor.roles.includes('CONTRACTOR')) {
		throw new Error('Only contractors can post jobs');
	}

	const required = ['title', 'description', 'location', 'budget', 'requiredProfession', 'estimatedDuration', 'startDate', 'endDate'];
	for (const field of required) {
		if (data[field] === undefined || data[field] === null || data[field] === '') {
			throw new Error('Missing required fields');
		}
	}

	const payload = {
		contractorId,
		title: data.title.trim(),
		description: data.description.trim(),
		location: data.location.trim(),
		budget: Number(data.budget),
		requiredProfession: data.requiredProfession.trim(),
		estimatedDuration: Number(data.estimatedDuration),
		startDate: new Date(data.startDate),
		endDate: new Date(data.endDate)
	};

	return await contractorJobRepository.create(payload);
};

const applyForJob = async ({ jobId, professionalId, coverLetter, proposedRate, estimatedStartDate, estimatedEndDate }) => {
	const job = await contractorJobRepository.findById(jobId);
	if (!job || job.status !== 'OPEN') {
		throw new Error('Job not open for applications');
	}

	const existing = await jobApplicationRepository.findByJobAndProfessional(jobId, professionalId);
	if (existing) {
		throw new Error('Already applied');
	}

	const professional = await professionalRepository.findById(professionalId);
	if (!professional) {
		throw new Error('Professional not found');
	}

	const application = await jobApplicationRepository.create({
		jobId,
		professionalId,
		contractorId: job.contractorId,
		coverLetter: coverLetter || '',
		proposedRate: Number(proposedRate),
		estimatedStartDate: new Date(estimatedStartDate),
		estimatedEndDate: new Date(estimatedEndDate)
	});

	await notificationService.notifyJobApplicationReceived({ contractorId: job.contractorId, jobId, professionalId });
	return application;
};

const decideOnApplication = async ({ applicationId, contractorId, decision }) => {
	const application = await jobApplicationRepository.findById(applicationId);
	if (!application) {
		throw new Error('Application not found');
	}
	if (application.contractorId !== contractorId) {
		throw new Error('Not authorized');
	}
	if (!['APPROVED', 'REJECTED'].includes(decision)) {
		throw new Error('Invalid decision');
	}
	const updated = await jobApplicationRepository.updateStatus(applicationId, decision);
	await notificationService.notifyJobApplicationDecision({ professionalId: application.professionalId, jobId: application.jobId, decision });
	return updated;
};

module.exports = {
	postJob,
	applyForJob,
	decideOnApplication
};
