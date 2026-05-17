<div align="center">

<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="orb" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#c4b5fd"/>
      <stop offset="50%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#1e0a3c"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <circle cx="40" cy="40" r="36" fill="url(#orb)" filter="url(#glow)"/>
  <circle cx="40" cy="40" r="36" fill="none" stroke="#a78bfa" stroke-width="1" opacity="0.4"/>
  <circle cx="28" cy="28" r="6" fill="white" opacity="0.15"/>
  <path d="M26 40 Q40 30 54 40 Q40 52 26 40Z" fill="white" opacity="0.9" filter="url(#glow)"/>
  <circle cx="40" cy="40" r="3" fill="#e9d5ff" opacity="0.8"/>
</svg>

# Whisper

### *"A place where emotions float anonymously in a digital heaven."*

Whisper is a cinematic anonymous messaging platform — a cosmic space where strangers send thoughts, confessions, memories, and feelings into the void, beautifully and without names.

<br/>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Glowing%20Star.png" width="22" height="22" style="vertical-align:middle"/> Features

- 🎭 &nbsp;**Anonymous Portal** — Create your own space and receive messages with zero identity attached
- 🌠 &nbsp;**Cosmic UI** — An immersive interface inspired by stars, dreams, and digital solitude
- 🪟 &nbsp;**Glassmorphism Design** — Frosted glass layers, soft blur, ambient glow
- ⚡ &nbsp;**Real-time Messaging** — Thoughts arrive instantly, like signals from deep space
- 📱 &nbsp;**Mobile-First** — Designed for the screen you hold closest
- 🔐 &nbsp;**Secure Auth** — Powered by Supabase for safe, private portals
- 🎞️ &nbsp;**Cinematic Motion** — Framer Motion animations that feel intentional, not decorative
- 🚫 &nbsp;**Ad-Free Forever** — No interruptions. No noise. Just the feeling.

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Crystal%20Ball.png" width="22" height="22" style="vertical-align:middle"/> Design Philosophy

Whisper is not designed like a traditional social media app.

> It exists as a peaceful digital space — where emotions feel weightless, conversations feel intimate, and anonymity feels beautiful instead of toxic.

The interface layers together:

| Element | Purpose |
|---|---|
| Soft gradients & particle fields | Make the space feel alive without being loud |
| Glowing ambient lighting | Draw focus inward, not outward |
| Dreamy typography | Let the words carry the weight |
| Cinematic motion | Every transition should feel like exhaling |

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Hammer%20and%20Wrench.png" width="22" height="22" style="vertical-align:middle"/> Tech Stack

| Layer | Technology |
|---|---|
| ⚛️ &nbsp;Frontend | React + TypeScript |
| ⚡ &nbsp;Build Tool | Vite |
| 🎨 &nbsp;Styling | Tailwind CSS |
| 🎞️ &nbsp;Animation | Framer Motion |
| 🗄️ &nbsp;Backend | Supabase (PostgreSQL) |
| 🔐 &nbsp;Auth | Supabase Auth |
| 🚀 &nbsp;Deployment | Vercel |

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" width="22" height="22" style="vertical-align:middle"/> Getting Started

### 1 — Clone

```bash
git clone https://github.com/leavingheretostay/Whisper.git
cd Whisper
```

### 2 — Install

```bash
npm install
```

### 3 — Configure

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Find these in your [Supabase project settings](https://app.supabase.com).

### 4 — Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and step into the void.

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/File%20Folder.png" width="22" height="22" style="vertical-align:middle"/> Project Structure

```
Whisper/
├── src/
│   ├── components/       # UI building blocks
│   ├── pages/            # App routes & views
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Supabase client & utilities
├── supabase/
│   └── migrations/       # Database schema history
└── public/               # Static assets
```

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Cloud.png" width="22" height="22" style="vertical-align:middle"/> Deployment

| Platform | Notes |
|---|---|
| ✅ **Vercel** | Recommended — zero-config for Vite |
| ✅ Netlify | Fully supported |
| ✅ Railway | Supported |

**Recommended:** Vercel (frontend) + Supabase (backend)

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Locked.png" width="22" height="22" style="vertical-align:middle"/> Authentication

Powered by **Supabase Auth**.

- 📧 Email / Password — built in
- 🔵 Google OAuth — optional, one config toggle

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Milky%20Way.png" width="22" height="22" style="vertical-align:middle"/> What's Coming

- 🎙️ Voice anonymous messages
- 💫 Message reactions
- 🤖 AI moderation
- 🎵 Ambient background music
- 🖼️ Anonymous image sharing
- 🎨 Custom portal themes
- 🔥 Burn-after-reading messages
- 📊 Emotional analytics
- 🃏 AI-generated aesthetic cards

---

## ⚠️ Disclaimer

Whisper is designed for **positive emotional expression**.

Harassment, abuse, hate speech, or harmful anonymous behavior is not encouraged or condoned. Use this space with the same gentleness you'd want someone to use with your own heart.

---

## 📜 License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="footer-orb" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#c4b5fd"/>
      <stop offset="50%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#1e0a3c"/>
    </radialGradient>
    <filter id="footer-glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <circle cx="24" cy="24" r="22" fill="url(#footer-orb)" filter="url(#footer-glow)"/>
  <circle cx="24" cy="24" r="22" fill="none" stroke="#a78bfa" stroke-width="0.8" opacity="0.4"/>
  <circle cx="16" cy="16" r="4" fill="white" opacity="0.12"/>
  <path d="M14 24 Q24 16 34 24 Q24 32 14 24Z" fill="white" opacity="0.9"/>
  <circle cx="24" cy="24" r="2" fill="#e9d5ff" opacity="0.8"/>
</svg>

<br/><br/>

**Created by Nasir Lone**

*"Some emotions are easier to send into the stars than directly to people."*

<br/>

</div>
