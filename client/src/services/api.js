export async function api(url, method = "GET", data = {}) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const token = localStorage.getItem("token");
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    if (method !== "GET" && method !== "DELETE") {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`http://localhost:3333/${url}`, options);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
