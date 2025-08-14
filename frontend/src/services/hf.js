export async function classifyImage(file) {
  const token = import.meta.env.VITE_HF_TOKEN;
  if (!token) throw new Error("Missing Hugging Face token. Set VITE_HF_TOKEN in your .env.");

  const endpoint = "https://api-inference.huggingface.co/models/microsoft/resnet-50";
  const body = await file.arrayBuffer();

  let res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/octet-stream",
    },
    body,
  });


  if (res.status === 503) {
    await new Promise(r => setTimeout(r, 2500));
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/octet-stream",
      },
      body,
    });
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HF API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)) : [];
}

