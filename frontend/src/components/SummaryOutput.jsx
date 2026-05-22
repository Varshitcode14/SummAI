import React, { useState } from 'react'

export default function SummaryOutput({ data }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(data.summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const compressionRatio = data.original_length
    ? Math.round((1 - data.summary_length / data.original_length) * 100) : 0
  const readingTimeSaved = data.original_length
    ? Math.max(0, Math.round((data.original_length - data.summary_length) / 200)) : 0

  return (
    <div style={{ marginTop: 32, animation: 'fadeUp 0.4s ease' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'ORIGINAL',   value: data.original_length, unit: 'words' },
          { label: 'SUMMARY',    value: data.summary_length,  unit: 'words' },
          { label: 'COMPRESSED', value: `${compressionRatio}%`, unit: 'reduced' },
          { label: 'TIME SAVED', value: `~${readingTimeSaved}m`, unit: 'reading' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '14px 16px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
              letterSpacing: '0.1em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
              color: 'var(--cyan)' }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--text-muted)', marginTop: 2 }}>{s.unit}</div>
          </div>
        ))}
      </div>

      {/* Card */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', overflow: 'hidden',
        boxShadow: 'var(--shadow-glow)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 20px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-panel)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--cyan)', fontSize: 14 }}>◈</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12,
              color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>SUMMARY OUTPUT</span>
            {data.chunked && (
              <span style={{
                background: 'var(--amber-dim)', border: '1px solid var(--amber)',
                color: 'var(--amber)', fontFamily: 'var(--font-mono)', fontSize: 10,
                padding: '2px 8px', borderRadius: 4, letterSpacing: '0.06em',
              }}>CHUNKED</span>
            )}
          </div>
          <button onClick={handleCopy} style={{
            background: copied ? 'var(--green-dim)' : 'var(--cyan-soft)',
            border: `1px solid ${copied ? 'var(--green)' : 'var(--cyan-dim)'}`,
            color: copied ? 'var(--green)' : 'var(--cyan)',
            padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
          }}>
            {copied ? '✓ COPIED' : '⎘ COPY'}
          </button>
        </div>

        {/* Summary text */}
        <div style={{ padding: '24px 28px' }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 15, lineHeight: 1.85,
            color: 'var(--text-primary)', whiteSpace: 'pre-wrap',
          }}>{data.summary}</p>
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 20px', borderTop: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
          display: 'flex', gap: 20,
        }}>
          <span>model: <span style={{ color: 'var(--cyan-dim)' }}>{data.model_used}</span></span>
          {data.extracted_word_count && (
            <span>pdf extracted: <span style={{ color: 'var(--cyan-dim)' }}>{data.extracted_word_count} words</span></span>
          )}
        </div>
      </div>
    </div>
  )
}