import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import CosmicCanvas from '../components/CosmicCanvas';

const SAMPLE_MESSAGES = [
  { text: "MY ATOMS LOVE YOUR ATOMS, IT'S CHEMISTRY.", icon: "sparkle" },
  { text: "Chase your stars fool, life is short.", icon: "star" },
  { text: "IT'S A LONELY THING, PROTECTING A BREAKABLE HEART.", icon: "heart" },
  { text: "New love is the best cure for old love gone bad.", icon: "moon" },
  { text: "In all you do, absolutely everything, may love be the core, may love be the essence.", icon: "galaxy" },
  { text: "Simply touching you is poetry enough.", icon: "envelope" },
  { text: "Don't believe everything you know for sure.", icon: "sparkle" },
  { text: "I'm tired of their stories lets write our own you are braver than you know.", icon: "star" },
  { text: "Sometimes I write letters to you that I never send.", icon: "moon" },
];

const STEPS = [
  { number: "01", title: "Create your profile", desc: "Sign up in seconds. Choose a username that becomes your portal into the unknown." },
  { number: "02", title: "Share your link", desc: "Post your link anywhere. Instagram, X, WhatsApp — wherever your world lives." },
  { number: "03", title: "Receive the unspoken", desc: "Messages arrive anonymously. Words people have been holding for years." },
];

const Icon3D = ({ type, size = 40 }: { type: string; size?: number }) => {
  const s = size;
  const half = s / 2;
  const common: React.CSSProperties = {
    width: s, height: s, position: 'relative', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center',
  };

  if (type === 'sparkle') {
    return (
      <div style={common}>
        <div style={{
          width: '60%', height: '60%', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          borderRadius: '30%', transform: 'rotate(45deg)',
          boxShadow: '0 0 20px rgba(251,191,36,0.6), 0 0 40px rgba(245,158,11,0.3)',
        }} />
      </div>
    );
  }
  if (type === 'moon') {
    return (
      <div style={common}>
        <div style={{
          width: '65%', height: '65%', borderRadius: '50%',
          background: 'linear-gradient(135deg, #e5e7eb, #9ca3af)',
          boxShadow: '0 0 25px rgba(229,231,235,0.5), inset 0 0 10px rgba(0,0,0,0.2)',
        }} />
      </div>
    );
  }
  if (type === 'star') {
    return (
      <div style={common}>
        <div style={{
          width: 0, height: 0, borderLeft: `${half * 0.3}px solid transparent`,
          borderRight: `${half * 0.3}px solid transparent`,
          borderBottom: `${half * 0.6}px solid #a78bfa`,
          filter: 'drop-shadow(0 0 8px #a78bfa)',
        }} />
      </div>
    );
  }
  if (type === 'galaxy') {
    return (
      <div style={common}>
        <div style={{
          width: '65%', height: '65%', borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #4f8ef7, #1e1b4b)',
          boxShadow: '0 0 30px rgba(79,142,247,0.6)',
        }} />
      </div>
    );
  }
  if (type === 'heart') {
    return (
      <div style={{ ...common, transform: 'rotate(-45deg)' }}>
        <div style={{
          width: '50%', height: '50%', background: 'linear-gradient(135deg, #f87171, #dc2626)',
          borderRadius: '0 0 0 10px',
          boxShadow: '0 0 20px rgba(248,113,113,0.6)',
        }} />
      </div>
    );
  }
  if (type === 'envelope') {
    return (
      <div style={common}>
        <div style={{
          width: '70%', height: '50%', background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
          borderRadius: '4px', boxShadow: '0 0 15px rgba(96,165,250,0.5)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
            borderBottom: '10px solid #3b82f6',
          }} />
        </div>
      </div>
    );
  }
  return <div style={{ ...common, background: '#333', borderRadius: '50%' }} />;
};

function FloatingMessage({ text, icon, delay, x, y }: { text: string; icon: string; delay: number; x: string; y: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: [0, 0.7, 0.7, 0] }}
      transition={{ delay, duration: 6, repeat: Infinity, repeatDelay: 3 }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        maxWidth: 180,
        zIndex: 2,
        pointerEvents: 'none',
      }}
    >
      <div style={{
        padding: '10px 14px',
        borderRadius: 16,
        fontSize: 11,
        lineHeight: 1.4,
        color: 'rgba(232, 232, 240, 0.8)',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        backdropFilter: 'blur(14px)',
        background: 'rgba(15, 15, 40, 0.6)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <Icon3D type={icon} size={24} />
        <span style={{ fontStyle: 'italic' }}>{text}</span>
      </div>
    </motion.div>
  );
}

