const notificationRepository = require('../repositories/notificationRepository');
const professionalRepository = require('../repositories/professionalRepository');
const userRepository = require('../repositories/userRepository');
const emailService = require('./emailService');

const notifyBidAssignment = async ({ projectId, acceptedBidId, rejectedBidIds }) => {
  try {
    const project = await notificationRepository.getProjectWithBids(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (acceptedBidId) {
      const acceptedBid = project.bids.find(bid => bid.id === acceptedBidId);
      if (acceptedBid) {
        await notificationRepository.createNotification({
          userId: acceptedBid.contractorId,
          type: 'BID_ACCEPTED',
          title: 'Bid Accepted',
          message: `Your bid for project "${project.title}" has been accepted!`,
          projectId,
          bidId: acceptedBidId,
        });

        // Send email notification
        const contractor = await userRepository.findUserById(acceptedBid.contractorId);
        if (contractor) {
          await emailService.sendBidAcceptedEmail({
            userEmail: contractor.email,
            userName: contractor.name,
            projectTitle: project.title,
            projectId
          });
        }
      }
    }

    for (const bidId of rejectedBidIds) {
      const rejectedBid = project.bids.find(bid => bid.id === bidId);
      if (rejectedBid) {
        await notificationRepository.createNotification({
          userId: rejectedBid.contractorId,
          type: 'BID_REJECTED',
          title: 'Bid Not Selected',
          message: `Your bid for project "${project.title}" was not selected.`,
          projectId,
          bidId,
        });

        // Send email notification
        const contractor = await userRepository.findUserById(rejectedBid.contractorId);
        if (contractor) {
          await emailService.sendBidRejectedEmail({
            userEmail: contractor.email,
            userName: contractor.name,
            projectTitle: project.title,
            projectId
          });
        }
      }
    }

    await notificationRepository.createNotification({
      userId: project.ownerId,
      type: 'PROJECT_ASSIGNED',
      title: 'Project Assigned',
      message: `Your project "${project.title}" has been assigned to a contractor.`,
      projectId,
    });

    // Send email notification to homeowner
    const homeowner = await userRepository.findUserById(project.ownerId);
    if (homeowner) {
      await emailService.sendProjectAssignedEmail({
        userEmail: homeowner.email,
        userName: homeowner.name,
        projectTitle: project.title,
        projectId
      });
    }

  } catch (error) {
    throw error;
  }
};

const notifyProjectStatusChange = async ({ projectId, newStatus, userId }) => {
  try {
    const project = await notificationRepository.getProjectById(projectId);
    if (!project) return;

    const statusMessages = {
      'OPEN_FOR_BIDS': 'Your project is now open for contractor bids.',
      'ACTIVE': 'Your project is now active and work has begun.',
      'COMPLETED': 'Your project has been marked as completed.',
      'CANCELLED': 'Your project has been cancelled.',
    };

    const message = statusMessages[newStatus];
    if (message) {
      await notificationRepository.createNotification({
        userId,
        type: 'PROJECT_STATUS_CHANGED',
        title: `Project ${newStatus.toLowerCase().replace(/_/g, ' ')}`,
        message,
        projectId,
      });

      // Send email notification
      const user = await userRepository.findUserById(userId);
      if (user) {
        await emailService.sendProjectStatusChangeEmail({
          userEmail: user.email,
          userName: user.name,
          projectTitle: project.title,
          newStatus,
          projectId
        });
      }
    }
  } catch (error) {
    throw error;
  }
};

const getUserNotifications = async (userId, { limit = 20, offset = 0, unreadOnly = false } = {}) => {
  try {
    return await notificationRepository.getUserNotifications(userId, { limit, offset, unreadOnly });
  } catch (error) {
    throw new Error('Failed to get notifications');
  }
};

const markNotificationAsRead = async (notificationId, userId) => {
  try {
    return await notificationRepository.markAsRead(notificationId, userId);
  } catch (error) {
    throw new Error('Failed to mark notification as read');
  }
};

const markAllNotificationsAsRead = async (userId) => {
  try {
    return await notificationRepository.markAllAsRead(userId);
  } catch (error) {
    throw new Error('Failed to mark all notifications as read');
  }
};

const notifyJobApplicationReceived = async ({ contractorId, jobId, professionalId }) => {
  await notificationRepository.createNotification({
    userId: contractorId,
    type: 'JOB_APPLICATION_RECEIVED',
    title: 'New Job Application',
    message: `A professional applied to your job.`,
    jobId,
  });

  // Send email notification to contractor
  const contractor = await userRepository.findUserById(contractorId);
  if (contractor) {
    const job = await require('../repositories/contractorJobRepository').findById(jobId);
    if (job) {
      await emailService.sendJobApplicationReceivedEmail({
        userEmail: contractor.email,
        userName: contractor.name,
        jobTitle: job.title,
        jobId
      });
    }
  }
};

const notifyJobApplicationDecision = async ({ professionalId, jobId, decision }) => {
  const professional = await professionalRepository.findById(professionalId);
  if (!professional) {
    throw new Error('Professional not found');
  }
  
  const isApproved = decision === 'APPROVED';
  await notificationRepository.createNotification({
    userId: professional.userId,
    type: isApproved ? 'JOB_APPLICATION_APPROVED' : 'JOB_APPLICATION_REJECTED',
    title: isApproved ? 'Application Approved' : 'Application Rejected',
    message: isApproved ? 'Your application was approved.' : 'Your application was rejected.',
    jobId,
  });

  // Send email notification to professional
  const user = await userRepository.findUserById(professional.userId);
  if (user) {
    const job = await require('../repositories/contractorJobRepository').findById(jobId);
    if (job) {
      await emailService.sendJobApplicationDecisionEmail({
        userEmail: user.email,
        userName: user.name,
        jobTitle: job.title,
        decision,
        jobId
      });
    }
  }
};

module.exports = {
  notifyBidAssignment,
  notifyProjectStatusChange,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  notifyJobApplicationReceived,
  notifyJobApplicationDecision,
};