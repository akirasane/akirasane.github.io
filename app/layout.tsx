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
      <body className="h-full flex flex-col overflow-hidden">{children}
        <Script
          src="https://mfpgzht7cp.sharedwithexpose.com/js/cookie-consent-sdk.min.js"
          strategy="afterInteractive"
          defer
        />
        <Script id="cookie-consent-init" strategy="afterInteractive">
          {`
            window.addEventListener('DOMContentLoaded', function() {
              if (typeof CookieConsentSDK !== 'undefined') {
                const cookieConsent = new CookieConsentSDK({
                  appKey: 'Qd3nsekwCtyhygW0aCpm8Y8CSekfOCO2VQfDH13r0JsP7lP9iWJvLYDqpInQ0l8N',
                  apiBaseUrl: 'https://mfpgzht7cp.sharedwithexpose.com/api/v1',
                  locale: document.documentElement.lang || 'en',
                  onConsentChange: function(consent) {
                    console.log('Consent updated:', consent);
                  }
                });
                cookieConsent.init();
              }
            });
          `}
        </Script>
      </body>
    </html>
  );
}
