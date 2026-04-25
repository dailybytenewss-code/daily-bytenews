'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[760px] mx-auto px-4 py-16">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Contact</span>
          <h1 className="font-display text-4xl font-bold text-foreground mt-2 mb-4" style={{ letterSpacing: '-0.03em' }}>
            Get in Touch
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Have a news tip, feedback, or partnership inquiry? We'd love to hear from you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-10 mb-12">
          {[
            { label: 'Editorial', email: 'editorial@dailybytenews.in', desc: 'News tips, corrections, story pitches' },
            { label: 'Advertising', email: 'advertise@dailybytenews.in', desc: 'Sponsorships, brand partnerships' },
          ].map(({ label, email, desc }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-1">{label}</h3>
              <a href={`mailto:${email}`} className="text-primary text-sm font-medium hover:underline">{email}</a>
              <p className="text-xs text-muted mt-1">{desc}</p>
            </div>
          ))}
        </div>

        {submitted ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-6 py-8 text-center">
            <p className="text-lg font-bold text-green-700 dark:text-green-400 mb-1">Message sent!</p>
            <p className="text-sm text-green-600 dark:text-green-500">We'll get back to you within 48 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} id="advertise" className="space-y-5 bg-card border border-border rounded-xl p-6">
            <h2 className="font-display font-bold text-foreground text-lg" style={{ letterSpacing: '-0.02em' }}>Send a Message</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
              <input
                type="text" required value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                placeholder="What's this about?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
              <textarea
                required rows={5} value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                placeholder="Tell us more..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              Send Message
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
