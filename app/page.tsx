"use client";

import Link from "next/link";
import { DragEvent, FormEvent, useEffect, useMemo, useState } from "react";

type TaskStatus = "backlog" | "inProgress" | "done";
type TaskPriority = "Low" | "Medium" | "High";

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
};

type FormState = {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
};

const statusMeta: Record<TaskStatus, { label: string; accent: string }> = {
  backlog: { label: "Backlog", accent: "blue" },
  inProgress: { label: "In Progress", accent: "amber" },
  done: { label: "Done", accent: "green" },
};

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Plan the sprint goals",
    description: "Define the top three outcomes for the week.",
    status: "backlog",
    priority: "High",
    dueDate: "2026-07-06",
    createdAt: "2026-07-01",
  },
  {
    id: "task-2",
    title: "Refresh onboarding checklist",
    description: "Make the first-run experience clearer and shorter.",
    status: "inProgress",
    priority: "Medium",
    dueDate: "2026-07-04",
    createdAt: "2026-07-02",
  },
  {
    id: "task-3",
    title: "Ship the dashboard polish",
    description: "Finish the card styling and empty states.",
    status: "done",
    priority: "Low",
    dueDate: "2026-07-03",
    createdAt: "2026-07-02",
  },
];

const initialFormState: FormState = {
  title: "",
  description: "",
  priority: "Medium",
  dueDate: "",
};

const STORAGE_KEY = "planner-board-tasks";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [searchTerm, setSearchTerm] = useState("");
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Task[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
        }
      }
    } catch {
      // Ignore storage issues and keep defaults.
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  const filteredTasks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return tasks;

    return tasks.filter((task) => {
      const haystack = `${task.title} ${task.description} ${task.priority}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [searchTerm, tasks]);

  const moveTask = (taskId: string, source: TaskStatus, destination: TaskStatus) => {
    if (source === destination) return;

    setTasks((current) => {
      const currentTask = current.find((task) => task.id === taskId);
      if (!currentTask) return current;

      return current.map((task) => (task.id === taskId ? { ...task, status: destination } : task));
    });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, destination: TaskStatus) => {
    event.preventDefault();
    setDragOverStatus(null);

    const payload = event.dataTransfer.getData("application/json");
    if (!payload) return;

    try {
      const { taskId, source } = JSON.parse(payload) as { taskId: string; source: TaskStatus };
      moveTask(taskId, source, destination);
    } catch {
      return;
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const title = formState.title.trim();
    if (!title) return;

    setTasks((current) => [
      {
        id: `task-${Date.now()}`,
        title,
        description: formState.description.trim(),
        status: "backlog",
        priority: formState.priority,
        dueDate: formState.dueDate,
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...current,
    ]);

    setFormState(initialFormState);
  };

  const totals = {
    total: tasks.length,
    done: tasks.filter((task) => task.status === "done").length,
    inProgress: tasks.filter((task) => task.status === "inProgress").length,
    backlog: tasks.filter((task) => task.status === "backlog").length,
  };

  return (
    <main className="planner-page">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Trello-inspired planning board</p>
          <h1>Plan work, track momentum, and finish what matters.</h1>
          <p className="hero-copy">
            Capture projects, move them across stages, and keep your team aligned from first idea to done.
          </p>
          <div className="hero-actions" style={{ marginTop: "14px" }}>
            <Link href="/viewNotes" className="header-link">
              Open notes
            </Link>
          </div>
        </div>
        <div className="hero-stats" aria-label="planner summary">
          <div>
            <strong>{totals.total}</strong>
            <span>Total tasks</span>
          </div>
          <div>
            <strong>{totals.inProgress}</strong>
            <span>Active</span>
          </div>
          <div>
            <strong>{totals.done}</strong>
            <span>Completed</span>
          </div>
        </div>
      </section>

      <section className="workspace-grid">
        <form className="panel card-form" onSubmit={handleSubmit}>
          <div className="panel-header">
            <div>
              <p className="eyebrow">Quick add</p>
              <h2>Create a new task</h2>
            </div>
          </div>

          <label>
            Title
            <input
              value={formState.title}
              onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
              placeholder="Quarterly launch checklist"
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={formState.description}
              onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
              placeholder="Add a short summary for the team"
              rows={4}
            />
          </label>

          <div className="form-row">
            <label>
              Priority
              <select
                value={formState.priority}
                onChange={(event) => setFormState((current) => ({ ...current, priority: event.target.value as TaskPriority }))}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <label>
              Due date
              <input
                type="date"
                value={formState.dueDate}
                onChange={(event) => setFormState((current) => ({ ...current, dueDate: event.target.value }))}
              />
            </label>
          </div>

          <button type="submit">Add task</button>
        </form>

        <div className="panel search-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Find work fast</p>
              <h2>Search tasks</h2>
            </div>
          </div>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by title, description, or priority"
            aria-label="Search tasks"
          />
          <div className="summary-list">
            <div>
              <span>Backlog</span>
              <strong>{totals.backlog}</strong>
            </div>
            <div>
              <span>Active</span>
              <strong>{totals.inProgress}</strong>
            </div>
            <div>
              <span>Done</span>
              <strong>{totals.done}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="planner-board" aria-label="task board">
        {(Object.keys(statusMeta) as TaskStatus[]).map((status) => {
          const columnTasks = filteredTasks.filter((task) => task.status === status);

          return (
            <div
              key={status}
              className={`planner-column ${dragOverStatus === status ? "drop-target" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOverStatus(status);
              }}
              onDragLeave={() => setDragOverStatus(null)}
              onDrop={(event) => handleDrop(event, status)}
            >
              <div className={`column-header column-${status}`}>
                <h2>{statusMeta[status].label}</h2>
                <span>{columnTasks.length}</span>
              </div>

              <div className="task-list">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    className="task-card"
                    onDragStart={(event) => event.dataTransfer.setData("application/json", JSON.stringify({ taskId: task.id, source: task.status }))}
                  >
                    <div className="task-top">
                      <span className={`priority-pill priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                      {task.dueDate ? <span className="due-date">Due {task.dueDate}</span> : null}
                    </div>
                    <h3>{task.title}</h3>
                    {task.description ? <p>{task.description}</p> : null}
                  </div>
                ))}

                {columnTasks.length === 0 ? <p className="empty-state">Drop a task here or create a new one.</p> : null}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
