import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import posthog from "astro-posthog";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://robinvanbaalen.nl",

  redirects: {
    "/curacao-election-2025": "https://curacao-election-2025.robinvanbaalen.nl",
    "/debt-tracker": "https://debt-tracker.robinvanbaalen.nl",
    "/domjs": "https://domjs.robinvanbaalen.nl",
    "/eslint-config": "https://eslint-config.robinvanbaalen.nl",
    "/flow-invoice": "https://flow-invoice.robinvanbaalen.nl",
    "/hashparser": "https://hashparser.robinvanbaalen.nl",
    "/json-beautify": "https://json-beautify.robinvanbaalen.nl",
    "/readme-to-html": "https://readme-to-html.robinvanbaalen.nl",
    "/revenue-forecast": "https://revenue-forecast.robinvanbaalen.nl",
    "/runner-manager": "https://runner-manager.robinvanbaalen.nl",
    "/source-to-llm": "https://source-to-llm.robinvanbaalen.nl",
    "/transitionjs": "https://transitionjs.robinvanbaalen.nl",
  },

  integrations: [
    mdx(),
    sitemap(),
    ...(process.env.POSTHOG_TOKEN
      ? [
          posthog({
            apiKey: process.env.POSTHOG_TOKEN,
            apiHost: "https://eu.i.posthog.com",
          }),
        ]
      : []),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare()
});