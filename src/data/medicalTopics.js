export const DISEASE_TOPICS = [
  "Diabetes", "Hypertension", "Chronic Kidney Disease", "HIV/AIDS",
  "Tuberculosis", "Malnutrition", "Obesity", "Cardiovascular Disease",
].map((name) => ({ label: name, query: buildDiseaseQuery(name) }));

export function buildDiseaseQuery(name) {
  return `Explain ${name}: what it is, its causes, risk factors, signs and symptoms, how it's diagnosed, treatment overview, prevention, and nutrition considerations.`;
}

export const MEDICINE_TOPICS = [
  "Metformin", "Amlodipine", "Insulin", "Paracetamol",
  "Amoxicillin", "ARVs (Antiretrovirals)", "Furosemide", "Aspirin",
].map((name) => ({ label: name, query: buildMedicineQuery(name) }));

export function buildMedicineQuery(name) {
  return `Explain the medicine ${name}: its uses, mechanism of action, common side effects, contraindications, food-drug interactions, and nutrition considerations.`;
}

export const MEDICAL_AI_TOPICS = [
  { label: "Explain diseases", query: "What are the most common diseases seen in general clinical practice, and how are they broadly categorized?" },
  { label: "Explain laboratory tests", query: "What are the most common laboratory tests used in clinical practice, and what do they measure?" },
  { label: "Explain anatomy", query: "Give an overview of the major organ systems of the human body and their basic functions." },
  { label: "Explain physiology", query: "Give an overview of key physiological processes the body uses to maintain homeostasis." },
  { label: "Explain pathology", query: "Explain, in general terms, how disease processes damage tissues and organs." },
  { label: "Explain medications", query: "Explain the major classes of medications used in general clinical practice and what each class is for." },
  { label: "Explain clinical nutrition", query: "Explain the core principles of clinical nutrition and how it's used to manage disease." },
  { label: "Explain medical procedures", query: "Explain the most common medical procedures used for diagnosis and treatment in general practice." },
];
