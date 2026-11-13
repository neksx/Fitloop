# Fitloop Stylist backend

Deploy this Worker with `npx wrangler deploy` from this directory. The Workers
AI binding supplies Llama 3.3 and requires no OpenAI credentials. Keep the
account on Workers Free for a test that stops at the daily free allocation.

The site reads the Worker URL (ending in `/api/stylist`) from the
`fitloop-stylist-api` meta tag. The Worker accepts the configured GitHub Pages
origin and rate-limits each IP.
