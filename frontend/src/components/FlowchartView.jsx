import React, { useState } from 'react'

const TYPE_COLORS = {
  Introduction: { border: '#00c9ff', bg: '#00c9ff18', dot: '#00c9ff' },
  Background:   { border: '#a78bfa', bg: '#a78bfa18', dot: '#a78bfa' },
  Methodology:  { border: '#00ffaa', bg: '#00ffaa18', dot: '#00ffaa' },
  Results:      { border: '#ffb347', bg: '#ffb34718', dot: '#ffb347' },
  Conclusion:   { border: '#ff4f6e', bg: '#ff4f6e18', dot: '#ff4f6e' },
  Discussion:   { border: '#38bdf8', bg: '#38bdf818', dot: '#38bdf8' },
}

function getTypeStyle(type) {
  return TYPE_COLORS[type] || { border: 'var(--cyan)', bg: 'var(--cyan-soft)', dot: 'var(--cyan)' }
}

export default function FlowchartView({ data }) {
  const [activeNode, setActiveNode] = useState(null)
  const { nodes = [], final_summary } = data

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24,
          marginBottom: 6, color: 'var(--text-primary)' }}>
          Document <span style={{ color: 'var(--cyan)' }}>Flowchart</span>
        </h2>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--cyan)' }}>// </span>
          Click any block to expand its mini-summary
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {nodes.map((node, idx) => {
          const s = getTypeStyle(node.type)
          const isActive = activeNode === node.id

          return (
            <div key={node.id} style={{ display: 'flex', flexDirection: 'column',
              alignItems: 'center', width: '100%', maxWidth: 700 }}>

              {/* Node block */}
              <div onClick={() => setActiveNode(isActive ? null : node.id)} style={{
                width: '100%', padding: '18px 24px', cursor: 'pointer',
                background: isActive ? s.bg : 'var(--bg-card)',
                border: `1px solid ${isActive ? s.border : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                boxShadow: isActive ? `0 0 24px ${s.border}33` : 'none',
                transition: 'all 0.25s',
                animation: `nodeIn 0.4s ease ${idx * 0.07}s both`,
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                {/* Step circle */}
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: s.bg, border: `1px solid ${s.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: s.dot,
                }}>{node.id}</div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700,
                      fontSize: 15, color: 'var(--text-primary)' }}>{node.title}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px',
                      borderRadius: 4, background: s.bg,
                      border: `1px solid ${s.border}`, color: s.dot, letterSpacing: '0.05em',
                    }}>{node.type}</span>
                  </div>
                </div>

                <span style={{
                  color: isActive ? s.dot : 'var(--text-muted)', fontSize: 20,
                  transition: 'transform 0.2s', display: 'inline-block',
                  transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                }}>⌄</span>
              </div>

              {/* Expanded mini summary */}
              {isActive && (
                <div style={{
                  width: 'calc(100% - 24px)', background: s.bg,
                  border: `1px solid ${s.border}`, borderTop: 'none',
                  borderRadius: '0 0 var(--radius) var(--radius)',
                  padding: '16px 24px', animation: 'fadeUp 0.2s ease',
                }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 14,
                    lineHeight: 1.75, color: 'var(--text-primary)' }}>
                    {node.mini_summary}
                  </p>
                </div>
              )}

              {/* Connector arrow */}
              {idx < nodes.length - 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2px 0' }}>
                  <div style={{ width: 1, height: 22,
                    background: 'linear-gradient(to bottom, var(--border), var(--cyan-dim))' }} />
                  <div style={{ color: 'var(--cyan-dim)', fontSize: 12, lineHeight: 1 }}>▼</div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Final summary */}
      {final_summary && (
        <div style={{
          marginTop: 36, background: 'var(--bg-card)',
          border: '1px solid var(--cyan-dim)', borderRadius: 'var(--radius)',
          padding: '26px 30px', boxShadow: '0 0 32px var(--cyan-soft)',
          animation: 'fadeUp 0.5s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ color: 'var(--cyan)', fontSize: 18 }}>◈</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--cyan)', letterSpacing: '0.1em' }}>FINAL SUMMARY</span>
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 15,
            lineHeight: 1.8, color: 'var(--text-primary)' }}>
            {final_summary}
          </p>
        </div>
      )}
    </div>
  )
}