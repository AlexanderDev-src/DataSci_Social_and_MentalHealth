import { PREDICTOR_INFO, PREDICTORS, SOCIAL_MEDIA_PREDICTORS, type Predictor } from "@data/predictors";
import { PREDICTOR_RANGE } from "@data/regression";
import { formatNumber } from "@shared/format";
import { RangeSlider } from "@shared/ui/RangeSlider";
import { useScoreDrivers } from "../model/useScoreDrivers";
import { PredictionBars } from "./PredictionBars";
import styles from "./scoreDrivers.module.css";

const OTHER_PREDICTORS = PREDICTORS.filter((p) => !SOCIAL_MEDIA_PREDICTORS.includes(p));

/**
 * What-if: move any predictor and the three regression equations re-predict the
 * average score of students like that, holding everything else where it is.
 */
export function ScoreDrivers() {
  const model = useScoreDrivers();

  const slider = (predictor: Predictor) => {
    const info = PREDICTOR_INFO[predictor];
    const range = PREDICTOR_RANGE[predictor];
    const value = model.values[predictor];
    return (
      <RangeSlider
        key={predictor}
        label={info.label}
        value={value}
        min={range.min}
        max={range.max}
        step={info.step}
        display={`${formatNumber(value, info.digits)} ${info.unit}`.trim()}
        mark={{ value: range.mean, label: `ค่าเฉลี่ย ${formatNumber(range.mean)}` }}
        onChange={(v) => model.setValue(predictor, v)}
      />
    );
  };

  return (
    <figure className={styles.layout}>
      <div className={styles.chart}>
        <PredictionBars predictions={model.predictions} baseline={model.baseline} />
        <figcaption className={styles.caption}>
          แท่งคือคะแนนเฉลี่ยที่สมการทำนาย เส้นแนวตั้งคือช่วงความเชื่อมั่น 95% ขีดแนวนอนคือนักศึกษาที่ทุกค่าอยู่ที่ค่าเฉลี่ย
        </figcaption>
      </div>
      <div className={styles.sliders}>
        <fieldset className={styles.group}>
          <legend>พฤติกรรมโซเชียลมีเดีย</legend>
          {SOCIAL_MEDIA_PREDICTORS.map(slider)}
        </fieldset>
        <fieldset className={styles.group}>
          <legend>ชีวิตด้านอื่น</legend>
          {OTHER_PREDICTORS.map(slider)}
        </fieldset>
        <button type="button" className={styles.reset} onClick={model.reset} disabled={!model.changed}>
          คืนทุกค่าเป็นค่าเฉลี่ย
        </button>
      </div>
    </figure>
  );
}
