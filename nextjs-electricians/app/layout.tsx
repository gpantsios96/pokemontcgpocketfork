import type { Metadata } from "next";
import "./globals.css";

// Use system fonts for better performance and no external dependencies
// This matches the original site's font stack

export const metadata: Metadata = {
  title: "Ηλεκτρολόγοι Θεσσαλονίκη - Βρείτε Έμπειρους Επαγγελματίες",
  description: "Βρείτε έμπειρους ηλεκτρολόγους στη Θεσσαλονίκη. Αξιόπιστοι επαγγελματίες για όλες τις ηλεκτρολογικές σας ανάγκες.",
  keywords: ["ηλεκτρολόγοι", "Θεσσαλονίκη", "electrician", "ηλεκτρολογικές εργασίες"],
  authors: [{ name: "Ηλεκτρολόγοι Θεσσαλονίκη" }],
  openGraph: {
    title: "Ηλεκτρολόγοι Θεσσαλονίκη",
    description: "Βρείτε έμπειρους ηλεκτρολόγους στη Θεσσαλονίκη",
    locale: "el_GR",
    type: "website",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
