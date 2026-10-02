/**
 * Section 4.9: the same tests with and without the 14 respondents who failed
 * the attention check. Two results flip across p = 0.05; the rest hold.
 */

export interface SensitivityResult {
  key: string;
  question: string;
  statistic: string;
  passed: { value: number; p: number };
  all: { value: number; p: number };
}

export const SENSITIVITY: readonly SensitivityResult[] = [
  {
    key: "news-anxiety",
    question: "ติดตามข่าวเชิงลบ กับความวิตกกังวล",
    statistic: "partial r",
    passed: { value: 0.166, p: 0.103 },
    all: { value: 0.189, p: 0.047 },
  },
  {
    key: "gender-depression",
    question: "ชายกับหญิง ซึมเศร้าต่างกัน",
    statistic: "t",
    passed: { value: 1.048, p: 0.297 },
    all: { value: 1.992, p: 0.049 },
  },
  {
    key: "finance-depression",
    question: "สภาพการเงิน กับภาวะซึมเศร้า",
    statistic: "F",
    passed: { value: 10.91, p: 0.0001 },
    all: { value: 15.87, p: 0.0001 },
  },
];
