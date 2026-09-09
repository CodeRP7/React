import axios from "axios";

const localStorageKey = "react-todo-list.todos";
const configuredBaseUrl = import.meta.env.VITE_MOCKAPI_BASE_URL;
const useLocalStorage =
  !configuredBaseUrl || configuredBaseUrl === "your-mockapi-base-url";

const http = axios.create({
  baseURL: configuredBaseUrl,
  headers: { "content-type": "application/json" },
  timeout: 5000,
});

http.interceptors.response.use(({ data }) => data);

function readLocalTodos() {
  return JSON.parse(localStorage.getItem(localStorageKey) || "[]");
}

function writeLocalTodos(todos) {
  localStorage.setItem(localStorageKey, JSON.stringify(todos));
}

function filterLocalTodos(todos, params) {
  return todos.filter((todo) => {
    const matchesCompleted =
      params.completed === "" || todo.completed === params.completed;
    const matchesPriority =
      params.priority === "" || todo.priority === params.priority;

    return matchesCompleted && matchesPriority;
  });
}

export const api = {
  todos: {
    getAll(params = {}) {
      if (useLocalStorage) {
        return Promise.resolve(filterLocalTodos(readLocalTodos(), params));
      }

      return http
        .get("todos", { params })
        .then((data) => {
          if (!Array.isArray(data)) {
            throw new Error("Todo API returned an invalid response.");
          }

          return data;
        })
        .catch((error) =>
          error?.response?.status === 404 ? [] : Promise.reject(error)
        );
    },

    create(data) {
      if (useLocalStorage) {
        const todos = readLocalTodos();
        const todo = { ...data, id: crypto.randomUUID() };
        writeLocalTodos([...todos, todo]);
        return Promise.resolve(todo);
      }

      return http.post("todos", data);
    },

    update(id, data) {
      if (useLocalStorage) {
        const todos = readLocalTodos().map((todo) =>
          todo.id === id ? { ...data, id } : todo
        );
        writeLocalTodos(todos);
        return Promise.resolve(data);
      }

      return http.put(`todos/${id}`, data);
    },

    delete(id) {
      if (useLocalStorage) {
        writeLocalTodos(readLocalTodos().filter((todo) => todo.id !== id));
        return Promise.resolve();
      }

      return http.delete(`todos/${id}`);
    },
  },
};
