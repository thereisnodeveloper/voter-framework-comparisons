import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from "recharts";

const FRAMEWORKS = [
  { key: "multicriteria", name: "Multi-Criteria Matrix", short: "Multi-Criteria", color: "#1B3A5C" },
  { key: "singleissue", name: "Single-Issue Voting", short: "Single-Issue", color: "#D4763C" },
  { key: "endorsement", name: "Endorsement / Delegation", short: "Endorsement", color: "#2A7F8E" },
  { key: "values", name: "Values-First Voting", short: "Values-First", color: "#7B4F9E" },
  { key: "strategic", name: "Strategic / Game-Theory", short: "Strategic", color: "#C4443E" },
  { key: "community", name: "Community Deliberation", short: "Community", color: "#4A8C3F" },
  { key: "trackrecord", name: "Track Record Only", short: "Track Record", color: "#B08D2E" },
  { key: "hybrid", name: "Hybrid Approach", short: "Hybrid", color: "#E06090" },
];

const CRITERIA = [
  { key: "efficiency", label: "Efficiency", desc: "How little time/effort it requires" },
  { key: "manipulation", label: "Manipulation\nResistance", desc: "How hard it is for campaigns to game" },
  { key: "accuracy", label: "Decision\nAccuracy", desc: "How often it leads to choices you'd still endorse later" },
  { key: "accessibility", label: "Accessibility", desc: "How usable for a first-time voter" },
  { key: "adaptability", label: "Adaptability", desc: "Works across different office types" },
];

const SCORES = {
  multicriteria:  { efficiency: 2, manipulation: 4, accuracy: 4, accessibility: 3, adaptability: 5 },
  singleissue:    { efficiency: 5, manipulation: 2, accuracy: 2, accessibility: 5, adaptability: 3 },
  endorsement:    { efficiency: 5, manipulation: 2, accuracy: 3, accessibility: 5, adaptability: 4 },
  values:         { efficiency: 3, manipulation: 3, accuracy: 3, accessibility: 3, adaptability: 4 },
  strategic:      { efficiency: 2, manipulation: 3, accuracy: 3, accessibility: 2, adaptability: 2 },
  community:      { efficiency: 2, manipulation: 4, accuracy: 4, accessibility: 3, adaptability: 3 },
  trackrecord:    { efficiency: 3, manipulation: 5, accuracy: 4, accessibility: 4, adaptability: 3 },
  hybrid:         { efficiency: 4, manipulation: 4, accuracy: 5, accessibility: 4, adaptability: 5 },
};

const radarData = CRITERIA.map(c => {
  const point = { criterion: c.label.replace("\n", " ") };
  FRAMEWORKS.forEach(f => { point[f.key] = SCORES[f.key][c.key]; });
  return point;
});

function ScoreCell({ score }) {
  const bg = score === 5 ? "#1a6b4a" : score === 4 ? "#3a9a6a" : score === 3 ? "#e8b84a" : score === 2 ? "#d4763c" : "#c4443e";
  return (
    <td style={{ backgroundColor: bg, color: "#fff", textAlign: "center", fontWeight: 700, fontSize: 15, padding: "8px 4px", minWidth: 36, border: "2px solid #fff" }}>
      {score}
    </td>
  );
}

function avg(obj) {
  const vals = Object.values(obj);
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}

