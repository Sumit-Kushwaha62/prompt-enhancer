import { useState, useRef, useEffect } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080b10;
    --surface: #0e1318;
    --surface2: #141b22;
    --border: #1e2a35;
    --border2: #243040;
    --accent: #00e5ff;
    --accent2: #7b61ff;
    --accent3: #ff6b6b;
    --text: #e8edf2;
    --text2: #7a8fa0;
    --text3: #4a5f70;
    --glow: 0 0 40px rgba(0,229,255,0.12);
    --glow2: 0 0 60px rgba(123,97,255,0.15);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  .grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: linear-gradient(var(--border) 1px, transparent 1px),
                      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
    opacity: 0.3;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%);
  }

  .orb1 {
    position: fixed; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%);
    top: -200px; right: -100px; pointer-events: none; z-index: 0;
    animation: orbFloat 8s ease-in-out infinite;
  }
  .orb2 {
    position: fixed; width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(123,97,255,0.07) 0%, transparent 70%);
    bottom: -100px; left: -150px; pointer-events: none; z-index: 0;
    animation: orbFloat 10s ease-in-out infinite reverse;
  }

  @keyframes orbFloat {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, -30px); }
  }

  .container {
    position: relative; z-index: 1;
    max-width: 900px; margin: 0 auto;
    padding: 60px 24px 80px;
    animation: fadeUp 0.8s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .header {
    text-align: center;
    margin-bottom: 56px;
  }

  .badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(0,229,255,0.08);
    border: 1px solid rgba(0,229,255,0.2);
    border-radius: 100px;
    padding: 6px 16px;
    font-size: 11px; font-family: 'DM Mono', monospace;
    color: var(--accent); letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 24px;
  }

  .badge::before {
    content: '';
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 7vw, 72px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -2px;
    margin-bottom: 16px;
  }

  .title span {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    font-size: 14px;
    color: var(--text2);
    line-height: 1.7;
    max-width: 480px;
    margin: 0 auto;
    font-family: 'DM Mono', monospace;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 20px;
    transition: border-color 0.3s;
  }

  .card:hover { border-color: var(--border2); }

  .label {
    font-family: 'Syne', sans-serif;
    font-size: 11px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--text3);
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 8px;
  }

  .label::before {
    content: ''; width: 16px; height: 1px;
    background: var(--text3);
  }

  .selectors {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 12px; margin-bottom: 20px;
  }

  .select-group { position: relative; }

  select {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    padding: 14px 16px;
    appearance: none;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(0,229,255,0.1);
  }

  .select-group::after {
    content: '▾';
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    color: var(--text3); pointer-events: none;
    font-size: 12px;
  }

  textarea {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 14px;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    line-height: 1.7;
    padding: 18px 20px;
    resize: none;
    min-height: 140px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  textarea::placeholder { color: var(--text3); }

  textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(0,229,255,0.08);
  }

  .char-count {
    text-align: right;
    font-size: 11px;
    color: var(--text3);
    margin-top: 8px;
    font-family: 'DM Mono', monospace;
  }

  .btn {
    width: 100%;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    border: none;
    border-radius: 14px;
    color: #000;
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase;
    padding: 18px;
    cursor: pointer;
    position: relative; overflow: hidden;
    transition: transform 0.2s, opacity 0.2s;
    margin-top: 8px;
  }

  .btn:hover:not(:disabled) { transform: translateY(-2px); opacity: 0.95; }
  .btn:active:not(:disabled) { transform: translateY(0); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(transparent, rgba(255,255,255,0.1));
    pointer-events: none;
  }

  .spinner {
    display: inline-block; width: 14px; height: 14px;
    border: 2px solid rgba(0,0,0,0.3);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-right: 8px; vertical-align: middle;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .output-card {
    background: var(--surface);
    border: 1px solid rgba(0,229,255,0.2);
    border-radius: 20px;
    overflow: hidden;
    animation: slideIn 0.5s ease both;
    box-shadow: var(--glow);
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .output-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    background: rgba(0,229,255,0.04);
  }

  .output-title {
    font-family: 'Syne', sans-serif;
    font-size: 12px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--accent);
  }

  .copy-btn {
    background: rgba(0,229,255,0.1);
    border: 1px solid rgba(0,229,255,0.2);
    border-radius: 8px;
    color: var(--accent);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    padding: 6px 14px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    letter-spacing: 1px;
  }

  .copy-btn:hover { background: rgba(0,229,255,0.18); }
  .copy-btn:active { transform: scale(0.96); }

  .output-text {
    padding: 24px;
    font-size: 13px;
    line-height: 1.8;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .diff-view {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 16px; margin-top: 20px;
  }

  .diff-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  .diff-header {
    padding: 12px 18px;
    border-bottom: 1px solid var(--border);
    font-family: 'Syne', sans-serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
  }

  .diff-header.before { color: var(--accent3); }
  .diff-header.after { color: var(--accent); }

  .diff-content {
    padding: 18px;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text2);
    font-family: 'DM Mono', monospace;
    white-space: pre-wrap;
    min-height: 100px;
  }

  .error-box {
    background: rgba(255,107,107,0.08);
    border: 1px solid rgba(255,107,107,0.25);
    border-radius: 12px;
    padding: 16px 20px;
    font-size: 13px;
    color: var(--accent3);
    margin-top: 16px;
    font-family: 'DM Mono', monospace;
  }

  .history-section { margin-top: 48px; }

  .history-title {
    font-family: 'Syne', sans-serif;
    font-size: 12px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--text3);
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 12px;
  }

  .history-title::after {
    content: ''; flex: 1; height: 1px;
    background: var(--border);
  }

  .history-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 18px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    font-size: 12px;
    color: var(--text2);
    font-family: 'DM Mono', monospace;
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px;
  }

  .history-item:hover {
    border-color: var(--border2);
    background: var(--surface2);
    color: var(--text);
  }

  .history-text {
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    flex: 1;
  }

  .history-badge {
    font-size: 10px;
    background: var(--surface2);
    border: 1px solid var(--border2);
    border-radius: 6px;
    padding: 3px 8px;
    color: var(--text3);
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 1px;
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    .selectors { grid-template-columns: 1fr; }
    .diff-view { grid-template-columns: 1fr; }
    .container { padding: 40px 16px 60px; }
  }
