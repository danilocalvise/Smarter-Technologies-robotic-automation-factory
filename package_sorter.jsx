const { useState } = React;

// ─── UI ───────────────────────────────────────────────────────────────────────

const STACK_META = {
  STANDARD: { color: "#22c55e", bg: "#052e16", icon: "📦", desc: "Normal handling" },
  SPECIAL:  { color: "#f59e0b", bg: "#1c1400", icon: "⚠️",  desc: "Manual processing" },
  REJECTED: { color: "#ef4444", bg: "#1f0202", icon: "🚫", desc: "Cannot be dispatched" },
};

const Field = ({ label, value, onChange, unit }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <label style={{ fontSize: 11, letterSpacing: "0.1em", color: "#6b7280", textTransform: "uppercase", fontFamily: "monospace" }}>
      {label} <span style={{ color: "#374151" }}>({unit})</span>
    </label>
    <input
      type="number"
      min="0"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "#111827", border: "1px solid #1f2937", borderRadius: 6,
        color: "#f9fafb", padding: "8px 12px", fontSize: 15, width: "100%",
        fontFamily: "monospace", outline: "none",
      }}
    />
  </div>
);

function App() {
  const [w, setW] = useState("80");
  const [h, setH] = useState("80");
  const [l, setL] = useState("80");
  const [m, setM] = useState("10");
  const [showTests, setShowTests] = useState(false);

  let result = null, error = null;
  try {
    const nums = [w, h, l, m].map(Number);
    if (nums.some(isNaN)) throw new Error("Please enter valid numbers.");
    result = sort(...nums);
  } catch (e) {
    error = e.message;
  }

  const meta = result ? STACK_META[result] : null;
  const tests = runTests();
  const passed = tests.filter((t) => t.passed).length;

  return (
    <div style={{
      minHeight: "100vh", background: "#030712", color: "#f9fafb",
      fontFamily: "'IBM Plex Mono', monospace", padding: "32px 16px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 32,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Space+Grotesk:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
        input::-webkit-inner-spin-button { opacity: 0.4; }
        .test-row:hover { background: #111827 !important; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.25em", color: "#6b7280", marginBottom: 8 }}>
          SMARTER TECHNOLOGY · ROBOTIC DISPATCH SYSTEM
        </div>
        <h1 style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
          Package Sorter
        </h1>
      </div>

      {/* Input Card */}
      <div style={{
        width: "100%", maxWidth: 480, background: "#0f172a",
        border: "1px solid #1e293b", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 20,
      }}>
        <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "#475569", borderBottom: "1px solid #1e293b", paddingBottom: 12 }}>
          PACKAGE DIMENSIONS &amp; MASS
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Width"  value={w} onChange={setW} unit="cm" />
          <Field label="Height" value={h} onChange={setH} unit="cm" />
          <Field label="Length" value={l} onChange={setL} unit="cm" />
          <Field label="Mass"   value={m} onChange={setM} unit="kg" />
        </div>

        {/* Result */}
        {error ? (
          <div style={{ background: "#1f0202", border: "1px solid #7f1d1d", borderRadius: 8, padding: 16, color: "#fca5a5", fontSize: 13 }}>
            ⚠ {error}
          </div>
        ) : meta && (
          <div style={{
            background: meta.bg, border: `1px solid ${meta.color}33`,
            borderRadius: 8, padding: 20, display: "flex", flexDirection: "column", gap: 6, alignItems: "center",
            transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 32 }}>{meta.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: meta.color, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.01em" }}>
              {result}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{meta.desc}</div>
          </div>
        )}

        {/* Stats */}
        {!error && result && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, fontSize: 11 }}>
            {[
              ["Volume", `${(Number(w) * Number(h) * Number(l)).toLocaleString()} cm³`, Number(w)*Number(h)*Number(l) >= 1_000_000 ? "#f59e0b" : "#6b7280"],
              ["Max Dim", `${Math.max(Number(w),Number(h),Number(l))} cm`, Math.max(Number(w),Number(h),Number(l)) >= 150 ? "#f59e0b" : "#6b7280"],
              ["Mass", `${m} kg`, Number(m) >= 20 ? "#f59e0b" : "#6b7280"],
            ].map(([lbl, val, col]) => (
              <div key={lbl} style={{ background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
                <div style={{ color: "#475569", marginBottom: 2 }}>{lbl}</div>
                <div style={{ color: col, fontWeight: 500 }}>{val}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test Suite Toggle */}
      <div style={{ width: "100%", maxWidth: 480 }}>
        <button
          onClick={() => setShowTests((s) => !s)}
          style={{
            width: "100%", background: showTests ? "#0f172a" : "#030712",
            border: "1px solid #1e293b", borderRadius: 8, padding: "10px 16px",
            color: "#94a3b8", fontSize: 12, letterSpacing: "0.08em", cursor: "pointer",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <span>TEST SUITE</span>
          <span style={{ color: passed === tests.length ? "#22c55e" : "#ef4444", fontWeight: 700 }}>
            {passed}/{tests.length} PASSING {showTests ? "▲" : "▼"}
          </span>
        </button>

        {showTests && (
          <div style={{ border: "1px solid #1e293b", borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
            {tests.map((t, i) => (
              <div key={i} className="test-row" style={{
                display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "center",
                padding: "10px 14px", borderBottom: i < tests.length - 1 ? "1px solid #0f172a" : "none",
                background: "#050a12", fontSize: 11,
              }}>
                <span>{t.passed ? "✅" : "❌"}</span>
                <div>
                  <div style={{ color: "#cbd5e1", marginBottom: 2 }}>{t.label}</div>
                  <div style={{ color: "#374151", fontFamily: "monospace" }}>
                    sort({t.args.join(", ")})
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: t.passed ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{t.result ?? "ERR"}</div>
                  {!t.passed && <div style={{ color: "#6b7280" }}>exp: {t.expected}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ fontSize: 10, color: "#1e293b", letterSpacing: "0.1em" }}>
        SMARTER TECHNOLOGY · DISPATCH CORE v1.0
      </div>
    </div>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<App />);
}
