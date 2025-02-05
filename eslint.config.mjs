import nextjs from "@next/eslint-plugin-next";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextjs,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
  ...nextjs.configs.recommended,
];
