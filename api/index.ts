import express from "express";

const app = express();

app.all("*", async (req: any, res: any) => {
  try {
    const server = await import("../server.js");
    return server.app(req, res);
  } catch (err: any) {
    res.status(500).json({
      error: "BOOT_CRASH",
      message: err.message,
      stack: err.stack ? err.stack.split("\n") : []
    });
  }
});

export default app;
