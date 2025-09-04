import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import nodemailer from 'nodemailer';

const mockSendMail = vi.fn().mockImplementation(() => Promise.resolve());
const mockVerify = vi.fn().mockImplementation(() => Promise.resolve());
const mockTransporter = {
    verify: mockVerify,
    sendMail: mockSendMail
};

vi.mock('nodemailer', () => ({
    default: {
        createTransport: vi.fn().mockImplementation(() => mockTransporter)
    }
}));

describe('Mail Service', () => {
    const mockEnv = {
        SMTP_HOST: 'smtp.example.com',
        SMTP_PORT: '587',
        SMTP_SECURE: 'false',
        SMTP_USER: 'test-user',
        SMTP_PASS: 'test-pass',
        SMTP_FROM: 'from@example.com',
        CONTACT_EMAIL: 'contact@example.com'
    };

    beforeEach(() => {
        vi.resetModules();
        process.env = { 
            ...mockEnv,
            NODE_ENV: 'test'
        };
        mockSendMail.mockClear();
        mockVerify.mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
        process.env = { NODE_ENV: 'test' };
    });

    describe('Environment Variables', () => {
        it('should throw error when required env vars are missing', async () => {
            process.env = { NODE_ENV: 'test' };
            await expect(import('@/lib/mail')).rejects.toThrow('Missing required environment variable');
        });

        it('should initialize with all required env vars', async () => {
            await expect(import('@/lib/mail')).resolves.toBeDefined();
        });
    });

    describe('SMTP Transport', () => {
        it('should create transport with correct config', async () => {
            await import('@/lib/mail');
            
            expect(nodemailer.createTransport).toHaveBeenCalledWith({
                host: mockEnv.SMTP_HOST,
                port: Number(mockEnv.SMTP_PORT),
                secure: false,
                auth: {
                    user: mockEnv.SMTP_USER,
                    pass: mockEnv.SMTP_PASS,
                },
                connectionTimeout: 5000,
                greetingTimeout: 5000,
                socketTimeout: 5000,
            });
        });

        it('should handle secure SMTP configuration', async () => {
            process.env.SMTP_SECURE = 'true';
            await import('@/lib/mail');
            
            expect(nodemailer.createTransport).toHaveBeenCalledWith(
                expect.objectContaining({
                    secure: true
                })
            );
        });
    });

    describe('sendContactEmail', () => {
        const mockEmail = {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'Test message content'
        };

        it('should send email with correct parameters', async () => {
            const { sendContactEmail } = await import('@/lib/mail');
            
            await sendContactEmail(
                mockEmail.name,
                mockEmail.email,
                mockEmail.subject,
                mockEmail.message
            );

            expect(mockSendMail).toHaveBeenCalledWith({
                from: mockEnv.SMTP_FROM,
                to: mockEnv.CONTACT_EMAIL,
                subject: expect.stringContaining(mockEmail.subject),
                text: expect.stringContaining(mockEmail.message),
                replyTo: mockEmail.email,
                headers: expect.objectContaining({
                    'X-Contact-Form': 'portfolio'
                })
            });
        });

        it('should truncate long subjects', async () => {
            const { sendContactEmail } = await import('@/lib/mail');
            const longSubject = 'a'.repeat(300);
            
            await sendContactEmail(
                mockEmail.name,
                mockEmail.email,
                longSubject,
                mockEmail.message
            );

            expect(mockSendMail).toHaveBeenCalledWith(
                expect.objectContaining({
                    subject: expect.stringMatching(/^.{1,255}$/)
                })
            );
        });

        it('should throw error when email sending fails', async () => {
            const { sendContactEmail } = await import('@/lib/mail');
            mockSendMail.mockRejectedValueOnce(new Error('SMTP error'));

            await expect(
                sendContactEmail(
                    mockEmail.name,
                    mockEmail.email,
                    mockEmail.subject,
                    mockEmail.message
                )
            ).rejects.toThrow('Failed to send email');
        });
    });

    describe('Error Handling', () => {
        it('should log SMTP connection errors without throwing', async () => {
            const consoleSpy = vi.spyOn(console, 'error');
            mockVerify.mockRejectedValueOnce(new Error('Connection failed'));

            await import('@/lib/mail');

            expect(consoleSpy).toHaveBeenCalledWith(
                'SMTP Connection Error:',
                expect.any(Error)
            );
        });

        it('should log email sending errors before throwing', async () => {
            const { sendContactEmail } = await import('@/lib/mail');
            const consoleSpy = vi.spyOn(console, 'error');
            mockSendMail.mockRejectedValueOnce(new Error('Send failed'));

            await expect(
                sendContactEmail('name', 'email', 'subject', 'message')
            ).rejects.toThrow();

            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to send contact email:',
                expect.any(Error)
            );
        });
    });
});
