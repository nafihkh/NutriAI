import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Nutri AI - Health Overview & AI Nutrition Coach",
  description: "Track your calories, macronutrients, water intake, weight, and BMI, with personalized insights from our AI Nutrition Coach.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="h-full w-full overflow-hidden">
        {children}
      </body>
    </html>
  );
}
