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
  const { data } = api.attempt.getAttemptsToPush.useQuery(undefined, {
    refetchInterval: 5 * 1000,
  });
  console.log(router.pathname);
  if (data && router.pathname !== "/presentations/attempts") {
    router.push(`/presentations/attempts`);
  }
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
