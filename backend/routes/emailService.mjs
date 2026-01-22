import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send a payment receipt email
export const sendReceiptEmail = (email, username, amount, currency, receipt_url) => {
  const formattedDate = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const mailOptions = {
    from: `"Premium Access" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '✨ Your Premium Access Payment Receipt',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
          body { font-family: 'Poppins', Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 0; }
          .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
          .email-header { background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%); padding: 40px 20px; text-align: center; color: white; }
          .email-body { padding: 30px; color: #4a5568; }
          .email-footer { padding: 20px; text-align: center; background: #f8fafc; color: #718096; font-size: 12px; }
          h1 { color: white; margin: 0; font-size: 28px; }
          h2 { color: #2d3748; margin-top: 0; }
          .divider { height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin: 25px 0; }
          .receipt-card { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .receipt-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .receipt-label { color: #718096; }
          .receipt-value { color: #2d3748; font-weight: 600; }
          .btn { display: inline-block; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 10px 10px 0 0; transition: all 0.3s ease; }
          .btn-primary { background: #6e8efb; color: white; }
          .btn-primary:hover { background: #5a7df4; }
          .thank-you { text-align: center; margin: 30px 0; }
          .thank-you-icon { font-size: 48px; margin-bottom: 15px; display: inline-block; }
          .highlight-box { background: #f0f4ff; border-left: 4px solid #6e8efb; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Premium Access Activated</h1>
            <p>Thank you for joining our premium community!</p>
          </div>
          
          <div class="email-body">
            <div class="thank-you">
              <div class="thank-you-icon">🎉</div>
              <h2>Welcome to team AOIE, ${username}!</h2>
              <p>Your payment was successful and your premium features are now unlocked.</p>
            </div>
            
            <div class="receipt-card">
              <div class="receipt-row">
                <span class="receipt-label">Amount Paid:</span>
                <span class="receipt-value">${amount} ${currency.toUpperCase()}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Date & Time:</span>
                <span class="receipt-value">${formattedDate}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Status:</span>
                <span class="receipt-value" style="color: #48bb78;">Completed</span>
              </div>
            </div>
            
            <div class="highlight-box">
              <p><strong>Your receipt is ready!</strong> You can view or download it using the link below:</p>
              <a href="${receipt_url}" class="btn btn-primary">View Full Receipt</a>
            </div>
            
            <div class="divider"></div>
            
            <div>
              <h2>What's next?</h2>
              <p>You now have access to all premium features. Here's what you can do:</p>
              <ul>
                <li>Enjoy all Premium Images</li>
                <li>Access exclusive badge on Profile</li>
                <li>Download high-quality Premium Images upto 8k</li>
                <li>Get priority support</li>
              </ul>
              <p>Thanks for your support. #TEAM AOIE</p>
            </div>
          </div>
          
          <div class="email-footer">
            <p>© ${new Date().getFullYear()} Premium Access. All rights reserved.</p>
            <p>This is an automated message - please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  console.log('Sending premium receipt to:', email);

  return transporter.sendMail(mailOptions)
    .then((info) => {
      console.log('Email sent successfully:', info.response);
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
};

// Send a test email to confirm if the email service is working
export const sendTestEmail = () => {
  const mailOptions = {
    from: `"Premium Access" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: 'Test Email - Premium Access Service',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #6e8efb; text-align: center;">Premium Access Service Test</h2>
        <p>This test email confirms that your email service is working correctly.</p>
        <p style="text-align: center; margin-top: 30px;">
          <span style="font-size: 24px;">✅</span>
        </p>
        <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
          System time: ${new Date().toString()}
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions)
    .then((info) => {
      console.log('Test email sent:', info.response);
    })
    .catch((error) => {
      console.error('Test email error:', error);
    });
};