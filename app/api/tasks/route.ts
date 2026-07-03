import { NextResponse } from "next/server";
import supabaseAdmin from "../../../lib/supabaseServer";

// GET all tasks
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("tasks")
    .select("id, title, description, status, priority, due_date, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}

// CREATE task
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const title = String(payload.title || "").trim().slice(0, 240);

    if (!title) {
      return NextResponse.json(
        { error: "Missing title" },
        { status: 400 }
      );
    }

    const row = {
      title,
      description: payload.description || null,
      status: payload.status || "backlog",
      priority: payload.priority || "Medium",
      due_date: payload.dueDate || null,
    };

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .insert([row])
      .select("id, title, description, status, priority, due_date, created_at")
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