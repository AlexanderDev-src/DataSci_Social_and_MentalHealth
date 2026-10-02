/** The eight predictors of the regression in chapter 4, in the notebook's order. */

export type Predictor =
  | "social_media_hours"
  | "news_days"
  | "sleep_hours"
  | "sleep_quality"
  | "exercise_days"
  | "study_pressure"
  | "GPA"
  | "financial_sufficiency";

export const PREDICTORS: readonly Predictor[] = [
  "social_media_hours",
  "news_days",
  "sleep_hours",
  "sleep_quality",
  "exercise_days",
  "study_pressure",
  "GPA",
  "financial_sufficiency",
];

/** Social media use is what the project asks about; the rest are held fixed as controls. */
export const SOCIAL_MEDIA_PREDICTORS: readonly Predictor[] = ["social_media_hours", "news_days"];

export const isSocialMedia = (predictor: Predictor) => SOCIAL_MEDIA_PREDICTORS.includes(predictor);

interface PredictorInfo {
  label: string;
  unit: string;
  step: number;
  /** Decimal places when the value is shown. */
  digits: number;
}

export const PREDICTOR_INFO: Record<Predictor, PredictorInfo> = {
  social_media_hours: { label: "ใช้โซเชียลมีเดีย", unit: "ชม./วัน", step: 0.5, digits: 1 },
  news_days: { label: "ติดตามข่าวเชิงลบ", unit: "วัน/สัปดาห์", step: 1, digits: 0 },
  sleep_hours: { label: "ชั่วโมงการนอน", unit: "ชม./คืน", step: 0.5, digits: 1 },
  sleep_quality: { label: "คุณภาพการนอน", unit: "/10", step: 1, digits: 0 },
  exercise_days: { label: "ออกกำลังกาย", unit: "วัน/สัปดาห์", step: 1, digits: 0 },
  study_pressure: { label: "ความกดดันจากการเรียน", unit: "/10", step: 1, digits: 0 },
  GPA: { label: "เกรดเฉลี่ยสะสม", unit: "", step: 0.05, digits: 2 },
  financial_sufficiency: { label: "ความเพียงพอทางการเงิน", unit: "/10", step: 1, digits: 0 },
};
