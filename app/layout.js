import "./globals.css";
import Providers from "./Providers";
import { Toaster } from "sonner";
import CookieConsent from "./components/common/CookieConsent";

export const metadata = {
  title: "JungleZone | Online Babysitter Introduction Platform",
  description:
    "JungleZone is an online introduction platform connecting parents and independent babysitters across the UK.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <CookieConsent />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
