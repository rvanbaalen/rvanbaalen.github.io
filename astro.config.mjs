import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import posthog from "astro-posthog";

export default defineConfig({
  site: "https://robinvanbaalen.nl",
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
});
