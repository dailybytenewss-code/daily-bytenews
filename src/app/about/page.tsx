import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About Us — DailyByteNews',
  description: 'DailyByteNews is a fast, trustworthy tech news platform built for the modern Indian reader.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[760px] mx-auto px-4 py-16">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">About</span>
          <h1 className="font-display text-4xl font-bold text-foreground mt-2 mb-4" style={{ letterSpacing: '-0.03em' }}>
            Built for the Curious Mind
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            DailyByteNews is a technology and business news platform delivering fast, accurate, and in-depth coverage of AI, startups, markets, and the ideas shaping our world.
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>Our Mission</h2>
            <p className="text-muted leading-relaxed">
              We believe great journalism should be accessible, jargon-free, and worth your time. Our editors hand-pick the stories that matter — cutting through the noise so you stay informed in minutes, not hours.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>What We Cover</h2>
            <ul className="space-y-2 text-muted">
              {[
                'Artificial Intelligence & Machine Learning',
                'Indian and Global Tech Startups',
                'Business, Markets & Finance',
                'Explainers — making complex tech simple',
                'Opinion & Analysis from industry voices',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>Our Team</h2>
            <p className="text-muted leading-relaxed">
              DailyByteNews is built by a team of journalists, engineers, and product thinkers who are passionate about technology and its impact on India and the world. We are independent, reader-supported, and committed to honest reporting.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>Get in Touch</h2>
            <p className="text-muted leading-relaxed">
              Have a tip, feedback, or want to work with us? Reach out at{' '}
              <a href="mailto:hello@dailybytenews.in" className="text-primary hover:underline font-medium">
                hello@dailybytenews.in
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
