export function calcBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  return weightKg / Math.pow(heightCm / 100, 2);
}

export function bmiCategory(bmi) {
  if (bmi == null) return "";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy range";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

// Mifflin-St Jeor equation — the most widely validated BMR formula for
// general adult use (more accurate than the older Harris-Benedict equation).
export function calcBMR(sex, weightKg, heightCm, age) {
  if (!weightKg || !heightCm || !age) return null;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary", sub: "Little/no exercise", multiplier: 1.2 },
  { id: "light", label: "Light", sub: "Exercise 1-3 days/wk", multiplier: 1.375 },
  { id: "moderate", label: "Moderate", sub: "Exercise 3-5 days/wk", multiplier: 1.55 },
  { id: "active", label: "Active", sub: "Exercise 6-7 days/wk", multiplier: 1.725 },
  { id: "very_active", label: "Very active", sub: "Physical job + training", multiplier: 1.9 },
];

export function calcTDEE(bmr, activityId) {
  if (bmr == null) return null;
  const level = ACTIVITY_LEVELS.find((a) => a.id === activityId);
  if (!level) return null;
  return bmr * level.multiplier;
}
