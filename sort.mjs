/**
 * Determines the dispatch stack for a package based on its dimensions and mass.
 * @param {number} width   - Width in cm
 * @param {number} height  - Height in cm
 * @param {number} length  - Length in cm
 * @param {number} mass    - Mass in kg
 * @returns {"STANDARD" | "SPECIAL" | "REJECTED"}
 */
export function sort(width, height, length, mass) {
  if (
    typeof width !== "number" || typeof height !== "number" ||
    typeof length !== "number" || typeof mass !== "number" ||
    [width, height, length, mass].some((v) => !Number.isFinite(v) || v < 0)
  ) {
    throw new Error("All inputs must be non-negative finite numbers.");
  }

  const volume = width * height * length;
  const isBulky =
    volume >= 1_000_000 || width >= 150 || height >= 150 || length >= 150;
  const isHeavy = mass >= 20;

  if (isBulky && isHeavy) return "REJECTED";
  if (isBulky || isHeavy) return "SPECIAL";
  return "STANDARD";
}

export const TEST_CASES = [
  // Standard
  { args: [10, 10, 10, 5],       expected: "STANDARD", label: "Small, light package" },
  { args: [1, 1, 1, 0],          expected: "STANDARD", label: "Minimal package" },
  { args: [100, 99, 99, 19],     expected: "STANDARD", label: "Just under all thresholds" },
  // Bulky only → SPECIAL
  { args: [100, 100, 100, 5],    expected: "SPECIAL",  label: "Volume exactly 1,000,000 cm³" },
  { args: [200, 10, 10, 5],      expected: "SPECIAL",  label: "One dimension ≥ 150 cm" },
  { args: [150, 1, 1, 1],        expected: "SPECIAL",  label: "Width exactly 150 cm" },
  { args: [1, 150, 1, 1],        expected: "SPECIAL",  label: "Height exactly 150 cm" },
  { args: [1, 1, 150, 1],        expected: "SPECIAL",  label: "Length exactly 150 cm" },
  { args: [500, 500, 500, 10],   expected: "SPECIAL",  label: "Very large, light" },
  // Heavy only → SPECIAL
  { args: [10, 10, 10, 20],      expected: "SPECIAL",  label: "Mass exactly 20 kg" },
  { args: [10, 10, 10, 100],     expected: "SPECIAL",  label: "Very heavy, small" },
  // Both → REJECTED
  { args: [100, 100, 100, 20],   expected: "REJECTED", label: "Exactly at both thresholds" },
  { args: [200, 200, 200, 50],   expected: "REJECTED", label: "Very large and very heavy" },
  { args: [150, 1, 1, 20],       expected: "REJECTED", label: "Bulky by dimension + heavy" },
  // Edge: zero dimensions
  { args: [0, 0, 0, 0],          expected: "STANDARD", label: "All zeros" },
];

export function runTests() {
  return TEST_CASES.map((tc) => {
    let result;
    let error;
    try {
      result = sort(...tc.args);
    } catch (e) {
      error = e.message;
    }
    const passed = !error && result === tc.expected;
    return { ...tc, result, error, passed };
  });
}

if (import.meta.main) {
  const results = runTests();
  const passedCount = results.filter((r) => r.passed).length;
  const total = results.length;

  // Summary
  // eslint-disable-next-line no-console
  console.log(`Package sorter tests: ${passedCount}/${total} passing\n`);

  // Detailed failures, if any
  results
    .filter((r) => !r.passed)
    .forEach((r) => {
      // eslint-disable-next-line no-console
      console.error(
        `✗ ${r.label}\n  args: [${r.args.join(", ")}]\n  expected: ${r.expected}\n  got: ${r.result}\n  error: ${r.error ?? "none"}\n`
      );
    });

  if (passedCount !== total) {
    process.exitCode = 1;
  }
}

