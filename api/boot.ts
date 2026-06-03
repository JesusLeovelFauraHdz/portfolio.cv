import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";
import restRoutes from "./rest-routes";
import fs from "fs";
import path from "path";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.get(Paths.oauthCallback, createOAuthCallbackHandler());

// REST API routes
app.route("/api/rest", restRoutes);

// tRPC handler
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

// Static file serving for index.html and cpanel.html
app.get("/", async (c) => {
  const filePath = env.isProduction
    ? path.resolve(process.cwd(), "dist/public", "index.html")
    : path.resolve(process.cwd(), "public", "index.html");
  const content = fs.readFileSync(filePath, "utf-8");
  return c.html(content);
});

app.get("/cpanel", async (c) => {
  const filePath = env.isProduction
    ? path.resolve(process.cwd(), "dist/public", "cpanel.html")
    : path.resolve(process.cwd(), "public", "cpanel.html");
  const content = fs.readFileSync(filePath, "utf-8");
  return c.html(content);
});

app.get("/index.html", async (c) => c.redirect("/"));
app.get("/cpanel.html", async (c) => c.redirect("/cpanel"));

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
