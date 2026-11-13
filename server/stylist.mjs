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
      upstream = await env.AI.run(env.AI_MODEL, {
        messages: [{ role: "system", content: instructions }, ...input],
        max_tokens: 300,
        stream: true
      });
    } catch (error) {
      console.warn("Workers AI request failed", error.name);
      return fail("AI Stylist is temporarily unavailable. Try again later.");
    }

    const encoder = new TextEncoder();
    const reader = upstream.pipeThrough(new TextDecoderStream()).getReader();
    let cancelled = false;
    return new Response(new ReadableStream({
      async start(controller) {
        const emit = event => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        let pending = "";
        try {
          while (!cancelled) {
            const { value, done } = await reader.read();
            if (done) break;
            pending += value;
            const lines = pending.split("\n");
            pending = lines.pop();
            for (const line of lines) {
              if (!line.startsWith("data:")) continue;
              const data = line.slice(5).trim();
              if (data === "[DONE]") {
                emit({ done: true });
                return;
              }
              const event = JSON.parse(data);
              if (event.error) throw Error("Workers AI stream error");
              const text = event.response ?? event.choices?.[0]?.delta?.content;
              if (typeof text === "string" && text) emit({ text });
            }
          }
          if (!cancelled) throw Error("Workers AI stream ended early");
        } catch {
          if (!cancelled) emit({ error: "AI Stylist couldn’t finish the reply. Please try again." });
        } finally {
          reader.cancel().catch(() => {});
          if (!cancelled) controller.close();
        }
      },
      cancel() {
        cancelled = true;
        return reader.cancel();
      }
    }), { headers });
  }
};
