// Vercel serverless function entry point.
// Re-uses the same Express app defined in server.ts so that the API
// behaviour is identical to local development. Vercel routes any
// request to /api/* here automatically.

import { createApp } from "../server";

export default createApp();
