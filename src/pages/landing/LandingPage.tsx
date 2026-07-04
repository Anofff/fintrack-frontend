import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingLogo } from '@/components/landing/LandingLogo';
import { HeroMockup } from '@/components/landing/HeroMockup';

const STEPS = [
  {
    icon: 'download',
    title: '1. Download statement',
    body: 'Open the MoMo app, go to My Account → Statement, choose your month, and download the PDF.',
  },
  {
    icon: 'terminal',
    title: '2. Automatic parsing',
    body: 'FinTrack₵ reads your PDF automatically — capturing every amount, merchant, MoMo fee, and e-levy.',
  },
  {
    icon: 'monitoring',
    title: '3. Instant insights',
    body: 'Your dashboard updates with category totals, balance trends, and recurring payment alerts.',
  },
] as const;

const CAPABILITIES = [
  {
    icon: 'pie_chart',
    iconWrap: 'bg-[rgba(0,105,76,0.1)] text-primary',
    title: 'Spending breakdown',
    body: 'Automatic categorization into Food, Transport, Airtime, and more.',
  },
  {
    icon: 'trending_up',
    iconWrap: 'bg-[rgba(0,96,168,0.1)] text-secondary',
    title: 'Monthly trends',
    body: "Compare this month's spending against your history across statements.",
  },
  {
    icon: 'event_repeat',
    iconWrap: 'bg-[rgba(85,76,185,0.1)] text-tertiary',
    title: 'Recurring payments',
    body: 'Detect subscriptions and regular transfers you might have forgotten.',
  },
  {
    icon: 'receipt_long',
    iconWrap: 'bg-[rgba(186,26,26,0.1)] text-error',
    title: 'Fees & e-levy tracker',
    body: 'Accurate tracking of every cedi lost to taxes and service charges.',
    accent: true,
  },
] as const;

const FAQS = [
  {
    q: 'Is my MoMo statement data secure?',
    a: 'Yes. Statements are sent over HTTPS and only accessible to your account. We use them to power your dashboard — not to sell your data.',
  },
  {
    q: 'Which networks are supported?',
    a: 'MTN Mobile Money PDF statements are supported today. More networks may be added later.',
  },
  {
    q: 'How do I get my statement?',
    a: "Open your MoMo app → My Account → Statement, pick the month, download the PDF, then upload it in FinTrack₵.",
  },
  {
    q: 'Is there a monthly fee?',
    a: 'FinTrack₵ is free for personal use while we grow. Premium features may come later.',
  },
] as const;

