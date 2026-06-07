import { supabase } from "@/lib/supabase";
import { getQuestionsPage, searchQuestions } from "@/lib/questions";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (q) {
    const questions = await searchQuestions(q, PAGE_SIZE);
    return Response.json({
      questions,
      hasMore: false,
    });
  }

  const offset = Number(
    searchParams.get("offset") ?? 0
  );

  const { questions, hasMore } =
    await getQuestionsPage(
      offset,
      PAGE_SIZE
    );

  return Response.json({
    questions,
    hasMore,
  });
}

export async function POST(req: Request) {
  try {
    const {
      body,
      author,
      category,
      options,
    } = await req.json();

    const { data: question, error } =
      await supabase
        .from("questions")
        .insert({
          body,
          author,
          category,
        })
        .select()
        .single();

    if (error) {
      console.error(error);

      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (
      options &&
      Array.isArray(options) &&
      options.length > 0
    ) {
      const pollOptions = options.map(
        (option: string) => ({
          poll_id: question.id,
          option_text: option,
          votes: 0,
        })
      );

      const {
        error: optionError,
      } = await supabase
        .from("poll_options")
        .insert(pollOptions);

      if (optionError) {
        console.error(
          "OPTION ERROR:",
          optionError
        );
      }
    }

    return Response.json(question);
  } catch (err) {
    console.error(err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}