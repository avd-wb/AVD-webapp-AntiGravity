import https from "https";

https.get("https://ik.imagekit.io/dgevdmg7em/AVD/20260519%20AVD%20Photos%20(8).webp?tr=f-jpg,w-1200,h-630,c-at_max,q-80&updatedAt=1779185033992", (res) => {
  console.log("Status Code:", res.statusCode);
  console.log("Content-Type:", res.headers["content-type"]);
  console.log("Content-Length:", res.headers["content-length"]);
});
