import { Sparkles } from "lucide-react";
import { Card } from "./Primitives.jsx";
import { GroundedAnswerContent } from "./GroundedAnswerContent.jsx";

export function AssistantBubble({ c, response }) {
  return (
    <div style={{ display: "flex", gap: 9, marginBottom: 18 }}>
      <div style={{ width: 26, height: 26, borderRadius: 9, background: c.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
        <Sparkles size={13} color={c.bg} />
      </div>
      <div style={{ flex: 1 }}>
        <Card c={c} style={{ padding: 14, borderRadius: "4px 16px 16px 16px" }}>
          <GroundedAnswerContent c={c} response={response} />
        </Card>
      </div>
    </div>
  );
}
