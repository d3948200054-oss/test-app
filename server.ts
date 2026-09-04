// Local development / local production server.
// All API route definitions live in api/_app.ts so the Vercel
// serverless function (api/[...slug].ts) can bundle the same code
// without dragging the Vite dev middleware into the serverless bundle.

import express from "express";
import path from "path";
import { createApp } from "./api/_app";

async function startServer() {
  const app = createApp();
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    // Dev: hand the Express app to Vite as middleware so HMR works.
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Local prod: serve the built SPA from dist/ and fall back to
    // index.html for client-side routes.
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ExamPulse & AI Study Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
