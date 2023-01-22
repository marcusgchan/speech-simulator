import { time } from "console";
import { fillerWordCount } from "../../fillerWords";
import router from "next/router";

export default function Results() {
  const testAttempt = {
    id: 1,
    timetaken: 70,
    speech:
      "So two three four five six lIke eight nine ten. Eleven twelve LIKE fourteen fifteen.",
  };

  const testPresentation = {
    id: 1,
    title: "test presentation 1",
    idealTime: 120,
  };

  const timeTakenFormatted =
    Math.round((testAttempt.timetaken / 60) * 100) / 100;

  const speechArray = testAttempt.speech.split(" ");
  const wordsPerMinute = Math.round(speechArray.length / timeTakenFormatted);

  const fillerWords = fillerWordCount(speechArray, ["like", "and"]);

  const timeDiff = testAttempt.timetaken - testPresentation.idealTime;
  const timeDiffFormatted = Math.round((Math.abs(timeDiff) / 60) * 100) / 100;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center rounded-xl border-2 px-32 py-10">
        <div>
          <h1 className="text-xl font-bold">{testPresentation.title}</h1>
        </div>
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
        <button
          type="button"
          className="rounded-full bg-accent py-2 px-4 font-bold text-white hover:bg-emerald-700"
          onClick={() => {
            router.push("/");
          }}
        >
          Go back to main menu
        </button>
      </div>
    </div>
  );
}
