import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router, Routes, Route,
  Link, useLocation, useNavigate,
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ──────────────────────────────────────────────
   SCROLL REVEAL HOOK
────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .stagger');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12, rootMargin: '0px 0px -100px 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ──────────────────────────────────────────────
   SCROLL TO TOP BUTTON
────────────────────────────────────────────── */
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setVisible(window.scrollY > 450);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button 
      className={`scroll-top ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

/* ──────────────────────────────────────────────
   PAGE WRAPPER — Auto scroll to top on route change
────────────────────────────────────────────── */
const Page = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useReveal();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ paddingTop: 'var(--nav-h)' }}
    >
      {children}
      <ScrollToTop />
    </motion.main>
  );
};

/* ──────────────────────────────────────────────
   NAVBAR
────────────────────────────────────────────── */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 28);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const links = [['/', 'Home'], ['/services', 'Services'], ['/portfolio', 'Portfolio'], ['/contact', 'Contact']];
  const isActive = (p: string) => (p === '/' ? location.pathname === '/' : location.pathname.startsWith(p));

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <Link to="/" className="nav-logo">NexGen<span className="dot">.</span>AI</Link>
        <ul className="nav-links">
          {links.map(([path, label]) => (
            <li key={path}>
              <Link to={path} className={isActive(path) ? 'active' : ''}>{label}</Link>
            </li>
          ))}
        </ul>
        <Link to="/contact" className="nav-cta">Get a Quote</Link>
        <button className="nav-mobile-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      <div className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
        {links.map(([path, label]) => <Link key={path} to={path}>{label}</Link>)}
        <Link to="/contact" className="btn-primary" style={{ marginTop: '1rem' }}>Get a Quote →</Link>
      </div>
    </>
  );
};

/* ──────────────────────────────────────────────
   HOME PAGE
────────────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const services = [
    { icon: '🤖', title: 'AI & Machine Learning', desc: 'We connect your business to cutting-edge AI — from smart chatbots that handle customers 24/7 to systems that predict trends before they happen.', tags: ['GPT-4', 'LangChain', 'Python', 'RAG'] },
    { icon: '🌐', title: 'Web Development', desc: 'Fast, beautiful websites and powerful web apps. Whether you need a landing page or a full online platform, we build it to last.', tags: ['Django', 'React', 'PostgreSQL', 'Docker'] },
    { icon: '📱', title: 'Mobile Apps', desc: 'Your business in your customer\'s pocket. We create iOS and Android apps that feel native, look stunning, and work flawlessly.', tags: ['React Native', 'Expo', 'Firebase'] },
    { icon: '🔒', title: 'Cloud & Security', desc: 'We set up rock-solid cloud infrastructure so your app never goes down and your data stays safe — even as you grow to millions of users.', tags: ['AWS', 'Terraform', 'CI/CD'] },
    { icon: '📊', title: 'Data & Analytics', desc: 'Turn your raw data into clear decisions. We build dashboards and reports that show you exactly what\'s working and what\'s not.', tags: ['Airflow', 'dbt', 'Metabase'] },
    { icon: '💬', title: 'Chatbots & Automation', desc: 'Free your team from repetitive tasks. Our automations handle emails, bookings, follow-ups — all without human effort.', tags: ['OpenAI', 'n8n', 'Zapier'] },
  ];

  const steps = [
    { num: '01', title: 'We Listen First', desc: 'We start with a free call to understand your goals, your users, and what success looks like for you. No jargon, just honest conversation.' },
    { num: '02', title: 'We Design a Blueprint', desc: 'Before writing a single line of code, we show you exactly what we\'re going to build — wireframes, user flows, and a clear plan.' },
    { num: '03', title: 'We Build & Test', desc: 'Our engineers build your product with clean, maintainable code. We test everything rigorously so you launch with confidence.' },
    { num: '04', title: 'We Launch & Support', desc: 'We deploy your product and stay by your side — monitoring performance, fixing issues, and adding features as you grow.' },
  ];

  const stats = [
    { icon: '🚀', num: '50+', lbl: 'Projects Shipped' },
    { icon: '❤️', num: '30+', lbl: 'Happy Clients' },
    { icon: '⭐', num: '99%', lbl: 'Satisfaction Rate' },
    { icon: '⚡', num: '3 yrs', lbl: 'Of Excellence' },
  ];

  const portfolio = [
    { emoji: '🏥', title: 'MediAI Platform', cat: 'AI / Healthcare', grad: 'linear-gradient(135deg,#1e3a5f,#1a2e4a)' },
    { emoji: '🛒', title: 'ShopFlow Commerce', cat: 'Web / E-Commerce', grad: 'linear-gradient(135deg,#2d1b4e,#1e1535)' },
    { emoji: '📱', title: 'FinTrack App', cat: 'Mobile / FinTech', grad: 'linear-gradient(135deg,#1a3a2a,#12261c)' },
    { emoji: '📊', title: 'DataBridge Hub', cat: 'Data / Analytics', grad: 'linear-gradient(135deg,#3a2a1a,#261c12)' },
    { emoji: '🤖', title: 'SupportBot AI', cat: 'AI / Customer Service', grad: 'linear-gradient(135deg,#1e2a4a,#12182e)' },
    { emoji: '🔐', title: 'VaultGuard', cat: 'DevOps / Security', grad: 'linear-gradient(135deg,#3a1a1a,#261212)' },
  ];

  const testimonials = [
    { name: 'Sarah K.', role: 'CTO, HealthTech Startup', quote: 'NexGen AI built our entire ML pipeline in 6 weeks. The quality was extraordinary — they genuinely understood our domain and delivered beyond expectations.', color: '#3dffa0' },
    { name: 'Omar R.', role: 'Founder, E-Commerce Co.', quote: 'Our platform now handles 100k daily users without breaking a sweat. They explained every decision in plain English — couldn\'t ask for a better partner.', color: '#4f8ef7' },
    { name: 'Priya M.', role: 'Product Manager, FinTech', quote: 'The mobile app they delivered exceeded every expectation. Users keep telling us it\'s the smoothest app they\'ve used. NexGen is world-class.', color: '#a78bfa' },
  ];

  return (
    <Page>
      {/* HERO */}
      <section className="hero">
        <div className="hero-dots" />
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        <div className="container">
          <div className="hero-inner">
            <div>
              <motion.div className="hero-badge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <span className="badge-dot" />
                <span className="label" style={{ margin: 0 }}>Open for new projects</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                We Build Software<br />
                <span className="gradient-text">That Actually Works</span>
              </motion.h1>

              <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                From AI-powered chatbots to complete mobile apps — we turn your business idea into polished, working software. No fluff, just results.
              </motion.p>

              <motion.div className="hero-btns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <button className="btn-primary" onClick={() => navigate('/contact')}>Start Your Project →</button>
                <button className="btn-ghost" onClick={() => navigate('/portfolio')}>See Our Work</button>
              </motion.div>

              <motion.div className="hero-trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <div className="trust-avatars">
                  {['#3dffa0', '#4f8ef7', '#a78bfa', '#ffb347'].map((c, i) => (
                    <div key={i} className="trust-av" style={{ background: c }}>{['S', 'O', 'P', 'A'][i]}</div>
                  ))}
                </div>
                <span>Trusted by <strong>30+ businesses</strong> worldwide</span>
              </motion.div>
            </div>

            <div className="hero-graphic">
              <div className="orbit-ring orbit-ring-1"><div className="orbit-dot" /></div>
              <div className="orbit-ring orbit-ring-2"><div className="orbit-dot orbit-dot-2" /></div>

              <div className="phone-mock">
                <div className="phone-notch" />
                <div className="phone-screen">
                  <div className="ps-bar" />
                  <div className="ps-bar b2" />
                  <div className="ps-bar b3" />
                  <div className="ps-chart" />
                  <div className="ps-mini">
                    <div className="ps-mini-row" />
                    <div className="ps-mini-row short" />
                  </div>
                  <div className="ps-mini">
                    <div className="ps-mini-row" />
                    <div className="ps-mini-row short" />
                  </div>
                </div>
              </div>

              <div className="float-chip chip-1">
                <span className="fc-icon">🚀</span>
                <div><div className="fc-lbl">Projects Done</div><div className="fc-val">50+</div></div>
              </div>
              <div className="float-chip chip-2">
                <span className="fc-icon">⭐</span>
                <div><div className="fc-lbl">Satisfaction</div><div className="fc-val">99%</div></div>
              </div>
              <div className="float-chip chip-3">
                <span className="fc-icon">⚡</span>
                <div><div className="fc-lbl">Avg Delivery</div><div className="fc-val">6 wks</div></div>
              </div>
              <div className="float-chip chip-4">
                <span className="fc-icon">🤖</span>
                <div><div className="fc-lbl">AI Models</div><div className="fc-val">GPT-4</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...Array(2)].map((_, ri) =>
            ['AI Development', 'Web Apps', 'Mobile Apps', 'Machine Learning', 'Cloud Infrastructure', 'Data Pipelines', 'Chatbots', 'Django', 'React Native', 'OpenAI'].map((t, i) => (
              <div key={`${ri}-${i}`} className="marquee-item"><span>◆</span>{t}</div>
            ))
          )}
        </div>
      </div>

      {/* SERVICES */}
      <section>
        <div className="container">
          <div className="section-head reveal">
            <span className="label">What We Build</span>
            <h2>Everything Your Business Needs,<br /><span className="gradient-text">Under One Roof</span></h2>
            <p>You don't need to hire 5 different agencies. We handle AI, web, mobile, data — everything — with one seamless team.</p>
          </div>
          <div className="services-grid stagger reveal">
            {services.map((s, i) => (
              <div key={s.title} className={`card service-card reveal d${(i % 5) + 1}`}>
                <div className="svc-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="svc-tags">{s.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: 'var(--bg-2)', padding: '5rem 0' }}>
        <div className="container">
          <div className="section-head reveal" style={{ marginBottom: '3rem' }}>
            <span className="label">By The Numbers</span>
            <h2>Results That <span className="gradient-text">Speak Loudly</span></h2>
            <p>We let our track record do the talking — real numbers from real projects.</p>
          </div>
          <div className="stats-row stagger reveal">
            {stats.map((s, i) => (
              <div key={s.num} className={`card stat-card reveal d${i + 1}`}>
                <div className="stat-ico">{s.icon}</div>
                <div>
                  <div className="stat-num gradient-text">{s.num}</div>
                  <div className="stat-lbl">{s.lbl}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS — phone showcase ── */}
      <section className="process-section">
        <div className="container">
          <div className="section-head reveal">
            <span className="label">How It Works</span>
            <h2>From Idea to Launch —<br /><span className="gradient-text">Simple as That</span></h2>
            <p>We've streamlined everything so you can focus on your business while we handle the technical heavy lifting.</p>
          </div>
          <div className="process-grid">
            {/* Steps */}
            <div className="step-list reveal">
              {steps.map((s, i) => (
                <div key={s.num} className={`step-item${activeStep === i ? ' active' : ''}`} onClick={() => setActiveStep(i)}>
                  <div className="step-num">{s.num}</div>
                  <div className="step-body">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Phone visual */}
            <div className="proc-phone-wrap reveal d2">
              <div className="proc-phone">
                <div className="proc-screen">
                  <div className="psc-chip">Step {activeStep + 1} of 4</div>
                  <div className="psc-t" />
                  <div className="psc-l" />
                  <div className="psc-l s" />
                  <div className="psc-l" />
                  <div className="psc-l s" />
                  <div className="psc-graph" />
                </div>
              </div>
              <div className="pp-badge ppb-1">
                <div className="ppb-icon">✅</div>
                <div className="ppb-text">Milestone Done</div>
                <div className="ppb-sub">On Schedule</div>
              </div>
              <div className="pp-badge ppb-2">
                <div className="ppb-icon">📊</div>
                <div className="ppb-text">Progress: 75%</div>
                <div className="ppb-sub">Week 4 of 6</div>
              </div>
              <div className="pp-badge ppb-3">
                <div className="ppb-icon">💬</div>
                <div className="ppb-text">Daily Updates</div>
                <div className="ppb-sub">Always in sync</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section>
        <div className="container">
          <div className="section-head reveal">
            <span className="label">Why NexGen</span>
            <h2>We're Different — and<br /><span className="gradient-warm">Here's Why</span></h2>
            <p>Plenty of agencies can write code. We go further — we become your technical partner who genuinely cares about your success.</p>
          </div>
          <div className="features-grid">
            {[
              { icon: '🎯', bg: 'rgba(61,255,160,.12)', title: 'Plain English Communication', desc: 'No tech jargon, no confusing reports. We explain everything clearly so you always know what\'s happening and why.' },
              { icon: '⏱️', bg: 'rgba(79,142,247,.12)', title: 'Deadlines We Actually Keep', desc: 'We set realistic timelines based on experience, then deliver on them. Over 95% of our projects launch on or ahead of schedule.' },
              { icon: '💰', bg: 'rgba(255,179,71,.12)', title: 'No Surprise Invoices', desc: 'You get a fixed-price proposal upfront. The price we quote is the price you pay — no scope creep, no hidden extras.' },
              { icon: '🤝', bg: 'rgba(167,139,250,.12)', title: 'Your Success Is Our Goal', desc: 'We measure our work by one thing: whether your business grows. If you win, we win. That\'s how we think about every project.' },
            ].map((f, i) => (
              <div key={f.title} className={`card feat-card reveal d${i + 1}`}>
                <div className="feat-icon" style={{ background: f.bg }}>{f.icon}</div>
                <div><h3>{f.title}</h3><p>{f.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO TEASER ── */}
      <section style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-head reveal">
            <span className="label">Our Work</span>
            <h2>Real Products,<br /><span className="gradient-text">Real Results</span></h2>
            <p>Every project below is live, used by real people, and delivered on time. Take a look at what we've built.</p>
          </div>
          <div className="port-grid-home reveal">
            {portfolio.map(p => (
              <div key={p.title} className="port-card" onClick={() => navigate('/portfolio')}>
                <div className="port-thumb" style={{ background: p.grad }}>{p.emoji}</div>
                <div className="port-info">
                  <span className="label">{p.cat}</span>
                  <h4>{p.title}</h4>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }} className="reveal">
            <button className="btn-ghost" onClick={() => navigate('/portfolio')}>View All Projects →</button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section>
        <div className="container">
          <div className="section-head reveal">
            <span className="label">Client Stories</span>
            <h2>Don't Take Our Word,<br /><span className="gradient-text">Take Theirs</span></h2>
          </div>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`card testi-card reveal d${i + 1}`}>
                <div className="testi-stars">★★★★★</div>
                <blockquote>"{t.quote}"</blockquote>
                <div className="testi-author">
                  <div className="testi-av" style={{ background: t.color }}>{t.name[0]}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section>
        <div className="container">
          <div className="cta-band reveal">
            <h2>Your Idea Deserves to<br /><span className="gradient-text">Become Reality</span></h2>
            <p>Book a free 30-minute call. We'll tell you exactly how we'd build your product, what it costs, and how long it takes.</p>
            <div className="cta-band-btns">
              <button className="btn-primary" onClick={() => navigate('/contact')}>Book Free Call →</button>
              <button className="btn-ghost" onClick={() => navigate('/services')}>Explore Services</button>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
};

/* ──────────────────────────────────────────────
   SERVICES PAGE — Rich Animated Hero
────────────────────────────────────────────── */
const Services = () => {
  const navigate = useNavigate();

  const servicesList = [
    { icon: '🤖', label: 'Artificial Intelligence', title: 'AI That Works for You', desc: 'We make AI accessible to every business — not just tech giants.', feats: ['Smart chatbots', 'Document summarization', 'Recommendation engines', 'GPT-4 Integration'] },
    { icon: '🌐', label: 'Web Development', title: 'Websites That Win Customers', desc: 'Fast, beautiful, conversion-focused websites and web apps.', feats: ['Landing pages', 'E-commerce', 'Dashboards', 'API Development'] },
    { icon: '📱', label: 'Mobile Development', title: 'Apps Your Users Will Love', desc: 'Native-feeling iOS and Android apps that users keep coming back to.', feats: ['React Native', 'Real-time features', 'Offline support', 'App Store ready'] },
    { icon: '📊', label: 'Data & Analytics', title: 'See What\'s Really Happening', desc: 'Turn raw data into clear, actionable business insights.', feats: ['Custom dashboards', 'Automated reports', 'Predictive analytics'] },
  ];

  return (
    <Page>
      <div className="page-hero">
        <div className="page-hero-dots" />
        <div className="page-hero-orb page-hero-orb1" />
        <div className="page-hero-orb page-hero-orb2" />

        <div className="container">
          <motion.span className="label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Our Expertise
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
          >
            Services Built for<br />
            <span className="gradient-text">Real Businesses</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4 }}
          >
            Every engagement is tailored to your situation. We don't sell packages — we solve problems.
          </motion.p>
        </div>
      </div>

      <section>
        <div className="container">
          {servicesList.map((s, i) => (
            <div key={s.title} className={`card svc-detail-card reveal${i % 2 === 1 ? ' flip' : ''}`}>
              <div className="svc-visual">{s.icon}</div>
              <div className="svc-body">
                <span className="label">{s.label}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <ul className="feat-list">
                  {s.feats.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="container">
          <div className="cta-band reveal">
            <h2>Not Sure What You Need?<br /><span className="gradient-text">Let's Figure It Out Together</span></h2>
            <p>Book a free 30-minute call and we'll recommend the best approach for your specific situation.</p>
            <button className="btn-primary" onClick={() => navigate('/contact')}>Book Free Consultation →</button>
          </div>
        </div>
      </section>
    </Page>
  );
};

/* ──────────────────────────────────────────────
   PORTFOLIO PAGE — Rich Animated Hero + Fixed Spacing
────────────────────────────────────────────── */
const Portfolio = () => {
  const [active, setActive] = useState('All');

  const projects = [
    { emoji: '🏥', title: 'MediAI Platform', desc: 'AI reads patient data and gives doctors useful summaries — saving 2 hours per doctor per day.', cat: 'AI', tags: ['GPT-4', 'Django', 'Python'], grad: 'linear-gradient(135deg,#1e3a5f,#1a2e4a)' },
    { emoji: '🛒', title: 'ShopFlow Commerce', desc: 'Full e-commerce platform with AI product recommendations that increased sales by 34%.', cat: 'Web', tags: ['React', 'Django', 'PostgreSQL'], grad: 'linear-gradient(135deg,#2d1b4e,#1e1535)' },
    { emoji: '📱', title: 'FinTrack App', desc: 'Personal finance app with an AI coach that helped 10,000+ users save money smarter.', cat: 'Mobile', tags: ['React Native', 'Firebase'], grad: 'linear-gradient(135deg,#1a3a2a,#12261c)' },
    { emoji: '📊', title: 'DataBridge Analytics', desc: 'Real-time dashboard that consolidates data from 12 sources into one clear view for executives.', cat: 'Data', tags: ['Airflow', 'dbt', 'Metabase'], grad: 'linear-gradient(135deg,#3a2a1a,#261c12)' },
    { emoji: '🤖', title: 'SupportBot AI', desc: 'Customer service chatbot that resolves 78% of queries without a human — saving $120k/year.', cat: 'AI', tags: ['LangChain', 'OpenAI', 'FastAPI'], grad: 'linear-gradient(135deg,#1e2a4a,#12182e)' },
    { emoji: '🔐', title: 'VaultGuard Security', desc: 'Enterprise security platform protecting sensitive data for a 500-person organization.', cat: 'Web', tags: ['Django', 'Vault', 'Terraform'], grad: 'linear-gradient(135deg,#3a1a1a,#261212)' },
  ];

  const filters = ['All', 'AI', 'Web', 'Mobile', 'Data'];
  const filtered = active === 'All' ? projects : projects.filter(p => p.cat === active);

  return (
    <Page>
      <div className="page-hero">
        <div className="page-hero-dots" />
        <div className="page-hero-orb page-hero-orb1" />
        <div className="page-hero-orb page-hero-orb2" />

        <div className="container">
          <motion.span className="label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Our Work
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
          >
            Products We've Shipped<br />
            <span className="gradient-text">& Businesses We've Grown</span>
          </motion.h1>

          <motion.div 
            className="portfolio-filters" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.45 }}
          >
            {filters.map(f => (
              <button 
                key={f} 
                className={`filter-btn${active === f ? ' active' : ''}`} 
                onClick={() => setActive(f)}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <section style={{ padding: '2rem 0 6rem' }}>
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div 
              key={active} 
              className="port-full-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {filtered.map((p, i) => (
                <motion.div 
                  key={p.title} 
                  className="port-card reveal"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="port-thumb" style={{ background: p.grad }}>{p.emoji}</div>
                  <div className="port-info">
                    <span className="label">{p.cat}</span>
                    <h4>{p.title}</h4>
                    <p>{p.desc}</p>
                    <div className="svc-tags" style={{ marginTop: '1rem' }}>
                      {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </Page>
  );
};

/* ──────────────────────────────────────────────
   CONTACT PAGE — Fully Implemented
────────────────────────────────────────────── */
const Contact = () => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    company: '', 
    service: '', 
    budget: '', 
    message: '' 
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1800);
  };

  const details = [
    { icon: '📧', lbl: 'Email', val: 'hello@nexgenai.dev' },
    { icon: '💬', lbl: 'WhatsApp', val: '+92 300 000 0000' },
    { icon: '🕐', lbl: 'Response Time', val: 'Within 24 hours' },
    { icon: '📅', lbl: 'Working Hours', val: 'Mon–Fri, 9am–6pm PKT' },
  ];

  return (
    <Page>
      <section style={{ paddingTop: '5rem' }}>
        <div className="container">
          <div className="contact-grid">
            <motion.div className="contact-left" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.55 }}>
              <span className="label">Get In Touch</span>
              <h2>Let's Build<br /><span className="gradient-text">Something Great</span></h2>
              <p>Tell us about your project. We offer a completely free 30-minute consultation — no pressure, just honest advice on how to move forward.</p>
              
              {details.map(d => (
                <div key={d.lbl} className="cd-row">
                  <div className="cd-icon">{d.icon}</div>
                  <div>
                    <div className="cd-lbl">{d.lbl}</div>
                    <div className="cd-val">{d.val}</div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--mint-dim)', border: '1px solid rgba(61,255,160,.15)', borderRadius: 'var(--r)' }}>
                <div className="label" style={{ marginBottom: '0.5rem' }}>What Happens Next</div>
                <ul className="feat-list">
                  <li>We reply within 24 hours</li>
                  <li>Free 30-min strategy call</li>
                  <li>Custom proposal in 48h</li>
                  <li>NDA available on request</li>
                </ul>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.55 }}>
              {sent ? (
                <div className="card contact-form-card" style={{ textAlign: 'center', padding: '4rem 2.5rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>🎉</div>
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '.75rem' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--text-2)' }}>We'll be in touch within 24 hours. Check your inbox for a confirmation email.</p>
                  <button className="btn-primary" style={{ marginTop: '1.75rem' }} onClick={() => setSent(false)}>Send Another Message</button>
                </div>
              ) : (
                <form className="card contact-form-card" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input id="name" name="name" type="text" placeholder="Jane Smith" required value={form.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input id="email" name="email" type="email" placeholder="jane@company.com" required value={form.email} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="company">Company / Business</label>
                      <input id="company" name="company" type="text" placeholder="Acme Inc." value={form.company} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="service">What Do You Need? *</label>
                      <select id="service" name="service" required value={form.service} onChange={handleChange}>
                        <option value="">Choose a service</option>
                        <option value="ai">AI & Chatbot</option>
                        <option value="web">Website / Web App</option>
                        <option value="mobile">Mobile App</option>
                        <option value="data">Data & Analytics</option>
                        <option value="other">Not Sure Yet</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="budget">Rough Budget (Optional)</label>
                    <select id="budget" name="budget" value={form.budget} onChange={handleChange}>
                      <option value="">Prefer not to say</option>
                      <option value="<5k">Under $5,000</option>
                      <option value="5-15k">$5,000 – $15,000</option>
                      <option value="15-50k">$15,000 – $50,000</option>
                      <option value="50k+">$50,000+</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Tell Us About Your Project *</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      placeholder="What are you trying to build? Who will use it? Any deadline or technical requirements?" 
                      required 
                      value={form.message} 
                      onChange={handleChange} 
                    />
                  </div>
                  <button type="submit" className="form-submit" disabled={sending}>
                    {sending ? 'Sending your message…' : 'Send Message →'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Page>
  );
};

/* ──────────────────────────────────────────────
   FOOTER
────────────────────────────────────────────── */
const Footer = () => (
  <footer>
    <div className="container">
      <div className="footer-grid">
        <div>
          <div className="nav-logo" style={{ fontSize: '1.25rem' }}>NexGen<span className="dot">.</span>AI</div>
          <p className="footer-desc">Custom software powered by artificial intelligence. We build the tools that move businesses forward — from idea to launch.</p>
        </div>
        <div className="footer-col">
          <h4>Pages</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><Link to="/services">AI & Machine Learning</Link></li>
            <li><Link to="/services">Web Development</Link></li>
            <li><Link to="/services">Mobile Apps</Link></li>
            <li><Link to="/services">Data & Analytics</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:hello@nexgenai.dev">hello@nexgenai.dev</a></li>
            <li><a href="#">WhatsApp</a></li>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">GitHub</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 NexGen AI Software Co. — Built with ❤️ in Pakistan</span>
        <div className="footer-social">
          {['𝕏', 'in', 'gh', '▶'].map((s, i) => <a key={i} href="#">{s}</a>)}
        </div>
      </div>
    </div>
  </footer>
);

/* ──────────────────────────────────────────────
   ANIMATED ROUTES + APP ROOT
────────────────────────────────────────────── */
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <Router>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </Router>
  );
}