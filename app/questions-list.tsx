"use client";

import { useState, useEffect } from "react";
import { getVoterId } from "@/lib/voter";

type Question = {
  id: string;
  body: string;
  author: string | null;
  category?: string;
  votes: number;
};

export default function QuestionsList({
  initialQuestions,
  initialHasMore,
}: {
  initialQuestions: Question[];
  initialHasMore: boolean;
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [draft, setDraft] = useState("");
  const [category, setCategory] = useState("General");
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const url = query
        ? `/api/questions?q=${encodeURIComponent(query)}`
        : `/api/questions`;

      const res = await fetch(url);
      const data = await res.json();

      setQuestions(data.questions);
      setHasMore(data.hasMore);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  async function submit() {
    if (!draft.trim()) return;

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  body: draft,
  category,
}),
    });

    const created = await res.json();

    setQuestions((qs) => [
      {
        ...created,
        votes: 0,
      },
      ...qs,
    ]);

    setDraft("");
  }

  async function upvote(id: string) {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === id ? { ...q, votes: q.votes + 1 } : q
      )
    );

    const res = await fetch(`/api/questions/${id}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voterId: getVoterId(),
      }),
    });

    if (!res.ok) {
  setQuestions((qs) =>
    qs.map((q) =>
      q.id === id
        ? { ...q, votes: q.votes - 1 }
        : q
    )
  );

  const error = await res.json();

  if (error.error === "already voted") {
    setErrorMessage(
      "❌ You have already voted for this poll."
    );

    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  }
}
  }

  async function loadMore() {
    setLoading(true);

    const res = await fetch(
      `/api/questions?offset=${questions.length}`
    );

    const data = await res.json();

    setQuestions((qs) => [
      ...qs,
      ...data.questions,
    ]);

    setHasMore(data.hasMore);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      {errorMessage && (
  <div className="rounded-md bg-red-100 p-2 text-red-700">
    {errorMessage}
  </div>
)}
      <p className="text-sm text-gray-500">
        {hydrated
          ? "Polling System Active ✓"
          : "Loading..."}
      </p>

      <div className="flex flex-col gap-2 border rounded-lg p-4">
        <h2 className="font-bold text-lg">
          Create Poll
        </h2>

        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Enter Poll Question"
          className="rounded-md border px-3 py-2"
        />

        <button
          onClick={submit}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:scale-105 transition"
        >
          Create Poll
        </button>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Polls..."
        className="w-full rounded-md border px-3 py-2"
      />
      <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="rounded-md border px-3 py-2"
>
  <option value="General">General</option>
  <option value="Technology">Technology</option>
  <option value="Sports">Sports</option>
  <option value="Movies">Movies</option>
  <option value="Education">Education</option>
</select>

      <ul className="space-y-3">
        {questions.map((q) => (
          <li
            key={q.id}
            className="card p-5 shadow-lg hover:scale-[1.02] transition"
          >
            <div className="flex items-center justify-between">
              <div>
  <span className="font-medium">
    {q.body}
  </span>

  <p className="text-xs text-blue-600">
    {q.category || "General"}
  </p>
</div>

              <button
                onClick={() => upvote(q.id)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition"
              >
                Vote ({q.votes})
              </button>
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="rounded-md border px-4 py-2"
        >
          {loading
            ? "Loading..."
            : "Load More Polls"}
        </button>
      )}
    </div>
  );
}