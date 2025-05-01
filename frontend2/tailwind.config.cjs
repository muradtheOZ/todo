/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,css}"],
  safelist: [
    "text-red-500",
    "bg-gray-100",
    "border-blue-500",
    "p-4",
    "rounded",
    "min-h-screen",
    "text-xl",
    "font-bold",
    "flex",
    "items-center",
    "justify-center",
  ],

  theme: {
    extend: {},
  },
  plugins: [],
};
