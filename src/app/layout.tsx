import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MarketingPixels } from "@/components/marketing-pixels";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lovinasshop.com"),
  title: {
    default: "Lovina's Shop",
    template: "%s | Lovina's Shop",
  },
  description:
    "Lovina's Shop is a mobile-first Sri Lankan gift and craft store for hampers, plush toys, resin supplies, fragrances, stationery, and packaging.",
  applicationName: "Lovina's Shop",
  openGraph: {
    title: "Lovina's Shop",
    description:
      "Lovina's Shop is a mobile-first Sri Lankan gift and craft store for hampers, plush toys, resin supplies, fragrances, stationery, and packaging.",
    url: "https://lovinasshop.com",
    siteName: "Lovina's Shop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lovina's Shop",
    description:
      "Lovina's Shop is a mobile-first Sri Lankan gift and craft store for hampers, plush toys, resin supplies, fragrances, stationery, and packaging.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f5efe4] text-slate-950">
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined' && !window.fbq) {
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? ""}');
              fbq('track', 'PageView');
            }
          `}
        </Script>
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined' && !window.ttq) {
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
                ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
                ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
                for(var i=0;i<ttq.methods.length;i++) ttq.setAndDefer(ttq,ttq.methods[i]);
                ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
                ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date();ttq._o=ttq._o||{};ttq._o[e]=n||{};
                var o=d.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;
                var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? ""}');
                ttq.page();
              }(window, document, 'ttq');
            }
          `}
        </Script>
        <MarketingPixels />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
