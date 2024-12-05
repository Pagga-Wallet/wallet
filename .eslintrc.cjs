module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "@feature-sliced",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "@feature-sliced/eslint-plugin-messages"],
  processor: "@feature-sliced/messages/fs",
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "import/no-internal-modules": [ "error", {
      "forbid": [ "**/actions/*", "source-map-support/*" ],
    } ]
  },
  "settings": {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true
      }
    }
  }
}
