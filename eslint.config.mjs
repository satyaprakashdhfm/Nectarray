import next from "eslint-config-next";

/** eslint-config-next ships a flat config array, so it spreads in directly. */
const config = [
  { ignores: [".next/**", "node_modules/**", "out/**", "shots/**", "*.cjs"] },
  ...next,
];

export default config;
