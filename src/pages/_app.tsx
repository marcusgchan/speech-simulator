import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { api } from "../utils/api";

import "../styles/globals.css";
import { useRouter } from "next/router";
import { SnackbarProvider } from "../components/Snackbar";

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
      <SnackbarProvider>
        <Auth>
          <Component {...pageProps} />
        </Auth>
      </SnackbarProvider>
    </SessionProvider>
  );
};

const Auth = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  } else if (status === "unauthenticated") {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="pt-8 text-center text-2xl font-bold">
          You are not logged in
        </h1>
        <button
          className="m-2 w-80 rounded-xl bg-accent p-2 text-white hover:bg-emerald-700"
          onClick={() => signIn()}
        >
          Login
        </button>
      </div>
    );
  }
  return <>{children}</>;
};

export default api.withTRPC(MyApp);
