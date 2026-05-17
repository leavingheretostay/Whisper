import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';
import CosmicCanvas from '../components/CosmicCanvas';

const EMOJIS = ['💫', '🌙', '✨', '💌', '🌌', '⭐', '🔮', '🌊', '🕊️', '🌸', '💭', '🎭'];

const TOXIC_WORDS = ['kill', 'die', 'hate you', 'loser', 'idiot', 'stupid', 'ugly', 'worthless', 'go away'];

function moderateContent(text: string): boolean {
  const lower = text.toLowerCase();
  return TOXIC_WORDS.some(w => lower.includes(w));
}

const PROMPTS = [
  "Something I've always wanted to tell you...",
  "You probably don't know this, but you...",
  "I think about you when...",
  "What I admire most about you is...",
  "You once said something that changed me...",
  "The world is better because you...",
];

export default function SendMessagePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [promptIdx, setPromptIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const MAX_CHARS = 1000;

  useEffect(() => {
    if (!username) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('username', username.toLowerCase())
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile(data);
        else setNotFound(true);
        setLoading(false);
      });
  }, [username]);

  const cyclePrompt = () => {
    setPromptIdx(i => (i + 1) % PROMPTS.length);
  };

  const handleSend = async () => {
    if (!profile || !message.trim()) return;
    setError('');

    if (moderateContent(message)) {
      setError('This message contains content that may be harmful. Please keep whispers kind and honest.');
      return;
    }

    setSending(true);
    const { error: insertError } = await supabase.from('messages').insert({
      recipient_id: profile.id,
      content: message.trim(),
      emoji_reaction: selectedEmoji,
      is_flagged: false,
    });

    if (insertError) {
      setError('Something went wrong. Please try again.');
      setSending(false);
      return;
    }

    setSending(false);
    setSent(true);
  };

  const handleReset = () => {
    setMessage('');
    setSelectedEmoji('');
    setSent(false);
    setError('');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#060614', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CosmicCanvas />
        <div style={{ textAlign: 'center', zIndex: 3, position: 'relative' }}>
          <div className="whisper-spinner" style={{ width: 40, height: 40, margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(200,200,220,0.5)', fontSize: 14 }}>Finding the portal...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', background: '#060614', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CosmicCanvas />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass"
          style={{ padding: '48px 40px', borderRadius: 28, textAlign: 'center', maxWidth: 400, position: 'relative', zIndex: 3, margin: '0 20px' }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#x1F30C;</div>
          <h2 style={{ fontSize: 24, marginBottom: 12 }}>Portal not found</h2>
          <p style={{ color: 'rgba(200,200,220,0.5)', marginBottom: 24 }}>This whisper portal doesn't exist in this universe.</p>
          <Link to="/" className="whisper-btn whisper-btn-primary">Return home</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ background: '#060614', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CosmicCanvas theme="cosmic" />

      {/* Logo link */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            width: 28, height: 28,
            background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13,
          }}>✦</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600 }}>Whisper</span>
        </Link>
        <Link to="/auth?mode=signup" style={{ fontSize: 12, color: 'rgba(167,139,250,0.7)', textDecoration: 'none' }}>
          Create your own portal →
        </Link>
      </div>

      <div style={{ width: '100%', maxWidth: 500, padding: '80px 20px 40px', position: 'relative', zIndex: 3 }}>
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5 }}
            >
              {/* Profile info */}
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <motion.div
                  animate={{ boxShadow: ['0 0 20px rgba(79,142,247,0.3)', '0 0 50px rgba(167,139,250,0.5)', '0 0 20px rgba(79,142,247,0.3)'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    width: 80, height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 32,
                    margin: '0 auto 16px',
                  }}
                >
                  {(profile?.display_name || '?')[0].toUpperCase()}
                </motion.div>
                <h2 className="font-display" style={{ fontSize: 26, fontWeight: 600, marginBottom: 6 }}>
                  {profile?.display_name || profile?.username}
                </h2>
                {profile?.bio && (
                  <p style={{ fontSize: 14, color: 'rgba(200,200,220,0.55)', fontStyle: 'italic', marginBottom: 6 }}>
                    {profile.bio}
                  </p>
                )}
                <p style={{ fontSize: 13, color: 'rgba(200,200,220,0.4)' }}>
                  {profile?.message_count || 0} whispers received
                </p>
              </div>

              <div className="glass-strong" style={{ borderRadius: 28, padding: '32px 28px' }}>
                <p style={{ fontSize: 14, color: 'rgba(200,200,220,0.6)', textAlign: 'center', marginBottom: 20 }}>
                  Send an anonymous message. They will never know it's you.
                </p>

                {/* Prompt suggestion */}
                <div
                  onClick={cyclePrompt}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'rgba(167,139,250,0.08)',
                    border: '1px solid rgba(167,139,250,0.15)',
                    marginBottom: 16,
                    cursor: 'pointer',
                    fontSize: 13,
                    color: 'rgba(167,139,250,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                  title="Click for another prompt"
                >
                  <span style={{ fontStyle: 'italic' }}>{PROMPTS[promptIdx]}</span>
                  <span style={{ marginLeft: 8, opacity: 0.6, fontSize: 11 }}>↻</span>
                </div>

                <textarea
                  className="whisper-textarea"
                  placeholder="Write what you've been holding inside..."
                  value={message}
                  onChange={e => {
                    setMessage(e.target.value);
                    setCharCount(e.target.value.length);
                  }}
                  maxLength={MAX_CHARS}
                  style={{ minHeight: 140 }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4, marginBottom: 16 }}>
                  <span style={{ fontSize: 11, color: charCount > MAX_CHARS * 0.9 ? 'rgba(248,113,113,0.7)' : 'rgba(200,200,220,0.3)' }}>
                    {charCount}/{MAX_CHARS}
                  </span>
                </div>

                {/* Emoji picker */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 12, color: 'rgba(200,200,220,0.4)', marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Add a feeling
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setSelectedEmoji(selectedEmoji === emoji ? '' : emoji)}
                        style={{
                          width: 40, height: 40,
                          borderRadius: 10,
                          border: selectedEmoji === emoji ? '2px solid rgba(167,139,250,0.6)' : '1px solid rgba(255,255,255,0.06)',
                          background: selectedEmoji === emoji ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.03)',
                          cursor: 'pointer',
                          fontSize: 18,
                          transition: 'all 0.15s ease',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'rgba(220, 38, 38, 0.12)',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                      color: '#fca5a5',
                      fontSize: 13,
                      marginBottom: 16,
                    }}
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  className="whisper-btn whisper-btn-primary"
                  onClick={handleSend}
                  disabled={sending || !message.trim()}
                  style={{
                    width: '100%',
                    fontSize: 15,
                    padding: '16px',
                    opacity: (!message.trim() || sending) ? 0.5 : 1,
                  }}
                >
                  {sending ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                      <span className="whisper-spinner" style={{ width: 16, height: 16 }} />
                      Sending into the void...
                    </span>
                  ) : 'Send anonymously ✦'}
                </button>

                <p style={{ fontSize: 11, textAlign: 'center', color: 'rgba(200,200,220,0.25)', marginTop: 14, lineHeight: 1.5 }}>
                  Your identity is completely hidden. No tracking. No logs.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
              className="glass-strong"
              style={{ borderRadius: 28, padding: '56px 40px', textAlign: 'center' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                style={{ fontSize: 60, marginBottom: 20 }}
              >
                ✨
              </motion.div>
              <h2 className="font-display" style={{ fontSize: 28, fontWeight: 600, marginBottom: 12 }}>
                Whisper sent
              </h2>
              <p style={{ color: 'rgba(200,200,220,0.6)', marginBottom: 32, lineHeight: 1.6 }}>
                Your words are floating toward {profile?.display_name || profile?.username}.<br />
                Anonymous. Honest. Arrived.
              </p>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className="whisper-btn whisper-btn-ghost"
                  onClick={handleReset}
                  style={{ fontSize: 14 }}
                >
                  Send another
                </button>
                <Link
                  to="/auth?mode=signup"
                  className="whisper-btn whisper-btn-primary"
                  style={{ fontSize: 14 }}
                >
                  Create your own portal ✦
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
