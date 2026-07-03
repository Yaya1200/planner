import { NextResponse } from "next/server";
import supabaseAdmin from "../../../lib/supabaseServer";

// GET all notes
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("notes")
    .select("id, title, content, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}

// CREATE note
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const title = String(payload.title || "").trim().slice(0, 240);
    const content = String(payload.content || "").trim();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing title or content" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("notes")
      .insert([{ title, content }])
      .select("id, title, content, created_at")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err?.message || err) },
      { status: 500 }
    );
  }
}