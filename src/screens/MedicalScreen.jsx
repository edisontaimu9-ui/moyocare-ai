import { useState } from "react";
import { TopBar } from "../components/TopBar.jsx";
import { WovenRule } from "../components/WovenRule.jsx";
import { Chip } from "../components/Primitives.jsx";
import { TopicLookup } from "../components/TopicLookup.jsx";
import {
  DISEASE_TOPICS, buildDiseaseQuery,
  MEDICINE_TOPICS, buildMedicineQuery,
  MEDICAL_AI_TOPICS,
} from "../data/medicalTopics.js";

/* ---------------------------------------------------------------------
   MEDICAL
   Every tab is a grounded lookup against the Chakudya RAG orchestrator
   (/rag/ask) — same pipeline the AI Assistant uses — rather than a fixed
   local dataset, so any disease/medicine/topic can be looked up, not just
   a couple of hardcoded examples.
--------------------------------------------------------------------- */
export function MedicalScreen({ c, dark, setDark }) {
  const [tab, setTab] = useState("diseases");

  return (
    <div style={{ paddingBottom: 18 }}>
      <TopBar c={c} dark={dark} setDark={setDark} title="Medical" />
      <WovenRule c={c} />
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto" }}>
          {[["diseases", "Diseases"], ["medicines", "Medicines"], ["ai", "Medical AI"]].map(([id, label]) => (
            <Chip key={id} c={c} active={tab === id} onClick={() => setTab(id)}>{label}</Chip>
          ))}
        </div>

        {tab === "diseases" && (
          <TopicLookup
            c={c}
            suggestions={DISEASE_TOPICS}
            buildQuery={buildDiseaseQuery}
            placeholder="Search any disease or condition…"
          />
        )}

        {tab === "medicines" && (
          <TopicLookup
            c={c}
            suggestions={MEDICINE_TOPICS}
            buildQuery={buildMedicineQuery}
            placeholder="Search any medicine…"
          />
        )}

        {tab === "ai" && (
          <TopicLookup
            c={c}
            suggestions={MEDICAL_AI_TOPICS}
            buildQuery={(q) => q}
            placeholder="Ask a general medical question…"
          />
        )}
      </div>
    </div>
  );
}
