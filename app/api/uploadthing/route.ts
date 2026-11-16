import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

const appUrl = (
  process.env.UPLOADTHING_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  ""
).replace(/\/+$/, "");

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    // Atrás do nginx o servidor vê "http://localhost:3000"; o UploadThing
    // precisa do URL público para enviar o callback de conclusão do upload.
    ...(appUrl && { callbackUrl: `${appUrl}/api/uploadthing` }),
  },
});
