import router from "next/router";

export default function Results() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div>
        <div className="pb-2">
          <h1 className="text-xl font-bold"> Title: Insert title here</h1>
        </div>
        <div className="pb-2">
          <h1> Time taken: 0</h1>
        </div>
        <div className="pb-2">
          <h1> Words per minute: 0</h1>
        </div>
        <div className="pb-2">
          <h1> How many times you said filler words: 0</h1>
        </div>
        <div className="pb-20">
          <h1> You went over/under time by: 0 minutes</h1>
        </div>
      </div>
      <button
        type="button"
        className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={() => {
          router.push("/");
        }}
      >
        Go back to main menu
      </button>
    </div>
  );
}
