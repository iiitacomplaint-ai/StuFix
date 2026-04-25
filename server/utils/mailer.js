const Brevo = require('@getbrevo/brevo');

const client = Brevo.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const sendEmail = async ({ to, subject, html, name = '' }) => {
  const apiInstance = new Brevo.TransactionalEmailsApi();

  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.sender = {
    name: process.env.BREVO_FROM_NAME || 'StuFix',
    email: process.env.BREVO_FROM_EMAIL || 'iiitacomplaint@gmail.com'
  };
  sendSmtpEmail.to = [{ email: to, name }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;

  const info = await apiInstance.sendTransacEmail(sendSmtpEmail);
  console.log('✅ Email sent via Brevo API:', info.messageId);
  return info;
};

module.exports = sendEmail;