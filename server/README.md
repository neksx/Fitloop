# Fitloop Stylist backend

Deploy this Worker from this directory with `npx wrangler deploy`. Set the OpenAI
project key using `npx wrangler secret put OPENAI_API_KEY` and enter it at the
prompt. Set a project usage limit for the public demo.

After deployment, add the Worker URL ending in `/api/stylist` to the site head:

```html
<meta name="fitloop-stylist-api" content="https://YOUR-WORKER.workers.dev/api/stylist">
```

The Worker accepts the GitHub Pages origin in wrangler.toml and rate-limits each
IP. Without the meta tag the chat displays its coming-soon state.