`;

const USE_CASES = [
  { value: "General", label: "⚡ General" },
  { value: "Coding", label: "💻 Coding" },
  { value: "Writing", label: "✍️ Writing" },
  { value: "Image Generation", label: "🎨 Image Generation" },
  { value: "Data Analysis", label: "📊 Data Analysis" },
  { value: "Research", label: "🔬 Research" },
];

const TONES = [
  { value: "Professional", label: "🎯 Professional" },
  { value: "Creative", label: "🌈 Creative" },
  { value: "Technical", label: "⚙️ Technical" },
  { value: "Simple", label: "💡 Simple" },
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [useCase, setUseCase] = useState("General");
  const [tone, setTone] = useState("Professional");
  const [enhanced, setEnhanced] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const outputRef = useRef(null);

  useEffect(() => {
    if (enhanced && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [enhanced]);

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setEnhanced("");

    try {
      const res = await axios.post("https://prompt-enhancer-backend-4m2z.onrender.com", {
        prompt: prompt.trim(),
        use_case: useCase,
        tone,
      });
      const result = res.data.enhanced_prompt;
      setEnhanced(result);
      setHistory((prev) => [
        { original: prompt, enhanced: result, useCase, tone },
        ...prev.slice(0, 4),
      ]);
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(enhanced);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadHistory = (item) => {
    setPrompt(item.original);
    setEnhanced(item.enhanced);
    setUseCase(item.useCase);
    setTone(item.tone);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="noise" />
      <div className="grid-bg" />
      <div className="orb1" />
      <div className="orb2" />

      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="badge">Prompt Optimizer</div>
          <h1 className="title">
            Make AI <span>Understand</span>
            <br />You Better
          </h1>
          <p className="subtitle">
            Raw thoughts → Precision prompts. Write anything, get an AI-optimized version instantly.
          </p>
        </div>

        {/* Input Card */}
        <div className="card">
          <div className="label">Configuration</div>
          <div className="selectors">
            <div className="select-group">
              <select value={useCase} onChange={(e) => setUseCase(e.target.value)}>
                {USE_CASES.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            <div className="select-group">
              <select value={tone} onChange={(e) => setTone(e.target.value)}>
                {TONES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="label">Your Raw Prompt</div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="mujhe ek website banana hai... / Build me an app that... / Write a story about..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) handleEnhance();
            }}
          />
          <div className="char-count">{prompt.length} chars · Ctrl+Enter to enhance</div>

          <button
            className="btn"
            onClick={handleEnhance}
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <><span className="spinner" />Enhancing...</>
            ) : (
              "⚡ Enhance Prompt"
            )}
          </button>
        </div>

        {/* Error */}
        {error && <div className="error-box">⚠ {error}</div>}

        {/* Output */}
        {enhanced && (
          <div ref={outputRef}>
            <div className="output-card">
              <div className="output-header">
                <span className="output-title">✦ Enhanced Prompt</span>
                <button className="copy-btn" onClick={handleCopy}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <div className="output-text">{enhanced}</div>
            </div>

            {/* Diff View */}
            <div className="diff-view">
              <div className="diff-card">
                <div className="diff-header before">Before</div>
                <div className="diff-content">{prompt}</div>
              </div>
              <div className="diff-card">
                <div className="diff-header after">After</div>
                <div className="diff-content">{enhanced}</div>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="history-section">
            <div className="history-title">Recent</div>
            {history.map((item, i) => (
              <div key={i} className="history-item" onClick={() => loadHistory(item)}>
                <span className="history-text">{item.original}</span>
                <span className="history-badge">{item.useCase}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
