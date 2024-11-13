import { getServerAuthSession } from "@/server/auth";
import { type GetServerSidePropsContext, type GetServerSideProps } from "next";

export function getServerSidePropsWithAuth(
  getServerSideProps?: GetServerSideProps,
) {
  return async (context: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(context);

    if (!session) {
      return {
        redirect: {
          destination: "/auth/signin",
        },
      };
    }

    if (getServerSideProps) {
      const serverSideProps = await getServerSideProps(context);

      return {
        props: {
          session,
          ...serverSideProps,
        },
      };
    }

    return { props: { session } };
  };
}
