import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

export const RouteHandlerConfig = {
  callbackUrl: "http://localhost:3000/api/uploadthing",
  uploadthingId: process.env.UPLOADTHING_APP_ID,
  uploadthingSecret: process.env.UPLOADTHING_SECRET,
};

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: RouteHandlerConfig,
});
