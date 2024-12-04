import { getServerAuthSession } from "@/server/auth";
import { type GetServerSidePropsContext, type GetServerSideProps } from "next";
import { type Session } from "next-auth";

// some utility types for working with tuples
type Cons<H, T extends readonly unknown[]> = ((
  head: H,
  ...tail: T
) => void) extends (...cons: infer R) => void
  ? R
  : never;

type Push<T extends readonly unknown[], V> = T extends unknown
  ? Cons<void, T> extends infer U
    ? { [K in keyof U]: K extends keyof T ? T[K] : V }
    : never
  : never;

// final type you need
type AddArgument<F, Arg> = F extends (...args: infer PrevArgs) => infer R
  ? (...args: Push<PrevArgs, Arg>) => R
  : never;

type GetServerSidePropsWithAuth = AddArgument<GetServerSideProps, Session>;

export function getServerSidePropsWithAuth(
  getServerSideProps?: GetServerSidePropsWithAuth,
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
      const serverSideProps = await getServerSideProps(context, session);
      let additionalProps = {};

      if ("props" in serverSideProps) {
        additionalProps = serverSideProps.props;
      }

      return {
        ...serverSideProps,
        props: {
          session,
          ...additionalProps,
        },
      };
    }

    return { props: { session } };
  };
}
