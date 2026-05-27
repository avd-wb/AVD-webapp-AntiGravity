let app: any;
try {
  const server = await import("../server");
  app = server.app;
} catch (err: any) {
  const express = (await import("express")).default;
  app = express();
  app.all("*", (req: any, res: any) => {
    res.status(500).json({ 
      error: "BOOT_CRASH", 
      message: err.message, 
      stack: err.stack ? err.stack.split("\n") : []
    });
  });
}
export default app;
