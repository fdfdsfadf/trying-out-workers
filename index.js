export default {
  async fetch(request) {
    const url = new URL(request.url)
    const target = url.searchParams.get("url")
    const fingerprint = url.searchParams.get("fp") || "anonymous"
    const badge = url.searchParams.get("badge") || "none"

    if (!target) {
      return new Response("Missing ?url=", { status: 400 })
    }

    const res = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (InterstellarProxy)",
        "X-Fingerprint": fingerprint,
        "X-Badge": badge
      }
    })

    let body = await res.text()

    // Optional: inject badge overlay
    if (res.headers.get("content-type")?.includes("text/html")) {
      body = body.replace("</body>", `<div style="position:fixed;bottom:10px;right:10px;background:#000;color:#fff;padding:5px;">Badge: ${badge}</div></body>`)
    }

    const response = new Response(body, res)
    response.headers.set("X-Proxied-By", "Interstellar Proxy")
    return response
  }
}
