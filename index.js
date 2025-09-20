export default {
  async fetch(request) {
    const url = new URL(request.url)
    const target = url.searchParams.get("url")

    if (!target) {
      return new Response("Missing ?url=", { status: 400 })
    }

    const fingerprint = url.searchParams.get("fp") || "anonymous"
    const badge = url.searchParams.get("badge") || "none"

    const res = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (InterstellarProxy)",
        "X-Forwarded-For": "127.0.0.1",
        "X-Fingerprint": fingerprint,
        "X-Badge": badge
      }
    })

    const cloned = new Response(await res.text(), res)
    cloned.headers.set("X-Proxied-By", "Interstellar Proxy")
    return cloned
  }
}
