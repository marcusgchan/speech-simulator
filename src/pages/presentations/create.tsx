import { useState } from 'react';
import { number, string } from 'zod';

export default function Create() {
  const [speech, addSpeech] = useState("");
  const cards: {id: number, text: string}[] = [];
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div>
        <div className="pb-2">
          <label className="pr-4">Title:</label>
          <input type="text" id="name" name="user_name" />
        </div>
        <div className="pb-2">
          <label className="pr-4">Expected time:</label>
          <input type="number" name="time" />
        </div>
        <div className="pb-2">
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
            onChange={e => addSpeech(e.target.value)}
          ></textarea>
        </div>
      </div>
      <p className="font-bold pb-20 text-xs">Use | to separate into different cards</p>
      <button
        type="button"
        className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={() => {
          var card = speech.split('|');
          for (let i = 0; i < card.length; i++) {
            cards[i] = {id: i, text: card[i] as string}
          }
          console.log(cards);
        }}
      >
        Create speech
      </button>
    </div>
  );
}
