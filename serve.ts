/**
 * Deno Deploy entry point for the Happie Angular SPA.
 *
 * Serves static files from the deployment root. Any path that does not
 * match a real file falls back to index.html so Angular's client-side
 * router can handle it (e.g. direct navigation to /shopping).
 */
import { serveDir } from "jsr:@std/http/file-server";

Deno.serve((req: Request) => {
  return serveDir(req, { fsRoot: ".", quiet: true }).then((res) => {
    if (res.status === 404) {
      return new Response(Deno.readTextFileSync("./index.html"), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    return res;
  });
});
