import { withAuth } from "next-auth/middleware";

const publicRoutes = ["/_next", "/favicon.ico", "/books-2.jpg"];

export default withAuth({
  callbacks: {
    authorized: async ({ req }) => {
      const pathname = req.nextUrl.pathname;

      if (publicRoutes.some((a) => pathname.startsWith(a))) return true;
      const resSession = await fetch(
        process.env.NEXTAUTH_URL + "/api/auth/session",
        {
          method: "GET",
          headers: {
            ...Object.fromEntries(req.headers),
          },
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const session = await resSession.json();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (session?.user?.id != null) return true;
      return false;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
