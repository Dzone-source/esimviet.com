import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  planTitle: string;
  countryName: string;
  days: number;
  dataAmount: string;
  total: number;
  quantity: number;
}

export interface EsimDeliveryData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  planTitle: string;
  countryName: string;
  days: number;
  dataAmount: string;
  network: string;
  activationCode: string;
  manualCode?: string;
  qrImagePath?: string;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f7; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0070f3, #00a6ff); padding: 40px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 28px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; }
    .body { padding: 40px; }
    .order-badge { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; margin-bottom: 32px; text-align: center; }
    .order-number { font-size: 24px; font-weight: 700; color: #0070f3; letter-spacing: 2px; }
    .details { background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    .details h3 { margin: 0 0 16px; color: #1a1a2e; font-size: 16px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #6b7280; }
    .detail-value { font-weight: 600; color: #1a1a2e; }
    .total { font-size: 20px; font-weight: 700; color: #0070f3; }
    .notice { background: #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .notice p { margin: 0; color: #92400e; font-size: 14px; }
    .footer { text-align: center; padding: 24px 40px; background: #f9fafb; color: #6b7280; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Payment Successful!</h1>
      <p>Thank you for your order, ${data.customerName}</p>
    </div>
    <div class="body">
      <div class="order-badge">
        <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Order Number</div>
        <div class="order-number">${data.orderNumber}</div>
      </div>
      <div class="details">
        <h3>📱 Order Details</h3>
        <div class="detail-row">
          <span class="detail-label">Plan</span>
          <span class="detail-value">${data.planTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Country</span>
          <span class="detail-value">${data.countryName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Duration</span>
          <span class="detail-value">${data.days} days</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Data</span>
          <span class="detail-value">${data.dataAmount}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Quantity</span>
          <span class="detail-value">${data.quantity}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Total</span>
          <span class="detail-value total">$${data.total.toFixed(2)}</span>
        </div>
      </div>
      <div class="notice">
        <p>⏳ <strong>What's next?</strong> Our team is preparing your eSIM. You'll receive another email with your QR code and activation instructions shortly. This usually takes 1-24 hours.</p>
      </div>
    </div>
    <div class="footer">
      <p>Questions? Contact us at ${process.env.SMTP_USER || 'support@esimglobal.com'}</p>
      <p style="margin-top: 8px;">© 2024 eSIM Global. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || 'eSIM Store'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: data.customerEmail,
    subject: `Order Confirmed #${data.orderNumber} – Your eSIM is being prepared`,
    html,
  });

  logger.info(`Order confirmation email sent to ${data.customerEmail}`);
}

export async function sendEsimDeliveryEmail(data: EsimDeliveryData): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your eSIM is Ready</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f7; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #10b981, #059669); padding: 40px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 28px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; }
    .body { padding: 40px; }
    .qr-section { text-align: center; background: #f9fafb; border-radius: 16px; padding: 32px; margin-bottom: 32px; }
    .qr-section h3 { color: #1a1a2e; margin: 0 0 16px; }
    .qr-section img { max-width: 200px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .code-box { background: #1a1a2e; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .code-label { color: #9ca3af; font-size: 12px; margin-bottom: 8px; }
    .code-value { color: #60a5fa; font-family: monospace; font-size: 14px; word-break: break-all; line-height: 1.6; }
    .steps { margin-bottom: 32px; }
    .steps h3 { color: #1a1a2e; margin-bottom: 16px; }
    .step { display: flex; gap: 16px; margin-bottom: 16px; }
    .step-num { width: 32px; height: 32px; background: #0070f3; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; font-size: 14px; line-height: 32px; text-align: center; }
    .step-text { color: #374151; line-height: 1.6; padding-top: 4px; }
    .footer { text-align: center; padding: 24px 40px; background: #f9fafb; color: #6b7280; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Your eSIM is Ready!</h1>
      <p>Hi ${data.customerName}, your eSIM for ${data.countryName} is ready to activate</p>
    </div>
    <div class="body">
      <div class="qr-section">
        <h3>📷 Scan QR Code to Install</h3>
        ${data.qrImagePath ? `<img src="cid:qrcode" alt="QR Code" />` : '<p style="color:#6b7280">QR code will be attached</p>'}
      </div>

      <div class="code-box">
        <div class="code-label">ACTIVATION CODE</div>
        <div class="code-value">${data.activationCode}</div>
      </div>

      ${data.manualCode ? `
      <div class="code-box">
        <div class="code-label">MANUAL INSTALLATION CODE</div>
        <div class="code-value">${data.manualCode}</div>
      </div>
      ` : ''}

      <div class="steps">
        <h3>📱 How to Install Your eSIM</h3>
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text">Go to <strong>Settings → Mobile Data / Cellular</strong> on your device</div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-text">Tap <strong>Add eSIM</strong> or <strong>Add Data Plan</strong></div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-text">Scan the <strong>QR code</strong> above or enter the activation code manually</div>
        </div>
        <div class="step">
          <div class="step-num">4</div>
          <div class="step-text">Follow on-screen instructions to complete installation</div>
        </div>
        <div class="step">
          <div class="step-num">5</div>
          <div class="step-text">Your plan activates automatically when you arrive in <strong>${data.countryName}</strong></div>
        </div>
      </div>

      <div style="background:#f0fdf4;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0;color:#166534;font-size:14px;">
          ✅ <strong>Plan Details:</strong> ${data.planTitle} · ${data.days} days · ${data.dataAmount} data · ${data.network}
        </p>
      </div>
    </div>
    <div class="footer">
      <p>Need help? Contact us at ${process.env.SMTP_USER || 'support@esimglobal.com'}</p>
      <p style="margin-top: 8px;">© 2024 eSIM Global. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions: nodemailer.SendMailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'eSIM Store'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: data.customerEmail,
    subject: `Your eSIM for ${data.countryName} is Ready! Order #${data.orderNumber}`,
    html,
  };

  if (data.qrImagePath) {
    mailOptions.attachments = [
      {
        filename: 'qrcode.png',
        path: data.qrImagePath,
        cid: 'qrcode',
      },
    ];
  }

  await transporter.sendMail(mailOptions);
  logger.info(`eSIM delivery email sent to ${data.customerEmail}`);
}
