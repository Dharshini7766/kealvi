import { supabase } from "@/lib/supabase";
import { getQuestionsPage, searchQuestions } from "@/lib/questions";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (q) {
    const questions = await searchQuestions(q, PAGE_SIZE);
    return Response.json({ questions, hasMore: false });
  }

  const offset = Number(searchParams.get("offset") ?? 0);
  const { questions, hasMore } = await getQuestionsPage(offset, PAGE_SIZE);
  return Response.json({ questions, hasMore });
}

export async function POST(req: Request) {
  const {
  body,
  author,
  category,
  options,
} = await req.json();

const { data, error } = await supabase
  .from("questions")
  .insert({
    body,
    author,
    category,
  })
  .select()
  .single();

 if (error) {
  return Response.json(
    { error: error.message },
    { status: 500 }
  );
}

if (options?.length) {
  const pollOptions = options.map(
    (option: string) => ({
      poll_id: data.id,
      option_text: option,
    })
  );

  await supabase
    .from("poll_options")
    .insert(pollOptions);
}

return Response.json(data);
}
