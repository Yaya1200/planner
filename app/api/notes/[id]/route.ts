import { NextRequest, NextResponse } from "next/server";
import supabaseAdmin from "../../../../lib/supabaseServer";

type RouteParams = {
  id: string;
};

// GET a single note
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("notes")
    .select("id, title, content, created_at")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

// UPDATE a note
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await params;
    const payload = await request.json();

    const updates: Record<string, any> = {};

    if (payload.title) {
      updates.title = String(payload.title).slice(0, 240);
    }

    if (payload.content) {
      updates.content = String(payload.content);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("notes")
      .update(updates)
      .eq("id", id)
      .select("id, title, content, created_at")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err?.message || err) },
      { status: 500 }
    );
  }
}

// DELETE a note
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("notes")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}