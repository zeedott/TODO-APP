
function TodoForm({
    title,
    setTitle,
    description,
    setDescription,
    onSubmit,
    errors,
    setErrors,
}) {
    return (
        <form className="todo-form" onSubmit={onSubmit} noValidate>
            <div className="form-field">
                <span className="req-text">
                    Add Title<span className="required-star">*</span>
                </span>
                <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={title}
                    maxLength={200}
                    className={errors.title ? "input-error" : ""}
                    onChange={(e) => {
                        setTitle(e.target.value);

                        if (e.target.value.trim()) {
                            setErrors((prev) => ({ ...prev, title: "" }));
                        }
                    }}
                />

                <p className="field-error" aria-live="polite">
                    {errors.title}
                </p>
                <p className="character-counter">
                    {title.length.toLocaleString()} / 200 characters
                </p>
            </div>

            <div className="form-field">
                <span className="req-text">
                    Add Description<span className="required-star">*</span>
                </span>
                <input
                    type="text"
                    className={errors.description ? "input-error" : ""}
                    placeholder="Add a description..."
                    value={description}
                    maxLength={10000}
                    onChange={(e) => {
                        setDescription(e.target.value);

                        if (e.target.value.trim()) {
                            setErrors((prev) => ({
                                ...prev,
                                description: "",
                            }));
                        }
                    }}
                />

                <p className="field-error" aria-live="polite">
                    {errors.description}
                </p>
                <p className="character-counter">
                    {description.length.toLocaleString()} / 10,000 characters
                </p>
            </div>

            <button className="add-btn" type="submit">
                + Add Todo
            </button>
        </form>
    );
}

export default TodoForm;
