import { useState, useEffect } from "react";
import { RouterOutputs, api } from "../../utils/api";
import { useRouter } from "next/router";

export default function Index() {
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

  const isMobile = width <= 1000;

  const router = useRouter();
  const navigate = (path: string) => {
    if (router.pathname !== path) {
      router.push(path);
    }
  };

  const { data, isLoading, isError } = api.presentation.getAll.useQuery();

  if (!data || isLoading) return <div>loading</div>;
  if (isError) return <div>something died¡</div>;

  const PresentationCard = ({
    presentation,
  }: {
    presentation: NonNullable<RouterOutputs["presentation"]["getPresentation"]>;
  }) => {
    return (
      <button
        className="m-4 flex flex-col rounded-xl border-2 p-4 text-left"
        onClick={() => navigate(`/presentations/${presentation.id}/`)}
      >
        <div className="h-4 w-full"></div>
        <i>{presentation.createdAt.toDateString()}</i>
        <h1 className="text-2xl font-extrabold">{presentation.title}</h1>
        <div className="text-accent">
          Goal time: {Math.round((presentation.idealTime / 60) * 100) / 100}{" "}
          minutes
        </div>
      </button>
    );
  };

  return (
    <div>
      <div className="p-4">
        <h1 className="py-10 px-4 text-3xl font-extrabold">
          Previous Presentations
        </h1>
        <section
          className={`grid auto-rows-fr ${
            isMobile ? "grid-cols-1 " : "grid-cols-4"
          }`}
        >
          {data.map((presentation, i) => (
            <PresentationCard
              presentation={presentation}
              key={i}
            ></PresentationCard>
          ))}
        </section>
      </div>
    </div>
  );
}
