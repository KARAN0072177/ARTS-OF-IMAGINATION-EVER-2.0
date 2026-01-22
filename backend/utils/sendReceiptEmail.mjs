import nodemailer from "nodemailer";

export const sendReceiptEmail = async ({
  email,
  name,
  amount,
  currency,
  brand,
  last4,
  receiptUrl,
  paymentId,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const formattedAmount = (amount / 100).toFixed(2);
  const formattedDate = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const info = await transporter.sendMail({
    from: `"ARTS OF IMAGINATION EVER" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🧾 Your Gallery Premium Payment Receipt",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
        <h2 style="color: #4CAF50;">Thank you for your purchase, ${name}!</h2>
        <p>We’ve received your payment and your premium features are now unlocked. Below are the details of your transaction:</p>

        <hr style="margin: 20px 0;" />

        <h3>🧾 Payment Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td><strong>Transaction ID:</strong></td><td>${paymentId}</td></tr>
          <tr><td><strong>Amount Paid:</strong></td><td>${formattedAmount} ${currency.toUpperCase()}</td></tr>
          <tr><td><strong>Date & Time:</strong></td><td>${formattedDate}</td></tr>
          <tr><td><strong>Card Used:</strong></td><td>${brand.toUpperCase()} •••• ${last4}</td></tr>
        </table>

        <hr style="margin: 20px 0;" />

        <h3>📄 Receipt Links</h3>
        <p>You can view or download your official receipt from Stripe using the buttons below:</p>
        <a href="${receiptUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-right: 10px;">
          View Receipt
        </a>
        <a href="${receiptUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px;">
          Download as PDF
        </a>

        <p style="margin-top: 30px;">If you have any questions or need support, just reply to this email. We’re here to help.</p>

        <p style="margin-top: 40px; font-size: 12px; color: #888;">
          ARTS OF IMAGINATION EVER • Your Trusted Image Hub<br/>
          This is an automated receipt. Please keep it for your records.
        </p>
      </div>
    `,
  });

  console.log("📧 Receipt sent:", info.messageId);
};