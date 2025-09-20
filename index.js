import { rewriteHTML } from './rewrite/html.js'
import { encodeURL } from './lib/encode.js'
import config from './uv.config.js'

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const target = url.searchParams.get("url")
    const fingerprint = url.searchParams.get("fp") || "anonymous"
    const badge = url.searchParams.get("badge") || "none"

    if (!target) return new Response("Missing ?url=", { status: 400 })

    const res = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (InterstellarProxy)",
        "X-Fingerprint": fingerprint,
        "X-Badge": badge
      }
    })

    let body = await res.text()

    if (res.headers.get("content-type")?.includes("text/html")) {
      body = rewriteHTML(body, target, config)
    }

    const response = new Response(body, res)
    response.headers.set("X-Proxied-By", "Interstellar Proxy")
    return response
  }
}
