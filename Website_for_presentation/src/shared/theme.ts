import type { Dimension } from "@domain/dass";

/** Chart fill of a DASS-21 dimension (the report's figure colours). */
export const dimensionColor = (dimension: Dimension) => `var(--dim-${dimension})`;

/** Text colour of a dimension, dark enough to read on paper. */
export const dimensionInk = (dimension: Dimension) => `var(--dim-${dimension}-ink)`;