export default function FrameworkComparison() {
  const [selected, setSelected] = useState(new Set(["multicriteria", "hybrid", "trackrecord"]));

  const toggle = (key) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) { if (next.size > 1) next.delete(key); }
      else next.add(key);
      return next;
    });
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", maxWidth: 920, margin: "0 auto", padding: "24px 16px", color: "#1a1a1a" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1B3A5C", marginBottom: 4, letterSpacing: "-0.3px" }}>
        Voter Decision Frameworks: Systematic Comparison
      </h1>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 1.4 }}>
        Each framework scored 1–5 across five evaluation criteria. Click frameworks below to toggle them on the radar chart.
      </p>

      {/* Toggle buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {FRAMEWORKS.map(f => (
          <button
            key={f.key}
            onClick={() => toggle(f.key)}
            style={{
              padding: "5px 12px", borderRadius: 6, border: "2px solid " + f.color, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              backgroundColor: selected.has(f.key) ? f.color : "transparent",
              color: selected.has(f.key) ? "#fff" : f.color,
            }}
          >
            {f.short}
          </button>
        ))}
      </div>

      {/* Radar Chart */}
      <div style={{ backgroundColor: "#f8f9fb", borderRadius: 12, padding: "16px 0 8px", marginBottom: 28, border: "1px solid #e4e7eb" }}>
        <ResponsiveContainer width="100%" height={370}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
            <PolarGrid stroke="#d0d4da" />
            <PolarAngleAxis dataKey="criterion" tick={{ fontSize: 11, fill: "#444", fontWeight: 600 }} />
            <PolarRadiusAxis angle={90} domain={[0, 5]} tickCount={6} tick={{ fontSize: 10, fill: "#999" }} />
            {FRAMEWORKS.filter(f => selected.has(f.key)).map(f => (
              <Radar key={f.key} name={f.short} dataKey={f.key} stroke={f.color} fill={f.color} fillOpacity={0.08} strokeWidth={2.5} dot={{ r: 3, fill: f.color }} />
            ))}
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #ddd" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Heat Map Table */}
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1B3A5C", marginBottom: 10 }}>Score Matrix</h2>
      <div style={{ overflowX: "auto", marginBottom: 8 }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 10px", borderBottom: "2px solid #1B3A5C", fontSize: 12, color: "#1B3A5C", minWidth: 140 }}>Framework</th>
              {CRITERIA.map(c => (
                <th key={c.key} style={{ textAlign: "center", padding: "8px 4px", borderBottom: "2px solid #1B3A5C", fontSize: 11, color: "#1B3A5C", lineHeight: 1.3, minWidth: 72 }}>
                  {c.label.replace("\n", " ")}
                </th>
              ))}
              <th style={{ textAlign: "center", padding: "8px 6px", borderBottom: "2px solid #1B3A5C", fontSize: 12, color: "#1B3A5C", fontStyle: "italic" }}>Avg</th>
            </tr>
          </thead>
          <tbody>
            {FRAMEWORKS.map((f, i) => (
              <tr key={f.key} style={{ backgroundColor: i % 2 === 0 ? "#f8f9fb" : "#fff" }}>
                <td style={{ padding: "7px 10px", fontWeight: 600, fontSize: 12, borderBottom: "1px solid #eee", color: f.color }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", backgroundColor: f.color, marginRight: 6, verticalAlign: "middle" }} />
                  {f.short}
                </td>
                {CRITERIA.map(c => <ScoreCell key={c.key} score={SCORES[f.key][c.key]} />)}
                <td style={{ textAlign: "center", fontWeight: 700, fontSize: 14, padding: "7px 6px", borderBottom: "1px solid #eee", color: "#1B3A5C" }}>
                  {avg(SCORES[f.key])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 8, marginBottom: 24 }}>
        {[1,2,3,4,5].map(n => {
          const bg = n === 5 ? "#1a6b4a" : n === 4 ? "#3a9a6a" : n === 3 ? "#e8b84a" : n === 2 ? "#d4763c" : "#c4443e";
          return <div key={n} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#666" }}>
            <span style={{ width: 16, height: 16, borderRadius: 3, backgroundColor: bg, display: "inline-block" }} />
            {n === 1 ? "Weak" : n === 3 ? "Moderate" : n === 5 ? "Strong" : ""}
          </div>;
        })}
      </div>

      {/* Key Insight */}
      <div style={{ backgroundColor: "#EDF6F7", border: "1px solid #2A7F8E", borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#2A7F8E", marginBottom: 6 }}>Key Takeaway</p>
        <p style={{ fontSize: 13, lineHeight: 1.55, color: "#1a1a1a", margin: 0 }}>
          No single framework dominates all criteria. The <strong>Hybrid Approach</strong> scores highest overall (4.4 avg) because it borrows from multiple methods — applying deep analysis where stakes are highest and efficient delegation where they're not. The <strong>Track Record Only</strong> approach offers the strongest manipulation resistance (5.0) but disadvantages newcomer candidates. <strong>Single-Issue</strong> and <strong>Endorsement</strong> voting are the most efficient but most vulnerable to being gamed.
        </p>
      </div>

      <p style={{ fontSize: 11, color: "#999", textAlign: "center", marginTop: 12 }}>
        Scores reflect general tendencies, not absolutes. A well-executed single-issue strategy can outperform a poorly-executed multi-criteria one. The best framework is the one you'll actually use consistently.
      </p>
    </div>
  );
}
