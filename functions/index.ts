import vhtml from "vhtml";
import htm from "htm";
const html = htm.bind(vhtml);
import type { PagesFunction, R2Bucket } from "@cloudflare/workers-types";
import { executeDiscordWebhook } from "../utils/execute-discord-webhook.js";
interface Env {
  ROSTER_BUCKET: R2Bucket;
  DEPLOY_URL: string;
  USERNAME: string;
  PASSWORD: string;
  DISCORD_WEBHOOK: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const data = await request.formData();
  const file = data.get("file") as File;
  try {
    executeDiscordWebhook(
      env.DISCORD_WEBHOOK,
      "Report file upload in progress."
    );
    await env.ROSTER_BUCKET.put("reports.tar.gz", file.stream());
  } catch (err) {
    executeDiscordWebhook(
      env.DISCORD_WEBHOOK,
      "Report file failed to upload :("
    );
    return new Response(null, {
      status: 301,
      headers: {
        Location: `${request.url}?message=${encodeURIComponent(
          "error saving file"
        )}`,
      },
    });
  }
  executeDiscordWebhook(
    env.DISCORD_WEBHOOK,
    "Report file successfully uploaded!"
  );
  //don't await so we can redirect sooner
  fetch(env.DEPLOY_URL, {
    method: "POST",
  });
  return new Response(null, {
    status: 301,
    headers: {
      Location: `${request.url}?message=${encodeURIComponent("Done!")}`,
    },
  });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const unauthorizedResponse = new Response("401", {
    status: 401,
    headers: {
      "content-type": "text/html",
      "WWW-Authenticate": "Basic",
      Vary: "Accept-Encoding",
    },
  });
  const authorization = context.request.headers.get("Authorization");
  if (!authorization) {
    return unauthorizedResponse;
  }
  const [username, password] = atob(authorization.split(" ")[1]).split(":");
  if (username !== context.env.USERNAME || password !== context.env.PASSWORD) {
    return unauthorizedResponse;
  }
  return new Response(renderUploadPage(), {
    status: 200,
    headers: {
      "content-type": "text/html",
      Vary: "Accept-Encoding",
    },
  });
};

function renderUploadPage() {
  return (
    "<!DOCTYPE html>" +
    html`
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Upload</title>
          <link href="/styles.css" rel="stylesheet" />
          <script src="/upload.js" type="module"></script>
        </head>

        <body class="u-container">
          <form
            name="upload"
            class="stack"
            method="POST"
            enctype="multipart/form-data"
          >
            <div class="stack">
              <h1>Upload the reports file here.</h1>
              <p>It might take several minutes</p>
              <label>
                File
                <input name="file" type="file" />
                <div id="file_preview"></div>
              </label>
            </div>
            <button name="upload_button" class="fit-content">Upload</button>
          </form>
        </body>
      </html>
    `
  );
}
