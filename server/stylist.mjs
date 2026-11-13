const instructions = [
  "You are Fitloop's fashion stylist. Reply in the user's language, naturally and concisely.",
  "Answer the actual question with practical outfit advice, in plain text.",
  "You cannot access their wardrobe, open links, check stock, save looks or perform virtual try-ons.",
  "Ask for garment details where needed and never invent product or inventory details."
].join(" ");

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname !== "/api/stylist") return new Response(null, { status: 404 });
    if (request.headers.get("Origin") !== env.SITE_ORIGIN) return new Response(null, { status: 403 });
    const headers = {
      "Access-Control-Allow-Origin": env.SITE_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
      Vary: "Origin"
    };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return new Response(null, { status: 405, headers });

    headers["Content-Type"] = "application/x-ndjson; charset=utf-8";
    const fail = error => new Response(JSON.stringify({ error }) + "\n", { headers });
    if (!env.OPENAI_API_KEY) return fail("AI Stylist is not configured yet.");
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const { success } = await env.CHAT_LIMIT.limit({ key: ip });
    if (!success) return fail("Too many messages. Try again in a minute.");

    let input;
    try {
      const reader = request.body.getReader();
      const decoder = new TextDecoder();
      let size = 0;
      let body = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 64000) {
          await reader.cancel();
          return fail("That conversation is too long.");
        }
        body += decoder.decode(value, { stream: true });
      }
      input = JSON.parse(body + decoder.decode());
      if (!Array.isArray(input) || !input.length || input.length > 16 ||
          input.at(-1)?.role !== "user" ||
          input.some(item => !item || !["user", "assistant"].includes(item.role) ||
            typeof item.content !== "string" || item.content.length > 4000)) throw Error();
      input = input.map(({ role, content }) => ({ role, content }));
    } catch {
      return fail("That message could not be read.");
    }

    let upstream;
    try {
      upstream = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { Authorization: "Bearer " + env.OPENAI_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: env.OPENAI_MODEL, instructions, input, stream: true, store: false, max_output_tokens: 500
        }),
        signal: AbortSignal.timeout(40000)
      });
    } catch {
      return fail("AI Stylist couldn’t connect. Try again in a moment.");
    }
    if (!upstream.ok || !upstream.body) return fail("AI Stylist couldn’t reply. Try again in a moment.");

    const encoder = new TextEncoder();
    const reader = upstream.body.pipeThrough(new TextDecoderStream()).getReader();
    return new Response(new ReadableStream({
      async start(controller) {
        const emit = event => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        let pending = "";
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            pending += value;
            const lines = pending.split("\n");
            pending = lines.pop();
            for (const line of lines) {
              if (!line.startsWith("data:")) continue;
              const data = line.slice(5).trim();
              if (data === "[DONE]") continue;
              const event = JSON.parse(data);
              if (["response.output_text.delta", "response.refusal.delta"].includes(event.type)) emit({ text: event.delta });
              if (["response.completed", "response.incomplete"].includes(event.type)) {
                emit({ done: true });
                return;
              }
              if (["error", "response.failed"].includes(event.type)) throw Error();
            }
          }
          throw Error();
        } catch {
          emit({ error: "AI Stylist couldn’t finish the reply. Please try again." });
        } finally {
          reader.cancel().catch(() => {});
          controller.close();
        }
      },
      cancel() { return reader.cancel(); }
    }), { headers });
  }
};