const DesktopFloatingMessages = () => {
  const messages = [
    { ...SAMPLE_MESSAGES[0], delay: 0, x: '2%', y: '12%' },
    { ...SAMPLE_MESSAGES[1], delay: 1.2, x: '75%', y: '10%' },
    { ...SAMPLE_MESSAGES[2], delay: 2.5, x: '5%', y: '45%' },
    { ...SAMPLE_MESSAGES[3], delay: 3.7, x: '78%', y: '40%' },
    { ...SAMPLE_MESSAGES[4], delay: 5, x: '8%', y: '72%' },
    { ...SAMPLE_MESSAGES[5], delay: 6.2, x: '80%', y: '70%' },
    { ...SAMPLE_MESSAGES[6], delay: 1.8, x: '30%', y: '15%' },
    { ...SAMPLE_MESSAGES[7], delay: 3, x: '60%', y: '18%' },
    { ...SAMPLE_MESSAGES[8], delay: 4.3, x: '15%', y: '55%' },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', display: 'none' }} className="desktop-floating">
      {messages.map((msg, i) => (
        <FloatingMessage key={i} text={msg.text} icon={msg.icon} delay={msg.delay} x={msg.x} y={msg.y} />
      ))}
      <style>{`@media (min-width: 768px) { .desktop-floating { display: block !important; } }`}</style>
    </div>
  );
};

