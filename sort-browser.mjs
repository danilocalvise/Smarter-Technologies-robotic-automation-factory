import { sort, runTests } from "./sort.mjs";

// Expose the core logic on window for the browser JSX bundle.
// This keeps the business rules in a single place (`sort.mjs`),
// while allowing `package_sorter.jsx` to consume them without a bundler.
window.sort = sort;
window.runTests = runTests;

