import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }], // Interdit les console.log oubliés
      "prefer-const": "error", // Force l'utilisation de const
      "@typescript-eslint/no-unused-vars": "warn", // Alerte si une variable ne sert à rien
    },
  },
];

export default eslintConfig;