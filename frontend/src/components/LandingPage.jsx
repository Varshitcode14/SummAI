import API_BASE from '../config.js'
import React, { useEffect, useState } from 'react'

const FEATURES = [
  { icon: '◈', title: 'Smart Summarize',   desc: 'Brief, detailed, or bullet summaries from text or PDF in seconds.' },
  { icon: '⬡', title: 'Visual Flowchart',  desc: 'Clickable document flowchart — each block reveals its own mini-summary.' },
  { icon: '◎', title: 'Learning Roadmap',  desc: 'Extract core topics with a step-by-step beginner learning path.' },
  { icon: '⚡', title: 'Large PDF Support', desc: 'Smart chunking handles any document size without hitting token limits.' },
]

const WORDS = ['Documents.', 'Research.', 'PDFs.', 'Articles.', 'Reports.']

export default function LandingPage({ onEnter }) {
  const [wordIdx, setWordIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    const word = WORDS[wordIdx]
    let t
    if (typing) {
      if (displayed.length < word.length) {
        t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80)
      } else {
        t = setTimeout(() => setTyping(false), 1600)
      }
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38)
      } else {
        setWordIdx((wordIdx + 1) % WORDS.length)
        setTyping(true)
      }
    }
    return () => clearTimeout(t)
  }, [displayed, typing, wordIdx])

  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then(r => r.json())
      .then(d => setApiStatus(d.status === 'ok' ? 'online' : 'offline'))
      .catch(() => setApiStatus('offline'))
  }, [])

  const statusColor = {
    online: 'var(--green)', offline: 'var(--red)', checking: 'var(--text-muted)'
  }[apiStatus]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>

      {/* NAV */}
      <header style={{
        height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-panel)', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, background: 'var(--cyan-soft)',
            border: '1px solid var(--cyan-dim)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 17, color: 'var(--cyan)',
          }}>◈</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--text-primary)' }}>
            SUMM<span style={{ color: 'var(--cyan)' }}>AI</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7,
            fontFamily: 'var(--font-mono)', fontSize: 12, color: statusColor }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: statusColor,
              display: 'inline-block',
              boxShadow: apiStatus === 'online' ? '0 0 8px var(--green)' : 'none',
            }} />
            {apiStatus === 'online' ? 'API ONLINE' : apiStatus === 'offline' ? 'API OFFLINE' : 'CHECKING...'}
          </div>
          <button onClick={onEnter} style={{
            padding: '9px 24px', background: 'var(--cyan)', color: 'var(--bg-base)',
            border: 'none', borderRadius: 8, fontFamily: 'var(--font-display)',
            fontWeight: 700, fontSize: 13, cursor: 'pointer', letterSpacing: '0.06em',
          }}>LAUNCH APP →</button>
        </div>
      </header>

      {/* HERO */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '90px 40px 70px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* grid background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, opacity: 0.3,
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 780 }}>
          {/* badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--cyan-soft)', border: '1px solid var(--cyan-dim)',
            borderRadius: 20, padding: '6px 18px', marginBottom: 32,
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)',
            letterSpacing: '0.08em', animation: 'fadeUp 0.5s ease both',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block' }} />
            LLAMA 3.1 · LANGCHAIN · GROQ · FLASK
          </div>

          {/* headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(38px, 6vw, 68px)', lineHeight: 1.1,
            letterSpacing: '-0.02em', marginBottom: 20, color: 'var(--text-primary)',
            animation: 'fadeUp 0.5s ease 0.1s both',
          }}>
            Understand Any<br />
            <span style={{ color: 'var(--cyan)' }}>{displayed}</span>
            <span style={{ color: 'var(--cyan)', animation: 'blink 1s step-end infinite' }}>|</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-secondary)',
            lineHeight: 1.75, maxWidth: 520, margin: '0 auto 44px',
            animation: 'fadeUp 0.5s ease 0.2s both',
          }}>
            AI-powered summarization, visual flowcharts, and learning roadmaps — all from a single PDF or text paste.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap',
            animation: 'fadeUp 0.5s ease 0.3s both' }}>
            <button onClick={onEnter} style={{
              padding: '15px 46px', background: 'var(--cyan)', color: 'var(--bg-base)',
              border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-display)',
              fontWeight: 700, fontSize: 15, cursor: 'pointer', letterSpacing: '0.07em',
              boxShadow: '0 0 36px var(--cyan-dim)',
            }}>GET STARTED →</button>
            <button onClick={onEnter} style={{
              padding: '15px 46px', background: 'transparent',
              color: 'var(--text-primary)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', fontFamily: 'var(--font-display)',
              fontWeight: 600, fontSize: 15, cursor: 'pointer',
            }}>VIEW DEMO</button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '60px 40px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
              letterSpacing: '0.15em', marginBottom: 10 }}>WHAT IT DOES</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: 'var(--text-primary)' }}>
              Three tools. One <span style={{ color: 'var(--cyan)' }}>pipeline.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '28px 24px',
                animation: `fadeUp 0.5s ease ${0.1 + i * 0.08}s both`,
              }}>
                <div style={{ fontSize: 28, marginBottom: 14, color: 'var(--cyan)' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
                  marginBottom: 8, color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 14,
                  color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-panel)', padding: '64px 40px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
            letterSpacing: '0.15em', marginBottom: 10 }}>HOW IT WORKS</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30,
            marginBottom: 48, color: 'var(--text-primary)' }}>
            From document to <span style={{ color: 'var(--cyan)' }}>insight</span> in 3 steps
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { n: '01', label: 'Upload or Paste', desc: 'Drop a PDF or paste text' },
              { n: '02', label: 'AI Processes',    desc: 'Llama 3.1 via LangChain' },
              { n: '03', label: 'Get Insights',    desc: 'Summary, flowchart, roadmap' },
            ].map((s, i) => (
              <React.Fragment key={s.n}>
                <div style={{ textAlign: 'center', padding: '20px 40px' }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: '50%',
                    background: 'var(--cyan-soft)', border: '1px solid var(--cyan-dim)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14,
                    color: 'var(--cyan)', margin: '0 auto 14px',
                  }}>{s.n}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: 15, marginBottom: 5, color: 'var(--text-primary)' }}>{s.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{s.desc}</div>
                </div>
                {i < 2 && <div style={{ color: 'var(--cyan-dim)', fontSize: 24, padding: '0 4px' }}>→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ padding: '64px 40px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30,
          marginBottom: 14, color: 'var(--text-primary)' }}>Ready to summarize?</h2>
        <p style={{ fontFamily: 'var(--font-display)', color: 'var(--text-secondary)',
          marginBottom: 30, fontSize: 15 }}>
          Make sure your Flask backend is running on port 5000, then jump in.
        </p>
        <button onClick={onEnter} style={{
          padding: '14px 50px', background: 'var(--cyan)', color: 'var(--bg-base)',
          border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-display)',
          fontWeight: 700, fontSize: 15, cursor: 'pointer', letterSpacing: '0.06em',
          boxShadow: '0 0 36px var(--cyan-dim)',
        }}>OPEN APP →</button>
        <div style={{ marginTop: 40, fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          SUMMIAI · LLAMA 3.1 · LANGCHAIN · GROQ · FLASK · REACT + VITE
        </div>
      </section>

    </div>
  )
}