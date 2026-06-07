import Link from "next/link";
import QuestionsList from "./questions-list";
import { getQuestionsPage } from "@/lib/questions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function Page() {
  const { questions, hasMore } =
    await getQuestionsPage(0, PAGE_SIZE);

  return (
    <main className="mx-auto max-w-4xl p-6">

      <nav className="flex gap-6 mb-8 p-4 rounded-xl card">
       <Link
  href="/"
  className="hover:text-blue-400 transition"
>
  Q&A
</Link>
        <Link href="/polls">Polls</Link>
        <Link href="/leaderboard">Leader Board</Link>
        <Link href="/result">Result</Link>
      </nav>

      <h1 className="mb-6 text-5xl font-extrabold text-center">
  🚀 Kealvi
</h1>

      <QuestionsList
        initialQuestions={questions}
        initialHasMore={hasMore}
      />
    </main>
  );
}