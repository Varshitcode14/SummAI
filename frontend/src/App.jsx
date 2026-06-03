import React, { useState } from 'react'
import API_BASE from './config.js'
import LandingPage from './components/LandingPage.jsx'
import Navbar from './components/Navbar.jsx'
import SummarizerForm from './components/SummarizerForm.jsx'
import SummaryOutput from './components/SummaryOutput.jsx'
import FlowchartView from './components/FlowchartView.jsx'
import RoadmapView from './components/RoadmapView.jsx'
import { Routes, Route } from 'react-router-dom'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'

function MainApp() {
  const [page, setPage] = useState('landing')

  if (page === 'landing') {
    return <LandingPage onEnter={() => setPage('app')} />
  }

  return <AppShell onBack={() => setPage('landing')} />
}

function AppShell({ onBack }) {
  const [activeTab, setActiveTab] = useState('summarize')
  const [summaryData, setSummaryData] = useState(null)
  const [flowchartData, setFlowchartData] = useState(null)
  const [roadmapData, setRoadmapData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const tabs = [
    { id: 'summarize', label: 'Summarize', icon: '◈' },
    { id: 'flowchart', label: 'Flowchart', icon: '⬡' },
    { id: 'roadmap',   label: 'Roadmap',   icon: '◎' },
  ]

  const switchTab = (id) => {
    setActiveTab(id)
    setError(null)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onLogoClick={onBack} />

      <div style={{
        display: 'flex', gap: 4, padding: '0 32px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-panel)',
      }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => switchTab(tab.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '14px 26px', fontFamily: 'var(--font-display)',
            fontSize: 14, fontWeight: 600, letterSpacing: '0.04em',
            color: activeTab === tab.id ? 'var(--cyan)' : 'var(--text-secondary)',
            borderBottom: activeTab === tab.id ? '2px solid var(--cyan)' : '2px solid transparent',
            marginBottom: -1, transition: 'all 0.2s',
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <span>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      <main style={{ flex: 1, padding: '36px 32px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>

        {activeTab === 'summarize' && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <SummarizerForm
              setResult={setSummaryData}
              setLoading={setLoading}
              setError={setError}
              loading={loading}
            />
            {error && <ErrorBanner msg={error} onClose={() => setError(null)} />}
            {summaryData && <SummaryOutput data={summaryData} />}
          </div>
        )}

        {activeTab === 'flowchart' && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <FeatureForm
              endpoint={`${API_BASE}/api/flowchart`}
              label="Upload PDF or paste text to generate an interactive flowchart"
              setResult={setFlowchartData}
              setLoading={setLoading}
              setError={setError}
              loading={loading}
              mode="flowchart"
            />
            {error && <ErrorBanner msg={error} onClose={() => setError(null)} />}
            {flowchartData && <FlowchartView data={flowchartData} />}
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <FeatureForm
              endpoint={`${API_BASE}/api/roadmap`}
              label="Upload PDF or paste text to extract topics & learning roadmap"
              setResult={setRoadmapData}
              setLoading={setLoading}
              setError={setError}
              loading={loading}
              mode="roadmap"
            />
            {error && <ErrorBanner msg={error} onClose={() => setError(null)} />}
            {roadmapData && <RoadmapView data={roadmapData} />}
          </div>
        )}

      </main>
    </div>
  )
}

function FeatureForm({ endpoint, label, setResult, setLoading, setError, loading, mode }) {
  const [inputMode, setInputMode] = useState('pdf')
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)

  const canSubmit = !loading && (inputMode === 'pdf' ? !!file : text.trim().split(' ').length >= 3)

  const handleSubmit = async () => {
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      let res
      if (inputMode === 'pdf' && file) {
        const fd = new FormData()
        fd.append('file', file)
        res = await fetch(endpoint, { method: 'POST', body: fd })
      } else {
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
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

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28,
          letterSpacing: '-0.01em', marginBottom: 6, color: 'var(--text-primary)',
        }}>
          {mode === 'flowchart'
            ? <><span style={{ color: 'var(--cyan)' }}>Flowchart</span> Generator</>
            : <>Learning <span style={{ color: 'var(--cyan)' }}>Roadmap</span></>
          }
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--cyan)' }}>// </span>{label}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['pdf', 'text'].map(m => (
          <button key={m} onClick={() => setInputMode(m)} style={{
            padding: '9px 22px', borderRadius: 8, cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
            border: '1px solid', transition: 'all 0.2s',
            background: inputMode === m ? 'var(--cyan-soft)' : 'transparent',
            borderColor: inputMode === m ? 'var(--cyan)' : 'var(--border)',
            color: inputMode === m ? 'var(--cyan)' : 'var(--text-secondary)',
          }}>
            {m === 'pdf' ? '📄 PDF Upload' : '✏️ Paste Text'}
          </button>
        ))}
      </div>

      {inputMode === 'pdf' ? (
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', border: `2px dashed ${file ? 'var(--cyan)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)', padding: '48px 40px', cursor: 'pointer',
          background: file ? 'var(--cyan-soft)' : 'var(--bg-card)', transition: 'all 0.2s',
        }}>
          <span style={{ fontSize: 36, marginBottom: 12 }}>{file ? '✅' : '📄'}</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600,
            color: file ? 'var(--cyan)' : 'var(--text-secondary)', marginBottom: 4,
          }}>
            {file ? file.name : 'Click or drag to upload PDF'}
          </span>
          {file
            ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                {(file.size / 1024).toFixed(1)} KB
              </span>
            : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                .pdf files only
              </span>
          }
          <input type="file" accept=".pdf" style={{ display: 'none' }}
            onChange={e => setFile(e.target.files[0])} />
        </label>
      ) : (
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Paste your text here (min 10 words)..."
          rows={9} style={{
            width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '16px 20px', color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)', fontSize: 13.5, lineHeight: 1.7,
            resize: 'vertical', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--cyan-dim)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      )}

      <button onClick={handleSubmit} disabled={!canSubmit} style={{
        marginTop: 16, width: '100%', padding: 15,
        background: canSubmit ? 'var(--cyan)' : 'var(--border)',
        color: canSubmit ? 'var(--bg-base)' : 'var(--text-muted)',
        border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-display)',
        fontSize: 15, fontWeight: 700, letterSpacing: '0.08em',
        cursor: canSubmit ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        {loading
          ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> PROCESSING...</>
          : `GENERATE ${mode === 'flowchart' ? 'FLOWCHART' : 'ROADMAP'} →`
        }
      </button>
    </div>
  )
}

function ErrorBanner({ msg, onClose }) {
  return (
    <div style={{
      background: '#ff4f6e18', border: '1px solid var(--red)', borderRadius: 'var(--radius)',
      padding: '14px 20px', marginBottom: 24, display: 'flex',
      justifyContent: 'space-between', alignItems: 'center',
      fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--red)',
    }}>
      <span>⚠ {msg}</span>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: 18,
      }}>✕</button>
    </div>
  )
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
    </Routes>
  )
}