let app = null;

export default async function handler(req, res) {
  if (!app) {
    try {
      // Dynamically import the pre-compiled production build of server.ts
      const serverModule = await import("../dist/server.cjs");
      app = serverModule.app;
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "Failed to dynamically import compiled server.cjs at runtime",
        message: err.message,
        stack: err.stack
      });
    }
  }

  return app(req, res);
}
