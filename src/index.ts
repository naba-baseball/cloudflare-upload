import {
  createApp,
  eventHandler,
  toWebHandler,
  createRouter,
  lazyEventHandler,
  toWebRequest,
  sendRedirect,
} from "h3";

const router = createRouter().post(
  "/upload",
  lazyEventHandler(() =>
    eventHandler(async (event) => {
      const request = toWebRequest(event);
      try {
        await event.context.ROSTER_BUCKET.put("reports.tar.gz", request.body);
      } catch (err) {
        return sendRedirect(
          event,
          `http://localhost:8000/?message=${encodeURIComponent(
            "error saving file"
          )}`
        );
      }
      //don't await so we can redirect sooner
      fetch(
        "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/eca10840-bf7e-4605-8c8b-026cf8238618",
        {
          method: "POST",
        }
      );
      sendRedirect(
        event,
        `http://localhost:8000/?message=${encodeURIComponent("done!")}`
      );
    })
  )
)

const app = createApp();
app.use(router);
const handler = toWebHandler(app);

export default {
  fetch(request, env, ctx) {
    return handler(request, env);
  },
};
