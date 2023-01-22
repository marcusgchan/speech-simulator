import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../../utils/api";

export default function Attempt() {
  const [selectAttempt, setSelectAttempt] = useState({ id: -1, timeTaken: -1 });

  const router = useRouter();

  const navigate = (path: string) => {
    if (router.pathname !== path) {
      router.push(path);
    }
  };

  // const attemptsList = api.attempt.getAll.useQuery();

  // Mock data for now, otherwise above
  const attemptsList = [
    { id: 100, rank: 1, createdAt: "soctober", timeTaken: 10 },
    { id: 50, rank: 2, createdAt: "september", timeTaken: 20 },
    { id: 50, rank: 3, createdAt: "september", timeTaken: 300 },
  ];

  // Side menu for selecting an attempt
  const attemptsDivs = attemptsList.map((attempt) => {
    return (
      <div
        className="h-20 w-96 border-b-8 border-solid p-4"
        onClick={() => {
          setSelectAttempt(attempt);
        }}
      >
        {attempt.rank} - Date Taken: {attempt.createdAt}
      </div>
    );
  });

  return (
    <>
      <h1 className="border-b-8 border-solid text-lg">Attempts</h1>
      <div className="outer-container flex flex-row">
        <div className="attempts-list flex w-96 flex-col border-b-8 border-solid p-4">
          {attemptsDivs}
        </div>
        {attemptsList.some((attempt) => selectAttempt.id === attempt.id) ? (
          <div className="h-96 w-96 border-b-8 border-solid bg-accent p-4">
            Time Taken: {selectAttempt.timeTaken}
          </div>
        ) : (
          <div className="h-96 w-96 border-b-8 border-solid bg-accent p-4">
            Select an Attempt
          </div>
        )}
      </div>
      <button
        className="mx-2 w-80 rounded-xl bg-accent p-2 text-white"
        onClick={() => navigate("../")}
      >
        Go back to previous attempts
      </button>
    </>
  );
}
