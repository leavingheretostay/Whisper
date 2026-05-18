import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import CosmicCanvas from '../components/CosmicCanvas';

const SAMPLE_MESSAGES = [
  { text: "You have this rare way of making people feel completely seen.", emoji: "✨" },
  { text: "I've never told you this, but you changed my life.", emoji: "🌙" },
  { text: "Your laugh is the best sound in any room.", emoji: "💫" },
  { text: "I think about our conversation from three years ago still.", emoji: "🌌" },
  { text: "You're braver than you know.", emoji: "⭐" },
  { text: "Sometimes I write letters to you that I never send.", emoji: "💌" },
];

const STEPS = [
  {
    number: "01",
    title: "Create your profile",
    desc: "Sign up in seconds. Choose a username that becomes your portal into the unknown.",
    icon: "👤",
  },
  {
    number: "02",
    title: "Share your link",
    desc: "Post your link anywhere. Instagram, X, WhatsApp — wherever your world lives.",
    icon: "🔗",
  },
  {
    number: "03",
    title: "Receive the unspoken",
    desc: "Messages arrive anonymously. Words people have been holding for years.",
    icon: "💬",
  },
];

function FloatingMessage({ text, emoji, delay, x, y }: { text: string; emoji: string; delay: number; x: string; y: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: [0, 0.7, 0.7, 0] }}
      transition={{ delay, duration: 6, repeat: Infinity, repeatDelay: 3 }}
      style={{ position: 'absolute', left: x, top: y, maxWidth: 220, zIndex: 1, pointerEvents: 'none' }}
    >
      <div style={{
        padding: '12px 16px',
        borderRadius: 18,
        fontSize: 12,
        lineHeight: '1.5',
        color: 'rgba(232, 232, 240, 0.7)',
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start',
        backdropFilter: 'blur(16px)',
        background: 'rgba(10, 10, 30, 0.5)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>{emoji}</span>
        <span style={{ fontStyle: 'italic' }}>{text}</span>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setMsgIndex(i => (i + 1) % SAMPLE_MESSAGES.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="page-wrapper" style={{ background: '#060614' }}>
      <CosmicCanvas theme="cosmic" />

      {/* Nav */}
      <nav className="whisper-nav" style={{ zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/auth" className="whisper-btn whisper-btn-ghost" style={{ padding: '9px 20px', fontSize: 14 }}>
            Sign in
          </Link>
          <Link to="/auth?mode=signup" className="whisper-btn whisper-btn-primary" style={{ padding: '9px 20px', fontSize: 14 }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Floating preview messages */}
        <FloatingMessage {...SAMPLE_MESSAGES[0]} delay={0.5} x="3%" y="20%" />
        <FloatingMessage {...SAMPLE_MESSAGES[1]} delay={2} x="60%" y="15%" />
        <FloatingMessage {...SAMPLE_MESSAGES[2]} delay={4} x="62%" y="60%" />
        <FloatingMessage {...SAMPLE_MESSAGES[3]} delay={1} x="2%" y="62%" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0, 0, 0, 1] }}
        >
          <div style={{
            textAlign: 'center',
            maxWidth: 680,
            margin: '0 auto',
            padding: '0 24px',
            position: 'relative',
            zIndex: 3,
          }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32 }}
            >
              <div style={{
                padding: '6px 16px',
                borderRadius: 100,
                fontSize: 12,
                color: 'rgba(167, 139, 250, 0.9)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
                backdropFilter: 'blur(20px)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                ✦ Anonymous. Honest. Beautiful.
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="font-display"
              style={{
                fontSize: 'clamp(36px, 6vw, 68px)',
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: 24,
                background: 'linear-gradient(135deg, #e8e8f8 0%, #c4b5fd 40%, #7eb3fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Where emotions float anonymously in a digital heaven
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                fontSize: 'clamp(16px, 2.2vw, 20px)',
                lineHeight: 1.6,
                color: 'rgba(200, 200, 220, 0.7)',
                marginBottom: 40,
                fontWeight: 300,
              }}
            >
              Receive anonymous thoughts from the people who never say them aloud.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link
                to="/auth?mode=signup"
                className="whisper-btn whisper-btn-primary animate-pulse-glow"
                style={{ fontSize: 16, padding: '16px 36px' }}
              >
                Open your portal ✦
              </Link>
              <Link
                to="/auth"
                className="whisper-btn whisper-btn-ghost"
                style={{ fontSize: 16, padding: '16px 36px' }}
              >
                Sign in
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* 🔧 FIXED: Stats moved OUTSIDE the fading hero div so they don't get cut */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            display: 'flex',
            gap: 32,
            justifyContent: 'center',
            marginTop: 52,
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 3,
            padding: '0 24px',
          }}
        >
          {[
            { val: '100%', label: 'Anonymous' },
            { val: 'Ad-free', label: 'Always' },
            { val: '∞', label: 'Messages' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#a78bfa' }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'rgba(200,200,220,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            zIndex: 3,
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

      {/* Live message preview */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display" style={{ fontSize: 'clamp(26px, 4vw, 40px)', marginBottom: 16, fontWeight: 600, color: '#e8e8f0' }}>
              Words people hold in silence
            </h2>
            <p style={{ color: 'rgba(200,200,220,0.55)', marginBottom: 48 }}>
              Anonymous messages waiting to reach you
            </p>
          </motion.div>

          <div style={{ position: 'relative', height: 120 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={msgIndex}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.96 }}
                transition={{ duration: 0.5 }}
                className="glass-strong"
                style={{
                  padding: '24px 32px',
                  borderRadius: 24,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  position: 'absolute',
                  width: '100%',
                  left: 0,
                }}
              >
                <span style={{ fontSize: 28 }}>{SAMPLE_MESSAGES[msgIndex].emoji}</span>
                <p style={{ margin: 0, fontStyle: 'italic', fontSize: 17, lineHeight: 1.5, color: 'rgba(232,232,240,0.85)', textAlign: 'left' }}>
                  "{SAMPLE_MESSAGES[msgIndex].text}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <h2 className="font-display" style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 600, marginBottom: 12 }}>
              How it works
            </h2>
            <p style={{ color: 'rgba(200,200,220,0.5)' }}>Three simple steps to open the door</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass"
                style={{ padding: '32px 28px', borderRadius: 24, textAlign: 'center' }}
              >
                <div style={{ fontSize: 40, marginBottom: 16 }}>{step.icon}</div>
                <div style={{ fontSize: 11, color: 'rgba(167,139,250,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>
                  Step {step.number}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10, color: '#e8e8f0' }}>{step.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(200,200,220,0.6)', margin: 0 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <h2 className="font-display" style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 600, marginBottom: 12 }}>
              Built for the soul
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { icon: '🔒', title: 'Fully Anonymous', desc: 'No identity. No trace. Pure honesty.' },
              { icon: '✨', title: 'AI Moderation', desc: 'Toxic messages never reach you.' },
              { icon: '💌', title: 'Favorite Messages', desc: 'Keep the ones that move you.' },
              { icon: '📱', title: 'Share Anywhere', desc: 'Instagram, X, WhatsApp ready.' },
              { icon: '🌙', title: 'Mood Themes', desc: 'Cosmic, Aurora, Nebula, Celestial.' },
              { icon: '🔥', title: 'Daily Streaks', desc: 'Stay connected, keep the fire.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass"
                style={{ padding: '24px 20px', borderRadius: 20, textAlign: 'center' }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#e8e8f0' }}>{f.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(200,200,220,0.5)', lineHeight: 1.5 }}>{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '100px 24px 120px', position: 'relative', zIndex: 3, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div style={{
            maxWidth: 560,
            margin: '0 auto',
            padding: '56px 40px',
            borderRadius: 32,
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

      {/* Footer */}
      <footer style={{ padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 3, textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'rgba(200,200,220,0.3)', margin: 0 }}>
          ✦ Whisper — Where thoughts travel anonymously. Made with intention by Nasir Lone.
        </p>
      </footer>
    </div>
  );
}