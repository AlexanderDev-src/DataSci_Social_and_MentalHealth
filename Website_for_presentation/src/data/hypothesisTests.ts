/** The four hypothesis tests the course asks for (table 4.8, alpha = 0.05). */

export interface HypothesisTest {
  key: string;
  hypothesis: string;
  test: string;
  result: string;
  p: number;
}

export const HYPOTHESIS_TESTS: readonly HypothesisTest[] = [
  {
    key: "sleep",
    hypothesis: "นักศึกษานอนเฉลี่ยคืนละ 7 ชั่วโมง",
    test: "one-sample t",
    result: "t(105) = −5.244",
    p: 0.0001,
  },
  {
    key: "anxiety-share",
    hypothesis: "ครึ่งหนึ่งมีความวิตกกังวลเกินระดับปกติ",
    test: "one-proportion z",
    result: "z = 3.770",
    p: 0.0001,
  },
  {
    key: "gender",
    hypothesis: "ชายและหญิงมีคะแนนซึมเศร้าเท่ากัน",
    test: "independent t",
    result: "t(105) = 1.048",
    p: 0.297,
  },
  {
    key: "content",
    hypothesis: "4 กลุ่มเนื้อหามีคะแนนวิตกกังวลเท่ากัน",
    test: "one-way ANOVA",
    result: "F(3, 103) = 0.225",
    p: 0.879,
  },
];
