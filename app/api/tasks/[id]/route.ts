import { NextRequest, NextResponse } from "next/server";
import supabaseAdmin from "../../../../lib/supabaseServer";

type Params = {
  id: string;
};

// GET single task
export async function GET(
  _: NextRequest,
  { params }: { params: Params }
) {
  const { id } = params;

  const { data, error } = await supabaseAdmin
    .from("tasks")
    .select(
      "id, title, description, status, priority, due_date, created_at"
    )
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

// UPDATE task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = params;
    const payload = await request.json();

    const updates: Record<string, any> = {};

    if (payload.title) {
      updates.title = String(payload.title).slice(0, 240);
    }

    if (payload.description !== undefined) {
      updates.description = payload.description;
    }

    if (payload.status) {
      updates.status = payload.status;
    }

    if (payload.priority) {
      updates.priority = payload.priority;
    }

    if (payload.dueDate) {
      updates.due_date = payload.dueDate;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select(
        "id, title, description, status, priority, due_date, created_at"
      )
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

// DELETE task
export async function DELETE(
  _: NextRequest,
  { params }: { params: Params }
) {
  const { id } = params;

  const { error } = await supabaseAdmin
    .from("tasks")
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