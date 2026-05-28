let app = null;
let initError = null;

export default async function handler(req, res) {
  if (initError) {
    return res.status(500).json({
      success: false,
      error: "Initialization error cached from previous load",
      message: initError.message,
      stack: initError.stack
    });
  }

  if (!app) {
    try {
      // Dynamically import server.ts
      const serverModule = await import("../server");
      app = serverModule.app;
    } catch (err) {
      initError = err;
      return res.status(500).json({
        success: false,
        error: "Failed to dynamically import server.ts at runtime",
        message: err.message,
        stack: err.stack
      });
    }
  }

  return app(req, res);
}
