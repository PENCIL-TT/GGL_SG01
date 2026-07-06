// Vercel serverless entry point. Wraps the existing Express app (server.cjs)
// so it runs as a function instead of a standalone always-on process.
// vercel.json rewrites /api/* and /uploads/* here.
module.exports = require('../server.cjs');
