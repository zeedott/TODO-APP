
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import {
  getTodos as fetchTodos,
  getDeletedTodos as fetchDeletedTodos,
  addTodo as createTodo,
  updateTodo as updateTodoRequest,
  deleteTodo as deleteTodoRequest,
  restoreTodo as restoreTodoRequest,
  permanentlyDeleteTodo as permanentDeleteTodoRequest,
  restoreAllDeletedTodos as restoreAllDeletedTodosRequest,
  clearDeletedTodos as clearDeletedTodosRequest,
} from "./services/todoApi";

import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import DeleteModal from "./components/DeleteModal";
import RecycleBin from "./components/RecycleBin";

const TODO_DRAFT_STORAGE_KEY = "todo-app-draft";

function loadTodoDraft() {
  try {
    const savedDraft = localStorage.getItem(TODO_DRAFT_STORAGE_KEY);
    if (savedDraft === null) {
      return { title: "", description: "" };
    }

    const draft = JSON.parse(savedDraft);
    if (
      typeof draft?.title === "string" &&
      typeof draft?.description === "string"
    ) {
      return { title: draft.title, description: draft.description };
    }

    console.error("Saved todo draft has an invalid format.");
  } catch (error) {
    console.error("Failed to load saved todo draft.", error);
  }

  return { title: "", description: "" };
}

function App() {
  const [todos, setTodos] = useState([]);
  const [deletedTodos, setDeletedTodos] = useState([]);
  const [activeView, setActiveView] = useState("active");

  const [todoDraft, setTodoDraft] = useState(loadTodoDraft);
  const { title, description } = todoDraft;
  const setTitle = (value) =>
    setTodoDraft((draft) => ({ ...draft, title: value }));
  const setDescription = (value) =>
    setTodoDraft((draft) => ({ ...draft, description: value }));

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  const getTodos = useCallback(async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load todos.");
    }
  }, []);

  const getDeletedTodos = useCallback(async () => {
    try {
      const data = await fetchDeletedTodos();
      setDeletedTodos(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load deleted todos.");
    }
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([getTodos(), getDeletedTodos()]);
  }, [getTodos, getDeletedTodos]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    try {
      localStorage.setItem(TODO_DRAFT_STORAGE_KEY, JSON.stringify(todoDraft));
    } catch (error) {
      console.error("Failed to save todo draft.", error);
    }
  }, [todoDraft]);

  async function addTodo(e) {
    e.preventDefault();

    const newErrors = {
      title: !title.trim()
        ? "Title is required."
        : title.length > 200
          ? "Title cannot exceed 200 characters."
          : "",
      description: !description.trim()
        ? "Description is required."
        : description.length > 10000
          ? "Description cannot exceed 10,000 characters."
          : "",
    };

    setErrors(newErrors);

    if (newErrors.title || newErrors.description) {
      return;
    }

    try {
      await createTodo({
        title: title.trim(),
        description: description.trim(),
      });

      setTodoDraft({ title: "", description: "" });
      setErrors({
        title: "",
        description: "",
      });

      toast.success("Todo added successfully!");
      await refreshData();
    } catch (error) {
      console.error(error);
      const message = error.status === 400
        ? error.message
        : error.status == null
          ? "Unable to connect to the server. Please try again."
          : "Something went wrong while adding the task.";
      toast.error(message);
    }
  }

  async function updateTodo(id) {
    if (!editTitle.trim()) {
      toast.error("Todo title is required.");
      return;
    }

    if (!editDescription.trim()) {
      toast.error("Todo description is required.");
      return;
    }

    try {
      await updateTodoRequest(id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        completed: false,
      });

      cancelEdit();

      toast.success("Todo updated successfully!");
      await refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update todo.");
    }
  }

  async function toggleTodo(todo) {
    try {
      await updateTodoRequest(todo.id, {
        completed: !todo.completed,
      });

      toast.success(
        todo.completed
          ? "Todo marked as pending!"
          : "Todo marked as completed!"
      );

      await refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update todo.");
    }
  }

  async function deleteTodo(id) {
    try {
      await deleteTodoRequest(id);

      toast.success("Task moved to Recycle Bin successfully.");
      await refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to move todo to Recycle Bin.");
    }
  }

  async function restoreTodo(id) {
    try {
      await restoreTodoRequest(id);
      toast.success("Todo restored from Recycle Bin.");
      await refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to restore todo.");
    }
  }

  async function permanentlyDeleteTodo(id) {
    try {
      await permanentDeleteTodoRequest(id);
      toast.success("Todo permanently deleted.");
      await refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to permanently delete todo.");
    }
  }

  async function restoreAllDeletedTodos() {
    try {
      await restoreAllDeletedTodosRequest();
      toast.success("All deleted todos restored.");
      await refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to restore deleted todos.");
    }
  }

  async function clearRecycleBin() {
    try {
      await clearDeletedTodosRequest();
      toast.success("Recycle Bin emptied successfully.");
      await refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to empty Recycle Bin.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || isDeleting) return;

    setIsDeleting(true);

    try {
      await deleteTodo(deleteTarget.id);
    } finally {
      setDeleteTarget(null);
      setIsDeleting(false);
    }
  }

  function startEdit(todo) {
    setEditId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  }

  function cancelEdit() {
    setEditId(null);
    setEditTitle("");
    setEditDescription("");
  }

  return (
    <div className="todo-app">
      <div className="todo-container">
        <header className="header">
          <h1>Todo App</h1>

          <p className="subtitle">
            Organize your tasks and get things done.
          </p>
        </header>

        <div className="view-toggle" aria-label="Todo view selector">
          <button
            type="button"
            className={activeView === "active" ? "view-tab active" : "view-tab"}
            onClick={() => setActiveView("active")}
          >
            Active Todos
            <span className="tab-count">{todos.length}</span>
          </button>

          <button
            type="button"
            className={activeView === "recycle" ? "view-tab active" : "view-tab"}
            onClick={() => setActiveView("recycle")}
          >
            Recycle Bin
            <span className="tab-count">{deletedTodos.length}</span>
          </button>
        </div>

        {activeView === "active" ? (
          <>
            <TodoForm
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              onSubmit={addTodo}
              errors={errors}
              setErrors={setErrors}
            />

            <div className="todo-list">
              {todos.length === 0 && (
                <p className="empty">
                  No todos yet. Add your first task!
                </p>
              )}

              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  editId={editId}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  editDescription={editDescription}
                  setEditDescription={setEditDescription}
                  onStartEdit={startEdit}
                  onCancelEdit={cancelEdit}
                  onUpdate={updateTodo}
                  onToggle={toggleTodo}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          </>
        ) : (
          <RecycleBin
            todos={deletedTodos}
            onRestore={restoreTodo}
            onPermanentDelete={permanentlyDeleteTodo}
            onRestoreAll={restoreAllDeletedTodos}
            onEmptyBin={clearRecycleBin}
          />
        )}
      </div>

      <DeleteModal
        todo={deleteTarget}
        isDeleting={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={confirmDelete}
        title="Move to Recycle Bin?"
        message="This todo will be moved to the Recycle Bin. You can restore it later if needed."
        confirmLabel="Move to Recycle Bin"
      />

      <ToastContainer />
    </div>
  );
}

export default App;
