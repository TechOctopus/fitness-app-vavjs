export async function api(url, method = "GET", data = {}) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (method !== "GET") {
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
  }
}
