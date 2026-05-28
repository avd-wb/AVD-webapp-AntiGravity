let app: any = null;

export default async function handler(req: any, res: any) {
  if (!app) {
    try {
      const serverModule = await import("../server");
      app = serverModule.app;
    } catch (err: any) {
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
