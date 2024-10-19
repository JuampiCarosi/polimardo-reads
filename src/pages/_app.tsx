import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "sonner";

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

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors />
        <Component {...pageProps} />
      </QueryClientProvider>
    </div>
  );
};

export default MyApp;
