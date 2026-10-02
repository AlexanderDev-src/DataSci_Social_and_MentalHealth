import { DIMENSION_LABEL, DIMENSIONS, type Dimension } from "@domain/dass";
import { dimensionColor } from "../theme";
import type { Option } from "./SegmentedControl";

/** The three DASS-21 dimensions as tabs, each underlined in its own colour. */
export const DIMENSION_OPTIONS: readonly Option<Dimension>[] = DIMENSIONS.map((dimension) => ({
  value: dimension,
  label: DIMENSION_LABEL[dimension],
  color: dimensionColor(dimension),
}));
