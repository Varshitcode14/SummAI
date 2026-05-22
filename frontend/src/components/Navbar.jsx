import React from 'react'

export default function Navbar({ onLogoClick }) {
  return (
    <header style={{
      background: 'var(--bg-panel)', borderBottom: '1px solid var(--border)',
      padding: '0 32px', height: 62, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div onClick={onLogoClick} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8, background: 'var(--cyan-soft)',
          border: '1px solid var(--cyan-dim)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 17, color: 'var(--cyan)',
        }}>◈</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '0.04em' }}>
            SUMM<span style={{ color: 'var(--cyan)' }}>AI</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            POWERED BY LLAMA 3.1
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%', background: 'var(--green)',
          display: 'inline-block', boxShadow: '0 0 6px var(--green)',
        }} />
        API ONLINE
      </div>
    </header>
  )
}