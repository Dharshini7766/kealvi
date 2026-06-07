import { supabase } from "@/lib/supabase";

export async function getQuestionsPage(
  offset: number,
  limit: number
) {
  const { data, error } = await supabase
    .from("questions")
    .select(`
      id,
      body,
      author,
      category,
      created_at,
      votes(count),
      poll_options (
        id,
        option_text,
        votes
      )
    `)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit);

  console.log(
    "QUESTIONS DATA:",
    JSON.stringify(data, null, 2)
  );

  if (error) throw new Error(error.message);

  const rows = (data ?? []).map((q: any) => ({
    id: q.id,
    body: q.body,
    author: q.author,
    category: q.category,
    votes: q.votes?.[0]?.count ?? 0,
    poll_options: q.poll_options ?? [],
  }));

  const hasMore = rows.length > limit;

  return {
    questions: rows.slice(0, limit),
    hasMore,
  };
}

export async function searchQuestions(
  q: string,
  limit: number
) {
  const { data, error } = await supabase
    .from("questions")
    .select(`
      id,
      body,
      author,
      category,
      created_at,
      votes(count),
      poll_options (
        id,
        option_text,
        votes
      )
    `)
    .textSearch("body", q, {
      type: "websearch",
      config: "english",
    })
    .limit(limit);

  console.log(
    "SEARCH DATA:",
    JSON.stringify(data, null, 2)
  );

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => ({
    id: row.id,
    body: row.body,
    author: row.author,
    category: row.category,
    votes: row.votes?.[0]?.count ?? 0,
    poll_options: row.poll_options ?? [],
  }));
}