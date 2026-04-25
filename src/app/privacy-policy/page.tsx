import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — DailyByteNews',
  description: 'How DailyByteNews collects, uses, and protects your personal information.',
};

const sections = [
  {
    title: 'Information We Collect',
    body: `We collect information you provide directly — such as your email address when subscribing to our newsletter. We also collect usage data (pages viewed, time on site, device type) through analytics tools to help us improve our content.`,
  },
  {
    title: 'How We Use Your Information',
    body: `Your email is used solely to deliver our newsletter. We do not sell, rent, or share your personal information with third parties for their marketing purposes. Analytics data is used in aggregate to understand how readers engage with our content.`,
  },
  {
    title: 'Cookies',
    body: `We use cookies to remember your preferences (such as dark mode) and to collect anonymous analytics. You can disable cookies in your browser settings, though some features may not work as expected.`,
  },
  {
    title: 'Third-Party Services',
    body: `We may use third-party services such as Google Analytics for site analytics and ad networks for advertising. These services have their own privacy policies and may collect data independently.`,
  },
  {
    title: 'Data Security',
    body: `We implement industry-standard security measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: 'Your Rights',
    body: `You may unsubscribe from our newsletter at any time using the link in any email we send. To request deletion of your personal data, contact us at privacy@dailybytenews.in.`,
  },
  {
    title: 'Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated date. Continued use of the site after changes constitutes your acceptance of the revised policy.`,
  },
  {
    title: 'Contact',
    body: `For privacy-related inquiries, email us at privacy@dailybytenews.in.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[760px] mx-auto px-4 py-16">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Legal</span>
          <h1 className="font-display text-4xl font-bold text-foreground mt-2 mb-3" style={{ letterSpacing: '-0.03em' }}>
            Privacy Policy
          </h1>
          <p className="text-sm text-muted">Last updated: April 2026</p>
        </div>

        <div className="space-y-8">
          {sections.map(({ title, body }) => (
            <section key={title}>
              <h2 className="font-display text-lg font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>
                {title}
              </h2>
              <p className="text-muted leading-relaxed text-sm">{body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
