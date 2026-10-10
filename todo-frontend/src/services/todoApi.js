
const API_URL = "http://localhost:5000/todos";

async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    let message = "";

    try {
      const body = await response.json();
      message = body?.message;
    } catch {
      // Use the status-based fallback when the server doesn't return JSON.
    }

    const fallbackMessage = response.status === 400
      ? "The request is invalid. Please check your input."
      : `Request failed: ${response.status}`;
    const error = new Error(message || fallbackMessage);
    error.status = response.status;
    throw error;
  }

  return response;
}

export async function getTodos() {
  const response = await request(API_URL);
  return response.json();
}

export async function getDeletedTodos() {
  const response = await request(`${API_URL}/deleted`);
  return response.json();
}

export async function addTodo(data) {
  return request(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function updateTodo(id, data) {
  return request(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function deleteTodo(id) {
  return request(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}

export async function restoreTodo(id) {
  return request(`${API_URL}/${id}/restore`, {
    method: "PATCH",
  });
}

export async function permanentlyDeleteTodo(id) {
  return request(`${API_URL}/${id}/permanent`, {
    method: "DELETE",
  });
}

export async function restoreAllDeletedTodos() {
  return request(`${API_URL}/deleted/restore-all`, {
    method: "PATCH",
  });
}

export async function clearDeletedTodos() {
  return request(`${API_URL}/deleted`, {
    method: "DELETE",
  });
}
