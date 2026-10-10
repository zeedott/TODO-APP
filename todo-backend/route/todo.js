
import express from "express";

const route = express.Router();

let todo_data = [
  {
    id: 1,
    title: "Learning Backend",
    description: "Learning Express CRUD",
    completed: false,
    deletedAt: null,
  },
];

function getTodosByVisibility(includeDeleted = false) {
  return todo_data.filter((todo) => includeDeleted || !todo.deletedAt);
}

function getTodoById(id) {
  return todo_data.find((todo) => todo.id === id);
}

// GET - All active todos
route.get("/todos", function (req, res) {
  const includeDeleted = req.query.includeDeleted === "true" || req.query.all === "true";
  res.json(getTodosByVisibility(includeDeleted));
});

// GET - Deleted todos
route.get("/todos/deleted", function (req, res) {
  res.json(todo_data.filter((todo) => Boolean(todo.deletedAt)));
});

// RESTORE ALL - Move every deleted todo back to active list
route.patch("/todos/deleted/restore-all", function (req, res) {
  const restoredTodos = todo_data.filter((todo) => Boolean(todo.deletedAt));

  restoredTodos.forEach((todo) => {
    todo.deletedAt = null;
  });

  res.json({
    message: "All deleted todos restored successfully.",
    restoredTodos,
  });
});

// DELETE ALL - Permanently remove every todo from Recycle Bin
route.delete("/todos/deleted", function (req, res) {
  const deletedTodos = todo_data.filter((todo) => Boolean(todo.deletedAt));

  todo_data = todo_data.filter((todo) => !todo.deletedAt);

  res.json({
    message: "Recycle Bin emptied successfully.",
    deletedTodos,
  });
});

// GET - Single Todo
route.get("/todos/:id", function (req, res) {
  const id = Number(req.params.id);

  const todo = getTodoById(id);

  if (!todo) {
    return res.status(404).json({
      message: "Todo Not Found",
    });
  }

  res.json(todo);
});

// POST - Create Todo
route.post("/todos", function (req, res) {
  const { title, description } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  if (typeof description !== "string" || !description.trim()) {
    return res.status(400).json({
      message: "Description is required",
    });
  }

  if (title.length > 200) {
    return res.status(400).json({
      message: "Title cannot exceed 200 characters.",
    });
  }

  if (description.length > 10000) {
    return res.status(400).json({
      message: "Description cannot exceed 10,000 characters.",
    });
  }

  const newTodo = {
    id: Date.now(),
    title: title.trim(),
    description: description.trim(),
    completed: false,
    deletedAt: null,
  };

  todo_data.push(newTodo);

  res.status(201).json({
    message: "Todo Created Successfully",
    todo: newTodo,
  });
});

// PUT - Update Todo
route.put("/todos/:id", function (req, res) {
  const id = Number(req.params.id);

  const todo = getTodoById(id);

  if (!todo) {
    return res.status(404).json({
      message: "Todo Not Found",
    });
  }

  const { title, description, completed } = req.body;

  if (typeof title === "string" && title.length > 200) {
    return res.status(400).json({
      message: "Title cannot exceed 200 characters.",
    });
  }

  if (typeof description === "string" && description.length > 10000) {
    return res.status(400).json({
      message: "Description cannot exceed 10,000 characters.",
    });
  }

  if (title !== undefined) {
    todo.title = title;
  }

  if (description !== undefined) {
    todo.description = description;
  }

  if (completed !== undefined) {
    todo.completed = completed;
  }

  res.json({
    message: "Todo Updated Successfully",
    todo: todo,
  });
});

// SOFT DELETE - Move todo to Recycle Bin
route.delete("/todos/:id", function (req, res) {
  const id = Number(req.params.id);

  const todo = getTodoById(id);

  if (!todo) {
    return res.status(404).json({
      message: "Todo Not Found",
    });
  }

  todo.deletedAt = new Date().toISOString();

  res.json({
    message: "Task moved to Recycle Bin successfully.",
    todo,
  });
});

// RESTORE - Move todo back to active list
route.patch("/todos/:id/restore", function (req, res) {
  const id = Number(req.params.id);

  const todo = getTodoById(id);

  if (!todo) {
    return res.status(404).json({
      message: "Todo Not Found",
    });
  }

  todo.deletedAt = null;

  res.json({
    message: "Todo Restored Successfully",
    todo,
  });
});

// PERMANENT DELETE - Remove single todo from Recycle Bin
route.delete("/todos/:id/permanent", function (req, res) {
  const id = Number(req.params.id);

  const todoIndex = todo_data.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({
      message: "Todo Not Found",
    });
  }

  const [removedTodo] = todo_data.splice(todoIndex, 1);

  res.json({
    message: "Todo permanently deleted.",
    todo: removedTodo,
  });
});

export default route;
