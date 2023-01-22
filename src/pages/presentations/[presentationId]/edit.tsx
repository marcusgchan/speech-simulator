import router, { useRouter } from "next/router";
import { useState } from "react";
import { updatePresentationSchema } from "../../../schemas/presentation";
import { api, RouterOutputs } from "../../../utils/api";

export default function Edit() {
  const router = useRouter();
  const { data, isError, isLoading } =
    api.presentation.getPresentation.useQuery({
      id: String(router.query.presentationId),
    });
  if (isLoading || !data) {
    return <div>Loading</div>;
  }
  return <Inner data={data} />;
}

function Inner({
  data,
}: {
  data: NonNullable<RouterOutputs["presentation"]["getPresentation"]>;
}) {
  let cards = "";
  const newCards: { rank: number; text: string; id: string }[] = [];
  const [presentation, setPresentation] = useState({
    title: data.title,
    idealTime: data.idealTime,
    flashcards: data.flashcards,
  });
  if (data?.flashcards) {
    for (let i = 0; i < data?.flashcards.length; i++) {
      cards += data?.flashcards[i]?.text + "|";
    }
  }

  const [speech, setSpeech] = useState(cards);
  const mutation = api.presentation.update.useMutation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div>
        <div className="pb-5">
          <label className="pr-4"> New title: </label>
          <input
            className="
      form-control
      m-0
      block
      w-full
      rounded
      border
      border-solid
      border-gray-300
      bg-white bg-clip-padding
      px-3 py-1.5 text-base
      font-normal
      text-gray-700
      transition
      ease-in-out
      focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none
    "
            value={presentation.title}
            onChange={(e) =>
              setPresentation({
                ...presentation,
                title: e.target.value,
              })
            }
          />
        </div>
        <div className="pb-5">
          <label className="pr-4">New expected time:</label>
          <input
            type="number"
            name="time"
            min={1}
            value={presentation.idealTime}
            onChange={(e) => {
              if (isNaN(e.target.valueAsNumber)) {
                setPresentation({ ...presentation, idealTime: 1 });
              } else {
                setPresentation({
                  ...presentation,
                  idealTime: e.target.valueAsNumber,
                });
              }
            }}
          />
        </div>
        <div className="pb-5">
          <label className="pr-2">New speech:</label>
          <textarea
            className="
      form-control
      m-0
      block
      w-full
      rounded
      border
      border-solid
      border-gray-300
      bg-white bg-clip-padding
      px-3 py-1.5 text-base
      font-normal
      text-gray-700
      transition
      ease-in-out
      focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none
    "
            value={speech}
            rows={5}
            onChange={(e) => setSpeech(e.target.value)}
          ></textarea>
        </div>
      </div>
      <p className="pb-16 text-xs font-bold">
        Use | to separate into different cards
      </p>
      <button
        type="button"
        className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={async () => {
          const card = speech.split("|");
          for (let i = 0; i < card.length; i++) {
            const flashcardToUpdate = data.flashcards[i];
            if (flashcardToUpdate) {
              newCards[i] = {
                rank: i + 1,
                text: card[i] as string,
                id: flashcardToUpdate.id,
              };
            }
          }
          const result = updatePresentationSchema.safeParse({
            ...presentation,
            id: data?.id as string,
            flashcards: newCards,
            dateCreated: new Date(),
          });
          if (result.success) {
            mutation.mutate(result.data);
            router.push("/presentations");
          } else {
            console.log(result.error);
          }
        }}
      >
        Edit speech
      </button>
    </div>
  );
}
