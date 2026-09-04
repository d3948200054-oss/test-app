// Vercel serverless catch-all function.
// Re-uses the same Express app defined in api/_app.ts so that the
// API behaviour is identical to local development. The route is
// /api/* because the file is named [...slug].ts.

import { createApp } from "./_app";

export default createApp();
