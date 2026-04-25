import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Disclaimer — DailyByteNews',
  description: 'Editorial disclaimer and content policy for DailyByteNews.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[760px] mx-auto px-4 py-16">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Legal</span>
          <h1 className="font-display text-4xl font-bold text-foreground mt-2 mb-3" style={{ letterSpacing: '-0.03em' }}>
            Disclaimer
          </h1>
          <p className="text-sm text-muted">Last updated: April 2026</p>
        </div>

        <div className="space-y-8 text-sm text-muted leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>Editorial Independence</h2>
            <p>DailyByteNews operates with full editorial independence. Our reporting is not influenced by advertisers, investors, or any third parties. Sponsored content, when published, is clearly labeled as such.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>Accuracy</h2>
            <p>We make every effort to ensure the accuracy of our reporting. However, news can change rapidly. If you believe something we've published is incorrect, please contact us at <a href="mailto:editorial@dailybytenews.in" className="text-primary hover:underline">editorial@dailybytenews.in</a> and we will investigate promptly.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>Financial & Investment Disclaimer</h2>
            <p>Nothing on DailyByteNews constitutes financial, investment, or legal advice. All content is for informational purposes only. Always consult a qualified professional before making financial or investment decisions.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>External Links</h2>
            <p>Our articles may contain links to third-party websites. DailyByteNews is not responsible for the content, accuracy, or privacy practices of those sites.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>Opinion & Analysis</h2>
            <p>Articles labeled "Opinion" represent the views of the individual author and do not necessarily reflect the editorial position of DailyByteNews.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
