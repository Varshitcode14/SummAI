import React, { useState } from 'react'

const COLORS = ['#00c9ff','#00ffaa','#a78bfa','#ffb347','#ff4f6e','#38bdf8','#f472b6','#34d399']

export default function RoadmapView({ data }) {
  const [activeTopic, setActiveTopic] = useState(null)
  const { topics = [], roadmap = {} } = data

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24,
          marginBottom: 6, color: 'var(--text-primary)' }}>
          Learning <span style={{ color: 'var(--cyan)' }}>Roadmap</span>
        </h2>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--cyan)' }}>// </span>
          {topics.length} core topics extracted — click any topic to expand its learning path
        </p>
      </div>

      {/* Topic chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
        {topics.map((topic, i) => {
          const color = COLORS[i % COLORS.length]
          const isActive = activeTopic === topic
          return (
            <button key={topic} onClick={() => setActiveTopic(isActive ? null : topic)} style={{
              padding: '8px 18px', borderRadius: 20, cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
              border: `1px solid ${color}`,
              background: isActive ? `${color}22` : 'var(--bg-card)',
              color: color, transition: 'all 0.2s',
              boxShadow: isActive ? `0 0 14px ${color}44` : 'none',
            }}>{topic}</button>
          )
        })}
      </div>

      {/* Roadmap cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {topics.map((topic, i) => {
          const color = COLORS[i % COLORS.length]
          const steps = roadmap[topic] || []
          const isActive = activeTopic === topic
          const isDimmed = activeTopic !== null && !isActive

          return (
            <div key={topic} onClick={() => setActiveTopic(isActive ? null : topic)} style={{
              background: 'var(--bg-card)',
              border: `1px solid ${isActive ? color : 'var(--border)'}`,
              borderRadius: 'var(--radius)', overflow: 'hidden', cursor: 'pointer',
              opacity: isDimmed ? 0.4 : 1,
              boxShadow: isActive ? `0 0 22px ${color}22` : 'none',
              transition: 'all 0.25s',
              animation: `nodeIn 0.4s ease ${i * 0.06}s both`,
            }}>

              {/* Topic header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '17px 22px',
                background: isActive ? `${color}0e` : 'transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%', background: color,
                    display: 'inline-block', boxShadow: `0 0 8px ${color}`,
                    flexShrink: 0,
                  }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: 15, color: 'var(--text-primary)' }}>{topic}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11,
                    color: 'var(--text-muted)' }}>{steps.length} steps</span>
                </div>
                <span style={{
                  color: isActive ? color : 'var(--text-muted)', fontSize: 18,
                  transition: 'transform 0.2s', display: 'inline-block',
                  transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                }}>⌄</span>
              </div>

              {/* Steps */}
              {isActive && (
                <div style={{ padding: '4px 22px 22px', animation: 'fadeUp 0.2s ease' }}>
                  <div style={{ paddingLeft: 24, borderLeft: `1px solid ${color}44` }}>
                    {steps.map((step, si) => (
                      <div key={si} style={{
                        display: 'flex', gap: 16, alignItems: 'flex-start', padding: '11px 0',
                        borderBottom: si < steps.length - 1 ? '1px solid var(--border)' : 'none',
                      }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                          background: `${color}22`, border: `1px solid ${color}66`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                          color: color, marginTop: 1,
                        }}>{si + 1}</div>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: 14,
                          lineHeight: 1.65, color: 'var(--text-primary)', flex: 1 }}>
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}