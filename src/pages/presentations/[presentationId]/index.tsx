import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import { type Attempt } from "@prisma/client";
import { fillerWordCount } from "../../../fillerWords";
import { useSnackbarDispatch } from "../../../components/Snackbar";
import { Loader } from "../../../components/Loader";

export default function Attempt() {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const snackDispatch = useSnackbarDispatch();
  const mutation = api.presentation.queueExistingPresentation.useMutation({
    onSuccess() {
      snackDispatch({
        type: "SUCCESS",
        message: "Sucessfully queued presentation",
      });
    },
    onError(error) {
      snackDispatch({
        type: "ERROR",
        message: error.message,
      });
    },
  });

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
    return (
      <div>
        <Loader></Loader>
      </div>
    );
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
          isMobile ? "flex-col items-center" : "flex-row"
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
      <div
        className={`flex ${isMobile ? "flex-col items-center" : "flex-row"}`}
      >
        <button
          className="m-2 w-48 rounded-xl bg-accent py-3 text-white hover:bg-emerald-700"
          onClick={() => {
            console.log(presentationId);
            mutation.mutate({ id: presentationId as string });
          }}
        >
          Start New Attempt
        </button>
        <button
          className="m-2 w-48 rounded-xl bg-accent py-3 text-white hover:bg-emerald-700"
          onClick={() => navigate(`../presentations/${presentationId}/edit`)}
        >
          Edit presentation
        </button>
        <button
          className="m-2 w-48 rounded-xl bg-accent py-3 text-white hover:bg-emerald-700"
          onClick={() => navigate("../presentations")}
        >
          Previous presentations
        </button>
      </div>

      <button
        className={`${
          isMobile ? "" : "absolute bottom-0 right-0"
        }  m-4 rounded-xl border-2 py-2 px-4`}
        onClick={() => navigate("../vr")}
      >
        Go to VR
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
    Math.round((displayedAttempt.timeTaken / 60000) * 100) / 100;

  const speechArray = displayedAttempt.speech.split(" ");
  const wordsPerMinute = Math.round(speechArray.length / timeTakenFormatted);

  const fillerWords = fillerWordCount(speechArray, ["like", "and"]);
  const timeDiff = displayedAttempt.timeTaken / 1000 - presentationIdealTime;

  const timeDiffFormatted = Math.round((Math.abs(timeDiff) / 60) * 100) / 100;

  const diffString =
    timeDiffFormatted <= 0.5 ? (
      "You were very close to your time goal!"
    ) : timeDiff > 0 ? (
      <span>
        Consider {<span className="text-accent">shortening</span>} your script.
      </span>
    ) : (
      <span>
        Consider adding a few{<span className="text-accent"> more </span>}{" "}
        points to your script.
      </span>
    );

  const wpmString =
    wordsPerMinute >= 100 && wordsPerMinute <= 150 ? (
      <span>
        Your talking pace matched the{" "}
        {<span className="text-accent">ideal range</span>} of about 100-150 WPM!
      </span>
    ) : wordsPerMinute <= 100 ? (
      <span>
        If possible, try talking a little{" "}
        {<span className="text-accent">faster</span>}.
      </span>
    ) : (
      <span>
        Try {<span className="text-accent">lowering</span>} your talking speed
        by a little, everyone wants to hear you nice and clear!
      </span>
    );

  const fillterString =
    fillerWords / speechArray.length >= 0.2 ? (
      <span>
        {" "}
        Finally, your presentation would level up if you avoided{" "}
        {<span className="text-accent">filler words</span>} such as "like",
        "um", etc.
      </span>
    ) : (
      ""
    );

  return (
    <div className="flex h-96 w-80 flex-col justify-around rounded-xl border-2 p-4 text-left">
      <div className="flex flex-col justify-center">
        <div>
          <h1>
            {" "}
            <b>Time taken:</b> {timeTakenFormatted} minutes
          </h1>
        </div>
        <div>
          <h1>
            {" "}
            <b>Words per minute:</b> {wordsPerMinute} WPM
          </h1>
        </div>
        <div>
          <h1>
            {" "}
            <b>Potential filler words said:</b> {fillerWords}
          </h1>
        </div>
        <div>
          <h1>
            <b>{timeDiff > 0 ? "Over" : "Under"} goal time by: </b>
            {timeDiffFormatted} minutes
          </h1>
        </div>
      </div>
      <p>
        Great work on {<span className="text-accent">completing</span>} your
        presentation! {diffString} Now let's talk about pace. {wpmString}
        {fillterString} Good luck on your presentation!
      </p>
    </div>
  );
}
