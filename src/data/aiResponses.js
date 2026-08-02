// Mock AI assistant responses, keyed by exact suggested-prompt text.
// Replace this with a real call to the Chakudya AI / RAG pipeline later —
// AssistantScreen just needs RESPONSES[query] (or DEFAULT_RESPONSE) shaped
// like { explanation, clinical, nutrition, refs, safety }.
export const RESPONSES = {
  "Explain diabetes.": {
    explanation: "Diabetes mellitus is a group of metabolic conditions where the body cannot regulate blood glucose effectively, either from insufficient insulin production (Type 1) or insulin resistance (Type 2).",
    clinical: "Type 2 diabetes accounts for most cases and is diagnosed via fasting glucose ≥126 mg/dL, HbA1c ≥6.5%, or an oral glucose tolerance test. Long-term hyperglycaemia can damage the eyes, kidneys, nerves, and blood vessels.",
    nutrition: "A consistent-carbohydrate eating pattern, higher fibre intake, and spacing meals helps stabilise post-meal glucose. Diabetes exchange lists in the Nutrition module can help with portioning maize, rice, and legume-based Malawian staples.",
    refs: "American Diabetes Association Standards of Care · WHO Diabetes Fact Sheet",
    safety: "This is educational information, not a diagnosis. Speak with a clinician for testing and personalised treatment.",
  },
  "What nutrients are in nsima?": {
    explanation: "Nsima, Malawi's maize-meal staple, is primarily a carbohydrate source with modest protein and very low fat, and is typically paired with a relish for balance.",
    clinical: "Per 100 g cooked: roughly 130 kcal, 28 g carbohydrate, 2.4 g protein, 0.5 g fat. It contributes iron and B-vitamins if made from unrefined flour, but is low in lysine, an essential amino acid.",
    nutrition: "Pairing nsima with legumes (beans, groundnuts) or animal protein improves the amino-acid profile. For diabetes management, portion using the Diabetes Exchange Calculator, since it is a fast-digesting carbohydrate.",
    refs: "Malawi Food Composition Table, 2019 · Chakudya Nutrition Registry",
    safety: null,
  },
  "How does metformin work?": {
    explanation: "Metformin is a first-line biguanide medication for Type 2 diabetes that primarily lowers glucose production by the liver and improves how the body's tissues respond to insulin.",
    clinical: "It reduces hepatic gluconeogenesis, decreases intestinal glucose absorption, and increases peripheral glucose uptake. It does not typically cause hypoglycaemia on its own and has a favourable cardiovascular safety profile.",
    nutrition: "Metformin can reduce vitamin B12 absorption with long-term use, and taking it with food reduces gastrointestinal side effects. See the Medicines section for full food-drug interaction detail.",
    refs: "UK NICE Guideline NG28 · Malawi Standard Treatment Guidelines",
    safety: "Educational information only — this does not replace a prescription or medical advice from your clinician or pharmacist.",
  },
};

export const DEFAULT_RESPONSE = RESPONSES["Explain diabetes."];
