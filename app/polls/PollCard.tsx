"use client";

import { useState } from "react";

export default function PollCard({
  poll,
}: {
  poll: any;
}) {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  async function vote() {
    if (!selected) {
      alert("Select an option");
      return;
    }

    setLoading(true);

    const res = await fetch(
  `/api/options/${selected}/vote`,
  {
    method: "POST",
  }
);

const data = await res.json();
console.log(data);

    window.location.reload();
  }

  return (
    <div className="border rounded-xl p-5">
      <h2 className="text-2xl font-semibold mb-4">
        {poll.body}
      </h2>

      <div className="space-y-2">
        {poll.poll_options?.map((option: any) => (
          <label
            key={option.id}
            className="flex gap-2"
          >
            <input
              type="radio"
              name={poll.id}
              value={option.id}
              onChange={(e) =>
                setSelected(e.target.value)
              }
            />

            {option.option_text}
          </label>
        ))}
      </div>

      <button
        onClick={vote}
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Voting..." : "Vote"}
      </button>

      <div className="mt-4">
        <p className="font-medium">
          Poll Distribution
        </p>

        {poll.poll_options?.map((option: any) => (
          <div
            key={option.id}
            className="mt-2"
          >
            <div className="bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{
                  width: `${option.votes || 0}%`,
                }}
              />
            </div>

            <p className="text-sm mt-1">
              {option.option_text} - {option.votes} votes
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}