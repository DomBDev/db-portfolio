import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact | Portfolio",
  description: "Get in touch with me through this contact form.",
};

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold mb-4">Contact</h1>
        <p className="text-muted mb-8">
          Have a question or want to work together? Feel free to reach out using the form below.
        </p>
        
        <div className="bg-body rounded-lg p-6 shadow-sm border border-brand/10">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
