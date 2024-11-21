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

    const response = await fetch(`http://localhost:8080/api/${url}`, options);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error(error);
    return null;
  }
}
