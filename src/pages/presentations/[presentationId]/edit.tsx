import router, { useRouter } from "next/router";
import { useState } from "react";
import { updatePresentationSchema } from "../../../schemas/presentation";
import { api, type RouterOutputs } from "../../../utils/api";
import { useSnackbarDispatch } from "../../../components/Snackbar";
import { Loader } from "../../../components/Loader";

export default function Edit() {
  const router = useRouter();
  const { data, isLoading } = api.presentation.getPresentation.useQuery({
    id: String(router.query.presentationId),
  });
  if (isLoading || !data) {
    return (
      <div>
        <Loader></Loader>
      </div>
    );
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
  const moreCards: { rank: number; text: string }[] = [];
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
  const snackDispatch = useSnackbarDispatch();
  const mutation = api.presentation.update.useMutation({
    onSuccess() {
      snackDispatch({
        type: "SUCCESS",
        message: "Sucessfully updated and queued presentation",
      });
      router.push("/presentations");
    },
    onError(error) {
      snackDispatch({
        type: "ERROR",
        message: error.message,
      });
    },
  });
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div>
        <div className="pb-5">
          <label className="pr-4">Title: </label>
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
      focus:border-accent focus:bg-white focus:text-gray-700 focus:outline-none
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
          <label className="pr-4">Expected time:</label>
          <input
            type="number"
            name="time"
            min={1}
            value={presentation.idealTime}
            className="border-rounded border px-3 py-1.5 text-base focus:border-accent focus:bg-white focus:text-gray-700 focus:outline-none"
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
          <label className="pr-2">Speech:</label>
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
      focus:border-accent focus:bg-white focus:text-gray-700 focus:outline-none
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
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => router.push("/presentations")}
          className="hover:bg-emeral-700 w-30 rounded-full bg-accent py-2 px-4 font-bold text-white hover:bg-emerald-700"
        >
          Presentations
        </button>
        <button
          type="button"
          className="rounded-full bg-accent py-2 px-4 font-bold text-white hover:bg-emerald-700"
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
            if (card.length > data.flashcards.length) {
              for (let i = 0; i < card.length - data.flashcards.length; i++) {
                moreCards[i] = {
                  rank: i + data.flashcards.length + 1,
                  text: card[i + data.flashcards.length] as string,
                };
              }
            }
            const result = updatePresentationSchema.safeParse({
              ...presentation,
              id: data?.id as string,
              flashcards: newCards,
              moreFlashcards: moreCards,
              dateCreated: new Date(),
            });
            if (result.success) {
              mutation.mutate(result.data);
            } else {
              snackDispatch({
                type: "ERROR",
                message: "Name and Expected fields are required",
              });
            }
          }}
        >
          Edit speech
        </button>
      </div>
    </div>
  );
}
