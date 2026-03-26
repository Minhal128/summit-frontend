import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@/app/globals.css';
import { ToastContainer } from "react-toastify";
import { CartProvider } from "@/contexts/CartContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { ThemeProvider } from "@/components/theme-provider";
import { NfcReaderProvider } from "@/contexts/NfcReaderContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Summit Exchange",
  description:
    "Professional trading platform for cryptocurrencies and traditional assets",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <html lang={locale ?? "en"} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider initialLanguage={locale}>
            <NfcReaderProvider>
              <CartProvider>
                <WalletProvider>{children}</WalletProvider>
              </CartProvider>
            </NfcReaderProvider>
          </I18nProvider>
        </ThemeProvider>
        </NextIntlClientProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
