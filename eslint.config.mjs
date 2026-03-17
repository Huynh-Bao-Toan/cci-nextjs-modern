import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["features/products-portal/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "@/features/products-portal/api/*",
            "@/features/products-portal/hooks/*",
            "@/features/products-portal/components/*",
            "@/features/products-portal/lib/*",
            "@/features/products-portal/adapters/*",
            "@/features/products-portal/composition/*",
            "../api/*",
            "../hooks/*",
            "../components/*",
            "../lib/*",
            "../adapters/*",
            "../composition/*",
            "../../api/*",
            "../../hooks/*",
            "../../components/*",
            "../../lib/*",
            "../../adapters/*",
            "../../composition/*",
          ],
        },
      ],
    },
  },
  {
    files: ["features/products-portal/application/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            "@tanstack/react-query",
            "axios",
            "next",
            "next/navigation",
            "next/server",
          ],
          patterns: [
            "@/features/products-portal/api/*",
            "@/features/products-portal/hooks/*",
            "@/features/products-portal/components/*",
            "@/features/products-portal/lib/*",
            "@/features/products-portal/adapters/*",
            "@/features/products-portal/composition/*",
            "../api/*",
            "../hooks/*",
            "../components/*",
            "../lib/*",
            "../adapters/*",
            "../composition/*",
            "../../api/*",
            "../../hooks/*",
            "../../components/*",
            "../../lib/*",
            "../../adapters/*",
            "../../composition/*",
          ],
        },
      ],
    },
  },
  {
    files: ["features/products-portal/hooks/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            "@/features/products-portal/api/products.endpoints",
            "../api/products.endpoints",
            "../../api/products.endpoints",
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
