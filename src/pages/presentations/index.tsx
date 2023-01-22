import test from "node:test";
import { useState, useEffect } from "react";
import { createPresentationSchema } from "../../schemas/presentation";
import { api } from "../../utils/api";
import { useRouter } from "next/router";

export default function Index() {
  // const testData = [
  //   {
  //     id: 1,
  //     title: "test presentation 1",
  //     createdAt: "2023-01-01",
  //     attempts: 3,
  //   },
  //   {
  //     id: 2,
  //     title: "test presentation 2 very long title",
  //     createdAt: "2023-01-02",
  //     attempts: 1,
  //   },
  //   {
  //     id: 3,
  //     title: "test presentation 3",
  //     createdAt: "2023-01-03",
  //     attempts: 5,
  //   },
  //   {
  //     id: 4,
  //     title: "test presentation 4",
  //     createdAt: "2023-01-04",
  //     attempts: 10,
  //   },
  //   {
  //     id: 5,
  //     title: "test presentation 5",
  //     createdAt: "2023-01-05",
  //     attempts: 7,
  //   },
  //   {
  //     id: 6,
  //     title: "test presentation 6",
  //     createdAt: "2023-01-06",
  //     attempts: 3924,
  //   },
  // ];

  const [presentations, setPresentations] = useState([]);
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

  // useEffect(async () => {
  //   const { data, isLoading, isError } = await api.presentation.getAll.useQuery();

  //   setData(result.data);
  // });

  const { data, isLoading, isError } = api.presentation.getAll.useQuery();

  if (!data) return <div>loading</div>;
  if (isError) return <div>something died¡</div>;

  // setPresentations((prev) => data as []);

  const PresentationCard = ({ presentation }: any) => {
    return (
      <button
        className="m-4 flex flex-col rounded-xl border-2 p-4 text-left"
        onClick={() => navigate(`/presentations/${presentation.id}`)}
      >
        <div className="h-4 w-full"></div>
        <i>{presentation.createdAt.toDateString()}</i>
        <h1 className="text-2xl font-extrabold">{presentation.title}</h1>
        <div className="text-accent">
          Goal time: {presentation.idealTime} minutes
        </div>
      </button>
    );
  };

  return (
    <div>
      <h1 className="p-10 text-3xl font-extrabold">Previous Presentations</h1>
      <section className={`grid ${isMobile ? "grid-cols-1 " : "grid-cols-4"}`}>
        {data.map((presentation, i) => (
          <PresentationCard
            presentation={presentation}
            key={i}
          ></PresentationCard>
        ))}
      </section>
    </div>
  );
}
