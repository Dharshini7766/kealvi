import { supabase } from "@/lib/supabase";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("Voting for option:", id);

    const { data, error } = await supabase
      .from("poll_options")
      .select("votes")
      .eq("id", id)
      .single();

    console.log("Current data:", data);
    console.log("Current error:", error);

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("poll_options")
      .update({
        votes: (data?.votes ?? 0) + 1,
      })
      .eq("id", id);

    console.log("Update error:", updateError);

    return Response.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}