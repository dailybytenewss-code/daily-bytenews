import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service — DailyByteNews',
  description: 'Terms and conditions for using DailyByteNews.',
};

const sections = [
  {
    title: 'Acceptance of Terms',
    body: `By accessing or using DailyByteNews, you agree to be bound by these Terms of Service. If you do not agree, please do not use the site.`,
  },
  {
    title: 'Content & Intellectual Property',
    body: `All content published on DailyByteNews — including articles, images, logos, and design — is the property of DailyByteNews or its contributors. You may share articles with attribution, but reproduction or commercial use requires written permission.`,
  },
  {
    title: 'User Conduct',
    body: `You agree not to misuse the site, attempt to gain unauthorized access, scrape content in bulk, or use automated tools to disrupt services. Violations may result in access being blocked.`,
  },
  {
    title: 'Newsletter & Email',
    body: `By subscribing to our newsletter, you consent to receive our editorial emails. You can unsubscribe at any time. We will not send spam or share your email with third parties.`,
  },
  {
    title: 'Accuracy & Disclaimers',
    body: `We strive for accuracy in all our reporting. However, DailyByteNews does not warrant that all content is error-free. News content reflects information available at the time of publishing and may become outdated.`,
  },
  {
    title: 'Limitation of Liability',
    body: `DailyByteNews is not liable for any loss or damage arising from use of the site, reliance on any article, or disruption of service. Use the site at your own risk.`,
  },
  {
    title: 'Governing Law',
    body: `These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India.`,
  },
  {
    title: 'Changes to Terms',
    body: `We may update these terms at any time. Continued use of the site after updates constitutes acceptance. Check this page periodically for changes.`,
  },
  {
    title: 'Contact',
    body: `For questions about these terms, contact us at legal@dailybytenews.in.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[760px] mx-auto px-4 py-16">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Legal</span>
          <h1 className="font-display text-4xl font-bold text-foreground mt-2 mb-3" style={{ letterSpacing: '-0.03em' }}>
            Terms of Service
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
