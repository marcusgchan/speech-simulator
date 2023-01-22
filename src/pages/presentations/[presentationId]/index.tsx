import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../../../utils/api";
import { type Attempt } from "@prisma/client";

export default function Attempt() {
  const router = useRouter();
  const presentationId = router.query.presentationId as string;
  const { data: attemptsList, isLoading } =
    api.attempt.getAll.useQuery(presentationId);
  const navigate = (path: string) => {
    if (router.pathname !== path) {
      router.push(path);
    }
  };
  const [selectAttemptId, setSelectAttemptId] = useState<string>();

  if (isLoading || !attemptsList) {
    return <div>Loading...</div>;
  }

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
        {index} - Date Taken: {attempt.createdAt.toDateString()}
      </div>
    );
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-12">
        <h1 className="p-10 text-3xl font-extrabold">Attempts</h1>
        <div className="outer-container flex flex-row gap-12">
          <div className="attempts-list flex h-96 w-96 flex-col items-center gap-2 overflow-y-auto p-4">
            {attemptsDivs}
          </div>
          <HandleAttemptToDisplay
            latestAttempt={latestAttempt}
            selectedAttempt={selectedAttempt}
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
    </>
  );
}

function HandleAttemptToDisplay({
  latestAttempt,
  selectedAttempt,
}: {
  latestAttempt: Attempt | undefined;
  selectedAttempt: Attempt | undefined;
}) {
  if (!selectedAttempt && latestAttempt) {
    return (
      <div className="h-96 w-96 rounded-xl border-2 p-4 text-left">
        Time Taken: {latestAttempt.timeTaken}
      </div>
    );
  } else if (selectedAttempt) {
    return (
      <div className="h-96 w-96 rounded-xl border-2 p-4 text-left">
        Time Taken: {selectedAttempt.timeTaken}
      </div>
    );
  }
  return (
    <div className="h-96 w-96 rounded-xl border-2 p-4 text-left font-bold">
      There are no attempts
    </div>
  );
}