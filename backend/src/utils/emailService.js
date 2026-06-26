const nodemailer = require('nodemailer');

// Create reusable SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email using the configured transporter
 * @param {Object} options - { to, subject, html }
 * @returns {Promise} - Nodemailer send result
 */
const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: to || process.env.EMAIL_TO,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    throw error;
  }
};

/**
 * Build branded HTML email for Contact form submissions
 */
const buildContactEmailHTML = (name, email, brand, message) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0; padding:0; background-color:#0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a; padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#111111; border-radius:24px; overflow:hidden; border:1px solid rgba(255,255,255,0.06);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #e26a00, #ff8c00); padding:32px 40px;">
                <h1 style="margin:0; color:white; font-size:22px; font-weight:700; letter-spacing:0.5px;">
                  📩 New Contact Inquiry
                </h1>
                <p style="margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">
                  Someone wants to work with WhoInfluence
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  
                  <!-- Name -->
                  <tr>
                    <td style="padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                      <p style="margin:0 0 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#e26a00;">Full Name</p>
                      <p style="margin:0; font-size:16px; color:#e5e7eb;">${name}</p>
                    </td>
                  </tr>

                  <!-- Email -->
                  <tr>
                    <td style="padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                      <p style="margin:0 0 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#e26a00;">Email Address</p>
                      <p style="margin:0; font-size:16px;"><a href="mailto:${email}" style="color:#60a5fa; text-decoration:none;">${email}</a></p>
                    </td>
                  </tr>

                  <!-- Brand -->
                  <tr>
                    <td style="padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                      <p style="margin:0 0 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#e26a00;">Brand Name</p>
                      <p style="margin:0; font-size:16px; color:#e5e7eb;">${brand || 'Not provided'}</p>
                    </td>
                  </tr>

                  <!-- Message -->
                  <tr>
                    <td style="padding:12px 0;">
                      <p style="margin:0 0 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#e26a00;">Message</p>
                      <p style="margin:0; font-size:16px; color:#e5e7eb; line-height:1.6; white-space:pre-wrap;">${message}</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 40px 28px; border-top:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0; font-size:12px; color:#6b7280; text-align:center;">
                  This email was sent from the WhoInfluence website contact form.<br>
                  Respond directly to <a href="mailto:${email}" style="color:#e26a00; text-decoration:none;">${email}</a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

/**
 * Build branded HTML email for Influencer application submissions
 */
const buildInfluencerEmailHTML = (name, phone, email, socialLink, message) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0; padding:0; background-color:#0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a; padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#111111; border-radius:24px; overflow:hidden; border:1px solid rgba(255,255,255,0.06);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #7c3aed, #a855f7); padding:32px 40px;">
                <h1 style="margin:0; color:white; font-size:22px; font-weight:700; letter-spacing:0.5px;">
                  🌟 New Influencer Application
                </h1>
                <p style="margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">
                  A creator wants to join the WhoInfluence network
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0">

                  <!-- Name -->
                  <tr>
                    <td style="padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                      <p style="margin:0 0 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#a855f7;">Full Name</p>
                      <p style="margin:0; font-size:16px; color:#e5e7eb;">${name}</p>
                    </td>
                  </tr>

                  <!-- Phone -->
                  <tr>
                    <td style="padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                      <p style="margin:0 0 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#a855f7;">Phone Number</p>
                      <p style="margin:0; font-size:16px; color:#e5e7eb;">${phone}</p>
                    </td>
                  </tr>

                  <!-- Email -->
                  <tr>
                    <td style="padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                      <p style="margin:0 0 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#a855f7;">Email Address</p>
                      <p style="margin:0; font-size:16px;"><a href="mailto:${email}" style="color:#60a5fa; text-decoration:none;">${email}</a></p>
                    </td>
                  </tr>

                  <!-- Social Link -->
                  <tr>
                    <td style="padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                      <p style="margin:0 0 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#a855f7;">Social Media</p>
                      <p style="margin:0; font-size:16px;"><a href="${socialLink}" style="color:#60a5fa; text-decoration:none;" target="_blank">${socialLink}</a></p>
                    </td>
                  </tr>

                  <!-- Message -->
                  <tr>
                    <td style="padding:12px 0;">
                      <p style="margin:0 0 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#a855f7;">About Themselves</p>
                      <p style="margin:0; font-size:16px; color:#e5e7eb; line-height:1.6; white-space:pre-wrap;">${message || 'Not provided'}</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 40px 28px; border-top:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0; font-size:12px; color:#6b7280; text-align:center;">
                  This email was sent from the WhoInfluence influencer application form.<br>
                  Respond directly to <a href="mailto:${email}" style="color:#a855f7; text-decoration:none;">${email}</a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

module.exports = { sendMail, buildContactEmailHTML, buildInfluencerEmailHTML };
