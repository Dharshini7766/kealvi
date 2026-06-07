import { supabase } from "@/lib/supabase";
import PollCard from "./PollCard";

export default async function PollsPage() {
  const { data: polls } = await supabase
    .from("questions")
    .select(`
      *,
      poll_options (
        id,
        option_text,
        votes
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-4xl font-bold mb-6">
        Polls
      </h1>

      <div className="space-y-6">
        {polls?.map((poll: any) => (
          <PollCard
            key={poll.id}
            poll={poll}
          />
        ))}
      </div>
    </main>
  );
}