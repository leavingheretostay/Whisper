import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
// 🔧 FIXED: Import the profile creation function
import { ensureUserProfile } from '../lib/profile';
import CosmicCanvas from '../components/CosmicCanvas';

function isValidUsername(u: string) {
  return /^[a-zA-Z0-9_]{3,24}$/.test(u);
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'signup'>(params.get('mode') === 'signup' ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setMode(params.get('mode') === 'signup' ? 'signup' : 'login');
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!isValidUsername(username)) {
          setError('Username must be 3-24 characters, letters/numbers/underscores only.');
          setLoading(false);
          return;
        }

        // Check username availability
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username.toLowerCase())
          .maybeSingle();

        if (existing) {
          setError('That username is already taken. Try another.');
          setLoading(false);
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;

        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            username: username.toLowerCase(),
            display_name: displayName || username,
          });
          if (profileError) throw profileError;
          navigate('/dashboard');
        }
      } else {
        // 🔧 FIXED: Login — sign in, then ensure profile exists before redirecting
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;

        // Create profile if it doesn't exist (handles Google users logging in with email)
        if (data.user) {
          await ensureUserProfile(data.user);
        }

        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // 🔧 FIXED: Google sign-in now creates profile before redirecting
  const handleGoogle = async () => {
    setError('');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setError(error.message);
      return;
    }
    // Note: OAuth redirects away, so we can't create the profile here.
    // The profile will be created in DashboardPage's loadData() via ensureUserProfile().
    // This is handled by the fix already in DashboardPage.tsx.
  };

  return (
    <div className="page-wrapper" style={{ background: '#060614', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CosmicCanvas theme="cosmic" />

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
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ width: '100%', maxWidth: 440, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 3 }}
      >
        <div className="glass-strong" style={{ padding: '40px 36px', borderRadius: 28 }}>
          {/* Toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 4, marginBottom: 32 }}>
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.25s ease',
                  background: mode === m ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: mode === m ? '#e8e8f0' : 'rgba(200,200,220,0.4)',
                }}
              >
                {m === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'signup' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'signup' ? -20 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-display" style={{ fontSize: 24, fontWeight: 600, marginBottom: 6, textAlign: 'center' }}>
                {mode === 'login' ? 'Welcome back' : 'Open your portal'}
              </h2>
              <p style={{ textAlign: 'center', color: 'rgba(200,200,220,0.5)', fontSize: 14, marginBottom: 28 }}>
                {mode === 'login' ? 'Your anonymous inbox awaits' : 'A place for honest words'}
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {mode === 'signup' && (
                  <>
                    <div>
                      <label style={{ fontSize: 12, color: 'rgba(200,200,220,0.55)', display: 'block', marginBottom: 6, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Username
                      </label>
                      <input
                        className="whisper-input"
                        type="text"
                        placeholder="yourname"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        autoFocus
                      />
                      <p style={{ fontSize: 11, color: 'rgba(200,200,220,0.35)', marginTop: 4 }}>
                        whisper.app/{username || 'yourname'}
                      </p>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: 'rgba(200,200,220,0.55)', display: 'block', marginBottom: 6, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Display Name
                      </label>
                      <input
                        className="whisper-input"
                        type="text"
                        placeholder="How should people see you?"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label style={{ fontSize: 12, color: 'rgba(200,200,220,0.55)', display: 'block', marginBottom: 6, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Email
                  </label>
                  <input
                    className="whisper-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, color: 'rgba(200,200,220,0.55)', display: 'block', marginBottom: 6, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Password
                  </label>
                  <input
                    className="whisper-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
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
                    }}
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'rgba(52, 211, 153, 0.12)',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      color: '#6ee7b7',
                      fontSize: 13,
                    }}
                  >
                    {success}
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="whisper-btn whisper-btn-primary"
                  disabled={loading}
                  style={{ marginTop: 8, opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="whisper-spinner" style={{ width: 16, height: 16 }} />
                      {mode === 'login' ? 'Signing in...' : 'Creating...'}
                    </span>
                  ) : (
                    mode === 'login' ? 'Enter the portal' : 'Open my portal ✦'
                  )}
                </button>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                <hr className="whisper-divider" style={{ flex: 1 }} />
                <span style={{ fontSize: 12, color: 'rgba(200,200,220,0.3)' }}>or</span>
                <hr className="whisper-divider" style={{ flex: 1 }} />
              </div>

              <button
                onClick={handleGoogle}
                className="whisper-btn whisper-btn-ghost"
                style={{ width: '100%', gap: 10 }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}