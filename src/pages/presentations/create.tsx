import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function Create() {
  const [cards, setCards] = useState<string[]>([{id: uuidv4(), text: "card"}])
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div>
        <div className="pb-2">
          <label className="pr-4">Title:</label>
          <input type="text" id="name" name="user_name" />
        </div>
        <div className="pb-2">
          <label className="pr-4">Time:</label>
          <input type="number" name="time" />
        </div>
        <div className="pb-20">
          <label className="pr-2">Speech:</label>
          <select>
            {cards.map((card, i) => (
              <option>{card}</option>
            ))}
          </select>
          <button
            type="button"
            className="rounded-full bg-blue-500 py-1 px-3 font-bold text-white hover:bg-blue-700"
            onClick={() => setCards([...cards, `Card ${cards.length + 1}`])}
          >
            Add another card
          </button>
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
          ></textarea>
        </div>
      </div>
      <button
        type="button"
        className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
      >
        Create speech
      </button>
    </div>
  );
}
