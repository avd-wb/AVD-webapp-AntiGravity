export default async function handler(req, res) {
  try {
    res.status(200).json({
      status: "pure-js-ok",
      timestamp: new Date().toISOString(),
      env: {
        VERCEL: process.env.VERCEL || "not-set",
        NODE_ENV: process.env.NODE_ENV || "not-set"
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
