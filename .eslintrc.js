module.exports = {
  parser: "@typescript-eslint/parser",
  root: true,
  plugins: ["@typescript-eslint", "no-floating-promise"],
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  ignorePatterns: [".eslintrc.js", "node_modules/**"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/no-empty-function": "warn",
  },
};
