import { Outfit, IBM_Plex_Mono } from "next/font/google";

export const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
export const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });
