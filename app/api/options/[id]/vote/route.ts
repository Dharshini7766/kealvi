import { supabase } from "@/lib/supabase";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("poll_options")
      .select("votes")
      .eq("id", id)
      .single();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    await supabase
      .from("poll_options")
      .update({
        votes: (data?.votes ?? 0) + 1,
      })
      .eq("id", id);

    return Response.json({
      success: true,
    });
  } catch (err) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}