function MessageStack({ messages }: { messages: typeof SAMPLE_MESSAGES }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, [messages.length]);

  return (
    <div style={{ position: 'relative', height: 180, maxWidth: 500, margin: '0 auto' }}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute', width: '100%',
            padding: '24px 28px', borderRadius: 24,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(167,139,250,0.2) inset',
            display: 'flex', alignItems: 'center', gap: 20,
          }}
        >
          <Icon3D type={messages[index].icon} size={44} />
          <p style={{
            margin: 0, fontStyle: 'italic', fontSize: 'clamp(14px, 2vw, 17px)',
            lineHeight: 1.5, color: 'rgba(232,232,240,0.9)',
          }}>
            "{messages[index].text}"
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div style={{ position: 'relative', background: '#060614', minHeight: '100vh', overflow: 'hidden' }}>
      <CosmicCanvas theme="cosmic" />

      <nav className="whisper-nav">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>✦</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, letterSpacing: '0.02em' }}>
            Whisper
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/auth" className="whisper-btn whisper-btn-ghost" style={{ padding: '9px 20px', fontSize: 14 }}>
            Sign in
          </Link>
          <Link to="/auth?mode=signup" className="whisper-btn whisper-btn-primary" style={{ padding: '9px 20px', fontSize: 14 }}>
            Get started
          </Link>
        </div>
      </nav>

      <div ref={heroRef} style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '0 24px',
      }}>
        <DesktopFloatingMessages />

        <motion.div
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0, 0, 0, 1] }}
        >
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 5 }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
              <div style={{
                padding: '6px 16px', borderRadius: 100, fontSize: 12,
                color: 'rgba(167, 139, 250, 0.9)', letterSpacing: '0.08em',
                textTransform: 'uppercase', fontWeight: 600,
                backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                ✦ Anonymous. Honest. Beautiful.
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9 }}
              className="font-display" style={{
                fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 600, lineHeight: 1.1,
                letterSpacing: '-0.02em', marginBottom: 24,
                background: 'linear-gradient(135deg, #e8e8f8 0%, #c4b5fd 40%, #7eb3fa 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
              Where emotions float anonymously in a digital heaven
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              style={{
                fontSize: 'clamp(16px, 2.2vw, 20px)', lineHeight: 1.6,
                color: 'rgba(200, 200, 220, 0.7)', marginBottom: 40, fontWeight: 300,
              }}>
              Receive anonymous thoughts from the people who never say them aloud.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
              style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/auth?mode=signup" className="whisper-btn whisper-btn-primary animate-pulse-glow"
                style={{ fontSize: 16, padding: '16px 36px' }}>Open your portal ✦</Link>
              <Link to="/auth" className="whisper-btn whisper-btn-ghost"
                style={{ fontSize: 16, padding: '16px 36px' }}>Sign in</Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 52, flexWrap: 'wrap' }}>
              {[{ val: '100%', label: 'Anonymous' }, { val: 'Ad-free', label: 'Always' }, { val: '∞', label: 'Messages' }].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#a78bfa' }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'rgba(200,200,220,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                marginTop: 60,
                zIndex: 5,
              }}
            >
              <span style={{ fontSize: 11, color: 'rgba(200,200,220,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 1, height: 24, background: 'linear-gradient(to bottom, rgba(167,139,250,0.6), transparent)' }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <section style={{ padding: '12px 24px 16px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(26px, 4vw, 40px)', marginBottom: 16, fontWeight: 600, color: '#e8e8f0' }}>
              Words people hold in silence
            </h2>
            <p style={{ color: 'rgba(200,200,220,0.55)', marginBottom: 48 }}>
              Anonymous messages waiting to reach you
            </p>
          </motion.div>
          <MessageStack messages={SAMPLE_MESSAGES} />
        </div>
      </section>

      <section style={{ padding: '12px 24px 16px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 600, marginBottom: 12 }}>How it works</h2>
            <p style={{ color: 'rgba(200,200,220,0.5)' }}>Three simple steps to open the door</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {STEPS.map((step, i) => (
              <motion.div key={step.number} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glass" style={{ padding: '32px 28px', borderRadius: 24, textAlign: 'center' }}>
                <div style={{ marginBottom: 16, display: 'inline-flex' }}>
                  {i === 0 ? <Icon3D type="sparkle" size={48} /> : i === 1 ? <Icon3D type="envelope" size={48} /> : <Icon3D type="galaxy" size={48} />}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(167,139,250,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>Step {step.number}</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10, color: '#e8e8f0' }}>{step.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(200,200,220,0.6)', margin: 0 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 600, marginBottom: 12 }}>Built for the soul</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { icon: 'sparkle', title: 'Fully Anonymous', desc: 'No identity. No trace. Pure honesty.' },
              { icon: 'star', title: 'AI Moderation', desc: 'Toxic messages never reach you.' },
              { icon: 'heart', title: 'Favorite Messages', desc: 'Keep the ones that move you.' },
              { icon: 'envelope', title: 'Share Anywhere', desc: 'Instagram, X, WhatsApp ready.' },
              { icon: 'moon', title: 'Mood Themes', desc: 'Cosmic, Aurora, Nebula, Celestial.' },
              { icon: 'galaxy', title: 'Daily Streaks', desc: 'Stay connected, keep the fire.' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="glass" style={{ padding: '24px 20px', borderRadius: 20, textAlign: 'center' }}>
                <div style={{ marginBottom: 10, display: 'inline-flex' }}>
                  <Icon3D type={f.icon} size={40} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#e8e8f0' }}>{f.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(200,200,220,0.5)', lineHeight: 1.5 }}>{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 24px 120px', position: 'relative', zIndex: 3, textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{
            maxWidth: 560, margin: '0 auto', padding: '56px 40px', borderRadius: 32,
            background: 'linear-gradient(135deg, rgba(79,142,247,0.1) 0%, rgba(167,139,250,0.1) 100%)',
            border: '1px solid rgba(167,139,250,0.2)',
          }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 600, marginBottom: 16 }}>
              Ready to hear what<br/>the universe thinks of you?
            </h2>
            <p style={{ color: 'rgba(200,200,220,0.6)', marginBottom: 32, fontSize: 16 }}>
              Join thousands who've opened their portal to the unspoken.
            </p>
            <Link to="/auth?mode=signup" className="whisper-btn whisper-btn-primary" style={{ fontSize: 16, padding: '16px 40px' }}>
              Create your portal ✦
            </Link>
          </div>
        </motion.div>
      </section>

      <footer style={{
        padding: '24px 32px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 3,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}>
        <p style={{ fontSize: 13, color: 'rgba(200,200,220,0.3)', margin: 0 }}>
          ✦ Whisper — Where thoughts travel anonymously. Made with ❤️ by Nasir Lone.
        </p>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'center' }}>
          <a
            href="https://instagram.com/nacirlone"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            style={{
              color: 'rgba(200,200,220,0.35)',
              transition: 'color 0.2s ease, transform 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#e1306c'; e.currentTarget.style.transform = 'scale(1.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,200,220,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>

          <a
            href="upi://pay?pa=lonenasir724@okaxis&pn=Whisper&cu=INR"
            title="Donate via UPI"
            style={{
              color: 'rgba(200,200,220,0.35)',
              transition: 'color 0.2s ease, transform 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#34d399'; e.currentTarget.style.transform = 'scale(1.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,200,220,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
            </svg>
          </a>

          <a
            href="mailto:lonenasir724@gmail.com?subject=Whisper%20Bug%20Report"
            title="Report a bug"
            style={{
              color: 'rgba(200,200,220,0.35)',
              transition: 'color 0.2s ease, transform 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.transform = 'scale(1.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,200,220,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
