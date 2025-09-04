import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/mail";
import sanitizeHtml from "sanitize-html";

const bodySchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters")
        .trim(),
    email: z.string()
        .min(1, "Email is required")
        .max(254, "Email must be less than 254 characters")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
        .trim()
        .toLowerCase(),
    subject: z.string()
        .min(1, "Subject is required")
        .max(200, "Subject must be less than 200 characters")
        .trim(),
    message: z.string()
        .min(10, "Message must be at least 10 characters")
        .max(5000, "Message must be less than 5000 characters")
        .trim(),
    honeypot: z.string().optional(),
}).strict();

export async function POST(req: NextRequest) {
    try {
        if (req.method !== 'POST') {
            return NextResponse.json(
                { error: "Method not allowed" },
                { status: 405 }
            );
        }

        const body = await req.json().catch(() => ({}));
        const result = bodySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { 
                    error: "Validation failed",
                    issues: result.error.issues 
                },
                { status: 400 }
            );
        }

        const { name, email, subject, message, honeypot } = result.data;

        if (honeypot) {
            return NextResponse.json(
                { error: "Form submission rejected" },
                { status: 400 }
            );
        }

        const sanitizedMessage = sanitizeHtml(message, {
            allowedTags: [],
            allowedAttributes: {},
            disallowedTagsMode: 'discard'
        });

        await sendContactEmail(
            name,
            email,
            subject,
            sanitizedMessage
        );

        return NextResponse.json(
            { message: "Message sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}
