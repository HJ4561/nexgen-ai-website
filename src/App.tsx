import React, { useState, useEffect, useRef } from 'react';
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
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ──────────────────────────────────────────────
   COUNTER ANIMATION HOOK
────────────────────────────────────────────── */
function useCounter(target: number, duration: number = 1600, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ──────────────────────────────────────────────
   SCROLL TO TOP
────────────────────────────────────────────── */
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <button className={`scroll-top${visible ? ' visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top">↑</button>
  );
};

/* ──────────────────────────────────────────────
   PAGE WRAPPER
────────────────────────────────────────────── */
const Page = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [location.pathname]);
  useReveal();
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const links = [['/', 'Home'], ['/services', 'Services'], ['/products', 'Products'], ['/contact', 'Contact']];
  const isActive = (p: string) => p === '/' ? location.pathname === '/' : location.pathname.startsWith(p);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <Link to="/" className="nav-logo">NexGen<span className="dot">.</span>AI</Link>
        <ul className="nav-links">
          {links.map(([path, label]) => (
            <li key={path}><Link to={path} className={isActive(path) ? 'active' : ''}>{label}</Link></li>
          ))}
        </ul>
        <Link to="/contact" className="nav-cta">Get a Quote</Link>
        <button className="nav-mobile-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">{menuOpen ? '✕' : '☰'}</button>
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
   STAT ITEM
────────────────────────────────────────────── */
const StatItem = ({ icon, numRaw, label, color, glow }: { icon: string; numRaw: string; label: string; color: string; glow: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const num = parseInt(numRaw.replace(/\D/g, ''));
  const suffix = numRaw.replace(/[\d]/g, '');
  const count = useCounter(num, 1400, visible);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.4 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`stat-item${visible ? ' visible' : ''}`}>
      <div className="stat-glow" style={{ background: glow }} />
      <div className="stat-icon-ring" style={{ background: `${color}16`, border: `1px solid ${color}22` }}>
        <span>{icon}</span>
      </div>
      <div className="stat-number gradient-text">{visible ? count : 0}{suffix}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-bar" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  );
};

/* ──────────────────────────────────────────────
   PROCESS VISUAL CARD
────────────────────────────────────────────── */
const ProcessVisualCard = ({
  stepNum, title, desc, items, icon
}: { stepNum: string; title: string; desc: string; items: string[]; icon: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => setInView(e.intersectionRatio > 0.5),
      { threshold: 0.5 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="process-step-visual">
      <div className={`psv-card${inView ? ' in-view' : ''}`}>
        <div className="psv-step-label">Step {stepNum}</div>
        <div className="psv-title">{title}</div>
        <div className="psv-desc">{desc}</div>
        <div className="psv-items">
          {items.map(item => <span key={item} className="psv-item">{item}</span>)}
        </div>
        <div className="psv-icon">{icon}</div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────
   HOME PAGE
────────────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();

  const services = [
    { icon: '🤖', title: 'AI & Machine Learning', desc: 'From smart chatbots to predictive analytics — we connect your business to cutting-edge AI that actually works.', tags: ['GPT-4', 'LangChain', 'Python', 'RAG'] },
    { icon: '🌐', title: 'Web Development', desc: 'Fast, beautiful websites and powerful web apps built to scale — from landing pages to full enterprise platforms.', tags: ['Django', 'React', 'PostgreSQL', 'Docker'] },
    { icon: '📱', title: 'Mobile Apps', desc: 'iOS and Android apps that feel native, look stunning, and keep users coming back. Built for real-world scale.', tags: ['React Native', 'Expo', 'Firebase'] },
    { icon: '🔒', title: 'Cloud & Security', desc: 'Rock-solid cloud infrastructure so your app never goes down and your data stays safe as you grow.', tags: ['AWS', 'Terraform', 'CI/CD'] },
    { icon: '📊', title: 'Data & Analytics', desc: 'Turn raw data into clear decisions. Custom dashboards that show exactly what\'s working — and what\'s not.', tags: ['Airflow', 'dbt', 'Metabase'] },
    { icon: '💬', title: 'Chatbots & Automation', desc: 'Free your team from repetitive tasks. Our automations handle emails, bookings, and follow-ups without human effort.', tags: ['OpenAI', 'n8n', 'Zapier'] },
  ];

  const stats = [
    { icon: '🚀', numRaw: '50+', label: 'Projects Shipped', color: '#3dffa0', glow: 'radial-gradient(circle, rgba(61,255,160,.2), transparent 70%)' },
    { icon: '❤️', numRaw: '30+', label: 'Happy Clients', color: '#ff6b6b', glow: 'radial-gradient(circle, rgba(255,107,107,.18), transparent 70%)' },
    { icon: '⭐', numRaw: '99%', label: 'Satisfaction Rate', color: '#ffb347', glow: 'radial-gradient(circle, rgba(255,179,71,.18), transparent 70%)' },
    { icon: '⚡', numRaw: '3yrs', label: 'Of Excellence', color: '#4f8ef7', glow: 'radial-gradient(circle, rgba(79,142,247,.18), transparent 70%)' },
  ];

  const steps = [
    { num: '01', title: 'We Listen First', desc: 'A free call to understand your goals, users, and what success looks like. No jargon, just honest conversation.', items: ['Discovery Call', 'Goal Mapping', 'Feasibility Check'], icon: '🎧' },
    { num: '02', title: 'We Design a Blueprint', desc: 'Before writing a single line of code, we show you exactly what we\'re building — wireframes, flows, and a clear plan.', items: ['Wireframes', 'User Flows', 'Tech Stack'], icon: '🗺️' },
    { num: '03', title: 'We Build & Test', desc: 'Clean, maintainable code built in sprints. We test everything rigorously so you launch with confidence.', items: ['Agile Sprints', 'QA Testing', 'Weekly Demos'], icon: '⚙️' },
    { num: '04', title: 'We Launch & Support', desc: 'We deploy and stay by your side — monitoring performance, fixing issues, and adding features as you grow.', items: ['Deployment', 'Monitoring', 'Ongoing Support'], icon: '🚀' },
  ];

  const testimonials = [
    { name: 'Sarah K.', role: 'CTO, HealthTech Startup', quote: 'NexGen AI built our entire ML pipeline in 6 weeks. The quality was extraordinary — they genuinely understood our domain.', color: '#3dffa0' },
    { name: 'Omar R.', role: 'Founder, E-Commerce Co.', quote: 'Our platform now handles 100k daily users without breaking a sweat. They explained every decision in plain English.', color: '#4f8ef7' },
    { name: 'Priya M.', role: 'Product Manager, FinTech', quote: 'The mobile app exceeded every expectation. Users keep telling us it\'s the smoothest app they\'ve used. World-class work.', color: '#a78bfa' },
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
              <motion.div className="hero-badge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <span className="badge-dot" />
                <span className="label" style={{ margin: 0 }}>Open for new projects</span>
              </motion.div>
              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                We Build Software<br />
                <span className="gradient-text">That Actually Works</span>
              </motion.h1>
              <motion.p
                className="hero-subtext"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
              >
                From AI-powered chatbots to complete mobile apps — we turn your business idea into polished, working software. No fluff, just results.
              </motion.p>
              <motion.div className="hero-btns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.46 }}>
                <button className="btn-primary" onClick={() => navigate('/contact')}>Start Your Project →</button>
                <button className="btn-ghost" onClick={() => navigate('/products')}>See Our Products</button>
              </motion.div>
              <motion.div className="hero-trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.62 }}>
                <div className="trust-avatars">
                  {['#3dffa0','#4f8ef7','#a78bfa','#ffb347'].map((c, i) => (
                    <div key={i} className="trust-av" style={{ background: c }}>{['S','O','P','A'][i]}</div>
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
                  <div className="ps-bar" /><div className="ps-bar b2" /><div className="ps-bar b3" />
                  <div className="ps-chart" />
                  <div className="ps-mini"><div className="ps-mini-row" /><div className="ps-mini-row short" /></div>
                  <div className="ps-mini"><div className="ps-mini-row" /><div className="ps-mini-row short" /></div>
                </div>
              </div>
              <div className="float-chip chip-1"><span className="fc-icon">🚀</span><div><div className="fc-lbl">Projects Done</div><div className="fc-val">50+</div></div></div>
              <div className="float-chip chip-2"><span className="fc-icon">⭐</span><div><div className="fc-lbl">Satisfaction</div><div className="fc-val">99%</div></div></div>
              <div className="float-chip chip-3"><span className="fc-icon">⚡</span><div><div className="fc-lbl">Avg Delivery</div><div className="fc-val">6 wks</div></div></div>
              <div className="float-chip chip-4"><span className="fc-icon">🤖</span><div><div className="fc-lbl">AI Models</div><div className="fc-val">GPT-4</div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...Array(2)].map((_, ri) =>
            ['AI Development','Web Apps','Mobile Apps','Machine Learning','Cloud Infrastructure','Data Pipelines','Chatbots','Django','React Native','OpenAI'].map((t, i) => (
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
            <h2 className="section-title">Everything Your Business Needs,<br /><span className="gradient-text">Under One Roof</span></h2>
            <p>You don't need five different agencies. We handle AI, web, mobile, and data with one seamless team.</p>
          </div>
          <div className="services-grid stagger reveal">
            {services.map((s, i) => (
              <div key={s.title} className={`service-card reveal d${(i % 5) + 1}`}>
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
      <section className="stats-section">
        <div className="stats-bg" />
        <div className="container">
          <div className="section-head reveal" style={{ marginBottom: 'clamp(1.75rem,3vw,2.5rem)' }}>
            <span className="label">By The Numbers</span>
            <h2 className="section-title">Results That <span className="gradient-text">Speak Loudly</span></h2>
            <p>Real numbers from real projects — we let our track record do the talking.</p>
          </div>
          <div className="stats-grid">
            {stats.map(s => (
              <StatItem key={s.label} icon={s.icon} numRaw={s.numRaw} label={s.label} color={s.color} glow={s.glow} />
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process-section">
        <div className="container">
          <div className="section-head reveal">
            <span className="label">How It Works</span>
            <h2 className="section-title">From Idea to Launch —<br /><span className="gradient-text">Simple as That</span></h2>
            <p>We've streamlined everything so you focus on your business while we handle the technical heavy lifting.</p>
          </div>

          <div className="process-wrapper">
            <div className="process-steps-col">
              <div className="process-scroll-area">
                {steps.map((s) => (
                  <div key={s.num} className="step-item active">
                    <div className="step-num">{s.num}</div>
                    <div className="step-body">
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="process-visual-col">
              <div className="process-scroll-steps">
                {steps.map(s => (
                  <ProcessVisualCard key={s.num} stepNum={s.num} title={s.title} desc={s.desc} items={s.items} icon={s.icon} />
                ))}
              </div>
            </div>
          </div>

          <div className="process-mobile-steps">
            {steps.map((s, i) => (
              <div key={s.num} className={`step-item active reveal d${i + 1}`}>
                <div className="step-num">{s.num}</div>
                <div className="step-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section>
        <div className="container">
          <div className="section-head reveal">
            <span className="label">Why NexGen</span>
            <h2 className="section-title">We're Different —<br /><span className="gradient-text">Here's Why</span></h2>
            <p>Plenty of agencies write code. We go further — becoming your technical partner who genuinely cares.</p>
          </div>
          <div className="features-grid">
            {[
              { icon: '🎯', bg: 'rgba(61,255,160,.12)', title: 'Plain English Communication', desc: "No tech jargon. We explain everything clearly so you always know what's happening and why." },
              { icon: '⏱️', bg: 'rgba(79,142,247,.12)', title: 'Deadlines We Actually Keep', desc: 'Realistic timelines based on experience. Over 95% of our projects launch on or ahead of schedule.' },
              { icon: '💰', bg: 'rgba(255,179,71,.12)', title: 'No Surprise Invoices', desc: "Fixed-price proposals upfront. The price we quote is the price you pay — no scope creep, no hidden extras." },
              { icon: '🤝', bg: 'rgba(167,139,250,.12)', title: 'Your Success Is Our Goal', desc: "We measure our work by one thing: whether your business grows. If you win, we win." },
            ].map((f, i) => (
              <div key={f.title} className={`feat-card reveal d${i + 1}`}>
                <div className="feat-icon" style={{ background: f.bg }}>{f.icon}</div>
                <div><h3>{f.title}</h3><p>{f.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-head reveal">
            <span className="label">Our Products</span>
            <h2 className="section-title">Smart Platforms Built to<br /><span className="gradient-text">Scale Your Business</span></h2>
            <p>We don't just build custom software — we also create powerful products you can use instantly.</p>
          </div>

          <div className="products-grid stagger reveal">
            {[
              { icon: '📋', name: 'PMA', color: '#4f8ef7', desc: 'AI-powered project management that keeps teams aligned and deadlines on track.' },
              { icon: '🎓', name: 'LMS', color: '#a78bfa', desc: 'Smart learning platform with AI-generated quizzes and personalized learning paths.' },
              { icon: '🛍️', name: 'POS', color: '#ffb347', desc: 'Fast, intelligent POS with real-time sales insights and inventory tracking.' },
              { icon: '🛒', name: 'Ecommerce', color: '#3dffa0', desc: 'Launch your online store with AI recommendations and automated marketing.' },
            ].map((p, i) => (
              <div key={p.name} className={`product-card premium reveal d${i + 1}`}>
                <div
                  className="prod-icon-premium"
                  style={{
                    background: `linear-gradient(135deg, ${p.color}28, transparent)`,
                    boxShadow: `0 8px 24px ${p.color}20`
                  }}
                >
                  <span className="prod-emoji">{p.icon}</span>
                </div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <button className="btn-ghost" style={{ marginTop: '0.85rem', padding: '0.5rem 1rem', fontSize: '0.75rem' }} onClick={() => navigate('/products')}>
                  Learn More →
                </button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }} className="reveal">
            <button className="btn-primary" onClick={() => navigate('/products')}>View All Products →</button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section>
        <div className="container">
          <div className="section-head reveal">
            <span className="label">Client Stories</span>
            <h2 className="section-title">Don't Take Our Word,<br /><span className="gradient-text">Take Theirs</span></h2>
          </div>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`testi-card reveal d${i + 1}`}>
                <div className="testi-stars">★★★★★</div>
                <blockquote>"{t.quote}"</blockquote>
                <div className="testi-author">
                  <div className="testi-av" style={{ background: t.color }}>{t.name[0]}</div>
                  <div><div className="testi-name">{t.name}</div><div className="testi-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="container">
          <div className="cta-band reveal">
            <h2 className="section-title">Your Idea Deserves to<br /><span className="gradient-text">Become Reality</span></h2>
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
   SERVICES PAGE — Redesigned
────────────────────────────────────────────── */
const Services = () => {
  const navigate = useNavigate();

  const servicesList = [
    {
      num: '01',
      icon: '🤖',
      label: 'Artificial Intelligence',
      title: 'AI That Works for You',
      desc: 'We make AI accessible to every business — from document summarization to predictive analytics, we integrate intelligence where it actually matters.',
      feats: ['Smart chatbots', 'Document summarization', 'Recommendation engines', 'GPT-4 Integration'],
    },
    {
      num: '02',
      icon: '🌐',
      label: 'Web Development',
      title: 'Websites That Win Customers',
      desc: 'Fast, beautiful, conversion-focused websites and web apps built to scale — from landing pages to enterprise platforms handling millions of users.',
      feats: ['Landing pages', 'E-commerce stores', 'Admin dashboards', 'REST & GraphQL APIs'],
    },
    {
      num: '03',
      icon: '📱',
      label: 'Mobile Development',
      title: 'Apps Your Users Will Love',
      desc: 'Native-feeling iOS and Android apps that users keep coming back to — built with React Native for cross-platform excellence and real-world performance.',
      feats: ['React Native', 'Real-time features', 'Offline support', 'App Store ready'],
    },
    {
      num: '04',
      icon: '📊',
      label: 'Data & Analytics',
      title: "See What's Really Happening",
      desc: "Turn raw data into clear, actionable business insights with custom dashboards and automated reporting systems that update in real time.",
      feats: ['Custom dashboards', 'Automated reports', 'Predictive analytics', 'Data pipelines'],
    },
    {
      num: '05',
      icon: '🔒',
      label: 'Cloud & Security',
      title: 'Infrastructure That Never Fails',
      desc: "Rock-solid cloud setup so your app never goes down, your deployments are smooth, and your data stays secure even at massive scale.",
      feats: ['AWS & GCP', 'Terraform IaC', 'CI/CD pipelines', 'Security audits'],
    },
    {
      num: '06',
      icon: '💬',
      label: 'Automation & Bots',
      title: 'Work Less. Automate More.',
      desc: "Free your team from repetitive manual tasks. Our automations handle emails, bookings, lead follow-ups, and reporting — all without human effort.",
      feats: ['n8n & Zapier', 'WhatsApp bots', 'Email automation', 'CRM integration'],
    },
  ];

  const whyUs = [
    { icon: '🎯', title: 'Domain-Specific Experts', desc: 'We work across industries — fintech, healthcare, retail, and more. We bring relevant context, not generic solutions.' },
    { icon: '📐', title: 'Architecture First', desc: 'Every project starts with solid architecture planning. No technical debt, no painful rewrites later.' },
    { icon: '🔄', title: 'Iterative Delivery', desc: 'Weekly demos and regular check-ins mean you see progress continuously — not just at the end.' },
    { icon: '📞', title: 'Dedicated Point of Contact', desc: 'One person owns your project end-to-end. No handoffs, no confusion, no getting lost in a ticket queue.' },
  ];

  return (
    <Page>
      <div className="page-hero">
        <div className="page-hero-dots" />
        <div className="page-hero-orb page-hero-orb1" />
        <div className="page-hero-orb page-hero-orb2" />
        <div className="container">
          <motion.span className="label" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>Our Expertise</motion.span>
          <motion.h1 className="page-title" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            Services Built for<br /><span className="gradient-text">Real Businesses</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}>
            Every engagement is tailored to your situation. We don't sell packages — we solve problems.
          </motion.p>
        </div>
      </div>

      {/* Services grid — new flat layout */}
      <section>
        <div className="container">
          <div className="services-page-grid reveal">
            {servicesList.map((s) => (
              <div key={s.title} className="svc-detail-new">
                <span className="svc-num">{s.num}</span>
                <span className="svc-icon-lg">{s.icon}</span>
                <span className="label" style={{ marginBottom: '0.5rem', display: 'block' }}>{s.label}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="svc-feats">
                  {s.feats.map(f => <span key={f} className="svc-feat-tag">{f}</span>)}
                </div>
                <div className="svc-bg-num">{s.num}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-head reveal">
            <span className="label">Our Approach</span>
            <h2 className="section-title">How We're<br /><span className="gradient-text">Built Differently</span></h2>
          </div>
          <div className="features-grid reveal">
            {whyUs.map((f, i) => (
              <div key={f.title} className={`feat-card d${i + 1}`}>
                <div className="feat-icon" style={{ background: 'rgba(61,255,160,0.1)' }}>{f.icon}</div>
                <div><h3>{f.title}</h3><p>{f.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section>
        <div className="container">
          <div className="section-head reveal">
            <span className="label">Our Process</span>
            <h2 className="section-title">From Brief to<br /><span className="gradient-text">Live Product</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }} className="reveal">
            {[
              { num: '01', title: 'Discovery', desc: 'Free call to map goals, users, and feasibility.' },
              { num: '02', title: 'Blueprint', desc: 'Wireframes, user flows, and tech stack selection.' },
              { num: '03', title: 'Build', desc: 'Agile sprints with weekly demos and QA at every step.' },
              { num: '04', title: 'Launch', desc: 'Deploy, monitor, iterate. We stay for the long haul.' },
            ].map((step, i) => (
              <div key={step.num} style={{ padding: 'clamp(1.25rem,2.5vw,1.75rem)', background: 'var(--bg-2)', position: 'relative' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-3)', letterSpacing: '0.12em', marginBottom: '0.85rem' }}>{step.num}</div>
                <h3 style={{ fontSize: 'clamp(0.88rem,1.4vw,0.98rem)', marginBottom: '0.3rem' }}>{step.title}</h3>
                <p style={{ fontSize: 'clamp(0.75rem,1.1vw,0.8rem)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="cta-band reveal">
            <h2 className="section-title">Not Sure What You Need?<br /><span className="gradient-text">Let's Figure It Out Together</span></h2>
            <p>Book a free 30-minute call and we'll recommend the best approach for your specific situation.</p>
            <button className="btn-primary" onClick={() => navigate('/contact')}>Book Free Consultation →</button>
          </div>
        </div>
      </section>
    </Page>
  );
};

/* ──────────────────────────────────────────────
   PRODUCTS PAGE — Redesigned
────────────────────────────────────────────── */
const Products = () => {
  const navigate = useNavigate();

  const products = [
    {
      accent: 'blue',
      badge: 'AI-Powered · Productivity',
      icon: '📋',
      name: 'PMA',
      title: 'Projects Delivered. On Time, Every Time.',
      headline: 'The AI-driven project management platform that keeps teams aligned, deadlines met, and resources optimized.',
      desc: 'PMA uses AI to auto-assign tasks based on team capacity, predict project delays before they happen, surface bottlenecks early, and generate progress reports — so your managers lead, not administrate.',
      tags: ['AI Task Prioritization', 'Gantt Charts', 'Team Chat', 'Resource Management', 'Risk Detection', 'Time Tracking'],
      cta: 'Request Early Access',
      glowColor: 'rgba(79,142,247,0.08)',
    },
    {
      accent: 'purple',
      badge: 'AI-Powered · EdTech',
      icon: '🎓',
      name: 'LMS',
      title: 'Teach Smarter. Learn Faster.',
      headline: 'A next-gen LMS that adapts to every learner — personalized course paths, real-time progress tracking, and AI-generated assessments.',
      desc: 'From solo tutors to enterprise training teams — our LMS uses AI to close knowledge gaps, auto-generate quizzes from content, and keep learners engaged with adaptive pacing.',
      tags: ['AI Learning Paths', 'Course Builder', 'Live & Recorded Classes', 'Quizzes & Grading', 'Analytics', 'Certificates'],
      cta: 'Start Free Trial',
      glowColor: 'rgba(167,139,250,0.08)',
    },
    {
      accent: 'orange',
      badge: 'AI-Powered · Retail & F&B',
      icon: '🛍️',
      name: 'POS',
      title: 'Sell More. Manage Less.',
      headline: 'A blazing-fast, AI-enhanced POS built for retail shops, restaurants, and service counters with smart inventory and real-time insights.',
      desc: "Our POS doesn't just process transactions — it predicts your bestsellers, flags slow inventory, suggests upsells at checkout, and gives you a full financial picture in real time.",
      tags: ['Fast Checkout', 'AI Demand Forecasting', 'Inventory Alerts', 'Multi-Location', 'Sales Analytics', 'Loyalty & CRM'],
      cta: 'Get a Free Demo',
      glowColor: 'rgba(251,146,60,0.08)',
    },
    {
      accent: 'mint',
      badge: 'AI-Powered · Online Selling',
      icon: '🛒',
      name: 'Ecommerce',
      title: 'Your Store. Your Rules. Powered by AI.',
      headline: 'Launch and scale your online store with an AI-first ecommerce engine — smart recommendations, automated marketing, and conversion-optimized storefronts.',
      desc: "Sell 10 products or 10,000 — our platform uses AI to personalize every shopper's journey, write product descriptions, recover lost carts, and grow your revenue on autopilot.",
      tags: ['AI Recommendations', 'Drag & Drop Builder', 'Multi-Currency', 'Cart Recovery', 'SEO Engine', 'Integrated Payments'],
      cta: 'Launch Your Store',
      glowColor: 'rgba(61,255,160,0.08)',
    },
  ];

  return (
    <Page>
      <div className="page-hero">
        <div className="page-hero-dots" />
        <div className="page-hero-orb page-hero-orb1" />
        <div className="page-hero-orb page-hero-orb2" />
        <div className="container">
          <motion.span className="label" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>Our Products</motion.span>
          <motion.h1 className="page-title" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            Four Platforms.<br /><span className="gradient-text">One Intelligent Vision.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}>
            Intelligent software that works for you — built for project managers, educators, retailers, and online sellers alike.
          </motion.p>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="products-page-grid reveal">
            {products.map((p) => (
              <div key={p.name} className="product-row">
                {/* Info side */}
                <div className="product-row-info">
                  <div className={`prod-badge product-card ${p.accent}`} style={{ display: 'inline-flex', background: 'none', border: 'none', padding: 0 }}>
                    <span className={`prod-badge ${p.accent}`} style={{ marginBottom: 0 }}>
                      <span className="spark">⚡</span>{p.badge}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 'clamp(1rem,1.8vw,1.2rem)', fontWeight: 800, marginBottom: '0.2rem', marginTop: '0.1rem' }}>{p.name}</h3>
                  <div className="prod-headline">{p.title}</div>
                  <p style={{ fontSize: 'clamp(0.76rem,1.1vw,0.83rem)', marginBottom: '0.9rem', lineHeight: 1.7 }}>{p.desc}</p>
                  <div className="prod-tags">
                    {p.tags.map(t => <span key={t} className="prod-tag">{t}</span>)}
                  </div>
                  <button className="prod-cta" onClick={() => navigate('/contact')}>{p.cta} →</button>
                </div>

                {/* Visual side */}
                <div className="product-row-visual">
                  <div className="product-visual-inner" style={{ '--glow-color': p.glowColor } as React.CSSProperties}>
                    <div className="product-visual-grid" />
                    <div className="product-visual-emoji">{p.icon}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison strip */}
      <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-head reveal">
            <span className="label">All Products Include</span>
            <h2 className="section-title">Built on a<br /><span className="gradient-text">Shared Foundation</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }} className="reveal">
            {[
              { icon: '🔐', title: 'Enterprise Security', desc: 'SOC 2-ready, encrypted at rest and in transit.' },
              { icon: '📱', title: 'Mobile-First', desc: 'Every product works beautifully on any device.' },
              { icon: '🔌', title: 'API Access', desc: 'Full REST API to integrate with your existing stack.' },
              { icon: '📊', title: 'Analytics Built-in', desc: 'Understand usage and performance from day one.' },
              // { icon: '🌍', title: 'Multi-language', desc: 'Localization support for global teams and customers.' },
              { icon: '🛠️', title: 'White-label Ready', desc: 'Brand it as your own with full UI customization.' },
            ].map((f) => (
              <div key={f.title} style={{ padding: 'clamp(1.1rem,2.5vw,1.5rem)', background: 'var(--bg-2)' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: 'clamp(0.82rem,1.3vw,0.9rem)', marginBottom: '0.25rem' }}>{f.title}</h3>
                <p style={{ fontSize: 'clamp(0.72rem,1.1vw,0.78rem)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="cta-band reveal">
            <h2 className="section-title">Ready to See These<br /><span className="gradient-text">Products in Action?</span></h2>
            <p>Book a free demo and we'll walk you through whichever platform fits your business best.</p>
            <div className="cta-band-btns">
              <button className="btn-primary" onClick={() => navigate('/contact')}>Book a Demo →</button>
              <button className="btn-ghost" onClick={() => navigate('/services')}>See All Services</button>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
};

/* ──────────────────────────────────────────────
   CONTACT PAGE
────────────────────────────────────────────── */
const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', budget: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1600);
  };

  const details = [
    { icon: '📧', lbl: 'Email', val: 'hello@nexgenai.dev' },
    { icon: '💬', lbl: 'WhatsApp', val: '+92 300 000 0000' },
    { icon: '🕐', lbl: 'Response Time', val: 'Within 24 hours' },
    { icon: '📅', lbl: 'Working Hours', val: 'Mon–Fri, 9am–6pm PKT' },
  ];

  return (
    <Page>
      <section style={{ paddingTop: 'clamp(2.5rem,5vw,4rem)' }}>
        <div className="container">
          <div className="contact-grid">
            <motion.div className="contact-left" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
              <span className="label">Get In Touch</span>
              <h2>Let's Build<br /><span className="gradient-text">Something Great</span></h2>
              <p>Tell us about your project. We offer a completely free 30-minute consultation — no pressure, just honest advice.</p>
              {details.map(d => (
                <div key={d.lbl} className="cd-row">
                  <div className="cd-icon">{d.icon}</div>
                  <div><div className="cd-lbl">{d.lbl}</div><div className="cd-val">{d.val}</div></div>
                </div>
              ))}
              <div style={{ marginTop: '1.75rem', padding: '1.2rem', background: 'var(--mint-dim)', border: '1px solid rgba(61,255,160,0.12)', borderRadius: 'var(--r)' }}>
                <div className="label" style={{ marginBottom: '0.4rem' }}>What Happens Next</div>
                <ul className="feat-list">
                  <li>We reply within 24 hours</li>
                  <li>Free 30-min strategy call</li>
                  <li>Custom proposal in 48h</li>
                  <li>NDA available on request</li>
                </ul>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22, duration: 0.5 }}>
              {sent ? (
                <div className="card contact-form-card" style={{ textAlign: 'center', padding: 'clamp(2rem,4vw,3.5rem) clamp(1.5rem,3vw,2.5rem)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                  <h3 style={{ fontSize: 'clamp(1.1rem,2vw,1.3rem)', fontWeight: 800, marginBottom: '0.55rem' }}>Message Sent!</h3>
                  <p>We'll be in touch within 24 hours. Check your inbox for a confirmation email.</p>
                  <button className="btn-primary" style={{ marginTop: '1.35rem' }} onClick={() => setSent(false)}>Send Another Message</button>
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
                        <option value="pma">PMA — Project Management</option>
                        <option value="lms">LMS — Learning Platform</option>
                        <option value="pos">POS System</option>
                        <option value="ecom">Ecommerce Platform</option>
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
                    <textarea id="message" name="message" placeholder="What are you trying to build? Who will use it? Any deadline or technical requirements?" required value={form.message} onChange={handleChange} />
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
          <div className="nav-logo" style={{ fontSize: '1.05rem' }}>NexGen<span className="dot">.</span>AI</div>
          <p className="footer-desc">Custom software powered by AI. We build the tools that move businesses forward — from idea to launch.</p>
        </div>
        <div className="footer-col">
          <h4>Pages</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Products</h4>
          <ul>
            <li><Link to="/products">PMA — Project Mgmt</Link></li>
            <li><Link to="/products">LMS — Learning System</Link></li>
            <li><Link to="/products">POS System</Link></li>
            <li><Link to="/products">Ecommerce Platform</Link></li>
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
   APP ROOT
────────────────────────────────────────────── */
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/products" element={<Products />} />
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