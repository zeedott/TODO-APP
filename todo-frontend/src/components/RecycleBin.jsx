function RecycleBin({
  todos,
  onRestore,
  onPermanentDelete,
  onRestoreAll,
  onEmptyBin,
}) {
  const hasTodos = todos.length > 0;

  return (
    <div className="recycle-bin">
      <div className="recycle-header">
        <div>
          <h2>Recycle Bin</h2>
          <p>
            {todos.length} deleted todo{todos.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="recycle-actions">
          <button
            type="button"
            className="restore-all-btn"
            onClick={onRestoreAll}
            disabled={!hasTodos}
          >
            Restore All
          </button>

          <button
            type="button"
            className="empty-bin-btn"
            onClick={onEmptyBin}
            disabled={!hasTodos}
          >
            Empty Recycle Bin
          </button>
        </div>
      </div>

      {!hasTodos ? (
        <p className="empty">Recycle Bin is empty. Deleted todos will appear here.</p>
      ) : (
        <div className="recycle-list">
          {todos.map((todo) => (
            <div key={todo.id} className="recycle-card">
              <div className="todo-content">
                <div className="todo-top">
                  <h3>{todo.title}</h3>

                  <span
                    className={`status ${todo.completed ? "completed" : "pending"}`}
                  >
                    {todo.completed ? "Completed" : "Pending"}
                  </span>
                </div>

                <p className="description">{todo.description}</p>

                <p className="recycle-meta">
                  Deleted: {new Date(todo.deletedAt).toLocaleString()}
                </p>
              </div>

              <div className="recycle-item-actions">
                <button
                  type="button"
                  className="restore-btn"
                  onClick={() => onRestore(todo.id)}
                >
                  Restore
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => onPermanentDelete(todo.id)}
                >
                  Permanent Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecycleBin;
