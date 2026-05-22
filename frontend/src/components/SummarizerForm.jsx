import API_BASE from '../config.js'

import React, { useState } from 'react'

const SUMMARY_TYPES = [
  { id: 'brief',    label: 'Brief',    desc: '2–3 sentences', icon: '⚡' },
  { id: 'detailed', label: 'Detailed', desc: 'Full paragraph', icon: '◈' },
  { id: 'bullet',   label: 'Bullets',  desc: 'Key points',    icon: '▸' },
]

export default function SummarizerForm({ setResult, setLoading, setError, loading }) {
  const [inputMode, setInputMode] = useState('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [summaryType, setSummaryType] = useState('detailed')
  const [dragOver, setDragOver] = useState(false)

  const canSubmit = !loading && (inputMode === 'pdf' ? !!file : text.trim().split(' ').length >= 10)

  const handleSubmit = async () => {
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      let res
      if (inputMode === 'pdf' && file) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('summary_type', summaryType)
        res = await fetch(`${API_BASE}/api/summarize-pdf`, { method: 'POST', body: fd })
      } else {
        res = await fetch(`${API_BASE}/api/summarize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, summary_type: summaryType }),
        })
      }
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && f.name.endsWith('.pdf')) setFile(f)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28,
          letterSpacing: '-0.01em', marginBottom: 6, color: 'var(--text-primary)' }}>
          Text <span style={{ color: 'var(--cyan)' }}>Summarizer</span>
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--cyan)' }}>// </span>
          Paste text or upload a PDF — get instant AI-powered summaries
        </p>
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[{ id: 'text', label: '✏️  Paste Text' }, { id: 'pdf', label: '📄  PDF Upload' }].map(m => (
          <button key={m.id} onClick={() => setInputMode(m.id)} style={{
            padding: '9px 22px', borderRadius: 8, cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
            border: '1px solid', transition: 'all 0.2s',
            background: inputMode === m.id ? 'var(--cyan-soft)' : 'transparent',
            borderColor: inputMode === m.id ? 'var(--cyan)' : 'var(--border)',
            color: inputMode === m.id ? 'var(--cyan)' : 'var(--text-secondary)',
          }}>{m.label}</button>
        ))}
      </div>

      {/* Input area */}
      {inputMode === 'text' ? (
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Paste your text here (minimum 10 words)..."
          rows={9} style={{
            width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '16px 20px', color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)', fontSize: 13.5, lineHeight: 1.7,
            resize: 'vertical', outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--cyan-dim)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      ) : (
        <label
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', textAlign: 'center',
            border: `2px dashed ${dragOver ? 'var(--cyan)' : file ? 'var(--green)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)', padding: '52px 40px',
            background: dragOver ? 'var(--cyan-soft)' : file ? '#00ffaa08' : 'var(--bg-card)',
            transition: 'all 0.25s',
          }}>
          <div style={{ fontSize: 38, marginBottom: 12 }}>{file ? '✅' : '📄'}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600,
            color: file ? 'var(--green)' : 'var(--text-secondary)', marginBottom: 4 }}>
            {file ? file.name : 'Drop PDF here or click to browse'}
          </div>
          {file
            ? <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {(file.size / 1024).toFixed(1)} KB
              </div>
            : <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                .pdf files only
              </div>
          }
          <input type="file" accept=".pdf" style={{ display: 'none' }}
            onChange={e => setFile(e.target.files[0])} />
        </label>
      )}

      {/* Summary type */}
      <div style={{ margin: '22px 0' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
          letterSpacing: '0.1em', marginBottom: 10 }}>SUMMARY TYPE</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {SUMMARY_TYPES.map(t => (
            <button key={t.id} onClick={() => setSummaryType(t.id)} style={{
              flex: 1, padding: '13px 10px', borderRadius: 8, cursor: 'pointer',
              border: '1px solid', transition: 'all 0.2s', textAlign: 'center',
              background: summaryType === t.id ? 'var(--cyan-soft)' : 'var(--bg-card)',
              borderColor: summaryType === t.id ? 'var(--cyan)' : 'var(--border)',
            }}>
              <div style={{ fontSize: 20, marginBottom: 5 }}>{t.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
                color: summaryType === t.id ? 'var(--cyan)' : 'var(--text-primary)' }}>{t.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--text-muted)', marginTop: 2 }}>{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={!canSubmit} style={{
        width: '100%', padding: 15,
        background: canSubmit ? 'var(--cyan)' : 'var(--border)',
        color: canSubmit ? 'var(--bg-base)' : 'var(--text-muted)',
        border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-display)',
        fontSize: 15, fontWeight: 700, letterSpacing: '0.08em',
        cursor: canSubmit ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        {loading
          ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> PROCESSING...</>
          : 'SUMMARIZE →'
        }
      </button>
    </div>
  )
}