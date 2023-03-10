import { type NextPage } from "next";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Speech Simulator</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        <AuthShowcase />
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const router = useRouter();
  const navigate = (path: string) => {
    if (router.pathname !== path) {
      router.push(path);
    }
  };

  // {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 800;

  return (
    <div className="flex flex-col items-center">
      <h1
        className={`pt-8 text-center font-bold ${
          isMobile ? "text-2xl" : "text-3xl"
        }`}
      >
        Speech Simulator
      </h1>
      <h1
        className={`pt-4 pb-16 text-center font-extrabold ${
          isMobile ? "text-5xl" : "text-7xl"
        }`}
      >
        Practice and Perfect.
      </h1>
      <div
        className={`flex justify-around text-2xl ${
          isMobile ? "flex-col" : "flex-row"
        }`}
      >
        <button
          className="m-2 w-80 rounded-xl bg-accent p-2 text-white hover:bg-emerald-700"
          onClick={() => navigate("/presentations/create")}
        >
          Create Presentation
        </button>
        <button
          className="m-2 w-80 rounded-xl bg-accent p-2 text-white hover:bg-emerald-700"
          onClick={() => navigate("/presentations")}
        >
          Previous Presentations
        </button>
      </div>
      <div className="flex items-center p-4">
        <i>
          {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        </i>
        <button
          className="mx-2 rounded-xl border-2 px-2"
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
