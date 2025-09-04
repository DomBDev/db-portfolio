import nodemailer from 'nodemailer';

const requiredEnvVars = [
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM',
    'CONTACT_EMAIL'
] as const;

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },

    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
});

try {
    await transporter.verify();
} catch (error) {
    console.error('SMTP Connection Error:', error);
}

export async function sendContactEmail(
    name: string,
    email: string,
    subject: string,
    message: string
): Promise<void> {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: process.env.CONTACT_EMAIL,
            subject: `Portfolio Contact: ${subject}`.slice(0, 255),
            text: `New contact form submission:

From: ${name}
Email: ${email}

Message:
${message}`,
            replyTo: email,
            
            headers: {
                'X-Contact-Form': 'portfolio',
                'X-Sender-IP': 'redacted',
            }
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Failed to send contact email:', error);
        throw new Error('Failed to send email');
    }
}