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
      <body className="h-full flex flex-col overflow-hidden">
        {children}
        
        {/* Load the SDK */}
        <Script
          src="https://mfpgzht7cp.sharedwithexpose.com/js/cookie-consent-sdk.min.js"
          strategy="afterInteractive"
        />
        
        {/* Initialize the SDK */}
        <Script id="cookie-consent-init" strategy="afterInteractive">
          {`
            function initCookieConsent() {
              // Check if the SDK script has finished loading
              if (typeof CookieConsentSDK !== 'undefined') {
                const cookieConsent = new CookieConsentSDK({
                  appKey: 'Qd3nsekwCtyhygW0aCpm8Y8CSekfOCO2VQfDH13r0JsP7lP9iWJvLYDqpInQ0l8N',
                  apiBaseUrl: 'https://mfpgzht7cp.sharedwithexpose.com',
                  locale: document.documentElement.lang || 'en',
                  onConsentChange: function(consent) {
                    console.log('Consent updated:', consent);
                  }
                });
                cookieConsent.init();
              } else {
                // If not loaded yet, wait 50ms and try again
                setTimeout(initCookieConsent, 50);
              }
            }
            
            // Start the initialization check
            initCookieConsent();
          `}
        </Script>
      </body>
    </html>
  );
}
