const nodemailer = require('nodemailer');

// Check if we're in test mode
const isTestMode = process.env.NODE_ENV === 'test';

let transporter;

if (isTestMode) {
  // Mock transporter for testing
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('📧 [TEST MODE] Email would be sent:', {
        to: mailOptions.to,
        subject: mailOptions.subject,
        from: mailOptions.from
      });
      return { messageId: 'test-message-id' };
    }
  };
} else {
  // Real transporter for production
  transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

const sendBidAcceptedEmail = async ({ userEmail, userName, projectTitle, projectId }) => {
  const subject = '🎉 Your Bid Has Been Accepted!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">Congratulations, ${userName}!</h2>
      <p>Your bid for the project <strong>"${projectTitle}"</strong> has been accepted!</p>
      <p>This is a great opportunity to showcase your skills and deliver excellent results.</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Next Steps:</h3>
        <ul>
          <li>Review the project requirements</li>
          <li>Contact the homeowner to discuss project details</li>
          <li>Begin planning your work schedule</li>
          <li>Keep the homeowner updated on progress</li>
        </ul>
      </div>
      <p>If you have any questions, please don't hesitate to reach out.</p>
      <p>Best regards,<br>The Construction Tech Team</p>
    </div>
  `;
  const text = `Congratulations ${userName}! Your bid for "${projectTitle}" has been accepted.`;

  return await sendEmail({ to: userEmail, subject, html, text });
};

const sendBidRejectedEmail = async ({ userEmail, userName, projectTitle, projectId }) => {
  const subject = 'Update on Your Bid Application';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6c757d;">Hello ${userName},</h2>
      <p>Thank you for your interest in the project <strong>"${projectTitle}"</strong>.</p>
      <p>After careful consideration, we regret to inform you that your bid was not selected for this project.</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Don't be discouraged:</h3>
        <ul>
          <li>There are many other opportunities available</li>
          <li>Keep improving your skills and portfolio</li>
          <li>Consider adjusting your pricing strategy</li>
          <li>Network with other professionals in the industry</li>
        </ul>
      </div>
      <p>We encourage you to continue bidding on other projects that match your expertise.</p>
      <p>Best regards,<br>The Construction Tech Team</p>
    </div>
  `;
  const text = `Hello ${userName}, your bid for "${projectTitle}" was not selected.`;

  return await sendEmail({ to: userEmail, subject, html, text });
};

const sendProjectAssignedEmail = async ({ userEmail, userName, projectTitle, projectId }) => {
  const subject = '🏗️ Your Project Has Been Assigned!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #007bff;">Great News, ${userName}!</h2>
      <p>Your project <strong>"${projectTitle}"</strong> has been successfully assigned to a qualified contractor!</p>
      <p>This means your project is now moving forward and work will begin soon.</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>What happens next:</h3>
        <ul>
          <li>The contractor will contact you to discuss project details</li>
          <li>You'll receive regular updates on project progress</li>
          <li>Milestones will be tracked and communicated</li>
          <li>Payment will be processed according to the agreed terms</li>
        </ul>
      </div>
      <p>If you have any questions or concerns, please don't hesitate to reach out to our support team.</p>
      <p>Best regards,<br>The Construction Tech Team</p>
    </div>
  `;
  const text = `Great news ${userName}! Your project "${projectTitle}" has been assigned to a contractor.`;

  return await sendEmail({ to: userEmail, subject, html, text });
};

const sendProjectStatusChangeEmail = async ({ userEmail, userName, projectTitle, newStatus, projectId }) => {
  const statusMessages = {
    'OPEN_FOR_BIDS': 'Your project is now open for contractor bids.',
    'ACTIVE': 'Your project is now active and work has begun.',
    'COMPLETED': 'Your project has been marked as completed.',
    'CANCELLED': 'Your project has been cancelled.'
  };

  const statusEmojis = {
    'OPEN_FOR_BIDS': '📢',
    'ACTIVE': '🚀',
    'COMPLETED': '✅',
    'CANCELLED': '❌'
  };

  const subject = `${statusEmojis[newStatus]} Project Status Update: ${newStatus.replace(/_/g, ' ')}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #007bff;">Project Status Update</h2>
      <p>Hello ${userName},</p>
      <p>The status of your project <strong>"${projectTitle}"</strong> has been updated to: <strong>${newStatus.replace(/_/g, ' ')}</strong></p>
      <p>${statusMessages[newStatus]}</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Current Status: ${newStatus.replace(/_/g, ' ')}</h3>
        <p>${statusMessages[newStatus]}</p>
      </div>
      <p>You can view the latest updates and progress in your project dashboard.</p>
      <p>Best regards,<br>The Construction Tech Team</p>
    </div>
  `;
  const text = `Hello ${userName}, your project "${projectTitle}" status has been updated to ${newStatus.replace(/_/g, ' ')}.`;

  return await sendEmail({ to: userEmail, subject, html, text });
};

const sendJobApplicationReceivedEmail = async ({ userEmail, userName, jobTitle, jobId }) => {
  const subject = '📝 New Job Application Received';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #007bff;">New Application Alert!</h2>
      <p>Hello ${userName},</p>
      <p>You have received a new job application for: <strong>"${jobTitle}"</strong></p>
      <p>A qualified professional is interested in working on your project!</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>What to do next:</h3>
        <ul>
          <li>Review the application details</li>
          <li>Check the professional's profile and experience</li>
          <li>Review their proposed rate and timeline</li>
          <li>Make a decision: Approve or Reject</li>
        </ul>
      </div>
      <p>Log into your dashboard to review and respond to this application.</p>
      <p>Best regards,<br>The Construction Tech Team</p>
    </div>
  `;
  const text = `Hello ${userName}, you have received a new job application for "${jobTitle}".`;

  return await sendEmail({ to: userEmail, subject, html, text });
};

const sendJobApplicationDecisionEmail = async ({ userEmail, userName, jobTitle, decision, jobId }) => {
  const isApproved = decision === 'APPROVED';
  const subject = isApproved ? '🎉 Your Job Application Was Approved!' : 'Update on Your Job Application';
  const decisionText = isApproved ? 'approved' : 'not selected';
  const color = isApproved ? '#28a745' : '#6c757d';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${color};">${isApproved ? 'Congratulations!' : 'Application Update'}</h2>
      <p>Hello ${userName},</p>
      <p>Your job application for <strong>"${jobTitle}"</strong> has been <strong>${decisionText}</strong>.</p>
      ${isApproved ? `
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Next Steps:</h3>
          <ul>
            <li>Contact the contractor to discuss project details</li>
            <li>Confirm your availability and timeline</li>
            <li>Discuss payment terms and milestones</li>
            <li>Begin planning your work schedule</li>
          </ul>
        </div>
      ` : `
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Keep Going:</h3>
          <ul>
            <li>There are many other opportunities available</li>
            <li>Continue improving your skills</li>
            <li>Consider adjusting your approach</li>
            <li>Network with other contractors</li>
          </ul>
        </div>
      `}
      <p>${isApproved ? 'We wish you success with this project!' : 'We encourage you to keep applying to other jobs.'}</p>
      <p>Best regards,<br>The Construction Tech Team</p>
    </div>
  `;
  const text = `Hello ${userName}, your job application for "${jobTitle}" has been ${decisionText}.`;

  return await sendEmail({ to: userEmail, subject, html, text });
};

module.exports = {
  sendEmail,
  sendBidAcceptedEmail,
  sendBidRejectedEmail,
  sendProjectAssignedEmail,
  sendProjectStatusChangeEmail,
  sendJobApplicationReceivedEmail,
  sendJobApplicationDecisionEmail
};
