export async function apiFetch(path: string, options: RequestInit = {}) {
  const base =
    (process.env.NEXT_PUBLIC_API_BASE_URL &&
      process.env.NEXT_PUBLIC_API_BASE_URL.trim()) ||
    "https://king-prawn-app-nv72k.ondigitalocean.app";
  const baseUrl = base.replace(/\/$/, "");
  const url = path.startsWith("/") ? `${baseUrl}${path}` : `${baseUrl}/${path}`;

  // Attach Authorization header automatically if token exists and header not already provided
  try {
    const token = localStorage.getItem("auth_token");
    if (token) {
      options.headers = Object.assign({}, options.headers || {}, {
        Authorization: `Bearer ${token}`,
      });
    }
  } catch (e) {
    // ignore localStorage access errors
  }

  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") || "";

  // If response is JSON parse it, otherwise return text for better error messages
  if (contentType.includes("application/json")) {
    const data = await res.json();
    if (!res.ok) {
      const err: any = new Error(
        `${data?.message || `Request failed with status ${res.status}`} (${res.status})`,
      );
      err.status = res.status;
      err.data = data;
      err.url = url;
      throw err;
    }
    return data;
  }

  const text = await res.text();
  if (!res.ok) {
    const err: any = new Error(
      `${text || `Request failed with status ${res.status}`} (${res.status})`,
    );
    err.status = res.status;
    err.text = text;
    err.url = url;
    throw err;
  }

  // Non-JSON success response
  return text;
}
