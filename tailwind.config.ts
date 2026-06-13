import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { fontFamily: { outfit: ["Outfit","sans-serif"] }, letterSpacing: { tightest: "-0.05em" } } },
  plugins: [],
};
export default config;
