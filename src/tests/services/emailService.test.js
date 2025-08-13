const emailService = require('../../services/emailService');

describe('Email Service', () => {
  beforeEach(() => {
    // Set test environment
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    // Reset environment
    delete process.env.NODE_ENV;
  });

  describe('sendEmail', () => {
    test('should send email in test mode', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await emailService.sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
        text: 'Test text'
      });

      expect(result).toHaveProperty('messageId', 'test-message-id');
      expect(consoleSpy).toHaveBeenCalledWith(
        '📧 [TEST MODE] Email would be sent:',
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Test Subject'
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('sendBidAcceptedEmail', () => {
    test('should send bid accepted email', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await emailService.sendBidAcceptedEmail({
        userEmail: 'contractor@example.com',
        userName: 'John Contractor',
        projectTitle: 'Kitchen Renovation',
        projectId: 'project-1'
      });

      expect(result).toHaveProperty('messageId', 'test-message-id');
      expect(consoleSpy).toHaveBeenCalledWith(
        '📧 [TEST MODE] Email would be sent:',
        expect.objectContaining({
          to: 'contractor@example.com',
          subject: '🎉 Your Bid Has Been Accepted!'
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('sendBidRejectedEmail', () => {
    test('should send bid rejected email', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await emailService.sendBidRejectedEmail({
        userEmail: 'contractor@example.com',
        userName: 'John Contractor',
        projectTitle: 'Kitchen Renovation',
        projectId: 'project-1'
      });

      expect(result).toHaveProperty('messageId', 'test-message-id');
      expect(consoleSpy).toHaveBeenCalledWith(
        '📧 [TEST MODE] Email would be sent:',
        expect.objectContaining({
          to: 'contractor@example.com',
          subject: 'Update on Your Bid Application'
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('sendProjectAssignedEmail', () => {
    test('should send project assigned email', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await emailService.sendProjectAssignedEmail({
        userEmail: 'homeowner@example.com',
        userName: 'Mary Homeowner',
        projectTitle: 'Kitchen Renovation',
        projectId: 'project-1'
      });

      expect(result).toHaveProperty('messageId', 'test-message-id');
      expect(consoleSpy).toHaveBeenCalledWith(
        '📧 [TEST MODE] Email would be sent:',
        expect.objectContaining({
          to: 'homeowner@example.com',
          subject: '🏗️ Your Project Has Been Assigned!'
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('sendProjectStatusChangeEmail', () => {
    test('should send OPEN_FOR_BIDS status email', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await emailService.sendProjectStatusChangeEmail({
        userEmail: 'homeowner@example.com',
        userName: 'Mary Homeowner',
        projectTitle: 'Kitchen Renovation',
        newStatus: 'OPEN_FOR_BIDS',
        projectId: 'project-1'
      });

      expect(result).toHaveProperty('messageId', 'test-message-id');
      expect(consoleSpy).toHaveBeenCalledWith(
        '📧 [TEST MODE] Email would be sent:',
        expect.objectContaining({
          to: 'homeowner@example.com',
          subject: '📢 Project Status Update: OPEN FOR BIDS'
        })
      );

      consoleSpy.mockRestore();
    });

    test('should send ACTIVE status email', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await emailService.sendProjectStatusChangeEmail({
        userEmail: 'homeowner@example.com',
        userName: 'Mary Homeowner',
        projectTitle: 'Kitchen Renovation',
        newStatus: 'ACTIVE',
        projectId: 'project-1'
      });

      expect(result).toHaveProperty('messageId', 'test-message-id');
      expect(consoleSpy).toHaveBeenCalledWith(
        '📧 [TEST MODE] Email would be sent:',
        expect.objectContaining({
          to: 'homeowner@example.com',
          subject: '🚀 Project Status Update: ACTIVE'
        })
      );

      consoleSpy.mockRestore();
    });

    test('should send COMPLETED status email', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await emailService.sendProjectStatusChangeEmail({
        userEmail: 'homeowner@example.com',
        userName: 'Mary Homeowner',
        projectTitle: 'Kitchen Renovation',
        newStatus: 'COMPLETED',
        projectId: 'project-1'
      });

      expect(result).toHaveProperty('messageId', 'test-message-id');
      expect(consoleSpy).toHaveBeenCalledWith(
        '📧 [TEST MODE] Email would be sent:',
        expect.objectContaining({
          to: 'homeowner@example.com',
          subject: '✅ Project Status Update: COMPLETED'
        })
      );

      consoleSpy.mockRestore();
    });

    test('should send CANCELLED status email', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await emailService.sendProjectStatusChangeEmail({
        userEmail: 'homeowner@example.com',
        userName: 'Mary Homeowner',
        projectTitle: 'Kitchen Renovation',
        newStatus: 'CANCELLED',
        projectId: 'project-1'
      });

      expect(result).toHaveProperty('messageId', 'test-message-id');
      expect(consoleSpy).toHaveBeenCalledWith(
        '📧 [TEST MODE] Email would be sent:',
        expect.objectContaining({
          to: 'homeowner@example.com',
          subject: '❌ Project Status Update: CANCELLED'
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('sendJobApplicationReceivedEmail', () => {
    test('should send job application received email', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await emailService.sendJobApplicationReceivedEmail({
        userEmail: 'contractor@example.com',
        userName: 'John Contractor',
        jobTitle: 'Electrical Installation',
        jobId: 'job-1'
      });

      expect(result).toHaveProperty('messageId', 'test-message-id');
      expect(consoleSpy).toHaveBeenCalledWith(
        '📧 [TEST MODE] Email would be sent:',
        expect.objectContaining({
          to: 'contractor@example.com',
          subject: '📝 New Job Application Received'
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('sendJobApplicationDecisionEmail', () => {
    test('should send approved application email', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await emailService.sendJobApplicationDecisionEmail({
        userEmail: 'professional@example.com',
        userName: 'Jane Professional',
        jobTitle: 'Electrical Installation',
        decision: 'APPROVED',
        jobId: 'job-1'
      });

      expect(result).toHaveProperty('messageId', 'test-message-id');
      expect(consoleSpy).toHaveBeenCalledWith(
        '📧 [TEST MODE] Email would be sent:',
        expect.objectContaining({
          to: 'professional@example.com',
          subject: '🎉 Your Job Application Was Approved!'
        })
      );

      consoleSpy.mockRestore();
    });

    test('should send rejected application email', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await emailService.sendJobApplicationDecisionEmail({
        userEmail: 'professional@example.com',
        userName: 'Jane Professional',
        jobTitle: 'Electrical Installation',
        decision: 'REJECTED',
        jobId: 'job-1'
      });

      expect(result).toHaveProperty('messageId', 'test-message-id');
      expect(consoleSpy).toHaveBeenCalledWith(
        '📧 [TEST MODE] Email would be sent:',
        expect.objectContaining({
          to: 'professional@example.com',
          subject: 'Update on Your Job Application'
        })
      );

      consoleSpy.mockRestore();
    });
  });
});
