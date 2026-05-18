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
  { number: "01", title: "Create your profile", desc: "Sign up in seconds. Choose a username that becomes your portal into the unknown.", icon: "👤" },
  { number: "02", title: "Share your link", desc: "Post your link anywhere. Instagram, X, WhatsApp — wherever your world lives.", icon: "🔗" },
  { number: "03", title: "Receive the unspoken", desc: "Messages arrive anonymously. Words people have been holding for years.", icon: "💬" },
];

const FEATURES = [
  { icon: '🔒', title: 'Fully Anonymous', desc: 'No identity. No trace. Pure honesty.' },
  { icon: '✨', title: 'AI Moderation', desc: 'Toxic messages never reach you.' },
  { icon: '💌', title: 'Favorite Messages', desc: 'Keep the ones that move you.' },
  { icon: '📱', title: 'Share Anywhere', desc: 'Instagram, X, WhatsApp ready.' },
  { icon: '🌙', title: 'Mood Themes', desc: 'Cosmic, Aurora, Nebula, Celestial.' },
  { icon: '🔥', title: 'Daily Streaks', desc: 'Stay connected, keep the fire.' },
];

function FloatingMessage({ text, emoji, delay, x, y }: { text: string; emoji: string; delay: number; x: string; y: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: [0, 0.65, 0.65, 0] }}
      transition={{ delay, duration: 7, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        maxWidth: '200px',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    >
      <div style={{
        padding: '12px 16px',
        borderRadius: '16px',
        fontSize: '12px',
        lineHeight: 1.5,
        color: 'rgba(232, 232, 240, 0.75)',
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-start',
        backdropFilter: 'blur(16px)',
        background: 'rgba(15, 15, 40, 0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontSize: '16px', flexShrink: 0 }}>{emoji}</span>
        <span style={{ fontStyle: 'italic' }}>{text}</span>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % SAMPLE_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', background: '#060614', minHeight: '100vh', overflow: 'hidden' }}>
      <CosmicCanvas theme="cosmic" />

      {/* Nav - High z-index to stay above everything */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        background: 'rgba(6, 6, 20, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
          }}>✦</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600 }}>Whisper</span>
        </Link>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            to="/auth"
            className="whisper-btn whisper-btn-ghost"
            style={{ padding: '9px 20px', fontSize: '14px', textDecoration: 'none' }}
          >
            Sign in
          </Link>
          <Link
            to="/auth?mode=signup"
            className="whisper-btn whisper-btn-primary"
            style={{ padding: '9px 20px', fontSize: '14px', textDecoration: 'none' }}
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '80px',
          paddingBottom: '40px',
        }}
      >
        {/* Floating messages container - positioned safely between nav and content */}
        <div style={{
          position: 'absolute',
          top: '100px',
          left: 0,
          right: 0,
          height: '120px',
          zIndex: 2,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          <FloatingMessage {...SAMPLE_MESSAGES[0]} delay={0} x="3%" y="5%" />
          <FloatingMessage {...SAMPLE_MESSAGES[1]} delay={1.5} x="50%" y="20%" />
          <FloatingMessage {...SAMPLE_MESSAGES[2]} delay={3} x="2%" y="55%" />
          <FloatingMessage {...SAMPLE_MESSAGES[3]} delay={4.5} x="55%" y="60%" />
        </div>

        {/* Main content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, zIndex: 5, position: 'relative' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            textAlign: 'center',
            maxWidth: '680px',
            margin: '0 auto',
            padding: '0 24px',
          }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '32px',
              padding: '6px 16px',
              borderRadius: '100px',
              fontSize: '12px',
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

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(36px, 6vw, 68px)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #e8e8f8 0%, #c4b5fd 40%, #7eb3fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Where emotions float anonymously in a digital heaven
            </h1>

            {/* Subheadline */}
            <p style={{
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              lineHeight: 1.6,
              color: 'rgba(200, 200, 220, 0.7)',
              marginBottom: '40px',
              fontWeight: 300,
            }}>
              Receive anonymous thoughts from the people who never say them aloud.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/auth?mode=signup"
                style={{
                  fontSize: '16px',
                  padding: '16px 36px',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)',
                  color: '#fff',
                  fontWeight: 600,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                Open your portal ✦
              </Link>
              <Link
                to="/auth"
                style={{
                  fontSize: '16px',
                  padding: '16px 36px',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(232, 232, 240, 0.9)',
                  fontWeight: 500,
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'background 0.2s ease',
                }}
              >
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats - outside fading hero, stable position */}
        <div style={{
          display: 'flex',
          gap: '40px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '60px',
          zIndex: 5,
          position: 'relative',
          padding: '0 24px',
        }}>
          {[
            { val: '100%', label: 'Anonymous' },
            { val: 'Ad-free', label: 'Always' },
            { val: '∞', label: 'Messages' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#a78bfa' }}>{stat.val}</div>
              <div style={{ fontSize: '12px', color: 'rgba(200,200,220,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          zIndex: 5,
        }}>
          <span style={{ fontSize: '11px', color: 'rgba(200,200,220,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: '1px', height: '24px', background: 'linear-gradient(to bottom, rgba(167,139,250,0.6), transparent)' }}
          />
        </div>
      </div>

      {/* Live Message Preview Section */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', marginBottom: '16px', fontWeight: 600, color: '#e8e8f0' }}>
            Words people hold in silence
          </h2>
          <p style={{ color: 'rgba(200,200,220,0.55)', marginBottom: '48px' }}>
            Anonymous messages waiting to reach you
          </p>

          {/* Message carousel - properly contained */}
          <div style={{
            position: 'relative',
            height: '120px',
            maxWidth: '100%',
            overflow: 'hidden',
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={msgIndex}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.96 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  left: 0,
                  padding: '24px 32px',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  backdropFilter: 'blur(20px)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ fontSize: '28px', flexShrink: 0 }}>{SAMPLE_MESSAGES[msgIndex].emoji}</span>
                <p style={{
                  margin: 0,
                  fontStyle: 'italic',
                  fontSize: '17px',
                  lineHeight: 1.5,
                  color: 'rgba(232,232,240,0.85)',
                  textAlign: 'left',
                }}>
                  "{SAMPLE_MESSAGES[msgIndex].text}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 600, marginBottom: '12px' }}>How it works</h2>
            <p style={{ color: 'rgba(200,200,220,0.5)' }}>Three simple steps to open the door</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                style={{
                  padding: '32px 28px',
                  borderRadius: '24px',
                  textAlign: 'center',
                  backdropFilter: 'blur(20px)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{step.icon}</div>
                <div style={{ fontSize: '11px', color: 'rgba(167,139,250,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 600 }}>
                  Step {step.number}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '10px', color: '#e8e8f0' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(200,200,220,0.6)', margin: 0 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 600, marginBottom: '64px' }}>
            Built for the soul
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                style={{
                  padding: '24px 20px',
                  borderRadius: '20px',
                  textAlign: 'center',
                  backdropFilter: 'blur(20px)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{feature.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#e8e8f0' }}>{feature.title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(200,200,220,0.5)', lineHeight: 1.5 }}>{feature.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '100px 24px 120px', position: 'relative', zIndex: 3, textAlign: 'center' }}>
        <div style={{
          maxWidth: '560px',
          margin: '0 auto',
          padding: '56px 40px',
          borderRadius: '32px',
          background: 'linear-gradient(135deg, rgba(79,142,247,0.1) 0%, rgba(167,139,250,0.1) 100%)',
          border: '1px solid rgba(167,139,250,0.2)',
        }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 600, marginBottom: '16px' }}>
            Ready to hear what<br/>the universe thinks of you?
          </h2>
          <p style={{ color: 'rgba(200,200,220,0.6)', marginBottom: '32px', fontSize: '16px' }}>
            Join thousands who've opened their portal to the unspoken.
          </p>
          <Link
            to="/auth?mode=signup"
            style={{
              fontSize: '16px',
              padding: '16px 40px',
              textDecoration: 'none',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)',
              color: '#fff',
              fontWeight: 600,
              display: 'inline-block',
            }}
          >
            Create your portal ✦
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px 32px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 3,
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '13px', color: 'rgba(200,200,220,0.3)', margin: 0 }}>
          ✦ Whisper — Where thoughts travel anonymously. Made with ❤️ by Nasir Lone.
        </p>
      </footer>
    </div>
  );
}