import { getQuestionsPage } from "@/lib/questions";

export default async function PollsPage() {
  const { questions } = await getQuestionsPage(0, 50);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-4xl font-bold mb-6">
        Polls
      </h1>

      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="card p-4"
          >
            <h2 className="text-xl font-semibold">
              {q.body}
            </h2>

            <p className="text-blue-400">
              Total Votes: {q.votes}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}