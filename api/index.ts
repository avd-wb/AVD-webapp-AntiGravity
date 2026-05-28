let app: any = null;
let initError: any = null;

export default async function handler(req: any, res: any) {
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
      const serverModule = await import("../server");
      app = serverModule.app;
    } catch (err: any) {
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
