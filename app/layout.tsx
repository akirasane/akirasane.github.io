import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio and profile website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      {/* ADD THE HEAD SECTION HERE */}
      <head>
        <link
          rel="stylesheet"
          href="https://ezcookie.free.laravel.cloud/css/cookie-consent-sdk.css"
        />
      </head>

      <body className="h-full flex flex-col overflow-hidden">
        {children}

        {/* Load the SDK */}
        <script src="https://ezcookie.free.laravel.cloud/js/cookie-consent-sdk.min.js" defer></script>
        <script>
          window.addEventListener('DOMContentLoaded', function() {
        if (typeof CookieConsentSDK !== 'undefined') {
            const cookieConsent = new CookieConsentSDK({
            appKey: 'Qht7ygBr3HiHjzRR83n7lDJBO6qE11y2dUgk79R9havleYTF8Su8OlM1N8byuh2b',
          apiBaseUrl: 'https://ezcookie.free.laravel.cloud',
          domain: window.location.hostname,
          locale: document.documentElement.lang || 'en',
          onConsentChange: function(consent) {
            console.log('Consent updated:', consent);
                }
            });
          cookieConsent.init();
        }
    });
        </script>
      </body>
    </html>
  );
}
