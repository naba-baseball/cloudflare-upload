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
      await event.context.ROSTER_BUCKET.put("reports.tar.gz", request.body);
      return sendRedirect(event, "http://localhost:8000/");
    })
  )
);


const app = createApp();
app.use(router);
const handler = toWebHandler(app);

export default {
  fetch(request, env, ctx) {
    return handler(request, env);
  },
};
