import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { Inter as FontSans } from "next/font/google";
import { Poppins as BrandSans } from "next/font/google";

import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { cn } from "@/lib/utils";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      queryFn: ({ queryKey }) =>
        fetch("/api/" + queryKey.join("/")).then(async (res) => {
          if (!res.ok) {
            throw await res.json();
          }
          return res.json() as never;
        }),
    },
  },
});

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const brandSans = BrandSans({
  subsets: ["latin"],
  weight: ["400", "700", "900", "500", "600"],
  variable: "--brand-sans",
  display: "swap",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div>
      <style jsx global>{`
				:root {
          --font-sans: ${fontSans.style.fontFamily};
          --brand-sans: ${brandSans.style.fontFamily};
				}
			}`}</style>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster richColors />
          <Component {...pageProps} />
        </QueryClientProvider>
      </SessionProvider>
    </div>
  );
};

export default MyApp;
