import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card, { CardContent } from '../components/Card';

function FadeInSection({ children }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -50px 0px' });

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-[800ms] ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)] transition-all">
        <div className="container mx-auto px-6 max-w-7xl h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--accent)] to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--text)]">RetentionAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text2)]">
            <a href="#features" className="hover:text-[var(--text)] transition-colors">Features</a>
            <a href="#pricing" className="hover:text-[var(--text)] transition-colors">Pricing</a>
            <a href="#demo" className="hover:text-[var(--text)] transition-colors">Demo</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="hero" onClick={() => navigate('/onboarding')} className="px-5 py-2 text-sm rounded-lg font-semibold hidden sm:flex shadow-sm">
              Start Free Trial
            </Button>
            <button className="md:hidden text-[var(--text2)] hover:text-[var(--text)] p-1 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {/* Hero Section */}
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 lg:py-24 bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/30 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#e5e7eb_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none"></div>
        <FadeInSection>
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface2)] border border-[var(--border)] text-sm font-medium text-[var(--text2)] shadow-sm hover:bg-[var(--surface)] transition-colors cursor-default">
                  <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"></span>
                  New: AI Campaign Generator
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-[var(--text)]">
                  Bring Back Lost Customers <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-500">Automatically</span> with AI + WhatsApp
                </h1>
                <p className="text-lg sm:text-xl text-[var(--text2)] max-w-xl leading-relaxed">
                  Turn inactive buyers into loyal customers. Our AI-driven CRM sends highly personalized WhatsApp campaigns to re-engage and drive sales effortlessly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button variant="hero" onClick={() => navigate('/onboarding')} className="px-8 py-3.5 text-base rounded-xl font-semibold">
                    Start Free Trial
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/business/demo-gym')} className="px-8 py-3.5 text-base rounded-xl font-medium bg-[var(--surface)]">
                    See Demo
                  </Button>
                </div>
                <div className="pt-6 flex flex-wrap items-center gap-6 text-sm text-[var(--text3)]">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    No credit card required
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    14-day free trial
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Setup in 5 minutes
                  </div>
                </div>
              </div>
              <div className="relative mt-10 lg:mt-0 lg:ml-8 h-[440px] sm:h-[520px] w-full flex items-center justify-center">
                {/* Large Glow Blobs */}
                <div className="absolute top-[-100px] right-[20%] w-[400px] h-[400px] bg-indigo-300/20 blur-[120px] rounded-full pointer-events-none" style={{ animation: 'float-slow 8s ease-in-out infinite' }}></div>
                <div className="absolute bottom-[-80px] right-[10%] w-[350px] h-[350px] bg-purple-300/20 blur-[100px] rounded-full pointer-events-none" style={{ animation: 'float-slow 10s ease-in-out infinite' }}></div>
                
                {/* Layer 1 Wrapper: Delayed Entrance */}
                <div 
                  className="hidden sm:block absolute top-[25%] -right-6 lg:-right-16 z-20"
                  style={{ animation: 'float-loop 6s ease-in-out infinite' }}
                >
                  {/* Dashboard Card Background */}
                  <div 
                    className="w-64 bg-white border border-gray-100/50 rounded-2xl p-5 shadow-[0_0_25px_rgba(34,197,94,0.15)] ring-1 ring-gray-900/5 opacity-0"
                    style={{ animation: 'pop-fade 500ms ease-out 1.5s forwards' }}
                  >
                    <div className="text-xs text-gray-500 font-medium mb-2">Customer reactivated</div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-[var(--success)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text2)] font-medium">Recovered Revenue</p>
                        <h4 className="text-lg font-bold text-[var(--text)]">₹42,500</h4>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[var(--text2)]">Customers Return</span>
                        <span className="text-[var(--success)] font-medium">+24%</span>
                      </div>
                      <div className="w-full bg-[var(--surface2)] rounded-full h-1.5">
                        <div className="bg-[var(--success)] h-1.5 rounded-full w-[70%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layer 2 Wrapper: Delayed Entrance */}
                <div 
                  className="hidden sm:block absolute bottom-[20%] -left-6 lg:-left-16 z-20"
                  style={{ animation: 'float-loop 8s ease-in-out 1s infinite' }}
                >
                  {/* Dashboard Card Left */}
                  <div 
                    className="w-[230px] bg-white border border-gray-100 rounded-2xl shadow-md p-4 opacity-0"
                    style={{ animation: 'soft-fade 800ms ease-out 0.5s forwards' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                          </span>
                          <p className="text-[11px] text-[var(--text2)] font-semibold tracking-wide uppercase">Sent Today</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <h4 className="text-xl font-bold text-[var(--text)]">142</h4>
                          <span className="text-[10px] font-bold text-[var(--success)] bg-[var(--success)]/10 px-1.5 py-0.5 rounded-md">+12%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layer 3: WhatsApp Chat UI Main */}
                <div className="relative w-full max-w-[320px] sm:max-w-[340px] bg-white/80 backdrop-blur-xl border-[6px] border-[var(--surface)] rounded-2xl h-[400px] sm:h-[440px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col ring-1 ring-[var(--border)] z-10"
                     style={{ animation: 'float-loop 8s ease-in-out 0.5s infinite' }}>
                  {/* Status Bar */}
                  <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3 shadow-md z-10">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm leading-tight">Fit & Strength Gym</h4>
                      <p className="text-[10px] text-white/80">Business Account</p>
                    </div>
                  </div>
                  
                  {/* Chat Area */}
                  <div className="flex-1 p-4 flex flex-col justify-end space-y-4 relative z-0 overflow-hidden pb-6">
                    <div className="flex justify-start">
                      <div className="p-3.5 rounded-xl shadow-sm max-w-[90%] bg-white text-gray-800 rounded-tl-sm relative opacity-0"
                           style={{ animation: 'slide-up-fade 500ms ease-out forwards' }}>
                        <p className="text-[14px] leading-snug">
                          Hi Rahul 👋<br/>We missed you at Fit & Strength Gym.<br/><br/><span className="font-medium">Come this week & get 20% off 🎁</span>
                        </p>
                        <div className="text-[10px] text-gray-400 text-right mt-1.5 font-medium">10:42 AM</div>
                      </div>
                    </div>
                    
                    {/* Typing Indicator */}
                    <div className="flex justify-start absolute bottom-[84px] left-4 opacity-0" style={{ animation: 'type-fade 700ms ease-out 400ms forwards' }}>
                      <div className="p-3 rounded-xl shadow-sm bg-white text-gray-800 rounded-tl-sm flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                      <div className="p-3.5 rounded-xl shadow-sm max-w-[85%] bg-[#dcf8c6] text-gray-800 rounded-tr-sm relative opacity-0"
                           style={{ animation: 'slide-up-fade 500ms ease-out 1s forwards' }}>
                        <p className="text-[14px] leading-snug">That sounds great! I'll visit tomorrow.</p>
                        <div className="text-[10px] text-gray-500 text-right mt-1.5 font-medium flex justify-end gap-1 items-center">
                          10:45 AM
                          <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-start pt-2">
                      <div className="p-3 rounded-xl shadow-sm bg-white text-gray-800 rounded-tl-sm flex gap-1 items-center opacity-70 group-hover:opacity-100 transition-opacity">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>

      {/* Problem Section */}
      <section className="py-24 bg-[var(--surface2)] border-t border-[var(--border)]">
        <FadeInSection>
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">The Hidden Cost of Inaction</h2>
              <p className="text-[var(--text2)] mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
                Most businesses lose their hard-earned customers because of poor post-purchase engagement.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <CardContent className="p-8 text-center flex flex-col items-center h-full">
                  <div className="w-14 h-14 mx-auto bg-[var(--danger)]/10 rounded-2xl flex items-center justify-center mb-5">
                    <svg className="w-7 h-7 text-[var(--danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text)] mb-3">70% Customers Don't Return</h3>
                  <p className="text-[var(--text2)] leading-relaxed">
                    Without a system to remind them, customers forget about your business and go to competitors.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <CardContent className="p-8 text-center flex flex-col items-center h-full">
                  <div className="w-14 h-14 mx-auto bg-orange-500/10 rounded-2xl flex items-center justify-center mb-5">
                    <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text)] mb-3">Manual Follow-ups Fail</h3>
                  <p className="text-[var(--text2)] leading-relaxed">
                    Texting 100s of customers individually takes hours. You don't have the time to do it consistently.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <CardContent className="p-8 text-center flex flex-col items-center h-full">
                  <div className="w-14 h-14 mx-auto bg-[var(--danger)]/10 rounded-2xl flex items-center justify-center mb-5">
                    <svg className="w-7 h-7 text-[var(--danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text)] mb-3">Daily Revenue Loss</h3>
                  <p className="text-[var(--text2)] leading-relaxed">
                    Every ignored customer is money left on the table. You are constantly losing out on predictable recurring revenue.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[var(--bg)]">
        <FadeInSection>
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">How It Works</h2>
              <p className="text-[var(--text2)] mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
                Set it up once, and let AI handle your customer retention automatically.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
              <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-transparent via-[var(--border)] to-transparent -z-0 opacity-60"></div>
              <div className="text-center relative">
                <div className="w-24 h-24 mx-auto bg-[var(--surface)] border-[6px] border-[var(--bg)] shadow-sm rounded-full flex items-center justify-center mb-6 relative z-10 transition-transform hover:scale-105 duration-300">
                  <svg className="w-10 h-10 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--text)] mb-3">1. Customer Visits</h3>
                <p className="text-[var(--text2)] leading-relaxed px-4">They make a purchase and are added to your CRM.</p>
              </div>
              <div className="text-center relative">
                <div className="w-24 h-24 mx-auto bg-[var(--surface)] border-[6px] border-[var(--bg)] shadow-sm rounded-full flex items-center justify-center mb-6 relative z-10 transition-transform hover:scale-105 duration-300">
                  <svg className="w-10 h-10 text-[var(--text3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--text)] mb-3">2. Becomes Inactive</h3>
                <p className="text-[var(--text2)] leading-relaxed px-4">Weeks pass and the customer hasn't returned.</p>
              </div>
              <div className="text-center relative">
                <div className="w-24 h-24 mx-auto bg-[var(--surface)] border-[6px] border-[var(--bg)] shadow-sm rounded-full flex items-center justify-center mb-6 relative z-10 transition-transform hover:scale-105 duration-300">
                  <svg className="w-10 h-10 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--text)] mb-3">3. AI Detects</h3>
                <p className="text-[var(--text2)] leading-relaxed px-4">Our AI identifies the drop-off and crafts a personalized offer.</p>
              </div>
              <div className="text-center relative group">
                <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-[var(--accent)] to-purple-600 text-white border-[6px] border-[var(--bg)] shadow-xl shadow-[var(--accent)]/20 rounded-full flex items-center justify-center mb-6 relative z-10 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--text)] mb-3">4. WhatsApp Sent</h3>
                <p className="text-[var(--text2)] leading-relaxed px-4">A targeted message is sent automatically to bring them back.</p>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* WhatsApp Preview Section */}
      <section className="py-24 bg-[var(--surface2)] border-t border-[var(--border)] overflow-hidden">
        <FadeInSection>
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 order-2 lg:order-1">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
                  Personalized Messages that <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-500">Convert</span>
                </h2>
                <p className="text-lg text-[var(--text2)] leading-relaxed max-w-lg">
                  Our AI analyzes customer behavior and creates tailored offers that feel personal, not spammy. It automatically inserts their name, the last place they visited, and a compelling reason to return.
                </p>
                <ul className="space-y-4 pt-4">
                  <li className="flex items-center gap-3 text-[var(--text)] font-medium">
                    <div className="w-6 h-6 rounded-full bg-[var(--success)]/20 flex items-center justify-center text-[var(--success)]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    Custom variables (Name, Business)
                  </li>
                  <li className="flex items-center gap-3 text-[var(--text)] font-medium">
                    <div className="w-6 h-6 rounded-full bg-[var(--success)]/20 flex items-center justify-center text-[var(--success)]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    AI-generated contextual offers
                  </li>
                  <li className="flex items-center gap-3 text-[var(--text)] font-medium">
                    <div className="w-6 h-6 rounded-full bg-[var(--success)]/20 flex items-center justify-center text-[var(--success)]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    High open & reply rates
                  </li>
                </ul>
              </div>
              <div className="relative mx-auto w-full max-w-sm order-1 lg:order-2">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-[var(--accent)] rounded-[3rem] blur-xl opacity-20 animate-pulse"></div>
                <div className="relative bg-[#efeae2] border-[8px] border-[var(--bg)] rounded-[2.5rem] h-[480px] shadow-2xl overflow-hidden flex flex-col ring-1 ring-[var(--border)]">
                  <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3 shadow-md z-10">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm leading-tight">Fit & Strength Gym</h4>
                      <p className="text-[10px] text-white/80">Business Account</p>
                    </div>
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-center space-y-4 relative z-0">
                    <div className="bg-white text-gray-800 p-3.5 rounded-xl rounded-tl-sm shadow-sm max-w-[85%] relative transform transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                      <div className="text-[15px] space-y-1.5 leading-snug">
                        <p>Hi Rahul 😊</p>
                        <p>We missed you at Fit & Strength Gym.</p>
                        <p className="font-medium">Come this week & get 20% off 🎁</p>
                      </div>
                      <div className="text-[10px] text-gray-400 text-right mt-1.5 font-medium">10:42 AM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Results / Impact Section */}
      <section className="py-24 bg-[var(--bg)] border-t border-[var(--border)]">
        <FadeInSection>
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">Real Results for Real Businesses</h2>
              <p className="text-[var(--text2)] mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
                Don't just take our word for it. See the impact our automated campaigns have on the bottom line.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full">
                  <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-500 mb-4">30%</div>
                  <h3 className="text-lg font-bold text-[var(--text)] mb-2">Increase in Returns</h3>
                  <p className="text-[var(--text2)]">More customers coming back for their second and third purchases.</p>
                </CardContent>
              </Card>
              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full">
                  <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-500 mb-4">1000+</div>
                  <h3 className="text-lg font-bold text-[var(--text)] mb-2">Messages Sent</h3>
                  <p className="text-[var(--text2)]">Automated campaigns running seamlessly in the background daily.</p>
                </CardContent>
              </Card>
              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full">
                  <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--success)] to-green-500 mb-4">₹50k+</div>
                  <h3 className="text-lg font-bold text-[var(--text)] mb-2">Revenue Recovered</h3>
                  <p className="text-[var(--text2)]">Direct sales generated from customers who were about to churn.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Demo Business Preview Section */}
      <section className="py-24 bg-[var(--surface2)] border-t border-[var(--border)]">
        <FadeInSection>
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight mb-4">Beautiful Customer-Facing Pages</h2>
            <p className="text-[var(--text2)] mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
              Your business gets a smart, AI-powered public page like this to collect leads and showcase your brand.
            </p>
            <div className="relative group mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-b from-[var(--accent)] to-purple-600 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">
                <div className="h-12 bg-[var(--surface)] border-b border-[var(--border)] flex items-center px-4 gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                  </div>
                  <div className="mx-auto flex-1 max-w-md h-6 bg-[var(--surface2)] border border-[var(--border)] rounded-md text-center text-xs text-[var(--text3)] flex items-center justify-center font-medium">
                    fitandstrength.shopcrm.com
                  </div>
                  <div className="w-10"></div>
                </div>
                <div className="p-8 sm:p-12 text-left bg-gradient-to-b from-[var(--surface)] to-[var(--bg)]">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-16 h-16 bg-gradient-to-tr from-orange-400 to-red-500 rounded-2xl shadow-md flex items-center justify-center text-white font-bold text-xl border border-white/10">
                      F&S
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[var(--text)]">Fit & Strength Gym</h3>
                      <p className="text-[var(--text2)]">Premium Fitness Center in Downtown</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[var(--surface2)] p-8 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="text-xl font-bold mb-2 text-[var(--text)]">Claim Your First Visit Free</h4>
                      <p className="text-[var(--text2)] mb-6">Enter your details to get a 1-day pass on us.</p>
                      <div className="space-y-4">
                        <div className="h-12 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 flex items-center text-[var(--text3)] shadow-sm">Name</div>
                        <div className="h-12 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 flex items-center text-[var(--text3)] shadow-sm">Phone Number</div>
                        <Button variant="hero" className="w-full h-12 text-base rounded-lg justify-center shadow-md">Get Pass</Button>
                      </div>
                    </div>
                    <div className="hidden md:flex bg-[var(--surface2)] rounded-2xl border border-[var(--border)] overflow-hidden items-center justify-center shadow-sm relative group-hover:border-[var(--accent)] transition-colors duration-500">
                      <div className="absolute inset-0 bg-[var(--bg)]/50"></div>
                      <svg className="w-16 h-16 text-[var(--border)] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Social Proof / Testimonials Section */}
      <section className="py-24 bg-[var(--surface2)] border-t border-[var(--border)]">
        <FadeInSection>
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <p className="text-sm font-bold tracking-widest text-[var(--text3)] uppercase mb-4">
                Trusted by 100+ local businesses
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
                Loved by owners, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-500">ignored by none</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <CardContent className="p-8 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-6 text-[#ffbd2e]">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <p className="text-[var(--text)] text-lg font-medium leading-relaxed mb-8">
                      "We increased repeat customers by 30% in just 2 weeks. The AI messages feel so personal that people actually reply and book."
                    </p>
                  </div>
                  <div className="flex items-center gap-4 border-t border-[var(--border)] pt-5 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-sm">
                      SK
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--text)] text-sm">Sameer Kapoor</h4>
                      <p className="text-[var(--text3)] text-xs">Owner, Fit & Strength</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <CardContent className="p-8 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-6 text-[#ffbd2e]">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <p className="text-[var(--text)] text-lg font-medium leading-relaxed mb-8">
                      "This saved hours of manual follow-ups. I set it up once, and now I just watch the dashboard as customers start returning on their own."
                    </p>
                  </div>
                  <div className="flex items-center gap-4 border-t border-[var(--border)] pt-5 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold shadow-sm">
                      PR
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--text)] text-sm">Priya Sharma</h4>
                      <p className="text-[var(--text3)] text-xs">Manager, Glow Salon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <CardContent className="p-8 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-6 text-[#ffbd2e]">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <p className="text-[var(--text)] text-lg font-medium leading-relaxed mb-8">
                      "Our WhatsApp campaigns actually bring people back. The AI generator is like having a full-time marketing expert on my team."
                    </p>
                  </div>
                  <div className="flex items-center gap-4 border-t border-[var(--border)] pt-5 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-sm">
                      RD
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--text)] text-sm">Rahul Desai</h4>
                      <p className="text-[var(--text3)] text-xs">Founder, Organic Store</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[var(--bg)] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--accent)]/5 pointer-events-none"></div>
        <FadeInSection>
          <div className="container mx-auto px-6 max-w-3xl relative z-10">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--text)] tracking-tight mb-6">
              Start recovering your customers today
            </h2>
            <p className="text-lg text-[var(--text2)] mb-10 leading-relaxed">
              Join hundreds of businesses that are using AI to bring back their lost revenue automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" onClick={() => navigate('/onboarding')} className="px-10 py-4 text-lg rounded-xl font-semibold">
                Start Free Trial
              </Button>
              <Button variant="outline" onClick={() => navigate('/business/demo-gym')} className="px-10 py-4 text-lg rounded-xl font-medium bg-[var(--surface)]">
                Book Demo
              </Button>
            </div>
          </div>
        </FadeInSection>
      </section>

    </div>
  );
}
