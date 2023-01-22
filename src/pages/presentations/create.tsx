import { useState } from "react";
import router from "next/router";
import { api } from "../../utils/api";
import { createPresentationSchema } from "../../schemas/presentation";

export default function Create() {
  const [speech, addSpeech] = useState("");
  const cards: { rank: number; text: string }[] = [];
  const mutation = api.presentation.create.useMutation();
  const [formData, setFormData] = useState({
    title: "",
    idealTime: 30,
  });
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div>
        <div className="pb-5">
          <label className="pr-4">Title:</label>
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
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            placeholder="Your speech"
          />
        </div>
        <div className="pb-5">
          <label className="pr-4">Expected time:</label>
          <input
            type="number"
            name="time"
            min={1}
            className="border"
            value={formData.idealTime}
            onChange={(e) => {
              if (isNaN(e.target.valueAsNumber)) {
                setFormData({ ...formData, idealTime: 1 });
              } else {
                setFormData({
                  ...formData,
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
        focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none
      "
            placeholder="Your speech"
            rows={5}
            onChange={(e) => addSpeech(e.target.value)}
          ></textarea>
        </div>
      </div>
      <p className="pb-16 text-xs font-bold">
        Use | to separate into different cards
      </p>
      <button
        type="button"
        className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={() => {
          const card = speech.split("|");
          for (let i = 0; i < card.length; i++) {
            cards[i] = { rank: i + 1, text: card[i] as string };
          }
          const result = createPresentationSchema.safeParse({
            ...formData,
            dateCreated: new Date(),
            flashcards: cards,
          });
          if (result.success) {
            mutation.mutate(result.data);
            router.push("/");
          } else {
            console.log(result.error);
          }
        }}
      >
        Create speech
      </button>
    </div>
  );
}
