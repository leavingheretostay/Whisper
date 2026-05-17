import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuth';
import type { Profile, Message } from '../lib/types';
import CosmicCanvas from '../components/CosmicCanvas';
// 🔧 FIXED: Import the profile creation function
import { ensureUserProfile } from '../lib/profile';

const EMOJIS = ['💫', '🌙', '✨', '💌', '🌌', '⭐', '🔮', '🌊'];

const DAILY_PROMPTS = [
  "What's a dream you've never told anyone?",
  "If you could send one anonymous message to the world, what would it say?",
  "What's something beautiful you noticed today?",
  "What truth do you wish someone would tell you?",
  "What would you say to your younger self?",
];

function TimeAgo({ date }: { date: string }) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return <span>just now</span>;
  if (mins < 60) return <span>{mins}m ago</span>;
  if (hrs < 24) return <span>{hrs}h ago</span>;
  return <span>{days}d ago</span>;
}

function MessageCard({ msg, onFavorite, onDelete, onReply }: {
  msg: Message;
  onFavorite: (id: string, val: boolean) => void;
  onDelete: (id: string) => void;
  onReply: (msg: Message) => void;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState(msg.public_reply || '');
  const [saving, setSaving] = useState(false);

  const saveReply = async () => {
    setSaving(true);
    await supabase.from('messages').update({ public_reply: replyText }).eq('id', msg.id);
    setSaving(false);
    setShowReply(false);
    onReply({ ...msg, public_reply: replyText });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.4 }}
      className="message-card"
      style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: msg.is_favorited
          ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
          : 'linear-gradient(90deg, #4f8ef7, #a78bfa)',
        opacity: 0.6,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          {msg.emoji_reaction && (
            <span style={{ fontSize: 20, marginBottom: 8, display: 'block' }}>{msg.emoji_reaction}</span>
          )}
          <p style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.65,
            color: 'rgba(232, 232, 240, 0.88)',
            fontStyle: 'italic',
          }}>
            "{msg.content}"
          </p>

          {msg.public_reply && !showReply && (
            <div style={{
              marginTop: 14,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(79,142,247,0.08)',
              border: '1px solid rgba(79,142,247,0.2)',
              fontSize: 13,
              color: 'rgba(200,200,220,0.7)',
            }}>
              <span style={{ fontSize: 11, color: 'rgba(79,142,247,0.8)', display: 'block', marginBottom: 4, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Your reply</span>
              {msg.public_reply}
            </div>
          )}

          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'rgba(200,200,220,0.35)' }}>
              <TimeAgo date={msg.created_at} />
            </span>
            <button
              onClick={() => onFavorite(msg.id, !msg.is_favorited)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                color: msg.is_favorited ? '#fbbf24' : 'rgba(200,200,220,0.4)',
                padding: '2px 0',
                fontFamily: 'Inter, sans-serif',
                transition: 'color 0.2s ease',
              }}
            >
              {msg.is_favorited ? '★ Favorited' : '☆ Favorite'}
            </button>
            <button
              onClick={() => setShowReply(!showReply)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                color: 'rgba(79,142,247,0.6)',
                padding: '2px 0',
                fontFamily: 'Inter, sans-serif',
                transition: 'color 0.2s ease',
              }}
            >
              ↩ Reply publicly
            </button>
          </div>

          <AnimatePresence>
            {showReply && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ marginTop: 14, overflow: 'hidden' }}
              >
                <textarea
                  className="whisper-textarea"
                  style={{ minHeight: 80, fontSize: 13 }}
                  placeholder="Write a public reply (sender won't know it's you responding)..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    className="whisper-btn whisper-btn-primary"
                    onClick={saveReply}
                    disabled={saving}
                    style={{ padding: '8px 20px', fontSize: 13 }}
                  >
                    {saving ? 'Saving...' : 'Post reply'}
                  </button>
                  <button
                    className="whisper-btn whisper-btn-ghost"
                    onClick={() => setShowReply(false)}
                    style={{ padding: '8px 16px', fontSize: 13 }}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => onDelete(msg.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(200,200,220,0.2)',
            fontSize: 16,
            padding: 4,
            transition: 'color 0.2s ease',
            flexShrink: 0,
          }}
          title="Delete message"
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(248, 113, 113, 0.7)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,200,220,0.2)')}
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');
  const [promptIdx] = useState(() => Math.floor(Math.random() * DAILY_PROMPTS.length));
  const [showSettings, setShowSettings] = useState(false);
  const [bio, setBio] = useState('');
  const [savingBio, setSavingBio] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // 🔧 FIXED: Ensure profile exists before fetching (fixes email sign-in + Google username)
    const ensuredProfile = await ensureUserProfile(user);

    const [profileRes, msgRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('messages')
        .select('*')
        .eq('recipient_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false }),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setBio(profileRes.data.bio || '');
    } else if (ensuredProfile) {
      // 🔧 FIXED: Fallback to the profile we just created
      setProfile(ensuredProfile as Profile);
      setBio(ensuredProfile.bio || '');
    }
    if (msgRes.data) setMessages(msgRes.data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${user.id}`,
      }, payload => {
        setMessages(prev => [payload.new as Message, ...prev]);
        showToast('✨ A new whisper arrived');
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // 🔧 FIXED: Safe profile URL generation — won't break if profile is null or username is missing
  const profileUrl = profile?.username
    ? `${window.location.origin}/u/${profile.username}`
    : '';

  const copyLink = async () => {
    if (!profileUrl) {
      showToast('Profile still loading...');
      return;
    }
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      showToast('Link copied to clipboard ✓');
    } catch {
      // 🔧 FIXED: Fallback for older browsers or insecure contexts
      showToast('Could not copy. Please copy the link manually.');
    }
  };

  const handleFavorite = async (id: string, val: boolean) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_favorited: val } : m));
    await supabase.from('messages').update({ is_favorited: val }).eq('id', id);
  };

  const handleDelete = async (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    await supabase.from('messages').update({ is_deleted: true }).eq('id', id);
  };

  const handleReply = (updated: Message) => {
    setMessages(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const saveBio = async () => {
    if (!user) return;
    setSavingBio(true);
    await supabase.from('profiles').update({ bio }).eq('id', user.id);
    setSavingBio(false);
    setShowSettings(false);
    showToast('Profile updated ✓');
    if (profile) setProfile({ ...profile, bio });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const displayedMessages = filter === 'favorites'
    ? messages.filter(m => m.is_favorited)
    : messages;

  const shareLinks = profile ? [
    { label: 'Instagram', url: `https://www.instagram.com/`, icon: '📷' },
    { label: 'X / Twitter', url: `https://x.com/intent/tweet?text=Send+me+an+anonymous+message+%F0%9F%8C%99&url=${encodeURIComponent(profileUrl)}`, icon: '𝕏' },
    { label: 'WhatsApp', url: `https://wa.me/?text=${encodeURIComponent('Send me an anonymous message 🌙 ' + profileUrl)}`, icon: '💬' },
    { label: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`, icon: '💼' },
  ] : [];

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#060614', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CosmicCanvas />
        <div style={{ textAlign: 'center', zIndex: 3, position: 'relative' }}>
          <div className="whisper-spinner" style={{ width: 40, height: 40, margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(200,200,220,0.5)', fontSize: 14 }}>Opening your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ background: '#060614' }}>
      <CosmicCanvas theme={(profile?.mood_theme as 'cosmic' | 'aurora' | 'nebula' | 'celestial') || 'cosmic'} />

      {/* Nav */}
      <nav className="whisper-nav">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>✦</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600 }}>Whisper</span>
        </Link>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="whisper-btn whisper-btn-ghost"
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            ⚙ Settings
          </button>
          <button
            onClick={handleSignOut}
            className="whisper-btn whisper-btn-ghost"
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '88px 20px 80px', position: 'relative', zIndex: 3 }}>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass"
          style={{ padding: '32px', borderRadius: 28, marginBottom: 24, textAlign: 'center' }}
        >
          {/* Avatar */}
          <div style={{
            width: 72, height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
            margin: '0 auto 16px',
            boxShadow: '0 0 30px rgba(79,142,247,0.4)',
          }}>
            {(profile?.display_name || '?')[0].toUpperCase()}
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            {profile?.display_name || profile?.username}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(200,200,220,0.5)', marginBottom: profile?.bio ? 12 : 20 }}>
            @{profile?.username}
          </p>
          {profile?.bio && (
            <p style={{ fontSize: 14, color: 'rgba(200,200,220,0.65)', marginBottom: 20, fontStyle: 'italic', maxWidth: 380, margin: '0 auto 20px' }}>
              {profile.bio}
            </p>
          )}

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#a78bfa' }}>{profile?.message_count || 0}</div>
              <div style={{ fontSize: 11, color: 'rgba(200,200,220,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Whispers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#fbbf24' }}>{profile?.streak_days || 0}</div>
              <div style={{ fontSize: 11, color: 'rgba(200,200,220,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Day streak</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#34d399' }}>{messages.filter(m => m.is_favorited).length}</div>
              <div style={{ fontSize: 11, color: 'rgba(200,200,220,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Favorites</div>
            </div>
          </div>

          {/* Share link */}
          <div style={{ display: 'flex', gap: 8, maxWidth: 460, margin: '0 auto' }}>
            <div style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: 13,
              color: 'rgba(200,200,220,0.6)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {profileUrl || 'Loading your link...'}
            </div>
            <button
              className="whisper-btn whisper-btn-primary"
              onClick={copyLink}
              disabled={!profileUrl}
              style={{ padding: '11px 20px', fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0, opacity: profileUrl ? 1 : 0.5 }}
            >
              {copied ? '✓ Copied' : 'Copy link'}
            </button>
          </div>

          {/* Share buttons */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
            {shareLinks.map(s => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="whisper-btn whisper-btn-ghost"
                style={{ padding: '7px 14px', fontSize: 12, gap: 6 }}
              >
                <span>{s.icon}</span> {s.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass"
              style={{ borderRadius: 20, marginBottom: 24, overflow: 'hidden' }}
            >
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Profile Settings</h3>
                <label style={{ fontSize: 12, color: 'rgba(200,200,220,0.55)', display: 'block', marginBottom: 6, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Bio
                </label>
                <textarea
                  className="whisper-textarea"
                  style={{ minHeight: 80, fontSize: 14 }}
                  placeholder="A short description that appears on your profile..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  maxLength={160}
                />
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button
                    className="whisper-btn whisper-btn-primary"
                    onClick={saveBio}
                    disabled={savingBio}
                    style={{ padding: '10px 24px', fontSize: 13 }}
                  >
                    {savingBio ? 'Saving...' : 'Save changes'}
                  </button>
                  <button
                    className="whisper-btn whisper-btn-ghost"
                    onClick={() => setShowSettings(false)}
                    style={{ padding: '10px 20px', fontSize: 13 }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Daily prompt */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            padding: '20px 24px',
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(79,142,247,0.1), rgba(167,139,250,0.1))',
            border: '1px solid rgba(167,139,250,0.2)',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <span style={{ fontSize: 22 }}>🌙</span>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(167,139,250,0.8)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              Today's prompt
            </div>
            <p style={{ margin: 0, fontSize: 14, color: 'rgba(232,232,240,0.8)', fontStyle: 'italic' }}>
              "{DAILY_PROMPTS[promptIdx]}"
            </p>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['all', 'favorites'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 20px',
                borderRadius: 100,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease',
                background: filter === f ? 'rgba(79,142,247,0.2)' : 'rgba(255,255,255,0.04)',
                color: filter === f ? '#7eb3fa' : 'rgba(200,200,220,0.4)',
                border: filter === f ? '1px solid rgba(79,142,247,0.3)' : '1px solid rgba(255,255,255,0.05)',
              } as React.CSSProperties}
            >
              {f === 'all' ? `All (${messages.length})` : `★ Favorites (${messages.filter(m => m.is_favorited).length})`}
            </button>
          ))}
        </div>

        {/* Messages */}
        {displayedMessages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass"
            style={{ padding: '60px 24px', borderRadius: 24, textAlign: 'center' }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              {EMOJIS[Math.floor(Math.random() * EMOJIS.length)]}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
              {filter === 'favorites' ? 'No favorites yet' : 'Your portal is open'}
            </h3>
            <p style={{ color: 'rgba(200,200,220,0.5)', fontSize: 14, maxWidth: 320, margin: '0 auto 24px' }}>
              {filter === 'favorites'
                ? 'Star the messages that move you most.'
                : 'Share your link and let the unspoken words find you.'}
            </p>
            {filter === 'all' && (
              <button
                className="whisper-btn whisper-btn-primary"
                onClick={copyLink}
                disabled={!profileUrl}
                style={{ fontSize: 14, opacity: profileUrl ? 1 : 0.5 }}
              >
                Copy my link ✦
              </button>
            )}
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <AnimatePresence>
              {displayedMessages.map(msg => (
                <MessageCard
                  key={msg.id}
                  msg={msg}
                  onFavorite={handleFavorite}
                  onDelete={handleDelete}
                  onReply={handleReply}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="whisper-toast"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}