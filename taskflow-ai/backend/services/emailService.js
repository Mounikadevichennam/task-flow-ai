const nodemailer = require('nodemailer');

// Helper to create Nodemailer transporter
const createTransporter = async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Fallback to Ethereal Test Account if credentials are not specified in environment
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

/**
 * Send branded HTML reminder email to registered student
 */
 sendReminderEmail = async ({ toEmail, studentName, reminderTitle, subjectName, dueDate, priority, reminderType }) => {
  try {
    const transporter = await createTransporter();
    
try {
  await transporter.verify();
  console.log("✅ SMTP Connected Successfully");
} catch (err) {
  console.error("[Email Service] Full Error:", err);
  throw err;
}

    // Format date specifically in Asia/Kolkata IST timezone matching user local selection
    const formattedDate = new Date(dueDate).toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const priorityColor =
      priority === 'High' ? '#ef4444' : priority === 'Medium' ? '#f59e0b' : '#10b981';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: #2563eb; padding: 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
          .header p { margin: 4px 0 0 0; opacity: 0.9; font-size: 13px; }
          .content { padding: 32px 24px; }
          .greeting { font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #0f172a; }
          .task-card { background: #f8fafc; border-left: 4px solid #2563eb; border-radius: 8px; padding: 20px; margin: 20px 0; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
          .task-title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0; }
          .detail-row { font-size: 14px; color: #64748b; margin-bottom: 6px; display: flex; justify-content: space-between; }
          .priority-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; color: #ffffff; background-color: ${priorityColor}; }
          .motivation { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-top: 24px; font-size: 14px; color: #1e40af; line-height: 1.5; }
          .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TaskFlow AI</h1>
            <p>Academic Deadline & Priority Management Engine</p>
          </div>
          
          <div class="content">
            <div class="greeting">Hello ${studentName || 'Student'}, 👋</div>
            <p style="font-size: 14px; color: #475569; margin: 0 0 16px 0;">
              This is an automated reminder notification from TaskFlow AI for your upcoming coursework deadline:
            </p>

            <div class="task-card">
              <div class="task-title">${reminderTitle}</div>
              <div style="margin-bottom: 12px;">
                <span class="priority-badge">${priority || 'Normal'} Priority</span>
                <span style="font-size: 12px; color: #64748b; margin-left: 8px;">Type: ${reminderType || 'Deadline'}</span>
              </div>
              <div class="detail-row"><strong>Course / Subject:</strong> ${subjectName || 'General Academic'}</div>
              <div class="detail-row"><strong>Due Date & Time:</strong> ${formattedDate} (IST)</div>
            </div>

            <div class="motivation">
              💡 <strong>TaskFlow AI Tip:</strong> Staying ahead of your deadlines reduces exam stress and maximizes GPA performance. Take 15 minutes right now to organize your submission!
            </div>
          </div>

          <div class="footer">
            &copy; 2026 TaskFlow AI &bull; Automated Academic Alert Engine &bull; Department of Computer Science & Engineering
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"TaskFlow AI Alerts" <alerts@taskflow.ai>',
      to: toEmail,
      subject: `⏰ TaskFlow AI Reminder: ${reminderTitle} (${subjectName || 'Coursework'})`,
      html: htmlContent
    });

    console.log(`[Email Service] Notification sent to ${toEmail}. Message ID: ${info.messageId}`);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`[Email Service] Test Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("[Email Service]  Full Error:", err);
    throw err;
  }
};

module.exports = {
  sendReminderEmail
};
