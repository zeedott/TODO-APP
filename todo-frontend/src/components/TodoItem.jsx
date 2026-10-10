
function TodoItem({
    todo,
    editId,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    onStartEdit,
    onCancelEdit,
    onUpdate,
    onToggle,
    onDelete,
}) {
    const isEditing = editId === todo.id;
    const hasChanges =
        editTitle !== todo.title ||
        editDescription !== todo.description;

    return (
        <div
            className={`todo-card ${todo.completed ? "todo-completed" : ""
                }`}
        >
            {isEditing ? (
                <div className="edit-box">
                    <label className="req-text">
                        Edit Title:
                        <input
                            className="edit-form"
                            value={editTitle}
                            placeholder="Edit Your Title."
                            onChange={(e) => setEditTitle(e.target.value)}
                        />
                    </label>

                    <label className="req-text">
                        Edit Description:
                        <input
                            className="edit-form"
                            value={editDescription}
                            placeholder="Edit Your Description."
                            onChange={(e) =>
                                setEditDescription(e.target.value)
                            }
                        />
                    </label>

                    <div className="edit-actions">
                        <button
                            type="button"
                            className="save-btn"
                            onClick={() => onUpdate(todo.id)}
                            disabled={!hasChanges}
                        >
                            Save
                        </button>

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onCancelEdit}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="todo-content">
                        <div className="todo-top">
                            <h3>{todo.title}</h3>

                            <span
                                className={`status ${todo.completed ? "completed" : "pending"
                                    }`}
                            >
                                {todo.completed ? "Completed" : "Pending"}
                            </span>
                        </div>

                        <p className="description">{todo.description}</p>
                    </div>

                    <div className="todo-actions">
                        <label className="completion-control">
                            <input
                                type="checkbox"
                                className="complete-checkbox"
                                checked={Boolean(todo.completed)}
                                disabled={Boolean(todo.completed)}
                                onChange={() => onToggle(todo)}
                            />
                            <span>
                                {todo.completed ? "Completed" : "Mark as completed"}
                            </span>
                        </label>

                        <button
                            type="button"
                            className="update-btn"
                            onClick={() => onStartEdit(todo)}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                width="20"
                                height="20"
                            >
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                            </svg>
                            Edit
                        </button>

                        <button
                            type="button"
                            className="delete-btn"
                            onClick={() => onDelete(todo)}
                        >
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default TodoItem;
