import { type PagesFunction } from "@cloudflare/workers-types";

interface Env {
  DISCORD_WEBHOOK: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  await fetch(context.env.DISCORD_WEBHOOK, {
    method: "POST",
    body: JSON.stringify({
      content: "Report file upload in progress. If @Wolfe is doing it, it could take a few years.",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return new Response("OK", { status: 200 });
};