export function LandingPage() {
  const token = useAuthStore((s) => s.accessToken);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased">
      <LandingNav />

      <main>
        {/* Hero */}
        <section className="relative pt-24 lg:pt-32 pb-12 lg:pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-md lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="z-10">
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                           bg-surface-container-high border border-outline-variant
                           text-label text-primary uppercase tracking-wider mb-6"
              >
                <span aria-hidden>🇬🇭</span>
                Built for Ghana
              </span>

              <h1 className="text-[28px] sm:text-[36px] lg:text-[48px] leading-[1.15] font-semibold tracking-tight text-on-surface mb-4 lg:mb-6">
                Your MoMo spending,{' '}
                <span className="text-primary">finally understood.</span>
              </h1>

              <p className="text-body-reg lg:text-lg text-on-surface-variant mb-8 max-w-lg leading-relaxed">
                Upload your monthly MoMo statement and instantly see where your money went — with
                spending categories, trends, and fee tracking. Built specifically for the Ghanaian
                economy.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 lg:mb-10">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white
                             font-semibold px-8 py-4 rounded-xl hover:bg-primary-container
                             transition-colors text-body-mid shadow-lg shadow-primary/20"
                >
                  Get started free
                  <span className="material-symbols-outlined text-[18px] sm:hidden">arrow_forward</span>
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center border border-outline-variant
                             text-on-surface font-semibold px-8 py-4 rounded-xl
                             hover:bg-surface-container-low transition-colors text-body-mid bg-white"
                >
                  See how it works
                </a>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-outline">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <p className="text-body-sm font-medium">
                  No credit card. No bank connection. Just your MoMo statement.
                </p>
              </div>
            </div>

            <HeroMockup />
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-16 lg:py-24 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-md lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
              <h2 className="text-h2 lg:text-[36px] lg:leading-tight font-semibold text-on-surface mb-3 lg:mb-4">
                <span className="lg:hidden">Simple 3-step setup</span>
                <span className="hidden lg:inline">Master your money in 3 steps</span>
              </h2>
              <p className="text-body-reg text-on-surface-variant hidden lg:block">
                FinTrack₵ takes the complexity out of personal finance by automating the analysis of
                your mobile money records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
              {STEPS.map(({ icon, title, body }) => (
                <div key={title} className="group text-center md:text-left flex flex-col items-center md:items-start">
                  <div
                    className="w-16 h-16 rounded-2xl bg-surface-container-low shadow-sm flex items-center
                               justify-center mb-4 lg:mb-6 group-hover:bg-primary group-hover:text-white
                               transition-colors duration-300"
                  >
                    <span className="material-symbols-outlined text-[28px] text-primary group-hover:text-white">
                      {icon}
                    </span>
                  </div>
                  <h3 className="text-h3 font-semibold mb-2">{title}</h3>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed max-w-sm">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features — mobile list + desktop bento */}
        <section id="features" className="py-16 lg:py-24 bg-background scroll-mt-20">
          <div className="max-w-7xl mx-auto px-md lg:px-8">
            <div className="mb-10 lg:mb-16">
              <span className="text-primary font-semibold text-label tracking-widest uppercase mb-2 block">
                <span className="lg:hidden">Capabilities</span>
                <span className="hidden lg:inline">Powerful features</span>
              </span>
              <h2 className="text-h2 lg:text-[36px] lg:leading-tight font-semibold text-on-surface">
                <span className="lg:hidden">Everything you need to track MoMo</span>
                <span className="hidden lg:inline">Designed for the local context</span>
              </h2>
            </div>

            {/* Mobile / tablet cards */}
            <div className="space-y-4 lg:hidden">
              {CAPABILITIES.map((cap) => (
                <div
                  key={cap.title}
                  className={`card p-4 rounded-xl flex items-start gap-4 ${
                    'accent' in cap && cap.accent ? 'border-l-4 border-l-error' : ''
                  }`}
                >
                  <div className={`p-2 rounded-lg ${cap.iconWrap}`}>
                    <span className="material-symbols-outlined">{cap.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-h4 font-semibold mb-1">{cap.title}</h3>
                    <p className="text-body-sm text-on-surface-variant">{cap.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop bento */}
            <div className="hidden lg:grid grid-cols-12 gap-6">
              <div className="col-span-8 card p-8 rounded-2xl flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <div className="p-2 w-10 h-10 bg-[rgba(0,105,76,0.1)] text-primary rounded-lg mb-6 flex items-center justify-center">
                    <span className="material-symbols-outlined">pie_chart</span>
                  </div>
                  <h3 className="text-h2 font-semibold mb-4">Category breakdown</h3>
                  <p className="text-on-surface-variant mb-6">
                    See exactly where your MoMo is going. We automatically categorize transactions
                    into groceries, utilities, transfers, and more.
                  </p>
                  <ul className="space-y-3">
                    {['Smart categorization', 'Custom merchant labeling'].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-body-sm text-on-surface">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          check_circle
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:w-1/2 bg-surface-container-low rounded-xl p-4 flex flex-col justify-center gap-4">
                  {[
                    { name: 'Shopping / POS', pct: 72, color: 'bg-error' },
                    { name: 'Airtime / Data', pct: 45, color: 'bg-secondary' },
                    { name: 'Person-to-Person', pct: 58, color: 'bg-primary' },
                  ].map((row) => (
                    <div key={row.name}>
                      <div className="flex justify-between text-body-sm mb-1">
                        <span className="text-on-surface font-medium">{row.name}</span>
                        <span className="text-outline">{row.pct}%</span>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-4 card p-8 rounded-2xl">
                <div className="p-2 w-10 h-10 bg-[rgba(0,96,168,0.1)] text-secondary rounded-lg mb-6 flex items-center justify-center">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <h3 className="text-h3 font-semibold mb-3">Monthly trends</h3>
                <p className="text-body-sm text-on-surface-variant mb-6">
                  Track spending growth or savings progress month-over-month with visual charts.
                </p>
                <div className="flex items-end gap-1.5 h-24">
                  {[48, 64, 80, 56, 40].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-md ${i === 2 ? 'bg-primary' : 'bg-surface-container'}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="col-span-4 card p-8 rounded-2xl">
                <div className="p-2 w-10 h-10 bg-[rgba(85,76,185,0.1)] text-tertiary rounded-lg mb-6 flex items-center justify-center">
                  <span className="material-symbols-outlined">event_repeat</span>
                </div>
                <h3 className="text-h3 font-semibold mb-3">Recurring payments</h3>
                <p className="text-body-sm text-on-surface-variant mb-6">
                  Never lose track of QWIKLOAN repayments, insurance, or subscriptions via MoMo.
                </p>
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                  <span className="text-label font-semibold">MTN QWIKLOAN</span>
                  <span className="text-label text-tertiary font-semibold">Monthly</span>
                </div>
              </div>

              <div className="col-span-4 bg-primary p-8 rounded-2xl shadow-lg text-white">
                <div className="p-2 w-10 h-10 bg-white/20 rounded-lg mb-6 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">receipt</span>
                </div>
                <h3 className="text-h3 font-semibold mb-3">Fees & e-levy tracker</h3>
                <p className="text-body-sm text-white/80 mb-6">
                  We calculate exactly how much you spend on MoMo fees and government e-levy.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-[10px] uppercase opacity-70">Total fees</p>
                    <p className="text-h4 font-bold">GH₵ 42.00</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase opacity-70">Total e-levy</p>
                    <p className="text-h4 font-bold">GH₵ 18.50</p>
                  </div>
                </div>
              </div>

              <div className="col-span-4 card p-8 rounded-2xl overflow-hidden relative">
                <div className="p-2 w-10 h-10 bg-[rgba(239,159,39,0.15)] text-[#EF9F27] rounded-lg mb-6 flex items-center justify-center">
                  <span className="material-symbols-outlined">history</span>
                </div>
                <h3 className="text-h3 font-semibold mb-3">Multi-month history</h3>
                <p className="text-body-sm text-on-surface-variant">
                  Look back as far as your statements allow. Compare periods effortlessly.
                </p>
                <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined text-[120px]">calendar_month</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-20 bg-white scroll-mt-20" id="faq">
          <div className="max-w-3xl mx-auto px-md lg:px-8">
            <div className="mb-10">
              <p className="text-label text-primary uppercase tracking-widest mb-2">FAQ</p>
              <h2 className="text-h2 font-semibold">Frequently asked questions</h2>
            </div>
            <div className="space-y-3">
              {FAQS.map(({ q, a }) => (
                <details
                  key={q}
                  className="group border border-outline-variant rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none text-body-mid font-medium text-on-surface">
                    {q}
                    <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-body-sm text-on-surface-variant">{a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 lg:py-24 px-md lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div
              className="rounded-2xl lg:rounded-[32px] p-8 lg:p-20 text-center
                         bg-primary-container lg:bg-inverse-surface text-white"
            >
              <h2 className="text-h2 lg:text-[42px] lg:leading-tight font-semibold mb-4 lg:mb-6">
                Ready to understand your money?
              </h2>
              <p className="text-body-reg lg:text-lg text-white/90 mb-8 lg:mb-10 max-w-xl mx-auto">
                Join Ghanaians using FinTrack₵ to take control of their MoMo spending. Start your
                first analysis in minutes.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center bg-white text-primary lg:bg-primary
                             lg:text-white font-semibold px-10 py-4 lg:py-5 rounded-xl
                             hover:opacity-95 transition-all text-body-mid lg:text-lg
                             shadow-xl lg:shadow-primary/20"
                >
                  Get started free
                </Link>
                <a
                  href="#faq"
                  className="hidden sm:inline-flex items-center justify-center bg-white/10 hover:bg-white/20
                             text-white font-semibold px-10 py-5 rounded-xl transition-colors text-lg"
                >
                  Read FAQ
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="about" className="bg-white border-t border-[rgba(0,0,0,0.06)] py-12 lg:py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-md lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-10 lg:mb-16 gap-10">
            <div className="max-w-xs mx-auto lg:mx-0 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-4">
                <LandingLogo />
              </div>
              <p className="text-body-sm text-outline leading-relaxed">
                FinTrack₵ is built for the modern Ghanaian professional. Clarity starts with the
                wallet you use most: MoMo.
              </p>
            </div>

            <div className="hidden lg:grid grid-cols-3 gap-12">
              <FooterCol
                title="Product"
                links={[
                  { href: '#features', label: 'Features' },
                  { href: '#how-it-works', label: 'How it works' },
                  { href: '#faq', label: 'FAQ' },
                ]}
              />
              <FooterCol
                title="Legal"
                links={[
                  { href: '#', label: 'Privacy Policy' },
                  { href: '#', label: 'Terms of Use' },
                ]}
              />
              <FooterCol
                title="Account"
                links={[
                  { href: '/login', label: 'Sign in', isRoute: true },
                  { href: '/register', label: 'Get started', isRoute: true },
                ]}
              />
            </div>

            <div className="flex gap-8 mx-auto lg:hidden">
              <a href="#" className="text-label text-outline hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-label text-outline hover:text-primary">
                Terms of Use
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-[rgba(0,0,0,0.06)] flex flex-col md:flex-row justify-between items-center gap-3 text-center">
            <p className="text-body-sm text-outline opacity-70">
              © {new Date().getFullYear()} FinTrack₵ Ghana. All rights reserved.
            </p>
            <p className="text-label text-outline opacity-50 uppercase tracking-widest">
              Made with 💚 in Accra
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string; isRoute?: boolean }>;
}) {
  return (
    <div>
      <h4 className="font-semibold text-on-surface mb-6 text-body-sm">{title}</h4>
      <ul className="space-y-4 text-body-sm text-outline">
        {links.map(({ href, label, isRoute }) => (
          <li key={label}>
            {isRoute ? (
              <Link to={href} className="hover:text-primary transition-colors">
                {label}
              </Link>
            ) : (
              <a href={href} className="hover:text-primary transition-colors">
                {label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
