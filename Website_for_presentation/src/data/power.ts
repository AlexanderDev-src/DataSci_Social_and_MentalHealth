/** True effect sizes worth trying on the power slide (section 5.2 of the report). */

export interface EffectPreset {
  key: string;
  label: string;
  rho: number;
}

export const EFFECT_PRESETS: readonly EffectPreset[] = [
  // Orben & Przybylski (2019): digital technology explains at most 0.4% of well-being
  { key: "orben", label: "งานระดับโลก (r ≈ 0.06)", rho: Math.sqrt(0.004) },
  { key: "news", label: "ข่าวกับความวิตก (r = 0.146)", rho: 0.146 },
  { key: "medium", label: "ขนาดกลาง (r = 0.30)", rho: 0.3 },
];

export const STUDY_N = 107;
