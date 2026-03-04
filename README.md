## Smarter Technologies – Robotic Automation Factory

**Package Sorter** is a small, self‑contained module and React UI for classifying packages into dispatch stacks based on their dimensions and mass.

The core logic is implemented as a pure function in `sort.mjs` and is reused by the interactive UI in `package_sorter.jsx`. A tiny Node test runner is provided so you can verify the behaviour without any frontend tooling.

---

### 1. Requirements

- **Node.js**: v18+ (recommended)  
- **npm**: comes bundled with Node

No additional npm dependencies are required to run the tests; everything uses built‑in Node modules only.

---

### 2. Install

From the project root:

```bash
npm install
```

> This will create a `package-lock.json` and `node_modules/` folder, but there are no third‑party packages to download; it simply initialises the project for convenience.

---

### 3. Running the React UI (this project)

From the project root:

```bash
npm start
```

Then open `http://localhost:3000` in your browser.

Behind the scenes:

- `server.mjs` runs a tiny static server on port 3000.
- `index.html` loads React 18 and ReactDOM from a CDN, plus Babel to compile JSX in the browser.
- `sort-browser.mjs` exposes `sort` and `runTests` from `sort.mjs` on `window`.
- `package_sorter.jsx` mounts the React app into the `#root` element.

This gives you a zero‑config way to interact with the UI directly inside this repo.

---

### 4. Running the test suite (backend logic)

The dispatch logic and its edge cases are covered by a small test runner inside `sort.mjs`.

Run:

```bash
npm test
```

or directly:

```bash
node sort.mjs
```

**What this does**

- Executes all test cases defined in `TEST_CASES` inside `sort.mjs`.
- Returns exit code `0` when all tests pass.
- Returns non‑zero exit code if any test fails and logs the failing cases (label, args, expected, actual).

This is the easiest way to verify that the package sorting logic behaves correctly from the command line.

---

### 5. Core algorithm (business rules)

The core function is defined in `sort.mjs` and has the signature:

```js
sort(width, height, length, mass) -> "STANDARD" | "SPECIAL" | "REJECTED"
```

Inputs:

- **width, height, length**: numbers in centimetres
- **mass**: number in kilograms

Validation:

- All four inputs must be **non‑negative**, **finite** numbers.
- Otherwise an error is thrown: `"All inputs must be non-negative finite numbers."`

Classification:

- Compute `volume = width * height * length`.
- A package is **bulky** if:
  - `volume >= 1_000_000` **or**
  - any dimension (`width`, `height`, or `length`) is `>= 150` cm.
- A package is **heavy** if:
  - `mass >= 20` kg.

Result:

- **`"REJECTED"`** if the package is **both** bulky **and** heavy.
- **`"SPECIAL"`** if the package is **either** bulky **or** heavy (but not both).
- **`"STANDARD"`** otherwise.

---

### 6. Using the React UI

`package_sorter.jsx` contains a fully styled React component that:

- Provides inputs for width, height, length (cm) and mass (kg).
- Uses the shared `sort` logic from `sort.mjs` to determine the stack.
- Displays a visual card with:
  - Stack type: `STANDARD`, `SPECIAL`, or `REJECTED`.
  - Explanation text.
  - Live stats for volume, maximum dimension, and mass.
- Includes a collapsible **TEST SUITE** section that shows all test cases and whether they pass.

#### 6.1. Integrating into an existing React / Next.js app

1. **Copy files**
   - Copy both `sort.mjs` and `package_sorter.jsx` into your project (for example into `src/`).
2. **Adjust the import path**
   - In `package_sorter.jsx`, make sure the import matches your file structure:
     ```js
     import { sort, runTests } from "./sort.mjs";
     ```
3. **Ensure React is installed**
   - Your app should already have `react` and `react-dom` (or Next.js) configured.
4. **Render the component**
   - Import and use the default export:
     ```jsx
     import PackageSorterApp from "./package_sorter.jsx";

     function Page() {
       return <PackageSorterApp />;
     }
     ```

> The component uses only standard React state (`useState`) and inline styles, so it will work in any React 18+ or Next.js project without additional dependencies.

---

### 7. Files overview

- **`server.mjs`**
  - Minimal static file server used by `npm start`.
  - Serves `index.html`, `package_sorter.jsx`, `sort-browser.mjs`, and related assets.

- **`index.html`**
  - HTML shell that loads React/ReactDOM via CDN and mounts the Package Sorter UI.

- **`sort.mjs`**
  - `sort(width, height, length, mass)` – pure classification function.
  - `TEST_CASES` – array of edge‑case scenarios.
  - `runTests()` – executes all test cases and returns structured results.
  - When run directly with `node sort.mjs`, prints a summary and sets the process exit code.

- **`sort-browser.mjs`**
  - Browser‑only bridge that attaches `sort` and `runTests` to `window` for use by the JSX bundle.

- **`package_sorter.jsx`**
  - React UI that imports `sort` and `runTests` from `sort.mjs`.
  - Provides a polished input form and visual feedback for classification and test coverage.

---

### 8. Typical development workflow

- **Modify business rules** in `sort.mjs` if dispatch logic changes.
- **Run `npm test`** to confirm all existing edge cases still pass.
- **Update / add test cases** in `TEST_CASES` when you introduce new scenarios.
- **Refresh the React UI** in your host app to visually verify the behaviour with real inputs.

This keeps the decision logic, automated verification, and UI in sync and easy to reason about.
