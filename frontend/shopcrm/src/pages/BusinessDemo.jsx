import React, { useState, useEffect, useRef } from 'react';

/* ─── Scroll-reveal wrapper ─────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: '0px 0px -60px 0px' }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Star rating ────────────────────────────────────────────────────────── */
function Stars({ n = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-[#D4AF37]" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── AI Chat Demo ───────────────────────────────────────────────────────── */
const AI_SCRIPT = [
  { from: 'ai',   text: 'Welcome to ELEV8 Fitness 👋 How can I help you today?',          delay: 600  },
  { from: 'user', text: 'What membership plans do you offer?',                              delay: 1800 },
  { from: 'ai',   text: 'We have three plans — Basic (₹1,499/mo), Elite (₹2,999/mo), and Platinum (₹4,999/mo) with personal training included.', delay: 3200 },
  { from: 'user', text: 'Does Elite include group classes?',                                delay: 5000 },
  { from: 'ai',   text: 'Yes! Elite includes unlimited group classes, nutrition tracking, and locker access. Want me to book a free trial session?', delay: 6600 },
];

function AIChatDemo() {
  const [shown, setShown] = useState([]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    AI_SCRIPT.forEach((msg, i) => {
      const prev = AI_SCRIPT[i - 1];
      const showAt = msg.delay;
      const typingAt = prev ? prev.delay + 400 : 200;
      setTimeout(() => { if (msg.from === 'ai') setTyping(true); }, typingAt);
      setTimeout(() => {
        setTyping(false);
        setShown(s => [...s, msg]);
      }, showAt);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [shown, typing]);

  return (
    <div className="flex flex-col h-[420px] bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-amber-500 flex items-center justify-center text-black font-bold text-xs">AI</div>
        <div>
          <p className="text-white text-sm font-semibold leading-none">ELEV8 AI Assistant</p>
          <p className="text-[#D4AF37] text-[10px] mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
            Online
          </p>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-none">
        {shown.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.from === 'user'
                ? 'bg-[#D4AF37] text-black font-medium rounded-tr-sm'
                : 'bg-[#1e1e1e] text-[#e5e5e5] rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-[#1e1e1e] px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
              {[0, 150, 300].map(d => (
                <span key={d} className="w-1.5 h-1.5 bg-[#555] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {/* Input */}
      <div className="px-4 py-3 border-t border-[#2a2a2a] flex items-center gap-2">
        <input
          readOnly
          placeholder="Ask anything about our gym..."
          className="flex-1 bg-[#1a1a1a] text-[#555] text-sm rounded-xl px-4 py-2.5 outline-none border border-[#2a2a2a] placeholder:text-[#444] cursor-not-allowed"
        />
        <button className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-amber-500 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function BusinessDemo() {
  const [formDone, setFormDone] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased">

      {/* ── Custom animations ─────────────────────────────────────────── */}
      <style>{`
        @keyframes gold-pulse { 0%,100%{opacity:.15} 50%{opacity:.35} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .gold-shimmer {
          background: linear-gradient(90deg,#D4AF37 0%,#F5D27A 40%,#D4AF37 60%,#b8942a 100%);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:shimmer 4s linear infinite;
        }
        .float-slow { animation:float 6s ease-in-out infinite; }
        .float-slow-2 { animation:float 8s ease-in-out 1s infinite; }
        .scrollbar-none::-webkit-scrollbar { display:none; }
      `}</style>

      {/* ════════════════════════════════ NAVBAR ════════════════════════ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        navScrolled ? 'bg-[#050505]/95 backdrop-blur-md shadow-lg shadow-black/50' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-amber-500 flex items-center justify-center text-black font-black text-sm tracking-tight">E8</div>
            <span className="text-xl font-black tracking-widest text-white">ELEV8</span>
            <span className="hidden sm:block text-xs text-[#555] tracking-[0.3em] mt-0.5 font-medium">FITNESS</span>
          </div>
          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#888]">
            {['Services','Gallery','About','Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#D4AF37] transition-colors duration-200">{l}</a>
            ))}
          </div>
          {/* CTAs */}
          <div className="flex items-center gap-3">
            <a href="tel:+919876543210" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-[#2a2a2a] text-sm font-semibold text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Now
            </a>
            <a href="#join" className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black text-sm font-black tracking-wide hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-amber-900/30">
              Book Trial
            </a>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════ HERO ══════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(212,175,55,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(212,175,55,0.06),transparent)]" />
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-[10%] w-72 h-72 rounded-full bg-[#D4AF37]/8 blur-[100px] float-slow pointer-events-none" style={{ animation: 'gold-pulse 6s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-[10%] w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" style={{ animation: 'gold-pulse 8s ease-in-out 2s infinite' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            Premium Luxury Fitness · Est. 2012
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-6">
            <span className="block text-white">ELEVATE</span>
            <span className="block gold-shimmer">YOUR BODY.</span>
            <span className="block text-white">TRANSFORM</span>
            <span className="block text-white">YOUR LIFE.</span>
          </h1>

          <p className="text-[#888] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Where elite training meets luxury. 15,000 sq ft of world-class equipment, expert coaches, and a community that pushes you beyond limits.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="#join" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-black text-base tracking-wide hover:opacity-90 hover:-translate-y-1 transition-all duration-200 shadow-xl shadow-amber-900/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Free Trial
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[#25D366]/40 bg-[#25D366]/5 text-[#25D366] font-bold text-base hover:bg-[#25D366]/10 hover:-translate-y-1 transition-all duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp Us
            </a>
            <a href="#ai-demo" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[#2a2a2a] text-[#888] font-bold text-base hover:border-[#D4AF37]/40 hover:text-[#D4AF37] hover:-translate-y-1 transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Talk to AI
            </a>
          </div>

          {/* Trust bar */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { n: '500+', l: 'Active Members' },
              { n: '4.9★', l: '120 Reviews' },
              { n: '15+', l: 'Expert Coaches' },
              { n: '12 Yrs', l: 'In Business' },
            ].map(({ n, l }) => (
              <div key={l}>
                <div className="text-2xl font-black text-[#D4AF37]">{n}</div>
                <div className="text-xs text-[#555] font-medium tracking-wide mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#333]">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════ SERVICES ══════════════════════════ */}
      <section id="services" className="py-28 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-[#D4AF37] text-xs font-bold tracking-[0.4em] uppercase mb-4">What We Offer</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                Elite <span className="gold-shimmer">Services</span>
              </h2>
              <p className="text-[#555] mt-4 text-lg max-w-2xl mx-auto">Everything you need to reach peak performance — under one roof.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                ),
                title: 'Personal Training',
                desc: 'One-on-one sessions with certified coaches. Customised plans built around your goals.',
                tag: 'Most Popular',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                ),
                title: 'Group Classes',
                desc: 'HIIT, Yoga, CrossFit, Spin & more. 40+ weekly sessions led by world-class instructors.',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                ),
                title: 'Nutrition Coaching',
                desc: 'AI-powered meal planning and weekly check-ins with certified dietitians.',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                ),
                title: 'Recovery & Spa',
                desc: 'Ice baths, infrared sauna, deep-tissue massage, and cryotherapy suite.',
              },
            ].map(({ icon, title, desc, tag }) => (
              <Reveal key={title} delay={60}>
                <div className="group relative bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-7 hover:border-[#D4AF37]/40 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  {tag && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded-full uppercase">{tag}</span>
                  )}
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-5 group-hover:bg-[#D4AF37]/15 transition-colors">
                    <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                  </div>
                  <h3 className="text-white font-black text-lg mb-3 tracking-tight">{title}</h3>
                  <p className="text-[#555] text-sm leading-relaxed flex-1">{desc}</p>
                  <div className="mt-5 flex items-center gap-1 text-[#D4AF37] text-xs font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ AI ASSISTANT DEMO ═══════════════════ */}
      <section id="ai-demo" className="py-28 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(212,175,55,0.05),transparent)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="space-y-7">
                <div>
                  <p className="text-[#D4AF37] text-xs font-bold tracking-[0.4em] uppercase mb-4">AI-Powered Support</p>
                  <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                    Your Personal<br /><span className="gold-shimmer">AI Concierge</span><br />Never Sleeps.
                  </h2>
                </div>
                <p className="text-[#555] text-lg leading-relaxed">
                  Instant answers about memberships, classes, and schedules — 24/7. Our AI handles enquiries while you focus on training.
                </p>
                <ul className="space-y-4">
                  {[
                    'Answers membership & pricing questions instantly',
                    'Books trial sessions and follow-up calls',
                    'Sends personalised offers via WhatsApp',
                    'Recovers inactive members automatically',
                  ].map(f => (
                    <li key={f} className="flex items-start gap-3 text-[#888] text-sm">
                      <div className="w-5 h-5 rounded-full bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#join" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-black text-sm tracking-wide hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-amber-900/30">
                  Try the AI Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <AIChatDemo />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════ GALLERY ═══════════════════════════ */}
      <section id="gallery" className="py-28 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-[#D4AF37] text-xs font-bold tracking-[0.4em] uppercase mb-4">Inside ELEV8</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                World-Class <span className="gold-shimmer">Facilities</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Olympic Lifting Floor', span: 'col-span-2 row-span-2', h: 'h-64 md:h-auto' },
              { label: 'Cardio Zone',             span: '',                     h: 'h-40' },
              { label: 'Spin Studio',              span: '',                     h: 'h-40' },
              { label: 'Boxing Arena',             span: '',                     h: 'h-48' },
              { label: 'Recovery Spa',             span: '',                     h: 'h-48' },
              { label: 'Nutrition Bar',            span: '',                     h: 'h-48' },
            ].map(({ label, span, h }, i) => (
              <Reveal key={label} delay={i * 40}>
                <div className={`relative group rounded-xl overflow-hidden bg-[#111] border border-[#1e1e1e] ${span} ${h} min-h-[140px] hover:border-[#D4AF37]/30 transition-all duration-300`}>
                  {/* Gradient placeholder */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${[
                    'from-stone-900 to-neutral-800',
                    'from-zinc-900 to-stone-800',
                    'from-neutral-900 to-zinc-800',
                    'from-stone-800 to-neutral-900',
                    'from-zinc-800 to-stone-900',
                    'from-neutral-800 to-zinc-900',
                  ][i]}`} />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/5 transition-colors duration-300" />
                  {/* Grid icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <svg className="w-12 h-12 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {/* Label */}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-bold tracking-wide">{label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ TESTIMONIALS ══════════════════════════ */}
      <section className="py-28 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-[#D4AF37] text-xs font-bold tracking-[0.4em] uppercase mb-4">Real Members</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                Transformations That <span className="gold-shimmer">Speak</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "ELEV8 changed everything. Lost 18 kg in 4 months and gained the confidence I never had. The coaches push you without ever breaking you.",
                name: 'Arjun Mehta',
                role: 'Software Engineer · Member 2 yrs',
                initials: 'AM',
                color: 'from-blue-600 to-indigo-700',
              },
              {
                quote: "Best investment of my life. The personal trainers here know their craft deeply. The recovery spa alone is worth every rupee.",
                name: 'Priya Sharma',
                role: 'Entrepreneur · Member 3 yrs',
                initials: 'PS',
                color: 'from-rose-500 to-pink-700',
                featured: true,
              },
              {
                quote: "Joined for the gym, stayed for the community. The AI nutrition tracker is genuinely impressive — it feels like a dietitian in my pocket.",
                name: 'Karan Patel',
                role: 'Doctor · Member 1 yr',
                initials: 'KP',
                color: 'from-emerald-600 to-teal-700',
              },
            ].map(({ quote, name, role, initials, color, featured }) => (
              <Reveal key={name} delay={60}>
                <div className={`relative bg-[#0f0f0f] border rounded-2xl p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 ${
                  featured ? 'border-[#D4AF37]/40 shadow-xl shadow-[#D4AF37]/5' : 'border-[#1e1e1e] hover:border-[#2a2a2a]'
                }`}>
                  {featured && (
                    <div className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded-full uppercase">Featured</div>
                  )}
                  <Stars />
                  <p className="text-[#888] text-base leading-relaxed mt-5 mb-6 flex-1">"{quote}"</p>
                  <div className="flex items-center gap-3 border-t border-[#1e1e1e] pt-5">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${color} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                      {initials}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{name}</p>
                      <p className="text-[#444] text-xs mt-0.5">{role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ LEAD CAPTURE ══════════════════════════ */}
      <section id="join" className="py-28 bg-[#080808] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(212,175,55,0.06),transparent)]" />
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-3xl p-10 md:p-16 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <Reveal>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-6">
                    Limited Spots Available
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight mb-5">
                    Claim Your<br /><span className="gold-shimmer">Free Trial Session</span>
                  </h2>
                  <p className="text-[#555] leading-relaxed mb-7">
                    No commitment. No credit card. Just one session to experience what elite fitness feels like.
                  </p>
                  <div className="space-y-3">
                    {['Free 1-day gym access', 'Complimentary fitness assessment', 'Personal coach consultation', '20% off first month if you join'].map(p => (
                      <div key={p} className="flex items-center gap-2.5 text-[#666] text-sm">
                        <div className="w-4 h-4 rounded-full bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Right — Form */}
              <Reveal delay={100}>
                {formDone ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black text-white">You're In!</h3>
                    <p className="text-[#555]">Our AI will reach out on WhatsApp within 5 minutes to confirm your trial session.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { label: 'Full Name', placeholder: 'Rahul Desai', type: 'text' },
                      { label: 'Phone Number', placeholder: '+91 98765 43210', type: 'tel' },
                      { label: 'Email Address', placeholder: 'rahul@example.com', type: 'email' },
                    ].map(({ label, placeholder, type }) => (
                      <div key={label} className="space-y-1.5">
                        <label className="text-xs font-bold text-[#444] tracking-widest uppercase">{label}</label>
                        <input
                          type={type}
                          placeholder={placeholder}
                          className="w-full h-12 bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl px-4 text-sm text-white placeholder:text-[#333] focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                        />
                      </div>
                    ))}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#444] tracking-widest uppercase">Goal</label>
                      <select className="w-full h-12 bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl px-4 text-sm text-[#888] focus:outline-none focus:border-[#D4AF37]/50 transition-all appearance-none">
                        <option>Select your primary goal</option>
                        <option>Weight Loss</option>
                        <option>Muscle Building</option>
                        <option>Athletic Performance</option>
                        <option>General Fitness</option>
                      </select>
                    </div>
                    <button
                      onClick={() => setFormDone(true)}
                      className="w-full h-13 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-black text-sm tracking-wide hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-amber-900/30 mt-2"
                    >
                      Book My Free Trial →
                    </button>
                    <p className="text-center text-[#333] text-xs">No spam. We'll only contact you about your trial.</p>
                  </div>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════ FOOTER ════════════════════════════ */}
      <footer className="bg-[#030303] border-t border-[#111] py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-amber-500 flex items-center justify-center text-black font-black text-sm">E8</div>
                <span className="text-xl font-black tracking-widest text-white">ELEV8</span>
                <span className="text-xs text-[#333] tracking-[0.3em] font-medium">FITNESS</span>
              </div>
              <p className="text-[#444] text-sm leading-relaxed max-w-xs">
                Premium luxury fitness centre in the heart of the city. Where champions are made.
              </p>
              <div className="flex gap-3">
                {['Instagram', 'YouTube', 'WhatsApp'].map(s => (
                  <a key={s} href="#" className="w-9 h-9 rounded-lg bg-[#111] border border-[#1e1e1e] flex items-center justify-center text-[#444] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all text-[10px] font-bold">
                    {s[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <p className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-4">Quick Links</p>
              <ul className="space-y-2">
                {['Memberships', 'Group Classes', 'Personal Training', 'Nutrition', 'Recovery Spa'].map(l => (
                  <li key={l}>
                    <a href="#" className="text-[#444] text-sm hover:text-[#888] transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-4">Contact</p>
              <ul className="space-y-3 text-sm text-[#444]">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#D4AF37]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  12 Gold Tower, Bandra West, Mumbai 400050
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 text-[#D4AF37]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91 98765 43210
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 text-[#D4AF37]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mon – Sun · 5:30 AM – 11:30 PM
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#111] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[#333] text-xs">© 2026 ELEV8 Fitness. All rights reserved.</p>
            <p className="text-[#222] text-xs">Powered by <span className="text-[#D4AF37]/40">RetentionAI</span></p>
          </div>
        </div>
      </footer>

      {/* ══════════════════════ FLOATING ACTION BUTTONS ══════════════════ */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* Talk to AI */}
        <a href="#ai-demo" className="group w-14 h-14 rounded-full bg-gradient-to-tr from-[#D4AF37] to-amber-500 flex items-center justify-center shadow-xl shadow-amber-900/40 hover:scale-110 transition-transform relative">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1a1a1a] text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#2a2a2a]">
            Talk to AI
          </span>
        </a>
        {/* WhatsApp */}
        <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="group w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl shadow-green-900/40 hover:scale-110 transition-transform relative">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1a1a1a] text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#2a2a2a]">
            WhatsApp Us
          </span>
        </a>
        {/* Call Now */}
        <a href="tel:+919876543210" className="group w-14 h-14 rounded-full bg-[#111] border border-[#2a2a2a] flex items-center justify-center shadow-xl hover:scale-110 hover:border-[#D4AF37]/40 transition-all relative">
          <svg className="w-6 h-6 text-[#888] group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1a1a1a] text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#2a2a2a]">
            Call Now
          </span>
        </a>
      </div>

    </div>
  );
}
