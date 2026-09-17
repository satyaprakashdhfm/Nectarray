/**
 * What shape a submission's cost has, read off measurements rather than
 * asserted.
 *
 * The judge times every test case and notes how big its input was. Plotted on
 * log-log axes, a cost of roughly c·nᵏ becomes a straight line of slope k —
 * so the exponent falls out of a least-squares fit, and the fit's own r²
 * says whether the points were anywhere near a line in the first place.
 *
 * This replaces asking a model. A model produces a confident sentence whether
 * or not it is right, and a student has no way to check it; a measured
 * exponent of 1.97 over inputs from 60 to 1900 is evidence they can see the
 * working of. The price is honesty about what measurement cannot separate —
 * see `label` below.
 */

export type Sample = [size: number, cost: number];

export type Growth = {
  /** The fitted exponent k in cost ≈ c·nᵏ. */
  exponent: number;
  /** How well a straight line fitted, 0 to 1. */
  fit: number;
  /** The plain-language shape, or null when the data will not support one. */
  label: string | null;
  /** How many distinct input sizes the fit rests on. */
  points: number;
};

/**
 * Bands, and the gaps between them are deliberate.
 *
 * Nothing claims to tell O(n) from O(n log n). Over a sixty-fold range of
 * input, log n grows by about 1.6× in total — a difference smaller than the
 * noise between two runs of the same code on a shared machine. Claiming to
 * separate them would be the model's sin in a different costume, so one band
 * covers both and says so.
 */
const BANDS: { max: number; label: string }[] = [
  { max: 0.3, label: "constant — O(1)" },
  { max: 0.55, label: "sub-linear — O(log n) or thereabouts" },
  { max: 1.45, label: "linear-ish — O(n) or O(n log n)" },
  { max: 2.4, label: "quadratic — O(n²)" },
  { max: 3.4, label: "cubic — O(n³)" },
  { max: Infinity, label: "worse than cubic" },
];

/**
 * Fits cost against input size.
 *
 * Samples are bucketed by size and reduced to a median first. There are a
 * hundred cases and many share a size, and the median of a repeated size is a
 * far better estimate than any single timing — one case that happened to land
 * during a garbage collection would otherwise bend the whole line.
 */
export function fitGrowth(samples: Sample[]): Growth | null {
  const bySize = new Map<number, number[]>();
  for (const [size, cost] of samples) {
    // Below a few dozen elements the call overhead is the measurement, not
    // the algorithm; and a zero cost has no logarithm.
    if (size < 16 || cost <= 0) continue;
    const bucket = bySize.get(size);
    if (bucket) bucket.push(cost);
    else bySize.set(size, [cost]);
  }

  const points = [...bySize.entries()]
    .map(([size, costs]) => {
      const sorted = [...costs].sort((a, b) => a - b);
      return [size, sorted[Math.floor(sorted.length / 2)]] as const;
    })
    .sort((a, b) => a[0] - b[0]);

  if (points.length < 4) return null;

  // The sizes must span enough ground for a slope to mean anything. An
  // eightfold range is the least that separates linear from quadratic.
  const span = points[points.length - 1][0] / points[0][0];
  if (span < 8) return null;

  const xs = points.map(([size]) => Math.log(size));
  const ys = points.map(([, cost]) => Math.log(cost));
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;

  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i += 1) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    sxy += dx * dy;
    sxx += dx * dx;
    syy += dy * dy;
  }
  if (sxx === 0) return null;

  const exponent = sxy / sxx;
  const fit = syy === 0 ? 0 : (sxy * sxy) / (sxx * syy);

  /*
   * A flat line is the one shape r² cannot vouch for.
   *
   * r² asks how much of the variation the slope explains, and constant-time
   * code has no variation to explain — a perfect O(1) measurement scores near
   * zero and would be thrown out as unreadable, which is exactly backwards.
   * So a near-zero slope is judged on whether the cost actually stayed put —
   * and "stayed put" is measured against the size range rather than against a
   * fixed number, because a call that does nothing takes a few hundred
   * nanoseconds and a few hundred nanoseconds vary by threefold on a shared
   * machine. Set the bar at the square root of the size range: over a
   * 128-fold spread of input, anything growing slower than √128 ≈ 11× is not
   * growing with n, while genuinely linear code would have grown 128×.
   */
  const costs = points.map(([, cost]) => cost);
  const spread = Math.max(...costs) / Math.min(...costs);
  if (Math.abs(exponent) < 0.3 && spread < Math.max(2.5, Math.sqrt(span))) {
    return {
      exponent: Math.round(exponent * 100) / 100,
      fit: Math.round(fit * 100) / 100,
      label: BANDS[0].label,
      points: n,
    };
  }

  return {
    exponent: Math.round(exponent * 100) / 100,
    fit: Math.round(fit * 100) / 100,
    /*
     * A poor fit means the points were not on a line, and the exponent from a
     * line that is not there is a number with no meaning. Say nothing rather
     * than dress it up — "could not tell" is a true statement and a guess is
     * not.
     */
    label:
      fit < 0.8
        ? null
        : (BANDS.find((band) => exponent < band.max)?.label ?? null),
    points: n,
  };
}
