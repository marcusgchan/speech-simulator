import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import { type Attempt } from "@prisma/client";
import { fillerWordCount } from "../../../fillerWords";

export default function Attempt() {
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

  const router = useRouter();
  const presentationId = router.query.presentationId as string;
  const { data, isLoading } = api.attempt.getAll.useQuery(presentationId);
  const navigate = (path: string) => {
    if (router.pathname !== path) {
      router.push(path);
    }
  };
  const [selectAttemptId, setSelectAttemptId] = useState<string>();

  if (isLoading || !data?.attemptsList || !data?.idealTime) {
    return <div>Loading...</div>;
  }
  const attemptsList = data.attemptsList;
  const idealTime = data.idealTime;

  const latestAttempt = attemptsList[0];
  const selectedAttempt = attemptsList.find(
    (attempt) => attempt.id === selectAttemptId
  );

  // Side menu for selecting an attempt
  const attemptsDivs = attemptsList.map((attempt, index) => {
    return (
      <div
        key={attempt.id}
        className="h-20 w-72 rounded-xl border-2 p-4 font-bold"
        onClick={() => {
          setSelectAttemptId(attempt.id);
        }}
      >
        {attemptsList.length - index} - Date Taken:{" "}
        {attempt.createdAt.toDateString()}
      </div>
    );
  });

  return (
    <div className="flex flex-col items-center justify-center gap-12">
      <h1 className="p-10 text-3xl font-extrabold">Attempts</h1>
      <div
        className={`outer-container flex gap-8 ${
          isMobile ? "flex-col" : "flex-row"
        }`}
      >
        <div className="attempts-list flex h-96 w-96 flex-col items-center gap-2 overflow-y-auto p-4 ">
          {attemptsDivs}
        </div>
        <HandleAttemptToDisplay
          latestAttempt={latestAttempt}
          selectedAttempt={selectedAttempt}
          idealTime={idealTime}
        />
      </div>
      <button
        className="mx-2 rounded-xl bg-accent p-4 text-white"
        // onClick={() => ()}
      >
        Start New Attempt
      </button>
      <button
        className="mx-2 rounded-xl bg-accent p-4 text-white"
        onClick={() => navigate("../")}
      >
        Previous presentations
      </button>
    </div>
  );
}

function HandleAttemptToDisplay({
  latestAttempt,
  selectedAttempt,
  idealTime,
}: {
  latestAttempt: Attempt | undefined;
  selectedAttempt: Attempt | undefined;
  idealTime: number;
}) {
  if (!selectedAttempt && latestAttempt) {
    return (
      <DisplayAttempt
        displayedAttempt={latestAttempt}
        presentationIdealTime={idealTime}
      />
    );
  } else if (selectedAttempt) {
    return (
      <DisplayAttempt
        displayedAttempt={selectedAttempt}
        presentationIdealTime={idealTime}
      />
    );
  }
  return (
    <div className="h-96 w-80 rounded-xl border-2 p-4 text-left font-bold">
      There are no attempts
    </div>
  );
}

function DisplayAttempt({
  displayedAttempt,
  presentationIdealTime,
}: {
  displayedAttempt: Attempt;
  presentationIdealTime: number;
}) {
  const timeTakenFormatted =
    Math.round((displayedAttempt.timeTaken / 60) * 100) / 100;

  const speechArray = displayedAttempt.speech.split(" ");
  const wordsPerMinute = Math.round(speechArray.length / timeTakenFormatted);

  const fillerWords = fillerWordCount(speechArray, ["like", "and"]);
  const timeDiff = displayedAttempt.timeTaken - presentationIdealTime;

  const timeDiffFormatted = Math.round((Math.abs(timeDiff) / 60) * 100) / 100;

  return (
    <div className="h-96 w-80 rounded-xl border-2 p-4 text-left">
      <div className="py-10">
        <div>
          <h1> Time taken: {timeTakenFormatted} minutes</h1>
        </div>
        <div>
          <h1> Words per minute: {wordsPerMinute} WPM</h1>
        </div>
        <div>
          <h1> Potential filler words said: {fillerWords}</h1>
        </div>
        <div>
          <h1>
            You went {timeDiff > 0 ? "over" : "under"} time by:{" "}
            {timeDiffFormatted} minutes
          </h1>
        </div>
      </div>
    </div>
  );
}
