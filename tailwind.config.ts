import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#6366f1", // Indigo 500
                secondary: "#ec4899", // Pink 500
            },
        },
    },
    plugins: [],
};
export default config;
