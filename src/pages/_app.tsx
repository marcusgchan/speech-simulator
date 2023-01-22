import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { api } from "../utils/api";

import "../styles/globals.css";
import { useRouter } from "next/router";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  // POTENTIAL BUG HERE IF USER CREATES 2 ATTEMPTS QUICKLY
  const { data } = api.attempt.getPresentationToPush.useQuery(undefined, {
    refetchInterval: 5 * 1000,
    onSuccess() {
      if (data) {
        mutation.mutate({ presentationId: data.presentationId });
        router.push(`/presentations/${data.presentationId}`);
      }
    },
  });
  const mutation = api.attempt.deletePresentationToPush.useMutation();
  return (
    <SessionProvider session={session}>
      <Auth>
        <Component {...pageProps} />
      </Auth>
    </SessionProvider>
  );
};

const Auth = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  if (status === "loading") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  } else if (status === "unauthenticated") {
    return (
      <div>
        <h1>You are not logged in</h1>
        <button onClick={() => signIn()}>Login</button>
      </div>
    );
  }
  return <>{children}</>;
};

export default api.withTRPC(MyApp);
