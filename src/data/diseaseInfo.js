import {
  Info, Activity, TrendingUp, Stethoscope, Check, Pill, ShieldCheck, Apple,
} from "lucide-react";

// List of diseases shown as filter chips. Only "Hypertension" has full
// detail wired up right now — swap this out for a real Chakudya lookup.
export const DISEASES = [
  "Diabetes", "Hypertension", "Chronic Kidney Disease", "HIV/AIDS",
  "Tuberculosis", "Malnutrition", "Obesity", "Cardiovascular Disease",
];

export const HYPERTENSION_SECTIONS = [
  { t: "Overview", icon: Info, body: "Hypertension is persistently elevated arterial blood pressure (≥140/90 mmHg), a major modifiable risk factor for stroke, heart disease, and kidney disease." },
  { t: "Causes", icon: Activity, body: "Primary hypertension has no single cause and develops from a mix of genetics, ageing, and lifestyle. Secondary hypertension arises from an identifiable condition such as kidney disease or hormonal disorders." },
  { t: "Risk factors", icon: TrendingUp, body: "High salt intake, low potassium intake, physical inactivity, excess alcohol, obesity, chronic stress, and family history." },
  { t: "Signs & symptoms", icon: Stethoscope, body: "Often asymptomatic. When present: headaches, dizziness, blurred vision, or nosebleeds — usually only at very high readings." },
  { t: "Diagnosis", icon: Check, body: "Confirmed with repeated blood-pressure readings across separate visits, or 24-hour ambulatory monitoring." },
  { t: "Treatment overview", icon: Pill, body: "Lifestyle modification is first-line; medications (e.g. ACE inhibitors, calcium channel blockers, diuretics) are added based on risk and response." },
  { t: "Prevention", icon: ShieldCheck, body: "Reduce dietary sodium, maintain healthy weight, stay active, limit alcohol, and manage stress." },
  { t: "Nutrition considerations", icon: Apple, body: "A DASH-style eating pattern — rich in vegetables, fruit, legumes, and low-fat dairy, with sodium under 2 g/day — meaningfully lowers blood pressure." },
];
